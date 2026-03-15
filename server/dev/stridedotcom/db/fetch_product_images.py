#!/usr/bin/env python3
"""
Stride Product Image Fetcher
-----------------------------
Reads product names + brands directly from the local MariaDB stridedb,
then downloads matching images from the Pexels API into:
  src/main/resources/seed-images/<product_id>_<safe_name>.jpg

Usage:
  1. pip install requests mysql-connector-python
  2. Set PEXELS_API_KEY env var (free key at https://www.pexels.com/api/)
  3. Run: python db/fetch_product_images.py

The script is idempotent — it skips products that already have a file.
"""

import os
import re
import sys
import time
import requests
import mysql.connector

# ── Config ──────────────────────────────────────────────────────────────────
DB_CONFIG = {
    "host": "localhost",
    "port": 3306,
    "user": os.environ.get("DB_USERNAME", "stride_dev"),
    "password": os.environ.get("DB_PASSWORD", "57R1D3_RULZ"),
    "database": "stridedb",
}

PEXELS_API_KEY = os.environ.get("PEXELS_API_KEY", "")
PEXELS_SEARCH_URL = "https://api.pexels.com/v1/search"

# Output directory (relative to this script → repo root)
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
OUTPUT_DIR = os.path.join(
    SCRIPT_DIR,
    "..", "src", "main", "resources", "seed-images"
)

ORIENTATION = "portrait"   # portrait works well for product cards
PER_PAGE    = 3            # fetch top 3 results, pick best
DELAY_SEC   = 0.5          # be polite to the API


# ── Helpers ──────────────────────────────────────────────────────────────────
def safe_filename(text: str) -> str:
    """Lowercase, replace spaces/special chars with underscores."""
    return re.sub(r"[^a-z0-9]+", "_", text.lower()).strip("_")


def build_search_query(name: str, brand: str) -> str:
    """Craft a focused search query for a luxury product image."""
    # e.g. "Rolex Submariner luxury watch product photo"
    category_hints = {
        "bag": "handbag luxury fashion",
        "handbag": "handbag luxury fashion",
        "sneaker": "sneakers shoe fashion",
        "trainer": "sneakers shoe fashion",
        "slides": "slides sandal shoe",
        "watch": "luxury watch wristwatch",
        "tote": "tote bag luxury fashion",
        "clutch": "clutch bag luxury",
    }
    hint = ""
    combined = (name + " " + brand).lower()
    for kw, h in category_hints.items():
        if kw in combined:
            hint = h
            break
    if not hint:
        hint = "luxury fashion product"
    return f"{brand} {name} {hint}"


def fetch_image_url(query: str) -> str | None:
    """Return the URL of the best matching Pexels photo."""
    if not PEXELS_API_KEY:
        print("  ⚠️  PEXELS_API_KEY not set — skipping download.")
        return None
    headers = {"Authorization": PEXELS_API_KEY}
    params  = {"query": query, "per_page": PER_PAGE, "orientation": ORIENTATION}
    try:
        resp = requests.get(PEXELS_SEARCH_URL, headers=headers, params=params, timeout=10)
        resp.raise_for_status()
        photos = resp.json().get("photos", [])
        if not photos:
            print(f"  ⚠️  No results for: '{query}'")
            return None
        # Prefer 'large' size (~940×1250px); fall back to 'original'
        return photos[0]["src"].get("large", photos[0]["src"]["original"])
    except requests.RequestException as e:
        print(f"  ❌  Pexels request failed: {e}")
        return None


def download_image(url: str, dest_path: str) -> bool:
    """Stream-download an image to dest_path. Returns True on success."""
    try:
        resp = requests.get(url, stream=True, timeout=30)
        resp.raise_for_status()
        with open(dest_path, "wb") as f:
            for chunk in resp.iter_content(chunk_size=8192):
                f.write(chunk)
        size_kb = os.path.getsize(dest_path) // 1024
        print(f"  ✅  Saved {size_kb} KB → {os.path.basename(dest_path)}")
        return True
    except Exception as e:
        print(f"  ❌  Download failed: {e}")
        if os.path.exists(dest_path):
            os.remove(dest_path)
        return False


# ── Main ─────────────────────────────────────────────────────────────────────
def main():
    if not PEXELS_API_KEY:
        print(
            "ERROR: Set the PEXELS_API_KEY environment variable.\n"
            "  Get a free key at https://www.pexels.com/api/\n"
            "  Then run:  $env:PEXELS_API_KEY='YOUR_KEY' ; python db/fetch_product_images.py"
        )
        sys.exit(1)

    os.makedirs(OUTPUT_DIR, exist_ok=True)
    print(f"📁  Output directory: {OUTPUT_DIR}\n")

    # ── Connect to DB ──────────────────────────────────────────────────────
    print("🔌  Connecting to MariaDB…")
    try:
        conn   = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor(dictionary=True)
    except mysql.connector.Error as e:
        print(f"❌  DB connection failed: {e}")
        sys.exit(1)

    cursor.execute("SELECT id, name, brand, description FROM product ORDER BY id")
    products = cursor.fetchall()
    cursor.close()
    conn.close()

    print(f"📦  Found {len(products)} products in stridedb.\n")

    skipped = 0
    fetched = 0
    failed  = 0

    for p in products:
        pid   = p["id"]
        name  = p["name"]
        brand = p["brand"]
        fname = f"{pid}_{safe_filename(name)}.jpg"
        dest  = os.path.join(OUTPUT_DIR, fname)

        print(f"[{pid:02d}] {brand} – {name}")

        if os.path.exists(dest):
            print(f"  ⏭️   Already exists, skipping.")
            skipped += 1
            continue

        query = build_search_query(name, brand)
        print(f"  🔍  Pexels query: \"{query}\"")
        url   = fetch_image_url(query)
        if not url:
            failed += 1
        elif download_image(url, dest):
            fetched += 1
        else:
            failed += 1

        time.sleep(DELAY_SEC)

    print(f"\n{'─'*50}")
    print(f"✅  Fetched: {fetched}  |  ⏭️  Skipped: {skipped}  |  ❌  Failed: {failed}")
    print(f"\nNext step: run the DataSeeder to load images into MariaDB:")
    print(f"  .\\mvnw spring-boot:run -Dspring-boot.run.profiles=seed")


if __name__ == "__main__":
    main()

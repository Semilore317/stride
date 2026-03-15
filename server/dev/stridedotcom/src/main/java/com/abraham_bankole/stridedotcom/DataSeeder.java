package com.abraham_bankole.stridedotcom;

import com.abraham_bankole.stridedotcom.model.Category;
import com.abraham_bankole.stridedotcom.model.Image;
import com.abraham_bankole.stridedotcom.model.Product;
import com.abraham_bankole.stridedotcom.repository.CategoryRepository;
import com.abraham_bankole.stridedotcom.repository.ImageRepository;
import com.abraham_bankole.stridedotcom.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Component;

import javax.sql.rowset.serial.SerialBlob;
import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

/**
 * DataSeeder — only active when Spring profile "seed" is set.
 *
 * Run via:  ./mvnw spring-boot:run -Dspring-boot.run.profiles=seed
 *
 * Before running, execute:
 *   python db/fetch_product_images.py
 * to populate src/main/resources/seed-images/ with actual product images.
 *
 * The seeder is idempotent:
 *   - Categories are created only if they don't already exist.
 *   - Products are created only if the table is empty.
 *   - Images are loaded only for products that have no existing images.
 */
@Component
@Profile("seed")
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);

    private final CategoryRepository categoryRepository;
    private final ProductRepository  productRepository;
    private final ImageRepository    imageRepository;

    // ── Seed product records (matches what's already in the DB) ────────────
    // These are used ONLY if the product table is empty.
    // Normally the seeder just adds images to existing products.
    private record SeedProduct(
        String name, String brand, BigDecimal price, int inventory,
        String description, String categoryName
    ) {}

    private static final List<SeedProduct> SEED_DATA = List.of(
        new SeedProduct("Chanel Classic Handbag",        "Chanel",       new BigDecimal("5500"),  5,  "Iconic Chanel leather handbag, perfect for luxury fashion lovers.",                  "Handbags"),
        new SeedProduct("Rolex Submariner",              "Rolex",        new BigDecimal("12000"), 3,  "Classic Rolex diving watch with unmatched elegance and precision.",                  "Watches"),
        new SeedProduct("Yeezy Boost 350 V2",            "Adidas Yeezy", new BigDecimal("280"),   20, "Popular Yeezy sneakers for high-end street fashion.",                                "Sneakers"),
        new SeedProduct("Gucci GG Marmont Belt Bag",     "Gucci",        new BigDecimal("1200"),  8,  "Trendy Gucci belt bag made of premium leather.",                                     "Handbags"),
        new SeedProduct("Louis Vuitton Neverfull MM",    "Louis Vuitton",new BigDecimal("1500"),  6,  "Signature LV tote bag, perfect for luxury fashion enthusiasts.",                     "Handbags"),
        new SeedProduct("Prada Re-Edition 2005 Nylon Bag","Prada",       new BigDecimal("1200"),  7,  "Stylish and compact Prada bag, ideal for everyday luxury.",                          "Handbags"),
        new SeedProduct("Balenciaga Triple S Sneakers",  "Balenciaga",   new BigDecimal("950"),   10, "Chunky designer sneakers for high-end street fashion.",                              "Sneakers"),
        new SeedProduct("Dior Saddle Bag",               "Dior",         new BigDecimal("3500"),  4,  "Elegant Dior saddle bag, a symbol of luxury and sophistication.",                    "Handbags"),
        new SeedProduct("Hermès Birkin 30",              "Hermès",       new BigDecimal("12000"), 2,  "Iconic Hermès Birkin bag, highly coveted in the luxury market.",                     "Handbags"),
        new SeedProduct("Rolex Daytona",                 "Rolex",        new BigDecimal("14500"), 2,  "Prestigious Rolex chronograph watch for collectors.",                                 "Watches"),
        new SeedProduct("Yeezy Slides",                  "Adidas Yeezy", new BigDecimal("100"),   30, "Comfortable Yeezy slides, high-end casual footwear.",                                "Sneakers"),
        new SeedProduct("Chanel Boy Bag",                "Chanel",       new BigDecimal("6500"),  4,  "Edgy and elegant Chanel Boy Bag, a fashion statement.",                              "Handbags"),
        new SeedProduct("Gucci Ace Sneakers",            "Gucci",        new BigDecimal("650"),   12, "Iconic Gucci sneakers, combining luxury and comfort.",                               "Sneakers"),
        new SeedProduct("Louis Vuitton Pochette Métis",  "Louis Vuitton",new BigDecimal("2500"),  5,  "Chic LV handbag with versatile styling options.",                                    "Handbags"),
        new SeedProduct("Prada Cleo Bag",                "Prada",        new BigDecimal("1400"),  6,  "Minimalist Prada handbag for modern luxury lovers.",                                 "Handbags"),
        new SeedProduct("Balenciaga Speed Trainer",      "Balenciaga",   new BigDecimal("800"),   8,  "Sleek Balenciaga sock sneakers for high-fashion streetwear.",                        "Sneakers"),
        new SeedProduct("Dior Book Tote",                "Dior",         new BigDecimal("2800"),  4,  "Elegant and spacious tote bag from Dior.",                                           "Handbags"),
        new SeedProduct("Hermès Kelly 25",               "Hermès",       new BigDecimal("11000"), 2,  "Timeless Hermès Kelly handbag for collectors and fashion elites.",                   "Handbags"),
        new SeedProduct("Rolex GMT-Master II",           "Rolex",        new BigDecimal("13500"), 2,  "Luxury GMT watch for travelers and collectors.",                                      "Watches"),
        new SeedProduct("Yeezy 500",                     "Adidas Yeezy", new BigDecimal("200"),   18, "High-fashion Yeezy sneakers with premium comfort.",                                  "Sneakers")
    );

    @Override
    public void run(String... args) throws Exception {
        log.info("╔══════════════════════════════════════╗");
        log.info("║       DataSeeder — Profile: seed     ║");
        log.info("╚══════════════════════════════════════╝");

        seedProductsIfEmpty();
        seedImagesForAllProducts();

        log.info("✅  Seeding complete.");
    }

    // ── Step 1: Create products if table is empty ───────────────────────────
    private void seedProductsIfEmpty() {
        if (productRepository.count() > 0) {
            log.info("Products already exist ({}) — skipping product seed.", productRepository.count());
            return;
        }
        log.info("No products found — seeding {} products…", SEED_DATA.size());

        for (SeedProduct sp : SEED_DATA) {
            Category category;
            if (categoryRepository.existsByName(sp.categoryName())) {
                category = categoryRepository.findByName(sp.categoryName());
            } else {
                Category c = new Category();
                c.setName(sp.categoryName());
                category = categoryRepository.save(c);
            }

            Product product = new Product(
                sp.name(), sp.brand(), sp.price(),
                sp.inventory(), sp.description(), category
            );
            productRepository.save(product);
            log.info("  + Created: {} – {}", sp.brand(), sp.name());
        }
    }

    // ── Step 2: Load images from seed-images/ for products missing them ─────
    private void seedImagesForAllProducts() {
        List<Product> products = productRepository.findAll();
        log.info("Checking images for {} products…", products.size());

        for (Product product : products) {
            if (!imageRepository.findByProductId(product.getId()).isEmpty()) {
                log.info("  [{}] {} — already has images, skipping.", product.getId(), product.getName());
                continue;
            }

            Optional<byte[]> imageBytes = loadSeedImage(product.getId(), product.getName());
            if (imageBytes.isEmpty()) {
                log.warn("  [{}] {} — no seed image found in seed-images/, skipping.", product.getId(), product.getName());
                continue;
            }

            try {
                Image image = new Image();
                image.setFileName(product.getId() + "_" + sanitize(product.getName()) + ".jpg");
                image.setFileType("image/jpeg");
                image.setImage(new SerialBlob(imageBytes.get()));
                image.setProduct(product);

                Image saved = imageRepository.save(image);
                saved.setDownloadUrl("/api/v1/images/image/download/" + saved.getId());
                imageRepository.save(saved);

                log.info("  [{}] {} — image seeded ✅", product.getId(), product.getName());
            } catch (Exception e) {
                log.error("  [{}] {} — failed to seed image: {}", product.getId(), product.getName(), e.getMessage());
            }
        }
    }

    /**
     * Looks for a file in the classpath seed-images/ directory.
     * Tries exact match by product ID prefix first, then falls back to name-based match.
     * Files are named:  {id}_{safe_name}.jpg  (same convention as fetch_product_images.py)
     */
    private Optional<byte[]> loadSeedImage(Long productId, String productName) {
        String[] candidates = {
            "seed-images/" + productId + "_" + sanitize(productName) + ".jpg",
            "seed-images/" + productId + "_" + sanitize(productName) + ".png",
            "seed-images/" + productId + "_" + sanitize(productName) + ".webp",
        };

        for (String candidate : candidates) {
            try {
                Resource resource = new ClassPathResource(candidate);
                if (resource.exists()) {
                    byte[] bytes = resource.getInputStream().readAllBytes();
                    log.debug("    Loaded from classpath: {}", candidate);
                    return Optional.of(bytes);
                }
            } catch (IOException e) {
                // try next
            }
        }
        return Optional.empty();
    }

    private String sanitize(String name) {
        return name.toLowerCase().replaceAll("[^a-z0-9]+", "_").replaceAll("^_|_$", "");
    }
}

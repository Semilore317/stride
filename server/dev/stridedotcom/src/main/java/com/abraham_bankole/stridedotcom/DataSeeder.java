package com.abraham_bankole.stridedotcom;

import com.abraham_bankole.stridedotcom.model.Category;
import com.abraham_bankole.stridedotcom.model.Image;
import com.abraham_bankole.stridedotcom.model.Product;
import com.abraham_bankole.stridedotcom.repository.CategoryRepository;
import com.abraham_bankole.stridedotcom.repository.ImageRepository;
import com.abraham_bankole.stridedotcom.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import javax.sql.rowset.serial.SerialBlob;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.math.BigDecimal;
import java.net.HttpURLConnection;
import java.net.URL;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ImageRepository imageRepository;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        if (productRepository.count() == 0) {
            log.info("No products found in the database. Seeding initial data...");
            seedProducts();
            log.info("Data seeding completed successfully!");
        } else {
            log.info("Products already exist in the database. Skipping data seeding.");
        }
    }

    private void seedProducts() {
        try {
            // Category 1: Electronic gadgets with high quality Unsplash images
            Category electronics = new Category("Electronics");
            electronics = categoryRepository.save(electronics);

            createProduct(
                "Premium Wireless Headphones", "SoundCloud", new BigDecimal("199.99"), 50,
                "High-quality noise-cancelling wireless headphones with 30-hour battery life and fast charging.",
                electronics,
                "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop"
            );

            createProduct(
                "Smartphone Pro Max", "TechBrand", new BigDecimal("999.00"), 20,
                "The latest smartphone with professional-grade camera, all-day battery, and an immersive OLED display.",
                electronics,
                "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800&auto=format&fit=crop"
            );

            createProduct(
                "Smart Fitness Watch", "FitPro", new BigDecimal("249.50"), 75,
                "Advanced fitness tracking smartwatch with heart rate monitor, sleep tracking, and water resistance.",
                electronics,
                "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop"
            );

            // Category 2: Clothing and Apparel
            Category clothing = new Category("Clothing");
            clothing = categoryRepository.save(clothing);

            createProduct(
                "Classic White Sneaker", "UrbanWear", new BigDecimal("89.99"), 100,
                "Comfortable and versatile white sneakers suitable for everyday casual wear, made with premium leather.",
                clothing,
                "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=800&auto=format&fit=crop"
            );
            
            createProduct(
                "Minimalist Cotton T-Shirt", "Essential", new BigDecimal("24.50"), 200,
                "100% organic cotton t-shirt with a relaxed fit. Incredibly soft and breathable.",
                clothing,
                "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop"
            );

            // Category 3: Home & Lifestyle
            Category home = new Category("Home & Lifestyle");
            home = categoryRepository.save(home);

            createProduct(
                "Ceramic Artisan Mug", "EarthCraft", new BigDecimal("18.00"), 150,
                "Hand-thrown ceramic mug with a beautiful speckled glaze. Perfect for your morning coffee or tea.",
                home,
                "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?q=80&w=800&auto=format&fit=crop"
            );

            createProduct(
                "Minimalist Desk Lamp", "Lumière", new BigDecimal("65.00"), 40,
                "Sleek and modern LED desk lamp with adjustable arm and multiple brightness levels for focused work.",
                home,
                "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=800&auto=format&fit=crop"
            );

        } catch (Exception e) {
            log.error("Error occurred during data seeding: ", e);
        }
    }

    private void createProduct(String name, String brand, BigDecimal price, int inventory, String description, Category category, String imageUrl) throws Exception {
        Product product = new Product(name, brand, price, inventory, description, category);
        product = productRepository.save(product);

        // Download Image
        byte[] imageBytes = downloadImage(imageUrl);
        if (imageBytes != null) {
            Image image = new Image();
            image.setFileName(name.replaceAll("\\s+", "_").toLowerCase() + ".jpg");
            image.setFileType("image/jpeg");
            image.setImage(new SerialBlob(imageBytes));
            image.setProduct(product);
            
            Image savedImage = imageRepository.save(image);
            savedImage.setDownloadUrl("/api/v1/images/image/download/" + savedImage.getId());
            imageRepository.save(savedImage);
            
            log.info("Seeded product: {} with image successfully.", name);
        } else {
            log.warn("Seeded product: {} but failed to download image.", name);
        }
    }

    private byte[] downloadImage(String imageUrl) {
        try {
            URL url = new URL(imageUrl);
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setRequestProperty("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36");
            connection.setConnectTimeout(5000);
            connection.setReadTimeout(5000);

            try (InputStream in = connection.getInputStream();
                 ByteArrayOutputStream out = new ByteArrayOutputStream()) {
                byte[] buffer = new byte[4096];
                int n;
                while ((n = in.read(buffer)) != -1) {
                    out.write(buffer, 0, n);
                }
                return out.toByteArray();
            }
        } catch (Exception e) {
            log.error("Failed to download image from {}: {}", imageUrl, e.getMessage());
            return null;
        }
    }
}

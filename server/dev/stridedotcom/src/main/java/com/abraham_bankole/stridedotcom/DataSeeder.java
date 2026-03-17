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
        } else {
            log.info("Products exist. Checking for products missing images...");
            seedImagesForExistingProducts();
        }
        log.info("Data seeding/verification completed!");
    }

    private void seedProducts() {
        try {
            // Category 1: Electronic gadgets
            Category electronics = getOrCreateCategory("Electronics");

            createProduct(
                "Premium Wireless Headphones", "SoundCloud", new BigDecimal("199.99"), 50,
                "High-quality noise-cancelling wireless headphones with 30-hour battery life.",
                electronics,
                "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1080&auto=format&fit=crop"
            );

            createProduct(
                "Smartphone Pro Max", "TechBrand", new BigDecimal("999.00"), 20,
                "The latest smartphone with professional-grade camera and immersive OLED display.",
                electronics,
                "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1080&auto=format&fit=crop"
            );

            // Category 2: Clothing
            Category clothing = getOrCreateCategory("Clothing");

            createProduct(
                "Classic White Sneaker", "UrbanWear", new BigDecimal("89.99"), 100,
                "Comfortable and versatile white sneakers made with premium leather.",
                clothing,
                "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=1080&auto=format&fit=crop"
            );

        } catch (Exception e) {
            log.error("Error occurred during data seeding: ", e);
        }
    }

    private void seedImagesForExistingProducts() {
        productRepository.findAll().forEach(product -> {
            if (product.getImages() == null || product.getImages().isEmpty()) {
                log.info("Product '{}' is missing images. Attempting to seed...", product.getName());
                try {
                    String categoryName = product.getCategory() != null ? product.getCategory().getName() : "general";
                    String imageUrl = getPlaceholderImageUrl(categoryName);
                    addImageToProduct(product, imageUrl);
                } catch (Exception e) {
                    log.error("Failed to seed image for product '{}': {}", product.getName(), e.getMessage());
                }
            }
        });
    }

    private Category getOrCreateCategory(String name) {
        Category category = categoryRepository.findByName(name);
        if (category == null) {
            category = new Category(name);
            category = categoryRepository.save(category);
        }
        return category;
    }

    private String getPlaceholderImageUrl(String category) {
        // Using keywords for better quality/relevance via Unsplash source
        return switch (category.toLowerCase()) {
            case "electronics" -> "https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=1080&auto=format&fit=crop";
            case "clothing" -> "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=1080&auto=format&fit=crop";
            case "home & lifestyle", "lifestyle" -> "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=1080&auto=format&fit=crop";
            default -> "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1080&auto=format&fit=crop";
        };
    }

    private void createProduct(String name, String brand, BigDecimal price, int inventory, String description, Category category, String imageUrl) throws Exception {
        Product product = new Product(name, brand, price, inventory, description, category);
        product = productRepository.save(product);
        addImageToProduct(product, imageUrl);
    }

    private void addImageToProduct(Product product, String imageUrl) throws Exception {
        byte[] imageBytes = downloadImage(imageUrl);
        if (imageBytes != null) {
            Image image = new Image();
            image.setFileName(product.getName().replaceAll("\\s+", "_").toLowerCase() + ".jpg");
            image.setFileType("image/jpeg");
            image.setImage(new SerialBlob(imageBytes));
            image.setProduct(product);
            
            Image savedImage = imageRepository.save(image);
            savedImage.setDownloadUrl("/api/v1/images/image/download/" + savedImage.getId());
            imageRepository.save(savedImage);
            
            log.info("Added image to product: {} successfully.", product.getName());
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

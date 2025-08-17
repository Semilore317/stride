package com.abraham_bankole.stridedotcom.service.product;

import com.abraham_bankole.stridedotcom.model.Category;
import com.abraham_bankole.stridedotcom.model.Product;
import com.abraham_bankole.stridedotcom.repository.CategoryRepository;
import com.abraham_bankole.stridedotcom.repository.ProductRepository;
import com.abraham_bankole.stridedotcom.request.AddProductRequest;
import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor //generates a constructor for only the final or @NonNull fields
public class ProductService implements iProductService {
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    @Override
    public Product addProduct(AddProductRequest request) {
        if (productExists(request.getName(), request.getBrand())) {
            throw new EntityExistsException(request.getName() + " already exists!");
        }
        Category category = Optional.ofNullable(categoryRepository.findByName(request.getCategory()))
                .orElseGet(() -> {
                    Category newCategory = new Category(request.getCategory().getName());
                    return categoryRepository.save(newCategory);
                });
        request.setCategory(category);
        return productRepository.save(createProduct(request, category));
    }

    // helper adding methods
    private boolean productExists(String name, String brand) {
        return productRepository.existsByNameAndBrand(name, brand);
    }

    private Product createProduct(AddProductRequest request, Category category) {
        if (productExists(request.getName(), request.getBrand())) {

        }
        return new Product(
                request.getName(),
                request.getBrand(),
                request.getPrice(),
                request.getInventory(),
                request.getDescription(),
                category
        );
    }


    @Override
    public Product updateProduct(Product product, Long productId) {
        return null;
    }

    @Override
    public Product getProductsById(Long productId) {
        return productRepository.findById(productId)
                .orElseThrow(() -> new EntityNotFoundException("Product Not Found"));
    }

    @Override
    public void deleteProduct(Long productId) {

    }

    @Override
    public List<Product> getProductsByName(String name) {
        return productRepository.findByName(name);
    }

    @Override
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    @Override
    public List<Product> getProductsByCategory(String category) {
        return productRepository.findByCategoryName(category);
    }

    @Override
    public List<Product> getProductsByBrand(String brand) {
        return productRepository.findByBrand(brand);
    }

    @Override
    public List<Product> getProductsByCategoryAndBrand(String category, String brand) {
        return productRepository.findByCategoryNameAndBrand(category, brand);
    }

    @Override
    public List<Product> getProductsByBrandAndName(String brand, String name) {
        return productRepository.findByNameAndBrand(brand, name);
    }
}

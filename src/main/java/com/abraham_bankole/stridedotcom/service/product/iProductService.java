package com.abraham_bankole.stridedotcom.service.product;

import com.abraham_bankole.stridedotcom.model.Product;

import java.util.List;

public interface iProductService {
    // declare all methods - CRUD
    Product addProduct(Product product);
    Product updateProduct(Product product, Long productid);
    Product getProductById(Long productId);
    void deleteProduct(Long productId);

    // filtering CRUD operations
    List<Product> getProductByName(String name);
    List<Product> getAllProducts();
    List<Product> getProductByCategory(String category);
    List<Product> getProductByBrand(String brand);
    List<Product> getProductsByCategoryAndBrand(String category, String brand);
    List<Product> getProductsByBrandAndName(String brand, String name);
}

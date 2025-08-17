package com.abraham_bankole.stridedotcom.service.product;

import com.abraham_bankole.stridedotcom.model.Product;
import com.abraham_bankole.stridedotcom.request.AddProductRequest;

import java.util.List;

public interface iProductService {
    // declare all methods - CRUD
    Product addProduct(AddProductRequest product);
    Product updateProduct(Product product, Long productid);
    Product getProductsById(Long productId);
    void deleteProduct(Long productId);

    // filtering CRUD operations
    List<Product> getProductsByName(String name);

    List<Product> getAllProducts();
    List<Product> getProductsByCategory(String category);
    List<Product> getProductsByBrand(String brand);
    List<Product> getProductsByCategoryAndBrand(String category, String brand);
    List<Product> getProductsByBrandAndName(String brand, String name);
}

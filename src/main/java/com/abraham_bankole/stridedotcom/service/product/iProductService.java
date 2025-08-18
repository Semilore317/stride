package com.abraham_bankole.stridedotcom.service.product;

import com.abraham_bankole.stridedotcom.dtos.ProductDto;
import com.abraham_bankole.stridedotcom.model.Product;
import com.abraham_bankole.stridedotcom.request.AddProductRequest;
import com.abraham_bankole.stridedotcom.request.ProductUpdateRequest;

import java.util.List;

public interface iProductService {
    // declare all methods - CRUD
    Product addProduct(AddProductRequest product);
    Product updateProduct(ProductUpdateRequest product, Long productid);
    Product getProductsById(Long productId);
    void deleteProduct(Long productId);

    // filtering CRUD operations
    List<Product> getProductsByName(String name);

    List<Product> getAllProducts();
    List<Product> getProductsByCategory(String category);
    List<Product> getProductsByBrand(String brand);
    List<Product> getProductsByCategoryAndBrand(String category, String brand);
    List<Product> getProductsByBrandAndName(String brand, String name);

    //custom mwthod to convert a list of products to a product DTO
    List<ProductDto> getConvertedProducts(List<Product> products);

    // custom method to convert product to a product DTO
    // pushes it to the interface level
    ProductDto convertToDto(Product product);
}

package com.abraham_bankole.stridedotcom.controller;

import com.abraham_bankole.stridedotcom.dtos.ProductDto;
import com.abraham_bankole.stridedotcom.model.Product;
import com.abraham_bankole.stridedotcom.repository.ProductRepository;
import com.abraham_bankole.stridedotcom.response.ApiResponse;
import com.abraham_bankole.stridedotcom.service.product.iProductService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.hibernate.engine.spi.Resolution;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import static org.springframework.http.HttpStatus.NOT_FOUND;

@RestController
@RequiredArgsConstructor
@RequestMapping("${api.prefix}/products")
public class ProductController {
    private final iProductService productService;
    private final ProductRepository productRepository;

    @GetMapping("/products")
    public ResponseEntity<ApiResponse> getAllProducts() {
        List<Product> products = productService.getAllProducts();
        List<ProductDto> convertedProducts = productService.getConvertedProducts(products);
        return ResponseEntity.ok(new ApiResponse("Found", convertedProducts));
    }

    @GetMapping("/product/{productId}/product")
    public ResponseEntity<ApiResponse> getProductById(@PathVariable Long productId) {
        Product product = productService.getProductsById(productId);
        try {
            ProductDto productDto = productService.convertToDto(product);
            return ResponseEntity.ok(new ApiResponse("Found!", productDto));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse("Oops!", e));
        }
    }
}
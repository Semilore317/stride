package com.abraham_bankole.stridedotcom.controller;

import com.abraham_bankole.stridedotcom.dtos.ProductDto;
import com.abraham_bankole.stridedotcom.model.Product;
import com.abraham_bankole.stridedotcom.repository.ProductRepository;
import com.abraham_bankole.stridedotcom.request.AddProductRequest;
import com.abraham_bankole.stridedotcom.request.ProductUpdateRequest;
import com.abraham_bankole.stridedotcom.response.ApiResponse;
import com.abraham_bankole.stridedotcom.service.product.iProductService;
import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static org.springframework.http.HttpStatus.CONFLICT;
import static org.springframework.http.HttpStatus.NOT_FOUND;

@RestController
@RequiredArgsConstructor
@RequestMapping("${api.prefix}/products")
public class ProductController {
    private final iProductService productService;
    private final ProductRepository productRepository;

    @GetMapping("/all")
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

    // TODO:

    // complement the product controller implementation
    // Check the ones that are returning list of product and a single product
    // use @RequestBody, @PathVariable, @RequestParam
    // addProduct and updateProduct need the @RequestBody and probably @PathVariable

    @PostMapping("/add")
    public ResponseEntity<ApiResponse> addProduct(@RequestBody AddProductRequest product) {
        try {
            Product theProduct = productService.addProduct(product);
            ProductDto productDto = productService.convertToDto(theProduct);
            return ResponseEntity.ok(new ApiResponse("Added Product Successfully!", productDto));
        } catch (EntityExistsException e) {
            return ResponseEntity.status(CONFLICT)
                    .body(new ApiResponse(e.getMessage(), null));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(NOT_FOUND)
                    .body(new ApiResponse(e.getMessage(), null));
        }
    }

    @PutMapping("/product/{productId}/update")
    public ResponseEntity<ApiResponse> updateProduct(@RequestBody ProductUpdateRequest request, @PathVariable Long productId) {
        try{
            Product theProduct = productService.updateProduct(request, productId);
            ProductDto productDto = productService.convertToDto(theProduct);
            return ResponseEntity.ok(new ApiResponse("Updated Product Successfully!", productDto));
        }catch (EntityNotFoundException e) {
            return ResponseEntity.status(NOT_FOUND)
                    .body(new ApiResponse(e.getMessage(), null));
        }
    }



    @GetMapping("/search")
    public ResponseEntity<ApiResponse> searchProductsByName(@RequestParam("name") String name) {
        List<Product> products = productService.getProductsByName(name);
        List<ProductDto> convertedProducts = productService.getConvertedProducts(products);
        return ResponseEntity.ok(new ApiResponse("Found", convertedProducts));
    }

    @GetMapping("/products/{name}/products")
    public ResponseEntity<ApiResponse> getProductByNamePath(@PathVariable String name) {
        List<Product> products = productService.getProductsByName(name);
        List<ProductDto> convertedProducts = productService.getConvertedProducts(products);

        if (products.isEmpty()) {
            return ResponseEntity.status(NOT_FOUND)
                    .body(new ApiResponse("No products found for: " + name, null));
        }

        return ResponseEntity.ok(new ApiResponse("Found", convertedProducts));
    }


}
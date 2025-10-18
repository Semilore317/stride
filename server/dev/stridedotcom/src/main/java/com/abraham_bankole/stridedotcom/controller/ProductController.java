package com.abraham_bankole.stridedotcom.controller;

import com.abraham_bankole.stridedotcom.dtos.ProductDto;
import com.abraham_bankole.stridedotcom.model.Product;
import com.abraham_bankole.stridedotcom.repository.ProductRepository;
import com.abraham_bankole.stridedotcom.request.AddProductRequest;
import com.abraham_bankole.stridedotcom.request.ProductUpdateRequest;
import com.abraham_bankole.stridedotcom.response.ApiResponse;
import com.abraham_bankole.stridedotcom.service.product.iProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
        ProductDto productDto = productService.convertToDto(product);
        return ResponseEntity.ok(new ApiResponse("Found!", productDto));
    }

    // TODO:
    // complement the product controller implementation
    // Check the ones that are returning list of product and a single product
    // use @RequestBody, @PathVariable, @RequestParam
    // addProduct and updateProduct need the @RequestBody and probably @PathVariable

    @PostMapping("/add")
    public ResponseEntity<ApiResponse> addProduct(@RequestBody AddProductRequest product) {
        Product theProduct = productService.addProduct(product);
        ProductDto productDto = productService.convertToDto(theProduct);
        return ResponseEntity.ok(new ApiResponse("Added Product Successfully!", productDto));
    }

    @PostMapping("/add/bulk")
    public ResponseEntity<ApiResponse> addBulkProduct(@RequestBody List<AddProductRequest> products) {
        List<Product> addedProducts = productService.addBulkProducts(products);
        List<ProductDto> convertedProducts = productService.getConvertedProducts(addedProducts);
        return ResponseEntity.ok(new ApiResponse("Added Bulk Products Successfully!", convertedProducts));
    }

    @PutMapping("/product/{productId}/update")
    public ResponseEntity<ApiResponse> updateProduct(@RequestBody ProductUpdateRequest request, @PathVariable Long productId) {
        Product theProduct = productService.updateProduct(request, productId);
        ProductDto productDto = productService.convertToDto(theProduct);
        return ResponseEntity.ok(new ApiResponse("Updated Product Successfully!", productDto));
    }

    @DeleteMapping("/product/{productId}/delete")
    public ResponseEntity<ApiResponse> deleteProduct(@PathVariable Long productId) {
        productService.deleteProductById(productId);
        return ResponseEntity.ok(new ApiResponse("Delete product success!", productId));
    }

    @GetMapping("/products/by/brand-and-name")
    public ResponseEntity<ApiResponse> getProductsByBrandAndName(@RequestParam String brandName, @RequestParam String productName) {
        List<Product> products = productService.getProductsByBrandAndName(brandName, productName);
        List<ProductDto> convertedProducts = productService.getConvertedProducts(products);
        return ResponseEntity.ok(new ApiResponse("Success", convertedProducts));
    }

    @GetMapping("/products/by/category-and-brand")
    public ResponseEntity<ApiResponse> getProductByCategoryAndBrand(@RequestParam String category, @RequestParam String brand) {

        List<Product> products = productService.getProductsByCategoryAndBrand(category, brand);
        List<ProductDto> convertedProducts = productService.getConvertedProducts(products);
        return ResponseEntity.ok(new ApiResponse("Success", convertedProducts));
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

    @GetMapping("/product/by-brand")
    public ResponseEntity<ApiResponse> findProductByBrand(@RequestParam String brand) {
        List<Product> products = productService.getProductsByBrand(brand);
        List<ProductDto> convertedProducts = productService.getConvertedProducts(products);
        return ResponseEntity.ok(new ApiResponse("success", convertedProducts));
    }

    @GetMapping("/product/{category}/all/products")
    public ResponseEntity<ApiResponse> findProductsByCategory(@PathVariable String category) {
        List<Product> products = productService.getProductsByCategory(category);
        List<ProductDto> convertedProducts = productService.getConvertedProducts(products);
        return ResponseEntity.ok(new ApiResponse("success", convertedProducts));
    }

    @GetMapping("/category/{categoryId}/all/products")
    public ResponseEntity<ApiResponse> findProductsByCategoryId(@PathVariable Long categoryId) {
        List<Product> products = productService.getProductsByCategoryId(categoryId);
        List<ProductDto> convertedProducts = productService.getConvertedProducts(products);
        return ResponseEntity.ok(new ApiResponse("success", convertedProducts));
    }


    @GetMapping("/distinct/products")
    public ResponseEntity<ApiResponse> getDistinctProductsByName() {
        List<Product> products = productService.findDistinctProductByName();
        List<ProductDto> productDtos = productService.getConvertedProducts(products);
        return ResponseEntity.ok(new ApiResponse("success", productDtos));
    }

    // extra endpoints lol
//    @GetMapping("/distinct/brands")
//    public ResponseEntity<ApiResponse> getDistinctBrands() {
//        List<String> brands = productService.getDistinctBrands();
//        return ResponseEntity.ok(new ApiResponse("success", brands));
//    }
//
//    @GetMapping("/distinct/by-id")
//    public ResponseEntity<ApiResponse> getDistinctProductsById() {
//        List<Product> products = productService.findDistinctProductById();
//        List<ProductDto> productDtos = productService.getConvertedProducts(products);
//        return ResponseEntity.ok(new ApiResponse("success", productDtos));
//    }
}

package com.abraham_bankole.stridedotcom.service.product;

import com.abraham_bankole.stridedotcom.dtos.ImageDto;
import com.abraham_bankole.stridedotcom.dtos.ProductDto;
import com.abraham_bankole.stridedotcom.model.*;
import com.abraham_bankole.stridedotcom.repository.*;
import com.abraham_bankole.stridedotcom.request.AddProductRequest;
import com.abraham_bankole.stridedotcom.request.ProductUpdateRequest;
import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

import static java.util.Optional.ofNullable;

@Service
@RequiredArgsConstructor //generates a constructor for only the final or @NonNull fields
public class ProductService implements iProductService {
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ImageRepository imageRepository;
    private final CartItemRepository cartItemRepository;
    private final OrderItemRepository orderItemRepository;
    private final ModelMapper modelMapper;

    @Override
    public Product addProduct(AddProductRequest request) {
        if (productExists(request.getName(), request.getBrand())) {
            throw new EntityExistsException(request.getName() + " already exists!");
        }

        Category category = ofNullable(categoryRepository.findByName(request.getCategory().getName()))
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
//        if (productExists(request.getName(), request.getBrand())) {
//
//        }
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
    public Product updateProduct(ProductUpdateRequest request, Long productId) {
        return productRepository.findById(productId).map(existingProduct -> updateExistingProduct(existingProduct, request))
                .map(productRepository::save) //lambda expression, equivalent to product -> productRepository.save(product).
                .orElseThrow(() -> new EntityNotFoundException("Product with ID: " + productId + " not found"));
    }

    private Product updateExistingProduct(Product existingProduct, ProductUpdateRequest request) {
        existingProduct.setName(request.getName());
        existingProduct.setBrand(request.getBrand());
        existingProduct.setPrice(request.getPrice());
        existingProduct.setInventory(request.getInventory());
        existingProduct.setDescription(request.getDescription());

        Category category = categoryRepository.findByName(request.getCategory().getName());
        existingProduct.setCategory(category);
        return existingProduct;

    }

    @Override
    public Product getProductsById(Long productId) {
        return productRepository.findById(productId)
                .orElseThrow(() -> new EntityNotFoundException("Product Not Found"));
    }

    @Override
    public void deleteProduct(Long productId) {
        productRepository.findById(productId)
                .ifPresentOrElse(product -> {
                    List<CartItem> cartItems = cartItemRepository.findByProductId(productId);
                    cartItems.forEach(cartItem -> {
                        Cart cart = cartItem.getCart();
                        cart.removeItem(cartItem);
                        cartItemRepository.delete(cartItem);
                    });

                    List<OrderItem> orderItems = orderItemRepository.findByProductId(productId);
                    orderItems.forEach(orderItem -> {
                        Order order = orderItem.getOrder();
                        order.setProduct(null);
                        orderItem.save(orderItem);
                    });

                    Optional.ofNullable(product.getCategory())
                            .ifPresent(category -> category.getProducts().remove(product));
                    product.setCategory(null);

                    productRepository.deleteById(product.getId());
                }, () -> {
                    throw new EntityNotFoundException("Product Not Found");
                });
    }

    @Override
    public List<Product> getProductsByName(String name) {
        //return productRepository.findByName(name);
        return productRepository.findByNameContainingIgnoreCase(name);
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

    //custom mwthod to convert a list of products to a product DTO
    @Override
    public List<ProductDto> getConvertedProducts(List<Product> products) {
        return products.stream().
                map(this::convertToDto).toList(); // uses the method below but to a list
    }

    // custom method to convert product to a product DTO
    @Override // pulls the method to interface level
    public ProductDto convertToDto(Product product) {
        //return modelMapper.map(product, ProductDto.class);
        ProductDto productDto = modelMapper.map(product, ProductDto.class);
        // get the list of images and convert them to the imageDto
        List<Image> images = imageRepository.findByProductId(product.getId());
        List<ImageDto> imageDtos = images
                .stream()
                .map(image -> modelMapper
                        .map(image, ImageDto.class))
                .toList();
        productDto.setImages(imageDtos);
        return productDto;
    }
}

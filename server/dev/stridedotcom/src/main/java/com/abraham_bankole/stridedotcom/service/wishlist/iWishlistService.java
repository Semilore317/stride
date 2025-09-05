package com.abraham_bankole.stridedotcom.service.wishlist;

import com.abraham_bankole.stridedotcom.model.Product;
import com.abraham_bankole.stridedotcom.model.Wishlist;

import java.util.List;

public interface iWishlistService {
    Wishlist getWishlistByUserId(Long userId);
    Wishlist addProductToWishlist(Long userId, Long productId);
    Wishlist removeProductFromWishlist(Long userId, Long productId);
    List<Product> getWishlistProducts(Long userId);
}

package com.abraham_bankole.stridedotcom.service.wishlist;

import com.abraham_bankole.stridedotcom.model.Wishlist;

public interface iWishlistService {
    Wishlist getUserWishlist(Long userId);
    void addProductToWishlist(Long userId, Long productId);
    void removeProductFromWishlist(Long userId, Long productId);
}

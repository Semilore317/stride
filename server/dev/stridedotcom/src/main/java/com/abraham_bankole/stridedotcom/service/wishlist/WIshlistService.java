package com.abraham_bankole.stridedotcom.service.wishlist;

import com.abraham_bankole.stridedotcom.model.*;
import com.abraham_bankole.stridedotcom.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class WishlistService implements iWishlistService {

    private final WishlistRepository wishlistRepository;
    private final WishlistItemRepository wishlistItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @Override
    public Wishlist getUserWishlist(Long userId) {
        return wishlistRepository.findByUserId(userId);
    }

    @Override
    @Transactional
    public void addProductToWishlist(Long userId, Long productId) {
        Wishlist wishlist = wishlistRepository.findByUserId(userId);
        if (wishlist == null) {
            User user = userRepository.findById(userId).orElseThrow();
            wishlist = new Wishlist();
            wishlist.setUser(user);
            wishlist = wishlistRepository.save(wishlist);
        }

        boolean exists = wishlist.getItems().stream()
                .anyMatch(item -> item.getProduct().getId().equals(productId));

        if (!exists) {
            Product product = productRepository.findById(productId).orElseThrow();
            WishlistItem item = new WishlistItem();
            item.setWishlist(wishlist);
            item.setProduct(product);
            wishlistItemRepository.save(item);
        }
    }

    @Override
    public void removeProductFromWishlist(Long userId, Long productId) {
        Wishlist wishlist = wishlistRepository.findByUserId(userId);
        if (wishlist != null) {
            wishlistItemRepository.deleteByWishlistIdAndProductId(wishlist.getId(), productId);
        }
    }
}

package com.abraham_bankole.stridedotcom.controller;

import com.abraham_bankole.stridedotcom.model.Product;
import com.abraham_bankole.stridedotcom.model.Wishlist;
import com.abraham_bankole.stridedotcom.service.wishlist.iWishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wishlist")
@RequiredArgsConstructor
public class WishlistController {
    private final iWishlistService wishlistService;

    @GetMapping("/{userId}")
    public ResponseEntity<List<Product>> getWishlist(@PathVariable Long userId) {
        return ResponseEntity.ok(wishlistService.getWishlistProducts(userId));
    }

    @PostMapping("/{userId}/add/{productId}")
    public ResponseEntity<Wishlist> addToWishlist(@PathVariable Long userId, @PathVariable Long productId) {
        return ResponseEntity.ok(wishlistService.addProductToWishlist(userId, productId));
    }

    @DeleteMapping("/{userId}/remove/{productId}")
    public ResponseEntity<Wishlist> removeFromWishlist(@PathVariable Long userId, @PathVariable Long productId) {
        return ResponseEntity.ok(wishlistService.removeProductFromWishlist(userId, productId));
    }
}

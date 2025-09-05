package com.abraham_bankole.stridedotcom.repository;

import com.abraham_bankole.stridedotcom.model.Wishlist;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WishlistRepository extends JpaRepository<Wishlist, Long> {
    Wishlist findByUserId(Long userId);
}

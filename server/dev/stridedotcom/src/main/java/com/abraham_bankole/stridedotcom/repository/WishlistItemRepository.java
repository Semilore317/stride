package com.abraham_bankole.stridedotcom.repository;

import com.abraham_bankole.stridedotcom.model.WishlistItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WishlistItemRepository extends JpaRepository<WishlistItem, Long> {
    List<WishlistItem> findByWishlistId(long wishlistId);
    void deleteByWishlistId(long wishlistId);
}

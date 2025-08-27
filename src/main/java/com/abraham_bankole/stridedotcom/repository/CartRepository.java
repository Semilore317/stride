package com.abraham_bankole.stridedotcom.repository;

import com.abraham_bankole.stridedotcom.model.Cart;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartRepository extends JpaRepository<Cart, Long> {
    Cart findByUser_Id(Long userId);
}

package com.abraham_bankole.stridedotcom.repository;

import com.abraham_bankole.stridedotcom.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUser_Id(Long userId);
}

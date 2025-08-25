package com.abraham_bankole.stridedotcom.controller;

import com.abraham_bankole.stridedotcom.model.Order;
import com.abraham_bankole.stridedotcom.repository.OrderRepository;
import com.abraham_bankole.stridedotcom.response.ApiResponse;
import com.abraham_bankole.stridedotcom.service.order.iOrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("${api.prefix}/orders")
public class OrderController {
    private final iOrderService orderService;
    private final OrderRepository orderRepository;

    @PostMapping("/user/order")
    public ResponseEntity<ApiResponse> placeOrder(@RequestParam Long userId){
        Order order = orderService.placeOrder(userId);
        return ResponseEntity.ok(new ApiResponse("Order placed successfully!", order));
    }

    @GetMapping("/user/{userId}/order")
    public ResponseEntity<ApiResponse> getUserOrders(@PathVariable Long userId){
        List<Order> orders = orderService.getUserOrders(userId);
        return ResponseEntity.ok(new ApiResponse("Success!", orders));
    }

    // TODO: Create an Order DTO to return a list of user orders
}

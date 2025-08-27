package com.abraham_bankole.stridedotcom.service.order;

import com.abraham_bankole.stridedotcom.dtos.OrderDto;
import com.abraham_bankole.stridedotcom.model.Order;

import java.util.List;

public interface iOrderService {
    Order placeOrder(Long userId);;
    List<OrderDto> getUserOrders(Long userId);

    OrderDto convertToDto(Order order);
}

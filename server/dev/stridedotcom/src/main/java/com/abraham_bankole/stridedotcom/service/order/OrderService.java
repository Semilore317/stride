package com.abraham_bankole.stridedotcom.service.order;

import com.abraham_bankole.stridedotcom.dtos.OrderDto;
import com.abraham_bankole.stridedotcom.enums.OrderStatus;
import com.abraham_bankole.stridedotcom.model.Cart;
import com.abraham_bankole.stridedotcom.model.Order;
import com.abraham_bankole.stridedotcom.model.OrderItem;
import com.abraham_bankole.stridedotcom.model.Product;
import com.abraham_bankole.stridedotcom.repository.OrderRepository;
import com.abraham_bankole.stridedotcom.repository.ProductRepository;
import com.abraham_bankole.stridedotcom.service.cart.iCartService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService implements iOrderService {
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final iCartService cartService;
    private final ModelMapper modelMapper;

    @Override
    public Order placeOrder(Long userId) {
        Cart cart = cartService.getCartByUserId(userId);
        if (cart == null || cart.getItems().isEmpty()) {
            throw new IllegalStateException("Cart is empty or not found for user: " + userId);
        }
        Order order = createOrder(cart);
        List<OrderItem> orderItemList = createOrderItems(order, cart);
        order.setOrderItems(new HashSet<>(orderItemList));
        order.setTotalAmount(calculateTotalAmount(orderItemList));
        Order savedOrder = orderRepository.save(order);
        cartService.clearCart(cart.getId());
        return savedOrder;
    }

    // helper methods
    private Order createOrder(Cart cart) {
        Order order = new Order();
        order.setUser(cart.getUser());
        order.setOrderStatus(OrderStatus.PENDING);
        order.setOrderDate(LocalDate.now());

        return order;
    }

    private List<OrderItem> createOrderItems(Order order, Cart cart) {
        return cart.getItems().stream().map(cartItem -> {
            Product product = cartItem.getProduct();
            product.setInventory(product.getInventory() - cartItem.getQuantity());
            productRepository.save(product);
            return new OrderItem(
                    order,
                    product,
                    cartItem.getUnitPrice(),
                    cartItem.getQuantity());
        }).toList();
    }

    private BigDecimal calculateTotalAmount(List<OrderItem> orderItemList) {
        return orderItemList.stream()
                .map(item -> item.getPrice()
                        .multiply(new BigDecimal(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    @Override
    public List<OrderDto> getUserOrders(Long userId) {
        List<Order> orders = orderRepository.findByUser_Id(userId);
        return orders.stream().map(this::convertToDto).toList();
    }

    @Override
    public OrderDto convertToDto(Order order) {
        return modelMapper.map(order, OrderDto.class);
    }
}

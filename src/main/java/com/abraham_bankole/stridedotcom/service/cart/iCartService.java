package com.abraham_bankole.stridedotcom.service.cart;

import com.abraham_bankole.stridedotcom.model.Cart;
import com.abraham_bankole.stridedotcom.model.User;

import java.math.BigDecimal;

public interface iCartService {
    Cart getCart(Long cartId);
    Cart getCartByUserId(Long userId);
    void clearCart(Long cartId);
    Cart initializeNewCartForUser(User user);
    BigDecimal getTotalPrice(Long cartId);
}
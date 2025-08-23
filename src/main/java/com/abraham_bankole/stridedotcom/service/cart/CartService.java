package com.abraham_bankole.stridedotcom.service.cart;

import com.abraham_bankole.stridedotcom.model.Cart;
import com.abraham_bankole.stridedotcom.model.User;
import com.abraham_bankole.stridedotcom.repository.CartRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class CartService implements iCartService{
    // dependencies
    private final CartRepository cartRepository;
    @Override
    public Cart getCart(Long cartId) {
        return null;
    }

    @Override
    public Cart getCartByUserId(Long userId) {
        return null;
    }

    @Override
    public void clearCart(Long cartId) {

    }

    @Override
    public Cart initializeNewCartForUser(User user) {
        return null;
    }

    @Override
    public BigDecimal getTotalPrice(Long cartId) {
        return null;
    }
}

package com.abraham_bankole.stridedotcom.service.cart;

import com.abraham_bankole.stridedotcom.model.Cart;
import com.abraham_bankole.stridedotcom.model.User;
import com.abraham_bankole.stridedotcom.repository.CartItemRepository;
import com.abraham_bankole.stridedotcom.repository.CartRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CartService implements iCartService{
    // dependencies
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;

    @Override
    public Cart getCart(Long cartId) {
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new EntityNotFoundException("No Cart Found"));
        BigDecimal totalAmount = cart.getTotalAmount();
        cart.setTotalAmount(totalAmount);
        return cartRepository.save(cart);
    }

    @Override
    public Cart getCartByUserId(Long userId) {
        return cartRepository.findByUserId(userId);
    }

    @Override
    @Transactional
    public void clearCart(Long cartId) {
        Cart cart = getCart(cartId);
        cartItemRepository.deleteAllByCartId(cartId);
        cart.clearCart();
        cartRepository.deleteById(cartId);
    }

    @Override
    public Cart initializeNewCartForUser(User user) {
        return Optional.ofNullable(getCartByUserId(user.getId()))
                .orElseGet(() -> {
            Cart cart = new Cart();
            cart.setUser(user);
            cart.setTotalAmount(BigDecimal.ZERO); // initialized here
            return cartRepository.save(cart);
        });
    }


    @Override
    public BigDecimal getTotalPrice(Long cartId) {
        Cart cart = getCart(cartId);
        return cart.getTotalAmount();
    }
}

package com.abraham_bankole.stridedotcom.service.cart;

import com.abraham_bankole.stridedotcom.model.CartItem;
import com.abraham_bankole.stridedotcom.repository.CartItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CarrtItemService implements iCartItemService {
    // dependencies
    private final CartItemRepository cartItemRepository;


    @Override
    public void addItemToCart(Long cartId, Long productId, int quantity) {

    }

    @Override
    public void removeItemFromCart(Long cartId, Long productId) {

    }

    @Override
    public void updateItemQuantity(Long cartId, Long productId, int quantity) {

    }

    @Override
    public CartItem getCartItem(Long cartId, Long productId) {
        return null;
    }
}

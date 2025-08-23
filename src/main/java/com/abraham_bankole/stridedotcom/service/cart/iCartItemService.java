package com.abraham_bankole.stridedotcom.service.cart;

import com.abraham_bankole.stridedotcom.model.CartItem;

public interface iCartItemService {
    void addItemToCart(Long cartId, Long productId, int quantity);
    void removeItemFromCart(Long cartId, Long productId);
    void updateItemQuantity(Long cartId, Long productId, int quantity);
    CartItem getCartItem(Long cartId, Long productId);
}

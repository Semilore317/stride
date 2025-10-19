package com.abraham_bankole.stridedotcom.controller;

import com.abraham_bankole.stridedotcom.model.Cart;
import com.abraham_bankole.stridedotcom.model.User;
import com.abraham_bankole.stridedotcom.response.ApiResponse;
import com.abraham_bankole.stridedotcom.service.cart.iCartItemService;
import com.abraham_bankole.stridedotcom.service.cart.iCartService;
import com.abraham_bankole.stridedotcom.service.user.iUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("${api.prefix}/cartItems")
public class CartItemController {
    private final iCartItemService cartItemService;
    private final iUserService userService;
    private final iCartService cartService;

    @PostMapping("/item/add")
    public ResponseEntity<ApiResponse> addItemToCart(
                                                   @RequestParam Long productId,
                                                   @RequestParam int quantity) {
        // i'd normally get the userId from the authentication
        // but no login logic yet so, id have to get it manually
//        User user = userService.getAuthenticatedUser();
//        Cart cart = cartService.initializeNewCartForUser(user);

        cartItemService.addItemToCart(1L, productId, quantity);

        return ResponseEntity.ok(new ApiResponse("Item added successfully!", null));
    }

    @DeleteMapping("/cart/{cartId}/item/{itemId}/remove")
    public ResponseEntity<ApiResponse> removeItemFromCart(
                                                   @PathVariable Long cartId,
                                                   @PathVariable Long itemId){
        cartItemService.removeItemFromCart(cartId, itemId);
        return ResponseEntity.ok(new ApiResponse("Item Removed Successfully!", null));
    }

    @PutMapping("cart/{cartId}/item/{itemId}/update")
    public ResponseEntity<ApiResponse> updateCartItem(
                                                   @PathVariable Long cartId,
                                                   @PathVariable Long itemId,
                                                   @RequestParam int quantity) {
        cartItemService.updateItemQuantity(cartId, itemId, quantity);
        return ResponseEntity.ok(new ApiResponse("Item updated successfully!", null));
    }
}
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/components/services/api";
import {
  getStoredCart,
  //saveCart, -- to be implemented later
  clearStoredCart,
  addItemToStoredCart,
  removeItemFromStoredCart,
  updateItemQuantity as updateStoredItemQuantity,
  calculateCartTotals
} from "@/utils/cartStorage";


// Async Thunks (For authenticated users - future use)

/**
 * Fetch user's cart from server (for authenticated users)
 */
export const getUserCart = createAsyncThunk(
  "cart/getUserCart",
  async (userId) => {
    const response = await api.get(`/carts/user/${userId}/cart`);
    return response.data;
  }
);

/**
 * Add item to user's server-side cart (for authenticated users)
 */
export const addToServerCart = createAsyncThunk(
  "cart/addToServerCart",
  async ({ productId, quantity }) => {
    const response = await api.post(
      `/cartItems/item/add?productId=${productId}&quantity=${quantity}`
    );
    return response.data;
  }
);

// Initial State (Load from localStorage for guests)

const storedItems = getStoredCart();
const storedTotals = calculateCartTotals(storedItems);

const initialState = {
  items: storedItems,
  totalAmount: storedTotals.totalAmount,
  totalPrice: storedTotals.totalPrice,
  successMessage: null,
  errorMessage: null,
  isAuthenticated: false, // Will be used when auth is implemented
};

// Cart Slice

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    /**
     * Load cart from localStorage
     */
    loadCart: (state) => {
      const items = getStoredCart();
      const totals = calculateCartTotals(items);
      state.items = items;
      state.totalAmount = totals.totalAmount;
      state.totalPrice = totals.totalPrice;
    },

    /**
     * Add item to cart (localStorage for guests)
     */
    addItem: (state, action) => {
      const { product, quantity } = action.payload;
      const updatedItems = addItemToStoredCart(product, quantity);
      const totals = calculateCartTotals(updatedItems);

      state.items = updatedItems;
      state.totalAmount = totals.totalAmount;
      state.totalPrice = totals.totalPrice;
      state.successMessage = "Item added to cart!";
      state.errorMessage = null;
    },

    /**
     * Remove item from cart
     */
    removeItem: (state, action) => {
      const { productId } = action.payload;
      const updatedItems = removeItemFromStoredCart(productId);
      const totals = calculateCartTotals(updatedItems);

      state.items = updatedItems;
      state.totalAmount = totals.totalAmount;
      state.totalPrice = totals.totalPrice;
      state.successMessage = "Item removed from cart";
      state.errorMessage = null;
    },

    /**
     * Update item quantity
     */
    updateQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const updatedItems = updateStoredItemQuantity(productId, quantity);
      const totals = calculateCartTotals(updatedItems);

      state.items = updatedItems;
      state.totalAmount = totals.totalAmount;
      state.totalPrice = totals.totalPrice;
    },

    /**
     * Clear entire cart
     */
    clearCart: (state) => {
      clearStoredCart();
      state.items = [];
      state.totalAmount = 0;
      state.totalPrice = 0;
      state.successMessage = "Cart cleared";
    },

    /**
     * Clear messages
     */
    clearMessages: (state) => {
      state.successMessage = null;
      state.errorMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // For authenticated users (future use)
      .addCase(getUserCart.fulfilled, (state, action) => {
        state.items = action.payload.data?.items || [];
        state.totalAmount = action.payload.data?.totalAmount || 0;
        state.totalPrice = action.payload.data?.totalPrice || 0;
        state.isAuthenticated = true;
      })
      .addCase(addToServerCart.fulfilled, (state, action) => {
        state.successMessage = action.payload.message;
        state.errorMessage = null;
      })
      .addCase(addToServerCart.rejected, (state, action) => {
        state.errorMessage = action.error.message;
      });
  },
});

export const {
  loadCart,
  addItem,
  removeItem,
  updateQuantity,
  clearCart,
  clearMessages
} = cartSlice.actions;

export default cartSlice.reducer;

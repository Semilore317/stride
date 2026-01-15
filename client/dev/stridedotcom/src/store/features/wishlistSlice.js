import { createSlice } from "@reduxjs/toolkit";
import {
    getStoredWishlist,
    addToStoredWishlist,
    removeFromStoredWishlist,
    clearStoredWishlist,
    isInStoredWishlist
} from "@/utils/wishlistStorage";

// Initial State (Load from localStorage)
const storedItems = getStoredWishlist();

const initialState = {
    items: storedItems,
    successMessage: null,
    errorMessage: null,
};

// Wishlist Slice
const wishlistSlice = createSlice({
    name: "wishlist",
    initialState,
    reducers: {
        /**
         * Load wishlist from localStorage
         */
        loadWishlist: (state) => {
            state.items = getStoredWishlist();
        },

        /**
         * Add product to wishlist
         */
        addToWishlist: (state, action) => {
            const product = action.payload;
            const updatedItems = addToStoredWishlist(product);
            state.items = updatedItems;
            state.successMessage = "Added to wishlist!";
            state.errorMessage = null;
        },

        /**
         * Remove product from wishlist
         */
        removeFromWishlist: (state, action) => {
            const productId = action.payload;
            const updatedItems = removeFromStoredWishlist(productId);
            state.items = updatedItems;
            state.successMessage = "Removed from wishlist";
            state.errorMessage = null;
        },

        /**
         * Clear entire wishlist
         */
        clearWishlist: (state) => {
            clearStoredWishlist();
            state.items = [];
            state.successMessage = "Wishlist cleared";
        },

        /**
         * Clear messages
         */
        clearWishlistMessages: (state) => {
            state.successMessage = null;
            state.errorMessage = null;
        },
    },
});

// Selector to check if a product is in wishlist
export const selectIsInWishlist = (state, productId) => {
    return state.wishlist.items.some(item => item.id === productId);
};

export const {
    loadWishlist,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    clearWishlistMessages
} = wishlistSlice.actions;

export default wishlistSlice.reducer;

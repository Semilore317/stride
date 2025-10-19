import { configureStore } from "@reduxjs/toolkit";
import searchReducer from "./features/searchSlice.js";
import categoryReducer from "./features/categorySlice.js"
import productReducer from "./features/productSlice.js"
import paginationReducer from "./features/paginationSlice.js"
import cartReducer from "./features/cartSlice.js"

export const store = configureStore({
  reducer: {
    search: searchReducer,
    category: categoryReducer,
    product: productReducer,
    pagination: paginationReducer,
    cart: cartReducer,
  },
});
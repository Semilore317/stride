import { configureStore } from "@reduxjs/toolkit";
import searchReducer from "./features/SearchSlice.js";
import categoryReducer from "./features/CategorySlice.js"
import productReducer from "./features/ProductSlice.js"

export const store = configureStore({
  reducer: {
    search: searchReducer,
    category: categoryReducer,
    product: productReducer,
  },
});
import { configureStore } from "@reduxjs/toolkit";
import searchReducer from "./features/SearchSlice.js";
import categoryReducer from "./features/CategorySlice.js"

export const store = configureStore({
  reducer: {
    search: searchReducer,
    category: categoryReducer,
  },
});
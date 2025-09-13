import { configureStore } from "@reduxjs/toolkit";
import searchReducer from "./features/SearchSlice.js";

export const store = configureStore({
  reducer: {
    search: searchReducer
  },
});
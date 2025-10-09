import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentPage: 1,
  itemsPerPage: 8,
};

const PaginationSlice = createSlice({
  name: "pagination",
  initialState,
  reducers: {
    setPage: (state, action) => {
      state.currentPage = action.payload;
    },
    nextPage: (state, action) => {
      const totalPages = action.payload;
      if (state.currentPage < totalPages) {
        state.currentPage += 1;
      }
    },
    prevPage: (state) => {
      if (state.currentPage > 1) {
        state.currentPage -= 1;
      }
    },
    resetPage: (state) => {
      state.currentPage = 1;
    },
    setItemsPerPage: (state, action) => {
      state.itemsPerPage = action.payload;
    },
  },
});

export const { setPage, nextPage, prevPage, resetPage, setItemsPerPage } =
  PaginationSlice.actions;

export default PaginationSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    searchQuery: "",
    selectedCategory: "all",
    selectedBrands: [],
};

const searchSlice = createSlice({
    name: "search",
    initialState,
    reducers: {
        setSearchQuery: (state, action) => {
            state.searchQuery = action.payload;
        },
        setSelectedCategory: (state, action) => {
            state.selectedCategory = action.payload;
        },
        setSelectedBrands: (state, action) => {
            state.selectedBrands = action.payload;
        },
        clearFilters: (state) => {
            state.searchQuery = "";
            state.selectedCategory = "all";
            state.selectedBrands = [];
        },
    },
});

export const {
    setSearchQuery,
    setSelectedCategory,
    setSelectedBrands,
    clearFilters,
} = searchSlice.actions;

export default searchSlice.reducer;
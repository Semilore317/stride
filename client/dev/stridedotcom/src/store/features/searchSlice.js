import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    searchQuery: "",
    selectedCategory: "all",
    priceRange: [0, 0],
    rating: 0,
};

const searchSlice = createSlice({
    name: "search",
    initialState,
    reducers: {
        // persist filters in url
        setSearchQuery(state, action) {
            state.searchQuery = action.payload;
        },
        setSelectedCategory(state, action) {
            state.selectedCategory = action.payload;
        },
        setPriceRange(state, action) {
            state.priceRange = action.payload;
        },
        setRating(state, action) {
            state.rating = action.payload;
        },
        clearFilters(state) {
            state.searchQuery = "";
            state.selectedCategory = "all";
            state.priceRange = [0, 0];
            state.rating = 0;
        },
    },
});

export const {
    setSearchQuery,
    setSelectedCategory,
    setPriceRange,
    setRating,
    clearFilters,
} = searchSlice.actions;

export default searchSlice.reducer;

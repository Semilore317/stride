import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    searchQuery: "",
    selectedCategory: "all",
};

const searchSlice = createSlice({
    name: "search",
    initialState,
    reducers: {
        setSearchQuery(state, action) {
            state.searchQuery = action.payload;
        },
        setSelectedCategory(state, action) {
            state.selectedCategory = action.payload;
        },
    },
});

export const { setSearchQuery, setSelectedCategory } = searchSlice.actions;
export default searchSlice.reducer;

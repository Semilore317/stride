import { createSlice } from "@reduxjs/toolkit";

const searchSlice = createSlice({
    name: "search",

    initialState: {
        query: "", // default search query is an emptty string
    },

    reducers: {
        setSearchQuery: (state, action) => {
            state.query = action.payload;
        },
        clearSearchQuery: (state) => {
            state.query = "";
        },
    },
});

export const { setSearchQuery, clearSearchQuery } = searchSlice.actions;

export default searchSlice.reducer;
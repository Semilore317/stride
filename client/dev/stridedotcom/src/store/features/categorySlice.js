import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/components/services/api";

export const getAllCategories = createAsyncThunk(
    "category/getAllCategories",
    async () => {
        const response = await api.get("/categories/all");
        return response.data.data; // array of categories
    }
);

const initialState = {
    categories: [],
    errorMessage: null,
    isLoading: false,
};

const categorySlice = createSlice({
    name: "category",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllCategories.pending, (state) => {
                state.isLoading = true;
                state.errorMessage = null;
            })
            .addCase(getAllCategories.fulfilled, (state, action) => {
                state.categories = action.payload;
                state.isLoading = false;
            })
            .addCase(getAllCategories.rejected, (state, action) => {
                state.errorMessage = action.error.message;
                state.isLoading = false;
            });
    },
});

export default categorySlice.reducer;

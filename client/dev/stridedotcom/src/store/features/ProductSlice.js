import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/components/services/api";

export const getAllProducts = createAsyncThunk(
    "product/getAllProducts",
    async () => {
        const response = await api.get("/products/all");
        console.log("Fetched products:", response.data); // optional
        return response.data.data; // only return the array
    }
);

const initialState = {
    products: [],
    errorMessage: null,
    isLoading: false,
};

const productSlice = createSlice({
    name: "product",
    initialState,
    reducers: {},

    extraReducers: (builder) => {
        builder
            .addCase(getAllProducts.fulfilled, (state, action) => {
                state.products = action.payload; // already the array
                state.errorMessage = null;
            })
            .addCase(getAllproducts.rejected, (state, action) => {
                state.errorMessage = action.error.message;
            })
    },
});

export default productSlice.reducer;
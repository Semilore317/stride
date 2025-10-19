import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {api} from "../..component/services/api";

export const fetchCart = createAsyncThunk("cart/fetchCart", async () => {
    const response = await api.get("/cart");
    return response.data;
});

export const addToCart = createAsyncThunk("cart/addToCart", async ({ productId, quantity }) => {
    const response = await api.post("/cartItems/item/add", { productId, quantity });
    return response.data.data;
});

const initialState = {
    items: [],
    totalAmount: 0,
    totalPrice: 0,
    //status: "idle",
    successMessage: null,
    errorMessage: null,
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.items = action.payload.items;
                state.totalAmount = action.payload.totalAmount;
                state.totalPrice = action.payload.totalPrice;
            })
            .addCase(addToCart.fulfilled, (state, action) => {
                // state.items.push(action.payload);
                // state.totalAmount += action.payload.quantity;
                // state.totalPrice += action.payload.price * action.payload.quantity;
                state.successMessage = "Item added to cart Successfully!";
            });
    },
});

export const { addItem, removeItem, clearCart } = cartSlice.actions;

export default cartSlice.reducer;

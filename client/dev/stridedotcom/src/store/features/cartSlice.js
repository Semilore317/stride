import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/components/services/api";

// export const fetchCart = createAsyncThunk("cart/fetchCart", async () => {
//     const response = await api.get("/cart");
//     return response.data;
// });

// export const addToCart = createAsyncThunk("cart/addToCart", async ({ productId, quantity }) => {
//     const response = await api.post("/cartItems/item/add", { productId, quantity });
//     console.log("Cart Slice response", response.data);
//     console.log("Cart Slice response", response.data.data);
//     return response.data.data;
// });

// export const addToCart = createAsyncThunk("cart/addToCart", async ({ productId, quantity }) => {
//     const formData = new FormData();
//     formData.append("productId", productId);
//     formData.append("quantity", quantity);
    
//     const response = await api.post("/cartItems/item/add", formData);
//     console.log("Cart Slice response", response.data);
//     console.log("Cart Slice response", response.data.data);
//     return response.data.data;
// });

export const addToCart = createAsyncThunk(
  "cart/addToCart", 
  async ({ productId, quantity }) => {
    
    const formData = new FormData();
    formData.append("productId", productId);
    formData.append("quantity", quantity);

    const response = await api.post('/cartItems/item/add', formData);
    console.log("Cart Slice response 1: ", response.data);
    console.log("Cart Slice response 2: ", response.data.data);
    return response.data;
  }
);


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
            // .addCase(fetchCart.fulfilled, (state, action) => {
            //     state.items = action.payload.items;
            //     state.totalAmount = action.payload.totalAmount;
            //     state.totalPrice = action.payload.totalPrice;
            // })
            .addCase(addToCart.fulfilled, (state) => {
                // state.items.push(action.payload);
                // state.totalAmount += action.payload.quantity;
                // state.totalPrice += action.payload.price * action.payload.quantity;
                state.successMessage = "Item added to cart Successfully!";
            })
            .addCase(addToCart.rejected, (state, action) => {
                state.errorMessage = action.error.message;
            });
    },
});

// export const { addItem, removeItem, clearCart } = cartSlice.actions;

export default cartSlice.reducer;

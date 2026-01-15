import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/components/services/api";

export const placeOrders = createAsyncThunk(
  "order/placeOrder",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.post(`/orders/user/${userId}/placeOrder`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to place order");
    }
  }
);

const initialState = {
  orders: [],
  loading: false,
  orderDetails: null,
  successMessage: null,
  errorMessage: null,
}

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    // synchronous reducers
  },
  extraReducers: (builder) => {
    // async thunk reducers
    builder
      .addCase(placeOrders.pending, (state) => {
        state.loading = true;
        state.successMessage = null;
        state.errorMessage = null;
      })
      .addCase(placeOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
        //state.successMessage = "Order placed successfully!";
        state.successMessage = action.payload.message || "Order placed successfully!";
      })
      .addCase(placeOrders.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.error.message || "Failed to place order.";
      });
  },
});

export const orderReducer = orderSlice.reducer;
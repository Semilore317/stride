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

export const fetchUserOrders = createAsyncThunk(
  "order/fetchUserOrders",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/orders/user/${userId}/order`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch orders");
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
    clearOrderMessages: (state) => {
      state.successMessage = null;
      state.errorMessage = null;
    },
  },
  extraReducers: (builder) => {
    // async thunk reducers
    builder
      // Place order
      .addCase(placeOrders.pending, (state) => {
        state.loading = true;
        state.successMessage = null;
        state.errorMessage = null;
      })
      .addCase(placeOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message || "Order placed successfully!";
      })
      .addCase(placeOrders.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.payload || "Failed to place order.";
      })
      // Fetch user orders
      .addCase(fetchUserOrders.pending, (state) => {
        state.loading = true;
        state.errorMessage = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.data || [];
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.payload || "Failed to fetch orders.";
      });
  },
});

export const { clearOrderMessages } = orderSlice.actions;
export const orderReducer = orderSlice.reducer;
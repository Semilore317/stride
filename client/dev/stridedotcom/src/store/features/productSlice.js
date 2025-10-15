import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/components/services/api";
import { getDistinctProductsByName } from "@/components/services/ProductService";
import { toast } from "react-toastify";

// fetch ALL products 
export const getAllProducts = createAsyncThunk(
  "product/getAllProducts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/products/all");
      return response.data.data;
    } catch (error) {
      const message = error?.response?.data?.message || error.message || "Failed to fetch products";
      toast.error(`Error fetching products: ${message}`);
      return rejectWithValue(message);
    }
  }
);

// fetch DISTINCT products by name - home page
export const fetchDistinctProducts = createAsyncThunk(
  "product/fetchDistinctProducts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getDistinctProductsByName();
      const products = response.data || [];
      if (!Array.isArray(products)) throw new Error("Fetched products is not an array");
      return products;
    } catch (error) {
      const message = error?.message || "Unknown error occurred";
      toast.error(`Error fetching products: ${message}`);
      return rejectWithValue(message);
    }
  }
);

const initialState = {
  products: [],
  distinctProducts: [],
  errorMessage: null,
  isLoading: false,
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // handle getAllProducts
      .addCase(getAllProducts.pending, (state) => {
        state.isLoading = true;
        state.errorMessage = null;
      })
      .addCase(getAllProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload;
      })
      .addCase(getAllProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload || "Failed to load all products";
      })

      // handle fetchDistinctProducts
      .addCase(fetchDistinctProducts.pending, (state) => {
        state.isLoading = true;
        state.errorMessage = null;
      })
      .addCase(fetchDistinctProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.distinctProducts = action.payload;
      })
      .addCase(fetchDistinctProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload || "Failed to load distinct products";
      });
  },
});

export default productSlice.reducer;

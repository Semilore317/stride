import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/components/services/api";
import { toast } from "react-toastify";

export const getAllProducts = createAsyncThunk(
  "product/getAllProducts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/products/all");
      return response.data.data;
    } catch (error) {
      const message = error?.response?.data?.message || error.message;
      toast.error(`Failed to fetch products: ${message}`);
      return rejectWithValue(message);
    }
  }
);

export const getAllBrands = createAsyncThunk(
  "product/getAllBrands",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/products/distinct/brands");
      return response.data.data;
    } catch (error) {
      const message = error?.response?.data?.message || error.message;
      toast.error(`Failed to fetch brands: ${message}`);
      return rejectWithValue(message);
    }
  }
);

export const getDistinctProductsByName = createAsyncThunk(
  "product/getDistinctProductsByName",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/products/distinct/products");
      const products = response.data.data || [];
      const seenNames = new Set();
      const uniqueByName = products.filter((p) => {
        if (seenNames.has(p.name)) return false;
        seenNames.add(p.name);
        return true;
      });
      return uniqueByName;
    } catch (error) {
      const message = error?.response?.data?.message || error.message;
      toast.error(`Failed to fetch distinct products by name: ${message}`);
      return rejectWithValue(message);
    }
  }
);

export const getDistinctProductsById = createAsyncThunk(
  "product/getDistinctProductsById",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/products/distinct/by-id");
      const products = response.data.data || [];
      const seenIds = new Set();
      const uniqueById = products.filter((p) => {
        if (seenIds.has(p.id)) return false;
        seenIds.add(p.id);
        return true;
      });
      return uniqueById;
    } catch (error) {
      const message = error?.response?.data?.message || error.message;
      toast.error(`Failed to fetch distinct products by ID: ${message}`);
      return rejectWithValue(message);
    }
  }
);

export const getProductsByBrand = createAsyncThunk(
  "product/getProductsByBrand",
  async (brand, { rejectWithValue }) => {
    try {
      const response = await api.get(`/product/by-brand?brand=${encodeURIComponent(brand)}`);
      return response.data.data;
    } catch (error) {
      const message = error?.response?.data?.message || error.message;
      toast.error(`Failed to fetch products by brand: ${message}`);
      return rejectWithValue(message);
    }
  }
);

export const getProductsByCategory = createAsyncThunk(
  "product/getProductsByCategory",
  async (category, { rejectWithValue }) => {
    try {
      const response = await api.get(`/product/${encodeURIComponent(category)}/all/products`);
      return response.data.data;
    } catch (error) {
      const message = error?.response?.data?.message || error.message;
      toast.error(`Failed to fetch products by category: ${message}`);
      return rejectWithValue(message);
    }
  }
);

const initialState = {
  products: [],
  distinctProductsByName: [],
  distinctProductsById: [],
  brands: [],
  selectedBrands: [],
  similarProducts: [],
  quantity: 1,
  errorMessage: null,
  isLoading: true,
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    filterByBrands: (state, action) => {
      const { brand, isChecked } = action.payload;
      if (isChecked) {
        state.selectedBrands.push(brand);
      } else {
        state.selectedBrands = state.selectedBrands.filter((b) => b !== brand);
      }
    },
    decreaseQuantity: (state) => {
      if(state.quantity > 1){
        state.quantity--;
      }
    },
    increaseQuantity: (state) => {
        state.quantity++;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllProducts.fulfilled, (state, action) => {
        state.products = action.payload;
        state.isLoading = false;
        state.errorMessage = null;
      })
      .addCase(getAllProducts.rejected, (state, action) => {
        state.errorMessage = action.payload;
        state.isLoading = false;
      })
      .addCase(getAllBrands.fulfilled, (state, action) => {
        state.brands = action.payload;
        state.isLoading = false;
      })
      .addCase(getDistinctProductsByName.fulfilled, (state, action) => {
        state.distinctProductsByName = action.payload;
        state.isLoading = false;
      })
      .addCase(getDistinctProductsByName.rejected, (state, action) => {
        state.errorMessage = action.payload;
        state.isLoading = false;
      })
      .addCase(getDistinctProductsById.fulfilled, (state, action) => {
        state.distinctProductsById = action.payload;
        state.isLoading = false;
      })
      .addCase(getDistinctProductsById.rejected, (state, action) => {
        state.errorMessage = action.payload;
        state.isLoading = false;
      })
      .addCase(getProductsByBrand.fulfilled, (state, action) => {
        state.similarProducts = action.payload;
        state.isLoading = false;
        state.errorMessage = null;
      })
      .addCase(getProductsByBrand.rejected, (state, action) => {
        state.errorMessage = action.payload;
        state.isLoading = false;
      })
      .addCase(getProductsByCategory.fulfilled, (state, action) => {
        state.similarProducts = action.payload;
        state.isLoading = false;
        state.errorMessage = null;
      })
      .addCase(getProductsByCategory.rejected, (state, action) => {
        state.errorMessage = action.payload;
        state.isLoading = false;
      });
  },
});

export const { filterByBrands, decreaseQuantity, increaseQuantity } = productSlice.actions;
export default productSlice.reducer;
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/components/services/api";

// Login thunk
export const loginUser = createAsyncThunk(
    "auth/loginUser",
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await api.post("/auth/login", credentials);
            const { accessToken } = response.data;

            // Store token in localStorage
            localStorage.setItem("accessToken", accessToken);

            return { accessToken };
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Login failed. Please check your credentials."
            );
        }
    }
);

// Logout thunk
export const logoutUser = createAsyncThunk(
    "auth/logoutUser",
    async (_, { rejectWithValue }) => {
        try {
            // Clear token from localStorage
            localStorage.removeItem("accessToken");
            return null;
        } catch (error) {
            return rejectWithValue("Logout failed.");
        }
    }
);

// Refresh token thunk
export const refreshAccessToken = createAsyncThunk(
    "auth/refreshAccessToken",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.post("/auth/refresh-token");
            const { accessToken } = response.data;

            localStorage.setItem("accessToken", accessToken);

            return { accessToken };
        } catch (error) {
            // If refresh fails, clear stored token
            localStorage.removeItem("accessToken");
            return rejectWithValue("Session expired. Please log in again.");
        }
    }
);

const initialState = {
    accessToken: localStorage.getItem("accessToken") || null,
    isAuthenticated: !!localStorage.getItem("accessToken"),
    loading: false,
    error: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        setToken: (state, action) => {
            state.accessToken = action.payload;
            state.isAuthenticated = !!action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            // Login cases
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.accessToken = action.payload.accessToken;
                state.isAuthenticated = true;
                state.error = null;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.isAuthenticated = false;
            })
            // Logout cases
            .addCase(logoutUser.fulfilled, (state) => {
                state.accessToken = null;
                state.isAuthenticated = false;
                state.loading = false;
                state.error = null;
            })
            // Refresh token cases
            .addCase(refreshAccessToken.fulfilled, (state, action) => {
                state.accessToken = action.payload.accessToken;
                state.isAuthenticated = true;
            })
            .addCase(refreshAccessToken.rejected, (state) => {
                state.accessToken = null;
                state.isAuthenticated = false;
            });
    },
});

export const { clearError, setToken } = authSlice.actions;
export default authSlice.reducer;

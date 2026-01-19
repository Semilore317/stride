import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import {api} from "@/components/services/api";


export const getUserById = createAsyncThunk(
    "users/getUserById",
    async (userId) => {
        try{
            const response = await api.get(`/users/user/${userId}/user`);
            console.log("response", response);
            console.log("response data",response.data);
            console.log("response data data" , response.data.data);
            return response.data;
        }catch(error){
            throw error;
        }
    }
)

export const registerUser = createAsyncThunk(
    "users/registerUser",
    async (user) => {
        try{
            const response = await api.post("/users/add", user);
            console.log(response);
            console.log(response.data);
            console.log(response.data.data);
            return response.data;
        }catch(error){
            throw error;
        }
    }
)

const initialState = {
    user: null,
    loading: false,
    errorMessage: null,

}

const userSlice = createSlice({
    name: "user",
    initialState,
    // reducers: {
    //     setUser: (state, action) => {
    //         state.user = action.payload;
    //         state.loading = true;
    //         state.errorMessage = null;
    //     },
    //     setLoading: (state, action) => {
    //         state.loading = action.payload;
    //     },
    //     setError: (state, action) => {
    //         state.errorMessage = action.payload;
    //         state.loading = false;
    //     }
    // },
    extraReducers: (builder) => {
        builder
            .addCase(getUserById.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = false;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = false;
            })
    }
});


export default userSlice.reducer;
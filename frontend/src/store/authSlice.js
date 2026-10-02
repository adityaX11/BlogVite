import { createSlice } from "@reduxjs/toolkit";
import { apiService } from "../services/api";

const initialState = {
    status: false,
    userData: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, action) => {
            state.status = true;
            state.userData = action.payload.userData;
            // Store JWT access token if provided (new backend)
            if (action.payload.accessToken) {
                apiService.setToken(action.payload.accessToken);
            }
        },
        logout: (state) => {
            state.status = false;
            state.userData = null;
            apiService.clearToken();
        },
    },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
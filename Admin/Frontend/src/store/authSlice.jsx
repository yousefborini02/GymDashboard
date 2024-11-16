import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:4001/api/auth/login",
        {
          email,
          password,
        }
      );
      localStorage.setItem("GymToken", response.data.token);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "An error occurred" }
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: localStorage.getItem("GymToken"),
    isLoading: false,
    error: null,
    isAuthenticated: !!localStorage.getItem("GymToken"),
  },
  reducers: {
    logout: (state) => {
      localStorage.removeItem("GymToken");
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    checkAuthStatus: (state) => {
      const token = localStorage.getItem("GymToken");
      state.isAuthenticated = !!token;
      state.token = token;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        localStorage.setItem("GymToken", action.payload.token);
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload.message;
        state.isAuthenticated = false;
        localStorage.removeItem("GymToken");
      });
  },
});

export const { logout, clearError, checkAuthStatus } = authSlice.actions;

export default authSlice.reducer;

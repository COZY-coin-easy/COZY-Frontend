import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false,
    isShowHeader: false,
    error: "",
  },
  reducers: {
    loginRequest: (state) => {
      state.isLoggedIn = false;
    },
    loginSuccess: (state) => {
      state.isLoggedIn = true;
      state.isShowHeader = true;
    },
    loginFailure: (state, action) => {
      const { message } = action.payload;

      state.error = message;
      state.isLoggedIn = false;
      state.isShowHeader = false;
    },
    logoutRequest: (state) => {
      state.isLoggedIn = true;
    },
    logoutSuccess: (state) => {
      state.user = null;
      state.isLoggedIn = false;
      state.isShowHeader = false;
    },
    visitGuest: (state) => {
      state.isShowHeader = false;
    },
    visitGuestSuccess: (state) => {
      state.isShowHeader = true;
    },
  },
});

export const {
  loginRequest,
  loginSuccess,
  loginFailure,
  logoutRequest,
  logoutSuccess,
  visitGuest,
  visitGuestSuccess,
} = authSlice.actions;

export default authSlice.reducer;

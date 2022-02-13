import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    error: "",
  },
  reducers: {
    getUserData: (state, action) => {
      state.user = Object.assign({}, action.payload);
    },
    logout: (state) => {
      state.user = null;
    },
    orderRequest: (state) => {
      state.user = Object.assign({}, state.user);
    },
    orderSuccess: (state, action) => {
      state.user = Object.assign({}, action.payload);
    },
    orderFailure: (state, action) => {
      const { message } = action.payload;

      state.error = message;
    },
  },
});

export const { getUserData, logout, orderRequest, orderSuccess, orderFailure } =
  userSlice.actions;

export default userSlice.reducer;

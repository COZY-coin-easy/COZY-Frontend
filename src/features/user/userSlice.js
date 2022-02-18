import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: {
      _id: "",
      email: "",
      displayName: "",
      token: "",
      asset: {
        cash: 0,
        coins: [],
      },
      round: [],
      transactionHistory: [],
    },
    isOpenHelpModal: false,
    error: "",
  },
  reducers: {
    getUserData: (state, action) => {
      state.user = Object.assign({}, action.payload);
    },
    logout: (state) => {
      state.user = {
        _id: "",
        email: "",
        displayName: "",
        token: "",
        asset: {
          cash: 0,
          coins: [],
        },
        round: [],
        transactionHistory: [],
      };
    },
    orderRequest: (state) => {
      state.user = Object.assign({}, state.user);
    },
    orderSuccess: (state, action) => {
      state.user = Object.assign({}, action.payload);
    },
    orderFailure: (state, action) => {
      const { message, status } = action.payload.response.data;
      state.error = {
        message,
        status,
      };
    },
    openHelpModal: (state) => {
      state.isOpenHelpModal = true;
    },
    closeHelpModal: (state) => {
      state.isOpenHelpModal = false;
    },
  },
});

export const {
  getUserData,
  logout,
  orderRequest,
  orderSuccess,
  orderFailure,
  openHelpModal,
  closeHelpModal,
} = userSlice.actions;

export default userSlice.reducer;

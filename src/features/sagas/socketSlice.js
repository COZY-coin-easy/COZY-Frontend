import { createSlice } from "@reduxjs/toolkit";

const sagaSlice = createSlice({
  name: "socketCoinList",
  initialState: {
    coinList: "",
    socketCoin: "",
    requestCoin: "",
    requestSocket: "",
  },
  reducers: {
    initialCoinList: (state, action) => {
      state.coinList = action.payload;
    },
    requestCoinList: (state) => {
      state.requestCoin = state;
    },
    socketData: (state, action) => {
      state.socketCoin = action.payload;
    },
    requestSocketData: (state) => {
      state.requestSocket = state;
    },
    socketFailure: (state, action) => {
      const { message } = action.payload;

      state.error = message;
    },
  },
});

export const {
  initialCoinList,
  socketData,
  socketFailure,
  requestCoinList,
  requestSocketData,
} = sagaSlice.actions;

export default sagaSlice.reducer;

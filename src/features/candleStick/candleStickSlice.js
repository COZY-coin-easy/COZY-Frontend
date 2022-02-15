import { createSlice } from "@reduxjs/toolkit";

const candleStickSlice = createSlice({
  name: "candleStick",
  initialState: {
    candleStick: [],
    temp: [],
    error: "",
  },
  reducers: {
    candleStickRequest: (state) => {
      state.temp = [];
    },
    candleStickSuccess: (state, action) => {
      state.candleStick = action.payload;
    },
    candleStickFailure: (state, action) => {
      const { message } = action.payload;
      state.error = message;
    },
  },
});

export const { candleStickRequest, candleStickSuccess, candleStickFailure } =
  candleStickSlice.actions;

export default candleStickSlice.reducer;

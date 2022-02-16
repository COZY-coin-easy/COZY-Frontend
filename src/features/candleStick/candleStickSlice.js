import { createSlice } from "@reduxjs/toolkit";
import { GET_CHART_FAILURE } from "../../constants/messages";

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
      const message = GET_CHART_FAILURE;
      const status = 500;
      state.error = {
        message,
        status,
      };
    },
  },
});

export const { candleStickRequest, candleStickSuccess, candleStickFailure } =
  candleStickSlice.actions;

export default candleStickSlice.reducer;

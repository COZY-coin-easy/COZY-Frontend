import axios from "axios";
import { put, all, fork, takeLatest } from "redux-saga/effects";
import { orderRequest, orderSuccess, orderFailure } from "./userSlice";

function* order({ payload }) {
  const {
    transactionDate,
    currencyName,
    price,
    unitsTraded,
    total,
    token,
    _id,
  } = payload;

  try {
    const res = yield axios.post(
      `${process.env.REACT_APP_ORDER_REQUEST}/${_id}`,
      {
        transactionDate,
        currencyName,
        price,
        unitsTraded,
        total,
      },
      { headers: { authorization: token } }
    );

    if (res.data.result === "거래내역 및 자산 업데이트 성공") {
      const getUserResponse = yield axios.get(
        process.env.REACT_APP_SERVER_URL,
        {
          headers: { authorization: token },
        }
      );

      const updatedUser = {
        ...getUserResponse.data.user,
        token,
      };

      yield put(orderSuccess(updatedUser));
    }
  } catch (err) {
    yield put(orderFailure());
  }
}

function* watchUserOrder() {
  yield takeLatest(orderRequest, order);
}

export function* userSaga() {
  yield all([fork(watchUserOrder)]);
}

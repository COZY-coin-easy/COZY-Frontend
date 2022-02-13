import axios from "axios";
import { call, put, all, fork, take } from "redux-saga/effects";
import {
  initialCoinList,
  socketData,
  socketFailure,
  requestCoinList,
} from "./socketSlice";

function* getCoinList({ payload }) {
  try {
    const ticker = yield axios.get(
      `https://api.bithumb.com/public/ticker/${payload}`
    );
    const tickerList = { ...ticker.data.data };
    console.log("tickerList:::", tickerList);
    yield put(initialCoinList(tickerList));
  } catch (err) {
    yield put(socketFailure(err));
  }
}

function* getSocketData({ payload }) {
  try {
    const realTimeSocketData = { ...payload };
    yield put(socketData(realTimeSocketData));
  } catch (err) {
    yield put(socketFailure(err));
  }
}

function* watchGetCoinList() {
  const data = yield take(requestCoinList);
  yield call(getCoinList, data);
}

function* watchGetSocketData() {
  let data = null;

  while (true) {
    data = yield take(socketData);
    yield call(getSocketData, data);
  }
}

export function* socketSaga() {
  yield all([fork(watchGetCoinList), fork(watchGetSocketData)]);
}

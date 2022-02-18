import axios from "axios";
import { call, put, all, fork, take, actionChannel } from "redux-saga/effects";
import {
  initialCoinList,
  socketData,
  socketFailure,
  requestCoinList,
  requestSocketData,
} from "./socketSlice";

function* getCoinList({ payload }) {
  try {
    const ticker = yield axios.get(
      `https://api.bithumb.com/public/ticker/${payload}`
    );

    const tickerList = { ...ticker.data.data };
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
  const myCoinData = yield take(requestCoinList);
  yield call(getCoinList, myCoinData);
}

function* watchGetSocketData() {
  let socketCoinData = null;

  const requestSocketList = yield actionChannel(requestSocketData);
  while (true) {
    socketCoinData = yield take(requestSocketList);
    yield call(getSocketData, socketCoinData);
  }
}

export function* socketSaga() {
  yield all([fork(watchGetCoinList), fork(watchGetSocketData)]);
}

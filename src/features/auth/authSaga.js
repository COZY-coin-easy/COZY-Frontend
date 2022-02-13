import axios from "axios";
import { put, all, fork, takeLatest } from "redux-saga/effects";
import {
  loginRequest,
  loginSuccess,
  loginFailure,
  logoutRequest,
  logoutSuccess,
  visitGuest,
  visitGuestSuccess,
} from "./authSlice";
import { getUserData, logout } from "../user/userSlice";

function* loginUser({ payload }) {
  const { email, displayName, token } = payload;

  try {
    yield axios.post(process.env.REACT_APP_SERVER_URL, {
      email,
      displayName,
    });

    const getUserResponse = yield axios.get(process.env.REACT_APP_SERVER_URL, {
      headers: { authorization: token },
    });

    const user = {
      ...getUserResponse.data.user,
      token,
    };

    yield put(loginSuccess());
    yield put(getUserData(user));
  } catch (err) {
    yield put(loginFailure(err));
  }
}

function* logoutUser() {
  yield put(logoutSuccess());
  yield put(logout());
}

function* showPreview() {
  yield put(visitGuestSuccess());
}

function* watchUserLogin() {
  yield takeLatest(loginRequest, loginUser);
}

function* watchUserLogout() {
  yield takeLatest(logoutRequest, logoutUser);
}

function* watchVisitGuest() {
  yield takeLatest(visitGuest, showPreview);
}

export function* authSaga() {
  yield all([
    fork(watchUserLogin),
    fork(watchUserLogout),
    fork(watchVisitGuest),
  ]);
}

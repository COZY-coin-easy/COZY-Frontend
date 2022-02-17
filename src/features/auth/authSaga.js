import axios from "axios";
import { put, all, fork, takeLatest } from "redux-saga/effects";
import {
  loginRequest,
  loginSuccess,
  loginFailure,
  logoutRequest,
  logoutSuccess,
} from "./authSlice";
import { getUserData, logout } from "../user/userSlice";

function* loginUser({ payload }) {
  const { email, displayName, token } = payload;

  try {
    const res = yield axios.post(process.env.REACT_APP_SERVER_URL, {
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

    yield put(loginSuccess({ message: res.data.result }));
    yield put(getUserData(user));
  } catch (err) {
    yield put(loginFailure(err));
  }
}

function* logoutUser() {
  yield put(logoutSuccess());
  yield put(logout());
}

function* watchUserLogin() {
  yield takeLatest(loginRequest, loginUser);
}

function* watchUserLogout() {
  yield takeLatest(logoutRequest, logoutUser);
}

export function* authSaga() {
  yield all([fork(watchUserLogin), fork(watchUserLogout)]);
}

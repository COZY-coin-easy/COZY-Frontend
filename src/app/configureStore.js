import { configureStore, combineReducers } from "@reduxjs/toolkit";
import createSagaMiddleWare from "redux-saga";
import { all } from "redux-saga/effects";
import { authSaga } from "../features/auth/authSaga";
import { userSaga } from "../features/user/userSaga";
import { candleStickSaga } from "../features/candleStick/candleStickSaga";
import auth from "../features/auth/authSlice";
import user from "../features/user/userSlice";
import candleStick from "../features/candleStick/candleStickSlice";

const sagaMiddleware = createSagaMiddleWare();

const reducer = combineReducers({
  auth,
  user,
  candleStick,
});

function* rootSaga() {
  yield all([authSaga(), userSaga(), candleStickSaga()]);
}

const store = configureStore({
  reducer: reducer,
  middleware: [sagaMiddleware],
});

sagaMiddleware.run(rootSaga);

export default store;

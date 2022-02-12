import { configureStore, combineReducers } from "@reduxjs/toolkit";
import createSagaMiddleWare from "redux-saga";
import { all } from "redux-saga/effects";
import { authSaga } from "../features/auth/authSaga";
import { userSaga } from "../features/user/userSaga";
import auth from "../features/auth/authSlice";
import user from "../features/user/userSlice";

const sagaMiddleware = createSagaMiddleWare();

const reducer = combineReducers({
  auth,
  user,
});

function* rootSaga() {
  yield all([authSaga(), userSaga()]);
}

const store = configureStore({
  reducer: reducer,
  middleware: [sagaMiddleware],
});

sagaMiddleware.run(rootSaga);

export default store;

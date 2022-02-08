import { combineReducers, createStore } from "redux";
import user from "../features/index";

const reducer = combineReducers({
  user,
});

export const store = createStore(reducer);

export default store;

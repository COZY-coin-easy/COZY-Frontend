import { combineReducers, createStore } from "redux";
import user from "../features/index";

const reducer = combineReducers({
  user,
});

const store = createStore(reducer);

export default store;

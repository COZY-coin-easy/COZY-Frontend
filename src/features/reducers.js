import {
  REGISTER_AUTH,
  REGISTER_TOKEN,
  REGISTER_USER_EMAIL,
  TOGGLE_HEADER,
} from "./types";

const initialState = {
  token: "",
  email: "",
  isLoggedIn: false,
  isShowHeader: false,
};

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case REGISTER_TOKEN: {
      const registerTokenStateCopy = Object.assign({}, state);

      registerTokenStateCopy.token = action.payload;

      return registerTokenStateCopy;
    }
    case REGISTER_USER_EMAIL: {
      const registerUserEmailStateCopy = Object.assign({}, state);

      registerUserEmailStateCopy.email = action.payload;

      return registerUserEmailStateCopy;
    }
    case REGISTER_AUTH: {
      const registerAuthStateCopy = Object.assign({}, state);

      registerAuthStateCopy.isLoggedIn = action.payload;

      return registerAuthStateCopy;
    }
    case TOGGLE_HEADER: {
      const toggleHeaderStateCopy = Object.assign({}, state);

      toggleHeaderStateCopy.isShowHeader = action.payload;

      return toggleHeaderStateCopy;
    }
    default:
      return Object.assign({}, state);
  }
}

import {
  REGISTER_TOKEN,
  REGISTER_USER_EMAIL,
  REGISTER_AUTH,
  TOGGLE_HEADER,
} from "./types";

export function registerToken(token) {
  return { type: REGISTER_TOKEN, payload: token };
}

export function registerUserEmail(email) {
  return { type: REGISTER_USER_EMAIL, payload: email };
}

export function registerAuth(isLoggedIn) {
  return { type: REGISTER_AUTH, payload: isLoggedIn };
}

export function toggleHeader(isShowHeader) {
  return { type: TOGGLE_HEADER, payload: isShowHeader };
}

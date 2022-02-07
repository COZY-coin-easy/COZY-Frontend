import { REGISTER_TOKEN, REGISTER_USER_EMAIL, REGISTER_AUTH } from "./types";

export function registerToken(token) {
  return { type: REGISTER_TOKEN, payload: token };
}

export function registerUserEmail(email) {
  return { type: REGISTER_USER_EMAIL, payload: email };
}

export function registerAuth(isLoggedIn) {
  return { type: REGISTER_AUTH, payload: isLoggedIn };
}

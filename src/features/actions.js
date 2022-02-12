import {
  REGISTER_TOKEN,
  REGISTER_USER_EMAIL,
  REGISTER_AUTH,
  REGISTER_USER_ID,
  TOGGLE_HEADER,
  CHANGE_CHART_COIN,
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

export function registerUserId(userId) {
  return { type: REGISTER_USER_ID, payload: userId };
}

export function toggleHeader(isShowHeader) {
  return { type: TOGGLE_HEADER, payload: isShowHeader };
}

export function changeChartCoin(coin) {
  return { type: CHANGE_CHART_COIN, payload: coin };
}

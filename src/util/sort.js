export function ascendSortAboutName(param1, param2) {
  return param1 < param2 ? -1 : param1 > param2 ? 1 : 0;
}

export function descendSortAboutName(param1, param2) {
  return param1 > param2 ? -1 : param1 < param2 ? 1 : 0;
}

export function ascendSortAboutMoney(param1, param2) {
  if (typeof param1 === "number" && typeof param2 === "number") {
    return param1.toString() - param2.toString() < 0
      ? -1
      : param1.toString() - param2.toString() > 0
      ? 1
      : 0;
  } else {
    return param1 - param2 < 0 ? -1 : param1 - param2 > 0 ? 1 : 0;
  }
}

export function descendSortAboutMoney(param1, param2) {
  if (typeof param1 === "number" && typeof param2 === "number") {
    return param1.toString() - param2.toString() > 0
      ? -1
      : param1.toString() - param2.toString() < 0
      ? 1
      : 0;
  } else {
    return param1 - param2 > 0 ? -1 : param1 - param2 < 0 ? 1 : 0;
  }
}

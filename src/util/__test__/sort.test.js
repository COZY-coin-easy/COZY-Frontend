import {
  ascendSortAboutName,
  descendSortAboutName,
  ascendSortAboutMoney,
  descendSortAboutMoney,
} from "../sort";

test("Mike,Kim 순은 오름 차순이 아닙니다.", () => {
  expect(ascendSortAboutName("Mike", "Kim")).not.toBe(-1);
});

test("Mike,Kim 순은 내림 차순입니다.", () => {
  expect(descendSortAboutName("Mike", "Lee")).toBe(-1);
});

test("Ki,Jang 순은 내림 차순입니다.", () => {
  expect(descendSortAboutName("Ki", "Jang")).toBe(-1);
});

test("1000은 10 보다 큽니다.", () => {
  expect(descendSortAboutMoney(1000, 10)).toBe(-1);
});

test("문자 1000은 문자 10 보다 작지 않습니다.", () => {
  expect(ascendSortAboutMoney("1000", "10")).not.toBe(-1);
});

test("10000원은 1000원 보다 많습니다.", () => {
  expect(ascendSortAboutMoney(10000, 1000)).toBe(1);
});

test("40000원은 1000원 보다 많습니다.", () => {
  expect(descendSortAboutMoney(40000, 1000)).not.toBe(1);
});

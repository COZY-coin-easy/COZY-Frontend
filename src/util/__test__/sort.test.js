import {
  ascendSortAboutName,
  descendSortAboutName,
  ascendSortAboutMoney,
  descendSortAboutMoney,
} from "../sort";

describe("Util/sort.js", () => {
  test("Mike,Kim 순은 오름차순이 아닙다.", () => {
    expect(ascendSortAboutName("Mike", "Kim")).not.toEqual(-1);
  });

  test("Ki,Jang 순은 내림차순입니다.", () => {
    expect(descendSortAboutName("Ki", "Jang")).toEqual(-1);
  });

  test("1000은 10 보다 큽니다.", () => {
    expect(descendSortAboutMoney(1000, 10)).toEqual(-1);
  });

  test("문자 1000은 문자 10 보다 작지 않습니다.", () => {
    expect(ascendSortAboutMoney("1000", "10")).not.toEqual(-1);
  });
});

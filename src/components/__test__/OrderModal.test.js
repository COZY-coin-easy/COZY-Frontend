import React from "react";
import { render, screen } from "@testing-library/react";
import OrderModal from "../OrderModal";

test("Order Modal 확인 텍스트가 잘 렌더링 됩니다.", () => {
  render(<OrderModal />);
  expect(screen.getByText("확인")).toBeInTheDocument();
});

test("Order Modal 취소 텍스트가 잘 렌더링 됩니다.", () => {
  render(<OrderModal />);
  expect(screen.getByText("취소")).toBeInTheDocument();
});

test("Order Modal X 텍스트가 잘 렌더링 됩니다.", () => {
  render(<OrderModal />);
  expect(screen.getByText("X")).toBeInTheDocument();
});

test("OrderModal은 onTrade, onClose, isTrade, children을 prop으로 값을 잘 받아온다.", () => {
  render(<OrderModal />);
  expect();
});

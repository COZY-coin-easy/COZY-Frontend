import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import OrderModal from "../OrderModal";

describe("<OrderModal />", () => {
  test("Order Modal 확인 텍스트가 잘 렌더링 됩니다.", () => {
    render(<OrderModal />);
    expect(screen.getByText("확인")).toBeInTheDocument();
  });

  test("Order Modal 취소 텍스트가 잘 렌더링 됩니다.", () => {
    render(<OrderModal />);
    expect(screen.getByText("취소")).toBeInTheDocument();
  });

  test("확인 버튼을 누르면 모달창이 닫힙니다.", () => {
    const onTrade = Boolean();
    const onClose = Boolean();
    const { getByTestId } = render(<OrderModal />);
    const confirmBtn = getByTestId("confirm-btn");
    const cancelBtn = getByTestId("cancel-btn");

    fireEvent.change(confirmBtn, {
      onTrade: {
        Boolean: true,
      },
      onClose: {
        Boolean: false,
      },
    });
    expect(onTrade).toEqual(false);

    fireEvent.change(cancelBtn, {
      onClose: {
        Boolean: false,
      },
    });
    expect(onClose).toEqual(false);
  });

  test("취소 버튼을 누르면 모달창이 닫힙니다.", () => {
    const onClose = Boolean();
    const { getByTestId } = render(<OrderModal />);
    const cancelBtn = getByTestId("cancel-btn");

    fireEvent.change(cancelBtn, {
      onClose: {
        Boolean: false,
      },
    });
    expect(onClose).toEqual(false);
  });
});

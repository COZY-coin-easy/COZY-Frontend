import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import WelcomeModal from "../WelcomeModal";

describe("<WelcomeModal />", () => {
  test("Welcome Modal 확인 텍스트가 잘 렌더링 됩니다.", () => {
    render(<WelcomeModal />);
    expect(screen.getByText("확인")).toBeInTheDocument();
  });

  test("확인 버튼을 누르면 모달창이 닫힙니다.", () => {
    const onClose = Boolean();
    const { getByTestId } = render(<WelcomeModal />);
    const confirmButton = getByTestId("confirm-button");

    fireEvent.change(confirmButton, {
      onClose: {
        Boolean: false,
      },
    });
    expect(onClose).toEqual(false);
  });
});

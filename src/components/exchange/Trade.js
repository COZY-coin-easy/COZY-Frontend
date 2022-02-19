import React from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";

import Chart from "./Chart";
import Order from "./Order";
import HelpModal from "../modal/HelpModal";
import ErrorView from "../errorView/ErrorView";
import { openHelpModal, closeHelpModal } from "../../features/user/userSlice";
import { MAIN_COLOR_1, WHITE } from "../../constants/styles";

export default function Trade() {
  const dispatch = useDispatch();
  const isOpenHelpModal = useSelector((state) => state.user.isOpenHelpModal);
  const chartError = useSelector((state) => state.candleStick.error);
  const orderError = useSelector((state) => state.user.error);
  const displayName = useSelector((state) => state.user.displayName);

  return chartError || orderError ? (
    <ErrorView>
      <>
        <div>{chartError ? chartError.message : orderError.message}</div>
        <div>{chartError ? chartError.status : orderError.status}</div>
      </>
    </ErrorView>
  ) : (
    <TradeWrapper>
      <Chart />
      <Order />
      <button className="help-button" onClick={() => dispatch(openHelpModal())}>
        도움말
      </button>
      {isOpenHelpModal && (
        <HelpModal onClose={() => dispatch(closeHelpModal())}>
          <>
            <p>매수란 ? 코인을 산다는 의미입니다. </p>
            <p>매도란 ? 코인을 판다는 의미입니다.</p>
            <p>
              평균매수가란 ? 매수한 코인의 평균 매입가입니다. 쉽게 말해서{" "}
              {displayName}님이 평균적으로 얼마정도에 코인을 매수했냐 를 뜻하는
              단어가 평균매수가입니다.
            </p>
          </>
        </HelpModal>
      )}
    </TradeWrapper>
  );
}

const TradeWrapper = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;

  .help-button {
    cursor: pointer;
    position: fixed;
    bottom: 5%;
    right: 2%;
    padding: 35px 25px;
    border: none;
    border-radius: 50%;
    font-size: 20px;
    font-weight: 200;
    color: ${WHITE};
    background-color: ${MAIN_COLOR_1};
    opacity: 80%;
    transition: 0.2s;
  }

  .help-button:hover {
    padding: 40px 30px;
    opacity: 100%;
    transition: 0.2s;
  }
`;

import React from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";

import Chart from "./Chart";
import Order from "./Order";
import ErrorView from "../error/ErrorView";

export default function Trade() {
  const chartError = useSelector((state) => state.candleStick.error);
  const orderError = useSelector((state) => state.user.error);

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
    </TradeWrapper>
  );
}

const TradeWrapper = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
`;

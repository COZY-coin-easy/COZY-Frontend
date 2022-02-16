import React from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";

import Chart from "../components/Chart";
import Order from "../components/Order";
import Error from "./Error";

const TradeWrapper = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
`;

export default function Trade() {
  const chartError = useSelector((state) => state.candleStick.error);
  const orderError = useSelector((state) => state.user.error);

  return chartError || orderError ? (
    <Error>
      <>
        <div>{chartError ? chartError.message : orderError.message}</div>
        <div>{chartError ? chartError.status : orderError.status}</div>
      </>
    </Error>
  ) : (
    <TradeWrapper>
      <Chart />
      <Order />
    </TradeWrapper>
  );
}

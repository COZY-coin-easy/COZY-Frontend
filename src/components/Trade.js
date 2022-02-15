import React from "react";
import Chart from "../components/Chart";
import Order from "../components/Order";
import styled from "styled-components";

const TradeWrapper = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
`;

export default function Trade() {
  return (
    <TradeWrapper>
      <Chart />
      <Order />
    </TradeWrapper>
  );
}

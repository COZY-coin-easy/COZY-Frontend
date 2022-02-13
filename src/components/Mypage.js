import React from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";

const Span = styled.span`
  margin-left: 20px;
  font-weight: bold;
`;

const Div = styled.div`
  margin-left: 10px;
`;

export default function MyPage() {
  const user = useSelector((state) => state.user.user);

  const getFinalMoney = (coins) => {
    let finalMoney = 0;

    coins.forEach((coin) => {
      finalMoney = finalMoney + coin.averagePrice * coin.quantity;
    });

    return finalMoney;
  };

  const getYield = (init, final) => {
    const initialMoney = Number(init);
    const finalMoney = Number(final);

    return ((finalMoney - initialMoney) / initialMoney) * 100;
  };
  return (
    <>
      <h3>{`이름: ${user.displayName}`} </h3>
      <h3>{`E-mail: ${user.email}`} </h3>
      <h3>회차별 내용</h3>

      <Span>회차</Span>
      <Span>시작 금액</Span>
      <Span>최종 금액</Span>
      <Span>수익률</Span>

      <Div>
        <Span>1</Span>
        <Span>{user.asset.cash}</Span>
        <Span>{getFinalMoney(user.asset.coins)}</Span>
        <Span>{`${getYield(
          user.asset.cash,
          getFinalMoney(user.asset.coins)
        )}%`}</Span>
      </Div>
    </>
  );
}

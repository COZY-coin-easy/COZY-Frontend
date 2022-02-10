import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import styled from "styled-components";
import assetMock from "../assetMockData.json";

const Span = styled.span`
  margin-left: 20px;
  font-weight: bold;
`;

const Div = styled.div`
  margin-left: 10px;
`;

export default function MyPage() {
  const userId = useSelector((state) => state.user.userId);
  const token = useSelector((state) => state.user.token);
  const email = useSelector((state) => state.user.email);
  const [userInfo, setUserInfo] = useState({});

  useEffect(() => {
    const fetchUserData = async () => {
      const res = await axios.get(
        `${process.env.REACT_APP_MYPAGE_REQUEST}${userId}`,
        {
          headers: {
            authorization: token,
          },
        }
      );

      setUserInfo(res.data.userInfo);
    };

    fetchUserData();
  }, []);

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
      <h3>{`이름: ${userInfo.username}`} </h3>
      <h3>{`E-mail: ${email}`} </h3>
      <h3>회차별 내용</h3>

      <Span>회차</Span>
      <Span>시작 금액</Span>
      <Span>최종 금액</Span>
      <Span>수익률</Span>

      <Div>
        <Span>1</Span>
        <Span>{assetMock.asset.cash}</Span>
        <Span>{getFinalMoney(assetMock.asset.coins)}</Span>
        <Span>
          {`${getYield(
            assetMock.asset.cash,
            getFinalMoney(assetMock.asset.coins)
          )}%`}
        </Span>
      </Div>
    </>
  );
}

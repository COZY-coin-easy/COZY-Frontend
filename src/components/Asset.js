import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import styled from "styled-components";

export default function Asset() {
  const userId = useSelector((state) => state.user.userId);
  const token = useSelector((state) => state.user.token);
  const [assetList, setAssetList] = useState({});

  const ownedCash = assetList.asset.cash;
  const ownedCoinList = assetList.asset.coins;

  useEffect(() => {
    const fetchAssetData = async function () {
      const res = await axios.get(
        `http://localhost:8000/users/asset/${userId}`,
        {
          headers: { authorization: token },
        }
      );

      setAssetList(res.data.userAsset);
    };

    fetchAssetData();
  }, []);

  const getCurrentLeftMoney = (asset) => {
    const leftMoney =
      Number(ownedCash) - Number(asset.averagePrice * asset.quantity);
    return leftMoney;
  };

  const Span = styled.span`
    margin-left: 20px;
    font-weight: bold;
  `;

  const Div = styled.div`
    margin-left: 10px;
  `;

  return (
    <>
      <Span>코인명</Span>
      <Span>보유 잔고</Span>
      <Span>평균 매수가</Span>
      <Span>매수 금액</Span>
      <Span>평가 금액</Span>
      <Span>펑가 순익</Span>
      <Span>수익률</Span>

      {ownedCoinList.map((coinElements, index) => {
        return (
          <Div key={coinElements.currencyName}>
            <Span>{coinElements.currencyName}</Span>
            <Span>{`${getCurrentLeftMoney(coinElements)}원`}</Span>
            <Span>{coinElements.averagePrice}</Span>
          </Div>
        );
      })}
    </>
  );
}

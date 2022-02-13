import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import assetMock from "../assetMockData.json";
import axios from "axios";

const Span = styled.span`
  margin-left: 20px;
  font-weight: bold;
`;

const Div = styled.div`
  margin-left: 10px;
`;

export default function Asset() {
  // const { asset } = useSelector((state) => state.user.user);

  // const ownedCash = asset.cash;
  // const ownedCoinList = asset.coins;

  const userId = useSelector((state) => state.user.userId);
  const token = useSelector((state) => state.user.token);
  const [assetList, setAssetList] = useState({});
  const [isSort, setIsSort] = useState(false);

  const ownedCash = assetMock.asset.cash;
  const ownedCoinList = assetMock.asset.coins;
  let coinListForRender = null;

  useEffect(() => {
    const fetchAssetData = async function () {
      const res = await axios.get(
        `${process.env.REACT_APP_ASSET_REQUEST}/${userId}`,
        {
          headers: { authorization: token },
        }
      );

      setAssetList(res.data.userAsset);
    };

    fetchAssetData();
  }, []);

  const getCurrentLeftMoney = (coin) => {
    const leftMoney =
      Number(ownedCash) - Number(coin.averagePrice * coin.quantity);
    return leftMoney;
  };

  const ascendCoinName = () => {
    setIsSort(true);
    return (coinListForRender = ownedCoinList.sort(function (a, b) {
      return a.currencyName < b.currencyName
        ? -1
        : a.currencyName > b.currencyName
        ? 1
        : 0;
    }));
  };

  return (
    <>
      <Span>
        자산 구분 <button onClick={ascendCoinName}>↕️</button>
      </Span>
      <Span>보유 잔고</Span>
      <Span>평균 매수가</Span>
      <Span>매수 금액</Span>
      <Span>평가 금액</Span>
      <Span>펑가 순익</Span>
      <Span>수익률</Span>

      {!isSort
        ? ownedCoinList.map((coinElements) => {
            console.log("!!!!", coinElements);
            return (
              <Div key={coinElements.currencyName}>
                <Span>{coinElements.currencyName}</Span>
                <Span>{`${getCurrentLeftMoney(coinElements)}원`}</Span>
                <Span>{coinElements.averagePrice}</Span>
              </Div>
            );
          })
        : coinListForRender.map((coinElements) => {
            console.log("!!!!", coinElements);
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

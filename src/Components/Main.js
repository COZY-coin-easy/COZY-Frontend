import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

export default function Main() {
  const ws = new WebSocket(process.env.REACT_APP_WEBSOCKET_SERVER_URL);
  const [coinDataList, setCoinDataList] = useState({});

  useEffect(() => {
    ws.onmessage = (event) => {
      const res = JSON.parse(event.data);
      setCoinDataList(res.data);
      ws.send("클라이언트에서 서버로 답장을 보냅니다.");
    };

    ws.onerror = (error) => {
      console.error(error);
    };
  }, []);

  const coinName = Object.keys(coinDataList);
  const coinNameList = coinName.slice(0, coinName.length - 1);

  const coinCurrentPrice = Object.values(coinDataList).map((element) => {
    return element["closing_price"];
  });
  const coinCurrentPriceList = coinCurrentPrice.slice(
    0,
    coinCurrentPrice.length - 1
  );

  const coinChangeRate = Object.values(coinDataList).map((element) => {
    return element["fluctate_rate_24H"];
  });
  const coinChangeRateList = coinChangeRate.slice(0, coinChangeRate.length - 1);

  const coinTradePrice = Object.values(coinDataList).map((element) => {
    return element["acc_trade_value_24H"];
  });
  const coinTradePriceList = coinTradePrice.slice(0, coinTradePrice.length - 1);

  const HeadWrapper = styled.span`
    border: solid 1px black;
    font-weight: bold;
  `;

  const BodyWrapper = styled.div`
    display: flex;
  `;

  return (
    <div>
      <HeadWrapper>
        <span>비트 코인 </span>
        <span> 실시간 시세 </span>
        <span> 변동률 </span>
        <span> 거래 금액</span>
      </HeadWrapper>

      <BodyWrapper>
        <div>
          {coinNameList.map((list, index) => {
            return (
              <p key={index}>
                <Link to={`/trade/${list}`}>{list}</Link>
              </p>
            );
          })}
        </div>

        <div>
          {coinCurrentPriceList.map((list, index) => {
            return <p key={index}>{`${list}원`}</p>;
          })}
        </div>

        <div>
          {coinChangeRateList.map((list, index) => {
            return <p key={index}>{`${list}%`}</p>;
          })}
        </div>

        <div>
          {coinTradePriceList.map((list, index) => {
            return <p key={index}>{`${list}원`}</p>;
          })}
        </div>
      </BodyWrapper>
    </div>
  );
}

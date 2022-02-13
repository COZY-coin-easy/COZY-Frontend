import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import {
  initialCoinList,
  socketData,
  requestCoinList,
} from "../features/sagas/socketSlice";

const BodyWrapper = styled.div`
  display: flex;
  margin: 5px;
`;

const Wrapper = styled.div`
  margin-left: 10px;
  margin-right: 10px;
`;

const Red = styled.div`
  margin-left: 10px;
  margin-right: 10px;
  color: red;
`;

const Blue = styled.div`
  margin-left: 10px;
  margin-right: 10px;
  color: blue;
`;

export default function Main() {
  const ws = new WebSocket(process.env.REACT_APP_WEBSOCKET_SERVER_URL);
  const [coinList, setCoinList] = useState([]);
  const [searchCoin, setSearchCoin] = useState("");

  const dispatch = useDispatch();

  const tickerCoinList = useSelector((state) => state.socket.coinList);
  const realTimeCoin = useSelector((state) => state.socket.socketCoin);

  useEffect(() => {
    const myCoin = "ALL";

    const fetchCoinList = function () {
      dispatch(requestCoinList(myCoin));
    };

    fetchCoinList();

    const coinName = Object.keys(tickerCoinList);
    const coinInfo = Object.values(tickerCoinList);

    coinName.pop();
    coinInfo.pop();

    for (let i = 0; i < coinInfo.length; i++) {
      coinInfo[i].currency_name = coinName[i];
    }

    setCoinList(coinInfo);
  }, []);

  useEffect(() => {
    ws.onmessage = (event) => {
      const res = JSON.parse(event.data);

      dispatch(socketData(res.content));
      ws.send("클라이언트에서 서버로 답장을 보냅니다.");
    };

    ws.onerror = (error) => {
      console.error(error);
    };
  }, []);

  const filteredCoinList =
    searchCoin === ""
      ? coinList
      : coinList.filter((coin) => coin.currency_name === searchCoin);

  const handleClickSearch = () => {
    const coinName = document.getElementById("coin-search").value;
    setSearchCoin(coinName);
  };

  const handleKeyUpSearch = (e) => {
    if (e.key === "Enter") {
      const coinName = e.target.value;
      setSearchCoin(coinName);
    }
  };

  const handleClickRefreshFilter = () => {
    document.getElementById("coin-search").value = "";
    setSearchCoin("");
  };

  return (
    <div>
      <input
        onKeyUp={handleKeyUpSearch}
        placeholder="자산구분"
        id="coin-search"
      ></input>
      <button onClick={handleClickSearch}>검색</button>
      <button onClick={handleClickRefreshFilter}>전체목록 보기</button>
      <BodyWrapper>
        <Wrapper>자산</Wrapper>
        <Wrapper>실시간 시세</Wrapper>
        <Wrapper>변동률</Wrapper>
        <Wrapper>거래금액</Wrapper>
      </BodyWrapper>

      {/* {filteredCoinList.length ? (
        filteredCoinList.map((coin) => (
          <BodyWrapper key={coin.symbol}>
            <Wrapper>
              <Link to={`/trade/${coin.symbol}`}>{coin.symbol}</Link>
            </Wrapper>
            <Wrapper>{coin.closing_price}원</Wrapper>
            {coin.fluctate_rate_24H > 0 ? (
              <Red>{coin.fluctate_rate_24H}%</Red>
            ) : (
              <Blue>{coin.fluctate_rate_24H}%</Blue>
            )}
            <Wrapper>{coin.acc_trade_value_24H}</Wrapper>
          </BodyWrapper>
        ))
      ) : (
        <h4>검색 결과가 없습니다</h4>
      )} */}
    </div>
  );
}

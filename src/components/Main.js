import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import {
  requestCoinList,
  requestSocketData,
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
  const [isAscendSort, setIsAscendSort] = useState({
    isName: true,
    isCurrentPrice: true,
    isRateOfChange: true,
    isTransactionAmount: true,
  });

  const { isName, isCurrentPrice, isRateOfChange, isTransactionAmount } =
    isAscendSort;

  const dispatch = useDispatch();

  const tickerCoinList = useSelector((state) => state.socket.coinList);
  const realTimeCoin = useSelector((state) => state.socket.socketCoin);

  useEffect(() => {
    const myCoin = "ALL";

    dispatch(requestCoinList(myCoin));
  }, []);

  useEffect(() => {
    const parsedTickerCoin = JSON.parse(JSON.stringify(tickerCoinList));
    const coinName = Object.keys(parsedTickerCoin);
    const coinInfo = Object.values(parsedTickerCoin);

    coinName.pop();
    coinInfo.pop();

    for (let i = 0; i < coinInfo.length; i++) {
      coinInfo[i].currency_name = coinName[i];
    }

    setCoinList(coinInfo);
  }, [tickerCoinList]);

  useEffect(() => {
    ws.onmessage = (event) => {
      const res = JSON.parse(event.data);
      const socketCoinData = res.content;

      dispatch(requestSocketData(socketCoinData));
      ws.send("클라이언트에서 서버로 답장을 보냅니다.");
    };

    ws.onerror = (error) => {
      console.error(error);
    };

    return () => {
      ws.close();
    };
  }, []);

  const filteredCoinList =
    searchCoin === ""
      ? coinList
      : coinList.filter((coin) => coin.currency_name === searchCoin);

  coinList.forEach((coin) => {
    if (realTimeCoin.symbol) {
      if (coin.currency_name === realTimeCoin.symbol.slice(0, 3)) {
        coin.closing_price = realTimeCoin.closePrice;
        coin.fluctate_rate_24H = realTimeCoin.chgRate;
        coin.acc_trade_value_24H = realTimeCoin.value;
      }

      return coin;
    }
  });

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

  const sortingByCoinName = () => {
    setIsAscendSort({
      ...isAscendSort,
      isName: !isName,
    });

    isName
      ? coinList.sort((a, b) => {
          return a.currency_name > b.currency_name
            ? -1
            : a.currency_name < b.currency_name
            ? 1
            : 0;
        })
      : coinList.sort((a, b) => {
          return a.currency_name < b.currency_name
            ? -1
            : a.currency_name > b.currency_name
            ? 1
            : 0;
        });
  };

  const sortingByCurrentPrice = () => {
    setIsAscendSort({
      ...isAscendSort,
      isCurrentPrice: !isCurrentPrice,
    });

    isCurrentPrice
      ? coinList.sort((a, b) => {
          return b.closing_price - a.closing_price;
        })
      : coinList.sort((a, b) => {
          return a.closing_price - b.closing_price;
        });
  };

  const sortingByRateOfChange = () => {
    setIsAscendSort({
      ...isAscendSort,
      isRateOfChange: !isRateOfChange,
    });

    isRateOfChange
      ? coinList.sort((a, b) => {
          return b.fluctate_rate_24H - a.fluctate_rate_24H;
        })
      : coinList.sort((a, b) => {
          return a.fluctate_rate_24H - b.fluctate_rate_24H;
        });
  };

  const sortingByTransactionAmount = () => {
    setIsAscendSort({
      ...isAscendSort,
      isTransactionAmount: !isTransactionAmount,
    });

    isTransactionAmount
      ? coinList.sort((a, b) => {
          return b.acc_trade_value_24H - a.acc_trade_value_24H;
        })
      : coinList.sort((a, b) => {
          return a.acc_trade_value_24H - b.acc_trade_value_24H;
        });
  };

  return (
    <div>
      <input
        onKeyUp={handleKeyUpSearch}
        placeholder="자산구분"
        id="coin-search"
      />
      <button onClick={handleClickSearch}>검색</button>
      <button onClick={handleClickRefreshFilter}>전체목록 보기</button>
      <BodyWrapper>
        <Wrapper>
          자산
          <button onClick={sortingByCoinName}>{isName ? "🔼" : "🔽"}</button>
        </Wrapper>
        <Wrapper>
          실시간 시세
          <button onClick={sortingByCurrentPrice}>
            {isCurrentPrice ? "🔼" : "🔽"}
          </button>
        </Wrapper>
        <Wrapper>
          변동률
          <button onClick={sortingByRateOfChange}>
            {isRateOfChange ? "🔼" : "🔽"}
          </button>
        </Wrapper>
        <Wrapper>
          거래금액
          <button onClick={sortingByTransactionAmount}>
            {isTransactionAmount ? "🔼" : "🔽"}
          </button>
        </Wrapper>
      </BodyWrapper>

      {filteredCoinList.length ? (
        filteredCoinList.map((coin) => (
          <BodyWrapper key={coin.currency_name}>
            <Wrapper>
              <Link to={`/trade/${coin.currency_name}`}>
                {coin.currency_name}
              </Link>
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
      )}
    </div>
  );
}

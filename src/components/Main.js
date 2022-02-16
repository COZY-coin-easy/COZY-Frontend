import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import {
  requestCoinList,
  requestSocketData,
} from "../features/sagas/socketSlice";
import {
  WHITE,
  BLACK,
  LIGHT_GREY,
  MAIN_COLOR_1,
  MAIN_COLOR_3,
  RED,
  BLUE,
} from "../constants/styles";

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
    <>
      <Anchor />
      <SearchDiv>
        <Input
          onKeyUp={handleKeyUpSearch}
          placeholder="자산구분"
          id="coin-search"
        />
        <Button onClick={handleClickSearch}>검색</Button>
        <Button onClick={handleClickRefreshFilter}>전체목록 보기</Button>
      </SearchDiv>
      <TitleBodyWrapper>
        <Wrapper>
          자산
          <SortButton onClick={sortingByCoinName}>
            {isName ? "🔼" : "🔽"}
          </SortButton>
        </Wrapper>
        <CashWrapper style={{ textAlign: "center" }}>
          실시간 시세
          <SortButton onClick={sortingByCurrentPrice}>
            {isCurrentPrice ? "🔼" : "🔽"}
          </SortButton>
        </CashWrapper>
        <Wrapper>
          변동률
          <SortButton onClick={sortingByRateOfChange}>
            {isRateOfChange ? "🔼" : "🔽"}
          </SortButton>
        </Wrapper>
        <CashWrapper>
          거래금액
          <SortButton onClick={sortingByTransactionAmount}>
            {isTransactionAmount ? "🔼" : "🔽"}
          </SortButton>
        </CashWrapper>
      </TitleBodyWrapper>
      <Line />

      {filteredCoinList.length ? (
        filteredCoinList.map((coin) => (
          <div key={coin.currency_name}>
            <BodyWrapper>
              <Wrapper>
                <CoinLink to={`/trade/${coin.currency_name}`}>
                  {coin.currency_name}
                </CoinLink>
              </Wrapper>
              <CashWrapper>
                {Number(coin.closing_price).toLocaleString()} 원
              </CashWrapper>
              {coin.fluctate_rate_24H > 0 ? (
                <Red>{coin.fluctate_rate_24H}%</Red>
              ) : (
                <Blue>{coin.fluctate_rate_24H}%</Blue>
              )}
              <CashWrapper>
                {Math.round(coin.acc_trade_value_24H).toLocaleString()} 원
              </CashWrapper>
            </BodyWrapper>
            <Line />
          </div>
        ))
      ) : (
        <h4>검색 결과가 없습니다</h4>
      )}
    </>
  );
}

const Anchor = styled.span`
  display: block;
  height: 80px;
  visibility: hidden;
`;

const BodyWrapper = styled.div`
  display: flex;
  margin: 10px 5px;
  justify-content: space-around;
`;

const TitleBodyWrapper = styled(BodyWrapper)`
  text-align: center;
  font-size: 1rem;
  font-weight: 500;
  margin: 10px 5px 0px 5px;
`;

const Wrapper = styled.div`
  margin-left: 30px;
  margin-right: 30px;
  color: ${BLACK};
  width: 15%;
  text-align: center;
`;

const Red = styled(Wrapper)`
  color: ${RED};
`;

const Blue = styled(Wrapper)`
  color: ${BLUE};
`;

const CashWrapper = styled(Wrapper)`
  text-align: right;
  width: 25%;
`;

const Input = styled.input`
  height: 30px;
  margin: 0px 10px;
`;

const Button = styled.button`
  height: 35px;
  background: ${WHITE};
  color: ${MAIN_COLOR_1};
  border-color: ${WHITE};
  border-style: none;
  border-radius: 0.2rem;
  cursor: pointer;
  margin: 0px 10px;

  :hover {
    background-color: ${MAIN_COLOR_3};
    border-color: ${MAIN_COLOR_3};
    color: ${WHITE};
    transition: 0.2s;
  }
`;

const SortButton = styled(Button)`
  :hover {
    background-color: ${WHITE};
    border-color: ${WHITE};
  }
`;

const CoinLink = styled(NavLink)`
  text-decoration: none;
  color: ${BLACK};
  width: 20%;
`;

const Line = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${LIGHT_GREY};
`;

const SearchDiv = styled.div`
  display: flex;
  justify-content: flex-end;
`;

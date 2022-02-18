import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import WelcomeModal from "../modal/WelcomeModal";
import ErrorView from "../error/ErrorView";
import {
  requestCoinList,
  requestSocketData,
} from "../../features/socket/socketSlice";
import { closeModal } from "../../features/auth/authSlice";
import {
  ascendSortAboutName,
  descendSortAboutName,
  ascendSortAboutMoney,
  descendSortAboutMoney,
} from "../../util/sort";
import {
  WHITE,
  BLACK,
  LIGHT_GREY,
  MAIN_COLOR_1,
  MAIN_COLOR_3,
  RED,
  BLUE,
} from "../../constants/styles";
import { ALL_KRW } from "../../constants/messages";

export default function Main() {
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

  const error = useSelector((state) => state.auth.error);
  const { displayName, asset } = useSelector((state) => state.user.user);
  const tickerCoinList = useSelector((state) => state.socket.coinList);
  const realTimeCoin = useSelector((state) => state.socket.socketCoin);
  const isSignUp = useSelector((state) => state.auth.isSignUp);

  useEffect(() => {
    dispatch(requestCoinList(ALL_KRW));
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
  }, []);

  useEffect(() => {
    const ws = new WebSocket(process.env.REACT_APP_WEBSOCKET_SERVER_URL);

    ws.onmessage = (event) => {
      const res = JSON.parse(event.data);
      const socketCoinData = res.content;

      dispatch(requestSocketData(socketCoinData));
    };

    ws.onerror = (error) => {
      console.error(error);
    };

    return () => {
      ws.close();
    };
  }, [dispatch]);

  const filteredCoinList =
    searchCoin === ""
      ? coinList
      : coinList.filter((coin) => coin.currency_name === searchCoin);

  coinList.forEach((coin) => {
    if (realTimeCoin.symbol) {
      if (coin.currency_name === realTimeCoin.symbol.split("_")[0]) {
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
      ? coinList.sort((a, b) =>
          descendSortAboutName(a.currency_name, b.currency_name)
        )
      : coinList.sort((a, b) =>
          ascendSortAboutName(a.currency_name, b.currency_name)
        );
  };

  const sortingByCurrentPrice = () => {
    setIsAscendSort({
      ...isAscendSort,
      isCurrentPrice: !isCurrentPrice,
    });

    isCurrentPrice
      ? coinList.sort((a, b) =>
          descendSortAboutMoney(a.closing_price, b.closing_price)
        )
      : coinList.sort((a, b) =>
          ascendSortAboutMoney(a.closing_price, b.closing_price)
        );
  };

  const sortingByRateOfChange = () => {
    setIsAscendSort({
      ...isAscendSort,
      isRateOfChange: !isRateOfChange,
    });

    isRateOfChange
      ? coinList.sort((a, b) =>
          descendSortAboutMoney(a.fluctate_rate_24H, b.fluctate_rate_24H)
        )
      : coinList.sort((a, b) =>
          ascendSortAboutMoney(a.fluctate_rate_24H, b.fluctate_rate_24H)
        );
  };

  const sortingByTransactionAmount = () => {
    setIsAscendSort({
      ...isAscendSort,
      isTransactionAmount: !isTransactionAmount,
    });

    isTransactionAmount
      ? coinList.sort((a, b) =>
          descendSortAboutMoney(a.acc_trade_value_24H, b.acc_trade_value_24H)
        )
      : coinList.sort((a, b) =>
          ascendSortAboutMoney(a.acc_trade_value_24H, b.acc_trade_value_24H)
        );
  };

  return !error ? (
    <div>
      <Anchor />
      <SearchDiv>
        <Input
          onKeyUp={handleKeyUpSearch}
          placeholder="자산구분"
          id="coin-search"
          type="text"
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
        <CashWrapper style={{ textAlign: "center" }}>
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
        <Message>검색 결과가 없습니다</Message>
      )}

      {isSignUp && (
        <WelcomeModal onClose={() => dispatch(closeModal())}>
          <>
            <p>환영합니다 ! {displayName}님</p>
            <p>{displayName}님에게 초기 투자 자본으로 </p>
            <p>{asset.cash.toLocaleString()}원이 지급되었습니다.</p>
          </>
        </WelcomeModal>
      )}
    </div>
  ) : (
    <ErrorView>
      <>
        <div>{error.message}</div>
        <div>{error.status}</div>
      </>
    </ErrorView>
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
  width: 8%;
  text-align: center;
`;

const Red = styled(Wrapper)`
  color: ${RED};
`;

const Blue = styled(Wrapper)`
  color: ${BLUE};
`;

const CashWrapper = styled(Wrapper)`
  text-align: center;
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

const Message = styled.h4`
  text-align: center;
`;

import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import { NavLink } from "react-router-dom";
import HelpModal from "../modal/HelpModal";
import { signInWithGoogle } from "../../firebase";
import { openHelpModal, closeHelpModal } from "../../features/user/userSlice";
import {
  ascendSortAboutName,
  descendSortAboutName,
  ascendSortAboutMoney,
  descendSortAboutMoney,
} from "../../util/sort";
import {
  MAIN_COLOR_1,
  MAIN_COLOR_2,
  MAIN_COLOR_3,
  WHITE,
  BLACK,
  LIGHT_GREY,
  RED,
  BLUE,
} from "../../constants/styles";

export default function Asset() {
  const dispatch = useDispatch();
  const { displayName, asset, isOpenHelpModal } = useSelector(
    (state) => state.user.user
  );
  const tickerCoinList = useSelector((state) => state.socket.coinList);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const ownedCoinList = asset.coins;

  const [coinList, setCoinList] = useState([]);
  const [newCoinList, setNewCoinList] = useState([]);
  const [socketData, setSocketData] = useState("");
  const [renderedAssetList, setRenderedAssetList] = useState({});
  const [isSortBtnClick, setIsSortBtnClick] = useState(false);

  const [isAscendSort, setIsAscendSort] = useState({
    isName: true,
    isLeftMoney: true,
    isAvgPrice: true,
    isBoughtPrice: true,
    isEvaluatedPrice: true,
    isEvaluatedProfit: true,
    isYieldRate: true,
  });

  const {
    isName,
    isLeftMoney,
    isAvgPrice,
    isBoughtPrice,
    isEvaluatedPrice,
    isEvaluatedProfit,
    isYieldRate,
  } = isAscendSort;

  useEffect(() => {
    const ws = new WebSocket(process.env.REACT_APP_WEBSOCKET_SERVER_URL);

    ws.onmessage = (event) => {
      const res = JSON.parse(event.data);
      const socketCoinData = res.content;
      const socketCoinName = socketCoinData.symbol.split("_")[0];
      const socketCoinCurrentPrice = socketCoinData.closePrice;
      const socketCoinObj = {
        name: socketCoinName,
        price: socketCoinCurrentPrice,
      };

      setSocketData(socketCoinObj);
    };

    ws.onerror = (error) => {
      console.error(error);
    };

    return () => {
      ws.close();
    };
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
    const parsedCoinList = JSON.parse(JSON.stringify(ownedCoinList));

    for (let i = 0; i < parsedCoinList.length; i++) {
      parsedCoinList[i].bought_price =
        parsedCoinList[i].quantity * parsedCoinList[i].averagePrice;
    }

    setNewCoinList(parsedCoinList);
  }, [ownedCoinList]);

  newCoinList.forEach((coin) => {
    if (coinList) {
      coinList.map((coinItem) => {
        if (coin.currencyName === coinItem.currency_name) {
          coin.current_price = coinItem.closing_price;
          coin.evaluate_price = coin.quantity * coinItem.closing_price;
          coin.evaluate_profit =
            coin.quantity * coinItem.closing_price - coin.bought_price;
          coin.yield_rate =
            ((coin.quantity * coinItem.closing_price - coin.bought_price) /
              coin.bought_price) *
            100;
        }

        return coin;
      });
    }

    if (coin.currencyName === socketData.name) {
      coin.current_price = socketData.price;
      coin.evaluate_price = coin.quantity * socketData.price;
      coin.evaluate_profit =
        coin.quantity * socketData.price - coin.bought_price;
      coin.yield_rate =
        ((coin.quantity * socketData.price - coin.bought_price) /
          coin.bought_price) *
        100;
    }
  });

  const sortingByCoinName = () => {
    setIsSortBtnClick(true);
    setIsAscendSort({
      ...isAscendSort,
      isName: !isName,
    });

    isName
      ? setRenderedAssetList(
          newCoinList.sort((a, b) =>
            descendSortAboutName(a.currencyName, b.currencyName)
          )
        )
      : setRenderedAssetList(
          newCoinList.sort((a, b) =>
            ascendSortAboutName(a.currencyName, b.currencyName)
          )
        );
  };

  const sortingByCurrentLeftMoney = () => {
    setIsSortBtnClick(true);
    setIsAscendSort({
      ...isAscendSort,
      isLeftMoney: !isLeftMoney,
    });

    isLeftMoney
      ? setRenderedAssetList(
          newCoinList.sort((a, b) =>
            descendSortAboutMoney(a.quantity, b.quantity)
          )
        )
      : setRenderedAssetList(
          newCoinList.sort((a, b) =>
            ascendSortAboutMoney(a.quantity, b.quantity)
          )
        );
  };

  const averageBoughtPrice = () => {
    setIsSortBtnClick(true);
    setIsAscendSort({
      ...isAscendSort,
      isAvgPrice: !isAvgPrice,
    });

    isAvgPrice
      ? setRenderedAssetList(
          newCoinList.sort((a, b) =>
            descendSortAboutMoney(a.averagePrice, b.averagePrice)
          )
        )
      : setRenderedAssetList(
          newCoinList.sort((a, b) =>
            ascendSortAboutMoney(a.averagePrice, b.averagePrice)
          )
        );
  };

  const boughtPrice = () => {
    setIsSortBtnClick(true);
    setIsAscendSort({
      ...isAscendSort,
      isBoughtPrice: !isBoughtPrice,
    });

    isBoughtPrice
      ? setRenderedAssetList(
          newCoinList.sort((a, b) =>
            descendSortAboutMoney(a.bought_price, b.bought_price)
          )
        )
      : setRenderedAssetList(
          newCoinList.sort((a, b) =>
            ascendSortAboutMoney(a.bought_price, b.bought_price)
          )
        );
  };

  const evaluatedPrice = () => {
    setIsSortBtnClick(true);
    setIsAscendSort({
      ...isAscendSort,
      isEvaluatedPrice: !isEvaluatedPrice,
    });

    isEvaluatedPrice
      ? setRenderedAssetList(
          newCoinList.sort((a, b) =>
            descendSortAboutMoney(
              a.quantity * a.current_price,
              b.quantity * b.current_price
            )
          )
        )
      : setRenderedAssetList(
          newCoinList.sort((a, b) =>
            ascendSortAboutMoney(
              a.quantity * a.current_price,
              b.quantity * b.current_price
            )
          )
        );
  };

  const evaluatedProfit = () => {
    setIsSortBtnClick(true);
    setIsAscendSort({
      ...isAscendSort,
      isEvaluatedProfit: !isEvaluatedProfit,
    });

    isEvaluatedProfit
      ? setRenderedAssetList(
          newCoinList.sort((a, b) =>
            descendSortAboutMoney(
              a.quantity * a.current_price - a.bought_price,
              b.quantity * b.current_price - b.bought_price
            )
          )
        )
      : setRenderedAssetList(
          newCoinList.sort((a, b) =>
            ascendSortAboutMoney(
              a.quantity * a.current_price - a.bought_price,
              b.quantity * b.current_price - b.bought_price
            )
          )
        );
  };

  const yieldRate = () => {
    setIsSortBtnClick(true);
    setIsAscendSort({
      ...isAscendSort,
      isYieldRate: !isYieldRate,
    });

    isYieldRate
      ? setRenderedAssetList(
          newCoinList.sort((a, b) =>
            descendSortAboutMoney(
              (a.quantity * a.current_price - a.bought_price) / a.bought_price,
              (b.quantity * b.current_price - b.bought_price) / b.bought_price
            )
          )
        )
      : setRenderedAssetList(
          newCoinList.sort((a, b) =>
            ascendSortAboutMoney(
              (a.quantity * a.current_price - a.bought_price) / a.bought_price,
              (b.quantity * b.current_price - b.bought_price) / b.bought_price
            )
          )
        );
  };

  return (
    <>
      <Anchor />
      {isLoggedIn ? (
        <>
          <TitleBodyWrapper>
            <TitleWrapper>
              자산 구분
              <SortButton onClick={sortingByCoinName}>
                {isName ? "🔼" : "🔽"}
              </SortButton>
            </TitleWrapper>
            <TitleWrapper>
              보유 잔고
              <SortButton onClick={sortingByCurrentLeftMoney}>
                {isLeftMoney ? "🔼" : "🔽"}
              </SortButton>
            </TitleWrapper>
            <TitleWrapper>
              평균 매수가
              <SortButton onClick={averageBoughtPrice}>
                {isAvgPrice ? "🔼" : "🔽"}
              </SortButton>
            </TitleWrapper>
            <TitleWrapper>
              매수 금액
              <SortButton onClick={boughtPrice}>
                {isBoughtPrice ? "🔼" : "🔽"}
              </SortButton>
            </TitleWrapper>
            <TitleWrapper>
              평가 금액
              <SortButton onClick={evaluatedPrice}>
                {isEvaluatedPrice ? "🔼" : "🔽"}
              </SortButton>
            </TitleWrapper>
            <TitleWrapper>
              펑가 순익
              <SortButton onClick={evaluatedProfit}>
                {isEvaluatedProfit ? "🔼" : "🔽"}
              </SortButton>
            </TitleWrapper>
            <TitleWrapper>
              수익률{" "}
              <SortButton onClick={yieldRate}>
                {isYieldRate ? "🔼" : "🔽"}
              </SortButton>
            </TitleWrapper>
            <button
              className="help-button"
              onClick={() => dispatch(openHelpModal())}
            >
              도움말
            </button>
          </TitleBodyWrapper>
          <Line />

          {!isSortBtnClick
            ? newCoinList.map((coinElements) => {
                return (
                  <div key={coinElements.currencyName}>
                    <BodyWrapper>
                      <Wrapper>
                        <CoinLink to={`/trade/${coinElements.currencyName}`}>
                          {coinElements.currencyName}
                        </CoinLink>
                      </Wrapper>
                      <Wrapper>{`${coinElements.quantity.toFixed(
                        4
                      )}개`}</Wrapper>

                      <Wrapper>
                        {coinElements.averagePrice.toLocaleString()}원
                      </Wrapper>
                      <Wrapper>
                        {coinElements.bought_price.toLocaleString()}원
                      </Wrapper>
                      <Wrapper>
                        {coinElements.evaluate_price !== 0
                          ? `${coinElements.evaluate_price.toLocaleString()}원`
                          : `${(coinElements.evaluate_price = 0)}원`}
                      </Wrapper>
                      <Wrapper>
                        {coinElements.evaluate_profit ? (
                          coinElements.evaluate_profit > 0 ? (
                            <Red>
                              {coinElements.evaluate_profit.toLocaleString()}원
                            </Red>
                          ) : (
                            <Blue>
                              {coinElements.evaluate_profit.toLocaleString()}원
                            </Blue>
                          )
                        ) : (
                          `${(coinElements.evaluate_profit = 0)}원`
                        )}
                      </Wrapper>
                      <Wrapper>
                        {coinElements.evaluate_profit !== 0 ? (
                          coinElements.evaluate_profit > 0 ? (
                            <Red>{coinElements.yield_rate.toFixed(2)}%</Red>
                          ) : (
                            <Blue>{coinElements.yield_rate.toFixed(2)}%</Blue>
                          )
                        ) : (
                          `${(coinElements.yield_rate = 0)}%`
                        )}
                      </Wrapper>
                    </BodyWrapper>
                    <Line />
                  </div>
                );
              })
            : renderedAssetList.map((coinElements) => {
                return (
                  <div key={coinElements.currencyName}>
                    <BodyWrapper>
                      <Wrapper>
                        <CoinLink to={`/trade/${coinElements.currencyName}`}>
                          {coinElements.currencyName}
                        </CoinLink>
                      </Wrapper>
                      <Wrapper>{`${coinElements.quantity.toFixed(
                        4
                      )}개`}</Wrapper>

                      <Wrapper>
                        {coinElements.averagePrice.toLocaleString()}원
                      </Wrapper>
                      <Wrapper>
                        {coinElements.bought_price.toLocaleString()}원
                      </Wrapper>
                      <Wrapper>
                        {coinElements.evaluate_price !== 0 ? (
                          coinElements.evaluate_price > 0 ? (
                            <Red>
                              {coinElements.evaluate_price.toLocaleString()}원
                            </Red>
                          ) : (
                            <Blue>
                              {coinElements.evaluate_price.toLocaleString()}원
                            </Blue>
                          )
                        ) : (
                          `${(coinElements.evaluate_price = 0)}원`
                        )}
                      </Wrapper>
                      <Wrapper>
                        {coinElements.evaluate_profit ? (
                          coinElements.evaluate_profit > 0 ? (
                            <Red>
                              {coinElements.evaluate_profit.toLocaleString()}원
                            </Red>
                          ) : (
                            <Blue>
                              {coinElements.evaluate_profit.toLocaleString()}원
                            </Blue>
                          )
                        ) : (
                          `${(coinElements.evaluate_profit = 0)}원`
                        )}
                      </Wrapper>
                      <Wrapper>
                        {coinElements.evaluate_profit !== 0 ? (
                          coinElements.evaluate_profit > 0 ? (
                            <Red>{coinElements.yield_rate.toFixed(2)}%</Red>
                          ) : (
                            <Blue>{coinElements.yield_rate.toFixed(2)}%</Blue>
                          )
                        ) : (
                          `${(coinElements.yield_rate = 0)}%`
                        )}
                      </Wrapper>
                    </BodyWrapper>
                    <Line />
                  </div>
                );
              })}
        </>
      ) : (
        <>
          <Message>로그인 후 이용 가능한 서비스입니다.</Message>
          <LoginButton className="login" onClick={signInWithGoogle}>
            구글 로그인
          </LoginButton>
        </>
      )}

      {isOpenHelpModal && (
        <HelpModal onClose={() => dispatch(closeHelpModal())}>
          <>
            <p>현재 페이지에서는 자산현황을 볼 수 있는 페이지입니다.</p>
            <p>
              가지고 있는 코인이 얼마나 올랐는지 그리고 어느 정도로 이익을
              냈는지 한 눈에 볼 수 있습니다.
            </p>
            <div>평균매수가란 ? 매수한 코인의 평균 매입가입니다.</div>
            <div>
              쉽게 말해서 {displayName}님이 평균적으로 얼마정도에 코인을
              매수했냐 를 뜻하는 단어가 평균매수가입니다.
            </div>
            <p>
              매수 금액이란 ? {displayName}님이 코인을 매수한 총 금액입니다.{" "}
            </p>
            <p>
              평가 금액이란 ? 현재 코인의 시세에서 {displayName}님이 매수하신
              코인의 수량이 곱해지면 평가금액이 됩니다.
            </p>
            <p>평가 순익이란 ? {displayName}님의 총 수익을 나타내어줍니다. </p>
            <p>
              수익률이란 ? {displayName}님이 얼마의 수익을 냈는지에 대한
              수치입니다.
            </p>
          </>
        </HelpModal>
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
  margin: 5px 5px;
  justify-content: space-around;

  .help-button {
    cursor: pointer;
    position: fixed;
    bottom: 5%;
    right: 2%;
    padding: 35px 25px;
    border: none;
    border-radius: 50%;
    font-size: 20px;
    font-weight: 200;
    color: ${WHITE};
    background-color: ${MAIN_COLOR_1};
    opacity: 80%;
    transition: 0.2s;
  }

  .help-button:hover {
    padding: 40px 30px;
    opacity: 100%;
    transition: 0.2s;
  }
`;

const TitleBodyWrapper = styled(BodyWrapper)`
  text-align: center;
  font-size: 1rem;
  font-weight: 500;
  margin: 10px 5px 0px 5px;
`;

const TitleWrapper = styled.div`
  margin: 0px 40px;
  color: ${BLACK};
  text-align: center;
`;

const Wrapper = styled.div`
  color: ${BLACK};
  width: 100%;
  text-align: center;
`;

const Red = styled(Wrapper)`
  color: ${RED};
`;

const Blue = styled(Wrapper)`
  color: ${BLUE};
`;

const Button = styled.button`
  height: 35px;
  background-color: ${MAIN_COLOR_3};
  color: ${WHITE};
  border-color: ${MAIN_COLOR_3};
  border-style: none;
  border-radius: 0.2rem;
  cursor: pointer;
  margin: 0px 10px;

  :hover {
    background-color: ${MAIN_COLOR_2};
    border-color: ${MAIN_COLOR_2};
    color: ${WHITE};
    transition: 0.2s;
  }
`;

const LoginButton = styled(Button)`
  width: 100px;
  display: block;
  margin: auto;
`;

const SortButton = styled(Button)`
  padding: 0px;
  margin-right: 0px;
  background-color: ${WHITE};

  :hover {
    background-color: ${WHITE};
    border-color: ${WHITE};
  }
`;

const Line = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${LIGHT_GREY};
`;

const Message = styled.h4`
  text-align: center;
`;

const CoinLink = styled(NavLink)`
  width: 20%;
  color: ${BLACK};
  text-decoration: none;
`;

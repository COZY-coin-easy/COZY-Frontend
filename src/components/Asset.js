import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import {
  WHITE,
  BLACK,
  LIGHT_GREY,
  MAIN_COLOR_1,
  MAIN_COLOR_3,
  RED,
  BLUE,
} from "../constants/styles";

const Anchor = styled.span`
  display: block;
  height: 80px;
  visibility: hidden;
`;

export default function Asset() {
  const { asset } = useSelector((state) => state.user.user);
  const { transactionHistory } = useSelector((state) => state.user.user);
  const tickerCoinList = useSelector((state) => state.socket.coinList);
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
    const parsedTransactionHistory = JSON.parse(
      JSON.stringify(transactionHistory)
    );

    for (let i = 0; i < ownedCoinList.length; i++) {
      if (
        parsedCoinList[i].currencyName ===
        parsedTransactionHistory[i].currencyName
      ) {
        parsedCoinList[i].bought_price = parsedTransactionHistory[i].price;
      }
    }

    setNewCoinList(parsedCoinList);
  }, []);

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
          newCoinList.sort((a, b) => {
            return a.currencyName > b.currencyName
              ? -1
              : a.currencyName < b.currencyName
              ? 1
              : 0;
          })
        )
      : setRenderedAssetList(
          newCoinList.sort((a, b) => {
            return a.currencyName < b.currencyName
              ? -1
              : a.currencyName > b.currencyName
              ? 1
              : 0;
          })
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
          newCoinList.sort((a, b) => {
            return a.quantity - b.quantity > 0
              ? -1
              : a.quantity - b.quantity < 0
              ? 1
              : 0;
          })
        )
      : setRenderedAssetList(
          newCoinList.sort((a, b) => {
            return a.quantity - b.quantity < 0
              ? -1
              : a.quantity - b.quantity > 0
              ? 1
              : 0;
          })
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
          newCoinList.sort((a, b) => {
            return a.averagePrice - b.averagePrice > 0
              ? -1
              : a.averagePrice - b.averagePrice < 0
              ? 1
              : 0;
          })
        )
      : setRenderedAssetList(
          newCoinList.sort((a, b) => {
            return a.averagePrice - b.averagePrice < 0
              ? -1
              : a.averagePrice - b.averagePrice > 0
              ? 1
              : 0;
          })
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
          newCoinList.sort((a, b) => {
            return a.bought_price - b.bought_price > 0
              ? -1
              : a.bought_price - b.bought_price < 0
              ? 1
              : 0;
          })
        )
      : setRenderedAssetList(
          newCoinList.sort((a, b) => {
            return a.bought_price - b.bought_price < 0
              ? -1
              : a.bought_price - b.bought_price > 0
              ? 1
              : 0;
          })
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
          newCoinList.sort((a, b) => {
            return a.quantity * a.current_price - b.quantity * b.current_price >
              0
              ? -1
              : a.quantity * a.current_price - b.quantity * b.current_price < 0
              ? 1
              : 0;
          })
        )
      : setRenderedAssetList(
          newCoinList.sort((a, b) => {
            return a.quantity * a.current_price - b.quantity * b.current_price <
              0
              ? -1
              : a.quantity * a.current_price - b.quantity * b.current_price > 0
              ? 1
              : 0;
          })
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
          newCoinList.sort((a, b) => {
            return a.quantity * a.current_price -
              a.bought_price -
              (b.quantity * b.current_price - b.bought_price) >
              0
              ? -1
              : a.quantity * a.current_price -
                  a.bought_price -
                  (b.quantity * b.current_price - b.bought_price) <
                0
              ? 1
              : 0;
          })
        )
      : setRenderedAssetList(
          newCoinList.sort((a, b) => {
            return a.quantity * a.current_price -
              a.bought_price -
              (b.quantity * b.current_price - b.bought_price) <
              0
              ? -1
              : a.quantity * a.current_price -
                  a.bought_price -
                  (b.quantity * b.current_price - b.bought_price) >
                0
              ? 1
              : 0;
          })
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
          newCoinList.sort((a, b) => {
            return (a.quantity * a.current_price - a.bought_price) /
              a.bought_price -
              (b.quantity * b.current_price - b.bought_price) / b.bought_price >
              0
              ? -1
              : (a.quantity * a.current_price - a.bought_price) /
                  a.bought_price -
                  (b.quantity * b.current_price - b.bought_price) /
                    b.bought_price <
                0
              ? 1
              : 0;
          })
        )
      : setRenderedAssetList(
          newCoinList.sort((a, b) => {
            return (a.quantity * a.current_price - a.bought_price) /
              a.bought_price -
              (b.quantity * b.current_price - b.bought_price) / b.bought_price <
              0
              ? -1
              : (a.quantity * a.current_price - a.bought_price) /
                  a.bought_price -
                  (b.quantity * b.current_price - b.bought_price) /
                    b.bought_price >
                0
              ? 1
              : 0;
          })
        );
  };

  return (
    <>
      <Anchor />
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
      </TitleBodyWrapper>
      <Line />

      {!isLoggedIn && (
        <>
          <div>로그인 후 이용 가능한 서비스입니다.</div>{" "}
          <button onClick={signInWithGoogle}>로그인</button>
        </>
      )}

      {!isSortBtnClick
        ? newCoinList.map((coinElements) => {
            return (
              <div key={coinElements.currencyName}>
                <BodyWrapper>
                  <Wrapper>{coinElements.currencyName}</Wrapper>
                  <Wrapper>{`${coinElements.quantity}개`}</Wrapper>

                  <Wrapper>
                    {Math.round(coinElements.averagePrice).toLocaleString()}원
                  </Wrapper>
                  <Wrapper>
                    {Math.round(coinElements.bought_price).toLocaleString()}원
                  </Wrapper>
                  <Wrapper>
                    {coinElements.evaluate_price > 0 ? (
                      <Red>
                        {Math.round(
                          coinElements.evaluate_price
                        ).toLocaleString()}
                        원
                      </Red>
                    ) : (
                      <Blue>
                        {Math.round(
                          coinElements.evaluate_price
                        ).toLocaleString()}
                        원
                      </Blue>
                    )}
                  </Wrapper>
                  <Wrapper>
                    {coinElements.evaluate_profit > 0 ? (
                      <Red>
                        {Math.round(
                          coinElements.evaluate_profit
                        ).toLocaleString()}
                        원
                      </Red>
                    ) : (
                      <Blue>
                        {Math.round(
                          coinElements.evaluate_profit
                        ).toLocaleString()}
                        원
                      </Blue>
                    )}
                  </Wrapper>
                  <Wrapper>
                    {coinElements.evaluate_profit > 0 ? (
                      <Red>{coinElements.yield_rate.toFixed(2)}%</Red>
                    ) : (
                      <Blue>{coinElements.yield_rate.toFixed(2)}%</Blue>
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
                  <Wrapper>{coinElements.currencyName}</Wrapper>
                  <Wrapper>{`${coinElements.quantity}개`}</Wrapper>

                  <Wrapper>
                    {Math.round(coinElements.averagePrice).toLocaleString()}원
                  </Wrapper>
                  <Wrapper>
                    {Math.round(coinElements.bought_price).toLocaleString()}원
                  </Wrapper>
                  <Wrapper>
                    {coinElements.evaluate_price > 0 ? (
                      <Red>
                        {Math.round(
                          coinElements.evaluate_price
                        ).toLocaleString()}
                        원
                      </Red>
                    ) : (
                      <Blue>
                        {Math.round(
                          coinElements.evaluate_price
                        ).toLocaleString()}
                        원
                      </Blue>
                    )}
                  </Wrapper>
                  <Wrapper>
                    {coinElements.evaluate_profit > 0 ? (
                      <Red>
                        {Math.round(
                          coinElements.evaluate_profit
                        ).toLocaleString()}
                        원
                      </Red>
                    ) : (
                      <Blue>
                        {Math.round(
                          coinElements.evaluate_profit
                        ).toLocaleString()}
                        원
                      </Blue>
                    )}
                  </Wrapper>
                  <Wrapper>
                    {coinElements.evaluate_profit > 0 ? (
                      <Red>{coinElements.yield_rate.toFixed(2)}%</Red>
                    ) : (
                      <Blue>{coinElements.yield_rate.toFixed(2)}%</Blue>
                    )}
                  </Wrapper>
                </BodyWrapper>
                <Line />
              </div>
            );
          })}
      <Line />
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
`;

const TitleBodyWrapper = styled(BodyWrapper)`
  text-align: center;
  font-size: 1rem;
  font-weight: 500;
  margin: 10px 5px 0px 5px;
`;

const TitleWrapper = styled.div`
  margin-left: 58px;
  margin-right: 50px;
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

const Line = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${LIGHT_GREY};
`;

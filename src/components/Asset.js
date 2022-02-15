import React, { useEffect, useState } from "react";
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

const Span = styled.span`
  margin-left: 20px;
  font-weight: bold;
`;

const Div = styled.div`
  margin-left: 10px;
`;

export default function Asset() {
  const ws = new WebSocket(process.env.REACT_APP_WEBSOCKET_SERVER_URL);

  const { asset } = useSelector((state) => state.user.user);
  const { transactionHistory } = useSelector((state) => state.user.user);
  const [newCoinList, setNewCoinList] = useState([]);
  const ownedCoinList = asset.coins;

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
    ws.onmessage = (event) => {
      const res = JSON.parse(event.data);
      const socketCoinData = res.content;
      const socketCoinName = socketCoinData.symbol.slice(0, 3);
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
            return b.quantity - a.quantity;
          })
        )
      : setRenderedAssetList(
          newCoinList.sort((a, b) => {
            return a.quantity - b.quantity;
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
            return b.averagePrice - a.averagePrice;
          })
        )
      : setRenderedAssetList(
          newCoinList.sort((a, b) => {
            return a.averagePrice - b.averagePrice;
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
            return b.bought_price - a.bought_price;
          })
        )
      : setRenderedAssetList(
          newCoinList.sort((a, b) => {
            return a.bought_price - b.bought_price;
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
            return b.quantity * b.current_price - a.quantity * a.current_price;
          })
        )
      : setRenderedAssetList(
          newCoinList.sort((a, b) => {
            return a.quantity * a.current_price - b.quantity * b.current_price;
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
            return (
              b.quantity * b.current_price -
              b.bought_price -
              (a.quantity * a.current_price - a.bought_price)
            );
          })
        )
      : setRenderedAssetList(
          newCoinList.sort((a, b) => {
            return (
              a.quantity * a.current_price -
              a.bought_price -
              (b.quantity * b.current_price - b.bought_price)
            );
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
            return (
              (b.quantity * b.current_price - b.bought_price) / b.bought_price -
              (a.quantity * a.current_price - a.bought_price) / a.bought_price
            );
          })
        )
      : setRenderedAssetList(
          newCoinList.sort((a, b) => {
            return (
              (a.quantity * a.current_price - a.bought_price) / a.bought_price -
              (b.quantity * b.current_price - b.bought_price) / b.bought_price
            );
          })
        );
  };

  return (
    <>
      <Anchor />
      <TitleBodyWrapper>
        <Span>
          자산 구분
          <SortButton onClick={sortingByCoinName}>
            {isName ? "🔼" : "🔽"}
          </SortButton>
        </Span>
        <Span>
          보유 잔고
          <SortButton onClick={sortingByCurrentLeftMoney}>
            {isLeftMoney ? "🔼" : "🔽"}
          </SortButton>
        </Span>
        <Span>
          평균 매수가
          <SortButton onClick={averageBoughtPrice}>
            {isAvgPrice ? "🔼" : "🔽"}
          </SortButton>
        </Span>
        <Span>
          매수 금액
          <SortButton onClick={boughtPrice}>
            {isBoughtPrice ? "🔼" : "🔽"}
          </SortButton>
        </Span>
        <Span>
          평가 금액
          <SortButton onClick={evaluatedPrice}>
            {isEvaluatedPrice ? "🔼" : "🔽"}
          </SortButton>
        </Span>
        <Span>
          펑가 순익
          <SortButton onClick={evaluatedProfit}>
            {isEvaluatedProfit ? "🔼" : "🔽"}
          </SortButton>
        </Span>
        <Span>
          수익률{" "}
          <SortButton onClick={yieldRate}>
            {isYieldRate ? "🔼" : "🔽"}
          </SortButton>
        </Span>
      </TitleBodyWrapper>
      <Line />

      {!isSortBtnClick
        ? newCoinList.map((coinElements) => {
            return (
              <>
                <BodyWrapper key={coinElements.currencyName}>
                  <Wrapper>{coinElements.currencyName}</Wrapper>
                  <Wrapper>{`${coinElements.quantity}개`}</Wrapper>
                  <CashWrapper>
                    {coinElements.averagePrice}
                    {coinElements.bought_price}
                    {coinElements.evaluate_price}
                    {coinElements.evaluate_profit}
                    {`${coinElements.yield_rate}%`}
                  </CashWrapper>
                </BodyWrapper>
                <Line />
              </>
            );
          })
        : renderedAssetList.map((coinElements) => {
            return (
              <>
                <BodyWrapper key={coinElements.currencyName}>
                  <Wrapper>{coinElements.currencyName}</Wrapper>
                  <Wrapper>{`${coinElements.quantity}개`}</Wrapper>
                  <CashWrapper>
                    {coinElements.averagePrice}
                    {coinElements.bought_price}
                    {coinElements.evaluate_price}
                    {coinElements.evaluate_profit}
                    {`${coinElements.yield_rate}%`}
                  </CashWrapper>
                </BodyWrapper>
                <Line />
              </>
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

const Wrapper = styled.div`
  margin-left: 60px;
  margin-right: 30px;
  color: ${BLACK};
  width: 15%;
`;

const CashWrapper = styled(Wrapper)`
  text-align: right;
  width: 25%;
`;

const Line = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${LIGHT_GREY};
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

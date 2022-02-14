import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";

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
  const [isAscendSortByName, setIsAscendSortByName] = useState(true);
  const [isAscendSortByLeftMoney, setIsAscendSortByLeftMoney] = useState(true);
  const [isAscendSortByAvgPrice, setIsAscendSortByAvgPrice] = useState(true);
  const [isAscendSortByBoughtPrice, setIsAscendSortByBoughtPrice] =
    useState(true);
  const [isAscendSortByEvaluatedPrice, setIsAscendSortByEvaluatedPrice] =
    useState(true);
  const [isAscendSortByEvaluatedProfit, setIsAscendSortByEvaluatedProfit] =
    useState(true);
  const [isAscendSortByYieldRate, setIsAscendSortByYieldRate] = useState(true);

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
    setIsAscendSortByName((current) => !current);

    isAscendSortByName
      ? setRenderedAssetList(
          newCoinList.sort((a, b) => {
            return a.currencyName < b.currencyName
              ? -1
              : a.currencyName > b.currencyName
              ? 1
              : 0;
          })
        )
      : setRenderedAssetList(
          newCoinList.sort((a, b) => {
            return a.currencyName > b.currencyName
              ? -1
              : a.currencyName < b.currencyName
              ? 1
              : 0;
          })
        );
  };

  const sortingByCurrentLeftMoney = () => {
    setIsSortBtnClick(true);
    setIsAscendSortByLeftMoney((current) => !current);

    isAscendSortByLeftMoney
      ? setRenderedAssetList(
          newCoinList.sort((a, b) => {
            return a.quantity < b.quantity
              ? -1
              : a.quantity > b.quantity
              ? 1
              : 0;
          })
        )
      : setRenderedAssetList(
          newCoinList.sort((a, b) => {
            return a.quantity > b.quantity
              ? -1
              : a.quantity < b.quantity
              ? 1
              : 0;
          })
        );
  };

  const averageBoughtPrice = () => {
    setIsSortBtnClick(true);
    setIsAscendSortByAvgPrice((current) => !current);

    isAscendSortByAvgPrice
      ? setRenderedAssetList(
          newCoinList.sort((a, b) => {
            return a.averagePrice < b.averagePrice
              ? -1
              : a.averagePrice > b.averagePrice
              ? 1
              : 0;
          })
        )
      : setRenderedAssetList(
          newCoinList.sort((a, b) => {
            return a.averagePrice > b.averagePrice
              ? -1
              : a.averagePrice < b.averagePrice
              ? 1
              : 0;
          })
        );
  };

  const boughtPrice = () => {
    setIsSortBtnClick(true);
    setIsAscendSortByBoughtPrice((current) => !current);

    isAscendSortByBoughtPrice
      ? setRenderedAssetList(
          newCoinList.sort((a, b) => {
            return a.bought_price < b.bought_price
              ? -1
              : a.bought_price > b.bought_price
              ? 1
              : 0;
          })
        )
      : setRenderedAssetList(
          newCoinList.sort((a, b) => {
            return a.bought_price > b.bought_price
              ? -1
              : a.bought_price < b.bought_price
              ? 1
              : 0;
          })
        );
  };

  const evaluatedPrice = () => {
    setIsSortBtnClick(true);
    setIsAscendSortByEvaluatedPrice((current) => !current);

    isAscendSortByEvaluatedPrice
      ? setRenderedAssetList(
          newCoinList.sort((a, b) => {
            return a.quantity * a.current_price < b.quantity * b.current_price
              ? -1
              : a.quantity * a.current_price > b.quantity * b.current_price
              ? 1
              : 0;
          })
        )
      : setRenderedAssetList(
          newCoinList.sort((a, b) => {
            return a.quantity * a.current_price > b.quantity * b.current_price
              ? -1
              : a.quantity * a.current_price < b.quantity * b.current_price
              ? 1
              : 0;
          })
        );
  };

  const evaluatedProfit = () => {
    setIsSortBtnClick(true);
    setIsAscendSortByEvaluatedProfit((current) => !current);

    isAscendSortByEvaluatedProfit
      ? setRenderedAssetList(
          newCoinList.sort((a, b) => {
            return a.quantity * a.current_price - a.bought_price <
              b.quantity * b.current_price - b.bought_price
              ? -1
              : a.quantity * a.current_price - a.bought_price >
                b.quantity * b.current_price - b.bought_price
              ? 1
              : 0;
          })
        )
      : setRenderedAssetList(
          newCoinList.sort((a, b) => {
            return a.quantity * a.current_price - a.bought_price >
              b.quantity * b.current_price - b.bought_price
              ? -1
              : a.quantity * a.current_price - a.bought_price <
                b.quantity * b.current_price - b.bought_price
              ? 1
              : 0;
          })
        );
  };

  const yieldRate = () => {
    setIsSortBtnClick(true);
    setIsAscendSortByYieldRate((current) => !current);

    isAscendSortByYieldRate
      ? setRenderedAssetList(
          newCoinList.sort((a, b) => {
            return (a.quantity * a.current_price - a.bought_price) /
              a.bought_price <
              (b.quantity * b.current_price - b.bought_price) / b.bought_price
              ? -1
              : (a.quantity * a.current_price - a.bought_price) /
                  a.bought_price >
                (b.quantity * b.current_price - b.bought_price) / b.bought_price
              ? 1
              : 0;
          })
        )
      : setRenderedAssetList(
          newCoinList.sort((a, b) => {
            return (a.quantity * a.current_price - a.bought_price) /
              a.bought_price >
              (b.quantity * b.current_price - b.bought_price) / b.bought_price
              ? -1
              : (a.quantity * a.current_price - a.bought_price) /
                  a.bought_price <
                (b.quantity * b.current_price - b.bought_price) / b.bought_price
              ? 1
              : 0;
          })
        );
  };

  return (
    <>
      <Span>
        자산 구분
        <button onClick={sortingByCoinName}>
          {!isAscendSortByName ? "🔼" : "🔽"}
        </button>
      </Span>
      <Span>
        보유 잔고
        <button onClick={sortingByCurrentLeftMoney}>
          {!isAscendSortByLeftMoney ? "🔼" : "🔽"}
        </button>
      </Span>
      <Span>
        평균 매수가
        <button onClick={averageBoughtPrice}>
          {!isAscendSortByAvgPrice ? "🔼" : "🔽"}
        </button>
      </Span>
      <Span>
        매수 금액
        <button onClick={boughtPrice}>
          {!isAscendSortByBoughtPrice ? "🔼" : "🔽"}
        </button>
      </Span>
      <Span>
        평가 금액
        <button onClick={evaluatedPrice}>
          {!isAscendSortByEvaluatedPrice ? "🔼" : "🔽"}
        </button>
      </Span>
      <Span>
        펑가 순익
        <button onClick={evaluatedProfit}>
          {!isAscendSortByEvaluatedProfit ? "🔼" : "🔽"}
        </button>
      </Span>
      <Span>
        수익률{" "}
        <button onClick={yieldRate}>
          {!isAscendSortByEvaluatedProfit ? "🔼" : "🔽"}
        </button>
      </Span>

      {!isSortBtnClick
        ? newCoinList.map((coinElements) => {
            return (
              <Div key={coinElements.currencyName}>
                <Span>{coinElements.currencyName}</Span>
                <Span>{`${coinElements.quantity}개`}</Span>
                <Span>{coinElements.averagePrice}</Span>
                <Span>{coinElements.bought_price}</Span>
                <Span>{coinElements.evaluate_price}</Span>
                <Span>{coinElements.evaluate_profit}</Span>
                <Span>{`${coinElements.yield_rate}%`}</Span>
              </Div>
            );
          })
        : renderedAssetList.map((coinElements) => {
            return (
              <Div key={coinElements.currencyName}>
                <Span>{coinElements.currencyName}</Span>
                <Span>{`${coinElements.quantity}개`}</Span>
                <Span>{coinElements.averagePrice}</Span>
                <Span>{coinElements.bought_price}</Span>
                <Span>{coinElements.evaluate_price}</Span>
                <Span>{coinElements.evaluate_profit}</Span>
                <Span>{`${coinElements.yield_rate}%`}</Span>
              </Div>
            );
          })}
    </>
  );
}

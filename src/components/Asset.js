import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { signInWithGoogle } from "../firebase";

const Span = styled.span`
  margin-left: 20px;
  font-weight: bold;
`;

const Div = styled.div`
  margin-left: 10px;
`;

const Anchor = styled.span`
  display: block;
  height: 80px;
  visibility: hidden;
`;

export default function Asset() {
  const ws = new WebSocket(process.env.REACT_APP_WEBSOCKET_SERVER_URL);

  const { asset, transactionHistory } = useSelector((state) => state.user.user);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
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
      <Span>
        자산 구분
        <button onClick={sortingByCoinName}>{isName ? "🔼" : "🔽"}</button>
      </Span>
      <Span>
        보유 잔고
        <button onClick={sortingByCurrentLeftMoney}>
          {isLeftMoney ? "🔼" : "🔽"}
        </button>
      </Span>
      <Span>
        평균 매수가
        <button onClick={averageBoughtPrice}>{isAvgPrice ? "🔼" : "🔽"}</button>
      </Span>
      <Span>
        매수 금액
        <button onClick={boughtPrice}>{isBoughtPrice ? "🔼" : "🔽"}</button>
      </Span>
      <Span>
        평가 금액
        <button onClick={evaluatedPrice}>
          {isEvaluatedPrice ? "🔼" : "🔽"}
        </button>
      </Span>
      <Span>
        펑가 순익
        <button onClick={evaluatedProfit}>
          {isEvaluatedProfit ? "🔼" : "🔽"}
        </button>
      </Span>
      <Span>
        수익률 <button onClick={yieldRate}>{isYieldRate ? "🔼" : "🔽"}</button>
      </Span>

      {!isLoggedIn && (
        <>
          <div>로그인 후 이용 가능한 서비스입니다.</div>{" "}
          <button onClick={signInWithGoogle}>로그인</button>
        </>
      )}

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

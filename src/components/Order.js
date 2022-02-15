import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import OrderModal from "./OrderModal";
import { orderRequest } from "../features/user/userSlice";
import { MAIN_COLOR_1, WHITE } from "../constants/styles";

export default function Order() {
  const dispatch = useDispatch();
  const { currencyName } = useParams();

  const [isBuy, setIsBuy] = useState(true);
  const [isOpenModal, setIsOpenModal] = useState({
    isTrade: false,
    isRequest: false,
    isComplete: false,
    isNone: false,
    isFail: false,
  });
  const [currentCurrencyPrice, setCurrentCurrencyPrice] = useState(0);
  const [unitsTraded, setUnitsTraded] = useState(0);

  const { asset, token, _id } = useSelector((state) => state.user.user);
  const { cash, coins } = asset;
  const { isTrade, isRequest, isComplete, isNone, isFail } = isOpenModal;

  const total = currentCurrencyPrice * unitsTraded;
  const ws = new WebSocket(process.env.REACT_APP_WEBSOCKET_SERVER_URL);

  let coin = null;
  for (let i = 0; i < coins.length; i++) {
    if (coins[i].currencyName === currencyName) {
      coin = coins[i];

      break;
    }
  }

  useEffect(() => {
    ws.onmessage = (event) => {
      const res = JSON.parse(event.data);
      const currentCurrencyName = res.content.symbol.split("_")[0];

      if (currencyName === currentCurrencyName) {
        setCurrentCurrencyPrice(res.content.closePrice);
      }
    };

    ws.onerror = (error) => {
      console.error(error);
    };

    return () => {
      ws.close();
    };
  }, []);

  const handleChangeInputValue = (e) => {
    setUnitsTraded(Number(e.target.value));
  };

  const handleClickToggle = (e) => {
    if (e.target.value === "매수" && !isBuy) {
      setIsBuy(true);
      setUnitsTraded(0);
    }

    if (e.target.value === "매도" && isBuy) {
      setIsBuy(false);
      setUnitsTraded(0);
    }
  };

  const handleClickOpenTradeModal = (e) => {
    e.preventDefault();

    if (unitsTraded === 0) {
      setIsOpenModal({
        ...isOpenModal,
        isNone: true,
      });
    } else {
      setIsOpenModal({
        ...isOpenModal,
        isTrade: true,
      });
    }
  };

  const handleClickCloseModal = () => {
    setIsOpenModal({
      ...isOpenModal,
      isTrade: false,
      isComplete: false,
      isNone: false,
      isFail: false,
    });
  };

  const handleClickTrade = () => {
    if (isBuy && cash - total < 0) {
      setIsOpenModal({
        ...isOpenModal,
        isTrade: false,
        isFail: true,
      });

      return;
    }

    if (!isBuy && (coin === null || coin.quantity < unitsTraded)) {
      setIsOpenModal({
        ...isOpenModal,
        isTrade: false,
        isFail: true,
      });

      return;
    }

    dispatch(
      orderRequest({
        transactionDate: new Date(),
        currencyName,
        price: currentCurrencyPrice,
        unitsTraded,
        total,
        token,
        isBuy,
        _id,
      })
    );

    setIsOpenModal({
      ...isOpenModal,
      isTrade: false,
      isComplete: true,
    });

    setUnitsTraded(0);
  };

  return (
    <>
      <OrderWrapper>
        <AssetWrapper>
          <span className="my-asset">
            보유 현금: {Math.round(cash).toLocaleString()}원{" "}
          </span>
          <span className="my-asset">
            현재 가지고 있는 {currencyName}:{coin ? coin.quantity : 0}개
          </span>
          <span className="my-asset">
            평균매수가:{" "}
            {coin ? Math.round(coin.averagePrice).toLocaleString() : 0}원
          </span>
        </AssetWrapper>
        <OrderBoxWrapper>
          <ToggleTradeButton>
            <button
              className="trade-toggle-button"
              onClick={handleClickToggle}
              value="매수"
              style={{ color: isBuy ? "#f75467" : "#a4a4a4" }}
            >
              매수
            </button>
            <button
              className="trade-toggle-button"
              onClick={handleClickToggle}
              value="매도"
              style={{ color: !isBuy ? "#4386f9" : "#a4a4a4" }}
            >
              매도
            </button>
          </ToggleTradeButton>

          <form>
            <InputWrapper>
              <div className="current-currency-price">
                현재 {currencyName}의 가격: {currentCurrencyPrice}원
              </div>
              <input
                type="number"
                placeholder="수량"
                name="unitsTraded"
                className="order-input"
                step="0.0001"
                onChange={handleChangeInputValue}
                value={unitsTraded}
              />
              <input
                type="number"
                placeholder="총액"
                className="order-input"
                value={total}
                readOnly
              />
            </InputWrapper>
          </form>

          <TradeButton
            type="button"
            className="trade-button"
            onClick={handleClickOpenTradeModal}
            style={{ backgroundColor: isBuy ? "#f75467" : "#4386f9" }}
          >
            {isBuy ? "매수하기" : "매도하기"}
          </TradeButton>
        </OrderBoxWrapper>
      </OrderWrapper>
      {(isTrade || isComplete || isNone || isFail) && (
        <OrderModal
          onTrade={handleClickTrade}
          onClose={handleClickCloseModal}
          isTrade={isTrade}
        >
          {isTrade && (isBuy ? "매수하시겠습니까 ?" : "매도하시겠습니까 ?")}
          {isComplete &&
            (isRequest
              ? "주문이 완료되었습니다."
              : "주문하신 수량이 정상적으로 체결되었습니다.")}
          {isNone && "수량을 입력해주세요."}
          {isFail &&
            (isBuy ? "보유 금액이 부족합니다." : "보유 수량이 부족합니다.")}
        </OrderModal>
      )}
    </>
  );
}

const OrderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
`;
const OrderBoxWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;
const ToggleTradeButton = styled.div`
  display: flex;
  justify-content: center;

  .trade-toggle-button {
    cursor: pointer;
    margin-left: 10px;
    padding: 20px 40px 20px 40px;
    border: none;
    border-radius: 10px;
    font-size: 20px;
    font-weight: bold;
    background-color: ${WHITE};
    transition: 0.2s;
  }
  .trade-toggle-button:hover {
    font-size: 22px;
    transition: 0.2s;
  }
`;
const TradeButton = styled.button`
  cursor: pointer;
  margin-top: 30px;
  height: 80px;
  border-style: none;
  border-radius: 0.2rem;
  background-color: #f75467;
  color: ${WHITE};
  font-size: 20px;
  font-weight: bold;
  transition: 0.2s;

  :hover {
    height: 90px;
    font-size: 25px;
    transition: 0.2s;
  }
`;
const AssetWrapper = styled.div`
  .my-asset {
    margin-right: 20px;
    border-radius: 0.2rem;
    font-weight: bold;
    color: "#a4a4a4";
    transition: 0.2s;
  }
  .my-asset:hover {
    background-color: ${MAIN_COLOR_1};
    color: ${WHITE};
    transition: 0.2s;
  }
`;
const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;

  .current-currency-price {
    font-size: 20px;
    font-weight: bold;
    transition: 0.2s;
  }

  .current-currency-price:hover {
    background-color: ${MAIN_COLOR_1};
    color: ${WHITE};
    transition: 0.2s;
  }

  .order-input {
    margin-top: 30px;
    width: 350px;
    height: 50px;
    font-size: 20px;
  }
`;

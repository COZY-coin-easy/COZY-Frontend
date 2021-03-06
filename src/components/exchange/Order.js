import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import OrderModal from "../modal/OrderModal";
import { orderRequest } from "../../features/user/userSlice";
import { MAIN_COLOR_1, WHITE } from "../../constants/styles";

export default function Order() {
  const dispatch = useDispatch();
  const { currencyName } = useParams();

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const { asset, token, _id } = useSelector((state) => state.user.user);
  const coinList = useSelector((state) => state.socket.coinList);

  const [isBuy, setIsBuy] = useState(true);
  const [unitsTraded, setUnitsTraded] = useState("");
  const [currentCurrencyPrice, setCurrentCurrencyPrice] = useState(
    coinList[currencyName].closing_price
  );
  const [isOpenModal, setIsOpenModal] = useState({
    isTrade: false,
    isRequest: false,
    isComplete: false,
    isFailInput: false,
    isNotAuth: false,
    isFailTrade: false,
  });

  const { cash, coins } = asset;
  const {
    isTrade,
    isRequest,
    isComplete,
    isNotAuth,
    isFailInput,
    isFailTrade,
  } = isOpenModal;

  const total = Number(currentCurrencyPrice) * Number(unitsTraded);
  let coin = null;
  for (let i = 0; i < coins.length; i++) {
    if (coins[i].currencyName === currencyName) {
      coin = coins[i];

      break;
    }
  }

  useEffect(() => {
    const ws = new WebSocket(process.env.REACT_APP_WEBSOCKET_SERVER_URL);

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
  }, [currencyName]);

  const handleChangeInputValue = (e) => {
    setUnitsTraded(e.target.value);
  };

  const handleClickToggle = (e) => {
    if (e.target.value === "??????" && !isBuy) {
      setIsBuy(true);
      setUnitsTraded("");
    }

    if (e.target.value === "??????" && isBuy) {
      setIsBuy(false);
      setUnitsTraded("");
    }
  };

  const handleClickOpenTradeModal = (e) => {
    e.preventDefault();

    if (!isLoggedIn) {
      setIsOpenModal({
        ...isOpenModal,
        isNotAuth: true,
      });

      return;
    }

    if (unitsTraded === "" || Number(unitsTraded) < 0.0001) {
      setIsOpenModal({
        ...isOpenModal,
        isFailInput: true,
      });

      return;
    }

    setIsOpenModal({
      ...isOpenModal,
      isTrade: true,
    });
  };

  const handleClickCloseModal = () => {
    setIsOpenModal({
      ...isOpenModal,
      isTrade: false,
      isComplete: false,
      isNotAuth: false,
      isFailInput: false,
      isFailTrade: false,
    });
  };

  const handleClickTrade = () => {
    if (isBuy && cash - total < 0) {
      setIsOpenModal({
        ...isOpenModal,
        isTrade: false,
        isFailTrade: true,
      });

      return;
    }

    if (!isBuy && (coin === null || coin.quantity < Number(unitsTraded))) {
      setIsOpenModal({
        ...isOpenModal,
        isTrade: false,
        isFailTrade: true,
      });

      return;
    }

    dispatch(
      orderRequest({
        transactionDate: new Date(),
        currencyName,
        price: Number(currentCurrencyPrice),
        unitsTraded: Number(unitsTraded),
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

    setUnitsTraded("");
  };

  return (
    <>
      <OrderWrapper>
        <AssetWrapper>
          <span className="my-asset">
            ?????? ??????: {Math.round(cash).toLocaleString()} ???{" "}
          </span>
          <span className="my-asset">
            ?????? {currencyName}:{" "}
            {coin ? coin.quantity.toFixed(4).toLocaleString() : 0} ???
          </span>
          <span className="my-asset">
            ???????????????:{" "}
            {coin ? Math.round(coin.averagePrice).toLocaleString() : 0} ???
          </span>
        </AssetWrapper>
        <OrderBoxWrapper>
          <ToggleTradeButton>
            <button
              className="trade-toggle-button"
              onClick={handleClickToggle}
              value="??????"
              style={{ color: isBuy ? "#f75467" : "#a4a4a4" }}
            >
              ??????
            </button>
            <button
              className="trade-toggle-button"
              onClick={handleClickToggle}
              value="??????"
              style={{ color: !isBuy ? "#4386f9" : "#a4a4a4" }}
            >
              ??????
            </button>
          </ToggleTradeButton>

          <form>
            <InputWrapper>
              <div className="current-currency-price">
                ?????? {currencyName}??? ??????:{" "}
                {Number(currentCurrencyPrice).toLocaleString()}???
              </div>
              <div>
                <input
                  type="number"
                  placeholder="??????"
                  name="unitsTraded"
                  className="order-input"
                  min="0"
                  step="0.0001"
                  onChange={handleChangeInputValue}
                  onKeyDown={(e) => e.key === "e" && e.preventDefault()}
                  value={unitsTraded}
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="??????"
                  className="order-input"
                  value={total.toLocaleString()}
                  readOnly
                />
              </div>
            </InputWrapper>
          </form>

          <TradeButton
            type="button"
            className="trade-button"
            onClick={handleClickOpenTradeModal}
            style={{ backgroundColor: isBuy ? "#f75467" : "#4386f9" }}
          >
            {isBuy ? "????????????" : "????????????"}
          </TradeButton>
        </OrderBoxWrapper>
      </OrderWrapper>
      {(isTrade || isComplete || isNotAuth || isFailInput || isFailTrade) && (
        <OrderModal
          onTrade={handleClickTrade}
          onClose={handleClickCloseModal}
          isTrade={isTrade}
        >
          {isTrade && (isBuy ? "???????????????????????? ?" : "???????????????????????? ?")}
          {isComplete &&
            (isRequest ? (
              "????????? ?????????????????????."
            ) : (
              <>
                <div>???????????? ?????????</div> <div>??????????????? ?????????????????????.</div>
              </>
            ))}
          {isNotAuth && "???????????? ????????? ??????????????????."}
          {isFailInput &&
            (!unitsTraded < 0.0001 ? (
              <>
                <div>????????? 0.0001?????????</div> <div>???????????? ??? ????????????.</div>
              </>
            ) : (
              "????????? ??????????????????."
            ))}
          {isFailTrade &&
            (isBuy ? "?????? ????????? ???????????????." : "?????? ????????? ???????????????.")}
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

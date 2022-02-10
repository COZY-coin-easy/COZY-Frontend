import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import styled from "styled-components";
import Modal from "./Modal";

const CheckModalWrapper = styled.div`
    width: 30%;
    height: 70%;
    position: fixed;
    left: 55%;
    top: 20%;
    background-color: white;
  }
`;

const Dimmed = styled.div`
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0%;
  top: 0%;
  background-color: rgba(0, 0, 0, 0.5);
`;

export default function Order() {
  const [cash, setCash] = useState(0);
  const [coin, setCoin] = useState({});
  const [isBuy, setIsBuy] = useState(true);
  const [isOpenModal, setIsOpenModal] = useState({
    isTrade: false,
    isComplete: false,
    isFail: false,
  });

  const { isTrade, isComplete, isFail } = isOpenModal;
  const [inputs, setInputs] = useState({
    price: "",
    unitsTraded: "",
  });
  const userId = useSelector((state) => state.user.userId);
  const token = useSelector((state) => state.user.token);
  const { currencyName } = useParams();

  const { price, unitsTraded } = inputs;
  const total = price * unitsTraded;

  useEffect(() => {
    const getUserAsset = async () => {
      const res = await axios.get(
        `http://localhost:8000/users/asset/${userId}`,
        {
          headers: { authorization: token },
        }
      );

      const { cash, coins } = res.data.asset;

      setCash(cash);

      for (let i = 0; i < coins.length; i++) {
        if (coins[i].currencyName === currencyName) {
          setCoin(coins[i]);
          return;
        }
      }
    };

    getUserAsset();
  }, []);

  const handleChangeInputValue = (e) => {
    const { value, name } = e.target;

    setInputs({
      ...inputs,
      [name]: Number(value) === 0 ? "" : Number(value),
    });
  };

  const handleClickToggle = (e) => {
    if (e.target.value === "매수" && !isBuy) {
      setIsBuy(true);

      setInputs({
        price: "",
        unitsTraded: "",
      });
    }

    if (e.target.value === "매도" && isBuy) {
      setIsBuy(false);

      setInputs({
        price: "",
        unitsTraded: "",
      });
    }
  };

  const handleClickOpenModal = (e) => {
    e.preventDefault();
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
      isFail: false,
    });
  };

  const handleClickTrade = async () => {
    if (isBuy && cash - total < 0) {
      setIsOpenModal({
        ...isOpenModal,
        isFail: true,
      });

      return;
    }

    if (!isBuy && coin.quantity < unitsTraded) {
      setIsOpenModal({
        ...isOpenModal,
        isFail: true,
      });

      return;
    }

    await axios.post(
      `http://localhost:8000/users/order/${userId}`,
      {
        transactionDate: new Date(),
        currencyName,
        price,
        unitsTraded,
        total: isBuy ? -total : total,
      },
      { headers: { authorization: token } }
    );

    setIsOpenModal({
      ...isOpenModal,
      isTrade: false,
      isComplete: true,
    });

    setInputs({
      price: "",
      unitsTraded: "",
    });
    setCash(isBuy ? cash - total : cash + total);
    setCoin({
      ...coin,
      quantity: isBuy
        ? coin.quantity + unitsTraded
        : coin.quantity - unitsTraded,
    });
  };

  return (
    <>
      <div>보유 현금: {cash}원 </div>
      {coin && (
        <>
          <div>
            현재 가지고 있는 {currencyName}: {coin.quantity ? coin.quantity : 0}
            개
          </div>
          <div>평균매수가: {coin.averagePrice ? coin.averagePrice : 0}원</div>
        </>
      )}

      <div className="order-box">
        <div>
          <button onClick={handleClickToggle} value="매수">
            매수
          </button>
          <button onClick={handleClickToggle} value="매도">
            매도
          </button>
        </div>

        <div>
          <form>
            <input
              type="number"
              placeholder="가격"
              name="price"
              onChange={handleChangeInputValue}
              value={price}
            />
            <input
              type="number"
              placeholder="수량"
              name="unitsTraded"
              onChange={handleChangeInputValue}
              value={unitsTraded}
            />
            <input type="number" placeholder="총액" value={total} readOnly />
          </form>
          {isBuy ? (
            <button type="submit" onClick={handleClickOpenModal}>
              매수하기
            </button>
          ) : (
            <button type="submit" onClick={handleClickOpenModal}>
              매도하기
            </button>
          )}
        </div>
        {isTrade && (
          <>
            <Dimmed onClick={handleClickCloseModal}></Dimmed>
            <CheckModalWrapper>
              <Modal>
                <button onClick={handleClickCloseModal}>X</button>
                {isBuy ? (
                  <>
                    <div>매수하시겠습니까 ?</div>
                    <button onClick={handleClickTrade}>확인</button>
                    <button onClick={handleClickCloseModal}>취소</button>
                  </>
                ) : (
                  <>
                    <div>매도하시겠습니까 ?</div>
                    <button onClick={handleClickTrade}>확인</button>
                    <button onClick={handleClickCloseModal}>취소</button>
                  </>
                )}
              </Modal>
            </CheckModalWrapper>
          </>
        )}
        {isComplete && (
          <>
            <Dimmed onClick={handleClickCloseModal}></Dimmed>
            <CheckModalWrapper>
              <Modal>
                <button onClick={handleClickCloseModal}>X</button>
                <div>거래가 완료되었습니다.</div>
                <button onClick={handleClickCloseModal}>확인</button>
              </Modal>
            </CheckModalWrapper>
          </>
        )}
        {isFail && (
          <>
            <Dimmed onClick={handleClickCloseModal}></Dimmed>
            <CheckModalWrapper>
              <Modal>
                <button onClick={handleClickCloseModal}>X</button>
                <div>
                  {isBuy
                    ? "보유 금액이 부족합니다."
                    : "보유 수량이 부족합니다."}
                </div>
                <button onClick={handleClickCloseModal}>확인</button>
              </Modal>
            </CheckModalWrapper>
          </>
        )}
      </div>
    </>
  );
}

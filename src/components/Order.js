import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import Modal from "./Modal";
import { orderRequest } from "../features/user/userSlice";

const CheckModalWrapper = styled.div`
  width: 30%;
  height: 70%;
  position: fixed;
  left: 55%;
  top: 20%;
  background-color: white;
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
  const dispatch = useDispatch();
  const { currencyName } = useParams();

  const [isBuy, setIsBuy] = useState(true);
  const [isOpenModal, setIsOpenModal] = useState({
    isTrade: false,
    isComplete: false,
    isFail: false,
  });
  const [inputs, setInputs] = useState({
    price: "",
    unitsTraded: "",
  });

  const { asset, token, _id } = useSelector((state) => state.user.user);

  const { cash, coins } = asset;
  const { isTrade, isComplete, isFail } = isOpenModal;
  const { price, unitsTraded } = inputs;

  const total = price * unitsTraded;

  let coin = null;
  for (let i = 0; i < coins.length; i++) {
    if (coins[i].currencyName === currencyName) {
      coin = coins[i];

      break;
    }
  }

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

  const handleClickOpenTradeModal = (e) => {
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

    dispatch(
      orderRequest({
        transactionDate: new Date(),
        currencyName,
        price: isBuy ? -price : price,
        unitsTraded: isBuy ? unitsTraded : -unitsTraded,
        total: isBuy ? -total : total,
        token,
        _id,
      })
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
  };

  return (
    <>
      <div>보유 현금: {cash}원 </div>
      <div>
        현재 가지고 있는 {currencyName}:{coin ? coin.quantity : 0}개
      </div>
      <div>평균매수가: {coin ? coin.averagePrice : 0}원</div>

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
            <button type="submit" onClick={handleClickOpenTradeModal}>
              매수하기
            </button>
          ) : (
            <button type="submit" onClick={handleClickOpenTradeModal}>
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

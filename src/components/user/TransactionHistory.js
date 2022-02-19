import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled, { ThemeProvider } from "styled-components";
import { DateRangeInput } from "@datepicker-react/styled";
import HelpModal from "../modal/HelpModal";
import { openHelpModal, closeHelpModal } from "../../features/user/userSlice";
import { signInWithGoogle } from "../../firebase";
import {
  MAIN_COLOR_1,
  MAIN_COLOR_2,
  MAIN_COLOR_3,
  WHITE,
  BLACK,
  LIGHT_GREY,
} from "../../constants/styles";

export default function TransactionHistory() {
  const dispatch = useDispatch();
  const { displayName, transactionHistory } = useSelector(
    (state) => state.user.user
  );
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const isOpenHelpModal = useSelector((state) => state.user.isOpenHelpModal);

  const [filteredTransactionHistory, setFilteredTransactionHistory] =
    useState(transactionHistory);
  const [transactionNumber, setTransactionNumber] = useState(5);
  const [focusedInput, setFocusedInput] = useState("");
  const [dates, setDates] = useState({
    startDate: null,
    endDate: null,
  });

  const currentHistory = filteredTransactionHistory.slice(0, transactionNumber);

  const handleClickShowMoreTransaction = () => {
    setTransactionNumber(transactionNumber + 5);
  };

  const handleClickSearch = () => {
    let filtered = null;
    const coinName = document.getElementById("coin-search").value;

    if (!dates.startDate || !dates.endDate) {
      filtered = transactionHistory.filter(
        (transaction) => transaction.currencyName === coinName
      );

      setFilteredTransactionHistory(filtered);
      return;
    }

    filtered = transactionHistory.filter((transaction) => {
      if (coinName !== "") {
        return (
          transaction.currencyName === coinName &&
          dates.endDate >=
            new Date(transaction.transactionDate).setDate(
              new Date(transaction.transactionDate).getDate() - 1
            ) &&
          new Date(transaction.transactionDate) >= dates.startDate
        );
      } else {
        return (
          dates.endDate >=
            new Date(transaction.transactionDate).setDate(
              new Date(transaction.transactionDate).getDate() - 1
            ) && new Date(transaction.transactionDate) >= dates.startDate
        );
      }
    });

    setFilteredTransactionHistory(filtered);
  };

  const handleClickRefreshFilter = () => {
    setFilteredTransactionHistory(transactionHistory);
    setDates({ startDate: null, endDate: null });
    document.getElementById("coin-search").value = "";
  };

  return (
    <>
      <Anchor />
      {isLoggedIn ? (
        <>
          <SearchDiv>
            <Input placeholder="자산구분" id="coin-search" type="text" />
            <ThemeProvider
              theme={{
                breakpoints: ["32em", "48em", "64em"],
                reactDatepicker: {
                  daySize: [36, 40],
                  fontFamily: "system-ui, -apple-system",
                  colors: {
                    accessibility: MAIN_COLOR_2,
                    selectedDay: MAIN_COLOR_3,
                    selectedDayHover: MAIN_COLOR_1,
                    primaryColor: MAIN_COLOR_1,
                  },
                },
              }}
            >
              <DateRangeInput
                onDatesChange={(data) => setDates(data)}
                onFocusChange={(focusedInput) => setFocusedInput(focusedInput)}
                startDate={dates.startDate}
                endDate={dates.endDate}
                focusedInput={focusedInput}
                displayFormat="yyyy-MM-dd"
                numberOfMonths={1}
              />
            </ThemeProvider>
            <Button onClick={handleClickSearch}>검색</Button>
            <Button onClick={handleClickRefreshFilter}>검색 내용 초기화</Button>
          </SearchDiv>

          <BodyWrapper>
            <TitleWrapper>거래시각</TitleWrapper>
            <TitleWrapper>자산구분</TitleWrapper>
            <TitleWrapper>주문수량</TitleWrapper>
            <TitleWrapper>거래구분</TitleWrapper>
            <TitleWrapper>주문가격</TitleWrapper>
            <TitleWrapper>주문금액</TitleWrapper>
            <button
              className="help-button"
              onClick={() => dispatch(openHelpModal())}
            >
              도움말
            </button>
          </BodyWrapper>

          {currentHistory.length ? (
            currentHistory.map((transaction) => (
              <div key={transaction._id}>
                <Line />
                <BodyWrapper>
                  <Wrapper>
                    {new Date(transaction.transactionDate).getFullYear()}-
                    {(
                      "0" +
                      (new Date(transaction.transactionDate).getMonth() + 1)
                    ).slice(-2)}
                    -
                    {(
                      "0" + new Date(transaction.transactionDate).getDate()
                    ).slice(-2)}
                    <br />
                    {(
                      "0" + new Date(transaction.transactionDate).getHours()
                    ).slice(-2)}
                    :
                    {(
                      "0" + new Date(transaction.transactionDate).getMinutes()
                    ).slice(-2)}
                    :
                    {(
                      "0" + new Date(transaction.transactionDate).getSeconds()
                    ).slice(-2)}
                  </Wrapper>
                  <Wrapper>{transaction.currencyName}</Wrapper>
                  <Wrapper>{transaction.unitsTraded}개</Wrapper>
                  <Wrapper>{transaction.isBuy ? "매수" : "매도"}</Wrapper>
                  <Wrapper>{transaction.price.toLocaleString()}원</Wrapper>
                  <Wrapper>
                    {transaction.total < 0
                      ? `${-Number(
                          transaction.total.toFixed(3)
                        ).toLocaleString()}원`
                      : `${Number(
                          transaction.total.toFixed(3)
                        ).toLocaleString()}원`}
                  </Wrapper>
                </BodyWrapper>
              </div>
            ))
          ) : (
            <>
              <Line />
              <Message>검색 결과가 없습니다.</Message>
            </>
          )}
          {isLoggedIn && (
            <LoadButton onClick={handleClickShowMoreTransaction}>
              거래내역 더보기
            </LoadButton>
          )}
        </>
      ) : (
        <>
          <Message>로그인 후 이용 가능한 서비스입니다.</Message>
          <LoginButton onClick={signInWithGoogle}>구글 로그인</LoginButton>
        </>
      )}

      {isOpenHelpModal && (
        <HelpModal onClose={() => dispatch(closeHelpModal())}>
          <>
            <p>
              현재 페이지는 {displayName}님이 거래한 내역을 볼 수 있는
              페이지입니다.{" "}
            </p>
            <p>
              현재 페이지에서는 {displayName}님이 어떤 코인을 매수를 했는지,
              매도를 했는지 그리고 얼마를 주고 거래를 했는지 볼 수 있습니다.{" "}
            </p>
          </>
        </HelpModal>
      )}
    </>
  );
}

const BodyWrapper = styled.div`
  display: flex;
  margin: 20px;
  align-items: center;
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

const Wrapper = styled.div`
  margin-left: 10px;
  margin-right: 10px;
  width: 20vh;
  text-align: center;
  color: ${BLACK};
`;

const TitleWrapper = styled(Wrapper)`
  text-align: center;
  font-weight: 500;
`;

const Anchor = styled.span`
  display: block;
  height: 80px;
  visibility: hidden;
`;

const Button = styled.button`
  height: 35px;
  background: ${WHITE};
  color: ${MAIN_COLOR_2};
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

const LoginButton = styled(Button)`
  color: ${WHITE};
  background: ${MAIN_COLOR_3};
  width: 100px;
  display: block;
  margin: auto;

  :hover {
    background-color: ${MAIN_COLOR_2};
    border-color: ${MAIN_COLOR_2};
    transition: 0.2s;
  }
`;

const LoadButton = styled(Button)`
  float: right;
  margin-right: 10px;
`;

const SearchDiv = styled.div`
  margin-bottom: 50px;
  display: flex;
  align-items: center;
  justify-content: space-around;
`;

const Input = styled.input`
  height: 40px;
`;

const Message = styled.h4`
  text-align: center;
`;

const Line = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${LIGHT_GREY};
`;

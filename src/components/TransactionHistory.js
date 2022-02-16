import React, { useState } from "react";
import { useSelector } from "react-redux";
import styled, { ThemeProvider } from "styled-components";
import { DateRangeInput } from "@datepicker-react/styled";
import {
  MAIN_COLOR_1,
  MAIN_COLOR_2,
  MAIN_COLOR_3,
  WHITE,
  BLACK,
  LIGHT_GREY,
} from "../constants/styles";

export default function TransactionHistory() {
  const { transactionHistory } = useSelector((state) => state.user.user);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
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
    const coinName = document.getElementById("coin-search").value;
    const filtered = transactionHistory.filter((transaction) => {
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
                {("0" + new Date(transaction.transactionDate).getDate()).slice(
                  -2
                )}
                <br />
                {("0" + new Date(transaction.transactionDate).getHours()).slice(
                  -2
                )}
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
              <Wrapper>
                {transaction.unitsTraded < 0
                  ? -transaction.unitsTraded
                  : transaction.unitsTraded}
              </Wrapper>
              <Wrapper>{transaction.unitsTraded < 0 ? "매도" : "매수"}</Wrapper>
              <Wrapper>{transaction.price.toLocaleString()}</Wrapper>
              <Wrapper>
                {transaction.total < 0
                  ? -Number(transaction.total).toFixed(3)
                  : Number(transaction.total).toFixed(3)}
              </Wrapper>
            </BodyWrapper>
          </div>
        ))
      ) : (
        <>
          <Line />
          <Message>
            {isLoggedIn
              ? "검색 결과가 없습니다"
              : "로그인 후 이용하실 수 있는 서비스입니다."}
          </Message>
        </>
      )}
      {isLoggedIn && (
        <LoadButton onClick={handleClickShowMoreTransaction}>
          거래내역 더보기
        </LoadButton>
      )}
    </>
  );
}

const BodyWrapper = styled.div`
  display: flex;
  margin: 20px;
  align-items: center;
  justify-content: space-around;
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
  height: 40px;
  background: ${WHITE};
  color: ${MAIN_COLOR_1};
  border-color: ${WHITE};
  border-style: none;
  border-radius: 0.2rem;
  cursor: pointer;

  :hover {
    background-color: ${MAIN_COLOR_3};
    border-color: ${MAIN_COLOR_3};
    color: ${WHITE};
    transition: 0.2s;
  }
`;

const LoadButton = styled(Button)`
  float: right;
  margin-right: 10px;
`;

const SearchDiv = styled.div`
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

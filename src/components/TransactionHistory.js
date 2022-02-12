import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import styled, { ThemeProvider } from "styled-components";
import { DateRangeInput } from "@datepicker-react/styled";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";

const BodyWrapper = styled.div`
  display: flex;
  margin: 20px;
`;

const Wrapper = styled.div`
  margin-left: 10px;
  margin-right: 10px;
  white-space: pre-wrap;
`;

export default function TransactionHistory() {
  const userId = useSelector((state) => state.user.userId);
  const token = useSelector((state) => state.user.token);
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [transactionNumber, setTransactionNumber] = useState(5);
  const [filteredTransactionHistory, setFilteredTransactionHistory] = useState(
    []
  );
  const [focusedInput, setFocusedInput] = useState("");
  const [dates, setDates] = useState({
    startDate: null,
    endDate: null,
  });

  useEffect(() => {
    const getTransactionHistory = async () => {
      const res = await axios.get(
        `${process.env.REACT_APP_TRANSACTIONHISTORY_REQUEST}/${userId}`,
        {
          headers: {
            authorization: token,
          },
        }
      );

      setTransactionHistory(res.data.data);
      setFilteredTransactionHistory(res.data.data);
    };

    getTransactionHistory();
  }, []);

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
      <ThemeProvider
        theme={{
          breakpoints: ["32em", "48em", "64em"],
          reactDatepicker: {
            daySize: [36, 40],
            fontFamily: "system-ui, -apple-system",
            colors: {
              accessibility: "#f76f61",
              selectedDay: "#ffcdc7",
              selectedDayHover: "#FE8679",
              primaryColor: "#FE8679",
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
      <input placeholder="자산구분" id="coin-search"></input>
      <button onClick={handleClickSearch}>검색</button>
      <button onClick={handleClickRefreshFilter}>검색 내용 초기화</button>
      <BodyWrapper>
        <Wrapper>주문일시</Wrapper>
        <Wrapper>자산</Wrapper>
        <Wrapper>주문수량</Wrapper>
        <Wrapper>거래구분</Wrapper>
        <Wrapper>주문가격</Wrapper>
        <Wrapper>주문금액</Wrapper>
      </BodyWrapper>

      {currentHistory.length ? (
        currentHistory.map((transaction) => (
          <BodyWrapper key={transaction._id}>
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
              {("0" + new Date(transaction.transactionDate).getMinutes()).slice(
                -2
              )}
              :
              {("0" + new Date(transaction.transactionDate).getSeconds()).slice(
                -2
              )}
            </Wrapper>
            <Wrapper>{transaction.currencyName}</Wrapper>
            <Wrapper>
              {transaction.unitsTraded < 0
                ? -transaction.unitsTraded
                : transaction.unitsTraded}
            </Wrapper>
            <Wrapper>{transaction.unitsTraded < 0 ? "매도" : "매수"}</Wrapper>
            <Wrapper>{transaction.price}</Wrapper>
            <Wrapper>
              {transaction.total < 0 ? -transaction.total : transaction.total}
            </Wrapper>
          </BodyWrapper>
        ))
      ) : (
        <h4>검색 결과가 없습니다</h4>
      )}

      <button onClick={handleClickShowMoreTransaction}>거래내역 더보기</button>
    </>
  );
}

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import axios from "axios";

const BodyWrapper = styled.div`
  display: flex;
  margin: 20px;
`;

const Wrapper = styled.div`
  margin-left: 10px;
  margin-right: 10px;
`;

export default function TransactionHistory() {
  const userId = useSelector((state) => state.user.userId);
  const token = useSelector((state) => state.user.token);
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [transactionNumber, setTransactionNumber] = useState(5);

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
    };

    getTransactionHistory();
  }, []);

  const handleClickShowMoreTransaction = () => {
    setTransactionNumber(transactionNumber + 5);
  };
  const currentHistory = transactionHistory.slice(0, transactionNumber);
  return (
    <>
      <BodyWrapper>
        <Wrapper>주문일시</Wrapper>
        <Wrapper>자산</Wrapper>
        <Wrapper>주문수량</Wrapper>
        <Wrapper>주문가격</Wrapper>
        <Wrapper>주문금액</Wrapper>
      </BodyWrapper>
      {currentHistory.map((transaction) => (
        <BodyWrapper key={transaction._id}>
          <Wrapper>{transaction.transactionDate.slice(0, 10)}</Wrapper>
          <Wrapper>{transaction.currencyName}</Wrapper>
          <Wrapper>{transaction.total / transaction.price}</Wrapper>
          <Wrapper>{transaction.price}</Wrapper>
          <Wrapper>{transaction.total}</Wrapper>
        </BodyWrapper>
      ))}
      <button onClick={handleClickShowMoreTransaction}>거래내역 더보기</button>
    </>
  );
}

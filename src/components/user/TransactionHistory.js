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
            <Input placeholder="????????????" id="coin-search" type="text" />
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
            <Button onClick={handleClickSearch}>??????</Button>
            <Button onClick={handleClickRefreshFilter}>?????? ?????? ?????????</Button>
          </SearchDiv>

          <BodyWrapper>
            <TitleWrapper>????????????</TitleWrapper>
            <TitleWrapper>????????????</TitleWrapper>
            <TitleWrapper>????????????</TitleWrapper>
            <TitleWrapper>????????????</TitleWrapper>
            <TitleWrapper>????????????</TitleWrapper>
            <TitleWrapper>????????????</TitleWrapper>
            <button
              className="help-button"
              onClick={() => dispatch(openHelpModal())}
            >
              ?????????
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
                  <Wrapper>{transaction.unitsTraded}???</Wrapper>
                  <Wrapper>{transaction.isBuy ? "??????" : "??????"}</Wrapper>
                  <Wrapper>{transaction.price.toLocaleString()}???</Wrapper>
                  <Wrapper>
                    {transaction.total < 0
                      ? `${-Number(
                          transaction.total.toFixed(3)
                        ).toLocaleString()}???`
                      : `${Number(
                          transaction.total.toFixed(3)
                        ).toLocaleString()}???`}
                  </Wrapper>
                </BodyWrapper>
              </div>
            ))
          ) : (
            <>
              <Line />
              <Message>?????? ????????? ????????????.</Message>
            </>
          )}
          {isLoggedIn && (
            <LoadButton onClick={handleClickShowMoreTransaction}>
              ???????????? ?????????
            </LoadButton>
          )}
        </>
      ) : (
        <>
          <Message>????????? ??? ?????? ????????? ??????????????????.</Message>
          <LoginButton onClick={signInWithGoogle}>?????? ?????????</LoginButton>
        </>
      )}

      {isOpenHelpModal && (
        <HelpModal onClose={() => dispatch(closeHelpModal())}>
          <>
            <p>
              ?????? ???????????? {displayName}?????? ????????? ????????? ??? ??? ??????
              ??????????????????.{" "}
            </p>
            <p>
              ?????? ?????????????????? {displayName}?????? ?????? ????????? ????????? ?????????,
              ????????? ????????? ????????? ????????? ?????? ????????? ????????? ??? ??? ????????????.{" "}
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

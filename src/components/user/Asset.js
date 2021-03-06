import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import { NavLink } from "react-router-dom";
import HelpModal from "../modal/HelpModal";
import { signInWithGoogle } from "../../firebase";
import { openHelpModal, closeHelpModal } from "../../features/user/userSlice";
import {
  ascendSortAboutName,
  ascendSortAboutMoney,
  descendSortAboutName,
  descendSortAboutMoney,
} from "../../util/sort";
import {
  MAIN_COLOR_1,
  MAIN_COLOR_2,
  MAIN_COLOR_3,
  WHITE,
  BLACK,
  LIGHT_GREY,
  RED,
  BLUE,
} from "../../constants/styles";

export default function Asset() {
  const dispatch = useDispatch();
  const { displayName, asset } = useSelector((state) => state.user.user);
  const isOpenHelpModal = useSelector((state) => state.user.isOpenHelpModal);

  const tickerCoinList = useSelector((state) => state.socket.coinList);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const ownedCoinList = asset.coins;

  const [searchCoin, setSearchCoin] = useState("");
  const [coinList, setCoinList] = useState([]);
  const [newCoinList, setNewCoinList] = useState([]);
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
    const ws = new WebSocket(process.env.REACT_APP_WEBSOCKET_SERVER_URL);

    ws.onmessage = (event) => {
      const res = JSON.parse(event.data);
      const socketCoinData = res.content;
      const socketCoinName = socketCoinData.symbol.split("_")[0];
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
    const parsedTickerCoin = JSON.parse(JSON.stringify(tickerCoinList));
    const coinName = Object.keys(parsedTickerCoin);
    const coinInfo = Object.values(parsedTickerCoin);

    coinName.pop();
    coinInfo.pop();

    for (let i = 0; i < coinInfo.length; i++) {
      coinInfo[i].currency_name = coinName[i];
    }

    setCoinList(coinInfo);
  }, [tickerCoinList]);

  useEffect(() => {
    const parsedCoinList = JSON.parse(JSON.stringify(ownedCoinList));

    for (let i = 0; i < parsedCoinList.length; i++) {
      parsedCoinList[i].bought_price =
        parsedCoinList[i].quantity * parsedCoinList[i].averagePrice;
    }

    setNewCoinList(parsedCoinList);
  }, [ownedCoinList]);

  const filteredCoinList =
    searchCoin === ""
      ? newCoinList
      : newCoinList.filter((coin) => coin.currencyName === searchCoin);

  filteredCoinList.forEach((coin) => {
    if (coinList) {
      coinList.map((coinItem) => {
        if (coin.currencyName === coinItem.currency_name) {
          coin.current_price = coinItem.closing_price;
          coin.evaluate_price = coin.quantity * coinItem.closing_price;
          coin.evaluate_profit =
            coin.quantity * coinItem.closing_price - coin.bought_price;
          coin.yield_rate =
            ((coin.quantity * coinItem.closing_price - coin.bought_price) /
              coin.bought_price) *
            100;
        }

        return coin;
      });
    }

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

  const handleClickSearch = () => {
    const coinName = document.getElementById("coin-search").value;
    setSearchCoin(coinName);
  };

  const handleKeyUpSearch = (e) => {
    if (e.key === "Enter") {
      const coinName = e.target.value;
      setSearchCoin(coinName);
    }
  };

  const handleClickRefreshFilter = () => {
    document.getElementById("coin-search").value = "";
    setSearchCoin("");
  };

  const sortingByCoinName = () => {
    setIsSortBtnClick(true);
    setIsAscendSort({
      ...isAscendSort,
      isName: !isName,
    });

    isName
      ? setRenderedAssetList(
          filteredCoinList.sort((a, b) =>
            descendSortAboutName(a.currencyName, b.currencyName)
          )
        )
      : setRenderedAssetList(
          filteredCoinList.sort((a, b) =>
            ascendSortAboutName(a.currencyName, b.currencyName)
          )
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
          filteredCoinList.sort((a, b) =>
            descendSortAboutMoney(a.quantity, b.quantity)
          )
        )
      : setRenderedAssetList(
          filteredCoinList.sort((a, b) =>
            ascendSortAboutMoney(a.quantity, b.quantity)
          )
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
          filteredCoinList.sort((a, b) =>
            descendSortAboutMoney(a.averagePrice, b.averagePrice)
          )
        )
      : setRenderedAssetList(
          filteredCoinList.sort((a, b) =>
            ascendSortAboutMoney(a.averagePrice, b.averagePrice)
          )
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
          filteredCoinList.sort((a, b) =>
            descendSortAboutMoney(a.bought_price, b.bought_price)
          )
        )
      : setRenderedAssetList(
          filteredCoinList.sort((a, b) =>
            ascendSortAboutMoney(a.bought_price, b.bought_price)
          )
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
          filteredCoinList.sort((a, b) =>
            descendSortAboutMoney(
              a.quantity * a.current_price,
              b.quantity * b.current_price
            )
          )
        )
      : setRenderedAssetList(
          filteredCoinList.sort((a, b) =>
            ascendSortAboutMoney(
              a.quantity * a.current_price,
              b.quantity * b.current_price
            )
          )
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
          filteredCoinList.sort((a, b) =>
            descendSortAboutMoney(
              a.quantity * a.current_price - a.bought_price,
              b.quantity * b.current_price - b.bought_price
            )
          )
        )
      : setRenderedAssetList(
          filteredCoinList.sort((a, b) =>
            ascendSortAboutMoney(
              a.quantity * a.current_price - a.bought_price,
              b.quantity * b.current_price - b.bought_price
            )
          )
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
          filteredCoinList.sort((a, b) =>
            descendSortAboutMoney(
              (a.quantity * a.current_price - a.bought_price) / a.bought_price,
              (b.quantity * b.current_price - b.bought_price) / b.bought_price
            )
          )
        )
      : setRenderedAssetList(
          filteredCoinList.sort((a, b) =>
            ascendSortAboutMoney(
              (a.quantity * a.current_price - a.bought_price) / a.bought_price,
              (b.quantity * b.current_price - b.bought_price) / b.bought_price
            )
          )
        );
  };

  return (
    <>
      <Anchor />
      {isLoggedIn ? (
        <>
          <SearchDiv>
            <Input
              onKeyUp={handleKeyUpSearch}
              placeholder="????????????"
              id="coin-search"
              type="text"
            />
            <SearchButton onClick={handleClickSearch}>??????</SearchButton>
            <SearchButton onClick={handleClickRefreshFilter}>
              ???????????? ??????
            </SearchButton>
          </SearchDiv>
          <TitleBodyWrapper>
            <TitleWrapper>
              ?????? ??????
              <SortButton onClick={sortingByCoinName}>
                {isName ? "????" : "????"}
              </SortButton>
            </TitleWrapper>
            <TitleWrapper>
              ?????? ??????
              <SortButton onClick={sortingByCurrentLeftMoney}>
                {isLeftMoney ? "????" : "????"}
              </SortButton>
            </TitleWrapper>
            <TitleWrapper>
              ?????? ?????????
              <SortButton onClick={averageBoughtPrice}>
                {isAvgPrice ? "????" : "????"}
              </SortButton>
            </TitleWrapper>
            <TitleWrapper>
              ?????? ??????
              <SortButton onClick={boughtPrice}>
                {isBoughtPrice ? "????" : "????"}
              </SortButton>
            </TitleWrapper>
            <TitleWrapper>
              ?????? ??????
              <SortButton onClick={evaluatedPrice}>
                {isEvaluatedPrice ? "????" : "????"}
              </SortButton>
            </TitleWrapper>
            <TitleWrapper>
              ?????? ??????
              <SortButton onClick={evaluatedProfit}>
                {isEvaluatedProfit ? "????" : "????"}
              </SortButton>
            </TitleWrapper>
            <TitleWrapper>
              ?????????{" "}
              <SortButton onClick={yieldRate}>
                {isYieldRate ? "????" : "????"}
              </SortButton>
            </TitleWrapper>
            <button
              className="help-button"
              onClick={() => dispatch(openHelpModal())}
            >
              ?????????
            </button>
          </TitleBodyWrapper>
          <Line />

          {!isSortBtnClick
            ? filteredCoinList.map((coinElements) => {
                return (
                  <div key={coinElements.currencyName}>
                    <BodyWrapper>
                      <Wrapper>
                        <CoinLink to={`/trade/${coinElements.currencyName}`}>
                          {coinElements.currencyName}
                        </CoinLink>
                      </Wrapper>
                      <Wrapper>{`${coinElements.quantity.toFixed(
                        4
                      )}???`}</Wrapper>

                      <Wrapper>
                        {coinElements.averagePrice.toLocaleString()}???
                      </Wrapper>
                      <Wrapper>
                        {coinElements.bought_price.toLocaleString()}???
                      </Wrapper>
                      <Wrapper>
                        {coinElements.evaluate_price !== 0
                          ? `${coinElements.evaluate_price.toLocaleString()}???`
                          : `${(coinElements.evaluate_price = 0)}???`}
                      </Wrapper>
                      <Wrapper>
                        {coinElements.evaluate_profit ? (
                          coinElements.evaluate_profit > 0 ? (
                            <Red>
                              {coinElements.evaluate_profit.toLocaleString()}???
                            </Red>
                          ) : (
                            <Blue>
                              {coinElements.evaluate_profit.toLocaleString()}???
                            </Blue>
                          )
                        ) : (
                          `${(coinElements.evaluate_profit = 0)}???`
                        )}
                      </Wrapper>
                      <Wrapper>
                        {coinElements.evaluate_profit !== 0 ? (
                          coinElements.evaluate_profit > 0 ? (
                            <Red>{coinElements.yield_rate.toFixed(2)}%</Red>
                          ) : (
                            <Blue>{coinElements.yield_rate.toFixed(2)}%</Blue>
                          )
                        ) : (
                          `${(coinElements.yield_rate = 0)}%`
                        )}
                      </Wrapper>
                    </BodyWrapper>
                    <Line />
                  </div>
                );
              })
            : renderedAssetList.map((coinElements) => {
                return (
                  <div key={coinElements.currencyName}>
                    <BodyWrapper>
                      <Wrapper>
                        <CoinLink to={`/trade/${coinElements.currencyName}`}>
                          {coinElements.currencyName}
                        </CoinLink>
                      </Wrapper>
                      <Wrapper>{`${coinElements.quantity.toFixed(
                        4
                      )}???`}</Wrapper>

                      <Wrapper>
                        {coinElements.averagePrice.toLocaleString()}???
                      </Wrapper>
                      <Wrapper>
                        {coinElements.bought_price.toLocaleString()}???
                      </Wrapper>
                      <Wrapper>
                        {coinElements.evaluate_price !== 0 ? (
                          coinElements.evaluate_price > 0 ? (
                            <Red>
                              {coinElements.evaluate_price.toLocaleString()}???
                            </Red>
                          ) : (
                            <Blue>
                              {coinElements.evaluate_price.toLocaleString()}???
                            </Blue>
                          )
                        ) : (
                          `${(coinElements.evaluate_price = 0)}???`
                        )}
                      </Wrapper>
                      <Wrapper>
                        {coinElements.evaluate_profit ? (
                          coinElements.evaluate_profit > 0 ? (
                            <Red>
                              {coinElements.evaluate_profit.toLocaleString()}???
                            </Red>
                          ) : (
                            <Blue>
                              {coinElements.evaluate_profit.toLocaleString()}???
                            </Blue>
                          )
                        ) : (
                          `${(coinElements.evaluate_profit = 0)}???`
                        )}
                      </Wrapper>
                      <Wrapper>
                        {coinElements.evaluate_profit !== 0 ? (
                          coinElements.evaluate_profit > 0 ? (
                            <Red>{coinElements.yield_rate.toFixed(2)}%</Red>
                          ) : (
                            <Blue>{coinElements.yield_rate.toFixed(2)}%</Blue>
                          )
                        ) : (
                          `${(coinElements.yield_rate = 0)}%`
                        )}
                      </Wrapper>
                    </BodyWrapper>
                    <Line />
                  </div>
                );
              })}
        </>
      ) : (
        <>
          <Message>????????? ??? ?????? ????????? ??????????????????.</Message>
          <LoginButton className="login" onClick={signInWithGoogle}>
            ?????? ?????????
          </LoginButton>
        </>
      )}

      {isOpenHelpModal && (
        <HelpModal onClose={() => dispatch(closeHelpModal())}>
          <>
            <p>?????? ?????????????????? ??????????????? ??? ??? ?????? ??????????????????.</p>
            <p>
              ????????? ?????? ????????? ????????? ???????????? ????????? ?????? ????????? ?????????
              ????????? ??? ?????? ??? ??? ????????????.
            </p>
            <div>?????????????????? ? ????????? ????????? ?????? ??????????????????.</div>
            <div>
              ?????? ????????? {displayName}?????? ??????????????? ??????????????? ?????????
              ???????????? ??? ????????? ????????? ????????????????????????.
            </div>
            <p>
              ?????? ???????????? ? {displayName}?????? ????????? ????????? ??? ???????????????.{" "}
            </p>
            <p>
              ?????? ???????????? ? ?????? ????????? ???????????? {displayName}?????? ????????????
              ????????? ????????? ???????????? ??????????????? ?????????.
            </p>
            <p>?????? ???????????? ? {displayName}?????? ??? ????????? ?????????????????????. </p>
            <p>
              ??????????????? ? {displayName}?????? ????????? ????????? ???????????? ??????
              ???????????????.
            </p>
          </>
        </HelpModal>
      )}
    </>
  );
}
const Anchor = styled.span`
  display: block;
  height: 80px;
  visibility: hidden;
`;

const BodyWrapper = styled.div`
  display: flex;
  margin: 5px 5px;
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

const TitleBodyWrapper = styled(BodyWrapper)`
  text-align: center;
  font-size: 1rem;
  font-weight: 500;
  margin: 10px 5px 0px 5px;
`;

const TitleWrapper = styled.div`
  margin: 0px 40px;
  color: ${BLACK};
  text-align: center;
`;

const Wrapper = styled.div`
  color: ${BLACK};
  width: 100%;
  text-align: center;
`;

const Red = styled(Wrapper)`
  color: ${RED};
`;

const Blue = styled(Wrapper)`
  color: ${BLUE};
`;

const Input = styled.input`
  height: 30px;
  margin: 0px 10px;
`;

const SearchButton = styled.button`
  height: 35px;
  background: ${WHITE};
  color: ${MAIN_COLOR_1};
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
const Button = styled.button`
  height: 35px;
  background-color: ${MAIN_COLOR_3};
  color: ${WHITE};
  border-color: ${MAIN_COLOR_3};
  border-style: none;
  border-radius: 0.2rem;
  cursor: pointer;
  margin: 0px 10px;

  :hover {
    background-color: ${MAIN_COLOR_2};
    border-color: ${MAIN_COLOR_2};
    color: ${WHITE};
    transition: 0.2s;
  }
`;

const LoginButton = styled(Button)`
  width: 100px;
  display: block;
  margin: auto;
`;

const SortButton = styled(Button)`
  padding: 0px;
  margin-right: 0px;
  background-color: ${WHITE};

  :hover {
    background-color: ${WHITE};
    border-color: ${WHITE};
  }
`;

const Message = styled.h4`
  text-align: center;
`;

const Line = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${LIGHT_GREY};
`;

const CoinLink = styled(NavLink)`
  width: 20%;
  color: ${BLACK};
  text-decoration: none;
`;

const SearchDiv = styled.div`
  display: flex;
  justify-content: flex-end;
`;

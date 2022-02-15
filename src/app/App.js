import React from "react";
import { useSelector } from "react-redux";
import { Routes, Route } from "react-router-dom";

import Home from "../components/Home";
import Header from "../components/Header";
import Main from "../components/Main";
import Asset from "../components/Asset";
import Trade from "../components/Trade";
import MyPage from "../components/Mypage";
import TransactionHistory from "../components/TransactionHistory";
import Mypage from "../components/Mypage";

function App() {
  const isShowHeader = useSelector((state) => state.auth.isShowHeader);

  return (
    <>
      {isShowHeader && <Header />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/main" element={<Main />} />
        <Route path="/assets" element={<Asset />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/trade/:currencyName" element={<Trade />} />
        <Route path="/transaction-history" element={<TransactionHistory />} />
      </Routes>
    </>
  );
}

export default App;

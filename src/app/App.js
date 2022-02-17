import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Home from "../components/Home";
import Header from "../components/Header";
import Main from "../components/exchange/Main";
import Asset from "../components/user/Asset";
import Trade from "../components/exchange/Trade";
import MyPage from "../components/user/Mypage";
import TransactionHistory from "../components/user/TransactionHistory";

function App() {
  const location = useLocation();

  return (
    <>
      {location.pathname !== "/" && <Header />}

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

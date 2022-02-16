import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Home from "../components/Home";
import Header from "../components/Header";
import Main from "../components/Main";
import Asset from "../components/Asset";
import Trade from "../components/Trade";
import MyPage from "../components/Mypage";
import TransactionHistory from "../components/TransactionHistory";

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

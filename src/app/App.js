import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Home from "../components/Home";
import Header from "../components/Header";
import Main from "../components/Trade/Main";
import Asset from "../components/User/Asset";
import Trade from "../components/Trade/Trade";
import MyPage from "../components/User/Mypage";
import TransactionHistory from "../components/User/TransactionHistory";

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

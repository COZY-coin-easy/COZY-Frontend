import React from "react";
import { useSelector } from "react-redux";
import { Routes, Route } from "react-router-dom";
import Home from "../components/Home";
import Header from "../components/Header";
import Main from "../components/Main";
import Trade from "../components/Trade";

function App() {
  const isShowHeader = useSelector((state) => state.user.isShowHeader);

  return (
    <>
      {isShowHeader && <Header />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/main" element={<Main />} />
        <Route path="/trade/:currencyName" element={<Trade />} />
      </Routes>
    </>
  );
}

export default App;

import React from "react";
import { Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import Main from "../components/Main";
import Trade from "../components/Trade";
import Home from "../components/Home";
import Chart from "../components/Chart";

function App() {
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

  return (
    <>
      {isLoggedIn ? (
        <>
          <Chart />

          <Routes>
            <Route path="/" exact element={<Main />} />

            <Route path="/trade/:currencyName" exact element={<Trade />} />
          </Routes>
        </>
      ) : (
        <Home />
      )}
    </>
  );
}

export default App;

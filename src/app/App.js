import React, { useState } from "react";
import Home from "../components/Home";
import Chart from "../components/Chart";
import { useSelector } from "react-redux";

function App() {
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

  return (
    <>
      {isLoggedIn ? (
        <>
          <Chart />
          <div>메인 컴포넌트 자리입니다.</div>
        </>
      ) : (
        <Home />
      )}
    </>
  );
}

export default App;

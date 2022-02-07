import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../components/Home";
import Header from "../components/Header";
import Main from "../components/Main";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState("");
  const [isShowHeader, setIsShowHeader] = useState(false);

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>

      {isShowHeader && <Header />}
      <Routes>
        <Route path="/main" element={<Main />} />
      </Routes>
    </>
  );
}

export default App;

// <Routes>
//   <Route path="/assets" element={<Assets />} />
// </Routes>
// <Routes>
//   <Route path="/transactionHistory" element={<TransactionHistory />} />
// </Routes>
// <Routes>
//   <Route path="/:userId" element={<Mypage />} />
// </Routes>

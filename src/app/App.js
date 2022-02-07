import React from "react";
import { Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import Home from "../components/Home";
import Main from "../components/Main";
import Header from "../components/Header";

function App() {
  const isShowHeader = useSelector((state) => state.user.isShowHeader);

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

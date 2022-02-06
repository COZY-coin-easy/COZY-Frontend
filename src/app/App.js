import React, { useState } from "react";
import Home from "../components/Home";
import Main from "../components/Main";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState("");

  return (
    <>
      {isLoggedIn ? (
        <>
          <Main token={token} />
        </>
      ) : (
        <Home
          isLoggedIn={isLoggedIn}
          setIsLoggedIn={setIsLoggedIn}
          setToken={setToken}
        />
      )}
    </>
  );
}

export default App;

// components 폴더 이름 수정을 위해 잠깐 주석 남겨놓고 바로 지우겠습니다.

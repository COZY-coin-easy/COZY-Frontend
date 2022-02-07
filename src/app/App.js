import React, { useState } from "react";
import Home from "../components/Home";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState("");

  return (
    <>
      {isLoggedIn ? (
        <>
          <div>메인 컴포넌트</div>
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

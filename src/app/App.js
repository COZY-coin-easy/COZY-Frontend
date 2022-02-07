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

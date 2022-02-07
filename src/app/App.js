import React, { useState } from "react";
import Home from "../components/Home";
import Chart from "../components/Chart";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState("");

  return (
    <>
      {isLoggedIn ? (
        <>
          <Chart />
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

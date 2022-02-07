import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import PropTypes from "prop-types";
import { auth, provider } from "../firebase";

export default function Home({ setIsLoggedIn, setToken }) {
  const navigate = useNavigate();

  const signInWithGoogle = () => {
    auth.signInWithPopup(provider);
    navigate("/main");
  };

  const createUser = async (email, username) => {
    const response = await axios.post("http://localhost:8000", {
      email,
      username,
    });
  };

  useEffect(() => {
    auth.onAuthStateChanged(async (userData) => {
      if (userData) {
        const { email, displayName } = userData;
        const token = await userData.getIdToken();

        setIsLoggedIn(true);
        setToken(token);
        createUser(email, displayName);
      } else {
        setIsLoggedIn(false);
        setToken("");
      }
    });
  }, []);

  return (
    <>
      <h1>Cozy</h1>
      <button onClick={signInWithGoogle}>google login</button>
      <Link to={"/main"}>거래소 둘러보기</Link>
    </>
  );
}

Home.propTypes = {
  setIsLoggedIn: PropTypes.func,
  setToken: PropTypes.func,
};

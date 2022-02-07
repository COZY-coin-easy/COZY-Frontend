import React, { useEffect } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { auth, signInWithGoogle } from "../firebase";

export default function Home({ setIsLoggedIn, setToken }) {
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
    </>
  );
}

Home.propTypes = {
  setIsLoggedIn: PropTypes.func,
  setToken: PropTypes.func,
};

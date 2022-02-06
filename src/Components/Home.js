import React, { useEffect } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { auth, signInWithGoogle } from "../firebase";

export default function Home({ setIsLoggedIn, setToken }) {
  const getUser = async (email, username, token) => {
    const response = await axios.get("http://localhost:8000", {
      headers: {
        Autorization: token,
      },
    });

    if (response.data.result !== "success") {
      createUser(email, username);
    }
  };

  const createUser = async (email, username) => {
    await axios.post("http://localhost:8000", {
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
        getUser(email, displayName, token);
      } else {
        setIsLoggedIn(false);
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

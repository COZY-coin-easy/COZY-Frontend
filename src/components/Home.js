import React, { useEffect } from "react";
import axios from "axios";
import { auth, signInWithGoogle } from "../firebase";
import { useDispatch } from "react-redux";
import { registerAuth, registerToken, registerUserEmail } from "../features";

export default function Home() {
  const dispatch = useDispatch();
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

        dispatch(registerAuth(true));
        dispatch(registerToken(token));
        dispatch(registerUserEmail(email));

        createUser(email, displayName);
      } else {
        dispatch(registerAuth(false));
        dispatch(registerToken(""));
        dispatch(registerUserEmail(""));
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

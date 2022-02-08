import React, { useEffect } from "react";
import axios from "axios";
import { auth, signInWithGoogle } from "../firebase";
import { useDispatch, useSelector } from "react-redux";
import {
  registerAuth,
  registerToken,
  registerUserEmail,
  registerUserId,
} from "../features";

export default function Home() {
  const dispatch = useDispatch();
  const createUser = async (email, username) => {
    await axios.post("http://localhost:8000", {
      email,
      username,
    });
  };

  const getUser = async (email) => {
    const res = await axios.get("http://localhost:8000", {
      headers: { email },
    });
    const userId = res.data;
    dispatch(registerUserId(userId));
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
        getUser(email);
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

import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { auth, provider } from "../firebase";
import {
  registerAuth,
  registerToken,
  registerUserEmail,
  toggleHeader,
} from "../features";

export default function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const signInWithGoogle = () => {
    auth.signInWithPopup(provider);
  };

  const previewSite = () => {
    navigate("/main");
    dispatch(toggleHeader(true));
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

        navigate("/main");
        dispatch(registerAuth(true));
        dispatch(registerToken(token));
        dispatch(registerUserEmail(email));
        dispatch(toggleHeader(true));

        createUser(email, displayName);
      } else {
        dispatch(registerAuth(false));
        dispatch(registerToken(""));
        dispatch(registerUserEmail(""));
        dispatch(toggleHeader(false));
      }
    });
  }, []);

  return (
    <>
      <h1>Cozy</h1>
      <button onClick={signInWithGoogle}>google login</button>
      <button onClick={previewSite}>거래소 둘러보기</button>
    </>
  );
}

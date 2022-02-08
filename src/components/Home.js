import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
<<<<<<< HEAD
import { auth, signInWithGoogle } from "../firebase";
import { useDispatch, useSelector } from "react-redux";
=======
import { useDispatch } from "react-redux";
import { auth, provider } from "../firebase";
>>>>>>> 78982e522fe0276aed5cc1aaf01e13e299cd47f0
import {
  registerAuth,
  registerToken,
  registerUserEmail,
<<<<<<< HEAD
  registerUserId,
=======
  toggleHeader,
>>>>>>> 78982e522fe0276aed5cc1aaf01e13e299cd47f0
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

        navigate("/main");
        dispatch(registerAuth(true));
        dispatch(registerToken(token));
        dispatch(registerUserEmail(email));
        dispatch(toggleHeader(true));

        createUser(email, displayName);
        getUser(email);
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

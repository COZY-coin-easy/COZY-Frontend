import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, provider } from "../firebase";
import { useDispatch } from "react-redux";

import { loginRequest, visitGuest } from "../features/auth/authSlice";

export default function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const signInWithGoogle = () => {
    auth.signInWithPopup(provider);
  };

  const showPreview = () => {
    dispatch(visitGuest());
    navigate("/main");
  };

  useEffect(() => {
    auth.onAuthStateChanged(async (userData) => {
      if (userData) {
        const { email, displayName } = userData;
        const token = await userData.getIdToken();

        navigate("/main");
        dispatch(loginRequest({ email, displayName, token }));
      }
    });
  }, []);

  return (
    <>
      <h1>Cozy</h1>
      <button onClick={signInWithGoogle}>google login</button>
      <button onClick={showPreview}>거래소 둘러보기</button>
    </>
  );
}

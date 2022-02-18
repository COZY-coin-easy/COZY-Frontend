import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";

import { auth, signInWithGoogle } from "../firebase";
import { loginRequest } from "../features/auth/authSlice";
import { MAIN_COLOR_1, MAIN_COLOR_3, WHITE, BLACK } from "../constants/styles";

export default function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  const showPreview = () => {
    navigate("/main");
  };

  useEffect(() => {
    auth.onAuthStateChanged(async (userData) => {
      if (userData) {
        const { email, displayName } = userData;
        const token = await userData.getIdToken();

        if (!isLoggedIn) {
          dispatch(loginRequest({ email, displayName, token }));
        }

        navigate("/main");
      }
    });
  }, [dispatch, isLoggedIn, navigate]);

  return (
    <HomeWrapper>
      <div className="cozy-title">COZY</div>
      <div className="cozy-description">초보자를 위한 가상화폐 모의투자</div>
      <button
        className="login-button"
        data-testid="login-button"
        onClick={signInWithGoogle}
      >
        구글 로그인
      </button>
      <button className="preview-button" onClick={showPreview}>
        거래소 둘러보기
      </button>
    </HomeWrapper>
  );
}

const HomeWrapper = styled.div`
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  position: fixed;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: ${MAIN_COLOR_3};

  .cozy-title {
    color: ${MAIN_COLOR_1};
    font-size: 10rem;
    font-weight: 100;
  }
  .cozy-description {
    margin-top: 40px;
    color: ${BLACK};
    font-size: 1.5rem;
    font-weight: 100;
  }
  .login-button {
    cursor: pointer;
    margin-top: 30px;
    padding: 15px 130px 15px 130px;
    border-radius: 10px;
    border: none;
    transition: 0.3s;
    font-size: 20px;
    background-color: ${MAIN_COLOR_1};
    color: ${WHITE};
    font-weight: 100;
  }
  .login-button:hover {
    padding: 20px 132px 20px 132px;
    transition: all 0.2s linear 0s;
  }
  .preview-button {
    cursor: pointer;
    margin-top: 30px;
    padding-left: 50px;
    border: none;
    transition: 0.5s;
    font-size: 1.5rem;
    font-weight: 100;
    background-color: ${MAIN_COLOR_3};
    color: ${BLACK};
  }
  .preview-button:after {
    content: "➡️";
    opacity: 0;
  }

  .preview-button:hover {
    padding-right: 20px;
    padding-left: 8px;
  }

  .preview-button:hover:after {
    opacity: 1;
  }
`;

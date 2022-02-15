import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, provider } from "../firebase";
import { useDispatch, useSelector } from "react-redux";
import firebase from "firebase/compat/app";
import styled from "styled-components";
import { loginRequest, visitGuest } from "../features/auth/authSlice";
import { MAIN_COLOR_1 } from "../constants/styles";

export default function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  const signInWithGoogle = async () => {
    await auth.setPersistence(firebase.auth.Auth.Persistence.SESSION);

    return auth.signInWithPopup(provider);
  };

  const showPreview = () => {
    dispatch(visitGuest());
    navigate("/main");
  };

  useEffect(() => {
    auth.onAuthStateChanged(async (userData) => {
      if (userData) {
        const { email, displayName } = userData;
        const token = await userData.getIdToken(true);

        navigate("/main");
        if (!isLoggedIn) {
          dispatch(loginRequest({ email, displayName, token }));
        }
      }
    });
  }, []);

  return (
    <HomeWrapper>
      <div className="cozy-title">COZY</div>
      <div className="cozy-description">초보자를 위한 가상화폐 모의투자</div>
      <button className="login-button" onClick={signInWithGoogle}>
        구글 로그인
      </button>
      <button className="preview-button" onClick={showPreview}>
        거래소 둘러보기
      </button>
    </HomeWrapper>
  );
}

const HomeWrapper = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .cozy-title {
    color: ${MAIN_COLOR_1};
    font-size: 6rem;
    font-weight: bold;
  }
  .cozy-description {
    margin-top: 40px;
    color: ${MAIN_COLOR_1};
    font-size: 1.5rem;
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
    color: #ffffff;
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
    background-color: #ffffff;
    color: ${MAIN_COLOR_1};
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

/* .preview-button {
    margin-top: 30px;
    border: none;
    font-size: 1.5rem;
    background-color: #ffffff;
    color: ${MAIN_COLOR_1};
  }
  .preview-button:hover {
    cursor: pointer;
    transition: all 0.1s linear 0s;
  }
  .preview-button:hover::after {
    content: "";
  } */

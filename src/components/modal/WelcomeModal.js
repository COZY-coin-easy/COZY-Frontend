import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { MAIN_COLOR_1, WHITE, BLACK } from "../../constants/styles";

export default function WelcomeModal({ children, onClose }) {
  return (
    <>
      <Dimmed onClick={onClose} />
      <WelcomeModalWrapper>
        <div className="content">{children}</div>
        <button
          className="confirm-button"
          data-testid="confirm-button"
          onClick={onClose}
        >
          확인
        </button>
      </WelcomeModalWrapper>
    </>
  );
}

WelcomeModal.propTypes = {
  onClose: PropTypes.func,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

const WelcomeModalWrapper = styled.div`
  top: 50%;
  left: 50%;
  width: 330px;
  height: 300px;
  position: fixed;
  margin-left: -165px;
  margin-top: -150px;
  text-align: center;
  border-radius: 0.5rem;
  background-color: ${WHITE};

  .content {
    color: ${BLACK};
    margin-top: 50px;
    font-size: 20px;
  }
  .confirm-button {
    cursor: pointer;
    margin-top: 30px;
    padding: 15px 100px 15px 100px;
    border-radius: 10px;
    border: none;
    transition: 0.3s;
    font-size: 20px;
    background-color: ${MAIN_COLOR_1};
    opacity: 80%;
    color: ${WHITE};
  }
  .confirm-button:hover {
    font-size: 25px;
    opacity: 100%;
    transition: all 0.2s linear 0s;
  }
`;

const Dimmed = styled.div`
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0%;
  top: 0%;
  background-color: rgba(0, 0, 0, 0.5);
`;

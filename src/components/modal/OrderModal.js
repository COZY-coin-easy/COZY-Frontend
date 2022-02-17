import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { MAIN_COLOR_1, WHITE, BLACK } from "../../constants/styles";

export default function OrderModal({ onTrade, onClose, isTrade, children }) {
  return (
    <>
      <Dimmed onClick={onClose} />
      <CheckModalWrapper>
        <Div>{children}</Div>
        <Button onClick={isTrade ? onTrade : onClose}>확인</Button>
        <Button onClick={onClose}>취소</Button>
      </CheckModalWrapper>
    </>
  );
}

OrderModal.propTypes = {
  onTrade: PropTypes.func,
  onClose: PropTypes.func,
  isTrade: PropTypes.bool,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

const CheckModalWrapper = styled.div`
  top: 50%;
  left: 50%;
  width: 360px;
  height: 220px;
  position: absolute;
  margin-left: -180px;
  margin-top: -110px;
  text-align: center;
  border-radius: 0.5rem;
  background-color: ${WHITE};
`;

const Dimmed = styled.div`
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0%;
  top: 0%;
  background-color: rgba(0, 0, 0, 0.5);
`;

const Button = styled.button`
  width: 40%;
  height: 40px;

  text-align: center;
  background: ${WHITE};
  color: ${BLACK};
  border-style: none;
  cursor: pointer;
  font-size: 1.2rem;
  font-weight: 100;
  border-radius: 0.4rem;

  :hover {
    color: ${MAIN_COLOR_1};
    font-size: 1.5rem;
    font-weight: 400;
    transition: 0.2s;
  }
`;

const Div = styled.div`
  color: ${BLACK};
  margin-top: 50px;
  margin-bottom: 45px;
  font-size: 1.4rem;
  font-weight: 100;
`;

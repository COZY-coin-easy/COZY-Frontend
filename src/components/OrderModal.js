import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { MAIN_COLOR_1, WHITE, BLACK, LIGHT_GREY } from "../constants/styles";

export default function OrderModal({ onTrade, onClose, isTrade, children }) {
  return (
    <>
      <Dimmed onClick={onClose} />
      <CheckModalWrapper>
        <CloseButton onClick={onClose}>X</CloseButton>
        <Div>{children}</Div>
        <OrderButton onClick={isTrade ? onTrade : onClose}>확인</OrderButton>
        <OrderButton onClick={onClose}>취소</OrderButton>
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
  width: 300px;
  height: 200px;
  position: absolute;
  margin-left: -150px;
  margin-top: -100px;
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
  text-align: center;
  background: ${WHITE};
  color: ${BLACK};
  border-style: none;
  cursor: pointer;
  font-size: 1.2rem;
  border-radius: 0.4rem;
`;

const OrderButton = styled(Button)`
  width: 40%;
  height: 40px;

  :hover {
    color: ${MAIN_COLOR_1};
    font-size: 1.5rem;
    font-weight: 400;
    transition: 0.2s;
  }
`;

const CloseButton = styled(Button)`
  position: absolute;
  top: 0;
  right: 0;
  margin-top: 2px;
  margin-right: 2px;
  color: ${BLACK};

  :hover {
    color: ${LIGHT_GREY};
  }
`;

const Div = styled.div`
  color: ${BLACK};
  margin-top: 50px;
  margin-bottom: 45px;
  font-size: 1.7rem;
`;

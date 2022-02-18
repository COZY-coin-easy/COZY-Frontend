import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { MAIN_COLOR_1, WHITE, BLACK } from "../../constants/styles";

export default function HelpModal({ onClose, children }) {
  return (
    <>
      <Dimmed onClick={onClose} />
      <HelpModalWrapper>
        <div>{children}</div>
      </HelpModalWrapper>
    </>
  );
}

HelpModal.propTypes = {
  onClose: PropTypes.func,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

const HelpModalWrapper = styled.div`
  top: 50%;
  left: 50%;
  width: 500px;
  height: 300px;
  position: fixed;
  margin-left: -250px;
  margin-top: -150px;
  text-align: center;
  border-radius: 0.5rem;
  background-color: ${WHITE};
  overflow: auto;
`;

const Dimmed = styled.div`
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0%;
  top: 0%;
  background-color: rgba(0, 0, 0, 0.5);
`;

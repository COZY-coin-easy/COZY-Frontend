import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { SORRY_ERROR } from "../constants/messages";
import { MAIN_COLOR_2, MAIN_COLOR_3, BLACK } from "../constants/styles";

export default function Error({ children }) {
  console.log(children);
  return (
    <Div>
      <Status>ERROR {children.props.children[1].props.children}</Status>
      <SorryError>{SORRY_ERROR}</SorryError>
      <Message>{children.props.children[0].props.children}</Message>
    </Div>
  );
}

Error.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

const Div = styled.div`
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  position: fixed;
  text-align: center;
  background-color: ${MAIN_COLOR_3};
`;

const Status = styled.div`
  margin-top: 250px;
  color: ${MAIN_COLOR_2};
  font-size: 5rem;
  font-weight: 900;
`;

const Message = styled.div`
  margin-top: 50px;
  color: ${BLACK};
  font-size: 3rem;
  font-weight: 100;
`;

const SorryError = styled.div`
  margin-top: 20px;
  color: ${MAIN_COLOR_2};
  font-weight: 200;
  font-size: 2rem;
`;

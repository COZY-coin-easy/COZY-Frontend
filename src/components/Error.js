import React from "react";
import PropTypes from "prop-types";

export default function Error({ children }) {
  return <div>{children}</div>;
}

Error.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

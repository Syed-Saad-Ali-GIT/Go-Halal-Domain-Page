import React from "react";
import "../App.css";

const ColoredLine = ({ color, height, width, ...rest }) => {
  return (
    <hr
      style={{
        color: color,
        backgroundColor: color,
        height: height,
        width: width,
        borderWidth: 0,
        marginBlockEnd: 0,
        marginBlockStart: 0,
      }}
    />
  );
};

export default ColoredLine;

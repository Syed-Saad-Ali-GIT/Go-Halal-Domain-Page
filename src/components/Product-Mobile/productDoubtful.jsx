import React from "react";
import "../../App.css";
import ColoredLine from "../coloredLine";

const ProductDoubtful = ({ item, ...rest }) => {
  return (
    <div
      style={{
        overflow: "scroll",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div
        style={{
          height: item.reviewed !== "AI-Detected" ? "0dvh" : "0dvh",
          width: "95%",
        }}
      ></div>
      <div className="mobile-product-spacer"></div>
      <ColoredLine color={"rgba(0, 0, 0, 0.2)"} height={".25dvh"} width={"85%"} />
      <div className="mobile-product-spacer"></div>
      <div className="mobile-product-title-sub-section">
        <p className="mobile-product-subtitle">Ingredients</p>
      </div>
      <div className="mobile-product-text-sub-section">
        <p className="mobile-product-subtext">{item.ingredients}</p>
      </div>
      <div className="mobile-product-spacer"></div>
      <div className="mobile-product-title-sub-section">
        <p className="mobile-product-subtitle">Doubtful Ingredients</p>
      </div>
      <div className="mobile-product-text-sub-section">
        <p className="mobile-product-subtext">{item.noteableIngredients}</p>
      </div>
    </div>
  );
};

export default ProductDoubtful;

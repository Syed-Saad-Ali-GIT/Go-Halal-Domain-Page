import React, { useState, useEffect } from "react";
import "../App.css";
import logoWeb from "../assets/media/logoWeb.png";
import productIcon from "../assets/media/product-icon.png";
import barcodeIcon from "../assets/media/barcode-icon.png";
import restaurantIcon from "../assets/media/restaurant-icon.png";
import { useLocation, useNavigate } from "react-router-dom";

const SideBar = ({ selectedOption, ...rest }) => {
  const UNSELECTED_COLOR = "#F0E6D3";
  const SELECTED_COLOR = "#FAE7C2";

  const [productButtonColor, setProductButtonColor] = useState(SELECTED_COLOR);
  const [restaurantButtonColor, setRestaurantButtonColor] = useState(UNSELECTED_COLOR);
  const [scanColorButtonColor, setScanColorButtonColor] = useState(UNSELECTED_COLOR);
  const [icon, setIcon] = useState(productIcon);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.includes("/product")) {
      setProductButtonColor(SELECTED_COLOR);
      setRestaurantButtonColor(UNSELECTED_COLOR);
      setScanColorButtonColor(UNSELECTED_COLOR);
      setIcon(productIcon);
    } else if (location.pathname.includes("/restaurant")) {
      setProductButtonColor(UNSELECTED_COLOR);
      setRestaurantButtonColor(SELECTED_COLOR);
      setScanColorButtonColor(UNSELECTED_COLOR);
      setIcon(restaurantIcon);
    } else if (location.pathname.includes("/scan")) {
      setProductButtonColor(UNSELECTED_COLOR);
      setRestaurantButtonColor(UNSELECTED_COLOR);
      setScanColorButtonColor(SELECTED_COLOR);
      setIcon(barcodeIcon);
    }
  }, [location.pathname]);

  const handleNavOptionPress = (clicked_id) => {
    if (clicked_id === "productButton") {
      setRestaurantButtonColor(UNSELECTED_COLOR);
      setScanColorButtonColor(UNSELECTED_COLOR);
      setProductButtonColor(SELECTED_COLOR);
      navigate("/product");
    } else if (clicked_id === "restaurantButton") {
      setRestaurantButtonColor(SELECTED_COLOR);
      setScanColorButtonColor(UNSELECTED_COLOR);
      setProductButtonColor(UNSELECTED_COLOR);
      navigate("/restaurant");
    } else if (clicked_id === "barcodeButton") {
      setRestaurantButtonColor(UNSELECTED_COLOR);
      setScanColorButtonColor(SELECTED_COLOR);
      setProductButtonColor(UNSELECTED_COLOR);
      navigate("/scan");
    }
  };

  return (
    <div className="web-sidebar">
      <img className="web-logo" src={logoWeb} alt="logoWeb" />
      <div className="circle-large" style={{ background: SELECTED_COLOR }}>
        <img className="web-icon" src={icon} alt="icon" />
      </div>
      <div
        onClick={() => handleNavOptionPress("productButton")}
        className="web-sidebar-option-box"
        style={{ background: productButtonColor }}
      >
        Search Products
      </div>
      <div
        onClick={() => handleNavOptionPress("barcodeButton")}
        className="web-sidebar-option-box"
        style={{ background: scanColorButtonColor }}
      >
        Scan Products
      </div>
      <div
        onClick={() => handleNavOptionPress("restaurantButton")}
        className="web-sidebar-option-box"
        style={{ background: restaurantButtonColor }}
      >
        Search Restaurants
      </div>
    </div>
  );
};

export default SideBar;

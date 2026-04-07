import React, { useEffect, useState } from "react";
import "../App.css";
import productIcon from "../assets/media/product-icon.png";
import restaurantIcon from "../assets/media/restaurant-icon.png";
import barcodeIcon from "../assets/media/barcode-icon.png";
import { useLocation, useNavigate } from "react-router-dom";

const NavBar = ({ ...rest }) => {
  const UNSELECTED_COLOR = "#F0E6D3";
  const SELECTED_COLOR = "#FAE7C2";
  const [productButtonColor, setProductButtonColor] = useState(SELECTED_COLOR);
  const [restaurantButtonColor, setRestaurantButtonColor] = useState(UNSELECTED_COLOR);
  const [scanColorButtonColor, setScanColorButtonColor] = useState(UNSELECTED_COLOR);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.includes("/product")) {
      setProductButtonColor(SELECTED_COLOR);
      setRestaurantButtonColor(UNSELECTED_COLOR);
      setScanColorButtonColor(UNSELECTED_COLOR);
    } else if (location.pathname.includes("/restaurant")) {
      setProductButtonColor(UNSELECTED_COLOR);
      setRestaurantButtonColor(SELECTED_COLOR);
      setScanColorButtonColor(UNSELECTED_COLOR);
    } else if (location.pathname.includes("/scan")) {
      setProductButtonColor(UNSELECTED_COLOR);
      setRestaurantButtonColor(UNSELECTED_COLOR);
      setScanColorButtonColor(SELECTED_COLOR);
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
    <div className="mobile-nav-menu border-radius">
      <div className="mobile-nav-menu-box border-radius">
        <div onClick={() => handleNavOptionPress("productButton")}>
          <div className="circle" style={{ background: productButtonColor }}>
            <img className="mobile-icon" src={productIcon} alt="productButton" />
          </div>
          <p className="mobile-button-text">Products</p>
        </div>

        <div onClick={() => handleNavOptionPress("restaurantButton")}>
          <div className="circle" style={{ background: restaurantButtonColor }}>
            <img className="mobile-icon" src={restaurantIcon} alt="restaurantButton" />
          </div>
          <p className="mobile-button-text">Restaurant</p>
        </div>

        <div onClick={() => handleNavOptionPress("barcodeButton")}>
          <div className="circle" style={{ background: scanColorButtonColor }}>
            <img className="mobile-icon" src={barcodeIcon} alt="barcodeButton" />
          </div>
          <p className="mobile-button-text">Scan</p>
        </div>
      </div>
    </div>
  );
};

export default NavBar;

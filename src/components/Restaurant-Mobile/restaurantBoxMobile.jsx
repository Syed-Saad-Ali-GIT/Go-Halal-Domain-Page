import React, { useEffect, useState, useRef } from "react";
import "../../App.css";
import crossIcon from "../../assets/media/cross.png";
import tickIcon from "../../assets/media/tick.png";
import warnIcon from "../../assets/media/warn.png";
import Marquee from "react-fast-marquee";
import { useNavigate } from "react-router-dom";
import { Chip, Rating, Stack } from "@mui/material";

const RestaurantBoxMobile = ({ item, listType, hasShadow = true, backgroundColor, ...rest }) => {
  const navigate = useNavigate();
  const ref = useRef(null);

  useEffect(() => {
    if (
      (getTextWidth(item.label, "SF-PRO-TEXT-SEMI-BOLD") / ref.current.offsetWidth) *
        100 >
      60
    ) {
      setShouldSlide(true);
    }
  }, [ref.current]);

  const [shouldSlide, setShouldSlide] = useState(false);

  function getTextWidth(text, font) {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    context.font = font || getComputedStyle(document.body).font;

    return context.measureText(text + "   ").width;
  }
  const handleRestaurantClick = () => {
    // Save the current restaurant as the last viewed before navigating
    sessionStorage.setItem("lastViewedRestaurant", JSON.stringify(item));
    navigate(`/restaurant/${item.id}`);
  };

  return (
    <div
      onClick={handleRestaurantClick}
      className="mobile-restaurant-info-box"
      style={{
        display: item.id === undefined ? "none" : "visible",
        boxShadow: hasShadow ? "0 4px 8px 0 rgba(0, 0, 0, 0.2)" : "none",
        backgroundColor: backgroundColor || "#FFFFFF",
      }}
    >
      <div className="mobile-product-box-image">
        <div className="mobile-product-box-image-bg">
          <img
            onError={(e) =>
              (e.target.src =
                "https://zhyjigkdefdvvqfikthh.supabase.co/storage/v1/object/public/restaurants-logo/logo.png")
            }
            src={item.imageLink}
            className="mobile-product-img"
            alt="logo"
          />{" "}
        </div>
      </div>
      <div className="mobile-restaurant-box-content">
        <div ref={ref} className="mobile-restaurant-box-content-left">
          {/* <Marquee play={shouldSlide} className="mobile-restaurant-box-content-name">
            <pre className="mobile-restaurant-box-content-name">{item.label} </pre>
          </Marquee> */}
          <p className="mobile-restaurant-box-content-name">{item.label}</p>
          <Stack spacing={1}>
            <Rating readOnly size="small" defaultValue={item.rating} />
          </Stack>

          {/* <p className="mobile-restaurant-box-content-cuisine">{item.cuisine}</p> */}
        </div>
        <div className="mobile-restaurant-box-content-spacer"></div>
        <div className="mobile-restaurant-box-content-right">
          <div className="mobile-restaruant-box-label">
            <img
              src={
                item.isHalal === "Halal"
                  ? tickIcon
                  : item.isHalal == "Not Halal"
                  ? crossIcon
                  : warnIcon
              }
              className="mobile-restaurant-label-img"
              alt="logo"
            />
            Halal
          </div>
          <div className="mobile-restaruant-box-label">
            <img
              src={
                item.isHandSlaughtered === "1"
                  ? tickIcon
                  : item.isHandSlaughtered === "0"
                  ? crossIcon
                  : warnIcon
              }
              className="mobile-restaurant-label-img"
              alt="logo"
            />
            Hand Slaughtered
          </div>
          <div className="mobile-restaruant-box-label">
            <img
              src={
                item.isOnlyHalal === "1"
                  ? tickIcon
                  : item.isOnlyHalal === "0"
                  ? crossIcon
                  : warnIcon
              }
              className="mobile-restaurant-label-img"
              alt="logo"
            />
            Halal Only Menu
          </div>
          <div className="mobile-restaruant-box-label">
            <img
              src={
                item.hasVeg === "1"
                  ? tickIcon
                  : item.hasVeg === "0"
                  ? crossIcon
                  : warnIcon
              }
              className="mobile-restaurant-label-img"
              alt="logo"
            />
            <div className="mobile-restaurant-label-text">Vegetarian Options</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantBoxMobile;

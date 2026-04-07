import React, { useEffect, useState, useRef } from "react";
import "../../App.css";
import Marquee from "react-fast-marquee";
import fullStar from "../../assets/media/fullStar.png";
import partStar from "../../assets/media/halfStar.png";
import noStar from "../../assets/media/noStar.png";
import { useNavigate } from "react-router-dom";
import { Rating, Stack } from "@mui/material";
import crossIcon from "../../assets/media/red-circle.png";
import tickIcon from "../../assets/media/green-circle.png";
import warnIcon from "../../assets/media/yellow-circle.png";
const RestaurantBoxMobileSingle = ({ item, listType, backgroundColor, ...rest }) => {
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

  function renderStars(value) {
    const fullStars = Math.floor(value);
    const halfStar = value % 1 >= 0.25 && value % 1 < 0.75 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;

    return (
      <div style={{ display: "flex" }}>
        {[...Array(fullStars)].map((_, index) => (
          <img
            key={index}
            src={fullStar}
            className="mobile-restauran-rating-img"
            alt="full star"
          />
        ))}
        {halfStar === 1 && (
          <img src={partStar} className="mobile-restauran-rating-img" alt="half star" />
        )}
        {[...Array(emptyStars)].map((_, index) => (
          <img
            key={index}
            src={noStar}
            className="mobile-restauran-rating-img"
            alt="empty star"
          />
        ))}
      </div>
    );
  }

  const handleRestaurantClick = () => {
    if (item && item.id) {
      sessionStorage.setItem("lastViewedRestaurant", JSON.stringify(item));
      navigate(`/restaurant/${item.id}`);
    }
  };

  return (
    <div
      onClick={handleRestaurantClick}
      className="mobile-restaurant-info-box"
      style={{
        display: item.id === undefined ? "none" : "visible",
        boxShadow: "none",
        backgroundColor: backgroundColor,
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
        <div
          ref={ref}
          className="mobile-restaurant-box-content-left"
          style={{ width: "60%" }}
        >
          <p
            className="mobile-restaurant-box-content-name"
            style={{ fontSize: "calc(13px + 1vmin)" }}
          >
            {item.label}
          </p>{" "}
          <p className="mobile-restaurant-box-content-cuisine">{item.cuisine}</p>
        </div>
        <div
          className="mobile-restaurant-box-content-right"
          style={{ width: "40%", display: "flex", justifyContent: "flex-start" }}
        >
          <Stack spacing={1}>
            <Rating readOnly size="small" defaultValue={item.rating} />
          </Stack>
        </div>
      </div>
    </div>
  );
};

export default RestaurantBoxMobileSingle;

import React from "react";
import "../../App.css";
import googleMapsIcon from "../../assets/media/google-maps.png";

const MobileRestaurantLocationBox = ({ item, link, ...rest }) => {
  const redirectTo = (link) => {
    // Define the logic to redirect to the provided link
    window.location.href = link;
  };
  return (
    <div className="mobile-restaurant-location-div" style={{backgroundColor: "#FFF5E3"}}>
      <div className="location-info">
        <div className="location-street-Text">
          {item.street} {item.suburb} {item.city} {item.postcode}
        </div>
      </div>

      <div className="location-pin">
        <img
          onClick={() => redirectTo(link)}
          src={googleMapsIcon}
          className="mobile-restauran-maps-icon"
          alt="empty star"
        />
      </div>
    </div>
  );
};

export default MobileRestaurantLocationBox;

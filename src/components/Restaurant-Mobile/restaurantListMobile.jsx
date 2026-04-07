import React from "react";
import "../../App.css";
import RestaurantBodyDefault from "./restaurantBodyDefault";

const RestaurantListMobile = ({
  restaurantDataList,
  restaurantDataChanger,
  searchData,
  ...rest
}) => {
  return (
    <div>
      <RestaurantBodyDefault
        searchData={searchData}
        restaurantDataChanger={restaurantDataChanger}
      />
    </div>
  );
};

export default RestaurantListMobile;

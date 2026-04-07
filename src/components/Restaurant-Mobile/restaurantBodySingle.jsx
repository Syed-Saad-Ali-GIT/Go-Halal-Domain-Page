import React, { useEffect, useState } from "react";
import "../../App.css";
import backIcon from "../../assets/media/back.png";
import facebook from "../../assets/media/facebook.png";
import instagram from "../../assets/media/insta.png";
import tiktok from "../../assets/media/tiktok.png";
import ShareIcon from "../../assets/media/share.png";
import LocationIcon from "../../assets/media/locationDrop.png";

import ScrollList from "../scrollList";
import { useNavigate } from "react-router-dom";
import "react-sliding-side-panel/lib/index.css";
import axios from "axios";
import crossIcon from "../../assets/media/red-circle.png";
import tickIcon from "../../assets/media/green-circle.png";
import warnIcon from "../../assets/media/yellow-circle.png";
import Slider from "@mui/material/Slider";
import { styled } from "@mui/material/styles";
import { CircularProgress, Drawer } from "@mui/material";
import { Button } from "../ui/button";
import RestaurantBoxMobileSingle from "./restaurantBoxMobileSingle";
import ColoredLine from "../coloredLine";

const RestaurantBodySingle = ({ value, ...rest }) => {
  const navigate = useNavigate();
  const [openPanel, setOpenPanel] = useState(false);
  const [locationPanel, setLocationPanel] = useState(false);
  const [locationData, setLocationData] = useState([]);
  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
    error: null,
  });
  const [distance, setDistance] = useState(50);
  const [filteredLocation, setFilteredLocation] = useState(undefined);
  const UNSELECTED_COLOR = "#F0E6D3";
  const SELECTED_COLOR = "#FAE7C2";
  const [nearMeButtonColor, setNearMeButtonColor] = useState(UNSELECTED_COLOR);
  const marks = [
    { value: 5, label: "5 Km" },
    { value: 50, label: "50 Km" },
    { value: 100, label: "100 Km" },
  ];


  const [loading, setLoading] = useState(false);

  function toggleLocationPanel() {
    if (locationData.length == 0) {
      handleGetCurrentLocation();
    }
    setOpenPanel(false);
    setLocationPanel(!locationPanel);
  }
  async function handleGetCurrentLocation() {
    if (location.latitude && location.longitude) {
      setLocation({
        latitude: null,
        longitude: null,
        error: null,
      });
      setLocationData({});
      setNearMeButtonColor(UNSELECTED_COLOR);
    } else {
      getLocation();
    }
  }

  async function handleShare() {
    const shareData = {
      title: document.title,
      text: "GoHalal - Product Details " + value.label,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        console.log("Shared successfully!");
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard!");
      } catch (error) {
        console.error("Failed to copy:", error);
      }
    }
  }

  const toggleDrawer = (newOpen) => () => {
    setOpenPanel(newOpen);
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            error: null,
          });
        },
        (error) => {
          setLocation({
            latitude: null,
            longitude: null,
            error: error.message,
          });
        }
      );
    } else {
      setLocation({
        latitude: null,
        longitude: null,
        error: "Geolocation is not supported by this browser.",
      });
    }
  };

  const fetchLocationData = async (latitude, longitude) => {
    axios
      .get(
        process.env.REACT_APP_API_BASE +
          "/api/locations/getSuburbByCurrent/?latitude=" +
          latitude +
          "&longitude=" +
          longitude,
        {
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_API_TOKEN}`,
          },
        }
      )
      .then((response) => setLocationData(JSON.parse(JSON.stringify(response.data))))
      .catch((error) => {
        console.error("Error fetching product data:", error);
      });
  };

  const fetchFilteredLocationData = async (latitude, longitude, range) => {
    setLoading(true);
    axios
      .get(
        process.env.REACT_APP_API_BASE +
          "/api/locations/getLocationsInRangeForRestaurant/?latitude=" +
          latitude +
          "&longitude=" +
          longitude +
          "&range=" +
          range +
          "&id=" +
          value.id,
        {
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_API_TOKEN}`,
          },
        }
      )
      .then((response) => {
        setFilteredLocation(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching product data:", error);
      });
  };

  useEffect(() => {
    if (location.latitude && location.longitude) {
      fetchLocationData(location.latitude, location.longitude);
      setNearMeButtonColor(SELECTED_COLOR);
    } else {
      setNearMeButtonColor(UNSELECTED_COLOR);
    }
  }, [location]);

  useEffect(() => {}, [locationData]);

  useEffect(() => {}, [nearMeButtonColor]);

  useEffect(() => {}, [locationData]);

  useEffect(() => {}, [filteredLocation]);

  function distanceValue(value) {
    setDistance(value);
  }

  function renderBody(item) {
    return (
      <div
        style={{
          display: "flex",
          height: "85%",
          gap: "5%",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <ColoredLine color={"rgba(0, 0, 0, 0.2)"} height={".25dvh"} width={"95%"} />
        <div
          className="mobile-restaruant-box-label-single"
          style={{ alignItems: "flex-start" }}
        >
          <div style={{ display: "flex", width: "100%", gap: "5%" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              {" "}
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
              {item.isHalal === "Halal" ? (
                <p className="mobile-restaurant-label">Halal</p>
              ) : item.isHalal === "Not Halal" ? (
                <p className="mobile-restaurant-label">Not Halal</p>
              ) : (
                <p className="mobile-restaurant-label">Halal - Under Review</p>
              )}
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              {" "}
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
              {item.isHandSlaughtered === "1" ? (
                <p className="mobile-restaurant-label">Hand Slaughtered Chicken</p>
              ) : item.isHandSlaughtered === "0" ? (
                <p className="mobile-restaurant-label">Non Hand Slaughtered Chicken</p>
              ) : (
                <p className="mobile-restaurant-label">Hand Slaughtered - Under Review</p>
              )}
            </div>
          </div>
          <div style={{ display: "flex", width: "100%", gap: "5%" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
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
              {item.isOnlyHalal === "1" ? (
                <p className="mobile-restaurant-label">Halal Only Menu</p>
              ) : item.isOnlyHalal === "0" ? (
                <p className="mobile-restaurant-label">Serve Non Halal</p>
              ) : (
                <p className="mobile-restaurant-label">Menu - Under Review</p>
              )}
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              {" "}
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
              {item.hasVeg === "1" ? (
                <p className="mobile-restaurant-label">Vegetarian Options</p>
              ) : item.hasVeg === "0" ? (
                <p className="mobile-restaurant-label">Non Vegetarian Options</p>
              ) : (
                <p className="mobile-restaurant-label">
                  Vegetarian Options - Under Review
                </p>
              )}
            </div>
          </div>
        </div>

        {/* <Chip label={item.cuisine} /> */}
        <div
          className="mobile-restaurant-about-sub-section"
          style={{ height: "55%", maxHeight: "100%" }}
        >
          <p className="mobile-product-subtitle">About</p>
          <div className="mobile-restaurant-subtext-box">
            <p className="mobile-restaurant-subtext">{item.about}</p>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            width: "100%",
            height: "100%",
            alignItems: "flex-end",
            justifyContent: "center",
            gap: "2%",
          }}
        >
          {value.facebook && (
            <img
              alt="Facebook"
              style={{ width: "10%", resizeMode: "contain" }}
              onClick={() => window.open(`https://www.facebook.com/${value.facebook}`)}
              src={facebook}
            />
          )}
          {value.instagram && (
            <img
              style={{ width: "10%", resizeMode: "contain" }}
              alt="Instagram"
              onClick={() => window.open(`https://www.instagram.com/${value.instagram}`)}
              src={instagram}
            />
          )}
          {value.tiktok && (
            <img
              alt="TikTok"
              style={{ width: "10%", resizeMode: "contain" }}
              onClick={() => window.open(`https://www.tiktok.com/@${value.tiktok}`)}
              src={tiktok}
            />
          )}
        </div>
        <ColoredLine color={"rgba(0, 0, 0, 0.2)"} height={".25dvh"} width={"80%"} />
      </div>
    );
  }

  if (value === undefined) {
    return (
      <div>
        <div className="mobile-product-search  border-radius">
                      <div
              onClick={() => {
                if (value && value.id) {
                  sessionStorage.setItem("lastViewedRestaurant", JSON.stringify(value));
                }
                navigate("/restaurant");
              }}
              role="button" // Add role for accessibility
              tabIndex={0} // Makes it focusable
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                cursor: "pointer", // Add pointer cursor for better UX
              }}
            >
              <div
                style={{
                  margin: "0",
                  backgroundColor: "#FAE7C2",
                }}
                className="circle-icon"
              >
                <img className="mobile-icon" src={backIcon} />
              </div>
            </div>
        </div>
        <div className="mobile-single-body border-radius">
          <div
            className="mobile-product-body-inner border-radius"
            style={{
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgb(255, 253, 245)",
            }}
          >
            <CircularProgress size={"10dvh"} color="#FAE7C2" />
            <p className="text-center mt-4" style={{ fontFamily: "Poppins-Regular" }}>
              Fetching data...
            </p>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <div className="mobile-product-search  border-radius">
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
            }}
          >
            <div
              onClick={() => {
                if (value && value.id) {
                  sessionStorage.setItem("lastViewedRestaurant", JSON.stringify(value));
                }
                navigate("/restaurant");
              }}
              role="button" // Add role for accessibility
              tabIndex={0} // Makes it focusable
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                cursor: "pointer", // Add pointer cursor for better UX
              }}
            >
              <div
                style={{
                  margin: "0",
                  backgroundColor: "#FAE7C2",
                }}
                className="circle"
              >
                <img className="mobile-icon" src={backIcon} />
              </div>
            </div>

            <div
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-end",
                gap: "2%",
              }}
            >
              <div
                style={{
                  display: "flex",
                  width: "100%",
                  height: "50%",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  // marginLeft: "5%",
                }}
              >
                <div
                  onClick={toggleLocationPanel}
                  className="circle-icon"
                  style={{ background: "#FAE7C2" }}
                >
                  <img
                    className="mobile-icon"
                    style={{ maxHeight: "50%" }}
                    src={LocationIcon}
                  />
                </div>
                <div
                  onClick={handleShare}
                  className="circle-icon"
                  style={{ background: "#FAE7C2" }}
                >
                  <img className="mobile-icon" src={ShareIcon} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mobile-single-body border-radius">
          <div
            className="mobile-product-body-inner border-radius"
            style={{ background: "rgb(255, 253, 245)" }}
          >
            <RestaurantBoxMobileSingle
              hasShadow={false}
              item={value}
              backgroundColor={"rgb(255, 253, 245)"}
            ></RestaurantBoxMobileSingle>
            {renderBody(value)}
          </div>
        </div>

        <LocationDrawer
          anchor="right"
          open={locationPanel}
          onClose={() => {
            toggleLocationPanel();
          }}
        >
          <div className="mobile-restaurant-location-sub-section">
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div
                className="mobile-restaurant-location-text-box"
                style={{ justifyContent: "center", marginTop: "5%" }}
              >
                <p className="mobile-product-subtitle">Locations</p>
              </div>
            </div>
            {/* <div
              style={{ display: "flex", justifyContent: "center", alignItems: "center" }}
            >
              <p className="location-current-text">
                {" "}
                {Object.keys(locationData).length === 0
                  ? "Location Not Detected"
                  : `Searching: ${locationData.suburb}, around: ${distance} km`}
              </p>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <PrettoSlider
                defaultValue={50}
                value={distance}
                min={5}
                max={100}
                marks={marks}
                getAriaValueText={distanceValue}
                aria-label="Default"
                className=""
                onChange={(e, value) => {
                  setDistance(value); // Update the value live as the slider is moved
                }}
                onChangeCommitted={(e, value) => {
                  setDistance(value); // Ensure the final value is set on release
                  handleApplyClick(); // Call your function only on release
                }}
              />
              <p className="location-slider-text ">Distance</p>
            </div> */}
            {loading ? (
              <div
                className="mobile-restaurant-locations-box border-radius"
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <CircularProgress size={"10dvh"} style={{ color: "#a98614" }} />
                <p
                  className="text-center mt-4"
                  style={{ fontFamily: "Poppins-Regular", color: "#a98614" }}
                >
                  Fetching data...
                </p>
              </div>
            ) : (
              <div className="mobile-restaurant-locations-box">
                <ScrollList
                  listType={"location"}
                  items={
                    filteredLocation !== undefined ? filteredLocation : value.locations
                  }
                  maxHeight="86dvh"
                ></ScrollList>
              </div>
            )}
          </div>
          <FilterDrawer
            style={{ justifyContent: "flex-end" }}
            anchor="bottom"
            open={openPanel}
            onClose={toggleDrawer(false)}
          >
            <div className="restaurant-location-filter-panel-content">
              <div className="mobile-location-spacer-top"> </div>
              <div className="filter-title">Filter</div>
              <div className="mobile-location-spacer"> </div>
              <div className="location-filter-options">
                <div className="location-set-auto">
                  {" "}
                  <div className="wide-center">
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "100%",
                      }}
                    ></div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <PrettoSlider
                        defaultValue={50}
                        value={distance}
                        min={5}
                        max={100}
                        marks={marks}
                        getAriaValueText={distanceValue}
                        aria-label="Default"
                        className=""
                        onChange={(e) => setDistance(e.target.value)}
                      />
                      <p className="location-slider-text ">Distance</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="location-bottom-box">
                <div className="location-current-box">
                  <p className="location-current-text">
                    {" "}
                    {Object.keys(locationData).length === 0
                      ? "Location Not Detected"
                      : `Searching: ${locationData.suburb}, around: ${distance} km`}
                  </p>
                </div>
                <div className="location-button-box">
                  <div className="close-button boxshadow" onClick={handleResetClick}>
                    Reset
                  </div>
                  <div className="apply-button boxshadow" onClick={handleApplyClick}>
                    Apply
                  </div>
                </div>
                <div className="mobile-location-spacer-top"> </div>
                <div className="mobile-location-spacer-top"> </div>
              </div>
            </div>
          </FilterDrawer>
        </LocationDrawer>
      </div>
    );
    async function handleApplyClick() {
      if (Object.keys(locationData).length > 0) {
        fetchFilteredLocationData(location.latitude, location.longitude, distance).then(
          () => {
            setOpenPanel(false);
            // resetFilters();
          }
        );
      } else {
        setOpenPanel(false);
        resetFilters();
      }
    }
    async function handleResetClick() {
      resetFilters();
    }

    function resetFilters() {
      setNearMeButtonColor(UNSELECTED_COLOR);
      setDistance(50);
    }
  }
};

const LocationDrawer = styled(Drawer)({
  "& .MuiDrawer-paper": {
    height: "100%",
    width: "80%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    borderTopLeftRadius: "20px",
    borderBottomLeftRadius: "20px",
  },
});

const PrettoSlider = styled(Slider)({
  color: "#DAAD18",
  height: "20%",
  width: "60%",
  "& .MuiSlider-track": {
    border: "none",
  },
  "& .MuiSlider-markLabel": {
    fontSize: "calc(3px + 2vmin)",
    fontFamily: "Poppins-Regular",
    top: "80%",
  },
  "& .MuiSlider-thumb": {
    height: "2vh",
    width: "2vh",
    backgroundColor: "#fff",
    border: "2px solid currentColor",
    "&:focus, &:hover, &.Mui-active, &.Mui-focusVisible": {
      boxShadow: "inherit",
    },
    "&::before": {
      display: "none",
    },
  },
  "& .MuiSlider-valueLabel": {
    lineHeight: 1.2,
    fontSize: 12,
    background: "unset",
    padding: 0,
    width: "3.5dvh",
    height: "3.5dvh",
    borderRadius: "50% 50% 50% 0",
    backgroundColor: "#DAAD18",
    transformOrigin: "bottom left",
    transform: "translate(50%, -100%) rotate(-45deg) scale(0)",
    "&::before": { display: "none" },
    "&.MuiSlider-valueLabelOpen": {
      transform: "translate(50%, -100%) rotate(-45deg) scale(1)",
    },
    "& > *": {
      transform: "rotate(45deg)",
    },
  },
});

const FilterDrawer = styled(Drawer)({
  "& .MuiDrawer-paper": {
    height: "50dvh",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF5E3",
    borderTopLeftRadius: "20px",
    borderTopRightRadius: "20px",
  },
});

export default RestaurantBodySingle;

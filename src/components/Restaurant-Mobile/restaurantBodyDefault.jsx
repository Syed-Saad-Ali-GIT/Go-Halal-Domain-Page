import React, { useState, useEffect, useRef } from "react";
import "../../App.css";
import ScrollList from "../scrollList";
import Select from "react-select";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import filterIcon from "../../assets/media/filter.png";
import {
  Checkbox,
  CircularProgress,
  Drawer,
  FormControlLabel,
  FormGroup,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import Slider from "@mui/material/Slider";
import debounce from "lodash.debounce";
import { Button } from "../ui/button";
import CircleChecked from "@mui/icons-material/CheckCircle";
import CircleUnchecked from "@mui/icons-material/RadioButtonUnchecked";
import { Autocomplete, TextField, Box } from "@mui/material";

const RestaurantBodyDefault = ({ ...rest }) => {
  const [input, setInput] = useState(
    sessionStorage.getItem("restaurantSearchQuery") || ""
  );
  const navigate = useNavigate();
  const [openPanel, setOpenPanel] = useState(false);
  const scrollContainerRef = useRef(null);
  const [lastViewedRestaurant, setLastViewedRestaurant] = useState(null);

  // Enhanced navigation state restoration
  useEffect(() => {
    return () => {
      // Save scroll position and search state on unmount
      if (scrollContainerRef.current) {
        sessionStorage.setItem("restaurantListScrollPosition", scrollContainerRef.current.scrollTop);
      }
      sessionStorage.setItem("restaurantSearchQuery", input);
    };
  }, [input]);

  const [locationData, setLocationData] = useState([]);
  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
    error: null,
  });
  const [distance, setDistance] = useState(50);

  const cuisinesList = [
    { id: 1, name: "Afghan" },
    { id: 2, name: "African" },
    { id: 3, name: "American" },
    { id: 4, name: "Anatolian" },
    { id: 5, name: "Asian" },
    { id: 6, name: "Australian" },
    { id: 7, name: "BBQ" },
    { id: 8, name: "Briskets" },
    { id: 9, name: "Burger" },
    { id: 10, name: "Burgers" },
    { id: 11, name: "Cafe" },
    { id: 12, name: "Charcoal Chicken" },
    { id: 13, name: "Chinese" },
    { id: 14, name: "Dessert" },
    { id: 15, name: "Drinks" },
    { id: 16, name: "Fast Food" },
    { id: 17, name: "Fried Chicken" },
    { id: 18, name: "Grill" },
    { id: 19, name: "Halal" },
    { id: 20, name: "Indian" },
    { id: 21, name: "Indonesian" },
    { id: 22, name: "Italian" },
    { id: 23, name: "Japanese" },
    { id: 24, name: "Juice" },
    { id: 25, name: "Kebab" },
    { id: 26, name: "Korean" },
    { id: 27, name: "Lebanese" },
    { id: 28, name: "Malaysian" },
    { id: 29, name: "Mediterranean" },
    { id: 30, name: "Mexican" },
    { id: 31, name: "Middle Eastern" },
    { id: 32, name: "Moroccan" },
    { id: 33, name: "Nepalese" },
    { id: 34, name: "Pakistani" },
    { id: 35, name: "Persian" },
    { id: 36, name: "Pizza" },
    { id: 37, name: "Seafood" },
    { id: 38, name: "South American" },
    { id: 39, name: "Steak" },
    { id: 40, name: "Steakhouse" },
    { id: 41, name: "Thai" },
    { id: 42, name: "Turkish" },
    { id: 43, name: "Uyghur" },
    { id: 44, name: "Vegan" },
    { id: 45, name: "Vietnamese" },
  ];

  const [selectedCuisine, setSelectedCuisines] = useState(undefined);

  const handleCuisineChange = (event, value) => {
    setSelectedCuisines(value);
  };

  const marks = [
    { value: 5, label: "5 Km" },
    { value: 50, label: "50 Km" },
    { value: 100, label: "100 Km" },
  ];
  const [error, setError] = useState(null);
  const [checkboxes, setCheckboxes] = useState({
    halalOnlySelected: false,
    handsluaghteredSeelcted: false,
    vegetarianSelected: false,
    halalSelected: false,
  });

  const [loading, setLoading] = useState(true);
  const [searchData, setSearchData] = useState([]);

  // Enhanced scroll restoration
  useEffect(() => {
    if (loading || !scrollContainerRef.current) return;

    const timer = setTimeout(() => {
      const lastRestaurant = sessionStorage.getItem("lastViewedRestaurant");
      const lastViewedId = lastRestaurant ? JSON.parse(lastRestaurant).id : null;

      if (lastViewedId) {
        const lastViewedElement = document.querySelector(
          `[data-restaurant-id="${lastViewedId}"]`
        );
        if (lastViewedElement) {
          lastViewedElement.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
          sessionStorage.removeItem("lastViewedRestaurant");
          return;
        }
      }

      const savedScrollPosition = sessionStorage.getItem(
        "restaurantListScrollPosition"
      );
      if (savedScrollPosition) {
        scrollContainerRef.current.scrollTop = parseInt(savedScrollPosition, 10);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [loading, lastViewedRestaurant, searchData]);

  const handleScroll = (e) => {
    sessionStorage.setItem(
      "restaurantListScrollPosition",
      e.target.scrollTop.toString()
    );
  };

  // Get data freshness info
  const getDataFreshness = () => {
    const lastUpdated = localStorage.getItem("restaurantListLastUpdated");
    if (lastUpdated) {
      const date = new Date(lastUpdated);
      const now = new Date();
      const diffHours = Math.floor((now - date) / (1000 * 60 * 60));
      
      if (diffHours < 1) {
        return "Updated less than an hour ago";
      } else if (diffHours < 24) {
        return `Updated ${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
      } else {
        return `Updated ${date.toLocaleDateString()}`;
      }
    }
    return "Data freshness unknown";
  };

  function distanceValue(value) {
    setDistance(value);
  }

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;

    setCheckboxes((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const toggleDrawer = (newOpen) => () => {
    setOpenPanel(newOpen);
  };

  async function handleResetClick() {
    resetFilters();
  }

  function resetFilters() {
    setSelectedCuisines(undefined);
    setCheckboxes({
      halalOnlySelected: false,
      handsluaghteredSeelcted: false,
      vegetarianSelected: false,
      halalSelected: false,
    });
    setDistance(50);
  }

  async function handleApplyClick() {
    await fetchFilteredRestaurantData(
      location.latitude,
      location.longitude,
      distance,
      selectedCuisine
    );
    setOpenPanel(false);
  }

  async function handleGetCurrentLocation() {
    if (location.latitude && location.longitude) {
      // setLocation({
      //   latitude: null,
      //   longitude: null,
      //   error: null,
      // });
      // console.log("ASA")
      // setLocationData({});
    } else {
      getLocation();
    }
  }

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

  useEffect(() => {
    if (location.latitude && location.longitude) {
      fetchLocationData(location.latitude, location.longitude);
    }
  }, [location]);

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

  const fetchFilteredData = useRef(
    debounce(async (searchString) => {
      setLoading(true);
      const endpoint = searchString
        ? `/api/restaurants/getAllRestaurantByLetterSearchList/${searchString}`
        : null;

      if (!endpoint) {
        // Try to use cached data first
        const cachedData = localStorage.getItem("cachedRestaurantList");
        if (cachedData) {
          try {
            setSearchData(JSON.parse(cachedData));
            setLoading(false);
            return;
          } catch (e) {
            console.error("Error parsing cached restaurant data:", e);
          }
        }
        
        // Fallback to session storage
        const sessionData = sessionStorage.getItem("searchDataRestaurant");
        if (sessionData) {
          setSearchData(JSON.parse(sessionData));
        }
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(process.env.REACT_APP_API_BASE + endpoint, {
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_API_TOKEN}`,
          },
        });
        setSearchData(response.data);
      } catch (error) {
        console.error("Error fetching filtered data:", error);
        setError("Error fetching filtered data. Please try again.");
      } finally {
        setLoading(false);
      }
    }, 300) // Increased debounce time to manage fast typing better
  ).current;

  useEffect(() => {
    return () => {
      fetchFilteredData.cancel(); // Clean up debounce if component unmounts or before next effect
    };
  }, [fetchFilteredData]);

  const fetchAndStoreSearchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE}/api/restaurants/getAllRestaurantsSearchList`,
        {
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_API_TOKEN}`,
          },
        }
      );
      setSearchData(response.data);
      sessionStorage.setItem("searchDataRestaurant", JSON.stringify(response.data));
      // Also update the cache
      localStorage.setItem("cachedRestaurantList", JSON.stringify(response.data));
      localStorage.setItem("restaurantListLastUpdated", new Date().toISOString());

      setLoading(false);
    } catch (error) {
      console.error("Error fetching restaurant data:", error);
      setError("Error fetching restaurant data. Please try again.");
      setLoading(false);
    }
  };

  useEffect(() => {
    const savedQuery = sessionStorage.getItem("restaurantSearchQuery") || "";
    if (savedQuery) {
      setInput(savedQuery);
      fetchFilteredData(savedQuery);
    } else {
      // Try cached data first, then session storage, then fetch
      const cachedData = localStorage.getItem("cachedRestaurantList");
      if (cachedData) {
        try {
          setSearchData(JSON.parse(cachedData));
          setLoading(false);
        } catch (e) {
          console.error("Error parsing cached restaurant data:", e);
          const sessionData = sessionStorage.getItem("searchDataRestaurant");
          if (sessionData) {
            setSearchData(JSON.parse(sessionData));
            setLoading(false);
          } else {
            fetchAndStoreSearchData();
          }
        }
      } else {
        const sessionData = sessionStorage.getItem("searchDataRestaurant");
        if (sessionData) {
          setSearchData(JSON.parse(sessionData));
          setLoading(false);
        } else {
          fetchAndStoreSearchData();
        }
      }
    }

    const lastRestaurant = sessionStorage.getItem("lastViewedRestaurant");
    if (lastRestaurant) {
      setLastViewedRestaurant(JSON.parse(lastRestaurant));
    }
  }, [fetchFilteredData]);

  useEffect(() => {
    return () => {
      fetchFilteredData.cancel();
    };
  }, [fetchFilteredData]);

  const fetchFilteredRestaurantData = async (
    latitude,
    longitude,
    range,
    selectedCuisine
  ) => {
    setLoading(true);
    axios
      .get(
        process.env.REACT_APP_API_BASE +
          "/api/locations/getAllRestaurantInRange/" +
          "?latitude=" +
          (latitude === undefined ? "null" : latitude) +
          "&longitude=" +
          (longitude === undefined ? "null" : longitude) +
          "&range=" +
          (range === undefined ? "null" : range) +
          "&halalOnly=" +
          checkboxes.halalOnlySelected +
          "&handSlaughtered=" +
          checkboxes.handsluaghteredSeelcted +
          "&vegetarian=" +
          checkboxes.vegetarianSelected +
          "&halal=" +
          checkboxes.halalSelected +
          "&cuisine=" +
          (selectedCuisine === undefined ? "null" : selectedCuisine.name),
        {
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_API_TOKEN}`,
          },
        }
      )
      .then((response) => {
        setSearchData(response.data); // Set the fetched data directly
        setLoading(false); // Indicate loading is complete
      })
      .catch((error) => {
        console.error("Error fetching product data:", error);
        setError("Error fetching restaurant data. Please try again.");
        setLoading(false); // Ensure loading stops even if there's an error
      });
  };

  const handleRestaurantSelect = (value) => {
    sessionStorage.setItem("lastViewedRestaurant", JSON.stringify(value));
    setLastViewedRestaurant(value);
    navigate("/restaurant/" + value.id);
  };

  return (
    <div>
      <div className="mobile-restaurant-search-div">
        <div className="mobile-restaurant-search border-radius">
          <Select
            components={{
              Menu: () => null,
              MenuList: () => null,
              DropdownIndicator: () => null,
              IndicatorSeparator: () => null,
            }}
            options={searchData}
            placeholder="Search Restaurant"
            styles={{
              container: (baseStyles, state) => ({
                ...baseStyles,
                width: "100%",
                height: "80%",
              }),
              control: (baseStyles, state) => ({
                ...baseStyles,
                background: "#FAE7C2",
                borderWidth: "0px",
                borderRadius: "15px",
                boxShadow:
                  "0.3vmax 0.3vmax 0.6vmax rgba(0, 0, 0, 0.2), -0.2vmax -0.2vmax 0.4vmax rgba(255, 255, 255, 0.7)",
              }),
              valueContainer: (baseStyles, state) => ({
                ...baseStyles,
                justifyContent: "flex-start",
                marginLeft: "0.5vw",
              }),
              placeholder: (baseStyles, state) => ({
                ...baseStyles,
                color: "#6B6A6A",
                fontFamily: "Poppins-ExtraLight",
              }),
              option: (baseStyles, state) => ({
                ...baseStyles,
                color: "#6B6A6A",
                fontFamily: "Poppins-ExtraLight",
                textAlign: "left",
                backgroundColor: state.isSelected ? "#FFF5E3" : "transparent",
              }),
            }}
            onInputChange={(value, action) => {
              if (action.action === "input-change") {
                setInput(value);
                sessionStorage.setItem("restaurantSearchQuery", value);
                fetchFilteredData(value);
              }
            }}
            onChange={handleRestaurantSelect}
            inputValue={input}
          />
        </div>
        <div className="mobile-restaurant-search-filter-box">
          <div
            onClick={() => {
              handleGetCurrentLocation();
              setOpenPanel(true);
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
              style={{ marginTop: "0", margin: 0, backgroundColor: "#FAE7C2" }}
              className="circle-icon"
            >
              <img className="mobile-icon" src={filterIcon} alt="Filter" />
            </div>
          </div>
        </div>
      </div>

      {/* Data Freshness Indicator */}
      <div style={{
        textAlign: "center",
        padding: "8px 0",
        fontSize: "12px",
        color: "#999",
        fontFamily: "Poppins-ExtraLight"
      }}>
        {getDataFreshness()}
      </div>

      {loading ? (
        <div
          className="mobile-product-body border-radius"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <CircularProgress size={"10dvh"} color="#FAE7C2" />
          <p className="text-center mt-4" style={{ fontFamily: "Poppins-Regular" }}>
            Fetching data...
          </p>
        </div>
      ) : error ? (
        <div className="mobile-product-body border-radius">
          <p style={{ 
            textAlign: "center", 
            fontFamily: "Poppins-Regular", 
            color: "#333333",
            padding: "20px"
          }}>
            {error}
          </p>
        </div>
      ) : (
        <div 
          className="mobile-product-body border-radius"
          ref={scrollContainerRef}
          onScroll={handleScroll}
        >
          <ScrollList 
            items={searchData} 
            listType="restaurant"
            onScroll={handleScroll}
            lastViewedProduct={lastViewedRestaurant}
          />
        </div>
      )}
      
      <FilterDrawer
        height="100%"
        anchor="bottom"
        open={openPanel}
        onClose={toggleDrawer(false)}
      >
        <div className="restaurant-location-filter-panel-content">
          <div className="filter-title">Filter</div>
          <div className="mobile-restaurant-filter-box">
            <FormGroup>
              {[
                { name: "halalSelected", label: "Halal" },
                { name: "halalOnlySelected", label: "Only Serve Halal" },
                { name: "handsluaghteredSeelcted", label: "Hand Slaughtered Chicken" },
                { name: "vegetarianSelected", label: "Vegetarian Options" },
              ].map((option) => (
                <FormControlLabel
                  key={option.name}
                  checked={checkboxes[option.name]}
                  onChange={handleCheckboxChange}
                  control={
                    <Checkbox
                      icon={<CircleUnchecked />}
                      checkedIcon={<CircleChecked />}
                      sx={{
                        color: "#A98614",
                        "&.Mui-checked": {
                          color: "#A98614",
                        },
                      }}
                    />
                  }
                  label={
                    <Typography
                      className="label-text"
                      style={{ fontFamily: "Poppins-Regular" }}
                    >
                      {option.label}
                    </Typography>
                  }
                  name={option.name}
                />
              ))}
            </FormGroup>
          </div>
          <div className="location-filter-options">
            <div className="location-set-auto">
              <div className="wide-center">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <Box sx={{ width: "90%", marginTop: 2, marginBottom: 2 }}>
                    <Autocomplete
                      getOptionLabel={(option) => option.name || ""}
                      size="small"
                      singleSelect
                      id="single-select-cuisine"
                      options={cuisinesList}
                      value={selectedCuisine}
                      onChange={handleCuisineChange}
                      ListboxProps={{
                        sx: {
                          fontFamily: "Poppins-Regular",
                          // backgroundColor: "rgba(255, 245, 227, 0.5)",
                        },
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Select Cuisine"
                          // placeholder="Choose..."
                          variant="outlined"
                          sx={{
                            "& .MuiInputBase-input": {
                              fontFamily: "Poppins-Regular", // Font for input text and placeholder
                            },
                            "& .MuiInputLabel-root": {
                              fontFamily: "Poppins-Regular", // Font for label
                              "&.Mui-focused": {
                                color: "#000", // Prevent label text from turning blue
                              },
                            },
                            "& .MuiOutlinedInput-root": {
                              "&.Mui-focused fieldset": {
                                borderColor: "#A98614", // Custom focus border color
                                boxShadow: "none", // Removes focus shadow
                              },
                            },
                          }}
                        />
                      )}
                      sx={{
                        "& .MuiAutocomplete-listbox": {
                          fontFamily: "Poppins-Regular", // Dropdown text font family
                        },
                        "& .MuiAutocomplete-option": {
                          fontFamily: "Poppins-Regular", // Font for all options
                          "&[data-focus='true']": {
                            backgroundColor: "#A98614",
                            color: "#fff",
                          },
                          "&[aria-selected='true']": {
                            backgroundColor: "#A98614",
                            color: "#fff",
                          },
                        },
                      }}
                    />
                  </Box>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <p className="location-slider-text">Distance</p>
                  <PrettoSlider
                    defaultValue={50}
                    value={distance}
                    min={5}
                    max={100}
                    marks={marks}
                    getAriaValueText={distanceValue}
                    aria-label="Distance Slider"
                    onChange={(e) => setDistance(e.target.value)}
                  />
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
              <Button
                style={{ fontFamily: "Poppins-Regular" }}
                variant="customNo"
                onClick={handleResetClick}
                className="poppins-regular boxshadow"
              >
                {" "}
                Reset{" "}
              </Button>
              <Button
                style={{ fontFamily: "Poppins-Regular" }}
                onClick={handleApplyClick}
                className="poppins-regular boxshadow"
              >
                {" "}
                Apply{" "}
              </Button>
            </div>
          </div>
        </div>
      </FilterDrawer>
    </div>
  );
};

const FilterDrawer = styled(Drawer)({
  "& .MuiDrawer-paper": {
    height: "70dvh",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    borderTopLeftRadius: "20px",
    borderTopRightRadius: "20px",
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

export default RestaurantBodyDefault;

import React, { useEffect, useState, useRef } from "react";
import "../../App.css";
import ScrollList from "../scrollList";
import Select from "react-select";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import debounce from "lodash.debounce";
import { CircularProgress } from "@mui/material";

const ProductBodyDefault = ({ selectedOption, ...rest }) => {
  const [input, setInput] = useState(
    sessionStorage.getItem("productSearchQuery") || ""
  );
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [searchData, setSearchData] = useState([]);
  const [error, setError] = useState(null);
  const scrollContainerRef = useRef(null);
  const [lastViewedProduct, setLastViewedProduct] = useState(null);

  // Enhanced navigation state restoration
  useEffect(() => {
    return () => {
      // Save scroll position and search state on unmount
      if (scrollContainerRef.current) {
        sessionStorage.setItem("productListScrollPosition", scrollContainerRef.current.scrollTop);
      }
      sessionStorage.setItem("productSearchQuery", input);
    };
  }, [input]);

  const fetchFilteredDataRef = useRef(
    debounce(async (searchString) => {
      setLoading(true);
      const endpoint = searchString
        ? `/api/products/getAllProductsByLetterSearchList/${searchString}`
        : null;

      if (!endpoint) {
        // Try to use cached data first
        const cachedData = localStorage.getItem("cachedProductList");
        if (cachedData) {
          try {
            setSearchData(JSON.parse(cachedData));
            setLoading(false);
            return;
          } catch (e) {
            console.error("Error parsing cached data:", e);
          }
        }
        
        // Fallback to session storage
        const sessionData = sessionStorage.getItem("searchData");
        if (sessionData) {
          setSearchData(JSON.parse(sessionData));
          setLoading(false);
        } else {
          await fetchAndStoreSearchData();
        }
        return;
      }

      try {
        const response = await axios.get(
          process.env.REACT_APP_API_BASE + endpoint,
          {
            headers: {
              Authorization: `Bearer ${process.env.REACT_APP_API_TOKEN}`,
            },
          }
        );
        setSearchData(response.data);
      } catch (error) {
        setError("Error fetching filtered data. Please try again.");
        console.error("Error fetching filtered data:", error);
      } finally {
        setLoading(false);
      }
    }, 300)
  );

  useEffect(() => {
    return () => {
      fetchFilteredDataRef.current.cancel();
    };
  }, []);

  useEffect(() => {
    const savedQuery = sessionStorage.getItem("productSearchQuery") || "";
    if (savedQuery) {
      setInput(savedQuery);
      fetchFilteredDataRef.current(savedQuery);
    } else {
      // Try cached data first, then session storage, then fetch
      const cachedData = localStorage.getItem("cachedProductList");
      if (cachedData) {
        try {
          setSearchData(JSON.parse(cachedData));
          setLoading(false);
        } catch (e) {
          console.error("Error parsing cached data:", e);
          const sessionData = sessionStorage.getItem("searchData");
          if (sessionData) {
            setSearchData(JSON.parse(sessionData));
            setLoading(false);
          } else {
            fetchAndStoreSearchData();
          }
        }
      } else {
        const sessionData = sessionStorage.getItem("searchData");
        if (sessionData) {
          setSearchData(JSON.parse(sessionData));
          setLoading(false);
        } else {
          fetchAndStoreSearchData();
        }
      }
    }

    const lastProduct = sessionStorage.getItem("lastViewedProduct");
    if (lastProduct) {
      setLastViewedProduct(JSON.parse(lastProduct));
    }
  }, []);

  // Enhanced scroll restoration
  useEffect(() => {
    if (loading || !scrollContainerRef.current) return;

    const timer = setTimeout(() => {
      const lastProduct = sessionStorage.getItem("lastViewedProduct");
      const lastViewedId = lastProduct ? JSON.parse(lastProduct).id : null;

      if (lastViewedId) {
        const lastViewedElement = document.querySelector(
          `[data-product-id="${lastViewedId}"]`
        );
        if (lastViewedElement) {
          lastViewedElement.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
          // Clear the last viewed product after successful scroll
          sessionStorage.removeItem("lastViewedProduct");
          return;
        }
      }

      const savedScrollPosition = sessionStorage.getItem(
        "productListScrollPosition"
      );
      if (savedScrollPosition) {
        scrollContainerRef.current.scrollTop = parseInt(savedScrollPosition, 10);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [loading, lastViewedProduct, searchData]);

  const handleScroll = (e) => {
    sessionStorage.setItem(
      "productListScrollPosition",
      e.target.scrollTop.toString()
    );
  };

  const fetchAndStoreSearchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE}/api/products/getAllProductsSearchList`,
        {
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_API_TOKEN}`,
          },
        }
      );
      const data = response.data;
      setSearchData(data);
      sessionStorage.setItem("searchData", JSON.stringify(data));
      // Also update the cache
      localStorage.setItem("cachedProductList", JSON.stringify(data));
      localStorage.setItem("productListLastUpdated", new Date().toISOString());
    } catch (error) {
      setError("Error fetching product data. Please try again.");
      console.error("Error fetching product data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleProductSelect = (value) => {
    sessionStorage.setItem("lastViewedProduct", JSON.stringify(value));
    setLastViewedProduct(value);
    navigate("/product/" + value.id);
  };

  // Get data freshness info
  const getDataFreshness = () => {
    const lastUpdated = localStorage.getItem("productListLastUpdated");
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

  return (
    <div>
      <div className="mobile-product-search">
        <Select
          components={{
            Menu: () => null,
            MenuList: () => null,
            DropdownIndicator: () => null,
            IndicatorSeparator: () => null,
          }}
          options={searchData}
          placeholder="Search Product"
          styles={{
            container: (baseStyles) => ({
              ...baseStyles,
              width: "100%",
              height: "32px",
            }),
            control: (baseStyles) => ({
              ...baseStyles,
              background: "#FAE7C2",
              borderWidth: "0px",
              borderRadius: "8px",
              minHeight: "32px",
              height: "32px",
              boxShadow: "none",
              width: "100%",
            }),
            valueContainer: (baseStyles) => ({
              ...baseStyles,
              padding: "0 8px",
              height: "32px",
            }),
            placeholder: (baseStyles) => ({
              ...baseStyles,
              color: "#6B6A6A",
              fontFamily: "Poppins-ExtraLight",
              fontSize: "14px",
            }),
            input: (baseStyles) => ({
              ...baseStyles,
              margin: 0,
              padding: 0,
              height: "32px",
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
              sessionStorage.setItem("productSearchQuery", value);
              fetchFilteredDataRef.current(value);
            }
          }}
          onChange={handleProductSelect}
          inputValue={input}
        />
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
          className="mobile-product-body"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <CircularProgress size={"10dvh"} color="#FAE7C2" />
          <p
            className="text-center mt-4"
            style={{ fontFamily: "Poppins-Regular" }}
          >
            Fetching data...
          </p>
        </div>
      ) : error ? (
        <div className="mobile-product-body">
          <p>{error}</p>
        </div>
      ) : (
        <div
          className="mobile-product-body"
          ref={scrollContainerRef}
          onScroll={handleScroll}
        >
          <ScrollList
            items={searchData}
            listType="products"
            onScroll={handleScroll}
            lastViewedProduct={lastViewedProduct}
          />
        </div>
      )}
    </div>
  );
};

export default ProductBodyDefault;

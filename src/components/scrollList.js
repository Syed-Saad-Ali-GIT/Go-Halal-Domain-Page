import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "../App.css";
import MobileProductBox from "./Product-Mobile/productBoxMobile";
import MobileRestaurantLocationBox from "./Restaurant-Mobile/mobileRestaurantLocationBox";
import RestaurantBoxMobile from "./Restaurant-Mobile/restaurantBoxMobile";
import { CircularProgress } from "@mui/material";

const ScrollList = ({ 
  items, 
  listType, 
  stateChanger, 
  maxHeight = "70dvh", 
  onScroll, 
  isLoading = false,
  lastViewedProduct = null,
  ...rest 
}) => {
  const [renderedItems, setRenderedItems] = useState([]);
  
  // Progressive loading for better performance
  useEffect(() => {
    if (items.length === 0) {
      setRenderedItems([]);
      return;
    }

    // Initial batch of items to show immediately
    const initialBatch = 10;
    setRenderedItems(items.slice(0, Math.min(initialBatch, items.length)));
    
    // If we have more items, load them progressively
    if (items.length > initialBatch) {
      const timer = setTimeout(() => {
        setRenderedItems(items);
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [items]);

  const renderListItem = (item) => {
    // Check if this item is the last viewed product
    const isLastViewed = lastViewedProduct && lastViewedProduct.id === item.id;
    
    // Add custom background color for the last viewed product
    const highlightBackground = isLastViewed ? "#FFF5E3" : undefined;
    
    switch (listType) {
      case "restaurant":
        return (
          <div 
            className={`list-item ${isLastViewed ? 'last-viewed' : ''}`}
            data-restaurant-id={item.id}
          >
            <RestaurantBoxMobile 
              stateChanger={stateChanger} 
              item={item}
              backgroundColor={highlightBackground}
            />
          </div>
        );
      case "products":
        return (
          <div 
            className={`list-item ${isLastViewed ? 'last-viewed' : ''}`}
            data-product-id={item.id}
          >
            <MobileProductBox
              enableModal={false}
              stateChanger={stateChanger}
              item={item}
              backgroundColor={highlightBackground}
            />
          </div>
        );
      case "location":
        return (
          <div className="list-item-location">
            <MobileRestaurantLocationBox item={item} link={item.link} />
          </div>
        );
      default:
        console.warn(`Unknown list type: ${listType}`);
        return <div className="list-item">Unknown item type</div>;
    }
  };

  // Loading placeholders
  const renderLoading = () => (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100%',
      flexDirection: 'column'
    }}>
      <CircularProgress size={40} style={{ color: "#FAE7C2" }} />
      <p style={{ 
        marginTop: '15px', 
        fontFamily: 'Poppins-Regular', 
        color: '#333333',
        fontSize: 'calc(3px + 2vmin)'
      }}>
        Loading...
      </p>
    </div>
  );

  if (isLoading) {
    return (
      <div className="scrollable-list" style={{ maxHeight }}>
        {renderLoading()}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div
        className="scrollable-list"
        style={{
          maxHeight,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <p
          className="list-item-location"
          style={{
            textAlign: "center",
            fontFamily: "Poppins-Regular",
            color: "#333333",
            margin: "2em",
          }}
        >
          {listType === "restaurant" ? (
            <>
              No Restaurants Found, <br /> Try a different search
            </>
          ) : listType === "products" ? (
            <>
              No Products Found, <br />
            </>
          ) : (
            <>
              No Locations Found In Range, <br />
            </>
          )}
        </p>
      </div>
    );
  }

  return (
    <div 
      className="scrollable-list" 
      style={{ maxHeight }}
      onScroll={onScroll}
    >
      {renderedItems.map((item, index) => (
        <div key={`${listType}-${item.id || index}`}>{renderListItem(item)}</div>
      ))}
      
      {/* Show loading indicator when more items are loading */}
      {renderedItems.length < items.length && (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          marginTop: '10px',
          marginBottom: '15px'
        }}>
          <CircularProgress size={30} style={{ color: "#FAE7C2" }} />
        </div>
      )}
    </div>
  );
};

ScrollList.propTypes = {
  items: PropTypes.array.isRequired,
  listType: PropTypes.oneOf(["restaurant", "products", "location"]).isRequired,
  stateChanger: PropTypes.func,
  maxHeight: PropTypes.string,
  onScroll: PropTypes.func,
  isLoading: PropTypes.bool,
  lastViewedProduct: PropTypes.object // Can be either product or restaurant
};

export default ScrollList;

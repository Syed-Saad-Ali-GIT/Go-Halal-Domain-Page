import React, { useState } from "react";
import "../../App.css";
import PropTypes from "prop-types";
import logo from "../../assets/media/logo-minimal.png";
import crossIcon from "../../assets/media/cross.png";
import tickIcon from "../../assets/media/tick.png";
import warnIcon from "../../assets/media/warn.png";
import aiIcon from "../../assets/media/AI.png";
import { useNavigate } from "react-router-dom";
import { Tooltip } from "@mui/material";

const MobileProductBox = ({ item, enableModal, hasShadow = true, backgroundColor }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  

  const getLeftIcon = (isHalal) => {
    switch (isHalal) {
      case "Halal":
        return tickIcon;
      case "Not Halal":
        return crossIcon;
      default:
        return warnIcon;
    }
  };

  const getRightIcon = (reviewed) => (reviewed === "AI-Detected" ? aiIcon : tickIcon);
  
  // Skip rendering if item has no ID
  if (item.id === undefined) {
    return null;
  }
  
  // Get combined status badge (icon + text) with tooltip for doubtful items
  const getCombinedStatusBadge = (isHalal) => {
    let badgeClass = "combined-status-badge ";
    if (isHalal === "Halal") badgeClass += "halal";
    else if (isHalal === "Not Halal") badgeClass += "not-halal";
    else badgeClass += "doubtful";
    
    const badge = (
      <div className={badgeClass}>
        <div className="status-icon-wrapper">
          <img src={getLeftIcon(isHalal)} className="status-icon" alt="" />
        </div>
        {isHalal}
      </div>
    );

    // Add tooltip for doubtful items
    if (isHalal === "Doubtful") {
      return (
        <Tooltip 
          title="Contains ingredients that may be halal or haram. Please review ingredients and consult with a scholar if unsure."
          arrow
          placement="top"
        >
          {badge}
        </Tooltip>
      );
    }
    
    return badge;
  };

  // Get review status badge based on type with tooltip for AI-detected items
  const getReviewBadge = (reviewStatus) => {
    if (reviewStatus === "AI-Detected") {
      const badge = (
        <div className="ai-badge">
          <div className="status-icon-wrapper">
            <img src={aiIcon} className="status-icon" alt="" />
          </div>
          {reviewStatus}
        </div>
      );

      return (
        <Tooltip 
          title="This product status was detected by our AI—no human review yet. Please double-check if unsure."
          arrow
          placement="top"
        >
          {badge}
        </Tooltip>
      );
    } else {
      // For manually reviewed items
      return (
        <div className="reviewed-badge">
          <div className="status-icon-wrapper">
            <img src={tickIcon} className="status-icon" alt="" />
          </div>
          Reviewed
        </div>
      );
    }
  };

  // Format product name for better display
  const formatProductName = (name) => {
    if (!name) return "";
    
    // Truncate if too long
    if (name.length > 60) {
      return name.substring(0, 57) + "...";
    }
    return name;
  };

  // Store current product ID in the URL as a state parameter when navigating
  const handleProductClick = () => {
    navigate(`/product/${item.id}`);
  };

  return (
    <>
      <div
        onClick={handleProductClick}
        className="mobile-product-box"
        style={{
          backgroundColor: backgroundColor || "#FFFFFF",
          boxShadow: !hasShadow ? "none" : undefined
        }}
        role="button"
        aria-label={`View details for ${item.value || "product"}`}
      >
        <div
          className="mobile-product-box-image"
          onClick={(e) => {
            if (enableModal) {
              e.stopPropagation(); // Prevent navigation when the image is clicked
              setIsModalOpen(true);
            }
          }}
        >
          <div className="mobile-product-box-image-bg">
            <img
              onError={(e) =>
                (e.target.src =
                  "https://zhyjigkdefdvvqfikthh.supabase.co/storage/v1/object/public/restaurants-logo/logo.png")
              }
              src={
                "https://zhyjigkdefdvvqfikthh.supabase.co/storage/v1/object/public/product_images_new/" +
                  item.id +
                  ".webp" || logo
              }
              className="mobile-product-img"
              alt={item.value || "Product"}
              loading="lazy"
            />
          </div>
        </div>
        <div className="mobile-product-box-content">
          <div className="mobile-product-box-content-title">
            <p className="mobile-product-box-title-text">{formatProductName(item.value)}</p>
          </div>
          <div className="mobile-product-box-content-label">
            <div className="mobile-product-box-label-box-left">
              {getCombinedStatusBadge(item.isHalal)}
            </div>
            <div className="mobile-product-box-label-box-right">
              {getReviewBadge(item.reviewed)}
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Larger Image */}
      {enableModal && isModalOpen && (
        <div 
          className="image-modal" 
          onClick={() => setIsModalOpen(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000
          }}
          role="dialog"
          aria-label="Product image preview"
        >
          <div
            className="image-modal-content"
            onClick={(e) => e.stopPropagation()} // Prevent closing modal when clicking on the image
            style={{
              position: "relative",
              width: "90%",
              maxWidth: "500px",
              backgroundColor: "#FFFFFF",
              borderRadius: "10px",
              padding: "20px",
              boxShadow: "0 5px 15px rgba(0, 0, 0, 0.3)"
            }}
          >
            <img
              onError={(e) =>
                (e.target.src =
                  "https://zhyjigkdefdvvqfikthh.supabase.co/storage/v1/object/public/restaurants-logo/logo.png")
              }
              src={
                "https://zhyjigkdefdvvqfikthh.supabase.co/storage/v1/object/public/product_images_new/" +
                  item.id +
                  ".webp" || logo
              }
              className="image-modal-img"
              alt={item.value || "Product"}
              style={{
                width: "100%",
                height: "auto",
                borderRadius: "5px"
              }}
            />
            <button 
              className="image-modal-close" 
              onClick={() => setIsModalOpen(false)}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                background: "rgba(0, 0, 0, 0.5)",
                color: "white",
                border: "none",
                borderRadius: "50%",
                width: "30px",
                height: "30px",
                cursor: "pointer",
                fontSize: "18px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </>
  );
};

MobileProductBox.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    value: PropTypes.string,
    isHalal: PropTypes.string,
    reviewed: PropTypes.string,
    brand: PropTypes.string
  }).isRequired,
  enableModal: PropTypes.bool,
  hasShadow: PropTypes.bool,
  backgroundColor: PropTypes.string
};

export default MobileProductBox;

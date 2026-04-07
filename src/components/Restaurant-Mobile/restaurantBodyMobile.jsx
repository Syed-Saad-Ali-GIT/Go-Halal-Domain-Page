import React, { useState, useEffect } from "react";
import "../../App.css";
import axios from "axios";
import RestaurantBodySingle from "./restaurantBodySingle";
import { useParams, useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";

const RestaurantBodyMobile = ({
  restaurantDataList,
  restaurantDataChanger,
  searchData,
  ...rest
}) => {
  const { id } = useParams();
  const [restaurantSelected, setRestaurantSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchSingleRestaurant = async (restaurantId) => {
    if (!restaurantId) {
      setError("Invalid restaurant ID");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE}/api/restaurants/getRestaurantById/${restaurantId}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_API_TOKEN}`,
          },
        }
      );

      // Validate the response data
      if (!response.data || !Array.isArray(response.data) || response.data.length === 0) {
        console.error("Invalid restaurant data received:", response.data);
        setError("Restaurant not found or invalid data received");
        setLoading(false);
        return;
      }

      const restaurantData = response.data;
      
      // Check if the id in the response matches the requested id
      if (String(restaurantData[0].id) !== String(restaurantId)) {
        console.error(`ID mismatch: requested ${restaurantId}, received ${restaurantData[0].id}`);
        setError("Restaurant data mismatch - incorrect restaurant loaded");
        setLoading(false);
        return;
      }

      setRestaurantSelected(restaurantData[0]);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching restaurant data:", error);
      setError("Error loading restaurant. Please try again.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSingleRestaurant(id);
  }, [id]);

  if (loading) {
    return (
      <div className="mobile-single-body border-radius">
        <div
          className="mobile-product-body-inner border-radius"
          style={{
            justifyContent: "center",
            alignItems: "center",
            display: "flex",
            flexDirection: "column",
            backgroundColor: "rgb(255, 253, 245)",
          }}
        >
          <CircularProgress size={"10dvh"} style={{ color: "#FAE7C2" }} />
          <p className="text-center mt-4" style={{ fontFamily: "Poppins-Regular", marginTop: "10px" }}>
            Loading restaurant...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mobile-single-body border-radius">
        <div
          className="mobile-product-body-inner border-radius"
          style={{
            justifyContent: "center",
            alignItems: "center",
            display: "flex",
            flexDirection: "column",
            backgroundColor: "rgb(255, 253, 245)",
            padding: "20px",
            textAlign: "center"
          }}
        >
          <p style={{ fontFamily: "Poppins-Regular", color: "#333333", marginBottom: "20px" }}>
            {error}
          </p>
          <button
            onClick={() => navigate("/restaurant")}
            style={{
              backgroundColor: "#FAE7C2",
              border: "none",
              borderRadius: "10px",
              padding: "10px 20px",
              fontFamily: "Poppins-Regular",
              boxShadow: "0.3vmax 0.3vmax 0.6vmax rgba(0, 0, 0, 0.2), -0.2vmax -0.2vmax 0.4vmax rgba(255, 255, 255, 0.7)",
              cursor: "pointer"
            }}
          >
            Back to Restaurants
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {restaurantSelected && <RestaurantBodySingle value={restaurantSelected} />}
    </div>
  );
};

export default RestaurantBodyMobile;

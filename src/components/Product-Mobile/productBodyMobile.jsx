import React, { useEffect, useState } from "react";
import "../../App.css";
import axios from "axios";
import ProductBodySingle from "./productBodySingle.jsx";
import { useParams, useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";

const ProductBodyMobile = ({ ...rest }) => {
  const { id } = useParams();
  const [productSelected, setProductSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchSingleProduct = async (productId) => {
    if (!productId) {
      setError("Invalid product ID");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE}/api/products/getProductById/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_API_TOKEN}`,
          },
        }
      );

      // Validate the response data
      if (!response.data || !Array.isArray(response.data) || response.data.length === 0) {
        console.error("Invalid product data received:", response.data);
        setError("Product not found or invalid data received");
        setLoading(false);
        return;
      }

      // Transform the data to ensure consistent property names with list view
      const productData = response.data;
      
      // Ensure the product has the 'value' property that matches what's in the list view
      if (productData[0].label && !productData[0].value) {
        productData[0].value = productData[0].label;
      }

      // Check if the id in the response matches the requested id
      if (String(productData[0].id) !== String(productId)) {
        console.error(`ID mismatch: requested ${productId}, received ${productData[0].id}`);
        setError("Product data mismatch - incorrect product loaded");
        setLoading(false);
        return;
      }

      setProductSelected(productData[0]);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching product data:", error);
      setError("Error loading product. Please try again.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSingleProduct(id);
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
            Loading product...
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
            onClick={() => navigate("/product")}
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
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {productSelected && <ProductBodySingle value={productSelected} />}
    </div>
  );
};

export default ProductBodyMobile;

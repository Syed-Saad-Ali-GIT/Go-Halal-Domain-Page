import React, { useEffect, useRef, useState, useCallback } from "react";
import "../../App.css";
import Snackbar from "@mui/material/Snackbar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  CircularProgress,
  Drawer,
  Modal,
  Chip,
  IconButton,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import Alert from "@mui/material/Alert";
import imageCompression from "browser-image-compression";
import CloseIcon from "@mui/icons-material/Close";
import CameraIcon from "@mui/icons-material/CameraAlt";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../components/ui/alertDialog";
import { Button } from "../ui/button";
import BarcodeScannerComponent from "../barcodeScanner";
import Barcode from "react-barcode";
import {
  getCameraPermissionStatus,
  requestCameraPermission,
  getCameraErrorMessage,
  requestWakeLock,
  releaseWakeLock
} from '../../lib/cameraUtils';

// Maximum number of recent scans to keep
const MAX_RECENT_SCANS = 5;

// Image upload options
const imageUploadOptions = {
  maxSizeMB: 1,
  maxWidthOrHeight: 1024,
  useWebWorker: true,
};



const ScanBody = ({ ...props }) => {
  const navigate = useNavigate();
  const abortControllerRef = useRef(null);
  const isMounted = useRef(true);

  // camera & wake‐lock
  const [stream, setStream]           = useState(null);
  const [wakeLock, setWakeLock]       = useState(null);
  const [permission, setPermission]   = useState("unknown");
  const [online, setOnline]           = useState(navigator.onLine);


  // Scanner & UI state
  const [typedValue, setTypedValue] = useState("");
  const [scannerError, setScannerError] = useState(null);
  const [scannerActive, setScannerActive] = useState(true);
  const [openManualEntry, setOpenManualEntry] = useState(false);
  const [openNoMatch, setOpenNoMatch] = useState(false);
  const [openPanel, setOpenPanel] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Searching For Barcodes...");
  const [openAlert, setOpenAlert] = useState(false);
  const [openAlertFail, setOpenAlertFail] = useState(false);
  const [successMessage, setSuccessMessage] = useState("Product Submitted Successfully!");
  const [failMessage, setFailMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Recent scans
  const [recentScans, setRecentScans] = useState([]);
  const [showRecentScans, setShowRecentScans] = useState(false);

  // Submission form state
  const [productName, setProductName] = useState("");
  const [productBrand, setProductBrand] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productCertificate, setProductCertificate] = useState("");
  const [productStatus, setProductStatus] = useState("PENDING");
  const [isHalal, setIsHalal] = useState("UNKNOWN");
  const [productImage, setProductImage] = useState(null);
  const [ingredientsImage, setIngredientsImage] = useState(null);
  const [submissionStep, setSubmissionStep] = useState(1);
  const [productImagePreview, setProductImagePreview] = useState(null);
  const [ingredientsImagePreview, setIngredientsImagePreview] = useState(null);

  const productImageInputRef = useRef(null);
  const ingredientsImageInputRef = useRef(null);

  const certificateOptions = [
    "JAKIM",
    "MUIS",
    "MUI",
    "HALAL INDIA",
    "SMIIC",
    "OTHER",
    "NOT AVAILABLE",
  ];

  // Helpers
  const wait = () => new Promise((res) => setTimeout(res, 1000));

  useEffect(() => {
    isMounted.current = true;
    const saved = localStorage.getItem("recentScans");
    if (saved) {
      try {
        setRecentScans(JSON.parse(saved));
      } catch {}
    }
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (recentScans.length) {
      localStorage.setItem("recentScans", JSON.stringify(recentScans));
    }
  }, [recentScans]);

  const addToRecentScans = useCallback((barcode, productName = null) => {
    setRecentScans(prev => {
      // remove any previous entry
      const filtered = prev.filter(scan => scan.barcode !== barcode);
      const newEntry = {
        barcode,
        productName,
        timestamp: new Date().toISOString(),
      };
      const newList = [newEntry, ...filtered].slice(0, MAX_RECENT_SCANS);
  
      // **IMMEDIATE PERSIST** so navigation can't interrupt it
      localStorage.setItem("recentScans", JSON.stringify(newList));
      return newList;
    });
  }, []);
   // ----------  CAMERA PERMISSION + STREAM + WAKE‐LOCK  ----------
   useEffect(() => {
    let lock;
    getCameraPermissionStatus()
      .then(state => {
        setPermission(state);
        if (state === 'granted' || state === 'prompt') {
          return requestCameraPermission();
        } else {
          throw new Error('Camera permission ' + state);
        }
      })
      .then(s => {
        setStream(s);
        return requestWakeLock();
      })
      .then(w => (lock = w) && setWakeLock(w))
      .catch(err => {
        alert(getCameraErrorMessage(err));
      });
  
    return () => {
      releaseWakeLock(lock);
      stream?.getTracks().forEach(t => t.stop());
    };
  }, []);
  

  // ----------  ONLINE / OFFLINE  ----------
  useEffect(() => {
    const onOnline  = () => setOnline(true);
    const onOffline = () => setOnline(false);
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }, []);
  

  const handleClickAlert = () => setOpenAlert(true);
  const handleCloseAlert = (_, reason) => {
    if (reason === "clickaway") return;
    setOpenAlert(false);
  };
  const handleClickAlertFail = () => setOpenAlertFail(true);
  const handleCloseAlertFail = (_, reason) => {
    if (reason === "clickaway") return;
    setOpenAlertFail(false);
    setFailMessage("");
  };
  const handleChangeErrorMessage = () => setErrorMessage("");

  // Unified search + navigate
  const searchProduct = useCallback(
    async (barcode) => {
      if (!barcode) return;
      setLoading(true);
      setLoadingMessage("Searching for product...");
      setOpenManualEntry(false);

      // cancel previous
      if (abortControllerRef.current) abortControllerRef.current.abort();
      const controller = new AbortController();
      abortControllerRef.current = controller;

      let foundProduct = false;

      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_API_BASE}/api/products/getProductByBarcode/${barcode}`,
          {
            headers: {
              Authorization: `Bearer ${process.env.REACT_APP_API_TOKEN}`,
            },
            signal: controller.signal,
          }
        );

        if (data?.length) {
          foundProduct = true;
          // Product name is now included in the barcode API response
          const productName = data[0]?.product_name || "Unknown Product";
          
          // Add to recent scans with the product name from the barcode API
          addToRecentScans(barcode, productName);
          
          // Show success message briefly before navigation
          setLoadingMessage(`Found: ${productName}`);
          
          // Navigate after a brief delay to show the success message
          setTimeout(() => {
            setLoading(false);
            navigate(`/product/${data[0].id || data[0].product_id}`);
          }, 1500);
        } else {
          // Add to recent scans without product name when no match found
          addToRecentScans(barcode);
          setOpenNoMatch(true);
        }
      } catch (err) {
        if (err.name !== "CanceledError") {
          setFailMessage("Error connecting to server. Please try again.");
          handleClickAlertFail();
        }
      } finally {
        // Only stop loading if we're not showing a success message
        if (!foundProduct) {
          setLoading(false);
        }
        setTimeout(() => isMounted.current && setScannerActive(true), 1500);
      }
    },
    [navigate, addToRecentScans]
  );

  // Scanner handlers
  const handleBarcodeScanned = useCallback(
    (code) => {
      if (!code) return;
      setTypedValue(code);
      setScannerError(null);
      setScannerActive(false);

      // beep + vibrate
      try {
        new Audio("/scan-beep.mp3").play().catch(() => {});
      } catch {}
      if (navigator.vibrate) navigator.vibrate(100);

      searchProduct(code);
    },
    [searchProduct]
  );

  const handleScannerError = useCallback((err) => {
    setScannerError(err);
    setOpenManualEntry(true);
    setErrorMessage(err);
  }, []);

  // Manual entry
  const handleManualSearch = () => {
    if (!typedValue.trim()) {
      alert("Please enter a valid barcode");
      return;
    }
    setScannerActive(false);
    searchProduct(typedValue.trim());
  };

  // No-match dialog
  const handleNoClick = () => {
    setOpenNoMatch(false);
    setScannerActive(true);
  };
  const handleYesClick = () => {
    setOpenNoMatch(false);
    setOpenPanel(true);
    resetProductForm();
  };

  // Recent scans panel
  const handleRecentScanSelect = (barcode) => {
    setTypedValue(barcode);
    setShowRecentScans(false);
    searchProduct(barcode);
  };
  const toggleRecentScans = () => setShowRecentScans((v) => !v);

  // Submission form helpers
  const resetProductForm = () => {
    setProductName("");
    setProductBrand("");
    setProductCategory("");
    setProductDescription("");
    setProductCertificate("");
    setProductStatus("PENDING");
    setIsHalal("UNKNOWN");
    setProductImage(null);
    setIngredientsImage(null);
    setProductImagePreview(null);
    setIngredientsImagePreview(null);
    setSubmissionStep(1);
  };

  const toggleDrawer = (newOpen) => () => {
    setOpenPanel(newOpen);
    if (!newOpen) {
      setScannerActive(true);
      resetProductForm();
    }
  };

  const nextStep = () => {
    if (submissionStep === 1) {
      if (!productName.trim()) {
        setFailMessage("Please enter a product name");
        handleClickAlertFail();
        return;
      }
      if (!productBrand.trim()) {
        setFailMessage("Please enter a brand name");
        handleClickAlertFail();
        return;
      }
    } else if (submissionStep === 2) {
      if (!productImage) {
        setFailMessage("Please upload a product image");
        handleClickAlertFail();
        return;
      }
    }
    setSubmissionStep((s) => s + 1);
  };
  const prevStep = () => setSubmissionStep((s) => Math.max(1, s - 1));

  const handleProductImageSelect = async (e) => {
    if (e.target.files?.[0]) {
      try {
        setLoading(true);
        const compressed = await imageCompression(e.target.files[0], imageUploadOptions);
        setProductImage(compressed);
        setProductImagePreview(URL.createObjectURL(compressed));
      } catch {
        setFailMessage("Error processing image. Please try again.");
        handleClickAlertFail();
      } finally {
        setLoading(false);
      }
    }
  };
  const handleIngredientsImageSelect = async (e) => {
    if (e.target.files?.[0]) {
      try {
        setLoading(true);
        const compressed = await imageCompression(e.target.files[0], imageUploadOptions);
        setIngredientsImage(compressed);
        setIngredientsImagePreview(URL.createObjectURL(compressed));
      } catch {
        setFailMessage("Error processing image. Please try again.");
        handleClickAlertFail();
      } finally {
        setLoading(false);
      }
    }
  };

  const captureProductImage = () => productImageInputRef.current.click();
  const captureIngredientsImage = () => ingredientsImageInputRef.current.click();
  const removeProductImage = () => {
    setProductImage(null);
    setProductImagePreview(null);
    if (productImageInputRef.current) productImageInputRef.current.value = "";
  };
  const removeIngredientsImage = () => {
    setIngredientsImage(null);
    setIngredientsImagePreview(null);
    if (ingredientsImageInputRef.current) ingredientsImageInputRef.current.value = "";
  };

  const handleSubmitProduct = async () => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("barcode", typedValue);
      formData.append("product_name", productName);
      formData.append("brand", productBrand);
      formData.append("category", productCategory);
      formData.append("description", productDescription);
      formData.append("certificate", productCertificate);
      formData.append("status", productStatus);
      formData.append("is_halal", isHalal);
      if (productImage) formData.append("product_image", productImage);
      if (ingredientsImage) formData.append("ingredients_image", ingredientsImage);

      await axios.post(
        `${process.env.REACT_APP_API_BASE}/api/products/submitProduct`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${process.env.REACT_APP_API_TOKEN}`,
          },
        }
      );

      setSuccessMessage("Product submitted successfully! Thank you for your contribution.");
      handleClickAlert();
      setOpenPanel(false);
      resetProductForm();
      setScannerActive(true);
    } catch {
      setFailMessage("Error submitting product. Please try again.");
      handleClickAlertFail();
    } finally {
      setLoading(false);
    }
  };

  const renderSubmissionForm = () => {
    switch (submissionStep) {
      case 1:
        return (
          <div className="submission-form-container">
            <div className="submission-step-indicator">
              <div className="submission-step active"></div>
              <div className="submission-step"></div>
              <div className="submission-step"></div>
            </div>
            <h3 className="submission-form-title">Product Details</h3>
            <div className="submission-form-barcode">
              <Barcode value={typedValue} height={40} margin={0} background="transparent" />
            </div>

            <TextField
              label="Product Name"
              variant="outlined"
              fullWidth
              margin="normal"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              required
            />

            <TextField
              label="Brand"
              variant="outlined"
              fullWidth
              margin="normal"
              value={productBrand}
              onChange={(e) => setProductBrand(e.target.value)}
              required
            />

            <TextField
              label="Category"
              variant="outlined"
              fullWidth
              margin="normal"
              value={productCategory}
              onChange={(e) => setProductCategory(e.target.value)}
              placeholder="e.g., Snacks, Beverages, Dairy"
            />

            <TextField
              label="Description"
              variant="outlined"
              fullWidth
              margin="normal"
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
              multiline
              rows={2}
              placeholder="Brief description of the product"
            />

            <FormControl fullWidth margin="normal">
              <InputLabel>Halal Certificate</InputLabel>
              <Select
                value={productCertificate}
                onChange={(e) => setProductCertificate(e.target.value)}
                label="Halal Certificate"
              >
                <MenuItem value="">
                  <em>Select certificate (if known)</em>
                </MenuItem>
                {certificateOptions.map((cert) => (
                  <MenuItem key={cert} value={cert}>
                    {cert}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <div className="submission-form-navigation">
              <Button className="submission-form-button secondary" onClick={toggleDrawer(false)}>
                Cancel
              </Button>
              <Button className="submission-form-button primary" onClick={nextStep}>
                Next
              </Button>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="submission-form-container">
            <div className="submission-step-indicator">
              <div className="submission-step"></div>
              <div className="submission-step active"></div>
              <div className="submission-step"></div>
            </div>
            <h3 className="submission-form-title">Upload Images</h3>
            <p className="submission-form-subtitle">
              Please upload clear images of the product and its ingredients list
            </p>

            <div className="submission-form-image-section">
              <h4 className="submission-form-image-title">
                Product Image <span className="required">*</span>
              </h4>

              {productImagePreview ? (
                <div className="submission-form-image-preview-container">
                  <img
                    src={productImagePreview}
                    alt="Product preview"
                    className="submission-form-image-preview"
                  />
                  <button className="submission-form-image-remove" onClick={removeProductImage}>
                    <CloseIcon />
                  </button>
                </div>
              ) : (
                <div className="submission-form-image-upload">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProductImageSelect}
                    ref={productImageInputRef}
                    style={{ display: "none" }}
                    capture="environment"
                  />
                  <button className="submission-form-image-button" onClick={captureProductImage}>
                    <CameraIcon />
                    <span>Take Photo</span>
                  </button>
                  <button
                    className="submission-form-image-button"
                    onClick={() => productImageInputRef.current.click()}
                  >
                    <AddPhotoAlternateIcon />
                    <span>Upload Image</span>
                  </button>
                </div>
              )}
            </div>

            <div className="submission-form-image-section">
              <h4 className="submission-form-image-title">Ingredients Image</h4>

              {ingredientsImagePreview ? (
                <div className="submission-form-image-preview-container">
                  <img
                    src={ingredientsImagePreview}
                    alt="Ingredients preview"
                    className="submission-form-image-preview"
                  />
                  <button className="submission-form-image-remove" onClick={removeIngredientsImage}>
                    <CloseIcon />
                  </button>
                </div>
              ) : (
                <div className="submission-form-image-upload">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleIngredientsImageSelect}
                    ref={ingredientsImageInputRef}
                    style={{ display: "none" }}
                    capture="environment"
                  />
                  <button
                    className="submission-form-image-button"
                    onClick={captureIngredientsImage}
                  >
                    <CameraIcon />
                    <span>Take Photo</span>
                  </button>
                  <button
                    className="submission-form-image-button"
                    onClick={() => ingredientsImageInputRef.current.click()}
                  >
                    <AddPhotoAlternateIcon />
                    <span>Upload Image</span>
                  </button>
                </div>
              )}
            </div>

            <div className="submission-form-navigation">
              <Button className="submission-form-button secondary" onClick={prevStep}>
                Back
              </Button>
              <Button className="submission-form-button primary" onClick={nextStep}>
                Next
              </Button>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="submission-form-container">
            <div className="submission-step-indicator">
              <div className="submission-step"></div>
              <div className="submission-step"></div>
              <div className="submission-step active"></div>
            </div>
            <h3 className="submission-form-title">Review & Submit</h3>

            <div className="submission-form-review">
              <div className="submission-form-review-item">
                <span className="review-label">Barcode:</span>
                <span className="review-value">{typedValue}</span>
              </div>
              <div className="submission-form-review-item">
                <span className="review-label">Product Name:</span>
                <span className="review-value">{productName}</span>
              </div>
              <div className="submission-form-review-item">
                <span className="review-label">Brand:</span>
                <span className="review-value">{productBrand}</span>
              </div>
              {productCategory && (
                <div className="submission-form-review-item">
                  <span className="review-label">Category:</span>
                  <span className="review-value">{productCategory}</span>
                </div>
              )}
              {productDescription && (
                <div className="submission-form-review-item">
                  <span className="review-label">Description:</span>
                  <span className="review-value">{productDescription}</span>
                </div>
              )}
              {productCertificate && (
                <div className="submission-form-review-item">
                  <span className="review-label">Certificate:</span>
                  <span className="review-value">{productCertificate}</span>
                </div>
              )}
            </div>

            <div className="submission-form-review-images">
              {productImagePreview && (
                <div className="review-image-container">
                  <span className="review-image-label">Product Image</span>
                  <img src={productImagePreview} alt="Product" className="review-image" />
                </div>
              )}
              {ingredientsImagePreview && (
                <div className="review-image-container">
                  <span className="review-image-label">Ingredients Image</span>
                  <img
                    src={ingredientsImagePreview}
                    alt="Ingredients"
                    className="review-image"
                  />
                </div>
              )}
            </div>

            <p className="submission-form-note">
              Thank you for contributing to Go-Halal! Our team will review this information.
            </p>

            <div className="submission-form-navigation">
              <Button className="submission-form-button secondary" onClick={prevStep}>
                Back
              </Button>
              <Button className="submission-form-button primary" onClick={handleSubmitProduct}>
                Submit
              </Button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "80dvh",
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FFF5E3",
        borderRadius: "15px",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* OFFLINE BANNER */}
      {!online && (
        <div style={{
          position:"absolute",top:0,left:0,width:"100%",
          background:"#FFD7D7",color:"#A00",padding:"0.5rem",
          textAlign:"center",zIndex:2000
        }}>
          You're offline – any lookups will queue until you reconnect.
        </div>
      )}
      {/* Scanner Component */}
      <div className="mobile-scan-body-scanner">
        {scannerActive && !scannerError && (
          <BarcodeScannerComponent
            onScan={handleBarcodeScanned}
            onError={handleScannerError}
            onManualEntryRequest={() => setOpenManualEntry(true)}
          />
        )}

        {/* Action Buttons */}
        <div
          style={{
            position: "absolute",
            bottom: "20px",
            left: 0,
            width: "100%",
            display: "flex",
            gap: "10px",
            padding: "0 20px",
            zIndex: 10,
          }}
        >
          {recentScans.length > 0 && (
            <button onClick={toggleRecentScans} style={{
              backgroundColor: "#FAE7C2",
              border: "none",
              borderRadius: "10px",
              padding: "10px 20px",
              fontFamily: "Poppins-Regular",
              fontSize: "1rem",
              boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
              flex: 1
            }}>
              Recent Scans
            </button>
          )}
          <button onClick={() => setOpenManualEntry(true)} style={{
            backgroundColor: "#FAE7C2",
            border: "none",
            borderRadius: "10px",
            padding: "10px 20px",
            fontFamily: "Poppins-Regular",
            fontSize: "1rem",
            boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
            flex: 1
          }}>
            Enter Manually
          </button>
        </div>

        {/* Scanner Error Reset */}
        {scannerError && (
          <div style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            padding: 20,
            backgroundColor: "rgba(0,0,0,0.7)",
            borderRadius: 10,
            color: "white",
            textAlign: "center",
            zIndex: 15,
          }}>
            <p style={{ marginBottom: 20 }}>{scannerError}</p>
            <button onClick={() => { setScannerError(null); setScannerActive(true); }} style={{
              backgroundColor: "#FAE7C2",
              border: "none",
              borderRadius: "10px",
              padding: "10px 20px",
              fontFamily: "Poppins-Regular",
              fontSize: "1rem",
              boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
              color: "#383838"
            }}>
              Retry Scanner
            </button>
          </div>
        )}
      </div>

      {/* Recent Scans Panel */}
      {showRecentScans && (
        <div className="manual-entry-container" style={{ zIndex: 20 }}>
          <div className="manual-entry-header">
            <h3 className="manual-entry-title">Recent Scans</h3>
            <button
              style={{
                marginLeft: "auto",
                marginRight: "8px",
                background: "#FFD7D7",
                border: "none",
                borderRadius: "8px",
                padding: "4px 10px",
                cursor: "pointer",
                color: "#A00",
                fontSize: "12px",
                fontFamily: "Poppins-Regular"
              }}
              onClick={() => {
                setRecentScans([]);
                localStorage.removeItem("recentScans");
              }}
            >
              Clear All
            </button>
            <button className="manual-entry-close" onClick={() => setShowRecentScans(false)}>
              ×
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '30vh', overflowY: 'auto' }}>
            {recentScans.map((scan, idx) => (
              <div
                key={idx}
                onClick={() => handleRecentScanSelect(scan.barcode)}
                style={{
                  backgroundColor: "#fff",
                  padding: "10px 15px",
                  borderRadius: 8,
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  cursor: "pointer",
                }}
              >
                {/* Show the product name */}
                <strong style={{ display: 'block', marginBottom: 4 }}>
                  {scan.productName || scan.barcode}
                </strong>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#666' }}>
                  <span>{scan.barcode}</span>
                  <span style={{ fontSize: '0.8rem', color: '#999' }}>
                    {new Date(scan.timestamp).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {loading && (
        <div style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.7)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
        }}>
          <CircularProgress size="10dvh" style={{ color: "#FAE7C2" }} />
          <p style={{ color: "white", marginTop: 20 }}>{loadingMessage}</p>
        </div>
      )}

      {/* Manual Entry Drawer */}
      {openManualEntry && (
        <div className="manual-entry-container">
          <div className="manual-entry-header">
            <h3 className="manual-entry-title">Enter Barcode Manually</h3>
            <button className="manual-entry-close" onClick={() => setOpenManualEntry(false)}>
              ×
            </button>
          </div>
          <input
            type="text"
            className="manual-entry-input"
            placeholder="Enter barcode number"
            value={typedValue}
            onChange={(e) => setTypedValue(e.target.value)}
            inputMode="numeric"
            pattern="[0-9]*"
            autoFocus
            onKeyPress={(e) => e.key === "Enter" && handleManualSearch()}
          />
          <button className="manual-entry-submit" onClick={handleManualSearch}>
            Search
          </button>
        </div>
      )}

      {/* Error Snackbar */}
      {errorMessage && (
        <Snackbar open={!!errorMessage} autoHideDuration={6000} onClose={handleChangeErrorMessage}>
          <Alert severity="error" onClose={handleChangeErrorMessage}>
            {errorMessage}
          </Alert>
        </Snackbar>
      )}

      {/* No Match Dialog */}
      <AlertDialog open={openNoMatch}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>No Match Found</AlertDialogTitle>
            <AlertDialogDescription>
              Barcode: {typedValue} <br /><br />
              We couldn't find this product in our database. Would you like to submit it for review?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleNoClick}>No</AlertDialogCancel>
            <AlertDialogAction onClick={handleYesClick}>Yes</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Success / Failure Alerts */}
      <Snackbar open={openAlert} autoHideDuration={6000} onClose={handleCloseAlert}>
        <Alert onClose={handleCloseAlert} severity="success">
          {successMessage}
        </Alert>
      </Snackbar>
      <Snackbar open={openAlertFail} autoHideDuration={6000} onClose={handleCloseAlertFail}>
        <Alert onClose={handleCloseAlertFail} severity="error">
          {failMessage}
        </Alert>
      </Snackbar>

      {/* Submission Panel */}
      <Drawer
        anchor="bottom"
        open={openPanel}
        onClose={toggleDrawer(false)}
        PaperProps={{
          style: {
            backgroundColor: "#FFF5E3",
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            maxHeight: "90vh",
            overflowY: "auto",
          },
        }}
      >
        {renderSubmissionForm()}
      </Drawer>
    </div>
  );
};

const FilterDrawer = styled(Drawer)({
  "& .MuiDrawer-paper": {
    height: "95%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
});

export default ScanBody;

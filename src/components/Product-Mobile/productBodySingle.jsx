import React, { useState } from "react";
import "../../App.css";
import tickIcon from "../../assets/media/tick.png";
import crossIcon from "../../assets/media/cross.png";
import warnIcon from "../../assets/media/warn.png";
import aiIcon from "../../assets/media/AI.png";
import PDFViewer from "../PDFViewer";
import {
  Alert,
  Button,
  CircularProgress,
  FormControlLabel,
  FormGroup,
  Snackbar,
  Tooltip,
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  IconButton,
  Typography,
  Divider,
  Stack,
  Box,
} from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alertDialog";
import { useNavigate } from "react-router-dom";
import CircleChecked from "@mui/icons-material/CheckCircle";
import CircleUnchecked from "@mui/icons-material/RadioButtonUnchecked";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ShareIcon from '@mui/icons-material/Share';
import ReportIcon from '@mui/icons-material/Flag';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import axios from "axios";

// Refactored ProductBodySingle for cleaner layout and better spacing with scroll support
const ProductBodySingle = ({ value }) => {
  const navigate = useNavigate();
  const [openSnack, setOpenSnack] = useState(false);
  const [snackMsg, setSnackMsg] = useState('');
  const [snackSeverity, setSnackSeverity] = useState('info');
  const [openModal, setOpenModal] = useState(false);
  const [isReportSubmitted, setIsReportSubmitted] = useState(false);
  const [showPDF, setShowPDF] = useState(false);
  const [checkboxes, setCheckboxes] = useState({
    halalStatus: false,
    incorrectBarcode: false,
    images: false,
    requestCertification: false,
  });

  const getProductDisplayName = () => {
    if (!value) return "";
    return value.value || value.label || "";
  };

  // Function to analyze ingredients and extract potential non-halal ingredients
  const extractNonHalalIngredients = (ingredients) => {
    if (!ingredients) return null;
    
    const nonHalalKeywords = [
      'alcohol', 'beer', 'wine', 'rum', 'whisky', 'vodka', 'brandy', 'pork', 
      'bacon', 'ham', 'gelatin', 'lard', 'tallow', 'ethanol'
    ];
    
    // Check if any non-halal keywords are present in the ingredients
    const foundIngredients = nonHalalKeywords.filter(keyword => 
      ingredients.toLowerCase().includes(keyword.toLowerCase())
    );
    
    if (foundIngredients.length === 0) return null;
    
    // Format the found ingredients nicely
    return foundIngredients.map(ingredient => 
      ingredient.charAt(0).toUpperCase() + ingredient.slice(1)
    ).join(', ');
  };

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setCheckboxes((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleNoClick = () => {
    setOpenModal(false);
    setCheckboxes({
      halalStatus: false,
      incorrectBarcode: false,
      images: false,
      requestCertification: false,
    });
  };

  const handleReportClick = async () => {
    const body = {
      product_id: value.id,
      halalStatus: checkboxes.halalStatus,
      incorrectBarcode: checkboxes.incorrectBarcode,
      images: checkboxes.images,
      requestCertification: checkboxes.requestCertification,
    };

    try {
      await axios.post(
        `${process.env.REACT_APP_API_BASE}/api/products/report`,
        body,
        {
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_API_TOKEN}`,
          },
        }
      );
      setSnackMsg("Report submitted successfully.");
      setSnackSeverity("success");
      setOpenSnack(true);
      setIsReportSubmitted(true);
    } catch (error) {
      console.error("Error submitting form:", error);
      setSnackMsg("Error submitting report. Please try again.");
      setSnackSeverity("error");
      setOpenSnack(true);
    }

    setOpenModal(false);
    setCheckboxes({
      halalStatus: false,
      incorrectBarcode: false,
      images: false,
      requestCertification: false,
    });
  };

  const handleBack = () => {
    if (value && value.id) {
      sessionStorage.setItem("lastViewedProduct", JSON.stringify(value));
    }
    navigate("/product");
  };

  const handleShare = async () => {
    const productName = getProductDisplayName();
    const shareData = {
      title: document.title,
      text: "GoHalal - Product Details " + productName,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.error("Error sharing:", error);
        navigator.clipboard.writeText(window.location.href);
        setSnackMsg("Link copied to clipboard");
        setOpenSnack(true);
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setSnackMsg("Link copied to clipboard");
        setOpenSnack(true);
      } catch (error) {
        console.error("Failed to copy:", error);
        setSnackMsg("Failed to copy link");
        setSnackSeverity("error");
        setOpenSnack(true);
      }
    }
  };

  const handleReport = () => {
    if (isReportSubmitted) {
      setSnackMsg("Report already submitted in this session.");
      setSnackSeverity("warning");
      setOpenSnack(true);
      return;
    } else {
      setOpenModal(true);
    }
  };

  if (!value) {
    return (
      <Box sx={{ 
        p: 2, 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center',
        height: '70vh'
      }}>
        <CircularProgress size={50} sx={{ color: "#A98614", mb: 2 }} />
        <Typography>Fetching product data...</Typography>
      </Box>
    );
  }

  const productName = getProductDisplayName();
  
  // Get combined status badge (icon + text) with tooltip for doubtful items
  const getCombinedStatusBadge = (isHalal) => {
    let badgeClass = "combined-status-badge ";
    if (isHalal === "Halal") badgeClass += "halal";
    else if (isHalal === "Not Halal") badgeClass += "not-halal";
    else badgeClass += "doubtful";

    const badge = (
      <div className={badgeClass}>
        <div className="status-icon-wrapper">
          <img
            src={
              isHalal === "Halal"
                ? tickIcon
                : isHalal === "Not Halal"
                ? crossIcon
                : warnIcon
            }
            className="status-icon"
            alt=""
          />
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

  // Get review badge based on type with tooltip for AI-detected items
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

  // Custom styles to fix scrolling issues
  const containerStyle = {
    padding: '16px',
    maxWidth: '600px',
    margin: '0 auto',
    marginBottom: '140px', // Extra space at bottom to ensure visibility of all content
    paddingBottom: '140px', // Extra padding to ensure content isn't hidden by navigation
  };

  return (
    <div style={containerStyle}>
      <Card elevation={2} sx={{ borderRadius: '15px' }}>
        <CardHeader
          avatar={
            <IconButton onClick={handleBack}>
              <ArrowBackIcon />
            </IconButton>
          }
          title={
            <Typography 
              variant="h6" 
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                wordBreak: 'break-word'
              }}
            >
              {productName}
            </Typography>
          }
          subheader={`Last updated: ${new Date(value.lastUpdated || Date.now()).toLocaleString()}`}
          action={
            <Box>
              <Tooltip title="Share this product">
                <IconButton onClick={handleShare}>
                  <ShareIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Report an issue">
                <IconButton onClick={handleReport}>
                  <ReportIcon />
                </IconButton>
              </Tooltip>
            </Box>
          }
        />
        <CardMedia
          component="img"
          height="240"
          image={`https://zhyjigkdefdvvqfikthh.supabase.co/storage/v1/object/public/product_images_new/${value.id}.webp`}
          alt={productName}
          sx={{ objectFit: 'contain', bgcolor: '#f9f9f9' }}
          onError={(e) => {
            e.target.src = "https://zhyjigkdefdvvqfikthh.supabase.co/storage/v1/object/public/restaurants-logo/logo.png";
          }}
        />
        <CardContent>
          <div className="product-status-badges" style={{ marginBottom: '16px', display: 'flex', gap: '8px' }}>
            {getCombinedStatusBadge(value.isHalal)}
            {getReviewBadge(value.reviewed)}
          </div>

          <Typography variant="subtitle1" gutterBottom>
            Ingredients
          </Typography>
          <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', mb: 2 }}>
            {value.ingredients || "No ingredient information available"}
          </Typography>

          {(value.doubtfulIngredients || value.nonHalalIngredients || value.non_halal_ingredients || 
            value.doubtful_ingredients || value.noteableIngredients || 
            value.isHalal === "Not Halal" || value.isHalal === "Doubtful" ||
            extractNonHalalIngredients(value.ingredients)) && (
            <>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle1" gutterBottom>
                Non-Halal / Doubtful
              </Typography>
              <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                {value.doubtfulIngredients || value.nonHalalIngredients || 
                 value.non_halal_ingredients || value.doubtful_ingredients || 
                 value.noteableIngredients || 
                 (extractNonHalalIngredients(value.ingredients) ? 
                   `Contains: ${extractNonHalalIngredients(value.ingredients)}` : 
                   (value.isHalal === "Not Halal" ? "This product contains non-halal ingredients" : 
                    value.isHalal === "Doubtful" ? "This product contains doubtful ingredients" : 
                    "No specific doubtful ingredients information available"))}
              </Typography>
            </>
          )}

          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle1">Certification</Typography>
          {value.certification ? (
            value.certification.startsWith('http') ? (
              <>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <Button 
                    onClick={() => setShowPDF(!showPDF)}
                    style={{
                      backgroundColor: "#A98614",
                      color: "#FFF",
                      fontFamily: "Poppins-Regular",
                      fontSize: "0.875rem",
                      padding: "6px 12px",
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px"
                    }}
                  >
                    <InfoOutlinedIcon fontSize="small" />
                    {showPDF ? "Hide Certification" : "View Certification"}
                  </Button>
                </Box>
                
                {showPDF ? (
                  <Box 
                    sx={{ 
                      mt: 2, 
                      border: '1px solid #eee',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      height: 'auto',
                      maxHeight: '60vh',
                      position: 'relative',
                      backgroundColor: '#f9f9f9'
                    }}
                  >
                    <PDFViewer filePath={value.certification} />
                    <Box sx={{ textAlign: 'center', mt: 1, mb: 1 }}>
                      <Typography variant="caption" color="text.secondary">
                        Having trouble viewing? 
                        <Typography 
                          component="a" 
                          href={value.certification} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          variant="caption"
                          sx={{ ml: 0.5, color: '#A98614', textDecoration: 'underline' }}
                        >
                          Open in new tab
                        </Typography>
                      </Typography>
                    </Box>
                  </Box>
                ) : null}
              </>
            ) : (
              <Typography variant="body2">{value.certification}</Typography>
            )
          ) : (
            <Typography variant="body2">None available</Typography>
          )}

          {value.allergens && (
            <>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle1">Allergens</Typography>
              <Typography variant="body2">{value.allergens}</Typography>
            </>
          )}
        </CardContent>

        <CardActions disableSpacing sx={{ justifyContent: 'flex-end' }}>
          {/* Any additional actions */}
        </CardActions>
      </Card>

      <Snackbar
        open={openSnack}
        autoHideDuration={4000}
        onClose={() => setOpenSnack(false)}
      >
        <Alert onClose={() => setOpenSnack(false)} severity={snackSeverity}>
          {snackMsg}
        </Alert>
      </Snackbar>

      <AlertDialog open={openModal} onOpenChange={setOpenModal}>
        <AlertDialogContent style={{ width: "90%", borderRadius: "20px", maxHeight: "80vh", overflowY: "auto" }}>
          <AlertDialogHeader className="poppins-regular">
            <AlertDialogTitle>Request review</AlertDialogTitle>
            <AlertDialogDescription>
              {productName}
              <FormGroup style={{ marginTop: "16px" }}>
                <FormControlLabel
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
                  label="Halal Status"
                  name="halalStatus"
                  className="checkbox-text"
                />
                <FormControlLabel
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
                  label="Incorrect Barcode"
                  name="incorrectBarcode"
                  className="checkbox-text"
                />
                <FormControlLabel
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
                  label="Images"
                  name="images"
                  className="checkbox-text"
                />
                <FormControlLabel
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
                  label="Request Certification"
                  name="requestCertification"
                  className="checkbox-text"
                />
              </FormGroup>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={handleNoClick}
              style={{
                backgroundColor: "#FFFDF5",
                borderColor: "#A98614",
                color: "#A98614",
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleReportClick}
              style={{ backgroundColor: "#A98614", color: "#FFF" }}
            >
              Report
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProductBodySingle;

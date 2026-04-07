import React, { useState } from "react";
import "../../App.css";
import ColoredLine from "../coloredLine";
import certificateIcon from "../../assets/media/certificate.png";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogHeader,
  AlertDialogCancel,
  AlertDialogFooter,
} from "../ui/alertDialog";
import PDFViewer from "../PDFViewer";

const ProductHalal = ({ item, ...rest }) => {
  const enabled = false;
  const [openModal, setOpenModal] = useState(false);
  async function handleNoClick() {
    setOpenModal(false);
  }

  return (
    <div
      style={{
        overflow: "scroll",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        height: "100%",
      }}
    >
      <div className="mobile-product-spacer"></div>
      <ColoredLine color={"rgba(0, 0, 0, 0.2)"} height={".25dvh"} width={"85%"} />
      <div style={{ display: "flex" }}></div>
      <div className="mobile-product-spacer"></div>
      <div className="mobile-product-title-sub-section">
        <p className="mobile-product-subtitle">Ingredients</p>
      </div>
      <div className="mobile-product-text-sub-section-halal">
        <p className="mobile-product-subtext">{item.ingredients}</p>
      </div>
      <div className="mobile-product-spacer"></div>
      {item.reviewed !== "AI-Detected" && !enabled && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
            justifyContent: "flex-end",
            gap: "2.5%",
            height: "59%",
          }}
        >
          <div
            onClick={() => setOpenModal(true)}
            className="circle-icon"
            style={{ background: "#9BE478", gap: "10%" }}
          >
            <img
              className="mobile-icon"
              style={{ maxHeight: "50%" }}
              src={certificateIcon}
            />
          </div>
          <p className="mobile-product-subtext">View Evidence</p>
        </div>
      )}

      <div className="mobile-product-spacer"></div>
      <AlertDialog open={openModal} onOpenChange={setOpenModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Evidence</AlertDialogTitle>
            <PDFViewer filePath={item.certification}></PDFViewer>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleNoClick}>Close</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProductHalal;

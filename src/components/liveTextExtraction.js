import React, { useRef, useEffect, useState } from "react";
import Webcam from "react-webcam";
import Tesseract from "tesseract.js";

const LiveTextExtractionBackCamera = () => {
  const webcamRef = useRef(null);
  const [text, setText] = useState("");
  const [processing, setProcessing] = useState(false);

  const videoConstraints = {
    facingMode: { exact: "environment" }, // Switch to back camera
  };

  const captureFrameForOCR = () => {
    if (webcamRef.current && !processing) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        setProcessing(true);
        Tesseract.recognize(imageSrc, "eng", {
          logger: (m) => console.log(m.progress), // Optional: log progress
        })
          .then(({ data: { text } }) => {
            setText(text);
            setProcessing(false);
          })
          .catch((error) => {
            console.error(error);
            setProcessing(false);
          });
      }
    }
  };

  useEffect(() => {
    // Set an interval to capture and process frames every 3 seconds
    const intervalId = setInterval(() => {
      captureFrameForOCR();
    }, 3000); // Adjust interval based on performance needs

    return () => clearInterval(intervalId); // Clean up interval on unmount
  }, []);

  return (
    <div style={{ width: "50%" }}>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={videoConstraints} // Set the back camera
      />
      <p>Extracted Text: {text}</p>
      {processing && <p>Processing...</p>}
    </div>
  );
};

export default LiveTextExtractionBackCamera;

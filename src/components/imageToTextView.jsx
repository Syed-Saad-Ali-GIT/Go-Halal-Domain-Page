import React, { useEffect, useRef, useState } from "react";
import Tesseract from "tesseract.js";

const LiveVideoOCR = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [recognizedText, setRecognizedText] = useState("");

  useEffect(() => {
    const startVideo = async () => {
      if (videoRef.current.srcObject) return; // Prevent reloading if already streaming

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      } catch (error) {
        console.error("Error accessing the camera: ", error);
      }
    };

    startVideo();
  }, []);

  const processVideo = async () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    // Capture a frame from the video
    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    // Get image data for processing
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

    // Convert to grayscale (optional)
    const grayImage = convertToGrayscale(imageData);
    context.putImageData(grayImage, 0, 0);

    const imageBlob = await new Promise((resolve) => {
      canvas.toBlob(resolve, "image/png");
    });

    // Perform OCR on the captured frame
    try {
      const {
        data: { text },
      } = await Tesseract.recognize(imageBlob, "eng", {
        logger: (info) => console.log(info),
        tessedit_char_whitelist:
          "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", // Restrict characters for improved accuracy
        psm: 6, // Assuming a uniform block of text
      });
      setRecognizedText(text);
    } catch (error) {
      console.error("Error recognizing text: ", error);
    }
  };

  const convertToGrayscale = (imageData) => {
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
      data[i] = avg; // Red
      data[i + 1] = avg; // Green
      data[i + 2] = avg; // Blue
    }
    return imageData;
  };

  useEffect(() => {
    const intervalId = setInterval(processVideo, 5000); // Process every 5 seconds
    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  return (
    <div>
      <video ref={videoRef} width="640" height="480" autoPlay />
      <canvas ref={canvasRef} width="640" height="480" style={{ display: "none" }} />
      <pre>{recognizedText}</pre>
    </div>
  );
};

export default LiveVideoOCR;

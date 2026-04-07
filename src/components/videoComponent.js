import React from "react";
import "../App.css";
import videoPromo from "./../assets/media/web.mp4";

const VideoComponent = () => {
  return (
    <div className="video-container">
      <video
        src={videoPromo} // Replace with your video URL
        autoPlay
        loop
        muted
        playsInline
      />
    </div>
  );
};

export default VideoComponent;

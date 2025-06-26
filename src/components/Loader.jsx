import React from "react";
import "../Styles/loader.css"; // Create this CSS file for neon/spinner styles


const Loader = ({ message = "Loading..." }) => (
  <div className="center-flex">
    <div className="neon-loader-container">
      <div className="neon-spinner"></div>
      <div className="neon-loader-text">{message}</div>
    </div>
  </div>
);


export default Loader;
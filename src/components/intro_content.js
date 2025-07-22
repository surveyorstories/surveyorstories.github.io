import React from "react";
import DownloadButton from "./DownloadButton";
import DynamicDownloadButton from "./DynamicDownloadButton";
import DocumentationButton from "./DocumentationButton";
import "../css/home.css"; // Import the CSS file

const WelcomeBlock = () => {
  const imageUrls = ["img/ppm.svg"];

  return (
    <div className="welcomeblock-container" id="welcomeblock">
      <div className="left-column" id="left-column">
        {imageUrls.map((imageUrl, index) => (
          <img
            key={index}
            src={imageUrl}
            alt={`Image ${index + 1}`}
            className="column-image"
          />
        ))}
      </div>
      <div className="right-column" id="right-column">
        <div>
          <h1>Gruhanaksha</h1>
          <p>

            Gruhanaksha is a QGIS plugin developed specifically to support the deliverables of the SVAMITVA (Survey of Villages and Mapping with Improvised Technology in Village Areas) scheme. It is designed to assist SVAMITVA team and GIS professionals in efficiently handling cadastral mapping tasks and generating standardized outputs required under the program.


          </p>
          {/* Buttons below the paragraph */}
          <div className="buttons-container">
            <DynamicDownloadButton />
            <DocumentationButton />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeBlock;

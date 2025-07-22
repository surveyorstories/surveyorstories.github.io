import React, { useEffect, useState } from "react";
import axios from "axios"; // You may need to install axios: npm install axios

const DynamicDownloadButton = () => {
  const [downloadLink, setDownloadLink] = useState("");
  const [latestRelease, setLatestRelease] = useState(null); // Store latest release name and version
  const [oldReleases, setOldReleases] = useState([]); // Store old releases
  const [loading, setLoading] = useState(true); // Track loading state
  const [error, setError] = useState(null); // Track error state

  useEffect(() => {
    // Fetch all releases from GitHub
    axios
      .get("https://api.github.com/repos/lokeshmetta/gruhanaksha/releases")
      .then((response) => {
        const releases = response.data;
        const latest = releases[0]; // First release is the latest one
        const latestAsset = latest.assets[0]; // Assuming the first asset is the one you want
        if (latestAsset) {
          setDownloadLink(latestAsset.browser_download_url);
          setLatestRelease({
            name: latest.name,
            version: latest.tag_name, // Version is typically the `tag_name`
          });
        }

        // Exclude the latest release and get the next 3 releases
        const oldReleaseLinks = releases.slice(1, 3).map((release) => ({
          name: release.name,
          url: release.assets[0].browser_download_url,
        }));
        setOldReleases(oldReleaseLinks);
        setLoading(false); // Stop loading when data is fetched
      })
      .catch((error) => {
        setError("Error fetching release data.");
        setLoading(false); // Stop loading on error
        console.error("Error fetching release data:", error);
      });
  }, []);

  return (
    <>
      <button className="download-button" role="button" aria-label="Download button">
        Download
        <div className="dropdown-content">
          {loading ? (
            <p>Loading...</p> // Display loading message or spinner
          ) : error ? (
            <p>{error}</p> // Display error message
          ) : (
            <>
              {latestRelease && (
                <a aria-label="Latest Release" href={downloadLink} download>
                  Latest: {latestRelease.name}
                  {/* ({latestRelease.version}) */}
                </a>
              )}
            </>
          )}

          <div>
            <p>Old Releases</p>
            {oldReleases.length > 0 ? (
              oldReleases.map((release, index) => (
                <a key={index} href={release.url} download>
                  {release.name}
                </a>
              ))
            ) : (
              <p>No old releases available.</p>
            )}
          </div>

          <a href="https://github.com/lokeshmetta/gruhanaksha/releases" target="_blank" rel="noopener noreferrer">
            All Releases
          </a>
        </div>
      </button>
    </>
  );
};

export default DynamicDownloadButton;

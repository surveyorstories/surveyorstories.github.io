import React, { useEffect, useState } from "react";
import axios from "axios";
import "./PdfToDxfDownloadButton.css";

const PdfToDxfDownloadButton = () => {
    const [downloadLink, setDownloadLink] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios
            .get("https://api.github.com/repos/surveyorstories/pdfextract/releases/latest")
            .then((response) => {
                const latest = response.data;
                const latestAsset = latest.assets[0];
                if (latestAsset) {
                    setDownloadLink(latestAsset.browser_download_url);
                }
                setLoading(false);
            })
            .catch((error) => {
                setError("Error fetching release data.");
                setLoading(false);
                console.error("Error fetching release data:", error);
            });
    }, []);

    return (
        <>
            {loading && (
                <button className="modern-btn disabled" disabled>Loading...</button>
            )}

            {error && (
                <button className="modern-btn disabled" disabled>Error loading</button>
            )}

            {!loading && !error && (
                <a href={downloadLink} download style={{ textDecoration: "none" }}>
                    <button className="modern-btn">
                        ⬇️ Download
                    </button>
                </a>
            )}
        </>
    );
};

export default PdfToDxfDownloadButton;

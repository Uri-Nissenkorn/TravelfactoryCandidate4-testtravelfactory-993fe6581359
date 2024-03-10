import React, { useState, useEffect } from "react";
import { api } from "../api_var";

function MyApps() {
  const [applications, setApplications] = useState([]);
  const [newAppName, setNewAppName] = useState("");

  // Fetch applications on component mount
  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    const response = await fetch(api + "/api/Translations/applications");
    const data = await response.json();
    console.log(data);
    setApplications(data);
  };

  const handleDownload = async (appName) => {
    const response = await fetch(
      `${api}/api/Translations/downloadTranslations/${appName}`
    );
    if (response.ok) {
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.setAttribute("download", `${appName}_translations.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } else {
      console.error("Failed to download translations.");
    }
  };

  const handleDeploy = async (appName) => {
    const response = await fetch(`${api}/api/Translations/deploy/${appName}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // body: JSON.stringify(translations),
    });
    if (response.ok) {
      alert("Translations deployed successfully.");
    } else {
      // Handle error response
      alert("Failed to deploy translations.");
    }
  };

  const handleAddApplication = async () => {
    if (!newAppName.trim()) return;
    const response = await fetch("/api/Translations/addApplication", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newAppName),
    });
    if (response.ok) {
      fetchApplications(); // Refresh the list of applications
      setNewAppName(""); // Reset the input field
    }
  };

  return (
    <div className="container mt-5">
      <h2>My Applications</h2>
      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="New Application Name"
          value={newAppName}
          onChange={(e) => setNewAppName(e.target.value)}
        />
        <button
          className="btn btn-outline-secondary"
          type="button"
          onClick={handleAddApplication}
        >
          Add Application
        </button>
      </div>
      <ul className="list-group">
        {applications.map((appName) => (
          <li
            key={appName}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            {appName}
            <div>
              <button
                className="btn btn-primary me-2"
                onClick={() => handleDownload(appName)}
              >
                Download
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => handleDeploy(appName)}
              >
                Deploy
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MyApps;

import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import MyApps from "./pages/myapps";
import AppDetails from "./pages/appdetails"; // Component for app details
import { api } from "./api_var";
import "bootstrap/dist/css/bootstrap.min.css"; // Ensure Bootstrap CSS is imported

function Sidebar({ applications }) {
  return (
    <div
      className="d-flex flex-column flex-shrink-0 p-3 bg-light"
      style={{ width: "280px" }}
    >
      <ul className="nav nav-pills flex-column mb-auto">
        <li>
          <Link to="/myapps" className="nav-link link-dark">
            My Apps
          </Link>
        </li>
        {applications.map((app) => (
          <li key={app}>
            <Link to={`/app/${app}`} className="nav-link link-dark">
              {app}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function App() {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const fetchApplications = async () => {
      const response = await fetch(`${api}/api/Translations/applications`);
      const data = await response.json();
      setApplications(data);
    };

    fetchApplications();
  }, []);

  return (
    <Router>
      <div className="container-fluid">
        <h1>Translations</h1>
        <div className="row">
          <div className="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse">
            <Sidebar applications={applications} />
          </div>
          <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
            <Routes>
              <Route path="/myapps" element={<MyApps />} />
              <Route path="/app/:appName" element={<AppDetails />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

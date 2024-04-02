import React, { useState } from "react";
import Db from "./Db";
import Received from "./Received";
import Sent from "./Sent";
import Company from "./Company";
const CustomNavbar = () => {
  const [mode, setMode] = useState("Dashboard");

  const handleDashboardClick = () => {
    setMode("Dashboard");
  };
  const handleReceivedClick = () => {
    setMode("Received");
  };
  const handleSentClick = () => {
    setMode("Sent");
  };
  const handleCompanyClick = () => {
    setMode("Company");
  };

  return (
    <div className="navbuttons" style={{ height: "80%" }}>
      <div className="navbut">
        {mode === "Dashboard" ? (
          <button
            style={{ backgroundColor: "white", color: "#3b71ca" }}
            onClick={handleDashboardClick}
          >
            Dashboard
          </button>
        ) : (
          <button onClick={handleDashboardClick}>Dashboard</button>
        )}
        {mode === "Received" ? (
          <button
            style={{ backgroundColor: "white", color: "#3b71ca" }}
            onClick={handleReceivedClick}
          >
            Received
          </button>
        ) : (
          <button onClick={handleReceivedClick}>Received</button>
        )}
        {mode === "Sent" ? (
          <button
            style={{ backgroundColor: "white", color: "#3b71ca" }}
            onClick={handleSentClick}
          >
            Sent
          </button>
        ) : (
          <button onClick={handleSentClick}>Sent</button>
        )}
        {mode === "Company" ? (
          <button
            style={{ backgroundColor: "white", color: "#3b71ca" }}
            onClick={handleCompanyClick}
          >
            Company
          </button>
        ) : (
          <button onClick={handleCompanyClick}>Company</button>
        )}
      </div>
      <hr style={{ color: "white" }} />
      {mode === "Dashboard" && <Db />}
      {mode === "Received" && <Received />}
      {mode === "Sent" && <Sent />}
      {mode === "Company" && <Company />}
    </div>
  );
};

export default CustomNavbar;

import React from "react";

function Navbar({ activeTab, setActiveTab }) {
  const navStyle = {
    padding: "10px",
    background: "#333",
    color: "#fff",
    display: "flex",
    justifyContent: "space-around",
    marginBottom: "20px"
  };

  const linkStyle = (tab) => ({
    color: activeTab === tab ? "#ffd700" : "#fff",
    textDecoration: "none",
    fontSize: "18px",
    cursor: "pointer"
  });

  return (
    <nav style={navStyle}>
      <span style={linkStyle("anomalies")} onClick={() => setActiveTab("anomalies")}>
        Anomalies
      </span>
      <span style={linkStyle("dashboard")} onClick={() => setActiveTab("dashboard")}>
        Dashboard
      </span>
    </nav>
  );
}

export default Navbar;

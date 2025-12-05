// patitent.jsx
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { usePrivy } from "@privy-io/react-auth";
import "./PatientDashboard.css";

const PatientModule = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const fullName = location.state?.fullName || "Patient";

  // Privy hooks
  const { login, logout, ready, authenticated, user } = usePrivy();

  // Local states
  const [records, setRecords] = useState([]);
  const [fileName, setFileName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const handleAppLogout = async () => {
    try {
      if (authenticated) {
        await logout();
      }
    } finally {
      navigate("/login");
    }
  };

  const walletAddress =
    user?.wallet?.address ||
    user?.linkedAccounts?.find((a) => a.type === "wallet")?.address ||
    user?.google?.email ||
    "";

  // Directly open Privy modal
  const handleWalletConnect = async () => {
    try {
      await login(); // opens Privy's official modal
    } catch (err) {
      console.error("Wallet connection error:", err);
      alert("Failed to open wallet connect. Check console.");
    }
  };

  // Handle file upload
  const handleFileUpload = () => {
    if (!fileName || !selectedFile) {
      alert("Please enter a file name and select a file");
      return;
    }
    
    const today = new Date();
    const date = today.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    
    // Create a URL for the file to view later
    const fileUrl = URL.createObjectURL(selectedFile);
    
    setRecords((prev) => [...prev, { 
      name: fileName, 
      date, 
      access: fullName,
      fileUrl,
      fileType: selectedFile.type
    }]);
    
    setFileName("");
    setSelectedFile(null);
    // Reset file input
    const fileInput = document.getElementById("file-input");
    if (fileInput) fileInput.value = "";
    
    alert("File uploaded successfully!");
  };

  // Handle file view
  const handleViewFile = (record) => {
    if (record.fileUrl) {
      window.open(record.fileUrl, "_blank");
    }
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo" style={{ textAlign: "center", marginBottom: "20px" }}>
          <h2
            style={{
              color: "#2563eb",
              fontWeight: 700,
              fontSize: "2rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            <span role="img" aria-label="heart">💙</span>{" "}
            <span style={{ color: "#2563eb" }}>VitalX</span>
          </h2>
        </div>

        <nav>
          <button className="active" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            🏠 Dashboard
          </button>
          <button
            onClick={() =>
              document.getElementById("upload-card")?.scrollIntoView({ behavior: "smooth" })
            }
          >
            📤 Upload
          </button>
          <button
            onClick={() =>
              document.getElementById("records-section")?.scrollIntoView({ behavior: "smooth" })
            }
          >
            📑 My Records
          </button>
        </nav>

        <button 
          className="connect-wallet-btn" 
          onClick={logout}
          disabled={!authenticated}
          style={{ 
            width: "90%", 
            margin: "10px auto 5px auto",
            opacity: !authenticated ? 0.5 : 1,
            cursor: !authenticated ? "not-allowed" : "pointer",
            color: "black"
          }}
        >
          Disconnect Wallet
        </button>

        <button className="logout-btn" onClick={handleAppLogout} style={{ margin: "0 auto 10px auto", width: "90%" }}>
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <div className="content-wrap">
        <div className="header">
          <h1 style={{ fontSize: "2.5rem", fontWeight: "bold" }}>
            Welcome Back, <span style={{ fontWeight: "bold" }}>{fullName}</span> 👋
          </h1>

          {/* Wallet connect status/actions */}
          <div className="wallet-controls">
            <button
              className="connect-wallet-btn"
              disabled={!ready || authenticated}
              onClick={handleWalletConnect}
              title={!ready ? "Loading wallet provider..." : "Click to connect wallet"}
              style={{ minWidth: 180 }}
            >
              {!ready
                ? "Loading..."
                : authenticated
                ? "Wallet Connected ✅"
                : "Connect Wallet"}
            </button>
          </div>
        </div>

        {/* Upload Section */}
        <div className="card-grid">
          <div
            className="card large-card"
            id="upload-card"
            style={{ width: "950px", height: "410px", padding: "55px", margin: "60px auto 20px auto" }}
          >
            <h3>Upload Health Record</h3>
            <input
              type="text"
              placeholder="Enter file name"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              style={{ marginBottom: "25px", padding: "15px" }}
            />
            <input 
              id="file-input"
              type="file" 
              onChange={(e) => setSelectedFile(e.target.files[0])}
              style={{ marginBottom: "25px", padding: "15px" }} 
            />
            <button
              className="action-btn"
              onClick={handleFileUpload}
              disabled={!authenticated}
            >
              Upload to IPFS
            </button>
            
          </div>
        </div>

        {/* Records Section */}
        <div
          className="records-section"
          id="records-section"
          style={{ margin: "0 auto", minWidth: "350px", padding: "40px" }}
        >
          <h3>Your Records</h3>
          <table className="records-table">
            <thead>
              <tr>
                <th>File Name</th>
                <th>Date</th>
                <th>Access</th>
              </tr>
            </thead>
            <tbody>
              {records.length === 0 ? (
                <tr>
                  <td colSpan={3} style={{ textAlign: "center" }}>
                    No records uploaded yet.
                  </td>
                </tr>
              ) : (
                records.map((rec, i) => (
                  <tr key={i}>
                    <td 
                      onClick={() => handleViewFile(rec)}
                      style={{ cursor: "pointer", color: "#2563eb", textDecoration: "underline" }}
                      title="Click to view file"
                    >
                      {rec.name}
                    </td>
                    <td>{rec.date}</td>
                    <td>{rec.access}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        </div>
      </main>
    </div>
  );
};

export default PatientModule;

// patient.jsx WITH PINATA + SUPABASE PERSISTENCE  
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { usePrivy } from "@privy-io/react-auth";
import { Copy } from "lucide-react";
import { uploadToPinata } from "./pinataUpload";
import { supabase } from "./supabaseClient";
import "./PatientDashboard.css";

const PatientModule = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const fullName = location.state?.fullName || "Patient";

  const { login, logout, ready, authenticated, user, exportWallet } = usePrivy();

  const [records, setRecords] = useState([]);
  const [fileName, setFileName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [copied, setCopied] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [exportConfirm, setExportConfirm] = useState(false);

  const walletAddress = user?.wallet?.address || "";
  const shortAddress =
    walletAddress ? walletAddress.slice(0, 6) + "..." + walletAddress.slice(-4) : "";

  // ⭐ FETCH USER RECORDS WHEN PAGE LOADS
  useEffect(() => {
    if (!walletAddress) return;

    const fetchRecords = async () => {
      const { data, error } = await supabase
        .from("Records")
        .select("*")
        .eq("user_id", walletAddress)
        .order("id", { ascending: false });

      if (error) {
        console.error("Fetch error:", error);
      } else {
        setRecords(data);
      }
    };

    fetchRecords();
  }, [walletAddress]);

  const handleAppLogout = async () => {
    try {
      if (authenticated) await logout();
    } finally {
      navigate("/login");
    }
  };

  const handleWalletConnect = async () => {
    try {
      await login();
    } catch (err) {
      console.error("Wallet connection error:", err);
    }
  };

  const handleExport = async (e) => {
    e.stopPropagation();
    if (!exportConfirm) return setExportConfirm(true);

    try {
      await exportWallet();
      alert("Private key export started.");
    } catch (err) {
      alert("Failed to export private key.");
    }
    setExportConfirm(false);
  };

  // ⭐ UPLOAD TO PINATA + SAVE IN SUPABASE
  const handleFileUpload = async () => {
    if (!fileName || !selectedFile)
      return alert("Enter filename & choose a file first.");

    try {
      const cid = await uploadToPinata(selectedFile);
      const fileUrl = `https://gateway.pinata.cloud/ipfs/${cid}`;

      const today = new Date();
      const date = today.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });

      const newRecord = {
        user_id: walletAddress,
        file_name: fileName,
        file_url: fileUrl,
        file_cid: cid,
        file_type: selectedFile.type,
        access: fullName,
        date: date, // ⭐ NOW SAVED!
      };

      const { error } = await supabase.from("Records").insert(newRecord);

      if (error) {
        console.error("Supabase insert error:", error);
        alert("Failed to save in database.");
        return;
      }

      // Add to UI instantly
      setRecords((prev) => [newRecord, ...prev]);

      alert("File uploaded successfully!");

      setFileName("");
      setSelectedFile(null);
      document.getElementById("file-input").value = "";
    } catch (err) {
      console.error("Pinata upload failed:", err);
      alert("Upload failed.");
    }
  };

  const handleViewFile = (record) => {
    if (record.file_url) window.open(record.file_url, "_blank");
  };

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="logo">
          <h2 style={{ color: "#2563eb", fontWeight: 700 }}>
            💙 VitalX
          </h2>
        </div>

        <nav>
          <button className="active">🏠 Dashboard</button>
          <button onClick={() => document.getElementById("upload-card")?.scrollIntoView()}>
            📤 Upload
          </button>
          <button onClick={() => document.getElementById("records-section")?.scrollIntoView()}>
            📑 My Records
          </button>
        </nav>

        <button className="logout-btn" onClick={handleAppLogout}>
          Logout
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content">
        <div className="content-wrap">
          <div className="header">
            <h1>
              Welcome Back, <span>{fullName}</span> 👋
            </h1>

            {/* WALLET SECTION */}
            <div className="wallet-wrapper">
              {!authenticated ? (
                <button
                  className="connect-wallet-btn"
                  disabled={!ready}
                  onClick={handleWalletConnect}
                >
                  {ready ? "Connect Wallet" : "Loading..."}
                </button>
              ) : (
                <div
                  className="wallet-address-box"
                  onClick={() => {
                    setDropdownOpen((prev) => !prev);
                    setExportConfirm(false);
                  }}
                >
                  <div className="wallet-address-row">
                    <span className="wallet-address-text">{shortAddress}</span>
                    <Copy
                      size={18}
                      className="copy-icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigator.clipboard.writeText(walletAddress);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 1200);
                      }}
                    />
                  </div>

                  {copied && <div className="copy-popup">Copied!</div>}

                  {dropdownOpen && (
                    <div
                      className="wallet-dropdown"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button className="disconnect-btn" onClick={handleExport}>
                        {exportConfirm ? "Confirm Export Key" : "Export Private Key"}
                      </button>

                      <button
                        className="disconnect-btn"
                        style={{ color: "#ff5252" }}
                        onClick={async () => {
                          setDropdownOpen(false);
                          await logout();
                        }}
                      >
                        Disconnect Wallet
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* UPLOAD CARD */}
          <div className="card-grid">
            <div className="card large-card" id="upload-card">
              <h3>Upload Health Record</h3>

              <input
                type="text"
                placeholder="Enter file name"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
              />

              <input
                type="file"
                id="file-input"
                onChange={(e) => setSelectedFile(e.target.files[0])}
              />

              <button className="action-btn" disabled={!authenticated} onClick={handleFileUpload}>
                Upload to IPFS
              </button>
            </div>
          </div>

          {/* RECORDS TABLE */}
          <div className="records-section" id="records-section">
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
                      No records yet.
                    </td>
                  </tr>
                ) : (
                  records.map((rec, index) => (
                    <tr key={index}>
                      <td
                        onClick={() => handleViewFile(rec)}
                        style={{ cursor: "pointer", color: "#2563eb", textDecoration: "underline" }}
                      >
                        {rec.file_name}
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

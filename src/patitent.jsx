import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { usePrivy } from "@privy-io/react-auth";
import { Copy } from "lucide-react";
import { ethers } from "ethers";
import { uploadToPinata } from "./pinataUpload";
import { supabase } from "./supabaseClient";
import contractABI from "./VitalXRecordStorageABI.json";
import { CONTRACT_ADDRESS } from "./contract";
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

  /* ================= FETCH RECORDS ================= */
  useEffect(() => {
    if (!walletAddress) return;

    const fetchRecords = async () => {
      const { data, error } = await supabase
        .from("Records")
        .select("*")
        .eq("user_id", walletAddress)
        .order("id", { ascending: false });

      if (error) console.error("Fetch error:", error);
      else setRecords(data);
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
    } catch {
      alert("Failed to export private key.");
    }
    setExportConfirm(false);
  };

  /*UPLOAD FLOW
     1. Upload to Pinata
     2. Save to Supabase
     3. Store CID on Blockchain*/

  const handleFileUpload = async () => {
    if (!fileName || !selectedFile)
      return alert("Enter filename & choose a file first.");

    try {
      /* 1️⃣ Upload to Pinata */
      const cid = await uploadToPinata(selectedFile);
      const fileUrl = `https://gateway.pinata.cloud/ipfs/${cid}`;

      /* 2️⃣ Save in Supabase */
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
        date,
      };

      const { error } = await supabase.from("Records").insert(newRecord);
      if (error) {
        console.error("Supabase insert error:", error);
        return alert("Failed to save in database.");
      }

      /* 3️⃣ Store CID on Blockchain */
      if (!window.ethereum) {
        alert("MetaMask not found");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        contractABI,
        signer
      );

      const tx = await contract.uploadRecord(cid, fileName);
      await tx.wait();

      /* UI Update */
      setRecords((prev) => [newRecord, ...prev]);
      alert("File uploaded & recorded on blockchain!");

      setFileName("");
      setSelectedFile(null);
      document.getElementById("file-input").value = "";

    } catch (err) {
      console.error("Upload failed:", err);
      alert("Upload failed. Check console.");
    }
  };

  const handleViewFile = (record) => {
    if (record.file_url) window.open(record.file_url, "_blank");
  };

  /* ================= UI ================= */
  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <h2 style={{ color: "#2563eb", fontWeight: 700 }}>💙 VitalX</h2>

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

      <main className="main-content">
        <div className="content-wrap">
          <div className="header">
            <h1 id="welc-msg">
              Welcome Back, <span>{fullName}</span> 👋
            </h1>

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

                  {dropdownOpen && (
                    <div className="wallet-dropdown">
                      <button onClick={handleExport}>
                        {exportConfirm ? "Confirm Export Key" : "Export Private Key"}
                      </button>
                      <button
                        style={{ color: "#ff5252" }}
                        onClick={async () => await logout()}
                      >
                        Disconnect Wallet
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Upload */}
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

            <button className="action-btn" id="upload-ipfs" disabled={!authenticated} onClick={handleFileUpload}>
              Upload to IPFS
            </button>
          </div>

          {/* Records */}
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
                  records.map((rec, i) => (
                    <tr key={i}>
                      <td
                        onClick={() => handleViewFile(rec)}
                        style={{ cursor: "pointer", color: "#2563eb" }}
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

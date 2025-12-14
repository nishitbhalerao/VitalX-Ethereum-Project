import React, { useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
//import walletConnectLogo from "./assets/walletLogo.png";
import "./App.css";

function App() {
  const { login, logout, ready, authenticated, user, exportWallet } = usePrivy();
  const [exportConfirm, setExportConfirm] = useState(false);

  if (!ready) {
    return (
      <div className="app-root">
        <h1>VitalX</h1>
        <div className="loading">Loading wallet provider...</div>
      </div>
    );
  }

  const handleExport = async () => {
    // small confirm step
    if (!exportConfirm) {
      setExportConfirm(true);
      return;
    }
    try {
      await exportWallet();
      setExportConfirm(false);
      alert("Export triggered. Check the console or handler from Privy.");
    } catch (err) {
      console.error("Export failed:", err);
      alert("Failed to export wallet. Check console for details.");
    }
  };

  return (
    <div className="app-root">
      <header className="header">
        <h1 className="brand">VitalX</h1>

        {/* Wallet connect status/actions */}
        <div className="status-actions">
          <button
            className="connect-wallet-btn"
            disabled={!ready}
            onClick={() => {
              // If not authenticated, trigger login flow.
              if (!authenticated) login();
            }}
            title={!ready ? "Provider not ready" : authenticated ? "Wallet connected" : "Click to connect wallet"}
          >
            {!ready ? "Loading..." : authenticated ? "Wallet Connected ✅" : "Connect Wallet"}
          </button>
        </div>
      </header>

      <main className="main-content">
        <div className="card">
          <h4>OR</h4>

          {authenticated ? (
            <>
              <p className="welcomemsg">
                Welcome
                <br />
                <br />
                Wallet Address: <span className="address">{user?.wallet?.address || user?.google?.email}</span>
              </p>

              <div className="action-row">
                <button className="logoutButton" onClick={() => logout()}>
                  Logout
                </button>

                <button
                  className="exportButton"
                  onClick={handleExport}
                  title={exportConfirm ? "Click again to confirm export" : "Export private key (confirm)"}
                >
                  {exportConfirm ? "Confirm Export Private Key" : "Export Private Key"}
                </button>
              </div>
            </>
          ) : (
            <div className="wallet-option">
              <button
                className="walletbutton"
                onClick={() => {
                  // show the same login flow that the status button triggers
                  login();
                }}
              >
                <img
                  src={walletConnectLogo}
                  alt="Wallet Connect Logo"
                  className="wallet-logo"
                />
                Wallet Connect
              </button>

              <p className="hint">Click the button above to open your wallet/connect options.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
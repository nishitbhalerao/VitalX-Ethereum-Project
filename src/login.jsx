import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./login.css";

const LoginPage = () => {
  const navigate = useNavigate();
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  // Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!emailOrPhone) {
      setOtpError("Please enter your email address.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailOrPhone }),
      });

      const data = await res.json();

      if (data.success) {
        setOtpError("");
        setOtpSent(true);
        alert("✅ OTP sent to your email successfully!");
      } else {
        setOtpError("Failed to send OTP. Try again.");
      }
    } catch (err) {
      console.error(err);
      setOtpError("Server error. Please try again later.");
    }
  };

  // Validate OTP
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailOrPhone, otp }),
      });
      const data = await res.json();

      if (data.valid) {
        alert("✅ Login successful!");
        setOtpError("");
        const nameSource = emailOrPhone || "Patient";
        const displayName = nameSource.includes("@")
          ? nameSource
              .split("@")[0]
              .replace(/[._-]+/g, " ")
              .replace(/\b\w/g, (c) => c.toUpperCase())
          : nameSource.replace(/\b\w/g, (c) => c.toUpperCase());
        navigate("/patient", { state: { fullName: displayName } });
      } else {
        setOtpError("Invalid OTP. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setOtpError("Server error. Try again later.");
    }
  };

  return (
    <>
      <div className="login-container">
        <div className="login-card">
          {/* ===== Left Section ===== */}
          <div className="left-section">
            <h1 className="logo">💙 VitalX</h1>
            <h2>Your Health. Your Data. Your Control.</h2>
            <div className="info-points">
              <p>🔒 Secured health records</p>
              <p>✅ Doctor verified prescriptions</p>
              <p>🕒 Access anytime, anywhere</p>
            </div>
          </div>

          {/* ===== Right Section ===== */}
          <div className="right-section">
            <h3 className="login-title" style={{ marginBottom: "30px", textAlign: "left", fontWeight: "bold", paddingLeft: "10px" }}>Login</h3>

            <form className="login-form" onSubmit={handleLogin}>
              <label style={{ textAlign: "left", display: "block" }}>Email Address</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                style={{ textAlign: "left" }}
              />

              {/* Important: prevent form submit on Send OTP */}
              <button className="send-otp-btn" type="button" onClick={handleSendOtp}>
                Send OTP
              </button>

              {otpSent && (
                <>
                  <label style={{ textAlign: "left", display: "block" }}>Enter OTP</label>
                  <input
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    style={{ textAlign: "left" }}
                  />

                  <button className="login-btn" type="submit">
                    Log in
                  </button>
                </>
              )}

              {otpError && <div className="error-msg" style={{ textAlign: "left" }}>{otpError}</div>}

              <p className="signup-text">
                Don’t have an account? <Link to="/signup">Sign Up</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./login.css";

const LoginPage = () => {
  const navigate = useNavigate();
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  // ===== SEND OTP =====
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setOtpError("");

    if (!emailOrPhone) {
      setOtpError("Please enter your email address.");
      return;
    }

    try {
      // 1️⃣ CHECK USER EXISTS FIRST
      const checkRes = await fetch("http://localhost:5000/check-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailOrPhone }),
      });

      const checkData = await checkRes.json();

      if (!checkData.exists) {
        setOtpError("Account does not exist. Please sign up first.");
        return;
      }

      // 2️⃣ SEND OTP
      const res = await fetch("http://localhost:5000/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailOrPhone }),
      });

      const data = await res.json();

      if (data.success) {
        setOtpSent(true);
        setOtpError("");
        alert("✅ OTP sent to your email successfully!");
      } else {
        setOtpError("Failed to send OTP. Try again.");
      }
    } catch (err) {
      console.error(err);
      setOtpError("Server error. Please try again later.");
    }
  };

  // ===== VERIFY OTP / LOGIN =====
  const handleLogin = async (e) => {
    e.preventDefault();
    setOtpError("");

    try {
      const res = await fetch("http://localhost:5000/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailOrPhone, otp }),
      });

      const data = await res.json();

      if (data.valid) {
        // ⭐ 1️⃣ FETCH USER'S REAL NAME FROM SUPABASE
        const userRes = await fetch("http://localhost:5000/get-user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: emailOrPhone }),
        });

        const userData = await userRes.json();

        // ⭐ 2️⃣ USE THEIR ACTUAL SIGNED-UP FULL NAME
        const displayName = userData.full_name || "User";

        alert("✅ Login successful!");

        // ⭐ 3️⃣ REDIRECT WITH REAL NAME
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

          {/* LEFT SECTION */}
          <div className="left-section">
            <h1 className="logo">💙 VitalX</h1>
            <h2>Your Health. Your Data. Your Control.</h2>
            <div className="info-points">
              <p>🔒 Secured health records</p>
              <p>✅ Doctor verified prescriptions</p>
              <p>🕒 Access anytime, anywhere</p>
            </div>
          </div>

          {/* RIGHT SECTION */}
          <div className="right-section">
            <h3
              className="login-title"
              style={{
                marginBottom: "30px",
                textAlign: "left",
                fontWeight: "bold",
                paddingLeft: "10px"
              }}
            >
              Login
            </h3>

            <form className="login-form" onSubmit={handleLogin}>
              <label style={{ textAlign: "left", display: "block" }}>
                Email Address
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                style={{ textAlign: "left" }}
              />

              {/* SEND OTP BUTTON */}
              <button
                className="send-otp-btn"
                type="button"
                onClick={handleSendOtp}
              >
                Send OTP
              </button>

              {/* OTP ENTER FIELD */}
              {otpSent && (
                <>
                  <label style={{ textAlign: "left", display: "block" }}>
                    Enter OTP
                  </label>
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

              {otpError && (
                <div className="error-msg" style={{ textAlign: "left" }}>
                  {otpError}
                </div>
              )}

              <p className="signup-text">
                Don’t have an account?{" "}
                <Link to="/signup">Sign Up</Link>
              </p>
            </form>
          </div>

        </div>
      </div>
    </>
  );
};

export default LoginPage;

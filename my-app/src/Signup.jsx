import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SignUpPage.css";

const SignUpPage = () => {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      console.log("🔄 Attempting signup...");
      
      // Use environment variable for API endpoint
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      
      // Use backend server to create user
      const response = await fetch(`${apiUrl}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: fullName,
          email,
          password,
          role: "patient"
        })
      });

      console.log("📡 Response status:", response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("📦 Response data:", result);

      if (!result.success) {
        setError(result.message || "Failed to create account");
        return;
      }

      // Redirect to patient dashboard
      console.log("✅ Signup successful, redirecting...");
      navigate("/patient", { state: { fullName } });
    } catch (err) {
      console.error("❌ Signup error:", err);
      setError(`Failed to connect to server: ${err.message}. Please ensure the server is running.`);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        {/* Left Side */}
        <div className="signup-info">
          <h1 className="logo">💙 VitalX</h1>
          <h2>Your Health. Your Data. Your Control.</h2>
          <ul className="features">
            <li>🔒 Secured health records</li>
            <li>✅ Doctor verified prescriptions</li>
            <li>🌐 Access anytime, anywhere</li>
          </ul>
        </div>

        {/* Right Side - Form */}
        <div className="signup-form">
          <h2>Sign Up</h2>

          {error && <p style={{ color: "red", marginBottom: 10 }}>{error}</p>}

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Full Name"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />

            <input
              type="email"
              placeholder="Email Address"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {/* Password Field */}
            <div style={{ position: "relative", marginBottom: "10px" }}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Create Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingRight: "40px" }}
              />
              <span
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                }}
                onClick={() => setShowPassword((prev) => !prev)}
                title={showPassword ? "Hide" : "Show"}
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </span>
            </div>

            {/* Confirm Password Field */}
            <div style={{ position: "relative", marginBottom: "10px" }}>
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{ paddingRight: "40px" }}
              />
              <span
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                }}
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                title={showConfirmPassword ? "Hide" : "Show"}
              >
                {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
              </span>
            </div>

            <button type="submit" className="create-btn">
              Create Account
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
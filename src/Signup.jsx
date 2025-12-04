
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SignUpPage.css";

const SignUpPage = () => {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would handle signup logic (API call, validation, etc.)
    // On success, redirect to patient module
    navigate("/patient", { state: { fullName } });
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

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Full Name"
              required
              value={fullName}
              onChange={e => setFullName(e.target.value)}
            />
            <input type="email" placeholder="Email Address" required />
            <div style={{ position: 'relative', marginBottom: '10px' }}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Create Password"
                required
                style={{ paddingRight: '40px' }}
              />
              <span
                style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }}
                onClick={() => setShowPassword((prev) => !prev)}
                title={showPassword ? "Hide" : "Show"}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </span>
            </div>
            <div style={{ position: 'relative', marginBottom: '10px' }}>
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                required
                style={{ paddingRight: '40px' }}
              />
              <span
                style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }}
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                title={showConfirmPassword ? "Hide" : "Show"}
              >
                {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
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

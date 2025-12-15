import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Landingpage.css";

const LandingPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const handleGetStarted = () => {
    navigate("/login");
  };

  const handleContactClick = () => {
    document.getElementById("contact").scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Message sent successfully!");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="landing-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">
          <span className="logo-icon">💙</span>
          <span className="logo-text">VitalX</span>
        </div>
        <ul className="nav-links">
          <li><a href="#home">Home</a></li>
          <li><a href="#about">About Us</a></li>
          <li>
            <button className="nav-btn" onClick={handleContactClick}>
              Contact Us
            </button>
          </li>
          <li>
            <button className="getstarted-btn" onClick={handleGetStarted}>
              Get Started
            </button>
          </li>
        </ul>
      </nav>

      {/* Hero Section */}
      <header id="home" className="hero-section" style={{ marginTop: "80px", marginBottom: "100px" }}>
        <div className="hero-content">
          <h1 className="fade-in" style={{ marginBottom: "30px" }}>Empowering You With Secure Health Data</h1>
          <p className="text-slide" style={{ marginBottom: "40px", maxWidth: "600px", margin: "0 auto 40px auto" }}>
            VitalX is your personal gateway to a secure, decentralized health record system.
            Own your medical data with confidence — powered by blockchain and privacy-first tech.
          </p>
          <div className="hero-buttons">
            <button className="primary-btn" onClick={handleGetStarted}>
              🚀 Get Started
            </button>
            &nbsp; &nbsp; &nbsp;&nbsp; &nbsp;
            <button className="secondary-btn" onClick={handleContactClick}>
              Contact Us
            </button>
          </div>
        </div>
      </header>

      {/* About Section */}
      <section id="about" className="about-section" style={{ marginTop: "200px", marginBottom: "200px", padding: "0 20px" }}>
        <h2 className="underline-title" style={{ marginBottom: "40px" }}>About VitalX</h2>
        <div className="about-card" style={{ 
          width: "900px", 
          height: "350px", 
          margin: "0 auto", 
          padding: "60px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center"
        }}>
          <div>
            <p style={{ lineHeight: "1.8", fontSize: "16px", marginBottom: "20px" }}>
              VitalX is a next-gen healthcare record platform leveraging Ethereum and IPFS 
              to give patients ultimate control. Enjoy tamper-proof, transparent, and 
              verifiable medical interactions — all on-chain.
            </p>
            <p style={{ lineHeight: "1.8", fontSize: "16px" }}>
              We aim to revolutionize how health data is managed, making every 
              interaction private, immutable, and user-owned. Your health, your data — 
              always in your control.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form Section (Always Visible) */}
      <section id="contact" className="contact-section" style={{ marginTop: "200px", marginBottom: "50px", padding: "0 20px" }}>
        <h2 className="underline-title" style={{ marginBottom: "40px" }}>Contact Us</h2>
        <form className="contact-form" onSubmit={handleSubmit} style={{ maxWidth: "600px", margin: "0 auto" }}>
          <input
            type="text"
            name="name"
            placeholder="Enter your name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <textarea
            name="message"
            rows="6"
            placeholder="Enter your message"
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            required
          ></textarea>

          <button type="submit" className="primary-btn">Submit</button>

          <p className="contact-email">
            📧If you have any queries reach out to us at:{" "}
            <a href="mailto:2025.vitalx@gmail.com" className="email-link">
              2025.vitalx@gmail.com
            </a>
          </p>
        </form>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>© 2025 VitalX | Decentralized Healthcare Records</p>
        <p>Crafted with ❤ by Team VitalX – SPPU</p>
      </footer>
    </div>
  );
};

export default LandingPage;
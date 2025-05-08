import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import "../styles/Register.scss";
import loginImage from "../images/registerimg.png";
import baseURL from "../baseURL";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const token = new URLSearchParams(location.search).get("token");

  const handlePasswordReset = async (e) => {
    e.preventDefault();

    if (password.length < 8) {
      setError("Parool peab olema vähemalt 8 tähemärki pikk.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Paroolid ei kattu.");
      return;
    }

    if (!token) {
      setError("Vigane lähtestamislink.");
      return;
    }

    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      const response = await fetch(`${baseURL}/accounts/reset-password.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess("Teie parool on edukalt lähtestatud.");
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else {
        setError(data.message || "Parooli lähtestamine ebaõnnestus.");
      }
    } catch (err) {
      console.error("Password reset error:", err);
      setError("Võrgu viga. Palun proovige uuesti.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="background">
        <div className="login-page-container">
          <div className="login-container">
            <h2>Vigane lähtestamislink</h2>
            <div className="error-message">Lähtestamislink on vigane või aegunud.</div>
            <div className="links-container">
              <Link to="/forgot-password" className="login-button">Taotlege uus lähtestamislink</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="background">
      <div className="login-page-container">
        <div className="image-container">
          <img src={loginImage} alt="Trampoline Fitness" className="login-image" />
        </div>
        <div className="login-container">
          <h2>Lähtesta Parool</h2>
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}
          <form onSubmit={handlePasswordReset}>
            <div className="input-group">
              <label>Uus parool *</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Sisestage uus parool"
                />
                <button 
                  type="button"
                  className="password-toggle-icon" 
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex="-1"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  )}
                </button>
              </div>
            </div>
            <div className="input-group">
              <label>Kinnita parool *</label>
              <div className="password-input-wrapper">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="Kinnita uus parool"
                />
                <button 
                  type="button"
                  className="password-toggle-icon" 
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  tabIndex="-1"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button type="submit" className="login-button" disabled={isLoading}>
              {isLoading ? "Lähtestamine..." : "Lähtesta parool"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
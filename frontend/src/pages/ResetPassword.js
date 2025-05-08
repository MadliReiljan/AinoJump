import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import "../styles/Register.scss";
import loginImage from "../images/registerimg.png";
import baseURL from "../baseURL";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Sisestage uus parool"
              />
            </div>
            <div className="input-group">
              <label>Kinnita parool *</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Kinnita uus parool"
              />
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
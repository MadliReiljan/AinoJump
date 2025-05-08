import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Register.scss";
import loginImage from "../images/registerimg.png"; 
import baseURL from "../baseURL";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handlePasswordReset = async (e) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setError("Palun sisestage kehtiv e-posti aadress.");
      return;
    }
    
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      const response = await fetch(`${baseURL}/accounts/forgot_password.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ email: email.trim() })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Parooli uudendamise link on saadetud teie e-posti aadressile.");
        setEmail("");
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

  return (
    <div className="background">
      <div className="login-page-container">
        <div className="image-container">
          <img 
            src={loginImage} 
            alt="Trampoline Fitness" 
            className="login-image" 
          />
        </div>
        <div className="login-container">
          <h2>Unustasin parooli</h2>
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}
          <form onSubmit={handlePasswordReset}>
            <div className="input-group">
              <label>E-post *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Sisestage oma e-posti aadress"
              />
            </div>

            <button type="submit" className="login-button" disabled={isLoading}>
              {isLoading ? "Saadan..." : "Saada lähtestamise link"}
            </button>
            <div className="links-container">
              <div className="register-link">
                <span>Meenus parool? </span>
                <Link to="/login">Logige sisse</Link>
              </div>
              <div className="register-link">
                <span>Pole veel kontot? </span>
                <Link to="/register">Registreeru</Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
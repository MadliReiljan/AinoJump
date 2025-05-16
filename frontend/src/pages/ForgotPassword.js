import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Register.scss";
import loginImage from "../images/registerimg.webp"; 
import baseURL from "../baseURL";
import ModalMessage from "../components/ModalMessage";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [modal, setModal] = useState({ open: false, title: "", message: "", onClose: null });

  const handlePasswordReset = async (e) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setModal({
        open: true,
        title: "Viga",
        message: "Palun sisestage kehtiv e-posti aadress.",
        onClose: () => setModal({ ...modal, open: false })
      });
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
        setModal({
          open: true,
          title: "Õnnestus",
          message: "Parooli uudendamise link on saadetud teie e-posti aadressile.",
          onClose: () => setModal({ ...modal, open: false })
        });
        setSuccess("Parooli uudendamise link on saadetud teie e-posti aadressile.");
        setEmail("");
      } else {
        setModal({
          open: true,
          title: "Viga",
          message: data.message || "Parooli lähtestamine ebaõnnestus.",
          onClose: () => setModal({ ...modal, open: false })
        });
        setError(data.message || "Parooli lähtestamine ebaõnnestus.");
      }
    } catch (err) {
      console.error("Password reset error:", err);
      setModal({
        open: true,
        title: "Võrgu viga",
        message: "Võrgu viga. Palun proovige uuesti.",
        onClose: () => setModal({ ...modal, open: false })
      });
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
          {modal.open && (
            <ModalMessage
              open={modal.open}
              title={modal.title}
              message={modal.message}
              onClose={modal.onClose}
            />
          )}
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
              {isLoading ? "Saadan..." : success ? "Saada uuesti" : "Saada lähtestamise link"}
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
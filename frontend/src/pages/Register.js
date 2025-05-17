import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Register.scss";
import loginImage from "../images/registerimg.webp"; 
import baseURL from "../baseURL";
import ModalMessage from "../components/ModalMessage";

const Register = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [modal, setModal] = useState({ open: false, title: '', message: '', onClose: null });
  const navigate = useNavigate();

  const capitalizeWords = (str) => {
    return str
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setModal({
        open: true,
        title: "Viga",
        message: "Palun sisestage kehtiv e-posti aadress.",
        onClose: () => setModal({ ...modal, open: false })
      });
      setError("Palun sisestage kehtiv e-posti aadress.");
      return;
    }
    setError("");
    setIsLoading(true);

    const userData = {
      fullname: fullName.trim(),
      email: email.trim(),
      password: password
    };

    try {
      const response = await fetch(`${baseURL}/accounts/register.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(userData)
      });

      const data = await response.json();

      if (response.ok) {
        setModal({
          open: true,
          title: "Registreerimine õnnestus",
          message: "Konto on loodud! Nüüd saate sisse logida.",
          onClose: () => {
            setModal({ ...modal, open: false });
            navigate("/login");
          }
        });
      } else {
        setModal({
          open: true,
          title: "Registreerimine ebaõnnestus",
          message: data.message || "Registreerimine ebaõnnestus.",
          onClose: () => setModal({ ...modal, open: false })
        });
        setError(data.message || "Registreerimine ebaõnnestus.");
      }
    } catch (err) {
      console.error("Registration error:", err);
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
          <h2>Registreeri</h2>
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleRegister}>
            <div className="input-group">
              <label>Täisnimi *</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(capitalizeWords(e.target.value))}
                required
              />
            </div>
            <div className="input-group">
              <label>E-post *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label>Parool *</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
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

            <button type="submit" className="login-button" disabled={isLoading}>
              {isLoading ? "Registreerimine..." : "Registreeri"}
            </button>
            <div className="links-container">
              <div className="register-link">
                <span>Kas olete registreeritud? </span>
                <Link to="/login">Logige sisse</Link>
              </div>
            </div>
          </form>
        </div>
      </div>
      {modal.open && (
        <ModalMessage
          open={modal.open}
          title={modal.title}
          message={modal.message}
          onClose={modal.onClose}
        />
      )}
    </div>
  );
};

export default Register;
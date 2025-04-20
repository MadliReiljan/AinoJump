import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Register.scss";
import loginImage from "../images/registerimg.png"; 

const Register = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); 
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError("Paroolid ei kattu");
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
      const response = await fetch("http://localhost:8000/accounts/register.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(userData)
      });

      const data = await response.json();

      if (response.ok) {
        navigate("/login"); 
      } else {
        setError(data.message || "Registration failed.");
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError("Network error. Please try again.");
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
                onChange={(e) => setFullName(e.target.value)}
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
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="login-button" disabled={isLoading}>
              {isLoading ? "Registreerimine..." : "Registreeri mind"}
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
    </div>
  );
};

export default Register;
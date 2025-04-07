import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.scss";
import Button from "../Button";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); 

    try {
      const response = await fetch('http://localhost/ainojump/backend/accounts/login.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password
        })
      });

      const data = await response.json();

      if (response.ok) {
      
        localStorage.setItem('user', JSON.stringify(data));
        navigate('/'); 
      } else {
      
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    }
  };

  return (
    <div className="background">
      <div className="login-container">
        <h2>Logi sisse</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="E-post"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Parool"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit" className="neutral">Logi sisse</Button>
          <a className="anchor-link" href="/register">Loo konto</a>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
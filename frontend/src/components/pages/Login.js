import React, { useState } from "react";
import "./Login.scss";
import Button from "../Button";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Logging in with", email, password);
  };

  return (
    <div className="background">
      <div className="login-container">
        <h2>Logi sisse</h2>
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
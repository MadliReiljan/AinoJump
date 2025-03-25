import React, { useState } from "react";
import "./Login.scss";
import Button from "../Button";

const Register = () => {
  const [fullName, setFullName] = useState(""); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Registering with", fullName, email, password); 
  };

  return (
    <div className="background">
      <div className="login-container">
        <h2>Registreeru</h2> 
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Täisnimi" 
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
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
          <Button type="submit">Registreeru</Button> 
        </form>
      </div>
    </div>
  );
};

export default Register;
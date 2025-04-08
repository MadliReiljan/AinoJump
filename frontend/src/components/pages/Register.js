import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Login.scss";
import Button from "../Button";

const Register = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("Form submitted"); 
    setError("");
    setIsLoading(true);

    const userData = {
      fullname: fullName.trim(),
      email: email.trim(),
      password: password
    };

    console.log("Sending data:", userData); 

    try {
      const response = await fetch("http://localhost:8000/accounts/register.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(userData)
      });

      console.log("Response status:", response.status);

      const data = await response.json();
      console.log("Response data:", data);

      if (response.ok) {
        navigate("/login");
      } else {
        setError(data.message || "Konto loomine nurjus");
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError("Viga registreerimisel: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="background">
      <div className="login-container">
        <h2>Loo konto</h2>
        {error && <div className="error-message">{error}</div>}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            console.log("Form onSubmit triggered"); 
            handleLogin(e);
          }}
        >
          <input
            type="text"
            placeholder="Täisnimi"
            value={fullName}
            onChange={(e) => {
              console.log("Full Name:", e.target.value); 
              setFullName(e.target.value);
            }}
            required
          />
          <input
            type="email"
            placeholder="E-post"
            value={email}
            onChange={(e) => {
              console.log("Email:", e.target.value); 
              setEmail(e.target.value);
            }}
            required
          />
          <input
            type="password"
            placeholder="Parool"
            value={password}
            onChange={(e) => {
              console.log("Password:", e.target.value); 
              setPassword(e.target.value);
            }}
            required
          />
          <Button type="submit" className="neutral" disabled={isLoading}>
            {isLoading ? "Registering..." : "Loo konto"}
          </Button>
          <Link className="anchor-link" to="/login">Logi sisse</Link>
        </form>
      </div>
    </div>
  );
};

export default Register;
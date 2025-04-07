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
    setError("");
    setIsLoading(true);

    const userData = {
        fullname: fullName.trim(),
        email: email.trim(),
        password: password
    };

    console.log('Sending data:', userData); 

    try {
        const response = await fetch('http://localhost/ainojump/backend/accounts/register.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        console.log('Response status:', response.status); 

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            throw new TypeError("Oops, we haven't got JSON!");
        }

        const data = await response.json();
        console.log('Response data:', data); 

        if (response.ok) {
            navigate('/login');
        } else {
            setError(data.message || 'Konto loomine nurjus');
        }
    } catch (err) {
        console.error('Registration error:', err);
        setError('Viga registreerimisel: ' + err.message);
    } finally {
        setIsLoading(false);
    }
};

  return (
    <div className="background">
      <div className="login-container">
        <h2>Loo konto</h2> 
        {error && <div className="error-message">{error}</div>}
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
          <Button type="submit" className="neutral">Loo konto</Button>
          <Link className="anchor-link" to="/login">Logi sisse</Link>
        </form>
      </div>
    </div>
  );
};

export default Register;
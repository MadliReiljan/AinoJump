import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../auth/Authentication";
import loginImage from "../images/loginimg.png";
import "../styles/Login.scss";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false); 
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate(); 

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);
    
        const userData = {
            email: email.trim(),
            password: password,
            rememberMe: rememberMe,
        };
    
        try {
            const response = await fetch("http://localhost:8000/accounts/login.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify(userData),
            });
    
            const data = await response.json();
    
            if (response.ok) {
                login(data.token, email); 
                navigate("/"); 
            } else {
                setError(data.message || "Login failed.");
            }
        } catch (err) {
            console.error("Login error:", err);
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
                    <h2>Logige sisse</h2>
                    {error && <div className="error-message">{error}</div>}
                    <form onSubmit={handleLogin}>
                        <div className="input-group">
                            <label>E-post *</label>
                            <input
                                type="email"
                                placeholder="Sisestage oma e-post"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="input-group">
                            <label>Parool *</label>
                            <input
                                type="password"
                                placeholder="Sisestage oma parool"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="checkbox-container">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                />
                                Jätke mind meelde
                            </label>
                        </div>
                        <button type="submit" className="login-button" disabled={isLoading}>
                            {isLoading ? "Loading..." : "Logige sisse"}
                        </button>
                        <div className="links-container">
                            <div className="forgot-password">
                                <Link to="/forgot-password">Unustasid Parooli?</Link>
                            </div>
                            <div className="register-link">
                                <span>Ei ole kasutajat? </span>
                                <Link to="/register">Registreeri!</Link>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
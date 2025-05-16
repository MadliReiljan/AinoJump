import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../auth/Authentication";
import loginImage from "../images/loginimg.webp";
import baseURL from "../baseURL";
import "../styles/Login.scss";
import ModalMessage from "../components/ModalMessage";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false); 
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [modal, setModal] = useState({ open: false, title: '', message: '', onClose: null });
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
            const response = await fetch(`${baseURL}/accounts/login.php`, {
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
                setModal({
                    open: true,
                    title: "Sisselogimine ebaõnnestus",
                    message: data.message || "Sisselogimine ebaõnnestus.",
                    onClose: () => setModal({ ...modal, open: false })
                });
                setError(data.message || "Sisselogimine ebaõnnestus.");
            }
        } catch (err) {
            console.error("Login error:", err);
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
                            <div className="password-input-wrapper">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Sisestage oma parool"
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
                            {isLoading ? "Sisselogimine..." : "Logi sisse"}
                        </button>
                        <div className="links-container">
                            <div className="forgot-password">
                                <Link to="/forgot_password">Unustasid Parooli?</Link>
                            </div>
                            <div className="register-link">
                                <span>Ei ole kasutajat? </span>
                                <Link to="/register">Registreeri!</Link>
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

export default Login;
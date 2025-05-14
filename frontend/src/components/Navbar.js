import React, { useContext, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import "../styles/Navbar.scss";
import logoImage from "../images/Logo3.png";
import { AuthContext } from "../auth/Authentication";

const BASE_PATH = process.env.NODE_ENV === "production" ? "/ainojump/frontend" : "";

export const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const { isLoggedIn, userEmail, logout } = useContext(AuthContext);
    const location = useLocation();

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
        // Prevent scrolling when menu is open
        if (!menuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    };

    const closeMenu = () => {
        setMenuOpen(false);
        document.body.style.overflow = 'auto';
    };

    const isLoginPage = location.pathname === `${BASE_PATH}/login`;
    const authButtonText = isLoginPage ? "Loo konto" : "Logi sisse";
    const authButtonLink = isLoginPage ? `${BASE_PATH}/register` : `${BASE_PATH}/login`;

    return (
        <nav>
            <div className="nav-inner">
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        width: "100%",
                        alignItems: "center",
                        boxSizing: "border-box",
                    }}
                >
                    <Link to="/" className="logo-link" onClick={closeMenu}>
                        <img src={logoImage} alt="AinoJump Logo" className="logo-image" />
                    </Link>
                    <div className="menu" onClick={toggleMenu}>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
                <ul className={menuOpen ? "open" : ""}>
                    <li>
                        <NavLink to="/pealeht" onClick={closeMenu}>
                            Pealeht
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/meist" onClick={closeMenu}>
                            Meist
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/broneeri" onClick={closeMenu}>
                            Broneeri
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/info" onClick={closeMenu}>
                            Info
                        </NavLink>
                    </li>
                    {!isLoggedIn ? (
                    <li>
                        <NavLink to={authButtonLink} onClick={closeMenu} className="auth-link">
                            {authButtonText}
                        </NavLink>
                    </li>
                ) : (
                    <li className="user-panel">
                        <div className="user-info">
                            <NavLink to="/user" onClick={closeMenu}>
                                Konto
                            </NavLink>
                            <NavLink to="/" onClick={() => {logout(); closeMenu();}} className="logout-link">
                                Logi välja
                            </NavLink>
                        </div>
                    </li>
                )}
                </ul>
            </div>
        </nav>
    );
};
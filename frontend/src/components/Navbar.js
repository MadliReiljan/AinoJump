import React, { useContext, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import "../styles/Navbar.scss";
import Button from "./Button";
import logoImage from "../images/Logo3.png";
import { AuthContext } from "../auth/Authentication";

export const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const { isLoggedIn, userEmail, logout } = useContext(AuthContext);
    const location = useLocation();

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const closeMenu = () => {
        setMenuOpen(false);
    };

    const isLoginPage = location.pathname === "/login";
    const authButtonText = isLoginPage ? "Loo konto" : "Logi sisse";
    const authButtonLink = isLoginPage ? "/register" : "/login";

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
                            <Button to={authButtonLink} onClick={closeMenu}>
                                {authButtonText}
                            </Button>
                        </li>
                    ) : (
                        <li className="user-panel">
                            <div className="user-info">
                                <NavLink to="/user" onClick={closeMenu}>
                                   Konto
                                </NavLink>
                                <button onClick={logout}>Logi välja</button>
                            </div>
                        </li>
                    )}
                </ul>
            </div>
        </nav>
    );
};
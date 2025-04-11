import React, { useState } from 'react';
import { Link, NavLink, useLocation } from "react-router-dom";
import "./Navbar.scss";
import Button from './Button';
import logoImage from '../images/Logo.png'; 

export const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const location = useLocation();

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const isLoginPage = location.pathname === "/login";
    const authButtonText = isLoginPage ? "Loo konto" : "Logi sisse";
    const authButtonLink = isLoginPage ? "/register" : "/login";

    return (
        <nav>
            <div className="nav-inner">
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    width: '100%', 
                    alignItems: 'center',
                    boxSizing: 'border-box'
                }}>
                    <Link to="/" className='logo-link'>
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
                        <NavLink to="/pealeht">Pealeht</NavLink>
                    </li>
                    <li>
                        <NavLink to="/meist">Meist</NavLink>
                    </li>
                    <li>
                        <NavLink to="/broneeri">Broneeri</NavLink>
                    </li>
                    <li>
                        <NavLink to="/info">Info</NavLink>
                    </li>
                    <li>
                        <Button to={authButtonLink}>{authButtonText}</Button>
                    </li>
                </ul>
            </div>
        </nav>
    );
};
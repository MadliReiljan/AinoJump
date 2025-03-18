import React, { useState } from 'react';
import { Link, NavLink } from "react-router-dom";
import "./Navbar.scss"
import Button from './Button';

export const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    
    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };
    
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
                    <Link to="/" className='title'>AinoJump</Link>
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
                        <NavLink to="/kontakt">Kontakt</NavLink>
                    </li>
                    <li>
                        <Button to="/login">Loo konto / logi sisse</Button>
                    </li>
                </ul>
            </div>
        </nav>
    );
}
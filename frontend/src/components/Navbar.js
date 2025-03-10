import React, { useState } from 'react';
import { Link, NavLink } from "react-router-dom";
import "./Navbar.scss"

export const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false)
  return (
    <nav>
        <Link to="/" className='title'>AinoJump</Link>
        <div className="menu" onClick={() => {
            setMenuOpen(!menuOpen)
        }}>
            <span></span>
            <span></span>
            <span></span>
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
        </ul>
    </nav>
  )
}

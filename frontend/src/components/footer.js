import React from 'react';
import "../styles/Footer.scss";
import logoImage from '../images/Logo2.png'; 

const Footer = () => {
    return (
        <footer>
            <div className="footer-inner">
                <div className="footer-container">
                    <div className="footer-column logo-column">
                        <img src={logoImage} alt="AinoJump Logo" className="footer-logo" />
                    </div>
                    
                    <div className="footer-column">
                        <h4>Kontakt</h4>
                        <p>Email: ainotimmer1@gmail.com</p>
                        <p>Tel: +372 5393 9608</p>
                    </div>
                    
                    <div className="footer-column">
                        <h4>Asukoht</h4>
                        <p>Ülenumre Spordihoone</p>
                    </div>
                </div>
                
                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} AinoJump OÜ. Kõik õigused kaitstud.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
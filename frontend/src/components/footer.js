import React from 'react';


const Footer = () => {
    return (
        <footer style={{ 
            backgroundColor: '#333', 
            color: '#fff', 
            textAlign: 'center', 
            padding: '10px 0', 
            bottom: 0, 
            width: '100%' 
        }}>
            <p>&copy; {new Date().getFullYear()} AinoJump OÜ. Kõik õigused kaitstud.</p>
        </footer>
    );
};

export default Footer;
import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Button.scss"; 

const Button = ({ children, to, variant = "default", className, type, onClick, ...props }) => {
  const navigate = useNavigate();

  const handleClick = (e) => {
    if (onClick) {
      onClick(e);
    }
    
    if (type === "submit") {
      e.preventDefault();
      const form = e.target.closest("form");
      if (form) {
        form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
      }
    } else if (to) {
      navigate(to);
    }
  };

  return (
    <a
      href={to || "#"}
      onClick={handleClick}
      className={`button ${variant} ${className || ""}`.trim()}
      {...props}
    >
      {children}
    </a>
  );
};

export default Button;
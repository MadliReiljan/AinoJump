import React from "react";
import { useNavigate } from "react-router-dom";
import "./Button.scss";

const Button = ({ children, to, variant = "default", className, ...props }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (to) {
      navigate(to);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`button ${variant} ${className || ""}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;

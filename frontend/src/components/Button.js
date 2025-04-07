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
    <a
      onClick={handleClick}
      className={`button ${variant} ${className || ""}`.trim()}
      {...props}
    >
      {children}
    </a>
  );
};

export default Button;

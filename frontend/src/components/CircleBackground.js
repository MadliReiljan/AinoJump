import React from 'react';
import "../styles/CircleBackground.scss";

const CircleBackground = ({ className }) => {
  return (
    <div className={`circle-background ${className || ''}`}>
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 1000 1000" 
        className="circle-svg"
      >
        {/* Outer circle */}
        <circle 
          cx="500" 
          cy="500" 
          r="495" 
          fill="none" 
          stroke="#47803C" 
          strokeWidth="2"
        />
        
        {/* Inner circle - 20px smaller */}
        <circle 
          cx="500" 
          cy="500" 
          r="480" 
          fill="none" 
          stroke="#47803C" 
          strokeWidth="2"
        />
      </svg>
    </div>
  );
};

export default CircleBackground;
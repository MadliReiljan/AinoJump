import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import baseURL from "../baseURL";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState(null);
  const [fullName, setFullName] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const expiryTime = localStorage.getItem("tokenExpiry");
    if (token && expiryTime) {
      if (Date.now() > parseInt(expiryTime, 10)) {
        logout();
      } else {
        fetchUserData(token);
      }
    }
  }, []);

  const fetchUserData = async (token) => {
    const expiryTime = localStorage.getItem("tokenExpiry");
    if (expiryTime && Date.now() > parseInt(expiryTime, 10)) {
      console.error("Token expired");
      logout();
      return;
    }

    try {
      const response = await fetch(`${baseURL}/accounts/user.php`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUserEmail(data.email);
        setFullName(data.fullname);
        setUserRole(data.role);
        setIsLoggedIn(true);
      } else {
        console.error("Failed to fetch user data");
        logout();
      }
    } catch (err) {
      console.error("Error fetching user data:", err);
      logout();
    }
  };

  const login = async (token, email) => {
    localStorage.setItem("token", token);
    // Set expiry to 1 hour from now
    const expiry = Date.now() + 3600 * 1000;
    localStorage.setItem("tokenExpiry", expiry.toString());
    setIsLoggedIn(true);
    setUserEmail(email); 
    fetchUserData(token); 
};

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("tokenExpiry");
    setIsLoggedIn(false);
    setUserEmail(null);
    setFullName(null);
    setUserRole(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userEmail, fullName, userRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
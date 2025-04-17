import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userEmail, setUserEmail] = useState(null);
    const [fullName, setFullName] = useState(null); 
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            setIsLoggedIn(true);
            fetchUserData(token);
        }
    }, []);

    const fetchUserData = async (token) => {
        try {
            const response = await fetch("http://localhost:8000/accounts/user.php", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
    
            if (response.ok) {
                const data = await response.json();
                setUserEmail(data.email);
                setFullName(data.fullname); 
            }
        } catch (err) {
            console.error("Failed to fetch user data:", err);
        }
    };

    const login = (token) => {
        localStorage.setItem("token", token);
        setIsLoggedIn(true);
        fetchUserData(token);
    };

    const logout = () => {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        setUserEmail(null);
        setFullName(null); 
        navigate("/");
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, userEmail, fullName, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
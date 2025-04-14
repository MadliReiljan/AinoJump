import React, { useState, useEffect } from "react";
import "../styles/User.scss";

const User = () => {
  const [userData, setUserData] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [hasChild, setHasChild] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
        const token = localStorage.getItem("token");
        console.log("Token being sent:", token); 
        if (!token) {
            setError("No token found. Please log in.");
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch("http://localhost:8000/accounts/user.php", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            console.log("Response status:", response.status); 
            if (!response.ok) {
                throw new Error("Failed to fetch user data.");
            }

            const data = await response.json();
            console.log("User data received:", data); 
            setUserData(data);
            setHasChild(data.hasChild || false);
        } catch (err) {
            console.error("Error fetching user data:", err); 
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    fetchUserData();
}, []);

  const handlePasswordChange = async () => {
    try {
        const response = await fetch("http://localhost:8000/accounts/user.php", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });

      if (!response.ok) {
        throw new Error("Failed to update password.");
      }

      alert("Password updated successfully!");
      setNewPassword("");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleChildToggle = async () => {
    try {
      const response = await fetch("http://localhost:8000/accounts/update_child_status.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ hasChild }),
      });

      if (!response.ok) {
        throw new Error("Failed to update child status.");
      }

      alert("Child status updated successfully!");
    } catch (err) {
      setError(err.message);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="user-popup">
      <h2>User Information</h2>
      <div className="user-info">
        <label>Email:</label>
        <input type="email" value={userData.email} readOnly disabled />
      </div>
      <div className="user-info">
        <label>New Password:</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Enter new password"
          disabled
        />
        <button onClick={handlePasswordChange} disabled>Change Password</button>
      </div>
      <div className="user-info">
        <label>Do you have a child?</label>
        <input
          type="checkbox"
          checked={hasChild}
          onChange={(e) => setHasChild(e.target.checked)}
          disabled
        />
        <button onClick={handleChildToggle} disabled>Update Child Status</button>
      </div>
    </div>
  );
};

export default User;
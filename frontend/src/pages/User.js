import React, { useState, useEffect } from "react";
import "../styles/User.scss";
import baseURL from "../baseURL";

const User = () => {
  const [userData, setUserData] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [childName, setChildName] = useState(""); // State for the child's name
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No token found. Please log in.");
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`${baseURL}/accounts/user.php`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user data.");
        }

        const data = await response.json();
        setUserData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleAddChild = async () => {
    if (!childName.trim()) {
      alert("Please enter a valid child name.");
      return;
    }
  
    try {
      const response = await fetch(`${baseURL}/accounts/add_child.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ childName }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add child.");
      }
  
      alert("Child added successfully!");
      setChildName("");
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
        <button onClick={() => alert("Password change functionality not implemented yet.")} disabled>
          Change Password
        </button>
      </div>
      <div className="user-info">
        <label>Add Child:</label>
        <input
          type="text"
          value={childName}
          onChange={(e) => setChildName(e.target.value)}
          placeholder="Enter child's name"
        />
        <button onClick={handleAddChild}>Add Child</button>
      </div>
    </div>
  );
};

export default User;
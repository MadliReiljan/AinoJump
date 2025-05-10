import React, { useState, useEffect } from "react";
import "../styles/User.scss";
import baseURL from "../baseURL";

const User = () => {
  const [userData, setUserData] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [childName, setChildName] = useState(""); 
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [passwordError, setPasswordError] = useState("");

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
        setPhoneNumber(data.phone || "");
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

  const handleUpdateProfile = async () => {
    if (currentPassword || newPassword || confirmPassword) {
      if (!currentPassword) {
        setPasswordError("Please enter your current password");
        return;
      }
      
      if (newPassword !== confirmPassword) {
        setPasswordError("New passwords do not match");
        return;
      }
      
      if (newPassword.length < 8) {
        setPasswordError("Password must be at least 8 characters");
        return;
      }
      
      try {
        const passwordResponse = await fetch(`${baseURL}/accounts/update_password.php`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            currentPassword,
            newPassword,
          }),
        });
        
        if (!passwordResponse.ok) {
          const errorData = await passwordResponse.json();
          throw new Error(errorData.message || "Failed to update password");
        }
      } catch (err) {
        setPasswordError(err.message);
        return;
      }
    }
    
    try {
      const response = await fetch(`${baseURL}/accounts/update_profile.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ 
          phone: phoneNumber,
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update profile.");
      }

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordError("");
      
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (err) {
      setError(err.message);
    }
  };

  const bookings = [
    { date: "01.04", day: "Teisipäev", time: "19-20" },
    { date: "03.04", day: "Neljapäev", time: "19-20" },
    { date: "05.04", day: "Pühapäev", time: "17:30-18:30" },
    { date: "08.04", day: "Tisipäev", time: "19-20" },
    { date: "10.04", day: "Neljapäev", time: "19-20" },
    { date: "12.04", day: "Pühapäev", time: "19-20" },
    { date: "15.04", day: "Teisipäev", time: "19-20" },
    { date: "17.04", day: "Neljapäev", time: "19-20" },
    { date: "19.04", day: "Pühapäev", time: "19-20" },
    { date: "22.04", day: "Teisipäev", time: "19-20" },
    { date: "24.04", day: "Neljapäev", time: "19-20" },
    { date: "26.04", day: "Pühapäev", time: "19-20" },
  ];

  if (isLoading) {
    return <div className="loading-container">Loading...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="account-container">
      <h1 className="account-title">Konto</h1>
      
      <div className="account-content">
        <div className="details-section">
          <h2>Detailid {isEditing ? 
            <button className="edit-button save" onClick={handleUpdateProfile}>Salvesta</button> : 
            <button className="edit-button" onClick={() => setIsEditing(true)}>Muuda</button>}
          </h2>
          
          <div className="detail-row">
            <div className="detail-label">Eesnimi</div>
            <div className="detail-value">{userData?.firstName || "Aino"}</div>
          </div>
          
          <div className="detail-row">
            <div className="detail-label">Perekonna nimi</div>
            <div className="detail-value">{userData?.lastName || "Jump"}</div>
          </div>
          
          <div className="detail-row">
            <div className="detail-label">E-post</div>
            <div className="detail-value">{userData?.email || "AinoJump@gmail.com"}</div>
          </div>
          
          <div className="detail-row">
            <div className="detail-label">Telefon</div>
            {isEditing ? (
              <input 
                type="tel" 
                value={phoneNumber} 
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="detail-input"
                placeholder="+372 XXXX XXXX"
              />
            ) : (
              <div className="detail-value">{phoneNumber || "+372 5555 5555"}</div>
            )}
          </div>

          <div className="detail-row">
            <div className="detail-label">Parool</div>
            {isEditing ? (
              <div className="password-change-form">
                <div className="password-field">
                  <label>Praegune parool:</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="password-input"
                  />
                </div>
                <div className="password-field">
                  <label>Uus parool:</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="password-input"
                  />
                </div>
                <div className="password-field">
                  <label>Kinnita uus parool:</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="password-input"
                  />
                </div>
                {passwordError && <div className="password-error">{passwordError}</div>}
                <div className="password-info">Jäta väljad tühjaks, kui sa ei soovi parooli muuta.</div>
              </div>
            ) : (
              <div className="detail-value">••••••••••••</div>
            )}
          </div>
          
          <div className="children-section">
            <h3>Lisa laps <span className="add-button">+</span></h3>
            {isEditing && (
              <div className="add-child-form">
                <input
                  type="text"
                  value={childName}
                  onChange={(e) => setChildName(e.target.value)}
                  placeholder="Enter child's name"
                  className="child-input"
                />
                <button onClick={handleAddChild} className="add-child-button">Lisa</button>
              </div>
            )}
          </div>
        </div>

        <div className="bookings-section">
          <h2>Sinu broneeringud</h2>
          <div className="bookings-grid">
            {bookings.map((booking, index) => (
              <div key={index} className="booking-item">
                {booking.day} {booking.date}
                <div className="booking-time">{booking.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default User;
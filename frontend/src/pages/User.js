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
  const [isAddingChild, setIsAddingChild] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [bookings, setBookings] = useState([]);

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

    const fetchBookings = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const response = await fetch(`${baseURL}/accounts/get_user_bookings.php`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setBookings(data);
        }
      } catch (e) {
        // Optionally handle error
      }
    };

    fetchUserData();
    fetchBookings();
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
      setIsAddingChild(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdateProfile = async () => {
    if (isChangingPassword && (currentPassword || newPassword || confirmPassword)) {
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
      setIsChangingPassword(false);
      alert("Profile updated successfully!");
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleAddChild = () => {
    setIsAddingChild(!isAddingChild);
  };

  const toggleChangePassword = () => {
    setIsChangingPassword(!isChangingPassword);
  };

  const cancelAddChild = () => {
    setIsAddingChild(false);
    setChildName("");
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setIsChangingPassword(false);
    // Reset fields
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordError("");
  };

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
          <h2>Detailid {isEditing ? (
              <>
                <button className="edit-button save" onClick={handleUpdateProfile}>Salvesta</button>
                <button className="edit-button cancel" onClick={cancelEditing}>Tühista</button>
              </>
            ) : (
              <button className="edit-button" onClick={() => setIsEditing(true)}>Muuda</button>
            )}
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
            {isEditing && !isChangingPassword ? (
              <div className="detail-value">
                *********
                <button 
                  className="password-change-button" 
                  onClick={toggleChangePassword}
                >
                  Muuda parool
                </button>
              </div>
            ) : isChangingPassword ? (
              <div className="password-change-form">
                <div className="password-field">
                  <label>Praegune parool:</label>
                  <div className="password-input-wrapper">
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="password-input"
                    />
                    <button 
                      type="button"
                      className="password-toggle-icon" 
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      tabIndex="-1"
                      aria-label={showCurrentPassword ? "Hide password" : "Show password"}
                    >
                      {showCurrentPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                          <line x1="1" y1="1" x2="23" y2="23"></line>
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
                <div className="password-field">
                  <label>Uus parool:</label>
                  <div className="password-input-wrapper">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="password-input"
                    />
                    <button 
                      type="button"
                      className="password-toggle-icon" 
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      tabIndex="-1"
                      aria-label={showNewPassword ? "Hide password" : "Show password"}
                    >
                      {showNewPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                          <line x1="1" y1="1" x2="23" y2="23"></line>
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
                <div className="password-field">
                  <label>Kinnita uus parool:</label>
                  <div className="password-input-wrapper">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="password-input"
                    />
                    <button 
                      type="button"
                      className="password-toggle-icon" 
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      tabIndex="-1"
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    >
                      {showConfirmPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                          <line x1="1" y1="1" x2="23" y2="23"></line>
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
                {passwordError && <div className="password-error">{passwordError}</div>}
                <div className="password-actions">
                  <button 
                    className="save-password" 
                    onClick={handleUpdateProfile}
                  >
                    Salvesta
                  </button>
                  <button 
                    className="cancel-password" 
                    onClick={() => {
                      setIsChangingPassword(false);
                      setCurrentPassword("");
                      setNewPassword("");
                      setConfirmPassword("");
                      setPasswordError("");
                      setShowCurrentPassword(false);
                      setShowNewPassword(false);
                      setShowConfirmPassword(false);
                    }}
                  >
                    Tühista
                  </button>
                </div>
              </div>
            ) : (
              <div className="detail-value">••••••••••••</div>
            )}
          </div>
          
          <div className="children-section">
            <h3>Lisa laps {!isEditing && <span className="add-button" onClick={toggleAddChild}>+</span>}</h3>
            {(isEditing || isAddingChild) && (
              <div className="add-child-form">
                <input
                  type="text"
                  value={childName}
                  onChange={(e) => setChildName(e.target.value)}
                  placeholder="Enter child's name"
                  className="child-input"
                />
                <button onClick={handleAddChild} className="add-child-button">Lisa</button>
                {!isEditing && (
                  <button onClick={cancelAddChild} className="cancel-button">Tühista</button>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="bookings-section">
          <h2>Sinu broneeringud</h2>
          <div className="bookings-grid">
            {bookings.length > 0 ? (
              bookings.map((booking, index) => (
                <div key={booking.id || index} className="booking-item">
                  {booking.title} <span className="booking-date">{booking.time ? new Date(booking.time).toLocaleString() : ''}</span>
                  <div className="booking-time">Broneeritud: {booking.reservation_time ? new Date(booking.reservation_time).toLocaleString() : ''}</div>
                </div>
              ))
            ) : (
              <div className="booking-item">Sul pole ühtegi broneeringut.</div>
            )}
          </div>
        </div> 
      </div>
      
      {userData && userData.role === "owner" && (
        <div className="admin-button-container">
          <button
            className="admin-button"
            onClick={() => window.location.href = "/admin_user_list"}
          >
            Halda kontosid
          </button>
        </div>
      )}
    </div>
  );
};

export default User;
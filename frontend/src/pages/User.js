import React, { useState, useEffect } from "react";
import "../styles/User.scss";
import baseURL from "../baseURL";
import ModalMessage from "../components/ModalMessage";

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
  const [children, setChildren] = useState([]);
  const [childrenBookings, setChildrenBookings] = useState([]);
  const [modal, setModal] = useState({ open: false, title: '', message: '', onClose: null });

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
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Broneeringute laadimine ebaõnnestus.");
      }
    } catch (e) {
      setError(e.message || "Võrgu viga broneeringute laadimisel.");
    }
  };

  const fetchChildrenBookings = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const response = await fetch(`${baseURL}/accounts/get_children_bookings.php`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setChildrenBookings(data);
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Laste broneeringute laadimine ebaõnnestus.");
      }
    } catch (e) {
      setError(e.message || "Võrgu viga laste broneeringute laadimisel.");
    }
  };

  const fetchChildren = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const response = await fetch(`${baseURL}/accounts/get_children.php`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setChildren(data);
      }
    } catch (e) {
      setError(e.message || "Võrgu viga laste andmete laadimisel.");
    }
  };

  useEffect(() => {
    fetchUserData();
    fetchBookings();
    fetchChildrenBookings();
    fetchChildren();
  }, []);

  const handleAddChild = async () => {
  if (!childName.trim()) {
    setModal({ open: true, title: 'Viga', message: 'Palun sisestage lapse nimi.', onClose: () => setModal(m => ({ ...m, open: false })) });
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

    const refreshData = () => {
      fetchChildren();
      fetchChildrenBookings(); 
    };

    setModal({ 
      open: true, 
      title: 'Õnnestus', 
      message: 'Lapse lisamine õnnestus!', 
      onClose: () => {
        setModal(m => ({ ...m, open: false }));
        refreshData();
      }
    });
    
    setChildName("");
    setIsAddingChild(false);
  } catch (err) {
    setModal({ open: true, title: 'Viga', message: err.message, onClose: () => setModal(m => ({ ...m, open: false })) });
  }
};

  const handleUpdateProfile = async () => {
    if (isChangingPassword && (currentPassword || newPassword || confirmPassword)) {
      if (!currentPassword) {
        setPasswordError("Palun sisestage oma praegune parool.");
        return;
      }
      
      if (newPassword !== confirmPassword) {
        setPasswordError("Uued paroolid ei kattu.");
        return;
      }
      
      if (newPassword.length < 8) {
        setPasswordError("Parool peab olema vähemalt 8 tähemärki pikk.");
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
          throw new Error(errorData.message || "Parooli uuendamine ebaõnnestus.");
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
        throw new Error(errorData.message || "Profiili uuendamine ebaõnnestus.");
      }

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordError("");
      
      setIsEditing(false);
      setIsChangingPassword(false);
      setModal({ open: true, title: 'Õnnestus', message: 'Profiil on edukalt uuendatud!', onClose: () => setModal(m => ({ ...m, open: false })) });
    } catch (err) {
      setModal({ open: true, title: 'Viga', message: err.message, onClose: () => setModal(m => ({ ...m, open: false })) });
    }
  };

  const handleRemoveBooking = async (bookingId, eventId) => {
    setModal({
      open: true,
      title: 'Kinnitus',
      message: 'Kas oled kindel, et soovid selle broneeringu eemaldada?',
      onConfirm: async () => {
        setModal(m => ({ ...m, open: false }));
        if (!eventId) {
          setModal({ open: true, title: 'Viga', message: 'Broneeringu eemaldamiseks puudub eventId. Palun teavita administraatorit.', onClose: () => setModal(m => ({ ...m, open: false })) });
          return;
        }
        try {
          const token = localStorage.getItem("token");
          const response = await fetch(`${baseURL}/events/reserve_event.php`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ eventId }),
          });
          const responseData = await response.json().catch(() => ({}));
          if (!response.ok) {
            throw new Error(responseData.message || "Broneeringu eemaldamine ebaõnnestus.");
          }
          setBookings((prev) => prev.filter((b) => b.id !== bookingId));
        } catch (err) {
          setModal({ open: true, title: 'Viga', message: err.message, onClose: () => setModal(m => ({ ...m, open: false })) });
        }
      },
      onCancel: () => setModal(m => ({ ...m, open: false })),
    });
  };

  const handleRemoveChildBooking = async (bookingId, childId, eventId) => {
    setModal({
      open: true,
      title: 'Kinnitus',
      message: 'Kas oled kindel, et soovid selle broneeringu eemaldada?',
      onConfirm: async () => {
        setModal(m => ({ ...m, open: false }));
        if (!eventId) {
          setModal({ open: true, title: 'Viga', message: 'Lapse broneeringu eemaldamiseks puudub eventId. Palun teavita administraatorit.', onClose: () => setModal(m => ({ ...m, open: false })) });
          return;
        }
        try {
          const token = localStorage.getItem("token");
          const response = await fetch(`${baseURL}/events/reserve_event.php`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ eventId, childId }),
          });
          const responseData = await response.json().catch(() => ({}));
          if (!response.ok) {
            throw new Error(responseData.message || "Broneeringu eemaldamine ebaõnnestus.");
          }
          setChildrenBookings((prev) => prev.map(childObj =>
            childObj.child.id === childId
              ? { ...childObj, bookings: childObj.bookings.filter(b => b.id !== bookingId) }
              : childObj
          ));
        } catch (err) {
          setModal({ open: true, title: 'Viga', message: err.message, onClose: () => setModal(m => ({ ...m, open: false })) });
        }
      },
      onCancel: () => setModal(m => ({ ...m, open: false })),
    });
  };

  const toggleAddChild = () => {
    setIsAddingChild(!isAddingChild);
    if (!isAddingChild) {
      fetchChildren();
    }
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
    return <div className="loading-container">Laen...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="account-container">
      <ModalMessage 
        open={modal.open} 
        title={modal.title} 
        message={modal.message} 
        onClose={modal.onClose} 
        onConfirm={modal.onConfirm} 
        onCancel={modal.onCancel} 
      />
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
                  <div className="password-input-wrapper2">
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
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
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
                  <div className="password-input-wrapper2">
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
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
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
                  <div className="password-input-wrapper2">
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
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
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
              <div className="add-child-form" style={{flexDirection: 'column', alignItems: 'flex-start', gap: '10px'}}>
                <div style={{display: 'flex', width: '100%', gap: '10px'}}>
                  <input
                    type="text"
                    value={childName}
                    onChange={(e) => setChildName(e.target.value)}
                    placeholder="Sisestage lapse nimi"
                    className="child-input"
                  />
                  <button onClick={handleAddChild} className="add-child-button">Lisa</button>
                  {!isEditing && (
                    <button onClick={cancelAddChild} className="cancel-button">Tühista</button>
                  )}
                </div>
                {children.length > 0 && (
                  <div className="children-list">
                    <h4>Sinu lapsed:</h4>
                    <ul>
                      {children.map(child => (
                        <li key={child.id}>{child.full_name}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
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

        <div className="bookings-section">
          <h2>Sinu broneeringud</h2>
          <p>PS. Vajutades vasaku klõpsuga broneeringu peale saad seda eemaldada.</p>
          <div className="bookings-grid">
            {bookings.length > 0 ? (
              bookings.map((booking, index) => (
                <div
                  key={booking.id || index}
                  className="booking-item"
                  style={{ cursor: 'pointer' }}
                  title="Eemalda broneering"
                  onClick={() => handleRemoveBooking(booking.id, booking.event_id)}
                >
                  {booking.title} <span className="booking-date">{booking.time ? new Date(booking.time).toLocaleString() : ''}</span>
                  <div className="booking-time">Broneeritud: {booking.reservation_time ? new Date(booking.reservation_time).toLocaleString() : ''}</div>
                </div>
              ))
            ) : (
              <div className="booking-item">Sul pole ühtegi broneeringut.</div>
            )}
          </div>

          <h2 style={{marginTop: '2rem'}}>Laste broneeringud</h2>
          {childrenBookings.length === 0 ? (
            <div className="booking-item">Sul pole ühtegi last ega nende broneeringut.</div>
          ) : (
            childrenBookings.map(childObj => (
              <div key={childObj.child.id} className="child-bookings-block">
                <h3>{childObj.child.full_name}</h3>
                <div className="bookings-grid">
                  {childObj.bookings.length > 0 ? (
                    childObj.bookings.map((booking, idx) => (
                      <div
                        key={booking.id || idx}
                        className="booking-item"
                        style={{ cursor: 'pointer' }}
                        title="Eemalda broneering"
                        onClick={() => handleRemoveChildBooking(booking.id, childObj.child.id, booking.event_id)}
                      >
                        {booking.title} <span className="booking-date">{booking.time ? new Date(booking.time).toLocaleString() : ''}</span>
                        <div className="booking-time">Broneeritud: {booking.reservation_time ? new Date(booking.reservation_time).toLocaleString() : ''}</div>
                      </div>
                    ))
                  ) : (
                    <div className="booking-item">Sellel lapsel pole broneeringuid.</div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default User;
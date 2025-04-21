import React, { useState, useContext } from "react";
import Button from "./Button";
import { AuthContext } from "../auth/Authentication";
import "../styles/EventDetailsModal.scss";

const EventDetailsModal = ({ event, onClose }) => {
  const { userEmail } = useContext(AuthContext);
  const [isReserved, setIsReserved] = useState(false);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose(); 
    }
  };

  const handleReserve = async () => {
    if (!userEmail) {
      alert("You must be logged in to reserve an event!");
      return;
    }
  
    const token = localStorage.getItem("token");
    const response = await fetch("http://localhost:8000/events/reserve_event.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        userEmail: userEmail,
        eventId: event.id,
      }),
    });
  
    if (response.ok) {
      setIsReserved(true);
      alert("You have successfully reserved your spot!");
    } else {
      const errorData = await response.json();
      alert(errorData.message || "Failed to reserve the spot. Please try again.");
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <h2>{event.title}</h2>
        <p><strong>Kirjeldus:</strong> {event.body}</p>
        <p><strong>Kuupäev:</strong> {event.time.split(" ")[0]}</p>
        <p><strong>Aeg:</strong> {event.time.split(" ")[1]}</p>
        <p><strong>Kogus:</strong> {event.max_capacity}</p>
        <p><strong>Laste trenn?</strong> {event.is_for_children ? "Jah" : "Ei"}</p>
        
        {!isReserved && (
          <Button type="button" variant="primary" onClick={handleReserve}>
            Reserveeri koht
          </Button>
        )}

        {isReserved && (
          <p style={{ color: "green" }}>You have already reserved a spot!</p>
        )}

        <Button type="button" variant="neutral" onClick={onClose}>
          Sulge
        </Button>
      </div>
    </div>
  );
};

export default EventDetailsModal;

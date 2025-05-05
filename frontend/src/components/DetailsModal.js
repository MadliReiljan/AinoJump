import React, { useState, useContext, useEffect } from "react";
import Button from "./Button";
import { AuthContext } from "../auth/Authentication";
import "../styles/EventDetailsModal.scss";

const EventDetailsModal = ({ event, onClose }) => {
  const { userEmail, userRole } = useContext(AuthContext);
  const [isReserved, setIsReserved] = useState(false);

  useEffect(() => {
    const fetchReservationStatus = async () => {
      const token = localStorage.getItem("token"); 
    
      try {
        const response = await fetch("http://localhost:8000/events/check_reservation.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`, 
          },
          body: JSON.stringify({
            eventId: event.id,
          }),
        });
    
        if (response.ok) {
          const data = await response.json();
          setIsReserved(data.isReserved); 
        } else {
          console.error("Failed to fetch reservation status");
        }
      } catch (error) {
        console.error("An error occurred while checking reservation status:", error);
      }
    };
    fetchReservationStatus();
  }, [event.id]); 

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleReserve = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://localhost:8000/events/reserve_event.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          eventId: event.id,
        }),
      });

      if (response.ok) {
        alert("Reservation successful!");
        setIsReserved(true);
      } else {
        const errorData = await response.json().catch(() => null);
        alert(errorData?.message || "Failed to reserve the spot.");
      }
    } catch (error) {
      alert("An error occurred. Please try again.");
    }
  };

  const handleUnreserve = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://localhost:8000/events/reserve_event.php", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          eventId: event.id,
        }),
      });

      if (response.ok) {
        alert("Unreservation successful!");
        setIsReserved(false);
      } else {
        const errorData = await response.json().catch(() => null);
        alert(errorData?.message || "Failed to unreserve the spot.");
      }
    } catch (error) {
      alert("An error occurred. Please try again.");
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this event?");
    if (!confirmDelete) return;

    const token = localStorage.getItem("token");
    const response = await fetch(`http://localhost:8000/events/delete_event.php`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        eventId: event.id,
      }),
    });

    if (response.ok) {
      alert("Event deleted successfully!");
      onClose();
    } else {
      const errorData = await response.json();
      alert(errorData.message || "Failed to delete the event. Please try again.");
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <Button type="button" variant="default" onClick={onClose}>
          x
        </Button>
        <h2>{event.title}</h2>
        <p><strong>Kirjeldus:</strong> {event.body}</p>
        <p><strong>Kuupäev:</strong> {event.time.split(" ")[0]}</p>
        <p><strong>Aeg:</strong> {event.time.split(" ")[1]}</p>
        <p><strong>Kogus:</strong> {event.max_capacity}</p>
        <p><strong>Laste trenn?</strong> {event.is_for_children ? "Jah" : "Ei"}</p>

        {isReserved ? (
          <Button type="button" variant="neutral" onClick={handleUnreserve}>
            Vabasta koht
          </Button>
        ) : (
          <Button type="button" variant="neutral" onClick={handleReserve}>
            Reserveeri koht
          </Button>
        )}

        {isReserved && (
          <p style={{ color: "green" }}>You have already reserved a spot!</p>
        )}

        {userRole === "owner" && (
          <Button type="button" variant="danger" onClick={handleDelete}>
            Kustuta sündmus
          </Button>
        )}
      </div>
    </div>
  );
};

export default EventDetailsModal;
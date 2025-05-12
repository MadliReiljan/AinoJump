import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../auth/Authentication";
import "../styles/EventDetailsModal.scss";
import EventEditModal from "./EditModal";
import baseURL from "../baseURL";

const EventDetailsModal = ({ event, onClose, onReservationChange }) => {
  const { userEmail, userRole } = useContext(AuthContext);
  const [isReserved, setIsReserved] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [reservedCount, setReservedCount] = useState(event.reserved_count || 0);
  const spotsLeft = event.max_capacity - reservedCount;

  useEffect(() => {
    const fetchReservationStatus = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await fetch(`${baseURL}/events/check_reservation.php`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
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
      const response = await fetch(`${baseURL}/events/reserve_event.php`, {
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
        setIsReserved(true);
        setReservedCount(prev => prev + 1);
        if (onReservationChange) {
          onReservationChange();
        }
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
      const response = await fetch(`${baseURL}/events/reserve_event.php`, {
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
        setIsReserved(false);
        setReservedCount(prev => prev - 1);
        if (onReservationChange) {
          onReservationChange();
        }
      } else {
        const errorData = await response.json().catch(() => null);
        alert(errorData?.message || "Failed to unreserve the spot.");
      }
    } catch (error) {
      alert("An error occurred. Please try again.");
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleEditClose = () => {
    setIsEditing(false);
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this event?");
    if (!confirmDelete) return;

    const token = localStorage.getItem("token");
    const response = await fetch(`${baseURL}/events/delete_event.php`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        eventId: event.id,
      }),
    });

    if (response.ok) {
      alert("Event deleted successfully!");
      onClose();
      if (onReservationChange) {
        onReservationChange();
      }
    } else {
      const errorData = await response.json();
      alert(errorData.message || "Failed to delete the event. Please try again.");
    }
  };

  const handleEventUpdated = (updatedEvent) => {
  setIsEditing(false);

  Object.assign(event, updatedEvent);

  if (onReservationChange) {
    onReservationChange();
  }
};

 return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>×</button>
        <h2>{event.title}</h2>
        <p><strong>Kirjeldus:</strong> {event.body}</p>
        <p><strong>Kuupäev:</strong> {new Date(event.time).toLocaleDateString('et-EE')}</p>
        <p><strong>Aeg:</strong> {new Date(event.time).toLocaleTimeString('et-EE', { hour: '2-digit', minute: '2-digit' })}</p>
        <p><strong>Kogus:</strong> {event.max_capacity}</p>
        <p><strong>Vabu kohti:</strong> {spotsLeft}</p>
        <p><strong>Laste trenn?</strong> {event.is_for_children ? "Jah" : "Ei"}</p>

        {isReserved && (
          <p className="reserved-message">Oled juba registreeritud!</p>
        )}

        {isReserved ? (
          <button type="button" onClick={handleUnreserve} className="reserve-button">
            Vabasta koht
          </button>
        ) : (
          <button type="button" onClick={handleReserve} disabled={spotsLeft <= 0} className="reserve-button">
            {spotsLeft <= 0 ? "Kohad täis" : "Reserveeri koht"}
          </button>
        )}

        {isEditing && (
          <EventEditModal
            event={event}
            onClose={handleEditClose}
            onEventUpdated={handleEventUpdated}
          />
        )}

        {userRole === "owner" && (
          <div className="admin-buttons">
            <button type="button" onClick={handleDelete} className="delete-button">
              Kustuta sündmus
            </button>
            <button type="button" onClick={handleEdit} className="edit-button2">
              Muuda sündmust
            </button>
          </div>
        )}
      </div>
    </div>
  );
};


export default EventDetailsModal;
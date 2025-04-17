import React from "react";
import Button from "./Button";
import "../styles/EventDetailsModal.scss";

const EventDetailsModal = ({ event, onClose }) => {
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose(); 
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
        <Button type="button" variant="neutral" onClick={onClose}>
          Sulge
        </Button>
      </div>
    </div>
  );
};

export default EventDetailsModal;
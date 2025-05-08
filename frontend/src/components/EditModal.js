import React, { useState } from "react";
import Button from "./Button";
import "../styles/EventModal.scss";
import baseURL from "../baseURL";

const EventEditModal = ({ event, onClose, onEventUpdated }) => {
  const [formData, setFormData] = useState({
    title: event.title,
    body: event.body,
    time: event.time.split(" ")[1].slice(0, 5), 
    max_capacity: event.max_capacity,
    is_for_children: event.is_for_children,
    is_recurring: event.is_recurring,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const eventDateTime = `${event.time.split(" ")[0]} ${formData.time}:00`;

      console.log("Submitting eventDateTime:", eventDateTime); 

      const response = await fetch(`${baseURL}/events/edit_event.php`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: event.id,
          ...formData,
          time: eventDateTime, 
        }),
      });

      if (response.ok) {
        const updatedEvent = await response.json();
        alert("Event updated successfully!");
        onEventUpdated(updatedEvent);
        onClose();
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error updating event:", error);
      alert("An error occurred while updating the event.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Muuda sündmust</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Nimi:
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Kirjeldus:
            <textarea
              name="body"
              value={formData.body}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Aeg:
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Kogus:
            <input
              type="number"
              name="max_capacity"
              value={formData.max_capacity}
              onChange={handleChange}
              required
            />
          </label>
          <label className="checkbox-label">
            Kas trenn on mõeldud lastele?
            <input
              type="checkbox"
              name="is_for_children"
              checked={formData.is_for_children}
              onChange={handleChange}
            />
          </label>
          <label className="checkbox-label">
            Kas sündmus on korduv?
            <input
              type="checkbox"
              name="is_recurring"
              checked={formData.is_recurring}
              onChange={handleChange}
            />
          </label>
          <div className="button-group">
            <Button type="button" variant="danger" onClick={onClose}>
              Tühista
            </Button>
            <Button type="submit" variant="neutral">
              Salvesta muudatused
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventEditModal;
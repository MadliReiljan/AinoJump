import React, { useState } from "react";
import Button from "./Button";
import ModalMessage from "./ModalMessage";
import "../styles/EventModal.scss";
import baseURL from "../baseURL";

const EventModal = ({ selectedDate, onClose, onEventCreated }) => {
  const [formData, setFormData] = useState({
    title: "",
    body: "",
    time: "",
    max_capacity: 32,
    is_for_children: false,
  });

  const [modal, setModal] = useState({ open: false, title: '', message: '', onClose: null });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const eventDateTime = `${selectedDate} ${formData.time}:00`;
  
      const response = await fetch(`${baseURL}/events/create_event.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          time: eventDateTime,
          is_for_children: formData.is_for_children || false, 
          is_recurring: formData.is_recurring || false, 
        }),
      });
  
      if (response.ok) {
        const responseData = await response.json();
        if (responseData.events) {
          responseData.events.forEach(ev => onEventCreated(ev));
        } else if (responseData.event) {
          onEventCreated(responseData.event);
        }
        setModal({ open: true, title: 'Õnnestus', message: 'Sündmus loodud edukalt!', onClose: () => { setModal(m => ({ ...m, open: false })); onClose(); } });
      } else {
        const errorData = await response.json();
        setModal({ open: true, title: 'Viga', message: `Viga: ${errorData.message}`, onClose: () => setModal(m => ({ ...m, open: false })) });
      }
    } catch (error) {
      console.error("Error creating event:", error);
      setModal({ open: true, title: 'Viga', message: 'Sündmuse loomisel tekkis viga.', onClose: () => setModal(m => ({ ...m, open: false })) });
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Loo uus trenn</h2>
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
            Kas trenn kordub igal nädalal?
            <input
              type="checkbox"
              name="is_recurring"
              checked={formData.is_recurring}
              onChange={handleChange}
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
          <div className="button-group">
            <Button type="button" variant="danger" onClick={onClose}>
              Tühista
            </Button>
            <Button type="submit" variant="neutral">
              Loo trenn
            </Button>
          </div>
        </form>
      </div>
      {modal.open && (
        <ModalMessage
          open={modal.open}
          title={modal.title}
          message={modal.message}
          onClose={modal.onClose}
        />
      )}
    </div>
  );
};


export default EventModal;
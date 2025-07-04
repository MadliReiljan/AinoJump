import React, { useState, useEffect } from "react";
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
    is_recurring: false,
    color: "#4caf50",
  });

  const [favoriteColors, setFavoriteColors] = useState(() => {
    const savedColors = localStorage.getItem("favoriteColors");
    return savedColors ? JSON.parse(savedColors) : ["#4caf50", "#2196F3", "#f44336", "#9c27b0"];
  });

  const [modal, setModal] = useState({ open: false, title: '', message: '', onClose: null });

  useEffect(() => {
    localStorage.setItem("favoriteColors", JSON.stringify(favoriteColors));
  }, [favoriteColors]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const removeColor = (colorToRemove) => {
    setFavoriteColors(favoriteColors.filter(color => color !== colorToRemove));
  };
  
  const addFavoriteColor = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const buttonRect = e.target.getBoundingClientRect();

    const tempInput = document.createElement('input');
    tempInput.type = 'color';
    tempInput.value = formData.color;
    tempInput.style.position = 'fixed';
    tempInput.style.top = `${buttonRect.bottom + 10}px`;
    tempInput.style.left = `${buttonRect.left}px`;
    tempInput.style.opacity = '0';
    tempInput.style.zIndex = '10000';

    tempInput.addEventListener('input', (event) => {
      const newColor = event.target.value;
      setFormData({
        ...formData,
        color: newColor
      });
    });

    tempInput.addEventListener('change', (event) => {
      const newColor = event.target.value;
      if (!favoriteColors.includes(newColor)) {
        const updatedColors = [...favoriteColors, newColor];
        if (updatedColors.length > 12) {
          updatedColors.shift();
        }
        setFavoriteColors(updatedColors);
      }

      setTimeout(() => {
        if (document.body.contains(tempInput)) {
          document.body.removeChild(tempInput);
        }
      }, 500);
    });

    document.addEventListener('click', function removeInput(event) {
      setTimeout(() => {
        if (document.body.contains(tempInput) && event.target !== tempInput) {
          document.body.removeChild(tempInput);
          document.removeEventListener('click', removeInput);
        }
      }, 300);
    }, { once: true }); 

    document.body.appendChild(tempInput);
    tempInput.click();
  };

  const selectColor = (color) => {
    setFormData({
      ...formData,
      color: color
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
          color: formData.color
        }),
      });

      if (response.ok) {
        const responseData = await response.json();
        if (responseData.events) {
          responseData.events.forEach(ev => onEventCreated(ev));
        } else if (responseData.event) {
          onEventCreated(responseData.event);
        }
        setModal({ 
          open: true, 
          title: 'Õnnestus', 
          message: 'Sündmus loodud edukalt!', 
          onClose: () => { 
            setModal(m => ({ ...m, open: false })); 
            onEventCreated(); 
            onClose(); 
          } 
        });
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
          
          <label className="color-picker-label">
            <p>Kalendri värv:</p>
            <div className="color-favorites-container">
              <div className="current-color-row">
                <div 
                  className="current-color-circle"
                  style={{ backgroundColor: formData.color }}
                />
              </div>
              
              <div className="favorite-colors">
                {favoriteColors.map((color, index) => (
                  <div 
                    key={index}
                    className={`color-circle ${formData.color === color ? 'selected' : ''}`}
                    style={{ backgroundColor: color }}
                    onClick={(e) => {
                      e.stopPropagation();
                      selectColor(color);
                    }}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      removeColor(color);
                    }}
                    title="Vali värv (paremklõps kustutamiseks)"
                  />
                ))}
                <div 
                  className="add-color-button"
                  onClick={addFavoriteColor}
                  title="Lisa uus värv"
                >
                  +
                </div>
              </div>
            </div>
            <h5>NB! Parema hiire klõpsuga saab värvi ära kustutada</h5>
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
            <button 
              type="submit" 
              className="modal-edit-button">
              Loo trenn
            </button>
            <button 
              type="button" 
              className="modal-delete-button" 
              onClick={onClose}>
              Tühista
            </button>
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
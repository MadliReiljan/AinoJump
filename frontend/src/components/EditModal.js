import React, { useState, useEffect } from "react";
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
    color: event.color || "#4caf50",
    update_all: false
  });

  const [favoriteColors, setFavoriteColors] = useState(() => {
    const savedColors = localStorage.getItem("favoriteColors");
    return savedColors ? JSON.parse(savedColors) : ["#4caf50", "#2196F3", "#f44336", "#9c27b0"];
  });

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
    const token = localStorage.getItem("token");

    let updateAll = false;
    if (formData.is_recurring) {
      updateAll = window.confirm(
        "Kas soovid värskendada kõiki korduvaid sündmusi selles sarjas?"
      );
    }

    try {
      const eventDateTime = `${event.time.split(" ")[0]} ${formData.time}:00`;

      console.log("Submitting form data with color:", formData.color);

      const response = await fetch(`${baseURL}/events/edit_event.php`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: event.id,
          title: formData.title,
          body: formData.body,
          time: eventDateTime,
          max_capacity: formData.max_capacity,
          is_for_children: formData.is_for_children,
          is_recurring: formData.is_recurring,
          color: formData.color,
          update_all: updateAll
        }),
      });

      if (response.ok) {
        const updatedEvent = await response.json();
        console.log("Updated event received:", updatedEvent);
        
        onEventUpdated(updatedEvent);
        alert("Event updated successfully!");

        window.location.reload();
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
            <p>Nimi:</p>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            <p>Kirjeldus:</p>
            <textarea
              name="body"
              value={formData.body}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            <p>Aeg:</p>
            <input
              type="time"
              name="time"
              className="time-input"
              value={formData.time}
              onChange={handleChange}
              data-force-24h="true"
              required
            />
          </label>
          <label>
            <p>Kogus:</p>
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
          <h5>PS! Parema hiire klõpsuga saab värvi ära kustutada</h5>
        </label>
          
          <label className="checkbox-label">
            <p>Kas see on laste trenn?</p>
            <input
              type="checkbox"
              name="is_for_children"
              checked={formData.is_for_children}
              onChange={handleChange}
            />
          </label>
          <label className="checkbox-label">
            <p>Kas sündmus on korduv?</p>
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
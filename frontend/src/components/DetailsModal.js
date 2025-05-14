import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../auth/Authentication";
import "../styles/EventDetailsModal.scss";
import EventEditModal from "./EditModal";
import baseURL from "../baseURL";

const EventDetailsModal = ({ event, onClose, onReservationChange }) => {
  const { userEmail, userRole } = useContext(AuthContext);
  const [isReserved, setIsReserved] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [reservedCount, setReservedCount] = useState(event.reserved_count || 0);
  const [children, setChildren] = useState([]);
  const [selectedChildId, setSelectedChildId] = useState("");
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

    if (event.is_for_children) {
      const token = localStorage.getItem("token");
      fetch(`${baseURL}/accounts/get_children.php`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.ok ? res.json() : Promise.reject("Failed to fetch children"))
        .then((data) => {
          setChildren(data || []);
          if (data && data.length > 0) {
            setSelectedChildId(data[0].id);
          }
        })
        .catch((err) => console.error(err));
    }
  }, [event.id, event.is_for_children]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleReserve = async () => {
    const token = localStorage.getItem("token");
    try {
      let body;
      if (event.is_for_children) {
        if (!selectedChildId) {
          alert("Palun vali laps, kelle registreerida.");
          return;
        }
        body = { eventId: event.id, childId: selectedChildId };
      } else {
        body = { eventId: event.id };
      }
      const response = await fetch(`${baseURL}/events/reserve_event.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(body),
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
      let body;
      if (event.is_for_children) {
        if (!selectedChildId) {
          alert("Palun vali laps, kellelt broneering eemaldada.");
          return;
        }
        body = { eventId: event.id, childId: selectedChildId };
      } else {
        body = { eventId: event.id };
      }
      const response = await fetch(`${baseURL}/events/reserve_event.php`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(body),
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

  const handleDelete = () => {
  setShowConfirmDelete(true);
  };

  const cancelDeletion = () => {
    setShowConfirmDelete(false);
  };

  const confirmDeletion = async () => {
    const token = localStorage.getItem("token");
    try {
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
      onClose();
      if (onReservationChange) {
        onReservationChange();
      }
    } else {
      const text = await response.text();
      let errorMessage = "Failed to delete the event. Please try again.";
      
      if (text) {
        try {
          const errorData = JSON.parse(text);
          if (errorData.message) {
            errorMessage = errorData.message;
          }
        } catch (jsonError) {
          console.error("Failed to parse error response:", jsonError);
        }
      }
      
      alert(errorMessage);
    }
  } catch (error) {
    console.error("Error during deletion:", error);
    alert("An error occurred. Please try again.");
  } finally {
    setShowConfirmDelete(false);
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

        {showConfirmDelete && (
        <div className="confirm-delete-overlay">
          <div className="confirm-delete-modal">
            <p>Kas olete kindel, et soovite selle sündmuse kustutada?</p>
            <div className="confirm-delete-buttons">
              <button onClick={confirmDeletion} className="confirm-yes-button">Jah</button>
              <button onClick={cancelDeletion} className="confirm-no-button">Ei</button>
            </div>
          </div>
        </div>
      )}

      {userRole !== "owner" && (
          <>
            {event.is_for_children === 1 && !isReserved && (
              <div className="child-select-container">
                {children.length > 0 ? (
                  <>
                    <label htmlFor="child-select"><strong>Vali laps:</strong></label>
                    <select
                      id="child-select"
                      value={selectedChildId}
                      onChange={e => setSelectedChildId(e.target.value)}
                    >
                      <option value="">-- Vali laps --</option>
                      {children.map(child => (
                        <option key={child.id} value={child.id}>
                          {child.full_name}
                        </option>
                      ))}
                    </select>
                  </>
                ) : (
                  <p>Sa ei ole veel lisanud ühtegi last oma kontole.</p>
                )}
              </div>
            )}

            {isReserved && (
              <p className="reserved-message">Oled juba registreeritud!</p>
            )}

            {isReserved && !event.is_for_children ? (
              <button type="button" onClick={handleUnreserve} className="reserve-button">
                Vabasta koht
              </button>
            ) : !isReserved ? (
              <button type="button" onClick={handleReserve} disabled={spotsLeft <= 0} className="reserve-button">
                {spotsLeft <= 0 ? "Kohad täis" : "Reserveeri koht"}
              </button>
            ) : null}

            {Boolean(event.is_for_children) && isReserved && (
              <button type="button" onClick={handleUnreserve} className="reserve-button">
                Vabasta valitud lapse koht
              </button>
            )}
          </>
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
            <button type="button" onClick={handleEdit} className="edit-button2">
              Muuda sündmust
            </button>
            <button type="button" onClick={handleDelete} className="subtle-delete-button">
              Kustuta see sündmus
            </button>
          </div>
        )}
      </div>
    </div>
  );
};


export default EventDetailsModal;
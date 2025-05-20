import React, { useEffect, useState } from "react";
import baseURL from "../baseURL";
import "../styles/ParticipationsModal.scss";
import ModalMessage from "./ModalMessage";

const ParticipationsModal = ({ eventId, onClose, onReservationChange }) => {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);
  const [modal, setModal] = useState({ open: false, title: '', message: '', onClose: null, onConfirm: null });

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`${baseURL}/events/get_event_participants.php?eventId=${eventId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.ok ? res.json() : Promise.reject("Failed to fetch"))
      .then(data => setParticipants(data || []))
      .catch(() => setParticipants([]))
      .finally(() => setLoading(false));
  }, [eventId]);

  const handleRemove = (reservationId) => {
    setModal({
      open: true,
      title: 'Kinnitus',
      message: 'Oled kindel, et soovid selle osaleja eemaldada?',
      onClose: () => setModal(m => ({ ...m, open: false })),
      onConfirm: () => confirmRemove(reservationId),
      onCancel: () => setModal(m => ({ ...m, open: false })),
    });
  };

  const confirmRemove = async (reservationId) => {
    setModal(m => ({ ...m, open: false }));
    setRemovingId(reservationId);
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${baseURL}/events/delete_reservation.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reservationId }),
      });
      if (!res.ok) throw new Error("Eemaldamine ebaõnnestus");
      setParticipants(prev => prev.filter(p => p.id !== reservationId));
      setModal({
        open: true,
        title: 'Eemaldatud',
        message: 'Osaleja broneering eemaldati edukalt.',
        onClose: () => setModal(m => ({ ...m, open: false })),
      });
      if (onReservationChange) onReservationChange(-1); // update vabu kohti
    } catch (e) {
      setModal({
        open: true,
        title: 'Viga',
        message: 'Eemaldamine ebaõnnestus',
        onClose: () => setModal(m => ({ ...m, open: false })),
      });
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>×</button>
        <h2>Osalejad</h2>
        {loading ? (
          <p>Laadimine...</p>
        ) : (
          <div className="participants-list">
            {participants.length === 0 ? (
              <p>Ühtegi osalejat ei ole.</p>
            ) : (
              <ul>
                {participants.map((p, idx) => (
                  <li key={p.id || idx} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span>{p.full_name || p.email}</span>
                    <button
                      className="remove-reservation-btn"
                      onClick={() => handleRemove(p.id)}
                      disabled={removingId === p.id}
                      title="Eemalda broneering"
                      style={{ marginLeft: 8, color: 'red', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.1em' }}
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
        {modal.open && (
          <ModalMessage
            open={modal.open}
            title={modal.title}
            message={modal.message}
            onClose={modal.onClose}
            onConfirm={modal.onConfirm}
            onCancel={modal.onCancel}
          />
        )}
      </div>
    </div>
  );
};

export default ParticipationsModal;

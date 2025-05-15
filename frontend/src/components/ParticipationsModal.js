import React, { useEffect, useState } from "react";
import baseURL from "../baseURL";
import "../styles/ParticipationsModal.scss";

const ParticipationsModal = ({ eventId, onClose }) => {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);

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
              <p>Ühtegi osalejat pole.</p>
            ) : (
              <ul>
                {participants.map((p, idx) => (
                  <li key={p.id || idx}>{p.full_name || p.email}</li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ParticipationsModal;

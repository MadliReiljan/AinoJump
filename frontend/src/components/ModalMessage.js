import React from "react";
import "../styles/EventModal.scss";

const ModalMessage = ({ open, onClose, title, message, onConfirm, onCancel, confirmText, cancelText }) => {
  if (!open) return null;
  return (
    <div className="modal-overlay" onClick={onCancel || onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="close-button" onClick={onCancel || onClose}>&times;</button>
        {title && <h2>{title}</h2>}
        <p>{message}</p>
        {(onConfirm && onCancel) ? (
          <div className="modal-actions">
            <button className="modal-btn yes" onClick={onConfirm}>{confirmText || 'Jah'}</button>
            <button className="modal-btn no" onClick={onCancel}>{cancelText || 'Ei'}</button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ModalMessage;

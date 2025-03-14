import React from "react";
import "../styles/css/ConfirmDeleteModal.css";

const ConfirmDeleteModal = ({ title, message, details, onConfirm, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>{title}</h3>
        <p>{message}</p>
        <ul className="modal-details">
          {details.map((detail, index) => (
            <li key={index}>
              <strong>{detail.label}:</strong> {detail.value}
            </li>
          ))}
        </ul>
        <div className="modal-actions">
          <button className="delete-btn" onClick={onConfirm}>Delete</button>
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;

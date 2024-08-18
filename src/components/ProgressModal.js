// src/components/ProgressModal.js
import React from 'react';
import '../styles/ProgressModal.css';

const ProgressModal = ({ isOpen, title, message, progress, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="progress-modal-overlay">
      <div className="progress-modal">
        <h2>{title}</h2>
        <p>{message}</p>
        <div className="progress-bar">
          <div
            className="progress-bar-fill"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <button onClick={onClose} disabled={progress < 100}>
          Close
        </button>
      </div>
    </div>
  );
};

export default ProgressModal;

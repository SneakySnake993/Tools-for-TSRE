import React, { useState } from 'react';
import '../styles/CredentialsModal.css';

const CredentialsModal = ({ isOpen, onClose, onSubmit, error }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = () => {
    if (username && password) {
      onSubmit(username, password);
    } else {
      // Display a local error if username or password is missing
      onSubmit(null, null);
    }
  };

  return isOpen ? (
    <div className="credentials-modal-overlay">
      <div className="credentials-modal">
        <h2>A NASA Earthdata login is required to download the files</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="error">{error}</p>}
        <div className="button-group">
          <button className="login-button" onClick={handleSubmit}>
            Login
          </button>
          <button className="cancel-button" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  ) : null;
};

export default CredentialsModal;

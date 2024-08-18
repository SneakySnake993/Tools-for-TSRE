import React from 'react';
import '../styles/LoadingSpinner.css';

const LoadingSpinner = ( {message} ) => (
  <div className="spinner-overlay">
    <div className="spinner"></div>
    <p className="loading-message">{message}</p>  
  </div>
);

export default LoadingSpinner;

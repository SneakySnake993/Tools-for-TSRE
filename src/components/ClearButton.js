import React from 'react';

function ClearButton({ onClear }) {
  return (
    <button onClick={onClear} className="clear-button">
      Clear Drawings
    </button>
  );
}

export default ClearButton;

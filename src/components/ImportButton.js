import React from 'react';

function ImportButton({ selectedArea, onImport }) {
  const handleClick = () => {
    if (selectedArea) {
      onImport();
    } else {
      alert('Please select an area on the map before importing data.');
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`import-button ${selectedArea ? '' : 'disabled'}`}
    >
      Import Geographic Data
    </button>
  );
}

export default ImportButton;

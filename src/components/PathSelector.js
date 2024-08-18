import React from 'react';
import { open } from '@tauri-apps/api/dialog';
import '../styles/PathSelector.css';

const PathSelector = ({ message, placeholder, value, onChange }) => {

  const handleBrowse = async () => {
    const selectedPath = await open({
      directory: true, // false to select a single file
      multiple: false, // true to allow multiple files
      title: message,
    });
    
    if (selectedPath) {
      onChange(selectedPath);
    }
  };

  return (
    <div className="path-selector">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
      <button onClick={handleBrowse}>Browse</button>
    </div>
  );
};

export default PathSelector;

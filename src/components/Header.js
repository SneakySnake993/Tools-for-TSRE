import React from 'react';
import icon from '../assets/icons/icon.png'
import '../styles/index.css';

function Header() {
  return (
    <header className="app-header">
      <h1 className="page-title">Tools4TSRE</h1>
      <img src={icon} alt="Icon" className="title-icon"/>
    </header>
  );
}

export default Header;

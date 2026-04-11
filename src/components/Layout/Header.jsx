import React from 'react';
import './layout.css';

export function Header() {
  return (
    <header className="site-header">
      <div className="header-content max-width-container">
        <div className="logo-placeholder">
          <img
            src="https://cdn.discordapp.com/attachments/1475530537748926635/1491800134043046108/image.png?ex=69d9ab64&is=69d859e4&hm=6aa677f2f324c3fdc8705b064826740e315f7dd8d7100bf4ac7a85b8c8461a46"
            alt="RelayPay Logo"
            height="40"
            style={{ display: 'block' }}
          />
        </div>
        <div className="header-titles">
          <h1 className="header-title">Customer Support</h1>
          <p className="header-subtitle">We are here to help you</p>
        </div>
      </div>
    </header>
  );
}

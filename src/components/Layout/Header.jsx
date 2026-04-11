import React from 'react';
import logo from '../../assets/relaypay-logo.png';
import './layout.css';

export function Header() {
  return (
    <header className="site-header">
      <div className="header-content max-width-container">
        <div className="logo-placeholder">
          <img
            src={logo}
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

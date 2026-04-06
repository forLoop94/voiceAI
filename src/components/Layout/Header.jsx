import React from 'react';
import './layout.css';

export function Header() {
  return (
    <header className="site-header">
      <div className="header-content max-width-container">
        <div className="logo-placeholder">
          {/* REPLACE ME: Place relaypay-logo.png in /public and update src below */}
          <div className="logo-box" aria-hidden="true">[RELAYPAY_LOGO_HERE]</div>
          {/* <img src="/relaypay-logo.png" alt="RelayPay Logo" height="40" /> */}
        </div>
        <div className="header-titles">
          <h1 className="header-title">Customer Support</h1>
          <p className="header-subtitle">We are here to help you</p>
        </div>
      </div>
    </header>
  );
}

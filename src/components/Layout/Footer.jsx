import React from 'react';
import './layout.css';

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-content max-width-container">
        <p className="copyright">&copy; {new Date().getFullYear()} RelayPay. All rights reserved.</p>
        <div className="footer-links">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Contact</a>
        </div>
      </div>
    </footer>
  );
}

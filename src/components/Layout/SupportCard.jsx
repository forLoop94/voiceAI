import React from 'react';
import './layout.css';

export function SupportCard({ children }) {
  return (
    <main className="main-content max-width-container">
      <div className="support-card">
        <div className="support-intro">
          <h2>AI Voice Assistant</h2>
          <p>
            Speak directly with our AI support agent to get help with payments, invoices, or account settings.
          </p>
        </div>
        
        <div className="support-content">
          {children}
        </div>
      </div>
    </main>
  );
}

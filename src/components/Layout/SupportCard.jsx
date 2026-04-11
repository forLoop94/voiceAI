import React from 'react';
import './layout.css';

export function SupportCard({ children, title, description }) {
  return (
    <main className="main-content max-width-container">
      <div className="support-card">
        <div className="support-intro">
          <h2>{title}</h2>
          {description && <p>{description}</p>}
        </div>
        
        <div className="support-content">
          {children}
        </div>
      </div>
    </main>
  );
}

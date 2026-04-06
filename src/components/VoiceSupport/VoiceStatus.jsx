import React from 'react';
import './voicestatus.css';

export function VoiceStatus({ status, micPermission }) {
  const getStatusText = () => {
    switch(status) {
      case 'initializing': return 'Connecting to assistant...';
      case 'idle': return 'Click below to start an audio session';
      case 'ready': return 'Connected. Waiting to speak.';
      case 'listening': return 'Listening...';
      case 'processing': return 'Processing...';
      case 'error': return 'An error occurred. Check notifications.';
      default: return '';
    }
  };

  const getStatusDotClass = () => {
    if (status === 'listening') return 'status-dot listening';
    if (status === 'processing') return 'status-dot processing';
    if (status === 'ready' || status === 'initializing') return 'status-dot ready';
    if (status === 'error' || micPermission === 'denied') return 'status-dot error';
    return 'status-dot idle';
  };

  return (
    <div className="voice-status-container">
      <div className={getStatusDotClass()} aria-hidden="true"></div>
      <span className="status-text">{getStatusText()}</span>
    </div>
  );
}

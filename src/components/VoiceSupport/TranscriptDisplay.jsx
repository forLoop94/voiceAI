import React, { useEffect, useRef } from 'react';
import './transcript.css';

export function TranscriptDisplay({ transcriptHistory = [] }) {
  const scrollRef = useRef(null);

  // Auto-scroll to bottom whenever history updates
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [transcriptHistory]);

  const formatTime = (date) => {
    if (!date) return '';
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!transcriptHistory || transcriptHistory.length === 0) {
    return (
      <div className="transcript-empty">
        Your conversation transcript will appear here.
      </div>
    );
  }

  return (
    <div className="transcript-container">
      <div className="transcript-header">Live Transcript</div>
      <div className="transcript-scroll-area" ref={scrollRef}>
        {transcriptHistory.map((msg, index) => (
          <div 
            key={index} 
            className={`transcript-message ${msg.role === 'user' ? 'message-user' : 'message-assistant'}`}
          >
            <div className="message-bubble">
              <div className="message-role">
                {msg.role === 'user' ? 'You' : 'AI Assistant'}
              </div>
              <div className="message-text">{msg.text}</div>
              <div className="message-time">{formatTime(msg.timestamp)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

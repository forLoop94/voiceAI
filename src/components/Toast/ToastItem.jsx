import React, { useEffect, useState } from 'react';

export function ToastItem({ toast, removeToast }) {
  const { id, message, type } = toast;
  const [isClosing, setIsClosing] = useState(false);

  // Duration: 5 seconds for errors, 3 seconds for success/info
  const duration = type === 'error' ? 5000 : 3000;

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration]);

  const handleClose = () => {
    setIsClosing(true);
    // Wait for animation to finish before removing from state
    setTimeout(() => {
      removeToast(id);
    }, 300); // 300ms matches css transition
  };

  return (
    <div className={`toast-item toast-${type} ${isClosing ? 'toast-closing' : ''}`} role="alert">
      <div className="toast-content">
        <span>{message}</span>
      </div>
      <button 
        className="toast-close" 
        onClick={handleClose}
        aria-label="Close notification"
      >
        &times;
      </button>
    </div>
  );
}

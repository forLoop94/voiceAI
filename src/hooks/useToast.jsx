import React, { createContext, useContext, useState, useCallback } from 'react';
import { ToastContainer } from '../components/Toast/ToastContainer';

// Create context
const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2);
    setToasts((prev) => {
      // Keep only up to 2 existing toasts (to make 3 total max)
      const currentToasts = [...prev, { id, message, type }];
      if (currentToasts.length > 3) {
        return currentToasts.slice(currentToasts.length - 3);
      }
      return currentToasts;
    });
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

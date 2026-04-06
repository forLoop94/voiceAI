import React from 'react';
import { ToastItem } from './ToastItem';
import '../../styles/toast.css';

export function ToastContainer({ toasts, removeToast }) {
  return (
    <div className="toast-container" aria-live="polite">
      {toasts.map((toast) => (
        <ToastItem 
          key={toast.id} 
          toast={toast} 
          removeToast={removeToast} 
        />
      ))}
    </div>
  );
}

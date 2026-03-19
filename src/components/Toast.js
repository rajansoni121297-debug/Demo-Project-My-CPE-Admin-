import React, { useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';
import './Toast.css';

const ICONS = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
};

const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const Icon = ICONS[type] || CheckCircle;

  return (
    <div className={`toast toast--${type}`}>
      <Icon size={20} className="toast-icon" />
      <span className="toast-message">{message}</span>
      <button className="toast-close" onClick={onClose}><X size={16} /></button>
    </div>
  );
};

export default Toast;

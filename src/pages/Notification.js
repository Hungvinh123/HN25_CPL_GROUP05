import React, { useEffect } from 'react';
import './Notification.css';

const Notification = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`notification-container ${type === 'error' ? 'error' : ''}`}>
      <div className="notification-progress"></div>
      <span className="notification-text">{message}</span>
    </div>
  );
};

export default Notification;
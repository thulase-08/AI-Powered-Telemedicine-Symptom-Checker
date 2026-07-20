import React, { useState, useEffect, createContext, useContext } from 'react';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

// Toast Context
const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'success', duration = 4000) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    
    if (duration > 0) {
      setTimeout(() => removeToast(id), duration);
    }
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div style={{
        position: 'fixed',
        top: '80px',
        right: '20px',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        maxWidth: '400px',
        width: 'calc(100% - 40px)'
      }}>
        {toasts.map(toast => (
          <Toast key={toast.id} {...toast} onClose={() => removeToast(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

const Toast = ({ message, type, onClose }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 10);
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 300);
  };

  const icons = {
    success: <CheckCircle size={20} />,
    error: <XCircle size={20} />,
    warning: <AlertCircle size={20} />,
    info: <AlertCircle size={20} />
  };

  const colors = {
    success: { bg: '#f0fdf4', border: '#22c55e', text: '#166534', icon: '#22c55e' },
    error: { bg: '#fef2f2', border: '#ef4444', text: '#991b1b', icon: '#ef4444' },
    warning: { bg: '#fffbeb', border: '#f59e0b', text: '#92400e', icon: '#f59e0b' },
    info: { bg: '#eff6ff', border: '#3b82f6', text: '#1e40af', icon: '#3b82f6' }
  };

  const style = colors[type] || colors.info;

  return (
    <div style={{
      background: style.bg,
      border: `1px solid ${style.border}`,
      borderLeft: `4px solid ${style.border}`,
      borderRadius: '8px',
      padding: '1rem',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '0.75rem',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      transform: visible ? 'translateX(0)' : 'translateX(100%)',
      opacity: visible ? 1 : 0,
      transition: 'all 0.3s ease'
    }}>
      <span style={{ color: style.icon, flexShrink: 0, marginTop: '2px' }}>
        {icons[type] || icons.info}
      </span>
      <p style={{ 
        color: style.text, 
        fontSize: '0.875rem', 
        lineHeight: '1.5',
        margin: 0,
        flex: 1
      }}>
        {message}
      </p>
      <button 
        onClick={handleClose}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '0',
          color: style.text,
          opacity: 0.6,
          transition: 'opacity 0.2s',
          flexShrink: 0
        }}
        onMouseEnter={e => e.target.style.opacity = 1}
        onMouseLeave={e => e.target.style.opacity = 0.6}
      >
        <X size={16} />
      </button>
    </div>
  );
};

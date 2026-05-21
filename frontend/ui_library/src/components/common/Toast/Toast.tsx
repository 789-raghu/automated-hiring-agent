import React, { createContext, useCallback, useContext, useState } from 'react';
import './Toast.css';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastItem {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
  exiting?: boolean;
}

interface ToastContextValue {
  toast: (opts: Omit<ToastItem, 'id' | 'exiting'>) => string;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts(prev => prev.map(t => t.id === id ? { ...t, exiting: true } : t));
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 220);
  }, []);

  const toast = useCallback((opts: Omit<ToastItem, 'id' | 'exiting'>) => {
    const id = Math.random().toString(36).slice(2, 9);
    const duration = opts.duration ?? 4000;
    setToasts(prev => [...prev.slice(-4), { ...opts, id, duration }]);
    if (duration > 0) setTimeout(() => dismiss(id), duration);
    return id;
  }, [dismiss]);

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
};


// eslint-disable-next-line react-refresh/only-export-components
export const useToast = (): ToastContextValue => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
};

const ICONS: Record<ToastType, React.ReactNode> = {
  success: (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <polyline points="2,6 5,9 10,3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  error: (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <line x1="2" y1="2" x2="10" y2="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="10" y1="2" x2="2" y2="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  warning: (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <line x1="6" y1="3" x2="6" y2="7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="6" cy="9.5" r="1" fill="currentColor" />
    </svg>
  ),
  info: (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <line x1="6" y1="5" x2="6" y2="9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="6" cy="2.5" r="1" fill="currentColor" />
    </svg>
  ),
};

const ToastContainer: React.FC<{ toasts: ToastItem[]; onDismiss: (id: string) => void }> = ({
  toasts,
  onDismiss,
}) => (
  <div className="toast-container" role="region" aria-label="Notifications" aria-live="polite">
    {toasts.map(t => (
      <div
        key={t.id}
        className={`toast toast--${t.type}${t.exiting ? ' toast--exiting' : ''}`}
        role="alert"
      >
        <span className="toast__icon">{ICONS[t.type]}</span>
        <div className="toast__body">
          {t.title && <p className="toast__title">{t.title}</p>}
          <p className="toast__message">{t.message}</p>
        </div>
        <button
          className="toast__close"
          onClick={() => onDismiss(t.id)}
          aria-label="Dismiss notification"
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <line x1="1" y1="1" x2="9" y2="9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="9" y1="1" x2="1" y2="9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    ))}
  </div>
);

import { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success') => {
    const id = crypto.randomUUID();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }, []);

  const colors = {
    success: 'bg-secondary/20 border-secondary/30 text-secondary',
    error: 'bg-error/20 border-error/30 text-error',
    warning: 'bg-tertiary/20 border-tertiary/30 text-tertiary',
    info: 'bg-primary/20 border-primary/30 text-primary',
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-6 right-6 z-50 space-y-3">
        {toasts.map(toast => (
          <div key={toast.id} className={`toast-enter px-5 py-3 rounded-xl border text-sm font-bold font-label ${colors[toast.type] || colors.info}`}>
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);

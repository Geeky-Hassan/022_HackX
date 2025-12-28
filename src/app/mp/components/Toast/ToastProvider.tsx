"use client";
import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import Toast, { ToastStatus, ToastProps, ToastPosition } from "./Toast";

interface ToastData {
  id: string;
  message: string;
  status: ToastStatus;
  duration?: number;
  position?: ToastPosition;
  button?: {
    title: string;
    onClick: () => void;
  };
  closing?: boolean;
  showClose?: boolean;
}

interface ToastContextType {
  showToast: (toast: Omit<ToastData, "id">) => string;
  hideToast: (id: string) => void;
  hideAllToasts: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const showToast = useCallback((toast: Omit<ToastData, "id">) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: ToastData = { ...toast, id };

    setToasts((prevToasts) => [...prevToasts, newToast]);
    return id;
  }, []);

  const hideToast = useCallback((id: string) => {
    setToasts((prevToasts) => prevToasts.map((t) => (t.id === id ? { ...t, closing: true } : t)));
  }, []);

  const hideAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  const contextValue: ToastContextType = {
    showToast,
    hideToast,
    hideAllToasts,
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      {/* Render toasts */}
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          id={toast.id}
          message={toast.message}
          status={toast.status}
          duration={toast.duration}
          position={toast.position}
          button={toast.button}
          closing={toast.closing}
          requestClose={hideToast}
          onExited={(id) =>
            setToasts((prev) => prev.filter((t) => t.id !== id))
          }
          showClose={toast.showClose}
        />
      ))}
    </ToastContext.Provider>
  );
};

export default ToastProvider;

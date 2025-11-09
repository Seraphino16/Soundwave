import { useState, useCallback } from 'react';

export interface AlertItem {
  id: number;
  type: "error" | "warning" | "info" | "success";
  title: string;
  message: string;
}

export const useAlert = () => {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);

  const showAlert = useCallback((type: AlertItem['type'], title: string, message: string) => {
    const newAlert: AlertItem = {
      id: Date.now(),
      type,
      title,
      message,
    };

    setAlerts(prev => [...prev, newAlert]);

    setTimeout(() => {
      setAlerts(prev => prev.filter(alert => alert.id !== newAlert.id));
    }, 5000);
  }, []);

  const removeAlert = useCallback((id: number) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  }, []);

  const showSuccess = useCallback((title: string, message: string) => {
    showAlert('success', title, message);
  }, [showAlert]);

  const showError = useCallback((title: string, message: string) => {
    showAlert('error', title, message);
  }, [showAlert]);

  const showWarning = useCallback((title: string, message: string) => {
    showAlert('warning', title, message);
  }, [showAlert]);

  const showInfo = useCallback((title: string, message: string) => {
    showAlert('info', title, message);
  }, [showAlert]);

  return {
    alerts,
    showAlert,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    removeAlert,
  };
};

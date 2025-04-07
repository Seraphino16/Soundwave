/**
 * @description Page de test des différentes alertes. 
 * @author SoundWave
 * */

import React, { useState } from 'react';
import Alert from '../components/utils/Alert';

interface AlertProps {
  id: number;
  type: "error" | "warning" | "info" | "success";
  title: string;
  message: string;
}

const AlertTestPage: React.FC = () => {
  const [alerts, setAlerts] = useState<AlertProps[]>([]);

  const showAlert = (type: "error" | "warning" | "info" | "success", title: string, message: string) => {
    const newAlert = { id: Date.now(), type, title, message };
    setAlerts((prevAlerts) => [...prevAlerts, newAlert]);

    setTimeout(() => {
      removeAlert(newAlert.id);
    }, 15000);
  };

  const removeAlert = (id: number) => {
    setAlerts((prevAlerts) => prevAlerts.filter(alert => alert.id !== id));
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen ">
      <h1 className="text-4xl font-bold text-red-500 mb-4">
        tailwindcss
      </h1>
      <div className="space-x-2">
        <button onClick={() => showAlert('success', 'Success', 'This is a success message')} className="bg-green-500 text-white px-4 py-2 rounded">Success</button>
        <button onClick={() => showAlert('error', 'Error', 'This is an error message')} className="bg-red-500 text-white px-4 py-2 rounded">Error</button>
        <button onClick={() => showAlert('info', 'Info', 'This is an info message')} className="bg-blue-500 text-white px-4 py-2 rounded">Info</button>
        <button onClick={() => showAlert('warning', 'Warning', 'This is a warning message')} className="bg-yellow-500 text-white px-4 py-2 rounded">Warning</button>
      </div>
      <div className="fixed bottom-0 right-0 m-4 space-y-2">
        {alerts.map(alert => (
          <Alert key={alert.id} id={alert.id} type={alert.type} title={alert.title} message={alert.message} onClose={removeAlert} />
        ))}
      </div>
    </div>
  );
};

export default AlertTestPage;
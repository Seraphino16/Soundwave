/**
 * @description Conteneur pour afficher les alertes en position fixe
 * @author SoundWave
 */

import React from 'react';
import Alert from '../utils/Alert';
import { AlertItem } from '../../hooks/useAlert';

interface AlertContainerProps {
  alerts: AlertItem[];
  onRemoveAlert: (id: number) => void;
}

const AlertContainer: React.FC<AlertContainerProps> = ({ alerts, onRemoveAlert }) => {
  if (alerts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 space-y-2 z-50">
      {alerts.map((alert) => (
        <Alert
          key={alert.id}
          id={alert.id}
          type={alert.type}
          title={alert.title}
          message={alert.message}
          onClose={onRemoveAlert}
        />
      ))}
    </div>
  );
};

export default AlertContainer;

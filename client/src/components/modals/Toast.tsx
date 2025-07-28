import React, { useEffect } from 'react';

interface ToastProps {
    message: string;
    type: 'success' | 'error' | 'info';
    isVisible: boolean;
    onClose: () => void;
    duration?: number;
}

const Toast: React.FC<ToastProps> = ({
    message,
    type,
    isVisible,
    onClose,
    duration = 3000
}) => {
    useEffect(() => {
        if (isVisible && duration > 0) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [isVisible, duration, onClose]);

    if (!isVisible) return null;

    const getToastStyles = () => {
        switch (type) {
            case 'success':
                return 'bg-green-500 text-white';
            case 'error':
                return 'bg-red-500 text-white';
            case 'info':
            default:
                return 'bg-blue-500 text-white';
        }
    };

    const getIcon = () => {
        switch (type) {
            case 'success':
                return '✓';
            case 'error':
                return '✕';
            case 'info':
            default:
                return 'ℹ';
        }
    };

    return (
        <div className="fixed top-4 right-4 z-50">
            <div className={`flex items-center p-4 rounded-lg shadow-lg max-w-md ${getToastStyles()}`}>
                <span className="text-lg mr-3">{getIcon()}</span>
                <span className="flex-1">{message}</span>
                <button
                    onClick={onClose}
                    className="ml-3 text-lg font-bold hover:opacity-75"
                >
                    ×
                </button>
            </div>
        </div>
    );
};

export default Toast;

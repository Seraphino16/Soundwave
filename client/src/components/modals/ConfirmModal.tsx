import React from 'react';

interface ConfirmModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
    variant?: 'danger' | 'info';
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
    isOpen,
    title,
    message,
    confirmText = 'Confirmer',
    cancelText = 'Annuler',
    onConfirm,
    onCancel,
    variant = 'info'
}) => {
    if (!isOpen) return null;

    const confirmButtonClass = variant === 'danger' 
        ? 'bg-red-600 hover:bg-red-700 text-white'
        : 'bg-primaryBlue hover:bg-blue-700 text-white';

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {title}
                </h3>
                <p className="text-gray-600 mb-6">
                    {message}
                </p>
                <div className="flex justify-end space-x-3">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`px-4 py-2 rounded-md transition-colors ${confirmButtonClass}`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;

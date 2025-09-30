/**
 * @description Modale de confirmation pour la suppression de compte
 * @author SoundWave
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUserContext } from "../../context/UserContext";

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isDeleting: boolean;
}

const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isDeleting,
}) => {
  const { user } = useUserContext();
  const [confirmChecked, setConfirmChecked] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setConfirmChecked(false);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (confirmChecked) {
      await onConfirm();
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={handleBackdropClick}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ 
              duration: 0.3, 
              ease: [0.4, 0.0, 0.2, 1] 
            }}
            className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
        <div className="bg-red-500 px-6 py-4">
          <div className="flex items-center">
            <div className="text-white text-2xl mr-3">⚠️</div>
            <h2 className="text-xl font-bold text-white">Supprimer le compte</h2>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <p className="text-gray-700 mb-3">
              Vous êtes sur le point de <span className="font-semibold text-red-600">supprimer définitivement</span> votre compte.
            </p>
            <p className="text-gray-700 mb-3">
              Cette action est <span className="font-semibold">irréversible</span> et entraînera :
            </p>
            <ul className="text-sm text-gray-600 space-y-1 ml-4">
              <li>• La suppression de tous vos playlists</li>
              <li>• La perte de tous vos favoris</li>
              <li>• La perte de tous vos abonnements et abonnés</li>
            </ul>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <div className="flex items-start space-x-3 p-4 border-2 border-red-200 bg-red-50 rounded-lg">
                <input
                  type="checkbox"
                  id="confirmDeletion"
                  checked={confirmChecked}
                  onChange={(e) => setConfirmChecked(e.target.checked)}
                  disabled={isDeleting}
                  className="mt-1 h-4 w-4 text-red-600 border-red-300 rounded focus:ring-red-500"
                />
                <label htmlFor="confirmDeletion" className="text-sm font-medium text-red-800">
                  Je comprends que cette action est irréversible et je souhaite supprimer définitivement mon compte <span className="font-bold">{user?.username}</span>
                </label>
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isDeleting}
                className="hover:cursor-pointer flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                Retour
              </button>
              <button
                type="submit"
                disabled={!confirmChecked || isDeleting}
                className="hover:cursor-pointer flex-1 px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center"
              >
                {isDeleting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Suppression...
                  </>
                ) : (
                  "Supprimer définitivement"
                )}
              </button>
            </div>
          </form>
          </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DeleteAccountModal;

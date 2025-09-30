/**
 * @description Service pour les opérations liées à l'édition du profil utilisateur
 * @author SoundWave
 */

const API_BASE_URL = 'http://localhost:5001';

export interface DeleteAccountResponse {
  success: boolean;
  message?: string;
}

export interface FileValidationResult {
  isValid: boolean;
  message?: string;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ChangePasswordResponse {
  success: boolean;
  message?: string;
}

export class EditProfileTabService {
  /**
   * Supprime définitivement le compte utilisateur
   * @param userId ID de l'utilisateur à supprimer
   * @returns Promise<DeleteAccountResponse>
   */
  static async deleteAccount(userId: number): Promise<DeleteAccountResponse> {
    try {
      console.log("Tentative de suppression pour l'utilisateur:", userId);
      
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Réponse de l'API:", response.status, response.statusText);

      if (response.ok) {
        return {
          success: true,
          message: "Compte supprimé avec succès"
        };
      } else {
        const errorData = await response.json();
        console.error("Erreur API:", errorData);
        return {
          success: false,
          message: errorData.message || "Accès non autorisé"
        };
      }
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      return {
        success: false,
        message: "Erreur de connexion lors de la suppression du compte"
      };
    }
  }

  /**
   * Valide un fichier image avant l'upload
   * @param file Le fichier à valider
   * @returns FileValidationResult
   */
  static validateImageFile(file: File): FileValidationResult {
    if (!file.type.startsWith("image/")) {
      return {
        isValid: false,
        message: "Veuillez sélectionner un fichier image"
      };
    }

    if (file.size > 5 * 1024 * 1024) {
      return {
        isValid: false,
        message: "Le fichier est trop volumineux. Taille maximale: 5MB"
      };
    }

    return {
      isValid: true
    };
  }

  /**
   * Nettoie les données locales après suppression du compte
   */
  static clearLocalData(): void {
    localStorage.removeItem('token');
    sessionStorage.clear();
  }

  /**
   * Redirige vers la page d'accueil après suppression
   */
  static redirectToHome(): void {
    window.location.href = "/";
  }

  /**
   * Change le mot de passe de l'utilisateur
   * @param userId ID de l'utilisateur
   * @param passwordData Données du changement de mot de passe
   * @returns Promise<ChangePasswordResponse>
   */
  static async changePassword(userId: number, passwordData: ChangePasswordRequest): Promise<ChangePasswordResponse> {
    try {
      console.log("Tentative de changement de mot de passe pour l'utilisateur:", userId);
      
      const response = await fetch(`${API_BASE_URL}/users/${userId}/password`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(passwordData),
      });

      if (response.ok) {
        const data = await response.json();
        return {
          success: true,
          message: data.message || "Mot de passe changé avec succès"
        };
      } else {
        const errorData = await response.json();
        console.error("Erreur API:", errorData);
        return {
          success: false,
          message: errorData.message || "Erreur lors du changement de mot de passe"
        };
      }
    } catch (error) {
      console.error("Erreur lors du changement de mot de passe:", error);
      return {
        success: false,
        message: "Erreur de connexion lors du changement de mot de passe"
      };
    }
  }

  /**
   * Valide les données de changement de mot de passe
   * @param passwordData Données à valider
   * @returns FileValidationResult
   */
  static validatePasswordChange(passwordData: ChangePasswordRequest): FileValidationResult {
    if (!passwordData.oldPassword) {
      return {
        isValid: false,
        message: "L'ancien mot de passe est requis"
      };
    }

    if (!passwordData.newPassword) {
      return {
        isValid: false,
        message: "Le nouveau mot de passe est requis"
      };
    }

    if (passwordData.newPassword.length < 6) {
      return {
        isValid: false,
        message: "Le mot de passe doit contenir au moins 6 caractères"
      };
    }

    if (!/[A-Z]/.test(passwordData.newPassword)) {
      return {
        isValid: false,
        message: "Le mot de passe doit contenir au moins une majuscule"
      };
    }

    if (!/[a-z]/.test(passwordData.newPassword)) {
      return {
        isValid: false,
        message: "Le mot de passe doit contenir au moins une minuscule"
      };
    }

    if (!/[0-9]/.test(passwordData.newPassword)) {
      return {
        isValid: false,
        message: "Le mot de passe doit contenir au moins un chiffre"
      };
    }

    if (!/[@$!%*?&]/.test(passwordData.newPassword)) {
      return {
        isValid: false,
        message: "Le mot de passe doit contenir au moins un caractère spécial (@$!%*?&)"
      };
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return {
        isValid: false,
        message: "Les mots de passe ne correspondent pas"
      };
    }

    if (passwordData.oldPassword === passwordData.newPassword) {
      return {
        isValid: false,
        message: "Le nouveau mot de passe doit être différent de l'ancien"
      };
    }

    return {
      isValid: true
    };
  }
}

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
}

import { useEffect } from "react";
import { useAuth } from "../auth/AuthContext";

/**
 * Hook pour synchroniser TOUT le localStorage avec l'API
 * Sauvegarde automatique toutes les 30 secondes
 * Charge depuis l'API au démarrage
 */
export function useLocalStorageSync() {
  const { token } = useAuth();

  // Charger depuis l'API au démarrage
  useEffect(() => {
    if (!token) return;

    const loadFromAPI = async () => {
      try {
        const response = await fetch("https://osint-lms-backend.onrender.com/game/load-full", {
          headers: { "Authorization": `Bearer ${token}` }
        });

        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data) {
            // Restaurer TOUT le localStorage
            Object.entries(result.data).forEach(([key, value]) => {
              localStorage.setItem(key, JSON.stringify(value));
            });
            console.log("✅ Progression restaurée depuis l'API");
          }
        }
      } catch (error) {
        console.error("❌ Erreur chargement progression:", error);
      }
    };

    loadFromAPI();
  }, [token]);

  // Sauvegarder vers l'API toutes les 30 secondes
  useEffect(() => {
    if (!token) return;

    const saveToAPI = async () => {
      try {
        // Clés à sauvegarder (UNIQUEMENT les données de progression)
        const keysToSave = [
          'quiz_progress',
          'exercices_progress', 
          'etudes_cas_progress',
          'parcours_progress',
          'badges_unlocked',
          'modules_completed',
          'cyberosint_game_state',
          'cyberosint_challenges'
        ];

        // Récupérer SEULEMENT les données importantes
        const importantData: Record<string, any> = {};
        for (const key of keysToSave) {
          const value = localStorage.getItem(key);
          if (value) {
            try {
              importantData[key] = JSON.parse(value);
            } catch {
              importantData[key] = value;
            }
          }
        }

        await fetch("https://osint-lms-backend.onrender.com/game/save-full", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ data: importantData })
        });

        console.log("💾 Progression sauvegardée vers l'API");
      } catch (error) {
        console.error("❌ Erreur sauvegarde progression:", error);
      }
    };

    // Sauvegarder immédiatement
    saveToAPI();

    // Puis toutes les 30 secondes
    const interval = setInterval(saveToAPI, 30000);

    return () => clearInterval(interval);
  }, [token]);
}

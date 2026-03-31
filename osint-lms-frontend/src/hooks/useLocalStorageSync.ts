import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";

/**
 * Hook pour synchroniser TOUT le localStorage avec l'API
 * Sauvegarde automatique toutes les 30 secondes
 * Charge depuis l'API au démarrage
 */
export function useLocalStorageSync() {
  const { token } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  // Charger depuis l'API au démarrage
  useEffect(() => {
    if (!token) {
      setIsLoading(false);
      return;
    }

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
      } finally {
        setIsLoading(false);
      }
    };

    loadFromAPI();
  }, [token]);

  // Sauvegarder vers l'API toutes les 30 secondes
  useEffect(() => {
    if (!token || isLoading) return;

    const saveToAPI = async () => {
      try {
        // Clés à sauvegarder (UNIQUEMENT les données de progression)
        const keysToSave = [
          // Quiz
          'quiz_results',
          'quiz_badges',
          // Exercices
          'completed_exercises',
          'exercices_completed',
          'badge_exo_debutant',
          'badge_exo_intermediaire',
          'badge_exo_avance',
          'badge_exo_expert',
          'badge_exo_master',
          // Études de cas
          'etudes_cas_progress',
          // Parcours
          'parcours_progress',
          // CTF et Game
          'cyberosint_game_state',
          'cyberosint_challenges',
          'ctf_progress'
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
  }, [token, isLoading]);

  return { isLoading };
}

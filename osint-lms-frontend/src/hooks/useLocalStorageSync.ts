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
              if (typeof value === 'string') {
                localStorage.setItem(key, value);
              } else {
                localStorage.setItem(key, JSON.stringify(value));
              }
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
        // TOUTES les clés à sauvegarder
        const keysToSave = [
          // Game State (XP, Level, Streak)
          'cyberosint_game_state',
          // Quiz
          'quiz_results',
          'quiz_badges',
          // Challenges hebdo
          'challenges_solved',
          // Exercices
          'completed_exercises',
          'exercices_completed',
          'exercices_current_index',
          'exercices_filter',
          'badge_exo_debutant',
          'badge_exo_intermediaire',
          'badge_exo_avance',
          'badge_exo_expert',
          'badge_exo_master',
          // Parcours débutant
          'badge_deb_intro',
          'badge_deb_methodo',
          'badge_deb_outils',
          // Parcours intermédiaire
          'badge_int_intro',
          'badge_int_methodo',
          'badge_int_outils',
          // Parcours avancé
          'badge_adv_intro',
          'badge_adv_methodo',
          'badge_adv_outils',
          // Études de cas
          'badge_case_geo',
          'badge_case_media',
          'badge_case_attr',
          'badge_case_chrono',
          'badge_cases_osint',
          'etudes_cas_progress',
          // Parcours général
          'parcours_progress',
          // CTF
          'ctf_progress',
          'cyberosint_challenges'
        ];

        // Récupérer les données
        const importantData: Record<string, any> = {};
        for (const key of keysToSave) {
          const value = localStorage.getItem(key);
          if (value) {
            try {
              // Essayer de parser comme JSON
              importantData[key] = JSON.parse(value);
            } catch {
              // Si ce n'est pas du JSON, garder tel quel
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

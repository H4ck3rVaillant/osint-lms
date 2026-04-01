import { useEffect, useState } from 'react';

const API_URL = "https://osint-lms-backend.onrender.com";

export function useLocalStorageSync() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let saveInterval: number | undefined;

    const loadFromAPI = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_URL}/game/load-full`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data) {
            // Restaurer toutes les données dans localStorage
            Object.entries(result.data).forEach(([key, value]) => {
              if (value !== undefined && value !== null) {
                const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
                localStorage.setItem(key, stringValue);
              }
            });
            console.log("✅ Progression restaurée depuis l'API");
          }
        }
      } catch (error) {
        console.error("❌ Erreur chargement API:", error);
      } finally {
        setIsLoading(false);
        
        // ATTENDRE 10 SECONDES après le chargement avant de commencer à sauvegarder
        setTimeout(() => {
          startAutoSave();
        }, 10000);
      }
    };

    const saveToAPI = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        // Collecter TOUTES les données localStorage
        const allData: Record<string, any> = {};
        
        const keysToSync = [
          "cyberosint_game_state",
          "cyberosint_challenges",
          "quiz_results",
          "quiz_badges",
          "challenges_solved",
          "completed_exercises",
          "exercices_completed",
          "exercices_current_index",
          "exercices_filter",
          "badge_exo_debutant",
          "badge_exo_intermediaire",
          "badge_exo_avance",
          "badge_exo_expert",
          "badge_exo_master",
          "badge_deb_theorie",
          "badge_deb_pratique",
          "badge_deb_validation",
          "badge_int_theorie",
          "badge_int_pratique",
          "badge_int_validation",
          "badge_adv_theorie",
          "badge_adv_pratique",
          "badge_adv_validation",
          "parcours_progress",
          "badge_case_1",
          "badge_case_2",
          "badge_case_3",
          "etudes_cas_progress",
          "ctf_progress"
        ];

        keysToSync.forEach(key => {
          const value = localStorage.getItem(key);
          if (value) {
            try {
              allData[key] = JSON.parse(value);
            } catch {
              allData[key] = value;
            }
          }
        });

        await fetch(`${API_URL}/game/save-full`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ data: allData })
        });
        
        console.log("💾 Progression sauvegardée vers l'API");
      } catch (error) {
        console.error("❌ Erreur sauvegarde API:", error);
      }
    };

    const startAutoSave = () => {
      // Sauvegarder toutes les 30 secondes
      saveInterval = setInterval(() => {
        saveToAPI();
      }, 30000);
      
      // Sauvegarder immédiatement au démarrage de l'auto-save
      saveToAPI();
    };

    loadFromAPI();

    return () => {
      if (saveInterval) {
        clearInterval(saveInterval);
      }
    };
  }, []);

  return { isLoading };
}

import { useEffect, useState } from 'react';

const API_URL = "https://osint-lms-backend.onrender.com";

export function useLocalStorageSync() {
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  // Surveiller le token
  useEffect(() => {
    const checkToken = () => {
      const currentToken = localStorage.getItem("token");
      setToken(currentToken);
    };

    // Vérifier immédiatement
    checkToken();

    // Surveiller les changements de localStorage
    window.addEventListener('storage', checkToken);
    
    // Vérifier aussi toutes les 1 seconde (car storage event ne fonctionne pas dans la même fenêtre)
    const tokenCheckInterval = setInterval(checkToken, 1000);

    return () => {
      window.removeEventListener('storage', checkToken);
      clearInterval(tokenCheckInterval);
    };
  }, []);

  useEffect(() => {
    if (!token) {
      setIsLoading(false);
      return;
    }

    let saveInterval: number | undefined;

    const loadFromAPI = async () => {
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
            
            // Émettre un événement pour notifier les composants
            window.dispatchEvent(new Event('localStorageUpdated'));
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
          "activity_calendar",  // Calendrier streak
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
          "ctf_progress",
          // Parcours Débutant
          "badge_deb_intro",
          "badge_deb_methodo",
          "badge_deb_outils",
          // Parcours Intermédiaire
          "badge_int_intro",
          "badge_int_methodo",
          "badge_int_outils",
          // Parcours Avancé
          "badge_adv_intro",
          "badge_adv_methodo",
          "badge_adv_outils",
          // Études de cas OSINT
          "badge_case_geo",
          "badge_case_media",
          "badge_case_attr",
          "badge_case_chrono",
          "badge_cases_osint",
          // Quiz intro parcours
          "quiz_deb_intro_completed",
          "quiz_deb_intro_answers",
          "quiz_int_intro_completed",
          "quiz_int_intro_answers",
          "quiz_adv_intro_completed",
          "quiz_adv_intro_answers"
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
      saveInterval = window.setInterval(() => {
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
  }, [token]); // SE RELANCE QUAND LE TOKEN CHANGE

  return { isLoading };
}

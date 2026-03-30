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
        // Récupérer TOUT le localStorage
        const allData: Record<string, any> = {};
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && !key.startsWith("auth_")) { // Ignorer les tokens
            try {
              allData[key] = JSON.parse(localStorage.getItem(key) || "");
            } catch {
              allData[key] = localStorage.getItem(key);
            }
          }
        }

        await fetch("https://osint-lms-backend.onrender.com/game/save-full", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ data: allData })
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

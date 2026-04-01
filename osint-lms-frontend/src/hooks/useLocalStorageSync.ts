import { useEffect, useState } from 'react';

const API_URL = "https://osint-lms-backend.onrender.com";

export function useLocalStorageSync() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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
      }
    };

    loadFromAPI();
  }, []);

  return { isLoading };
}

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

interface User {
  id: number;
  username: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<{ success: boolean; tempToken?: string; error?: string }>;
  verify2FA: (tempToken: string, totpCode: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Backend URL
  const BACKEND_URL = "http://localhost:3000";

  // Configuration de l'auto-logout
  const INACTIVITY_TIMEOUT = 15 * 60 * 1000; // 15 minutes en millisecondes
  const WARNING_TIMEOUT = 14 * 60 * 1000;    // Warning à 14 minutes

  // Déconnexion
  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setUser(null);
    // Pas de window.location.href → le composant Protected redirige automatiquement vers /login
    // et la page /login redirige vers / si non connecté
  }, []);

  // Gestion de l'inactivité
  useEffect(() => {
    if (!user) return; // Ne pas activer si pas connecté

    let inactivityTimer: NodeJS.Timeout;
    let warningTimer: NodeJS.Timeout;

    const resetTimer = () => {
      // Effacer les timers existants
      clearTimeout(inactivityTimer);
      clearTimeout(warningTimer);

      // Warning à 14 minutes
      warningTimer = setTimeout(() => {
        console.log("⚠️ Déconnexion automatique dans 1 minute d'inactivité...");
        // Optionnel : Afficher une notification à l'utilisateur
        // alert("Vous serez déconnecté dans 1 minute d'inactivité");
      }, WARNING_TIMEOUT);

      // Déconnexion automatique à 15 minutes
      inactivityTimer = setTimeout(() => {
        console.log("⏱️ Déconnexion automatique pour inactivité");
        logout();
      }, INACTIVITY_TIMEOUT);
    };

    // Événements qui réinitialisent le timer d'inactivité
    const events = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
      'click'
    ];

    // Ajouter les listeners
    events.forEach(event => {
      document.addEventListener(event, resetTimer);
    });

    // Démarrer le timer initial
    resetTimer();

    // Cleanup
    return () => {
      clearTimeout(inactivityTimer);
      clearTimeout(warningTimer);
      events.forEach(event => {
        document.removeEventListener(event, resetTimer);
      });
    };
  }, [user, logout]);

  // Vérifier si l'utilisateur est déjà connecté au chargement
  // On lit le JWT localement sans appel réseau → pas de logout au refresh
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        // Décoder le payload JWT (base64) sans vérifier la signature côté client
        const payload = JSON.parse(atob(token.split(".")[1]));
        const isExpired = payload.exp && Date.now() / 1000 > payload.exp;
        if (isExpired) {
          // Token expiré : nettoyer silencieusement
          localStorage.removeItem("token");
        } else if (payload.id && payload.username) {
          // Token valide : restaurer la session sans appel réseau
          setUser({
            id: payload.id,
            username: payload.username,
            role: payload.role || "user"
          });
        } else {
          localStorage.removeItem("token");
        }
      } catch {
        // Token malformé
        localStorage.removeItem("token");
      }
    }
    setIsLoading(false);
  }, []);

  // Étape 1 : Login avec username/password
  const login = async (username: string, password: string) => {
    try {
      const response = await fetch(`${BACKEND_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.message || "Identifiants invalides" };
      }

      if (data.requires2FA && data.tempToken) {
        // Étape 1 réussie, passer à l'étape 2 (2FA)
        return { success: true, tempToken: data.tempToken };
      }

      return { success: false, error: "Réponse invalide du serveur" };
    } catch (error) {
      console.error("Erreur login:", error);
      return { success: false, error: "Erreur de connexion au serveur" };
    }
  };

  // Étape 2 : Vérification du code 2FA
  const verify2FA = async (tempToken: string, totpCode: string) => {
    try {
      const response = await fetch(`${BACKEND_URL}/auth/verify-2fa`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ tempToken, totpCode })
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.message || "Code 2FA invalide" };
      }

      // Connexion réussie !
      if (data.token && data.user) {
        localStorage.setItem("token", data.token);
        setUser(data.user);
        return { success: true };
      }

      return { success: false, error: "Réponse invalide du serveur" };
    } catch (error) {
      console.error("Erreur 2FA:", error);
      return { success: false, error: "Erreur de connexion au serveur" };
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, verify2FA, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth doit être utilisé dans un AuthProvider");
  }
  return context;
}

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

  // Backend URL - CORRIGÉ POUR PRODUCTION
  const BACKEND_URL = import.meta.env.VITE_API_URL || "/api";

  // Configuration de l'auto-logout
  const INACTIVITY_TIMEOUT = 15 * 60 * 1000; // 15 minutes
  const WARNING_TIMEOUT = 14 * 60 * 1000;

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("lastActivity"); // ✅ Nettoyer aussi le timestamp
    setUser(null);
  }, []);

  // ✅ Fonction pour mettre à jour le timestamp de dernière activité
  const updateLastActivity = useCallback(() => {
    localStorage.setItem("lastActivity", Date.now().toString());
  }, []);

  // Gestion de l'inactivité
  useEffect(() => {
    if (!user) return;

    let inactivityTimer: ReturnType<typeof setTimeout>;
    let warningTimer: ReturnType<typeof setTimeout>;

    const resetTimer = () => {
      clearTimeout(inactivityTimer);
      clearTimeout(warningTimer);

      // ✅ Mettre à jour le timestamp à chaque activité
      updateLastActivity();

      warningTimer = setTimeout(() => {
        console.log("⚠️ Déconnexion dans 1 minute");
      }, WARNING_TIMEOUT);

      inactivityTimer = setTimeout(() => {
        console.log("⏱️ Déconnexion automatique");
        logout();
      }, INACTIVITY_TIMEOUT);
    };

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];

    events.forEach(event => document.addEventListener(event, resetTimer));
    resetTimer();

    return () => {
      clearTimeout(inactivityTimer);
      clearTimeout(warningTimer);
      events.forEach(event => document.removeEventListener(event, resetTimer));
    };
  }, [user, logout, updateLastActivity]);

  // ✅ FIX F5 + INACTIVITÉ: Restaurer la session ET vérifier l'inactivité
  useEffect(() => {
    const token = localStorage.getItem("token");
    const lastActivity = localStorage.getItem("lastActivity");
    
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const isExpired = payload.exp && Date.now() / 1000 > payload.exp;
        
        // ✅ Vérifier aussi si 15 min d'inactivité sont écoulées
        const timeSinceLastActivity = lastActivity 
          ? Date.now() - parseInt(lastActivity, 10)
          : Infinity;
        
        const isInactive = timeSinceLastActivity > INACTIVITY_TIMEOUT;
        
        if (isExpired) {
          console.log("🔐 Token JWT expiré");
          localStorage.removeItem("token");
          localStorage.removeItem("lastActivity");
        } else if (isInactive) {
          console.log("⏱️ Session expirée (inactivité > 15 min)");
          localStorage.removeItem("token");
          localStorage.removeItem("lastActivity");
        } else if (payload.id && payload.username) {
          // ✅ SESSION RESTAURÉE - l'utilisateur reste connecté après F5
          setUser({
            id: payload.id,
            username: payload.username,
            role: payload.role || "user"
          });
          // ✅ Mettre à jour le timestamp car l'utilisateur vient de charger la page
          updateLastActivity();
        } else {
          localStorage.removeItem("token");
          localStorage.removeItem("lastActivity");
        }
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("lastActivity");
      }
    }
    setIsLoading(false);
  }, [updateLastActivity]);

  const login = async (username: string, password: string) => {
    try {
      const response = await fetch(`${BACKEND_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.message || "Identifiants invalides" };
      }

      if (data.requires2FA && data.tempToken) {
        return { success: true, tempToken: data.tempToken };
      }

      return { success: false, error: "Réponse invalide" };
    } catch (error) {
      console.error("Erreur login:", error);
      return { success: false, error: "Erreur de connexion au serveur" };
    }
  };

  const verify2FA = async (tempToken: string, totpCode: string) => {
    try {
      const response = await fetch(`${BACKEND_URL}/auth/verify-2fa`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tempToken, totpCode })
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.message || "Code 2FA invalide" };
      }

      if (data.token && data.user) {
        localStorage.setItem("token", data.token);
        setUser(data.user);
        // ✅ Initialiser le timestamp de dernière activité à la connexion
        updateLastActivity();
        return { success: true };
      }

      return { success: false, error: "Réponse invalide" };
    } catch (error) {
      console.error("Erreur 2FA:", error);
      return { success: false, error: "Erreur de connexion" };
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

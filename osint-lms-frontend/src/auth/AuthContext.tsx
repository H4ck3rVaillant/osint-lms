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
    setUser(null);
  }, []);

  // Gestion de l'inactivité
  useEffect(() => {
    if (!user) return;

    let inactivityTimer: ReturnType<typeof setTimeout>;
    let warningTimer: ReturnType<typeof setTimeout>;

    const resetTimer = () => {
      clearTimeout(inactivityTimer);
      clearTimeout(warningTimer);

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
  }, [user, logout]);

  // ✅ FIX F5: Restaurer la session depuis le JWT localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const isExpired = payload.exp && Date.now() / 1000 > payload.exp;
        
        if (isExpired) {
          localStorage.removeItem("token");
        } else if (payload.id && payload.username) {
          // ✅ SESSION RESTAURÉE - l'utilisateur reste connecté après F5
          setUser({
            id: payload.id,
            username: payload.username,
            role: payload.role || "user"
          });
        } else {
          localStorage.removeItem("token");
        }
      } catch {
        localStorage.removeItem("token");
      }
    }
    setIsLoading(false);
  }, []);

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

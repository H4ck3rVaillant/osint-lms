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
  const [showWarning, setShowWarning] = useState(false);
  const [countdown, setCountdown] = useState(60);

  // Backend URL - CORRIGÉ POUR PRODUCTION
  const BACKEND_URL = import.meta.env.VITE_API_URL || "/api";

  // Configuration de l'auto-logout
  const INACTIVITY_TIMEOUT = 15 * 60 * 1000; // 15 minutes
  const WARNING_TIMEOUT = 14 * 60 * 1000; // 14 minutes (1 min avant déconnexion)

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("lastActivity");
    setUser(null);
    setShowWarning(false);
  }, []);

  // ✅ Fonction pour mettre à jour le timestamp de dernière activité
  const updateLastActivity = useCallback(() => {
    localStorage.setItem("lastActivity", Date.now().toString());
  }, []);

  // ✅ Fonction pour rester connecté (réinitialise les timers)
  const stayConnected = useCallback(() => {
    setShowWarning(false);
    setCountdown(60);
    updateLastActivity();
  }, [updateLastActivity]);

  // Gestion de l'inactivité
  useEffect(() => {
    if (!user) return;

    let inactivityTimer: ReturnType<typeof setTimeout>;
    let warningTimer: ReturnType<typeof setTimeout>;
    let countdownInterval: ReturnType<typeof setInterval>;

    const resetTimer = () => {
      clearTimeout(inactivityTimer);
      clearTimeout(warningTimer);
      clearInterval(countdownInterval);
      setShowWarning(false);
      setCountdown(60);

      // ✅ Mettre à jour le timestamp à chaque activité
      updateLastActivity();

      // Warning après 14 minutes d'inactivité
      warningTimer = setTimeout(() => {
        console.log("⚠️ Affichage popup d'avertissement");
        setShowWarning(true);
        setCountdown(60);

        // Countdown de 60 secondes
        countdownInterval = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(countdownInterval);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }, WARNING_TIMEOUT);

      // Déconnexion après 15 minutes
      inactivityTimer = setTimeout(() => {
        console.log("⏱️ Déconnexion automatique pour inactivité");
        logout();
      }, INACTIVITY_TIMEOUT);
    };

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];

    events.forEach(event => document.addEventListener(event, resetTimer));
    resetTimer();

    return () => {
      clearTimeout(inactivityTimer);
      clearTimeout(warningTimer);
      clearInterval(countdownInterval);
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
      
      {/* ⚠️ POPUP D'AVERTISSEMENT INACTIVITÉ */}
      {showWarning && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0, 0, 0, 0.7)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 99999,
          animation: "fadeIn 0.3s ease-in-out"
        }}>
          <div style={{
            background: "linear-gradient(135deg, #f59e0b 0%, #f97316 100%)",
            padding: "30px 40px",
            borderRadius: "16px",
            boxShadow: "0 20px 60px rgba(245, 158, 11, 0.4)",
            maxWidth: "450px",
            textAlign: "center",
            animation: "slideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)"
          }}>
            <div style={{
              fontSize: "3rem",
              marginBottom: "15px"
            }}>⚠️</div>
            
            <h2 style={{
              color: "#fff",
              fontSize: "1.5rem",
              fontWeight: "700",
              marginBottom: "15px"
            }}>
              Inactivité détectée
            </h2>
            
            <p style={{
              color: "rgba(255, 255, 255, 0.95)",
              fontSize: "1rem",
              marginBottom: "25px",
              lineHeight: "1.6"
            }}>
              Vous allez être déconnecté(e) dans <strong>{countdown} secondes</strong> pour inactivité.
            </p>

            <div style={{
              background: "rgba(0, 0, 0, 0.2)",
              borderRadius: "12px",
              padding: "20px",
              marginBottom: "25px"
            }}>
              <div style={{
                fontSize: "3rem",
                color: "#fff",
                fontWeight: "700",
                fontFamily: "monospace"
              }}>
                {countdown}s
              </div>
            </div>

            <button
              onClick={stayConnected}
              style={{
                background: "#fff",
                color: "#f97316",
                border: "none",
                padding: "14px 35px",
                fontSize: "1rem",
                fontWeight: "700",
                borderRadius: "10px",
                cursor: "pointer",
                boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
                transition: "all 0.3s ease",
                width: "100%"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
                e.currentTarget.style.boxShadow = "0 6px 20px rgba(0, 0, 0, 0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "0 4px 15px rgba(0, 0, 0, 0.2)";
              }}
            >
              🖱️ Rester connecté(e)
            </button>
          </div>

          <style>{`
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            @keyframes slideIn {
              from {
                opacity: 0;
                transform: translateY(-30px) scale(0.9);
              }
              to {
                opacity: 1;
                transform: translateY(0) scale(1);
              }
            }
          `}</style>
        </div>
      )}
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

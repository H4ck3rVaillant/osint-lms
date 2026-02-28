import { useState, useEffect } from "react";
import { useAuth } from "../auth/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import Logo from "../assets/images/Logo.png";

export default function LoginPage() {
  const { login, verify2FA } = useAuth();
  const navigate = useNavigate();
  
  const [step, setStep] = useState<"credentials" | "2fa">("credentials");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [tempToken, setTempToken] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // États pour les modals
  const [showBlockedModal, setShowBlockedModal] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [blockTimeLeft, setBlockTimeLeft] = useState(0);
  const [remainingAttempts, setRemainingAttempts] = useState(0);

  useEffect(() => {
    setUsername("");
    setPassword("");
    setOtpCode("");
    setError("");
    setStep("credentials");
  }, []);

  // Chrono pour le compte bloqué
  useEffect(() => {
    if (blockTimeLeft > 0) {
      const timer = setInterval(() => {
        setBlockTimeLeft(prev => {
          if (prev <= 1) {
            setShowBlockedModal(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [blockTimeLeft]);

  // ✅ AUTO-FERMETURE POP-UP WARNING APRÈS 4 SECONDES
  useEffect(() => {
    if (showWarningModal) {
      const timer = setTimeout(() => {
        setShowWarningModal(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [showWarningModal]);

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Tous les champs sont requis");
      return;
    }

    setIsLoading(true);
    const result = await login(username, password);
    setIsLoading(false);

    if (result.success && result.tempToken) {
      // ✅ LOGIN RÉUSSI
      setTempToken(result.tempToken);
      setStep("2fa");
    } else {
      // ❌ LOGIN ÉCHOUÉ
      
      // Si bloqué (status 429 du serveur)
      if (result.blocked && result.secondsLeft) {
        setBlockTimeLeft(result.secondsLeft);
        setShowBlockedModal(true);
        setError(result.error || "Compte temporairement bloqué");
        return;
      }
      
      // ✅ AFFICHER POP-UP WARNING À CHAQUE ÉCHEC
      if (result.remainingAttempts !== undefined) {
        setRemainingAttempts(result.remainingAttempts);
        setShowWarningModal(true);
      }
      
      // Message d'erreur
      const message = result.error || "Identifiants invalides";
      const attemptsMsg = result.remainingAttempts !== undefined
        ? ` (${result.remainingAttempts} tentative${result.remainingAttempts > 1 ? 's' : ''} restante${result.remainingAttempts > 1 ? 's' : ''})`
        : '';
      
      setError(message + attemptsMsg);
    }
  };

  const handle2FASubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (otpCode.length !== 6) {
      setError("Le code doit contenir exactement 6 chiffres");
      return;
    }

    if (!tempToken) {
      setError("Session expirée. Veuillez vous reconnecter.");
      setStep("credentials");
      return;
    }

    setIsLoading(true);
    const result = await verify2FA(tempToken, otpCode);
    setIsLoading(false);

    if (result.success) {
      navigate("/dashboard");
    } else {
      setError(result.error || "Code 2FA invalide");
      setOtpCode("");
    }
  };

  const handleBackToCredentials = () => {
    setStep("credentials");
    setOtpCode("");
    setError("");
    setTempToken("");
  };

  return (
    <main style={{
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "20px",
      background: "radial-gradient(ellipse at center, #0f1419 0%, #020617 100%)",
      position: "relative" as const,
      overflow: "hidden"
    }}>
      <div style={{
        position: "absolute" as const,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `
          linear-gradient(rgba(0, 255, 156, 0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0, 255, 156, 0.03) 1px, transparent 1px)
        `,
        backgroundSize: "50px 50px",
        opacity: 0.3,
        pointerEvents: "none" as const
      }} />

      <div style={{
        width: "100%",
        maxWidth: "420px",
        zIndex: 1
      }}>
        <div style={{
          background: "#0b0f1a",
          border: "1px solid #00ff9c",
          borderRadius: "16px",
          padding: "40px",
          boxShadow: "0 10px 40px rgba(0, 255, 156, 0.2)"
        }}>
          <div style={{ textAlign: "center", marginBottom: "30px" }}>
            <img src={Logo} alt="Logo" style={{ width: "80px", filter: "drop-shadow(0 0 15px rgba(0, 255, 156, 0.5))" }}/>
            <h1 style={{ color: "#00ff9c", fontSize: "1.8rem", marginTop: "15px", marginBottom: "8px" }}>
              CyberOSINT Academy
            </h1>
            <p style={{ color: "#9ca3af", fontSize: "0.9rem" }}>
              {step === "credentials" ? "Connexion sécurisée" : "Authentification 2FA"}
            </p>
          </div>

          {error && (
            <div style={{ background: "#1a0f0f", border: "1px solid #ef4444", borderRadius: "8px", padding: "12px", marginBottom: "20px" }}>
              <p style={{ color: "#ef4444", fontSize: "0.9rem", margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
                <span>⚠️</span>{error}
              </p>
            </div>
          )}

          {step === "credentials" && (
            <form onSubmit={handleCredentialsSubmit}>
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", color: "#00ff9c", fontSize: "0.9rem", marginBottom: "8px", fontWeight: "500" }}>
                  Nom d'utilisateur
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Votre nom d'utilisateur"
                  disabled={isLoading}
                  style={{ width: "100%", padding: "12px", background: "#1a1f2e", border: "1px solid #2a3f3f", borderRadius: "8px", color: "#e5e7eb", fontSize: "1rem", outline: "none" }}
                  onFocus={(e) => e.target.style.borderColor = "#00ff9c"}
                  onBlur={(e) => e.target.style.borderColor = "#2a3f3f"}
                />
              </div>

              <div style={{ marginBottom: "25px" }}>
                <label style={{ display: "block", color: "#00ff9c", fontSize: "0.9rem", marginBottom: "8px", fontWeight: "500" }}>
                  Mot de passe
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={isLoading}
                  style={{ width: "100%", padding: "12px", background: "#1a1f2e", border: "1px solid #2a3f3f", borderRadius: "8px", color: "#e5e7eb", fontSize: "1rem", outline: "none" }}
                  onFocus={(e) => e.target.style.borderColor = "#00ff9c"}
                  onBlur={(e) => e.target.style.borderColor = "#2a3f3f"}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                style={{
                  width: "100%",
                  padding: "14px",
                  background: isLoading ? "#6b7280" : "#00ff9c",
                  color: "#020617",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  fontWeight: "bold",
                  cursor: isLoading ? "not-allowed" : "pointer"
                }}
              >
                {isLoading ? "Vérification..." : "Continuer →"}
              </button>
            </form>
          )}

          {step === "2fa" && (
            <form onSubmit={handle2FASubmit}>
              <div style={{ background: "#1a1f2e", border: "1px solid #00ff9c", borderRadius: "8px", padding: "15px", marginBottom: "20px" }}>
                <p style={{ color: "#00ff9c", fontSize: "0.9rem", margin: 0, marginBottom: "8px", fontWeight: "bold" }}>
                  📱 Authentification à deux facteurs
                </p>
                <p style={{ color: "#9ca3af", fontSize: "0.85rem", margin: 0, lineHeight: "1.5" }}>
                  Ouvrez FreeOTP et entrez le code à 6 chiffres pour CyberOSINT Academy.
                </p>
              </div>

              <div style={{ marginBottom: "25px" }}>
                <label style={{ display: "block", color: "#00ff9c", fontSize: "0.9rem", marginBottom: "8px", fontWeight: "500" }}>
                  Code de vérification
                </label>
                <input
                  type="text"
                  value={otpCode}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    if (value.length <= 6) setOtpCode(value);
                  }}
                  placeholder="000000"
                  maxLength={6}
                  disabled={isLoading}
                  autoFocus
                  style={{
                    width: "100%",
                    padding: "16px",
                    background: "#1a1f2e",
                    border: "1px solid #2a3f3f",
                    borderRadius: "8px",
                    color: "#e5e7eb",
                    fontSize: "1.8rem",
                    fontWeight: "bold",
                    textAlign: "center",
                    letterSpacing: "0.5rem",
                    outline: "none"
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#00ff9c"}
                  onBlur={(e) => e.target.style.borderColor = "#2a3f3f"}
                />
                <p style={{ color: "#6b7280", fontSize: "0.75rem", marginTop: "6px", textAlign: "center" }}>
                  Le code change toutes les 30 secondes
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoading || otpCode.length !== 6}
                style={{
                  width: "100%",
                  padding: "14px",
                  background: (isLoading || otpCode.length !== 6) ? "#6b7280" : "#00ff9c",
                  color: "#020617",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  fontWeight: "bold",
                  cursor: (isLoading || otpCode.length !== 6) ? "not-allowed" : "pointer",
                  marginBottom: "12px"
                }}
              >
                {isLoading ? "Vérification..." : "Valider"}
              </button>

              <button
                type="button"
                onClick={handleBackToCredentials}
                disabled={isLoading}
                style={{
                  width: "100%",
                  padding: "12px",
                  background: "transparent",
                  color: "#9ca3af",
                  border: "1px solid #2a3f3f",
                  borderRadius: "8px",
                  fontSize: "0.9rem",
                  cursor: "pointer"
                }}
              >
                ← Retour
              </button>
            </form>
          )}
        </div>

        <div style={{ textAlign: "center", marginTop: "20px", display: "flex", flexDirection: "column", gap: "10px" }}>
          <p style={{ color: "#9ca3af", fontSize: "0.9rem", margin: 0 }}>
            Pas encore de compte ?{" "}
            <Link
              to="/register"
              style={{ color: "#00ff9c", fontWeight: "bold", textDecoration: "none" }}
            >
              Créer un compte
            </Link>
          </p>
          <Link to="/" style={{ color: "#6b7280", fontSize: "0.85rem", textDecoration: "none" }}>
            ← Retour à l'accueil
          </Link>
        </div>
      </div>

      {/* MODAL COMPTE BLOQUÉ (30 MINUTES) */}
      {showBlockedModal && (
        <>
          <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.8)",
            zIndex: 9998,
          }} />
          <div style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "#0b0f1a",
            border: "3px solid #ef4444",
            borderRadius: "16px",
            padding: "40px",
            maxWidth: "500px",
            width: "90%",
            zIndex: 9999,
            boxShadow: "0 0 50px rgba(239, 68, 68, 0.5)",
          }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "4rem", marginBottom: "20px" }}>⛔</div>
              <h2 style={{ color: "#ef4444", fontSize: "1.5rem", marginBottom: "15px", fontWeight: "700" }}>
                Compte Temporairement Bloqué
              </h2>
              <p style={{ color: "#e5e7eb", marginBottom: "20px", lineHeight: "1.6", fontSize: "0.95rem" }}>
                Trop de tentatives de connexion échouées. Votre compte est <strong style={{ color: "#ef4444" }}>BLOQUÉ pendant 30 minutes</strong> sur TOUS vos appareils.
              </p>
              <div style={{
                background: "rgba(239, 68, 68, 0.1)",
                border: "2px solid #ef4444",
                borderRadius: "12px",
                padding: "20px",
                marginBottom: "20px",
              }}>
                <div style={{
                  fontSize: "3rem",
                  color: "#ef4444",
                  fontWeight: "700",
                  fontFamily: "monospace",
                  marginBottom: "10px",
                }}>
                  {Math.floor(blockTimeLeft / 60)}:{String(blockTimeLeft % 60).padStart(2, '0')}
                </div>
                <p style={{ color: "#9ca3af", fontSize: "0.9rem", margin: 0 }}>
                  Temps restant avant déblocage
                </p>
              </div>
              <button
                onClick={() => setShowBlockedModal(false)}
                style={{
                  background: "transparent",
                  border: "2px solid #2a3f3f",
                  color: "#9ca3af",
                  padding: "12px 30px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "1rem",
                }}
              >
                Fermer
              </button>
            </div>
          </div>
        </>
      )}

      {/* MODAL WARNING TENTATIVES RESTANTES */}
      {showWarningModal && (
        <>
          <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.7)",
            zIndex: 9998,
          }} />
          <div style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "#0b0f1a",
            border: remainingAttempts === 1 ? "3px solid #ef4444" : "3px solid #fbbf24",
            borderRadius: "16px",
            padding: "30px",
            maxWidth: "450px",
            width: "90%",
            zIndex: 9999,
            boxShadow: remainingAttempts === 1 ? "0 0 40px rgba(239, 68, 68, 0.5)" : "0 0 40px rgba(251, 191, 36, 0.4)",
          }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "3rem", marginBottom: "15px" }}>
                {remainingAttempts === 1 ? "🚨" : "⚠️"}
              </div>
              <h3 style={{ 
                color: remainingAttempts === 1 ? "#ef4444" : "#fbbf24", 
                fontSize: "1.3rem", 
                marginBottom: "10px", 
                fontWeight: "700" 
              }}>
                {remainingAttempts === 1 ? "DERNIÈRE TENTATIVE !" : "Attention !"}
              </h3>
              <p style={{ color: "#e5e7eb", fontSize: "0.95rem", lineHeight: "1.5", margin: 0 }}>
                {remainingAttempts === 1 
                  ? "Une seule tentative restante avant le blocage de 30 minutes sur TOUS vos appareils !"
                  : `Il vous reste ${remainingAttempts} tentative${remainingAttempts > 1 ? 's' : ''} avant que votre compte ne soit temporairement bloqué pendant 30 minutes.`
                }
              </p>
            </div>
          </div>
        </>
      )}
    </main>
  );
}

import { useState, useEffect } from "react";
import { useAuth } from "../auth/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import Logo from "../assets/images/Logo.png";
import { checkRateLimit, resetRateLimit } from "../utils/rateLimiter";

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

  // Réinitialiser les champs au chargement de la page
  useEffect(() => {
    setUsername("");
    setPassword("");
    setOtpCode("");
    setError("");
    setStep("credentials");
  }, []);

  // Étape 1 : Soumettre username/password
  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Tous les champs sont requis");
      return;
    }

    // ✅ VÉRIFIER RATE LIMIT AVANT DE TENTER LE LOGIN
    const rateLimitCheck = checkRateLimit(username);
    
    if (!rateLimitCheck.allowed) {
      setError(rateLimitCheck.message || "Trop de tentatives. Réessayez plus tard.");
      return;
    }

    setIsLoading(true);

    const result = await login(username, password);
    setIsLoading(false);

    if (result.success && result.tempToken) {
      // ✅ LOGIN RÉUSSI - RESET LE RATE LIMIT
      resetRateLimit(username);
      setTempToken(result.tempToken);
      setStep("2fa");
    } else {
      // ❌ LOGIN ÉCHOUÉ - AFFICHER MESSAGE + TENTATIVES RESTANTES
      const message = result.error || "Identifiants invalides";
      const attemptsMsg = rateLimitCheck.remainingAttempts !== undefined
        ? ` (${rateLimitCheck.remainingAttempts} tentative${rateLimitCheck.remainingAttempts > 1 ? 's' : ''} restante${rateLimitCheck.remainingAttempts > 1 ? 's' : ''})`
        : '';
      
      setError(message + attemptsMsg);
      
      // Afficher warning si dernière tentative
      if (rateLimitCheck.message) {
        setTimeout(() => {
          alert(rateLimitCheck.message);
        }, 100);
      }
    }
  };

  // Étape 2 : Soumettre le code 2FA
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
    </main>
  );
}

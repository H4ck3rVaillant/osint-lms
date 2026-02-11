import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../assets/images/Logo.png";

/* =====================================================
   TYPES
===================================================== */
type Step = "avatar" | "form" | "qrcode" | "confirm" | "success";

interface FormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface PasswordStrength {
  score: number;       // 0-4
  label: string;
  color: string;
  checks: { label: string; ok: boolean }[];
}

/* =====================================================
   HELPER : force du mot de passe
===================================================== */
function getPasswordStrength(password: string): PasswordStrength {
  const checks = [
    { label: "8 caractères minimum",           ok: password.length >= 8 },
    { label: "Une lettre majuscule",            ok: /[A-Z]/.test(password) },
    { label: "Une lettre minuscule",            ok: /[a-z]/.test(password) },
    { label: "Un chiffre",                      ok: /[0-9]/.test(password) },
    { label: "Un caractère spécial (!@#$...)",  ok: /[^A-Za-z0-9]/.test(password) },
  ];
  const score = checks.filter(c => c.ok).length;
  const levels = [
    { label: "Très faible", color: "#ef4444" },
    { label: "Faible",      color: "#f97316" },
    { label: "Moyen",       color: "#fbbf24" },
    { label: "Fort",        color: "#22c55e" },
    { label: "Très fort",   color: "#00ff9c" },
  ];
  return { score, ...levels[score], checks };
}

/* =====================================================
   COMPOSANT PRINCIPAL
===================================================== */
export default function RegisterPage() {
  const navigate = useNavigate();
  const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  const [step, setStep]             = useState<Step>("avatar");
  const [form, setForm]             = useState<FormData>({
    username: "", email: "", password: "", confirmPassword: ""
  });
  const [showPassword, setShowPassword]   = useState(false);
  const [showConfirm, setShowConfirm]     = useState(false);
  const [isLoading, setIsLoading]         = useState(false);
  const [error, setError]                 = useState("");

  const [selectedAvatar, setSelectedAvatar] = useState<string>("");

  // Données retournées par /auth/register
  const [qrCode, setQrCode]         = useState("");
  const [totpSecret, setTotpSecret] = useState("");
  const [createdUsername, setCreatedUsername] = useState("");

  // Étape 3 : confirmation du scan
  const [confirmCode, setConfirmCode]   = useState("");
  const [confirmError, setConfirmError] = useState("");
  const [confirmLoading, setConfirmLoading] = useState(false);

  const strength = getPasswordStrength(form.password);

  /* ---- Validation formulaire ---- */
  const validateForm = (): string | null => {
    if (!form.username.trim())              return "Le nom d'utilisateur est requis.";
    if (form.username.length < 3)          return "Le nom d'utilisateur doit faire au moins 3 caractères.";
    if (!/^[a-zA-Z0-9_-]+$/.test(form.username))
                                           return "Le nom d'utilisateur ne peut contenir que des lettres, chiffres, _ et -.";
    if (form.password.length < 8)         return "Le mot de passe doit faire au moins 8 caractères.";
    if (strength.score < 2)               return "Le mot de passe est trop faible. Ajoutez majuscules, chiffres ou symboles.";
    if (form.password !== form.confirmPassword)
                                           return "Les mots de passe ne correspondent pas.";
    return null;
  };

  /* ---- Étape 1 : Soumettre le formulaire ---- */
  const handleRegister = async () => {
    setError("");
    const validationError = validateForm();
    if (validationError) { setError(validationError); return; }

    setIsLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.username.trim(),
          password: form.password,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Erreur lors de l'inscription.");
        return;
      }

      setQrCode(data.qrCode);
      setTotpSecret(data.totpSecret);
      setCreatedUsername(form.username.trim());
      // Sauvegarder le choix d'avatar dans localStorage
      if (selectedAvatar) {
        localStorage.setItem(`avatar_${form.username.trim()}`, selectedAvatar);
      }
      setStep("qrcode");
    } catch {
      setError("Impossible de contacter le serveur. Vérifiez qu'il est démarré.");
    } finally {
      setIsLoading(false);
    }
  };

  /* ---- Étape 3 : Vérifier que le scan est OK ---- */
  const handleConfirm = async () => {
    if (confirmCode.length !== 6 || !/^\d+$/.test(confirmCode)) {
      setConfirmError("Le code doit être composé de 6 chiffres.");
      return;
    }
    setConfirmError("");
    setConfirmLoading(true);

    try {
      // On fait un login complet pour vérifier que le 2FA fonctionne
      const loginRes = await fetch(`${BACKEND_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: createdUsername, password: form.password }),
      });
      const loginData = await loginRes.json();

      if (!loginRes.ok || !loginData.tempToken) {
        setConfirmError("Erreur de vérification. Réessayez.");
        return;
      }

      const verifyRes = await fetch(`${BACKEND_URL}/auth/verify-2fa`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tempToken: loginData.tempToken, totpCode: confirmCode }),
      });
      const verifyData = await verifyRes.json();

      if (!verifyRes.ok) {
        setConfirmError("Code incorrect. Vérifiez votre application et réessayez.");
        return;
      }

      if (verifyData.token) {
        setStep("success");
      }
    } catch {
      setConfirmError("Erreur réseau. Vérifiez le serveur.");
    } finally {
      setConfirmLoading(false);
    }
  };

  /* =====================================================
     RENDU
  ===================================================== */
  return (
    <main style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "radial-gradient(ellipse at top, #0f1419 0%, #020617 100%)",
      padding: "40px 20px",
      position: "relative" as const,
    }}>

      {/* Grille fond */}
      <div style={{
        position: "absolute" as const, inset: 0,
        backgroundImage: `linear-gradient(rgba(0,255,156,0.03) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(0,255,156,0.03) 1px, transparent 1px)`,
        backgroundSize: "50px 50px",
        pointerEvents: "none" as const,
      }} />

      <div style={{ width: "100%", maxWidth: "520px", zIndex: 1 }}>

        {/* Logo + titre */}
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <img src={Logo} alt="Logo" style={{ width: "60px", marginBottom: "12px",
            filter: "drop-shadow(0 0 15px rgba(0,255,156,0.5))" }} />
          <h1 style={{ color: "#00ff9c", fontSize: "1.8rem", margin: 0 }}>CyberOSINT Academy</h1>
          <p style={{ color: "#9ca3af", marginTop: "6px", fontSize: "0.95rem" }}>Créer un compte</p>
        </div>

        {/* Indicateur d'étapes */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: "30px" }}>
          {[
            { n: 1, label: "Compte" },
            { n: 2, label: "2FA Setup" },
            { n: 3, label: "Confirmation" },
          ].map((s, i) => {
            const stepMap: Record<Step, number> = { avatar: 1, form: 2, qrcode: 3, confirm: 4, success: 5 };
            const current = stepMap[step];
            const done    = current > s.n;
            const active  = current === s.n;
            return (
              <div key={s.n} style={{ display: "flex", alignItems: "center", flex: i < 2 ? 1 : "none" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                  <div style={{
                    width: "34px", height: "34px", borderRadius: "50%",
                    background: done ? "#00ff9c" : active ? "#0b1a0f" : "#1a1f2e",
                    border: `2px solid ${done || active ? "#00ff9c" : "#2a3f3f"}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontWeight: "bold", fontSize: "0.9rem",
                    color: done ? "#0b0f1a" : active ? "#00ff9c" : "#9ca3af",
                    transition: "all 0.3s",
                  }}>
                    {done ? "✓" : s.n}
                  </div>
                  <span style={{ fontSize: "0.7rem", color: active ? "#00ff9c" : "#9ca3af", whiteSpace: "nowrap" as const }}>
                    {s.label}
                  </span>
                </div>
                {i < 2 && (
                  <div style={{
                    flex: 1, height: "2px", margin: "0 8px 18px",
                    background: done ? "#00ff9c" : "#2a3f3f",
                    transition: "background 0.3s",
                  }} />
                )}
              </div>
            );
          })}
        </div>

        {/* ================================================
            ÉTAPE 0 : CHOIX D'AVATAR
        ================================================ */}
        {step === "avatar" && (
          <div style={{
            background: "#0b0f1a", border: "1px solid #2a3f3f",
            borderRadius: "16px", padding: "35px",
          }}>
            <h2 style={{ color: "#e5e7eb", fontSize: "1.3rem", marginBottom: "8px", textAlign: "center" }}>
              🎭 Choisissez votre avatar
            </h2>
            <p style={{ color: "#9ca3af", fontSize: "0.88rem", textAlign: "center", marginBottom: "28px" }}>
              Il sera affiché dans le header et sur le leaderboard
            </p>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(5, 1fr)",
              gap: "12px",
              marginBottom: "28px",
            }}>
              {[
                { id: "hacker",    emoji: "🧑‍💻", label: "Hacker"     },
                { id: "ninja",     emoji: "🥷",   label: "Ninja"      },
                { id: "ghost",     emoji: "👻",   label: "Ghost"      },
                { id: "robot",     emoji: "🤖",   label: "Robot"      },
                { id: "alien",     emoji: "👽",   label: "Alien"      },
                { id: "skull",     emoji: "💀",   label: "Skull"      },
                { id: "detective", emoji: "🕵️",   label: "Détective"  },
                { id: "wizard",    emoji: "🧙",   label: "Wizard"     },
                { id: "demon",     emoji: "😈",   label: "Démon"      },
                { id: "cat",       emoji: "🐱",   label: "Cat"        },
                { id: "fox",       emoji: "🦊",   label: "Fox"        },
                { id: "wolf",      emoji: "🐺",   label: "Wolf"       },
                { id: "dragon",    emoji: "🐉",   label: "Dragon"     },
                { id: "parrot",    emoji: "🦜",   label: "Parrot"     },
                { id: "cyber",     emoji: "⚡",   label: "Cyber"      },
              ].map((av) => (
                <div
                  key={av.id}
                  onClick={() => setSelectedAvatar(av.id)}
                  style={{
                    background: selectedAvatar === av.id ? "#0b1a0f" : "#1a1f2e",
                    border: `2px solid ${selectedAvatar === av.id ? "#00ff9c" : "#2a3f3f"}`,
                    borderRadius: "12px",
                    padding: "14px 8px",
                    textAlign: "center" as const,
                    cursor: "pointer",
                    transition: "all 0.2s",
                    boxShadow: selectedAvatar === av.id ? "0 0 15px rgba(0,255,156,0.25)" : "none",
                  }}
                  onMouseEnter={(e) => {
                    if (selectedAvatar !== av.id) {
                      e.currentTarget.style.borderColor = "#00ff9c66";
                      e.currentTarget.style.transform = "translateY(-3px)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedAvatar !== av.id) {
                      e.currentTarget.style.borderColor = "#2a3f3f";
                      e.currentTarget.style.transform = "translateY(0)";
                    }
                  }}
                >
                  <div style={{ fontSize: "2.2rem", marginBottom: "6px", lineHeight: 1 }}>{av.emoji}</div>
                  <div style={{
                    color: selectedAvatar === av.id ? "#00ff9c" : "#9ca3af",
                    fontSize: "0.72rem",
                    fontWeight: selectedAvatar === av.id ? "bold" : "normal",
                  }}>
                    {av.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Aperçu de l'avatar sélectionné */}
            {selectedAvatar && (
              <div style={{
                background: "#1a1f2e",
                border: "1px solid #00ff9c33",
                borderRadius: "10px",
                padding: "14px 20px",
                marginBottom: "20px",
                display: "flex",
                alignItems: "center",
                gap: "14px",
              }}>
                <div style={{
                  width: "44px", height: "44px",
                  background: "#0b0f1a",
                  border: "2px solid #00ff9c",
                  borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "1.6rem",
                }}>
                  {[
                    { id: "hacker", emoji: "🧑‍💻" }, { id: "ninja", emoji: "🥷" },
                    { id: "ghost", emoji: "👻" },    { id: "robot", emoji: "🤖" },
                    { id: "alien", emoji: "👽" },    { id: "skull", emoji: "💀" },
                    { id: "detective", emoji: "🕵️" },{ id: "wizard", emoji: "🧙" },
                    { id: "demon", emoji: "😈" },    { id: "cat", emoji: "🐱" },
                    { id: "fox", emoji: "🦊" },      { id: "wolf", emoji: "🐺" },
                    { id: "dragon", emoji: "🐉" },   { id: "parrot", emoji: "🦜" },
                    { id: "cyber", emoji: "⚡" },
                  ].find(a => a.id === selectedAvatar)?.emoji}
                </div>
                <div>
                  <p style={{ color: "#00ff9c", fontWeight: "bold", margin: 0, fontSize: "0.9rem" }}>
                    Avatar sélectionné ✓
                  </p>
                  <p style={{ color: "#9ca3af", margin: 0, fontSize: "0.8rem" }}>
                    Vous pourrez le modifier depuis votre profil
                  </p>
                </div>
              </div>
            )}

            <button
              onClick={() => setStep("form")}
              disabled={!selectedAvatar}
              style={{
                width: "100%", padding: "14px",
                background: !selectedAvatar ? "#6b7280" : "#00ff9c",
                color: "#0b0f1a", border: "none", borderRadius: "8px",
                fontWeight: "bold", fontSize: "1rem",
                cursor: !selectedAvatar ? "not-allowed" : "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={e => { if (selectedAvatar) e.currentTarget.style.boxShadow = "0 0 20px rgba(0,255,156,0.4)"; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; }}
            >
              {selectedAvatar ? "Continuer →" : "Sélectionnez un avatar"}
            </button>
          </div>
        )}

        {/* ================================================
            ÉTAPE 1 : FORMULAIRE
        ================================================ */}
        {step === "form" && (
          <div style={{
            background: "#0b0f1a", border: "1px solid #2a3f3f",
            borderRadius: "16px", padding: "35px",
          }}>
            <h2 style={{ color: "#e5e7eb", fontSize: "1.3rem", marginBottom: "24px" }}>
              👤 Informations du compte
            </h2>

            {error && (
              <div style={{
                background: "#1a0a0a", border: "1px solid #ef4444",
                borderRadius: "8px", padding: "12px 16px",
                color: "#ef4444", fontSize: "0.9rem", marginBottom: "20px",
              }}>
                ⚠️ {error}
              </div>
            )}

            {/* Username */}
            <div style={{ marginBottom: "18px" }}>
              <label style={{ color: "#9ca3af", fontSize: "0.85rem", display: "block", marginBottom: "6px" }}>
                Nom d'utilisateur *
              </label>
              <input
                type="text"
                value={form.username}
                onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                onKeyDown={e => e.key === "Enter" && handleRegister()}
                placeholder="ex: cyber_hunter"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = "#00ff9c"}
                onBlur={e => e.target.style.borderColor = "#2a3f3f"}
              />
              <p style={{ color: "#6b7280", fontSize: "0.75rem", marginTop: "4px" }}>
                Lettres, chiffres, _ et - uniquement
              </p>
            </div>

            {/* Email (optionnel, côté UX) */}
            <div style={{ marginBottom: "18px" }}>
              <label style={{ color: "#9ca3af", fontSize: "0.85rem", display: "block", marginBottom: "6px" }}>
                Email <span style={{ color: "#6b7280" }}>(optionnel)</span>
              </label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="votre@email.com"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = "#00ff9c"}
                onBlur={e => e.target.style.borderColor = "#2a3f3f"}
              />
            </div>

            {/* Mot de passe */}
            <div style={{ marginBottom: "8px" }}>
              <label style={{ color: "#9ca3af", fontSize: "0.85rem", display: "block", marginBottom: "6px" }}>
                Mot de passe *
              </label>
              <div style={{ position: "relative" as const }}>
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  placeholder="Minimum 8 caractères"
                  style={{ ...inputStyle, paddingRight: "48px" }}
                  onFocus={e => e.target.style.borderColor = "#00ff9c"}
                  onBlur={e => e.target.style.borderColor = "#2a3f3f"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(p => !p)}
                  style={{
                    position: "absolute" as const, right: "12px", top: "50%",
                    transform: "translateY(-50%)",
                    background: "transparent", border: "none",
                    color: "#9ca3af", cursor: "pointer", fontSize: "1.1rem",
                  }}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {/* Jauge force */}
            {form.password.length > 0 && (
              <div style={{ marginBottom: "16px" }}>
                <div style={{ display: "flex", gap: "4px", marginBottom: "6px" }}>
                  {[0,1,2,3,4].map(i => (
                    <div key={i} style={{
                      flex: 1, height: "4px", borderRadius: "2px",
                      background: i < strength.score ? strength.color : "#2a3f3f",
                      transition: "background 0.3s",
                    }} />
                  ))}
                </div>
                <p style={{ color: strength.color, fontSize: "0.8rem", margin: "0 0 8px 0" }}>
                  Force : {strength.label}
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3px" }}>
                  {strength.checks.map((c, i) => (
                    <span key={i} style={{ color: c.ok ? "#22c55e" : "#6b7280", fontSize: "0.75rem" }}>
                      {c.ok ? "✓" : "○"} {c.label}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Confirmation mot de passe */}
            <div style={{ marginBottom: "28px" }}>
              <label style={{ color: "#9ca3af", fontSize: "0.85rem", display: "block", marginBottom: "6px" }}>
                Confirmer le mot de passe *
              </label>
              <div style={{ position: "relative" as const }}>
                <input
                  type={showConfirm ? "text" : "password"}
                  value={form.confirmPassword}
                  onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))}
                  onKeyDown={e => e.key === "Enter" && handleRegister()}
                  placeholder="Répétez le mot de passe"
                  style={{
                    ...inputStyle,
                    paddingRight: "48px",
                    borderColor: form.confirmPassword && form.password !== form.confirmPassword
                      ? "#ef4444" : form.confirmPassword && form.password === form.confirmPassword
                      ? "#22c55e" : "#2a3f3f",
                  }}
                  onFocus={e => {
                    if (!form.confirmPassword) e.target.style.borderColor = "#00ff9c";
                  }}
                  onBlur={e => {
                    if (!form.confirmPassword) e.target.style.borderColor = "#2a3f3f";
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(p => !p)}
                  style={{
                    position: "absolute" as const, right: "12px", top: "50%",
                    transform: "translateY(-50%)",
                    background: "transparent", border: "none",
                    color: "#9ca3af", cursor: "pointer", fontSize: "1.1rem",
                  }}
                >
                  {showConfirm ? "🙈" : "👁️"}
                </button>
              </div>
              {form.confirmPassword && form.password !== form.confirmPassword && (
                <p style={{ color: "#ef4444", fontSize: "0.78rem", marginTop: "4px" }}>
                  ✗ Les mots de passe ne correspondent pas
                </p>
              )}
              {form.confirmPassword && form.password === form.confirmPassword && (
                <p style={{ color: "#22c55e", fontSize: "0.78rem", marginTop: "4px" }}>
                  ✓ Les mots de passe correspondent
                </p>
              )}
            </div>

            <button
              onClick={handleRegister}
              disabled={isLoading}
              style={{
                width: "100%", padding: "14px",
                background: isLoading ? "#6b7280" : "#00ff9c",
                color: "#0b0f1a", border: "none", borderRadius: "8px",
                fontWeight: "bold", fontSize: "1rem",
                cursor: isLoading ? "not-allowed" : "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={e => { if (!isLoading) e.currentTarget.style.boxShadow = "0 0 20px rgba(0,255,156,0.4)"; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; }}
            >
              {isLoading ? "Création du compte..." : "Créer mon compte →"}
            </button>

            <p style={{ textAlign: "center", marginTop: "20px", color: "#6b7280", fontSize: "0.9rem" }}>
              Déjà un compte ?{" "}
              <Link to="/login" style={{ color: "#00ff9c", textDecoration: "none", fontWeight: "bold" }}>
                Se connecter
              </Link>
            </p>
          </div>
        )}

        {/* ================================================
            ÉTAPE 2 : QR CODE 2FA
        ================================================ */}
        {step === "qrcode" && (
          <div style={{
            background: "#0b0f1a", border: "1px solid #2a3f3f",
            borderRadius: "16px", padding: "35px", textAlign: "center",
          }}>
            <div style={{ fontSize: "3rem", marginBottom: "12px" }}>🔐</div>
            <h2 style={{ color: "#00ff9c", fontSize: "1.4rem", marginBottom: "8px" }}>
              Configuration 2FA obligatoire
            </h2>
            <p style={{ color: "#9ca3af", fontSize: "0.9rem", marginBottom: "25px", lineHeight: "1.6" }}>
              Scannez ce QR code avec <strong style={{ color: "#e5e7eb" }}>FreeOTP</strong> ou{" "}
              <strong style={{ color: "#e5e7eb" }}>Google Authenticator</strong> avant de continuer.
            </p>

            {/* QR Code */}
            {qrCode && (
              <div style={{
                display: "inline-block",
                background: "#ffffff",
                padding: "16px",
                borderRadius: "12px",
                marginBottom: "20px",
                boxShadow: "0 0 30px rgba(0,255,156,0.2)",
              }}>
                <img src={qrCode} alt="QR Code 2FA" style={{ width: "200px", height: "200px", display: "block" }} />
              </div>
            )}

            {/* Clé manuelle */}
            <div style={{
              background: "#1a1f2e", border: "1px solid #2a3f3f",
              borderRadius: "8px", padding: "14px", marginBottom: "25px",
            }}>
              <p style={{ color: "#9ca3af", fontSize: "0.8rem", margin: "0 0 6px 0" }}>
                🔑 Clé manuelle (si le scan ne fonctionne pas) :
              </p>
              <code style={{
                color: "#00ff9c", fontSize: "0.9rem", letterSpacing: "2px",
                wordBreak: "break-all" as const, fontFamily: "monospace",
              }}>
                {totpSecret}
              </code>
              <button
                onClick={() => navigator.clipboard.writeText(totpSecret)}
                style={{
                  display: "block", margin: "8px auto 0",
                  background: "transparent", border: "1px solid #2a3f3f",
                  color: "#9ca3af", padding: "4px 14px", borderRadius: "6px",
                  cursor: "pointer", fontSize: "0.78rem",
                  transition: "all 0.2s",
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#00ff9c"; e.currentTarget.style.color = "#00ff9c"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#2a3f3f"; e.currentTarget.style.color = "#9ca3af"; }}
              >
                📋 Copier la clé
              </button>
            </div>

            {/* Instructions */}
            <div style={{
              background: "#0a1a0f", border: "1px solid #00ff9c33",
              borderRadius: "8px", padding: "16px", marginBottom: "25px",
              textAlign: "left",
            }}>
              <p style={{ color: "#00ff9c", fontWeight: "bold", fontSize: "0.85rem", margin: "0 0 10px 0" }}>
                📱 Comment faire :
              </p>
              {[
                "Ouvrez FreeOTP ou Google Authenticator",
                "Appuyez sur \"+\" pour ajouter un compte",
                "Choisissez \"Scanner un QR code\"",
                "Scannez le code ci-dessus",
                "Un code à 6 chiffres apparaît → cliquez Continuer",
              ].map((step, i) => (
                <p key={i} style={{ color: "#9ca3af", fontSize: "0.82rem", margin: "4px 0", display: "flex", gap: "8px" }}>
                  <span style={{ color: "#00ff9c", fontWeight: "bold", flexShrink: 0 }}>{i + 1}.</span>
                  {step}
                </p>
              ))}
            </div>

            <button
              onClick={() => setStep("confirm")}
              style={{
                width: "100%", padding: "14px",
                background: "#00ff9c", color: "#0b0f1a",
                border: "none", borderRadius: "8px",
                fontWeight: "bold", fontSize: "1rem", cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 0 20px rgba(0,255,156,0.4)"; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; }}
            >
              ✓ QR Code scanné → Continuer
            </button>
          </div>
        )}

        {/* ================================================
            ÉTAPE 3 : CONFIRMATION DU CODE
        ================================================ */}
        {step === "confirm" && (
          <div style={{
            background: "#0b0f1a", border: "1px solid #2a3f3f",
            borderRadius: "16px", padding: "35px", textAlign: "center",
          }}>
            <div style={{ fontSize: "3rem", marginBottom: "12px" }}>📱</div>
            <h2 style={{ color: "#00ff9c", fontSize: "1.4rem", marginBottom: "8px" }}>
              Vérification du 2FA
            </h2>
            <p style={{ color: "#9ca3af", fontSize: "0.9rem", marginBottom: "30px", lineHeight: "1.6" }}>
              Entrez le code à <strong style={{ color: "#e5e7eb" }}>6 chiffres</strong> affiché
              dans votre application pour confirmer la configuration.
            </p>

            {confirmError && (
              <div style={{
                background: "#1a0a0a", border: "1px solid #ef4444",
                borderRadius: "8px", padding: "12px 16px",
                color: "#ef4444", fontSize: "0.9rem", marginBottom: "20px",
              }}>
                ⚠️ {confirmError}
              </div>
            )}

            {/* Saisie code 6 chiffres */}
            <div style={{ marginBottom: "28px" }}>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={confirmCode}
                onChange={e => setConfirmCode(e.target.value.replace(/\D/g, ""))}
                onKeyDown={e => e.key === "Enter" && handleConfirm()}
                placeholder="000000"
                autoFocus
                style={{
                  width: "100%",
                  padding: "16px",
                  background: "#1a1f2e",
                  border: "2px solid #2a3f3f",
                  borderRadius: "10px",
                  color: "#00ff9c",
                  fontFamily: "monospace",
                  fontSize: "2rem",
                  textAlign: "center" as const,
                  outline: "none",
                  letterSpacing: "10px",
                  boxSizing: "border-box" as const,
                  transition: "border-color 0.2s",
                }}
                onFocus={e => e.target.style.borderColor = "#00ff9c"}
                onBlur={e => e.target.style.borderColor = "#2a3f3f"}
              />
              <p style={{ color: "#6b7280", fontSize: "0.78rem", marginTop: "8px" }}>
                Le code change toutes les 30 secondes
              </p>
            </div>

            <button
              onClick={handleConfirm}
              disabled={confirmLoading || confirmCode.length !== 6}
              style={{
                width: "100%", padding: "14px",
                background: confirmLoading || confirmCode.length !== 6 ? "#6b7280" : "#00ff9c",
                color: "#0b0f1a", border: "none", borderRadius: "8px",
                fontWeight: "bold", fontSize: "1rem",
                cursor: confirmLoading || confirmCode.length !== 6 ? "not-allowed" : "pointer",
                transition: "all 0.2s", marginBottom: "12px",
              }}
            >
              {confirmLoading ? "Vérification..." : "Valider le code →"}
            </button>

            <button
              onClick={() => setStep("qrcode")}
              style={{
                width: "100%", padding: "12px",
                background: "transparent",
                color: "#9ca3af", border: "1px solid #2a3f3f",
                borderRadius: "8px", cursor: "pointer",
                fontSize: "0.9rem", transition: "all 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#00ff9c"; e.currentTarget.style.color = "#00ff9c"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#2a3f3f"; e.currentTarget.style.color = "#9ca3af"; }}
            >
              ← Revoir le QR code
            </button>
          </div>
        )}

        {/* ================================================
            ÉTAPE 4 : SUCCÈS
        ================================================ */}
        {step === "success" && (
          <div style={{
            background: "#0a1a0a", border: "2px solid #00ff9c",
            borderRadius: "16px", padding: "40px", textAlign: "center",
            boxShadow: "0 0 40px rgba(0,255,156,0.15)",
          }}>
            <div style={{ fontSize: "4rem", marginBottom: "16px", animation: "bounce 0.6s ease" }}>
              🎉
            </div>
            <h2 style={{ color: "#00ff9c", fontSize: "1.8rem", marginBottom: "12px" }}>
              Compte créé avec succès !
            </h2>
            <p style={{ color: "#9ca3af", fontSize: "0.95rem", lineHeight: "1.7", marginBottom: "30px" }}>
              Bienvenue <strong style={{ color: "#e5e7eb" }}>{createdUsername}</strong> !<br />
              Votre compte est prêt et la double authentification est configurée. 🔐
            </p>

            <div style={{
              background: "#0b0f1a", border: "1px solid #2a3f3f",
              borderRadius: "10px", padding: "18px", marginBottom: "30px", textAlign: "left",
            }}>
              <p style={{ color: "#00ff9c", fontWeight: "bold", fontSize: "0.85rem", margin: "0 0 10px 0" }}>
                🚀 Ce qui vous attend :
              </p>
              {[
                "3 parcours OSINT (Débutant → Elite)",
                "11 défis CTF + Leaderboard mondial",
                "20 badges et système XP",
                "Labs Kali Linux & Parrot OS",
                "22+ outils professionnels référencés",
              ].map((item, i) => (
                <p key={i} style={{ color: "#9ca3af", fontSize: "0.85rem", margin: "5px 0", display: "flex", gap: "8px" }}>
                  <span style={{ color: "#00ff9c" }}>✓</span> {item}
                </p>
              ))}
            </div>

            <button
              onClick={() => navigate("/login")}
              style={{
                width: "100%", padding: "16px",
                background: "#00ff9c", color: "#0b0f1a",
                border: "none", borderRadius: "8px",
                fontWeight: "bold", fontSize: "1.1rem",
                cursor: "pointer", transition: "all 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 0 25px rgba(0,255,156,0.5)"; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; }}
            >
              🔓 Se connecter maintenant
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes bounce {
          0%   { transform: scale(0.5); opacity: 0; }
          70%  { transform: scale(1.2); }
          100% { transform: scale(1);   opacity: 1; }
        }
      `}</style>
    </main>
  );
}

/* Style de base pour les inputs */
const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  background: "#1a1f2e",
  border: "1px solid #2a3f3f",
  borderRadius: "8px",
  color: "#e5e7eb",
  fontSize: "1rem",
  outline: "none",
  boxSizing: "border-box",
  transition: "border-color 0.2s",
};

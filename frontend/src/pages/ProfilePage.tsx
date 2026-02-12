import { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";

const AVATARS = [
  { id: "hacker", emoji: "🧑‍💻", label: "Hacker" },
  { id: "ninja", emoji: "🥷", label: "Ninja" },
  { id: "ghost", emoji: "👻", label: "Ghost" },
  { id: "robot", emoji: "🤖", label: "Robot" },
  { id: "alien", emoji: "👽", label: "Alien" },
  { id: "skull", emoji: "💀", label: "Skull" },
  { id: "detective", emoji: "🕵️", label: "Détective" },
  { id: "wizard", emoji: "🧙", label: "Wizard" },
  { id: "demon", emoji: "😈", label: "Démon" },
  { id: "cat", emoji: "🐱", label: "Cat" },
  { id: "fox", emoji: "🦊", label: "Fox" },
  { id: "wolf", emoji: "🐺", label: "Wolf" },
  { id: "dragon", emoji: "🐉", label: "Dragon" },
  { id: "parrot", emoji: "🦜", label: "Parrot" },
  { id: "cyber", emoji: "⚡", label: "Cyber" },
];

export default function ProfilePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  const currentAvatar = localStorage.getItem(`avatar_${user?.username}`) || "hacker";
  
  const [selectedAvatar, setSelectedAvatar] = useState(currentAvatar);
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  
  const [avatarSuccess, setAvatarSuccess] = useState("");

  const handleSaveAvatar = () => {
    if (user) {
      localStorage.setItem(`avatar_${user.username}`, selectedAvatar);
      setAvatarSuccess("✅ Avatar mis à jour avec succès !");
      setTimeout(() => {
        setAvatarSuccess("");
        window.location.reload();
      }, 1500);
    }
  };

  const handleChangePassword = async () => {
    setPasswordError("");
    setPasswordSuccess("");

    if (!oldPassword || !newPassword || !confirmPassword) {
      setPasswordError("Tous les champs sont requis");
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError("Le nouveau mot de passe doit faire au moins 8 caractères");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("Les nouveaux mots de passe ne correspondent pas");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${BACKEND_URL}/auth/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          oldPassword,
          newPassword
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setPasswordError(data.message || "Erreur lors du changement de mot de passe");
        return;
      }

      setPasswordSuccess("✅ Mot de passe changé avec succès !");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => {
        setShowPasswordSection(false);
        setPasswordSuccess("");
      }, 2000);
    } catch {
      setPasswordError("Erreur de connexion au serveur");
    }
  };

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0b0f1a 0%, #1a1f2e 100%)",
      padding: "40px 20px"
    }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        
        {/* En-tête */}
        <div style={{ marginBottom: "40px" }}>
          <h1 style={{ color: "#00ff9c", fontSize: "2.5rem", margin: "0 0 10px 0" }}>
            👤 Mon Profil
          </h1>
          <p style={{ color: "#9ca3af", fontSize: "1rem" }}>
            Gérez votre compte et vos préférences
          </p>
        </div>

        {/* Section Avatar */}
        <div style={{
          background: "#0b0f1a",
          border: "1px solid #2a3f3f",
          borderRadius: "16px",
          padding: "30px",
          marginBottom: "20px"
        }}>
          <h2 style={{ color: "#e5e7eb", fontSize: "1.3rem", marginBottom: "20px" }}>
            🎭 Votre Avatar
          </h2>

          {avatarSuccess && (
            <div style={{
              background: "#0a1a0a",
              border: "1px solid #00ff9c",
              borderRadius: "8px",
              padding: "12px 16px",
              color: "#00ff9c",
              marginBottom: "20px"
            }}>
              {avatarSuccess}
            </div>
          )}

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: "12px",
            marginBottom: "20px"
          }}>
            {AVATARS.map((av) => (
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
                  boxShadow: selectedAvatar === av.id ? "0 0 15px rgba(0,255,156,0.25)" : "none"
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
                <div style={{ fontSize: "2.2rem", marginBottom: "6px" }}>{av.emoji}</div>
                <div style={{
                  color: selectedAvatar === av.id ? "#00ff9c" : "#9ca3af",
                  fontSize: "0.72rem",
                  fontWeight: selectedAvatar === av.id ? "bold" : "normal"
                }}>
                  {av.label}
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleSaveAvatar}
            style={{
              width: "100%",
              padding: "14px",
              background: "#00ff9c",
              color: "#0b0f1a",
              border: "none",
              borderRadius: "8px",
              fontWeight: "bold",
              fontSize: "1rem",
              cursor: "pointer",
              transition: "all 0.2s"
            }}
            onMouseEnter={(e) => e.currentTarget.style.boxShadow = "0 0 20px rgba(0,255,156,0.4)"}
            onMouseLeave={(e) => e.currentTarget.style.boxShadow = "none"}
          >
            💾 Sauvegarder l'avatar
          </button>
        </div>

        {/* Section Mot de passe */}
        <div style={{
          background: "#0b0f1a",
          border: "1px solid #2a3f3f",
          borderRadius: "16px",
          padding: "30px"
        }}>
          <h2 style={{ color: "#e5e7eb", fontSize: "1.3rem", marginBottom: "8px" }}>
            🔐 Sécurité
          </h2>
          <p style={{ color: "#9ca3af", fontSize: "0.9rem", marginBottom: "20px" }}>
            Changez votre mot de passe pour sécuriser votre compte
          </p>

          {!showPasswordSection ? (
            <button
              onClick={() => setShowPasswordSection(true)}
              style={{
                padding: "12px 24px",
                background: "transparent",
                color: "#00ff9c",
                border: "1px solid #00ff9c",
                borderRadius: "8px",
                fontWeight: "bold",
                cursor: "pointer",
                transition: "all 0.2s"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#00ff9c";
                e.currentTarget.style.color = "#0b0f1a";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "#00ff9c";
              }}
            >
              🔄 Changer mon mot de passe
            </button>
          ) : (
            <div>
              {passwordError && (
                <div style={{
                  background: "#1a0a0a",
                  border: "1px solid #ef4444",
                  borderRadius: "8px",
                  padding: "12px 16px",
                  color: "#ef4444",
                  marginBottom: "20px"
                }}>
                  ⚠️ {passwordError}
                </div>
              )}

              {passwordSuccess && (
                <div style={{
                  background: "#0a1a0a",
                  border: "1px solid #00ff9c",
                  borderRadius: "8px",
                  padding: "12px 16px",
                  color: "#00ff9c",
                  marginBottom: "20px"
                }}>
                  {passwordSuccess}
                </div>
              )}

              <div style={{ marginBottom: "16px" }}>
                <label style={{ color: "#9ca3af", fontSize: "0.85rem", display: "block", marginBottom: "6px" }}>
                  Mot de passe actuel
                </label>
                <input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  style={inputStyle}
                />
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label style={{ color: "#9ca3af", fontSize: "0.85rem", display: "block", marginBottom: "6px" }}>
                  Nouveau mot de passe
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  style={inputStyle}
                />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ color: "#9ca3af", fontSize: "0.85rem", display: "block", marginBottom: "6px" }}>
                  Confirmer le nouveau mot de passe
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={inputStyle}
                />
              </div>

              <div style={{ display: "flex", gap: "12px" }}>
                <button
                  onClick={handleChangePassword}
                  style={{
                    flex: 1,
                    padding: "14px",
                    background: "#00ff9c",
                    color: "#0b0f1a",
                    border: "none",
                    borderRadius: "8px",
                    fontWeight: "bold",
                    cursor: "pointer"
                  }}
                >
                  ✓ Valider
                </button>
                <button
                  onClick={() => {
                    setShowPasswordSection(false);
                    setOldPassword("");
                    setNewPassword("");
                    setConfirmPassword("");
                    setPasswordError("");
                  }}
                  style={{
                    flex: 1,
                    padding: "14px",
                    background: "transparent",
                    color: "#9ca3af",
                    border: "1px solid #2a3f3f",
                    borderRadius: "8px",
                    cursor: "pointer"
                  }}
                >
                  ✗ Annuler
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Bouton retour */}
        <button
          onClick={() => navigate("/dashboard")}
          style={{
            marginTop: "30px",
            padding: "12px 24px",
            background: "transparent",
            color: "#9ca3af",
            border: "1px solid #2a3f3f",
            borderRadius: "8px",
            cursor: "pointer",
            transition: "all 0.2s"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "#00ff9c";
            e.currentTarget.style.color = "#00ff9c";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "#2a3f3f";
            e.currentTarget.style.color = "#9ca3af";
          }}
        >
          ← Retour au Dashboard
        </button>
      </div>
    </div>
  );
}

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
  transition: "border-color 0.2s"
};

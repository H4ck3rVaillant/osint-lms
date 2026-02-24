import { useState } from "react";
import { useGame, CTF_CHALLENGES } from "../context/GameContext";
import { useThemeColors } from "../context/ThemeContext";

const CATEGORY_CONFIG = {
  osint:  { label: "OSINT",          icon: "🔍", colorDark: "#00ff9c", colorLight: "#10b981" },
  crypto: { label: "Cryptographie",  icon: "🔐", colorDark: "#8b5cf6", colorLight: "#7c3aed" },
  web:    { label: "Web Hacking",    icon: "🌐", colorDark: "#3b82f6", colorLight: "#2563eb" },
};

const DIFFICULTY_CONFIG = {
  easy:   { label: "Facile",        color: "#22c55e", xp: "⭐" },
  medium: { label: "Intermédiaire", color: "#fbbf24", xp: "⭐⭐" },
  hard:   { label: "Difficile",     color: "#ef4444", xp: "⭐⭐⭐" },
};

export default function CTFPage() {
  const { challenges, submitFlag, useHint, gameState } = useGame();
  const colors = useThemeColors();
  const [activeCategory, setActiveCategory] = useState<"all" | "osint" | "crypto" | "web">("all");
  const [selectedChallenge, setSelectedChallenge] = useState<string | null>(null);
  const [flagInput, setFlagInput] = useState("");
  const [feedback, setFeedback] = useState<{ msg: string; ok: boolean } | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

  const filtered = activeCategory === "all"
    ? challenges
    : challenges.filter(c => c.category === activeCategory);

  const current = challenges.find(c => c.id === selectedChallenge);

  const totalSolved  = challenges.filter(c => c.solved).length;
  const totalPoints  = challenges.filter(c => c.solved).reduce((sum, c) => sum + c.points, 0);

  const handleSubmit = async () => {
    if (!selectedChallenge || !flagInput.trim()) return;
    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 600));
    const result = submitFlag(selectedChallenge, flagInput);
    setFeedback({ msg: result.message, ok: result.success });
    if (result.success) {
      setFlagInput("");
      setTimeout(() => {
        setFeedback(null);
        setSelectedChallenge(null);
        setShowHint(false);
      }, 2500);
    }
    setIsSubmitting(false);
  };

  const handleReset = () => {
    localStorage.removeItem("ctf_progress");
    setShowResetModal(false);
    window.location.reload();
  };

  return (
    <main style={{ padding: "40px", maxWidth: "1400px", margin: "0 auto" }}>

      {showResetModal && (
        <>
          <div onClick={() => setShowResetModal(false)} style={{
            position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.8)", zIndex: 9998
          }} />
          <div style={{
            position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
            background: colors.bgSecondary, border: "3px solid #ef4444", borderRadius: "16px",
            padding: "40px", maxWidth: "500px", zIndex: 9999, boxShadow: "0 0 50px rgba(239,68,68,0.5)"
          }}>
            <div style={{ fontSize: "4rem", textAlign: "center", marginBottom: "20px" }}>⚠️</div>
            <h2 style={{ color: "#ef4444", fontSize: "1.8rem", textAlign: "center", marginBottom: "15px" }}>
              Réinitialiser le CTF
            </h2>
            <p style={{ color: colors.textSecondary, textAlign: "center", marginBottom: "30px", lineHeight: "1.6" }}>
              Cette action va <strong style={{ color: "#ef4444" }}>supprimer DÉFINITIVEMENT</strong> tous vos flags validés !
            </p>
            <div style={{ display: "flex", gap: "15px" }}>
              <button onClick={() => setShowResetModal(false)} style={{
                flex: 1, padding: "14px", background: "transparent", border: `2px solid ${colors.border}`,
                borderRadius: "8px", color: colors.textPrimary, fontSize: "1rem", fontWeight: "600", cursor: "pointer"
              }}>Annuler</button>
              <button onClick={handleReset} style={{
                flex: 1, padding: "14px", background: "#ef4444", border: "none",
                borderRadius: "8px", color: "#fff", fontSize: "1rem", fontWeight: "600", cursor: "pointer"
              }}>Confirmer</button>
            </div>
          </div>
        </>
      )}

      <div style={{ marginBottom: "35px" }}>
        <h1 style={{ color: colors.accent, fontSize: "2.5rem", margin: 0 }}>
          🚩 Mini-CTF Platform
        </h1>
        <p style={{ color: colors.textSecondary, fontSize: "1.1rem", marginTop: "8px" }}>
          Capture The Flag — Résolvez les défis pour gagner des XP et des badges
        </p>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
        gap: "15px",
        marginBottom: "35px"
      }}>
        {[
          { icon: "🚩", value: `${totalSolved}/${challenges.length}`, label: "Défis résolus" },
          { icon: "⭐", value: `${gameState.xp} XP`,                  label: "Points totaux" },
          { icon: "🔥", value: `${gameState.streak}j`,                label: "Streak actuel" },
          { icon: "💎", value: gameState.levelName,                   label: "Niveau" },
          { icon: "🏅", value: `${gameState.badges.filter(b => b.unlocked).length}/20`, label: "Badges" },
        ].map((s, i) => (
          <div key={i} style={{
            background: colors.bgPrimary,
            border: `1px solid ${colors.border}`,
            borderRadius: "10px",
            padding: "18px",
            textAlign: "center"
          }}>
            <div style={{ fontSize: "1.8rem" }}>{s.icon}</div>
            <div style={{ color: colors.accent, fontWeight: "bold", fontSize: "1.3rem" }}>{s.value}</div>
            <div style={{ color: colors.textSecondary, fontSize: "0.8rem" }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: "12px", marginBottom: "30px", flexWrap: "wrap" }}>
        {([
          { key: "all",    label: "Tous",          icon: "🎯", count: challenges.length },
          { key: "osint",  label: "OSINT",          icon: "🔍", count: challenges.filter(c => c.category === "osint").length },
          { key: "crypto", label: "Cryptographie",  icon: "🔐", count: challenges.filter(c => c.category === "crypto").length },
          { key: "web",    label: "Web Hacking",    icon: "🌐", count: challenges.filter(c => c.category === "web").length },
        ] as const).map(cat => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key)}
            style={{
              background: activeCategory === cat.key ? colors.accent : colors.bgPrimary,
              color: activeCategory === cat.key ? "#ffffff" : colors.textPrimary,
              border: `1px solid ${activeCategory === cat.key ? colors.accent : colors.border}`,
              padding: "10px 22px",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "0.95rem",
              transition: "all 0.2s"
            }}
          >
            {cat.icon} {cat.label}
            <span style={{
              marginLeft: "8px",
              background: activeCategory === cat.key ? colors.bgPrimary : colors.bgSecondary,
              color: activeCategory === cat.key ? colors.accent : colors.textSecondary,
              padding: "2px 7px",
              borderRadius: "10px",
              fontSize: "0.8rem"
            }}>
              {cat.count}
            </span>
          </button>
        ))}
      </div>

      <div style={{
        background: colors.bgSecondary, border: "2px solid #ef4444",
        borderRadius: "12px", padding: "25px", textAlign: "center", marginBottom: "30px"
      }}>
        <h3 style={{ fontSize: "1.2rem", fontWeight: "600", color: "#ef4444", marginBottom: "10px" }}>
          ⚠️ Zone Dangereuse
        </h3>
        <p style={{ color: colors.textSecondary, marginBottom: "20px", fontSize: "0.95rem" }}>
          Réinitialiser votre progression supprimera TOUS vos flags CTF.
        </p>
        <button onClick={() => setShowResetModal(true)} style={{
          padding: "14px 28px", background: "transparent", border: "2px solid #ef4444",
          borderRadius: "8px", color: "#ef4444", fontSize: "1rem", fontWeight: "600", cursor: "pointer"
        }}>🔄 Réinitialiser</button>
      </div>

      <p style={{ color: colors.textSecondary, textAlign: "center", marginTop: "50px" }}>
        Plus de challenges à venir ! Revenez régulièrement ! 🚀
      </p>

    </main>
  );
}

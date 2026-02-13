import { useState } from "react";
import { useGame, CTF_CHALLENGES } from "../context/GameContext";

const CATEGORY_CONFIG = {
  osint:  { label: "OSINT",          icon: "🔍", color: "#00ff9c" },
  crypto: { label: "Cryptographie",  icon: "🔐", color: "#8b5cf6" },
  web:    { label: "Web Hacking",    icon: "🌐", color: "#3b82f6" },
};

const DIFFICULTY_CONFIG = {
  easy:   { label: "Facile",        color: "#22c55e", xp: "⭐" },
  medium: { label: "Intermédiaire", color: "#fbbf24", xp: "⭐⭐" },
  hard:   { label: "Difficile",     color: "#ef4444", xp: "⭐⭐⭐" },
};

export default function CTFPage() {
  const { challenges, submitFlag, useHint, gameState } = useGame();
  const [activeCategory, setActiveCategory] = useState<"all" | "osint" | "crypto" | "web">("all");
  const [selectedChallenge, setSelectedChallenge] = useState<string | null>(null);
  const [flagInput, setFlagInput] = useState("");
  const [feedback, setFeedback] = useState<{ msg: string; ok: boolean } | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filtered = activeCategory === "all"
    ? challenges
    : challenges.filter(c => c.category === activeCategory);

  const current = challenges.find(c => c.id === selectedChallenge);

  const totalSolved  = challenges.filter(c => c.solved).length;
  const totalPoints  = challenges.filter(c => c.solved).reduce((sum, c) => sum + c.points, 0);

  const handleSubmit = async () => {
    if (!selectedChallenge || !flagInput.trim()) return;
    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 600)); // Petit délai pour le feedback visuel
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

  return (
    <main style={{ padding: "40px", maxWidth: "1400px", margin: "0 auto" }}>

      {/* Header */}
      <div style={{ marginBottom: "35px" }}>
        <h1 style={{ color: "#00ff9c", fontSize: "2.5rem", margin: 0 }}>
          🚩 Mini-CTF Platform
        </h1>
        <p style={{ color: "#9ca3af", fontSize: "1.1rem", marginTop: "8px" }}>
          Capture The Flag — Résolvez les défis pour gagner des XP et des badges
        </p>
      </div>

      {/* Stats globales */}
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
            background: "#0b0f1a",
            border: "1px solid #2a3f3f",
            borderRadius: "10px",
            padding: "18px",
            textAlign: "center"
          }}>
            <div style={{ fontSize: "1.8rem" }}>{s.icon}</div>
            <div style={{ color: "#00ff9c", fontWeight: "bold", fontSize: "1.3rem" }}>{s.value}</div>
            <div style={{ color: "#9ca3af", fontSize: "0.8rem" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filtres catégories */}
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
              background: activeCategory === cat.key ? "#00ff9c" : "#0b0f1a",
              color: activeCategory === cat.key ? "#0b0f1a" : "#e5e7eb",
              border: `1px solid ${activeCategory === cat.key ? "#00ff9c" : "#2a3f3f"}`,
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
              background: activeCategory === cat.key ? "#0b0f1a" : "#1a1f2e",
              color: activeCategory === cat.key ? "#00ff9c" : "#9ca3af",
              padding: "2px 7px",
              borderRadius: "10px",
              fontSize: "0.8rem"
            }}>
              {cat.count}
            </span>
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: selectedChallenge ? "1fr 1fr" : "1fr", gap: "25px" }}>

        {/* Grille des défis */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "18px", alignContent: "start" }}>
          {filtered.map(ch => {
            const cat  = CATEGORY_CONFIG[ch.category];
            const diff = DIFFICULTY_CONFIG[ch.difficulty];
            const isSelected = selectedChallenge === ch.id;

            return (
              <div
                key={ch.id}
                onClick={() => {
                  if (!ch.solved) {
                    setSelectedChallenge(isSelected ? null : ch.id);
                    setFlagInput("");
                    setFeedback(null);
                    setShowHint(false);
                  }
                }}
                style={{
                  background: ch.solved ? "#0a1a0a" : "#0b0f1a",
                  border: `2px solid ${ch.solved ? "#22c55e" : isSelected ? "#00ff9c" : "#2a3f3f"}`,
                  borderRadius: "12px",
                  padding: "22px",
                  cursor: ch.solved ? "default" : "pointer",
                  transition: "all 0.3s",
                  position: "relative",
                  opacity: ch.solved ? 0.85 : 1
                }}
                onMouseEnter={(e) => {
                  if (!ch.solved && !isSelected) e.currentTarget.style.borderColor = "#00ff9c";
                }}
                onMouseLeave={(e) => {
                  if (!ch.solved && !isSelected) e.currentTarget.style.borderColor = "#2a3f3f";
                }}
              >
                {/* Badge résolu */}
                {ch.solved && (
                  <div style={{
                    position: "absolute",
                    top: "12px",
                    right: "12px",
                    background: "#22c55e",
                    color: "#fff",
                    borderRadius: "6px",
                    padding: "3px 10px",
                    fontSize: "0.75rem",
                    fontWeight: "bold"
                  }}>
                    ✓ RÉSOLU
                  </div>
                )}

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                  <span style={{
                    background: "#1a1f2e",
                    color: cat.color,
                    border: `1px solid ${cat.color}`,
                    padding: "4px 10px",
                    borderRadius: "6px",
                    fontSize: "0.8rem",
                    fontWeight: "bold"
                  }}>
                    {cat.icon} {cat.label}
                  </span>
                  <span style={{ color: "#fbbf24", fontSize: "0.9rem" }}>{diff.xp}</span>
                </div>

                <h3 style={{ color: ch.solved ? "#22c55e" : "#e5e7eb", fontSize: "1.1rem", marginBottom: "8px" }}>
                  {ch.title}
                </h3>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "15px" }}>
                  <span style={{ color: diff.color, fontSize: "0.85rem", fontWeight: "bold" }}>
                    {diff.label}
                  </span>
                  <span style={{
                    background: "#1a1f2e",
                    color: "#00ff9c",
                    padding: "4px 10px",
                    borderRadius: "6px",
                    fontWeight: "bold",
                    fontSize: "0.9rem"
                  }}>
                    +{ch.points} XP
                  </span>
                </div>

                {ch.attempts > 0 && !ch.solved && (
                  <p style={{ color: "#ef4444", fontSize: "0.78rem", marginTop: "8px" }}>
                    ⚠️ {ch.attempts} tentative{ch.attempts > 1 ? "s" : ""} incorrecte{ch.attempts > 1 ? "s" : ""}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* Panneau du défi sélectionné */}
        {current && !current.solved && (
          <div style={{
            background: "#0b0f1a",
            border: "2px solid #00ff9c",
            borderRadius: "12px",
            padding: "30px",
            position: "sticky",
            top: "100px",
            maxHeight: "80vh",
            overflowY: "auto"
          }}>
            {/* En-tête */}
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
              <span style={{
                background: "#1a1f2e",
                color: CATEGORY_CONFIG[current.category].color,
                border: `1px solid ${CATEGORY_CONFIG[current.category].color}`,
                padding: "5px 12px",
                borderRadius: "6px",
                fontSize: "0.85rem",
                fontWeight: "bold"
              }}>
                {CATEGORY_CONFIG[current.category].icon} {CATEGORY_CONFIG[current.category].label}
              </span>
              <button
                onClick={() => { setSelectedChallenge(null); setFeedback(null); setShowHint(false); }}
                style={{ background: "transparent", border: "none", color: "#9ca3af", cursor: "pointer", fontSize: "1.2rem" }}
              >
                ✕
              </button>
            </div>

            <h2 style={{ color: "#00ff9c", fontSize: "1.6rem", marginBottom: "8px" }}>
              {current.title}
            </h2>

            <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
              <span style={{ color: DIFFICULTY_CONFIG[current.difficulty].color, fontSize: "0.9rem", fontWeight: "bold" }}>
                {DIFFICULTY_CONFIG[current.difficulty].label}
              </span>
              <span style={{ color: "#9ca3af" }}>•</span>
              <span style={{ color: "#00ff9c", fontWeight: "bold" }}>+{current.points} XP</span>
            </div>

            {/* Description avec markdown basique */}
            <div style={{
              background: "#1a1f2e",
              borderRadius: "8px",
              padding: "20px",
              marginBottom: "20px",
              color: "#e5e7eb",
              lineHeight: "1.8",
              fontSize: "0.95rem",
              whiteSpace: "pre-wrap"
            }}>
              {current.description.split(/(\*\*.*?\*\*|`[^`]+`|\`\`\`[\s\S]*?\`\`\`)/).map((part, i) => {
                if (part.startsWith("**") && part.endsWith("**"))
                  return <strong key={i} style={{ color: "#00ff9c" }}>{part.slice(2, -2)}</strong>;
                if (part.startsWith("```") && part.endsWith("```"))
                  return <pre key={i} style={{ background: "#0b0f1a", padding: "12px", borderRadius: "6px", color: "#00ff9c", overflowX: "auto", fontSize: "0.85rem" }}>{part.slice(3, -3).trim()}</pre>;
                if (part.startsWith("`") && part.endsWith("`"))
                  return <code key={i} style={{ background: "#0b0f1a", color: "#00ff9c", padding: "2px 6px", borderRadius: "4px" }}>{part.slice(1, -1)}</code>;
                return <span key={i}>{part}</span>;
              })}
            </div>

            {/* Hint */}
            {current.hint && (
              <div style={{ marginBottom: "20px" }}>
                {!showHint ? (
                  <button
                    onClick={() => { setShowHint(true); useHint(current.id); }}
                    style={{
                      background: "transparent",
                      border: "1px solid #fbbf24",
                      color: "#fbbf24",
                      padding: "8px 18px",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontSize: "0.9rem",
                      transition: "all 0.2s"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "#1a1500"}
                    onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                  >
                    💡 Afficher l'indice
                  </button>
                ) : (
                  <div style={{
                    background: "#1a1500",
                    border: "1px solid #fbbf24",
                    borderRadius: "8px",
                    padding: "15px"
                  }}>
                    <p style={{ color: "#fbbf24", fontWeight: "bold", marginBottom: "6px" }}>💡 Indice :</p>
                    <p style={{ color: "#e5e7eb", margin: 0, lineHeight: "1.6" }}>{current.hint}</p>
                  </div>
                )}
              </div>
            )}

            {/* Soumission */}
            <div>
              <label style={{ color: "#00ff9c", fontWeight: "bold", display: "block", marginBottom: "8px" }}>
                🚩 Soumettre le flag
              </label>
              <input
                type="text"
                value={flagInput}
                onChange={(e) => setFlagInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                placeholder="FLAG{...}"
                style={{
                  width: "100%",
                  padding: "12px",
                  background: "#1a1f2e",
                  border: "1px solid #2a3f3f",
                  borderRadius: "8px",
                  color: "#e5e7eb",
                  fontFamily: "monospace",
                  fontSize: "1rem",
                  outline: "none",
                  marginBottom: "12px",
                  boxSizing: "border-box"
                }}
                onFocus={(e) => e.target.style.borderColor = "#00ff9c"}
                onBlur={(e) => e.target.style.borderColor = "#2a3f3f"}
              />

              {feedback && (
                <div style={{
                  background: feedback.ok ? "#0a1a0a" : "#1a0a0a",
                  border: `1px solid ${feedback.ok ? "#22c55e" : "#ef4444"}`,
                  borderRadius: "8px",
                  padding: "12px",
                  marginBottom: "12px",
                  color: feedback.ok ? "#22c55e" : "#ef4444",
                  fontWeight: "bold"
                }}>
                  {feedback.msg}
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={isSubmitting || !flagInput.trim()}
                style={{
                  width: "100%",
                  padding: "14px",
                  background: isSubmitting || !flagInput.trim() ? "#6b7280" : "#00ff9c",
                  color: "#0b0f1a",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: "bold",
                  fontSize: "1rem",
                  cursor: isSubmitting || !flagInput.trim() ? "not-allowed" : "pointer",
                  transition: "all 0.3s"
                }}
              >
                {isSubmitting ? "Vérification..." : "Valider le flag →"}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

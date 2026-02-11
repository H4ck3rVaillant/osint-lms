import { useState } from "react";
import { useGame, LEVELS, getLevelInfo, getXpToNextLevel } from "../context/GameContext";

const RARITY_CONFIG = {
  common:    { label: "Commun",     color: "#9ca3af", bg: "#1a1f2e", glow: "none" },
  rare:      { label: "Rare",       color: "#3b82f6", bg: "#0b1530", glow: "0 0 10px rgba(59,130,246,0.3)" },
  epic:      { label: "Épique",     color: "#8b5cf6", bg: "#130b2e", glow: "0 0 15px rgba(139,92,246,0.4)" },
  legendary: { label: "Légendaire", color: "#fbbf24", bg: "#1a1000", glow: "0 0 20px rgba(251,191,36,0.5)" },
};

function ActivityCalendar({ calendar }: { calendar: Record<string, number> }) {
  const today = new Date();
  const weeks: { date: string; count: number }[][] = [];
  let currentWeek: { date: string; count: number }[] = [];

  // Générer les 52 dernières semaines
  for (let i = 363; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split("T")[0];
    const day = { date: key, count: calendar[key] || 0 };

    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
    currentWeek.push(day);
  }
  if (currentWeek.length > 0) weeks.push(currentWeek);

  const getColor = (count: number) => {
    if (count === 0) return "#1a1f2e";
    if (count === 1) return "#0d4a2e";
    if (count === 2) return "#1a7a4a";
    if (count >= 3) return "#00ff9c";
    return "#1a1f2e";
  };

  const months = ["Jan","Fév","Mar","Avr","Mai","Jun","Jul","Aoû","Sep","Oct","Nov","Déc"];
  const totalDays = Object.values(calendar).filter(v => v > 0).length;

  return (
    <div>
      <div style={{ overflowX: "auto", paddingBottom: "8px" }}>
        {/* Mois */}
        <div style={{ display: "flex", gap: "2px", marginBottom: "4px", paddingLeft: "20px" }}>
          {weeks.filter((_, i) => i % 4 === 0).map((week, i) => {
            const d = new Date(week[0].date);
            return (
              <span key={i} style={{
                color: "#9ca3af",
                fontSize: "0.7rem",
                width: "52px",
                display: "inline-block"
              }}>
                {months[d.getMonth()]}
              </span>
            );
          })}
        </div>

        <div style={{ display: "flex", gap: "3px" }}>
          {/* Jours */}
          <div style={{ display: "flex", flexDirection: "column", gap: "3px", marginRight: "4px" }}>
            {["", "Lun", "", "Mer", "", "Ven", ""].map((d, i) => (
              <span key={i} style={{ color: "#9ca3af", fontSize: "0.65rem", height: "12px", lineHeight: "12px" }}>
                {d}
              </span>
            ))}
          </div>

          {/* Grid */}
          {weeks.map((week, wi) => (
            <div key={wi} style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
              {week.map((day, di) => (
                <div
                  key={di}
                  title={`${day.date} : ${day.count} activité${day.count > 1 ? "s" : ""}`}
                  style={{
                    width: "12px",
                    height: "12px",
                    borderRadius: "2px",
                    background: getColor(day.count),
                    transition: "all 0.2s",
                    cursor: "default"
                  }}
                  onMouseEnter={(e) => {
                    if (day.count > 0) e.currentTarget.style.transform = "scale(1.4)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Légende */}
      <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "8px", justifyContent: "flex-end" }}>
        <span style={{ color: "#9ca3af", fontSize: "0.75rem" }}>Moins</span>
        {["#1a1f2e", "#0d4a2e", "#1a7a4a", "#00ff9c"].map((c, i) => (
          <div key={i} style={{ width: "12px", height: "12px", borderRadius: "2px", background: c }} />
        ))}
        <span style={{ color: "#9ca3af", fontSize: "0.75rem" }}>Plus</span>
        <span style={{ color: "#9ca3af", fontSize: "0.75rem", marginLeft: "12px" }}>
          {totalDays} jour{totalDays > 1 ? "s" : ""} actif{totalDays > 1 ? "s" : ""}
        </span>
      </div>
    </div>
  );
}

export default function Gamification() {
  const { gameState } = useGame();
  const [badgeFilter, setBadgeFilter] = useState<"all" | "unlocked" | "locked">("all");

  const levelInfo  = getLevelInfo(gameState.xp);
  const xpProgress = getXpToNextLevel(gameState.xp);
  const progressPct = xpProgress ? Math.round((xpProgress.current / xpProgress.needed) * 100) : 100;

  const filteredBadges = gameState.badges.filter(b => {
    if (badgeFilter === "unlocked") return b.unlocked;
    if (badgeFilter === "locked")   return !b.unlocked;
    return true;
  });

  const unlockedCount = gameState.badges.filter(b => b.unlocked).length;

  return (
    <main style={{ padding: "40px", maxWidth: "1200px", margin: "0 auto" }}>

      {/* Header */}
      <div style={{ marginBottom: "35px" }}>
        <h1 style={{ color: "#00ff9c", fontSize: "2.5rem", margin: 0 }}>⭐ Progression & Récompenses</h1>
        <p style={{ color: "#9ca3af", marginTop: "8px" }}>Votre parcours, vos badges, votre streak</p>
      </div>

      {/* === SECTION XP & NIVEAU === */}
      <section style={{ marginBottom: "40px" }}>
        <h2 style={{ color: "#00ff9c", fontSize: "1.6rem", marginBottom: "20px" }}>⭐ Système de Niveaux</h2>

        {/* Carte niveau actuel */}
        <div style={{
          background: "linear-gradient(135deg, #0b1a2e, #0b0f1a)",
          border: `2px solid ${levelInfo.color}`,
          borderRadius: "16px",
          padding: "30px",
          marginBottom: "25px",
          boxShadow: `0 0 30px ${levelInfo.color}22`
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "25px", flexWrap: "wrap" }}>
            <div style={{ fontSize: "5rem", lineHeight: 1 }}>{levelInfo.icon}</div>
            <div style={{ flex: 1 }}>
              <p style={{ color: "#9ca3af", fontSize: "0.9rem", margin: "0 0 4px 0" }}>NIVEAU ACTUEL</p>
              <h2 style={{ color: levelInfo.color, fontSize: "2.2rem", margin: "0 0 6px 0", fontWeight: "bold" }}>
                {levelInfo.name}
              </h2>
              <p style={{ color: "#e5e7eb", margin: 0 }}>
                <span style={{ color: "#fbbf24", fontWeight: "bold", fontSize: "1.3rem" }}>{gameState.xp}</span>
                <span style={{ color: "#9ca3af" }}> XP</span>
                {xpProgress && (
                  <span style={{ color: "#9ca3af", fontSize: "0.9rem" }}>
                    {" "}— encore <strong style={{ color: "#00ff9c" }}>{xpProgress.needed - xpProgress.current} XP</strong> pour le prochain niveau
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Barre de progression */}
          {xpProgress && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <span style={{ color: "#9ca3af", fontSize: "0.85rem" }}>Progression vers le prochain niveau</span>
                <span style={{ color: "#00ff9c", fontWeight: "bold" }}>{progressPct}%</span>
              </div>
              <div style={{ background: "#1a1f2e", borderRadius: "10px", height: "14px", overflow: "hidden" }}>
                <div style={{
                  background: `linear-gradient(90deg, ${levelInfo.color}, #00ff9c)`,
                  width: `${progressPct}%`,
                  height: "100%",
                  borderRadius: "10px",
                  transition: "width 1s ease",
                  boxShadow: `0 0 10px ${levelInfo.color}88`
                }} />
              </div>
            </div>
          )}
        </div>

        {/* Tous les niveaux */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "12px" }}>
          {LEVELS.map((lvl, i) => {
            const isCurrentLevel = gameState.xp >= lvl.min && gameState.xp <= lvl.max;
            const isReached = gameState.xp >= lvl.min;
            return (
              <div key={i} style={{
                background: isCurrentLevel ? "#0b1a2e" : "#0b0f1a",
                border: `2px solid ${isCurrentLevel ? lvl.color : isReached ? lvl.color + "55" : "#2a3f3f"}`,
                borderRadius: "10px",
                padding: "16px",
                textAlign: "center",
                transition: "all 0.3s",
                opacity: isReached ? 1 : 0.5,
                boxShadow: isCurrentLevel ? `0 0 15px ${lvl.color}44` : "none"
              }}>
                <div style={{ fontSize: "2rem", marginBottom: "6px" }}>{lvl.icon}</div>
                <p style={{ color: isReached ? lvl.color : "#9ca3af", fontWeight: "bold", fontSize: "0.9rem", margin: "0 0 4px 0" }}>
                  {lvl.name}
                </p>
                <p style={{ color: "#9ca3af", fontSize: "0.75rem", margin: 0 }}>
                  {lvl.min === 0 ? "0" : lvl.min.toLocaleString()}–{lvl.max === 9999 ? "∞" : lvl.max.toLocaleString()} XP
                </p>
                {isCurrentLevel && (
                  <span style={{
                    display: "inline-block",
                    marginTop: "6px",
                    background: lvl.color,
                    color: "#0b0f1a",
                    fontSize: "0.7rem",
                    padding: "2px 8px",
                    borderRadius: "4px",
                    fontWeight: "bold"
                  }}>ACTUEL</span>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* === SECTION STREAK === */}
      <section style={{ marginBottom: "40px" }}>
        <h2 style={{ color: "#00ff9c", fontSize: "1.6rem", marginBottom: "20px" }}>🔥 Streak & Activité</h2>

        {/* Stats streak */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "15px", marginBottom: "25px" }}>
          {[
            { icon: "🔥", value: `${gameState.streak}`, label: "Streak actuel", color: "#ef4444" },
            { icon: "🏆", value: `${gameState.longestStreak}`, label: "Record streak", color: "#fbbf24" },
            { icon: "📅", value: `${Object.values(gameState.activityCalendar).filter(v => v > 0).length}`, label: "Jours actifs", color: "#22c55e" },
            { icon: "⚡", value: `${Object.values(gameState.activityCalendar).reduce((s, v) => s + v, 0)}`, label: "Total activités", color: "#3b82f6" },
          ].map((s, i) => (
            <div key={i} style={{
              background: "#0b0f1a",
              border: `1px solid ${s.color}44`,
              borderRadius: "10px",
              padding: "20px",
              textAlign: "center"
            }}>
              <div style={{ fontSize: "2.2rem", marginBottom: "8px" }}>{s.icon}</div>
              <div style={{ color: s.color, fontSize: "2rem", fontWeight: "bold", lineHeight: 1 }}>{s.value}</div>
              <div style={{ color: "#9ca3af", fontSize: "0.8rem", marginTop: "6px" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Calendrier activité style GitHub */}
        <div style={{
          background: "#0b0f1a",
          border: "1px solid #2a3f3f",
          borderRadius: "12px",
          padding: "25px"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
            <h3 style={{ color: "#e5e7eb", margin: 0, fontSize: "1rem" }}>
              Historique d'activité (12 derniers mois)
            </h3>
            {gameState.streak >= 3 && (
              <span style={{
                background: "#ef4444",
                color: "#fff",
                padding: "4px 12px",
                borderRadius: "6px",
                fontSize: "0.85rem",
                fontWeight: "bold"
              }}>
                🔥 {gameState.streak} jours consécutifs !
              </span>
            )}
          </div>
          <ActivityCalendar calendar={gameState.activityCalendar} />
        </div>

        {/* Jalons streak */}
        <div style={{ marginTop: "20px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "10px" }}>
          {[
            { days: 3,  label: "3 jours",    icon: "🔥", xp: 40 },
            { days: 7,  label: "1 semaine",   icon: "📅", xp: 100 },
            { days: 14, label: "2 semaines",  icon: "💪", xp: 150 },
            { days: 30, label: "1 mois",      icon: "🌋", xp: 300 },
            { days: 100,label: "100 jours",   icon: "👑", xp: 500 },
          ].map((milestone, i) => {
            const reached = gameState.longestStreak >= milestone.days;
            return (
              <div key={i} style={{
                background: reached ? "#0a1a0a" : "#0b0f1a",
                border: `1px solid ${reached ? "#22c55e" : "#2a3f3f"}`,
                borderRadius: "8px",
                padding: "12px",
                textAlign: "center",
                opacity: reached ? 1 : 0.6
              }}>
                <div style={{ fontSize: "1.5rem" }}>{reached ? milestone.icon : "🔒"}</div>
                <p style={{ color: reached ? "#22c55e" : "#9ca3af", fontWeight: "bold", fontSize: "0.85rem", margin: "4px 0" }}>
                  {milestone.label}
                </p>
                <p style={{ color: "#fbbf24", fontSize: "0.75rem", margin: 0 }}>+{milestone.xp} XP</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* === SECTION BADGES === */}
      <section>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
          <h2 style={{ color: "#00ff9c", fontSize: "1.6rem", margin: 0 }}>
            🏅 Collection de Badges ({unlockedCount}/20)
          </h2>
          <div style={{ display: "flex", gap: "8px" }}>
            {([
              { key: "all",      label: "Tous" },
              { key: "unlocked", label: `Débloqués (${unlockedCount})` },
              { key: "locked",   label: `Verrouillés (${20 - unlockedCount})` },
            ] as const).map(f => (
              <button
                key={f.key}
                onClick={() => setBadgeFilter(f.key)}
                style={{
                  background: badgeFilter === f.key ? "#00ff9c" : "#0b0f1a",
                  color: badgeFilter === f.key ? "#0b0f1a" : "#e5e7eb",
                  border: `1px solid ${badgeFilter === f.key ? "#00ff9c" : "#2a3f3f"}`,
                  padding: "7px 14px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  fontSize: "0.85rem",
                  transition: "all 0.2s"
                }}
              >{f.label}</button>
            ))}
          </div>
        </div>

        {/* Barre de complétion globale */}
        <div style={{ marginBottom: "25px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
            <span style={{ color: "#9ca3af", fontSize: "0.85rem" }}>Complétion des badges</span>
            <span style={{ color: "#00ff9c", fontWeight: "bold" }}>{Math.round((unlockedCount / 20) * 100)}%</span>
          </div>
          <div style={{ background: "#1a1f2e", borderRadius: "8px", height: "10px" }}>
            <div style={{
              background: "linear-gradient(90deg, #00ff9c, #3b82f6)",
              width: `${(unlockedCount / 20) * 100}%`,
              height: "100%",
              borderRadius: "8px",
              transition: "width 1s ease"
            }} />
          </div>
        </div>

        {/* Grille badges par rareté */}
        {(["legendary", "epic", "rare", "common"] as const)
          .filter(r => filteredBadges.some(b => b.rarity === r))
          .map(rarity => {
            const rarityBadges = filteredBadges.filter(b => b.rarity === rarity);
            const cfg = RARITY_CONFIG[rarity];
            return (
              <div key={rarity} style={{ marginBottom: "28px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
                  <div style={{ height: "2px", flex: 1, background: cfg.color + "44" }} />
                  <span style={{
                    color: cfg.color,
                    fontWeight: "bold",
                    fontSize: "0.9rem",
                    textTransform: "uppercase",
                    letterSpacing: "2px"
                  }}>
                    {cfg.label}
                  </span>
                  <div style={{ height: "2px", flex: 1, background: cfg.color + "44" }} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "14px" }}>
                  {rarityBadges.map(badge => (
                    <div
                      key={badge.id}
                      style={{
                        background: badge.unlocked ? cfg.bg : "#0b0f1a",
                        border: `2px solid ${badge.unlocked ? cfg.color : "#2a3f3f"}`,
                        borderRadius: "12px",
                        padding: "18px",
                        textAlign: "center",
                        transition: "all 0.3s",
                        boxShadow: badge.unlocked ? cfg.glow : "none",
                        opacity: badge.unlocked ? 1 : 0.5,
                        filter: badge.unlocked ? "none" : "grayscale(80%)"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-4px)";
                        if (badge.unlocked) e.currentTarget.style.boxShadow = cfg.glow.replace("0.3", "0.6").replace("0.4", "0.8").replace("0.5", "1");
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        if (badge.unlocked) e.currentTarget.style.boxShadow = cfg.glow;
                      }}
                    >
                      <div style={{ fontSize: "2.5rem", marginBottom: "8px", filter: badge.unlocked ? "none" : "grayscale(100%)" }}>
                        {badge.unlocked ? badge.icon : "🔒"}
                      </div>
                      <p style={{
                        color: badge.unlocked ? cfg.color : "#9ca3af",
                        fontWeight: "bold",
                        fontSize: "0.95rem",
                        margin: "0 0 6px 0"
                      }}>
                        {badge.name}
                      </p>
                      <p style={{ color: "#9ca3af", fontSize: "0.78rem", margin: "0 0 10px 0", lineHeight: "1.4" }}>
                        {badge.description}
                      </p>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{
                          background: "#1a1f2e",
                          color: cfg.color,
                          border: `1px solid ${cfg.color}44`,
                          padding: "3px 8px",
                          borderRadius: "4px",
                          fontSize: "0.75rem"
                        }}>
                          +{badge.xpReward} XP
                        </span>
                        {badge.unlocked && badge.unlockedAt && (
                          <span style={{ color: "#9ca3af", fontSize: "0.7rem" }}>
                            {new Date(badge.unlockedAt).toLocaleDateString("fr-FR")}
                          </span>
                        )}
                        {!badge.unlocked && (
                          <span style={{ color: "#9ca3af", fontSize: "0.7rem" }}>
                            {badge.condition}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
      </section>
    </main>
  );
}

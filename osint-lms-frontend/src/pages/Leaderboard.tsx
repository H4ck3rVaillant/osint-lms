import { useState, useEffect } from "react";
import { useThemeColors } from "../context/ThemeContext";
import { useGame, getLevelInfo } from "../context/GameContext";
import { useAuth } from "../auth/AuthContext";

const AVATARS_LB: Record<string, string> = {
  skull: "💀", ghost: "👻", robot: "🤖", ninja: "🥷", 
  wizard: "🧙", dragon: "🐉", phoenix: "🔥", wolf: "🐺",
  default: "🧑‍💻"
};

interface LeaderboardEntry {
  rank: number;
  username: string;
  xp: number;
  level: number;
  streak: number;
  longestStreak: number;
  avatar: string;
  solvedChallenges: number;
  isMe?: boolean;
}

export default function Leaderboard() {
  const colors = useThemeColors();
  const { gameState } = useGame();
  const { user, token } = useAuth();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Charger le leaderboard depuis l'API
  const loadLeaderboard = async () => {
    if (!token) return;
    
    try {
      const response = await fetch("https://osint-lms-backend.onrender.com/game/leaderboard", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          // Marquer l'utilisateur actuel
          const leaderboardWithMe = data.data.map((entry: LeaderboardEntry) => ({
            ...entry,
            isMe: entry.username === user?.username
          }));
          setLeaderboard(leaderboardWithMe);
          setLastUpdate(new Date());
        }
      }
    } catch (error) {
      console.error("Erreur chargement leaderboard:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Charger au démarrage
  useEffect(() => {
    loadLeaderboard();
  }, [token]);

  // Recharger toutes les 30 secondes
  useEffect(() => {
    const timer = setInterval(() => {
      loadLeaderboard();
    }, 30000);
    return () => clearInterval(timer);
  }, [token]);

  const myEntry = leaderboard.find(e => e.isMe);
  const myRank = myEntry?.rank || 999;

  const getRankStyle = (rank: number) => {
    if (rank === 1) return { bg: "#fbbf24", color: colors.bgPrimary, icon: "🥇" };
    if (rank === 2) return { bg: colors.textSecondary, color: colors.bgPrimary, icon: "🥈" };
    if (rank === 3) return { bg: "#d97706", color: colors.bgPrimary, icon: "🥉" };
    return { bg: colors.bgSecondary, color: colors.textPrimary, icon: `#${rank}` };
  };

  const getLevelName = (level: number, xp: number) => {
    const info = getLevelInfo(xp);
    return info.name;
  };

  const getLevelColor = (xp: number) => {
    const levelName = getLevelName(0, xp);
    const map: Record<string, string> = {
      "Newbie": colors.textSecondary,
      "Script Kiddie": "#22c55e",
      "Hacker": "#3b82f6",
      "Elite Hacker": "#8b5cf6",
      "Cyber Ninja": "#f59e0b",
      "Zero Day Master": "#ef4444",
    };
    return map[levelName] || colors.textSecondary;
  };

  const getAvatar = (avatarKey: string) => {
    return AVATARS_LB[avatarKey] || AVATARS_LB.default;
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  if (isLoading) {
    return (
      <main style={{ paddingTop: "80px", padding: "40px", textAlign: "center", minHeight: "100vh", background: colors.bgPrimary }}>
        <p style={{ color: colors.textSecondary, fontSize: "1.2rem" }}>Chargement du classement...</p>
      </main>
    );
  }

  return (
    <main style={{ paddingTop: "80px", padding: "40px", maxWidth: "1100px", margin: "0 auto", minHeight: "100vh", background: colors.bgPrimary }}>

      {/* Header */}
      <div style={{ marginBottom: "35px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "15px" }}>
        <div>
          <h1 style={{ color: colors.accent, fontSize: "2.5rem", margin: 0 }}>
            🏆 Leaderboard
          </h1>
          <p style={{ color: colors.textSecondary, marginTop: "8px" }}>
            Classement global des hackers — Mis à jour en temps réel
          </p>
          <p style={{ color: colors.textTertiary, fontSize: "0.85rem", marginTop: "4px" }}>
            Dernière mise à jour : {lastUpdate.toLocaleTimeString('fr-FR')}
          </p>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{
            background: colors.bgPrimary,
            border: "1px solid #00ff9c",
            borderRadius: "10px",
            padding: "12px 20px",
            display: "inline-block"
          }}>
            <p style={{ color: colors.textSecondary, fontSize: "0.8rem", margin: "0 0 4px 0" }}>Votre rang</p>
            <p style={{ color: colors.accent, fontSize: "2rem", fontWeight: "bold", margin: 0 }}>#{myRank}</p>
          </div>
        </div>
      </div>

      {/* Ma position rapide */}
      {myEntry && (
        <div style={{
          background: "linear-gradient(135deg, #0b1a2e, #0b0f1a)",
          border: "2px solid #00ff9c",
          borderRadius: "12px",
          padding: "20px 25px",
          marginBottom: "30px",
          display: "flex",
          alignItems: "center",
          gap: "20px",
          flexWrap: "wrap"
        }}>
          <div style={{ fontSize: "2.5rem" }}>{getAvatar(myEntry.avatar)}</div>
          <div style={{ flex: 1 }}>
            <p style={{ color: colors.textSecondary, fontSize: "0.8rem", margin: "0 0 4px 0" }}>VOTRE PROFIL</p>
            <p style={{ color: colors.accent, fontWeight: "bold", fontSize: "1.2rem", margin: 0 }}>
              {user?.username || "Joueur"}
            </p>
          </div>
          {[
            { label: "XP Total", value: `${myEntry.xp} XP`, icon: "⭐" },
            { label: "Défis résolus", value: `${myEntry.solvedChallenges}/11`, icon: "🚩" },
            { label: "Streak", value: `${myEntry.streak}j 🔥`, icon: "📅" },
            { label: "Niveau", value: getLevelName(myEntry.level, myEntry.xp), icon: getLevelInfo(myEntry.xp).icon },
          ].map((stat, i) => (
            <div key={i} style={{ textAlign: "center", minWidth: "100px" }}>
              <p style={{ color: colors.textSecondary, fontSize: "0.75rem", margin: "0 0 4px 0" }}>{stat.label}</p>
              <p style={{ color: colors.textPrimary, fontWeight: "bold", margin: 0 }}>{stat.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Top 3 Podium */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "15px", marginBottom: "30px" }}>
        {leaderboard.slice(0, 3).map((player, idx) => {
          const style = getRankStyle(player.rank);
          return (
            <div key={player.username} style={{
              background: `linear-gradient(135deg, ${style.bg}22, ${style.bg}11)`,
              border: `2px solid ${style.bg}`,
              borderRadius: "12px",
              padding: "25px",
              textAlign: "center",
              position: "relative",
              order: idx === 0 ? 1 : idx === 1 ? 0 : 2
            }}>
              <div style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                fontSize: "2rem"
              }}>{style.icon}</div>
              <div style={{ fontSize: "3rem", marginBottom: "10px" }}>{getAvatar(player.avatar)}</div>
              <p style={{ color: colors.accent, fontWeight: "bold", fontSize: "1.2rem", margin: "8px 0" }}>
                {player.username}
              </p>
              <p style={{ color: style.bg, fontWeight: "bold", fontSize: "1.8rem", margin: "8px 0" }}>
                {player.xp} XP
              </p>
              <div style={{ display: "flex", justifyContent: "center", gap: "15px", marginTop: "12px" }}>
                <span style={{ color: colors.textSecondary, fontSize: "0.85rem" }}>🚩 {player.solvedChallenges}</span>
                <span style={{ color: colors.textSecondary, fontSize: "0.85rem" }}>🔥 {player.streak}j</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Liste complète */}
      <div style={{
        background: colors.bgSecondary,
        borderRadius: "12px",
        overflow: "hidden",
        border: `1px solid ${colors.border}`
      }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "80px 1fr 120px 100px 100px",
          gap: "15px",
          padding: "15px 20px",
          background: colors.bgPrimary,
          borderBottom: `1px solid ${colors.border}`,
          fontWeight: "bold",
          fontSize: "0.85rem",
          color: colors.textSecondary
        }}>
          <div>RANG</div>
          <div>JOUEUR</div>
          <div style={{ textAlign: "center" }}>XP</div>
          <div style={{ textAlign: "center" }}>CTF</div>
          <div style={{ textAlign: "center" }}>STREAK</div>
        </div>

        {leaderboard.map((player) => {
          const style = getRankStyle(player.rank);
          return (
            <div
              key={player.username}
              style={{
                display: "grid",
                gridTemplateColumns: "80px 1fr 120px 100px 100px",
                gap: "15px",
                padding: "18px 20px",
                borderBottom: `1px solid ${colors.border}`,
                background: player.isMe ? colors.accentDark : "transparent",
                alignItems: "center",
                transition: "background 0.2s"
              }}
            >
              <div style={{
                background: style.bg,
                color: style.color,
                fontWeight: "bold",
                padding: "8px",
                borderRadius: "8px",
                textAlign: "center",
                fontSize: "0.95rem"
              }}>
                {style.icon}
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ fontSize: "1.8rem" }}>{getAvatar(player.avatar)}</div>
                <div>
                  <p style={{ color: player.isMe ? colors.accent : colors.textPrimary, fontWeight: "bold", margin: 0 }}>
                    {player.username} {player.isMe && <span style={{ color: colors.accent }}>👈 Vous</span>}
                  </p>
                  <p style={{ color: getLevelColor(player.xp), fontSize: "0.8rem", margin: "2px 0 0 0" }}>
                    {getLevelInfo(player.xp).icon} {getLevelName(player.level, player.xp)}
                  </p>
                </div>
              </div>

              <div style={{ textAlign: "center", color: colors.accent, fontWeight: "bold", fontSize: "1.1rem" }}>
                {player.xp} XP
              </div>

              <div style={{ textAlign: "center", color: colors.textSecondary }}>
                🚩 {player.solvedChallenges}/11
              </div>

              <div style={{ textAlign: "center", color: player.streak > 7 ? "#f59e0b" : colors.textSecondary }}>
                🔥 {player.streak}j
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer stats */}
      <div style={{
        marginTop: "30px",
        padding: "20px",
        background: colors.bgSecondary,
        borderRadius: "12px",
        border: `1px solid ${colors.border}`,
        textAlign: "center"
      }}>
        <p style={{ color: colors.textSecondary, fontSize: "0.9rem" }}>
          🎯 Total : <strong style={{ color: colors.accent }}>{leaderboard.length} hackers</strong> dans le classement
        </p>
      </div>

    </main>
  );
}

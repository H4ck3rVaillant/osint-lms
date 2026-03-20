import { useState, useEffect } from "react";
import { useGame, getLevelInfo } from "../context/GameContext";
import { useAuth } from "../auth/AuthContext";

const AVATARS_LB: Record<string, string> = {
  hacker: "🧑‍💻", ninja: "🥷", ghost: "👻", robot: "🤖", alien: "👽",
  skull: "💀", detective: "🕵️", wizard: "🧙", demon: "😈", cat: "🐱",
  fox: "🦊", wolf: "🐺", dragon: "🐉", parrot: "🦜", cyber: "⚡",
};

function getUserAvatarLB(username: string): string {
  const saved = localStorage.getItem(`avatar_${username}`);
  return saved && AVATARS_LB[saved] ? AVATARS_LB[saved] : "🧑‍💻";
}

interface Player {
  id: number;
  username: string;
  xp: number;
  level: number;
  streak: number;
  longest_streak: number;
  solved_count: number;
  last_activity: string;
}

export default function Leaderboard() {
  const { gameState } = useGame();
  const { user, token } = useAuth();
  const API_URL = "https://osint-lms-backend.onrender.com";
  
  const [filter, setFilter] = useState<"all" | "week" | "month">("all");
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Charger le leaderboard depuis l'API
  useEffect(() => {
    loadLeaderboard();
  }, [filter]);

  // Actualiser toutes les 30 secondes
  useEffect(() => {
    const timer = setInterval(() => {
      setLastUpdate(new Date());
      loadLeaderboard();
    }, 30000);
    return () => clearInterval(timer);
  }, [filter]);

  const loadLeaderboard = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/game/leaderboard?filter=${filter}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setPlayers(data.players);
      }
    } catch (error) {
      console.error("Erreur chargement leaderboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const myRank = players.findIndex(p => p.username === user?.username) + 1;

  const getRankStyle = (rank: number) => {
    if (rank === 1) return { bg: "#fbbf24", color: "#0b0f1a", icon: "🥇" };
    if (rank === 2) return { bg: "#9ca3af", color: "#0b0f1a", icon: "🥈" };
    if (rank === 3) return { bg: "#d97706", color: "#0b0f1a", icon: "🥉" };
    return { bg: "#1a1f2e", color: "#e5e7eb", icon: `#${rank}` };
  };

  const getLevelColor = (levelName: string) => {
    const map: Record<string, string> = {
      "Newbie": "#9ca3af",
      "Script Kiddie": "#22c55e",
      "Hacker": "#3b82f6",
      "Elite Hacker": "#8b5cf6",
      "Cyber Ninja": "#f59e0b",
      "Zero Day Master": "#ef4444",
    };
    return map[levelName] || "#9ca3af";
  };

  return (
    <main style={{ padding: "40px", maxWidth: "1100px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: "35px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "15px" }}>
        <div>
          <h1 style={{ color: "#00ff9c", fontSize: "2.5rem", margin: 0 }}>
            🏆 Leaderboard
          </h1>
          <p style={{ color: "#9ca3af", marginTop: "8px" }}>
            Classement global des hackers — Mis à jour en temps réel
          </p>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{
            background: "#0b0f1a",
            border: "1px solid #00ff9c",
            borderRadius: "10px",
            padding: "12px 20px",
            display: "inline-block"
          }}>
            <p style={{ color: "#9ca3af", fontSize: "0.8rem", margin: "0 0 4px 0" }}>Votre rang</p>
            <p style={{ color: "#00ff9c", fontSize: "2rem", fontWeight: "bold", margin: 0 }}>
              #{myRank || "N/A"}
            </p>
          </div>
        </div>
      </div>

      {/* Filtres */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "25px" }}>
        {[
          { key: "all", label: "🌍 Tous les temps" },
          { key: "month", label: "📅 Ce mois" },
          { key: "week", label: "📆 Cette semaine" }
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key as "all" | "week" | "month")}
            style={{
              flex: 1,
              padding: "12px",
              background: filter === f.key ? "#00ff9c" : "transparent",
              color: filter === f.key ? "#0b0f1a" : "#9ca3af",
              border: `2px solid ${filter === f.key ? "#00ff9c" : "#2a3f3f"}`,
              borderRadius: "8px",
              fontWeight: "bold",
              cursor: "pointer",
              transition: "all 0.2s"
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Ma position rapide */}
      {myRank > 0 && (
        <div style={{
          background: "linear-gradient(135deg, #0b1a2e, #0b0f1a)",
          border: "2px solid #00ff9c",
          borderRadius: "12px",
          padding: "20px",
          marginBottom: "25px",
          display: "flex",
          alignItems: "center",
          gap: "20px"
        }}>
          <div style={{
            fontSize: "3rem",
            width: "70px",
            height: "70px",
            background: "#00ff9c",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            {getUserAvatarLB(user?.username || "")}
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{ color: "#00ff9c", margin: "0 0 5px 0", fontSize: "1.3rem" }}>
              {user?.username}
            </h3>
            <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
              <span style={{ color: "#9ca3af" }}>
                💎 <strong style={{ color: "#e5e7eb" }}>{gameState.xp} XP</strong>
              </span>
              <span style={{ color: "#9ca3af" }}>
                🏅 <strong style={{ color: "#e5e7eb" }}>{getLevelInfo(gameState.xp).name}</strong>
              </span>
              <span style={{ color: "#9ca3af" }}>
                🔥 <strong style={{ color: "#e5e7eb" }}>{gameState.streak} jours</strong>
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div style={{ textAlign: "center", padding: "40px", color: "#9ca3af" }}>
          <div style={{
            width: "40px",
            height: "40px",
            border: "3px solid #2a3f3f",
            borderTop: "3px solid #00ff9c",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            margin: "0 auto 15px"
          }} />
          Chargement du classement...
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {/* Table */}
      {!loading && (
        <div style={{
          background: "#0b0f1a",
          borderRadius: "12px",
          overflow: "hidden",
          border: "1px solid #2a3f3f"
        }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#1a1f2e" }}>
                <th style={{ padding: "15px", textAlign: "left", color: "#9ca3af", fontWeight: "600" }}>Rang</th>
                <th style={{ padding: "15px", textAlign: "left", color: "#9ca3af", fontWeight: "600" }}>Joueur</th>
                <th style={{ padding: "15px", textAlign: "center", color: "#9ca3af", fontWeight: "600" }}>XP</th>
                <th style={{ padding: "15px", textAlign: "center", color: "#9ca3af", fontWeight: "600" }}>Level</th>
                <th style={{ padding: "15px", textAlign: "center", color: "#9ca3af", fontWeight: "600" }}>Résolu</th>
                <th style={{ padding: "15px", textAlign: "center", color: "#9ca3af", fontWeight: "600" }}>Streak</th>
              </tr>
            </thead>
            <tbody>
              {players.map((player, index) => {
                const rank = index + 1;
                const style = getRankStyle(rank);
                const isMe = player.username === user?.username;
                const levelName = getLevelInfo(player.xp).name;

                return (
                  <tr key={player.id} style={{
                    background: isMe ? "#0a1a0a" : "transparent",
                    borderBottom: "1px solid #1a1f2e",
                    borderLeft: isMe ? "3px solid #00ff9c" : "none"
                  }}>
                    <td style={{ padding: "15px" }}>
                      <div style={{
                        display: "inline-block",
                        background: style.bg,
                        color: style.color,
                        padding: "6px 12px",
                        borderRadius: "20px",
                        fontWeight: "bold",
                        fontSize: "0.9rem"
                      }}>
                        {style.icon}
                      </div>
                    </td>
                    <td style={{ padding: "15px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <div style={{ fontSize: "2rem" }}>
                          {getUserAvatarLB(player.username)}
                        </div>
                        <div>
                          <div style={{ color: "#e5e7eb", fontWeight: "600" }}>
                            {player.username}
                            {isMe && <span style={{ color: "#00ff9c", marginLeft: "8px" }}>(Vous)</span>}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "15px", textAlign: "center", color: "#00ff9c", fontWeight: "bold" }}>
                      {player.xp.toLocaleString()}
                    </td>
                    <td style={{ padding: "15px", textAlign: "center" }}>
                      <span style={{
                        background: getLevelColor(levelName) + "33",
                        color: getLevelColor(levelName),
                        padding: "4px 12px",
                        borderRadius: "12px",
                        fontSize: "0.85rem",
                        fontWeight: "600"
                      }}>
                        {levelName}
                      </span>
                    </td>
                    <td style={{ padding: "15px", textAlign: "center", color: "#e5e7eb" }}>
                      {player.solved_count || 0}
                    </td>
                    <td style={{ padding: "15px", textAlign: "center", color: "#e5e7eb" }}>
                      🔥 {player.streak || 0}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {players.length === 0 && (
            <div style={{ textAlign: "center", padding: "40px", color: "#6b7280" }}>
              Aucun joueur trouvé pour cette période
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <div style={{ textAlign: "center", marginTop: "25px", color: "#6b7280", fontSize: "0.85rem" }}>
        Dernière mise à jour : {lastUpdate.toLocaleTimeString('fr-FR')}
      </div>
    </main>
  );
}

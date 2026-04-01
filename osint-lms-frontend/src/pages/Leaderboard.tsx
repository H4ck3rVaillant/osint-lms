import { useState, useEffect } from "react";
import { useThemeColors } from "../context/ThemeContext";
import { useGame, LEADERBOARD_PLAYERS, getLevelInfo } from "../context/GameContext";
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

export default function Leaderboard() {
  const colors = useThemeColors();
  const { gameState } = useGame();
  const { user } = useAuth();
  const [filter, setFilter] = useState<"all" | "week" | "month">("all");
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [leaderboardData, setLeaderboardData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 20;

  // Charger les données depuis l'API
  useEffect(() => {
    const loadLeaderboard = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("https://osint-lms-backend.onrender.com/game/leaderboard", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.leaderboard) {
            setLeaderboardData(data.leaderboard);
          }
        }
      } catch (error) {
        console.error("Erreur chargement leaderboard:", error);
      } finally {
        setLoading(false);
      }
    };

    loadLeaderboard();
    
    // Recharger toutes les 30 secondes
    const timer = setInterval(() => {
      setLastUpdate(new Date());
      loadLeaderboard();
    }, 30000);
    
    return () => clearInterval(timer);
  }, []);

  // Insérer le joueur courant dans le leaderboard
  const myEntry = {
    rank: 0,
    username: user?.username || "Vous",
    xp: gameState.xp,
    solved: gameState.solvedChallenges.length,
    streak: gameState.streak,
    level: gameState.levelName,
    country: "🇫🇷",
    isMe: true
  };

  const allPlayers = [
    ...leaderboardData.map(p => ({
      rank: 0,
      username: p.username,
      xp: p.xp,
      solved: Math.min(11, Math.floor(p.xp / 100)), // 1 défi ≈ 100 XP
      streak: p.streak,
      level: getLevelInfo(p.xp).name,
      country: "🇫🇷",
      isMe: false
    })),
    myEntry
  ]
    .sort((a, b) => b.xp - a.xp)
    .map((p, i) => ({ ...p, rank: i + 1 }));

  const myRank = allPlayers.findIndex(p => p.isMe) + 1;

  // Filtrer par recherche
  const filteredPlayers = allPlayers.filter(p => 
    p.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredPlayers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedPlayers = filteredPlayers.slice(startIndex, endIndex);

  const getRankStyle = (rank: number) => {
    if (rank === 1) return { bg: "#fbbf24", color: colors.bgPrimary, icon: "🥇" };
    if (rank === 2) return { bg: colors.textSecondary, color: colors.bgPrimary, icon: "🥈" };
    if (rank === 3) return { bg: "#d97706", color: colors.bgPrimary, icon: "🥉" };
    return { bg: colors.bgSecondary, color: colors.textPrimary, icon: `#${rank}` };
  };

  const getLevelColor = (levelName: string) => {
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

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <main style={{ paddingTop: "80px", padding: "40px", maxWidth: "1100px", margin: "0 auto", minHeight: "100vh", background: colors.bgPrimary }}>

      {loading ? (
        <div style={{ textAlign: "center", padding: "100px 20px", color: colors.accent }}>
          <div style={{ fontSize: "3rem", marginBottom: "20px" }}>⏳</div>
          <p style={{ fontSize: "1.2rem" }}>Chargement du leaderboard...</p>
        </div>
      ) : (
        <>
      {/* Header */}
      <div style={{ marginBottom: "35px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "15px" }}>
        <div>
          <h1 style={{ color: colors.accent, fontSize: "2.5rem", margin: 0 }}>
            🏆 Leaderboard
          </h1>
          <p style={{ color: colors.textSecondary, marginTop: "8px" }}>
            Classement global des hackers — Mis à jour en temps réel
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
        <div style={{ fontSize: "2.5rem" }}>{user ? getUserAvatarLB(user.username) : "🧑‍💻"}</div>
        <div style={{ flex: 1 }}>
          <p style={{ color: colors.textSecondary, fontSize: "0.8rem", margin: "0 0 4px 0" }}>VOTRE PROFIL</p>
          <p style={{ color: colors.accent, fontWeight: "bold", fontSize: "1.2rem", margin: 0 }}>
            {user?.username || "Joueur"}
          </p>
        </div>
        {[
          { label: "XP Total", value: `${gameState.xp} XP`, icon: "⭐" },
          { label: "Défis résolus", value: `${gameState.solvedChallenges.length}/11`, icon: "🚩" },
          { label: "Streak", value: `${gameState.streak}j 🔥`, icon: "📅" },
          { label: "Niveau", value: gameState.levelName, icon: getLevelInfo(gameState.xp).icon },
        ].map((stat, i) => (
          <div key={i} style={{ textAlign: "center", minWidth: "100px" }}>
            <p style={{ color: colors.textSecondary, fontSize: "0.75rem", margin: "0 0 4px 0" }}>{stat.label}</p>
            <p style={{ color: colors.textPrimary, fontWeight: "bold", margin: 0 }}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Champ de recherche */}
      <div style={{ marginBottom: "25px" }}>
        <input
          type="text"
          placeholder="🔍 Rechercher un utilisateur..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1); // Reset à la page 1
          }}
          style={{
            width: "100%",
            padding: "15px 20px",
            background: colors.bgSecondary,
            border: `1px solid ${colors.accent}`,
            borderRadius: "10px",
            color: colors.textPrimary,
            fontSize: "1rem",
            outline: "none"
          }}
        />
        {searchQuery && (
          <p style={{ color: colors.textSecondary, fontSize: "0.9rem", marginTop: "8px" }}>
            {filteredPlayers.length} résultat{filteredPlayers.length > 1 ? 's' : ''} trouvé{filteredPlayers.length > 1 ? 's' : ''}
          </p>
        )}
      </div>

      {/* Filtres */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "25px" }}>
        {([
          { key: "all",   label: "Tous les temps" },
          { key: "week",  label: "Cette semaine" },
          { key: "month", label: "Ce mois" },
        ] as const).map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            style={{
              background: filter === f.key ? colors.accent : colors.bgPrimary,
              color: filter === f.key ? colors.bgPrimary : colors.textPrimary,
              border: `1px solid ${filter === f.key ? colors.accent : colors.border}`,
              padding: "8px 18px",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold",
              transition: "all 0.2s"
            }}
          >{f.label}</button>
        ))}
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#22c55e", animation: "pulse 2s infinite" }} />
          <span style={{ color: colors.textSecondary, fontSize: "0.8rem" }}>
            Live · {lastUpdate.toLocaleTimeString()}
          </span>
        </div>
      </div>

      {/* Podium Top 3 */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        gap: "15px",
        marginBottom: "30px"
      }}>
        {[allPlayers[1], allPlayers[0], allPlayers[2]].map((player, idx) => {
          if (!player) return null;
          const heights = ["120px", "150px", "100px"];
          const medals = ["🥈", "🥇", "🥉"];
          const podiumRanks = [2, 1, 3];
          return (
            <div
              key={player.username}
              style={{
                background: player.isMe ? "linear-gradient(135deg, #0b1a2e, #0b0f1a)" : colors.bgPrimary,
                border: `2px solid ${idx === 1 ? "#fbbf24" : player.isMe ? colors.accent : colors.border}`,
                borderRadius: "12px",
                padding: "20px",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                alignItems: "center",
                minHeight: heights[idx],
                transition: "all 0.3s"
              }}
            >
              <div style={{ fontSize: "2.5rem", marginBottom: "8px" }}>{medals[idx]}</div>
              <p style={{ color: colors.textSecondary, fontSize: "0.75rem", margin: "0 0 4px 0" }}>
                {player.country} #{podiumRanks[idx]}
              </p>
              <p style={{
                color: player.isMe ? colors.accent : colors.textPrimary,
                fontWeight: "bold",
                fontSize: "1rem",
                margin: "0 0 6px 0"
              }}>
                {player.isMe ? "⚡ " : ""}{player.username}
              </p>
              <p style={{ color: "#fbbf24", fontWeight: "bold", fontSize: "1.1rem", margin: "0 0 4px 0" }}>
                {player.xp} XP
              </p>
              <p style={{ color: getLevelColor(player.level), fontSize: "0.8rem", margin: 0 }}>
                {player.level}
              </p>
            </div>
          );
        })}
      </div>

      {/* Tableau complet */}
      <div style={{
        background: colors.bgPrimary,
        border: "1px solid #2a3f3f",
        borderRadius: "12px",
        overflow: "hidden"
      }}>
        {/* En-tête tableau */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "60px 1fr 120px 100px 80px 150px",
          padding: "14px 20px",
          background: colors.bgSecondary,
          borderBottom: "1px solid #2a3f3f"
        }}>
          {["Rang", "Joueur", "XP", "Défis", "Streak", "Niveau"].map((h, i) => (
            <span key={i} style={{ color: colors.textSecondary, fontSize: "0.8rem", fontWeight: "bold", textTransform: "uppercase" }}>
              {h}
            </span>
          ))}
        </div>

        {/* Lignes */}
        {paginatedPlayers.map((player, idx) => {
          const rankInfo = getRankStyle(player.rank);
          return (
            <div
              key={`${player.username}-${idx}`}
              style={{
                display: "grid",
                gridTemplateColumns: "60px 1fr 120px 100px 80px 150px",
                padding: "16px 20px",
                borderBottom: "1px solid #1a1f2e",
                background: player.isMe
                  ? "linear-gradient(90deg, rgba(0,255,156,0.08), transparent)"
                  : idx % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)",
                alignItems: "center",
                transition: "background 0.2s"
              }}
              onMouseEnter={(e) => {
                if (!player.isMe) e.currentTarget.style.background = colors.bgSecondary;
              }}
              onMouseLeave={(e) => {
                if (!player.isMe) e.currentTarget.style.background = idx % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)";
              }}
            >
              {/* Rang */}
              <div style={{ display: "flex", alignItems: "center" }}>
                <span style={{
                  background: rankInfo.bg,
                  color: rankInfo.color,
                  borderRadius: "6px",
                  padding: "4px 8px",
                  fontSize: "0.85rem",
                  fontWeight: "bold",
                  minWidth: "36px",
                  textAlign: "center"
                }}>
                  {player.rank <= 3 ? rankInfo.icon : `#${player.rank}`}
                </span>
              </div>

              {/* Joueur */}
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "1.1rem" }}>{player.country}</span>
                <span style={{
                  color: player.isMe ? colors.accent : colors.textPrimary,
                  fontWeight: player.isMe ? "bold" : "normal"
                }}>
                  {player.isMe ? "⚡ " : ""}{player.username}
                  {player.isMe && (
                    <span style={{
                      marginLeft: "8px",
                      background: colors.accent,
                      color: colors.bgPrimary,
                      fontSize: "0.7rem",
                      padding: "2px 6px",
                      borderRadius: "4px",
                      fontWeight: "bold"
                    }}>VOUS</span>
                  )}
                </span>
              </div>

              {/* XP */}
              <span style={{ color: "#fbbf24", fontWeight: "bold" }}>
                ⭐ {player.xp.toLocaleString()}
              </span>

              {/* Défis */}
              <span style={{ color: colors.textSecondary }}>
                🚩 {player.solved}/11
              </span>

              {/* Streak */}
              <span style={{ color: "#ef4444" }}>
                🔥 {player.streak}j
              </span>

              {/* Niveau */}
              <span style={{
                color: getLevelColor(player.level),
                fontWeight: "bold",
                fontSize: "0.85rem"
              }}>
                {getLevelInfo(player.xp).icon} {player.level}
              </span>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{
          marginTop: "30px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "10px",
          flexWrap: "wrap"
        }}>
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            style={{
              padding: "10px 20px",
              background: currentPage === 1 ? colors.bgSecondary : colors.accent,
              color: currentPage === 1 ? colors.textSecondary : colors.bgPrimary,
              border: "none",
              borderRadius: "8px",
              cursor: currentPage === 1 ? "not-allowed" : "pointer",
              fontWeight: "bold",
              opacity: currentPage === 1 ? 0.5 : 1
            }}
          >
            ← Précédent
          </button>

          <span style={{ color: colors.textPrimary, fontWeight: "bold" }}>
            Page {currentPage} / {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            style={{
              padding: "10px 20px",
              background: currentPage === totalPages ? colors.bgSecondary : colors.accent,
              color: currentPage === totalPages ? colors.textSecondary : colors.bgPrimary,
              border: "none",
              borderRadius: "8px",
              cursor: currentPage === totalPages ? "not-allowed" : "pointer",
              fontWeight: "bold",
              opacity: currentPage === totalPages ? 0.5 : 1
            }}
          >
            Suivant →
          </button>
        </div>
      )}

      {/* Footer info */}
      <div style={{
        marginTop: "20px",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "12px"
      }}>
        {[
          { label: "Joueurs actifs", value: `${allPlayers.length}` },
          { label: "Défis résolus (total)", value: `${allPlayers.reduce((s, p) => s + p.solved, 0)}` },
          { label: "XP distribués", value: `${allPlayers.reduce((s, p) => s + p.xp, 0).toLocaleString()}` },
        ].map((info, i) => (
          <div key={i} style={{
            background: colors.bgPrimary,
            border: "1px solid #2a3f3f",
            borderRadius: "8px",
            padding: "12px 18px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}>
            <span style={{ color: colors.textSecondary, fontSize: "0.85rem" }}>{info.label}</span>
            <span style={{ color: colors.accent, fontWeight: "bold" }}>{info.value}</span>
          </div>
        ))}
      </div>
      </>
      )}
    </main>
  );
}

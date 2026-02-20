import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useThemeColors } from "../context/ThemeContext";

interface LocalUser {
  username: string;
  email: string;
  createdAt: string;
  lastLogin?: string;
  xp: number;
  level: number;
}

// Décoder le JWT payload (base64)
function decodeToken(token: string) {
  try {
    const payload = token.split('.')[1];
    const decoded = atob(payload);
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

export default function AdminPanel() {
  const colors = useThemeColors();
  const navigate = useNavigate();
  
  // Récupérer le username depuis le token JWT
  const token = localStorage.getItem("token");
  const currentUser = token ? decodeToken(token) : null;

  const [users, setUsers] = useState<LocalUser[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Protection: rediriger si pas Cyber_Admin
  useEffect(() => {
    if (currentUser?.username !== "Cyber_Admin") {
      navigate("/dashboard");
    }
  }, [currentUser, navigate]);

  // Charger les users depuis localStorage
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    const storedUsers = localStorage.getItem("registered_users");
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    }
  };

  const handleDeleteUser = (username: string) => {
    if (!confirm(`⚠️ Supprimer définitivement "${username}" ?`)) {
      return;
    }

    if (username === "Cyber_Admin") {
      alert("❌ Impossible de supprimer le compte admin !");
      return;
    }

    const updatedUsers = users.filter(u => u.username !== username);
    localStorage.setItem("registered_users", JSON.stringify(updatedUsers));
    setUsers(updatedUsers);
    alert("✅ Utilisateur supprimé");
  };

  const handleResetPassword = (username: string) => {
    const tempPassword = `Temp${Math.random().toString(36).slice(2, 10)}!`;
    alert(`🔑 Nouveau mot de passe pour ${username}:\n\n${tempPassword}\n\nCommuniquez-le à l'utilisateur.`);
  };

  const filteredUsers = users.filter(u => 
    u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Stats
  const stats = {
    total: users.length,
    newThisWeek: users.filter(u => {
      if (!u.createdAt) return false;
      const created = new Date(u.createdAt);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return created >= weekAgo;
    }).length,
    activeToday: users.filter(u => {
      if (!u.lastLogin) return false;
      const lastLogin = new Date(u.lastLogin);
      const dayAgo = new Date();
      dayAgo.setDate(dayAgo.getDate() - 1);
      return lastLogin >= dayAgo;
    }).length,
  };

  if (currentUser?.username !== "Cyber_Admin") {
    return null;
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: colors.bgPrimary,
      paddingTop: "80px",
    }}>
      <div style={{
        maxWidth: "1400px",
        margin: "0 auto",
        padding: "40px 20px",
      }}>
        {/* Header */}
        <h1 style={{
          fontSize: "2.5rem",
          fontWeight: "700",
          color: colors.textPrimary,
          marginBottom: "10px",
        }}>
          🛡️ Panel Administrateur
        </h1>
        <p style={{
          fontSize: "1.1rem",
          color: colors.textSecondary,
          marginBottom: "10px",
        }}>
          Gestion des utilisateurs (localStorage)
        </p>
        <p style={{
          fontSize: "0.9rem",
          color: colors.accent,
          marginBottom: "40px",
        }}>
          👤 Connecté en tant que : <strong>{currentUser?.username}</strong>
        </p>

        {/* Stats Cards */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "20px",
          marginBottom: "50px",
        }}>
          {[
            { label: "Total Utilisateurs", value: stats.total, icon: "👥", color: "#3b82f6" },
            { label: "Nouveaux (7j)", value: stats.newThisWeek, icon: "✨", color: "#10b981" },
            { label: "Actifs récents", value: stats.activeToday, icon: "🟢", color: "#8b5cf6" },
          ].map((stat) => (
            <div key={stat.label} style={{
              background: colors.bgSecondary,
              border: `2px solid ${stat.color}`,
              borderRadius: "12px",
              padding: "25px",
            }}>
              <div style={{ fontSize: "2.5rem", marginBottom: "10px" }}>{stat.icon}</div>
              <p style={{
                fontSize: "2rem",
                fontWeight: "700",
                color: stat.color,
                marginBottom: "5px",
              }}>
                {stat.value}
              </p>
              <p style={{ color: colors.textSecondary, fontSize: "0.95rem", margin: 0 }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Search Bar */}
        <div style={{ marginBottom: "25px" }}>
          <input
            type="text"
            placeholder="🔍 Rechercher un utilisateur..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: "100%",
              padding: "15px 20px",
              background: colors.bgSecondary,
              border: `2px solid ${colors.border}`,
              borderRadius: "10px",
              color: colors.textPrimary,
              fontSize: "1rem",
            }}
          />
        </div>

        {/* Users Table */}
        <div style={{
          background: colors.bgSecondary,
          border: `1px solid ${colors.border}`,
          borderRadius: "12px",
          overflow: "hidden",
        }}>
          <div style={{
            padding: "20px",
            borderBottom: `1px solid ${colors.border}`,
          }}>
            <h2 style={{
              fontSize: "1.5rem",
              fontWeight: "600",
              color: colors.textPrimary,
              margin: 0,
            }}>
              📋 Utilisateurs Enregistrés ({filteredUsers.length})
            </h2>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{
              width: "100%",
              borderCollapse: "collapse",
            }}>
              <thead>
                <tr style={{ background: colors.bgPrimary }}>
                  {["Username", "Email", "Inscrit le", "XP", "Niveau", "Actions"].map((header) => (
                    <th key={header} style={{
                      padding: "15px",
                      textAlign: "left",
                      color: colors.textSecondary,
                      fontSize: "0.9rem",
                      fontWeight: "600",
                    }}>
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{
                      padding: "40px",
                      textAlign: "center",
                      color: colors.textSecondary,
                    }}>
                      Aucun utilisateur trouvé
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => (
                    <tr key={u.username} style={{
                      borderBottom: `1px solid ${colors.border}`,
                    }}>
                      <td style={{ padding: "15px", color: colors.textPrimary, fontWeight: "600" }}>
                        {u.username}
                        {u.username === "Cyber_Admin" && " 👑"}
                      </td>
                      <td style={{ padding: "15px", color: colors.textSecondary }}>
                        {u.email || "N/A"}
                      </td>
                      <td style={{ padding: "15px", color: colors.textSecondary, fontSize: "0.9rem" }}>
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString('fr-FR') : "N/A"}
                      </td>
                      <td style={{ padding: "15px", color: colors.accent, fontWeight: "600" }}>
                        {u.xp || 0}
                      </td>
                      <td style={{ padding: "15px", color: colors.accent, fontWeight: "600" }}>
                        {u.level || 1}
                      </td>
                      <td style={{ padding: "15px" }}>
                        <div style={{ display: "flex", gap: "10px" }}>
                          {u.username !== "Cyber_Admin" && (
                            <>
                              <button
                                onClick={() => handleResetPassword(u.username)}
                                style={{
                                  padding: "6px 12px",
                                  background: "#3b82f6",
                                  color: "#fff",
                                  border: "none",
                                  borderRadius: "6px",
                                  cursor: "pointer",
                                  fontSize: "0.85rem",
                                }}
                              >
                                Reset MDP
                              </button>
                              <button
                                onClick={() => handleDeleteUser(u.username)}
                                style={{
                                  padding: "6px 12px",
                                  background: "#ef4444",
                                  color: "#fff",
                                  border: "none",
                                  borderRadius: "6px",
                                  cursor: "pointer",
                                  fontSize: "0.85rem",
                                }}
                              >
                                Supprimer
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Info */}
        <div style={{
          marginTop: "30px",
          padding: "20px",
          background: `${colors.accent}10`,
          border: `1px solid ${colors.accent}30`,
          borderRadius: "12px",
        }}>
          <p style={{ color: colors.textSecondary, margin: 0, fontSize: "0.95rem" }}>
            ℹ️ <strong>Note :</strong> Cette version utilise localStorage pour la gestion des utilisateurs. 
            Les utilisateurs enregistrés dans Neon ne sont pas visibles ici. Pour une gestion complète avec base de données, 
            il faudra créer des API routes Vercel.
          </p>
        </div>
      </div>
    </div>
  );
}

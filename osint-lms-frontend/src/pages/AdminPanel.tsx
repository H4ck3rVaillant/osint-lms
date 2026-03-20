import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useThemeColors } from "../context/ThemeContext";

interface User {
  id: number;
  username: string;
  role: string;
  created_at: string;
  last_login: string;
  blocked: boolean;
}

interface Stats {
  total: number;
  newThisWeek: number;
  activeToday: number;
}

// Décoder le JWT payload
function decodeToken(token: string) {
  try {
    const payload = token.split('.')[1];
    const decoded = atob(payload);
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

// Calculer si un utilisateur est actif (connecté dans les 30 derniers jours)
function isUserActive(lastLogin: string): boolean {
  if (!lastLogin) return false;
  const loginDate = new Date(lastLogin);
  const now = new Date();
  const diffMs = now.getTime() - loginDate.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  return diffDays <= 30;
}

export default function AdminPanel() {
  const colors = useThemeColors();
  const navigate = useNavigate();
  const API_URL = "https://osint-lms-backend.onrender.com";
  
  const token = localStorage.getItem("token");
  const currentUser = token ? decodeToken(token) : null;
  
  const [stats, setStats] = useState<Stats>({ total: 0, newThisWeek: 0, activeToday: 0 });
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Protection
  useEffect(() => {
    if (currentUser?.username !== "Cyber_Admin") {
      navigate("/dashboard");
    }
  }, [currentUser, navigate]);

  // Charger les données
  useEffect(() => {
    if (currentUser?.username === "Cyber_Admin") {
      fetchStats();
      fetchUsers();
    }
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/stats`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setStats({
            total: data.total,
            newThisWeek: data.newThisWeek,
            activeToday: data.activeToday
          });
        }
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/admin/users`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setUsers(data.users);
        }
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: number, username: string) => {
    if (!confirm(`⚠️ Supprimer définitivement "${username}" ?`)) {
      return;
    }
    try {
      const res = await fetch(`${API_URL}/admin/delete-user`, {
        method: 'DELETE',
        headers: { 
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ userId }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        alert('✅ Utilisateur supprimé');
        fetchUsers();
        fetchStats();
      } else {
        alert(`❌ ${data.error || 'Erreur'}`);
      }
    } catch (error) {
      alert('❌ Erreur lors de la suppression');
      console.error(error);
    }
  };

  const handleBlockUser = async (userId: number, username: string, currentBlocked: boolean) => {
    if (!confirm(`${currentBlocked ? 'Débloquer' : 'Bloquer'} "${username}" ?`)) {
      return;
    }
    try {
      const res = await fetch(`${API_URL}/admin/block-user`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ userId, blocked: !currentBlocked }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        alert(`✅ Utilisateur ${currentBlocked ? 'débloqué' : 'bloqué'}`);
        fetchUsers();
      } else {
        alert('❌ Erreur');
      }
    } catch (error) {
      alert('❌ Erreur lors du blocage');
      console.error(error);
    }
  };

  const handleResetPassword = async (userId: number, username: string) => {
    if (!confirm(`Réinitialiser le mot de passe de "${username}" ?`)) {
      return;
    }
    try {
      const res = await fetch(`${API_URL}/admin/reset-password`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ userId }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        alert(`✅ Mot de passe réinitialisé !\n\nNouveau MDP temporaire :\n${data.tempPassword}\n\nCommuniquez-le à l'utilisateur.`);
      } else {
        alert('❌ Erreur');
      }
    } catch (error) {
      alert('❌ Erreur lors de la réinitialisation');
      console.error(error);
    }
  };

  const filteredUsers = users.filter(u => 
    u.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          Gestion des utilisateurs (Base Neon PostgreSQL)
        </p>
        <p style={{
          fontSize: "0.9rem",
          color: colors.accent,
          marginBottom: "40px",
        }}>
          👤 Connecté : <strong>{currentUser?.username}</strong>
        </p>

        {/* Stats */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "20px",
          marginBottom: "50px",
        }}>
          {[
            { label: "Total Utilisateurs", value: stats.total, icon: "👥", color: "#3b82f6" },
            { label: "Nouveaux (7j)", value: stats.newThisWeek, icon: "✨", color: "#10b981" },
            { label: "Actifs (24h)", value: stats.activeToday, icon: "🟢", color: "#8b5cf6" },
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

        {/* Search */}
        <div style={{ marginBottom: "25px" }}>
          <input
            type="text"
            placeholder="🔍 Rechercher..."
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

        {/* Table */}
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
              📋 Utilisateurs ({filteredUsers.length})
            </h2>
          </div>

          {loading ? (
            <div style={{ padding: "40px", textAlign: "center", color: colors.textSecondary }}>
              Chargement...
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: colors.bgPrimary }}>
                    {["ID", "Username", "Rôle", "Inscrit le", "Dernière connexion", "Statut", "Actions"].map((h) => (
                      <th key={h} style={{
                        padding: "15px",
                        textAlign: "left",
                        color: colors.textSecondary,
                        fontSize: "0.9rem",
                        fontWeight: "600",
                      }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u) => {
                    const isActive = isUserActive(u.last_login);
                    
                    return (
                      <tr key={u.id} style={{ borderBottom: `1px solid ${colors.border}` }}>
                        <td style={{ padding: "15px", color: colors.textSecondary }}>
                          #{u.id}
                        </td>
                        <td style={{ padding: "15px", color: colors.textPrimary, fontWeight: "600" }}>
                          {u.username}
                          {u.username === "Cyber_Admin" && " 👑"}
                        </td>
                        <td style={{ padding: "15px" }}>
                          <span style={{
                            padding: "4px 12px",
                            background: u.role === "admin" ? "#3b82f6" : colors.accent,
                            color: "#fff",
                            borderRadius: "12px",
                            fontSize: "0.85rem",
                          }}>
                            {u.role || "user"}
                          </span>
                        </td>
                        <td style={{ padding: "15px", color: colors.textSecondary, fontSize: "0.9rem" }}>
                          {u.created_at ? new Date(u.created_at).toLocaleDateString('fr-FR') : "N/A"}
                        </td>
                        <td style={{ padding: "15px", color: colors.textSecondary, fontSize: "0.9rem" }}>
                          {u.last_login ? new Date(u.last_login).toLocaleDateString('fr-FR') : "Jamais"}
                        </td>
                        <td style={{ padding: "15px" }}>
                          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                            {/* Badge Bloqué (si applicable) */}
                            {u.blocked && (
                              <span style={{
                                padding: "4px 12px",
                                background: "#ef4444",
                                color: "#fff",
                                borderRadius: "12px",
                                fontSize: "0.85rem",
                              }}>
                                🚫 Bloqué
                              </span>
                            )}
                            {/* Badge Actif/Inactif (basé sur connexion < 30 jours) */}
                            {!u.blocked && (
                              <span style={{
                                padding: "4px 12px",
                                background: isActive ? "#10b981" : "#6b7280",
                                color: "#fff",
                                borderRadius: "12px",
                                fontSize: "0.85rem",
                              }}>
                                {isActive ? "✅ Actif" : "⏸️ Inactif"}
                              </span>
                            )}
                          </div>
                        </td>
                        <td style={{ padding: "15px" }}>
                          {u.username !== "Cyber_Admin" && (
                            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                              <button
                                onClick={() => handleBlockUser(u.id, u.username, u.blocked)}
                                style={{
                                  padding: "6px 12px",
                                  background: u.blocked ? "#10b981" : "#f59e0b",
                                  color: "#fff",
                                  border: "none",
                                  borderRadius: "6px",
                                  cursor: "pointer",
                                  fontSize: "0.85rem",
                                }}
                              >
                                {u.blocked ? "Débloquer" : "Bloquer"}
                              </button>
                              <button
                                onClick={() => handleResetPassword(u.id, u.username)}
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
                                onClick={() => handleDeleteUser(u.id, u.username)}
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
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
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
            ✅ <strong>Connecté à Neon PostgreSQL</strong> - Les utilisateurs affichés proviennent de la base de données réelle.
            <br />
            ⏱️ <strong>Inactif</strong> = Pas de connexion depuis 30 jours ou plus.
          </p>
        </div>
      </div>
    </div>
  );
}

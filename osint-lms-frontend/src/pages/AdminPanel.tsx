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

interface BlockedAccount {
  username: string;
  attempt_type: string;
  attempts: number;
  blocked_until: string;
  last_attempt: string;
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
  const [blockedAccounts, setBlockedAccounts] = useState<BlockedAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Protection
  useEffect(() => {
    console.log("🔐 Admin check:", currentUser?.username);
    if (currentUser?.username !== "Cyber_Admin") {
      console.log("❌ Pas admin, redirection...");
      navigate("/dashboard");
    } else {
      console.log("✅ Admin confirmé");
    }
  }, [currentUser, navigate]);

  // ✅ CORRECTION : Tableau vide pour éviter la boucle infinie
  useEffect(() => {
    if (currentUser?.username === "Cyber_Admin") {
      console.log("📊 Chargement données admin...");
      fetchStats();
      fetchUsers();
      fetchBlockedAccounts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // ✅ S'exécute UNE SEULE FOIS au montage du composant

  const fetchStats = async () => {
    try {
      console.log("📊 Fetching stats...");
      const res = await fetch(`${API_URL}/admin/stats`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      
      console.log("📊 Stats response:", res.status);
      
      if (res.ok) {
        const data = await res.json();
        console.log("📊 Stats data:", data);
        if (data.success) {
          setStats({
            total: data.total,
            newThisWeek: data.newThisWeek,
            activeToday: data.activeToday
          });
        }
      }
    } catch (error) {
      console.error('❌ Failed to fetch stats:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      console.log("👥 Fetching users...");
      setLoading(true);
      const res = await fetch(`${API_URL}/admin/users`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      
      console.log("👥 Users response:", res.status);
      
      if (res.ok) {
        const data = await res.json();
        console.log("👥 Users data:", data.users?.length, "users");
        if (data.success) {
          setUsers(data.users);
        }
      }
    } catch (error) {
      console.error('❌ Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBlockedAccounts = async () => {
    try {
      console.log("🔍 Fetching blocked accounts...");
      
      const response = await fetch(`${API_URL}/admin/blocked-accounts`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      
      console.log("🔍 Blocked accounts response:", response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log("🔍 Blocked accounts data:", data);
        console.log("🔍 Count:", data.count);
        
        setBlockedAccounts(data.blockedAccounts || []);
        console.log("✅ Blocked accounts state updated:", data.blockedAccounts?.length || 0);
      } else {
        const error = await response.json();
        console.error("❌ Blocked accounts error:", error);
      }
    } catch (error) {
      console.error('❌ Failed to fetch blocked accounts:', error);
    }
  };

  const unblockAccount = async (username: string) => {
    if (!confirm(`Débloquer le compte "${username}" ?`)) {
      return;
    }

    try {
      console.log(`🔓 Unblocking: ${username}`);
      
      const res = await fetch(`${API_URL}/admin/unblock-account`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ username })
      });

      if (res.ok) {
        console.log(`✅ ${username} unblocked`);
        alert(`✅ Compte ${username} débloqué avec succès`);
        fetchBlockedAccounts(); // Refresh
      } else {
        console.error(`❌ Failed to unblock ${username}`);
        alert('❌ Erreur lors du déblocage');
      }
    } catch (error) {
      console.error('❌ Unblock error:', error);
      alert('❌ Erreur lors du déblocage');
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

  console.log("🎨 Rendering admin panel, blockedAccounts:", blockedAccounts.length);

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

        {/* Section Comptes Bloqués - TOUJOURS AFFICHÉE */}
        <div style={{
          marginBottom: "40px",
          padding: "25px",
          background: blockedAccounts.length > 0 ? "#fff3cd" : colors.bgSecondary,
          border: `2px solid ${blockedAccounts.length > 0 ? "#ffc107" : colors.border}`,
          borderRadius: "12px",
        }}>
          <h3 style={{
            fontSize: "1.5rem",
            fontWeight: "600",
            color: blockedAccounts.length > 0 ? "#856404" : colors.textPrimary,
            marginBottom: "20px",
          }}>
            🔒 Comptes Bloqués ({blockedAccounts.length})
          </h3>
          
          {blockedAccounts.length === 0 ? (
            <p style={{ color: colors.textSecondary, margin: 0 }}>
              Aucun compte bloqué actuellement
            </p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#ffe69c" }}>
                    {["Username", "Type", "Tentatives", "Bloqué jusqu'à", "Dernière tentative", "Action"].map((h) => (
                      <th key={h} style={{
                        padding: "12px",
                        textAlign: "left",
                        color: "#856404",
                        fontSize: "0.9rem",
                        fontWeight: "600",
                      }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {blockedAccounts.map((account) => (
                    <tr key={`${account.username}-${account.attempt_type}`} style={{
                      borderBottom: "1px solid #ffc107",
                    }}>
                      <td style={{ padding: "12px", color: "#212529", fontWeight: "600" }}>
                        {account.username}
                      </td>
                      <td style={{ padding: "12px" }}>
                        <span style={{
                          padding: "4px 10px",
                          background: account.attempt_type === "password" ? "#dc3545" : "#fd7e14",
                          color: "#fff",
                          borderRadius: "12px",
                          fontSize: "0.85rem",
                        }}>
                          {account.attempt_type === "password" ? "🔑 Mot de passe" : "🔐 2FA"}
                        </span>
                      </td>
                      <td style={{ padding: "12px", color: "#dc3545", fontWeight: "700" }}>
                        {account.attempts}
                      </td>
                      <td style={{ padding: "12px", color: "#856404", fontSize: "0.9rem" }}>
                        {new Date(account.blocked_until).toLocaleString('fr-FR')}
                      </td>
                      <td style={{ padding: "12px", color: "#6c757d", fontSize: "0.85rem" }}>
                        {new Date(account.last_attempt).toLocaleString('fr-FR')}
                      </td>
                      <td style={{ padding: "12px" }}>
                        <button
                          onClick={() => unblockAccount(account.username)}
                          style={{
                            padding: "8px 16px",
                            background: "#28a745",
                            color: "#fff",
                            border: "none",
                            borderRadius: "6px",
                            cursor: "pointer",
                            fontSize: "0.85rem",
                            fontWeight: "600",
                          }}
                        >
                          ✅ Débloquer
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
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

        {/* Table Utilisateurs */}
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
            <br />
            🔒 <strong>Comptes bloqués</strong> = Bloqués automatiquement après 5 tentatives échouées (mot de passe ou 2FA).
          </p>
        </div>
      </div>
    </div>
  );
}

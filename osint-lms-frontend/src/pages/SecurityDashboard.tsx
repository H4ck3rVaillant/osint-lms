import { useState, useEffect } from "react";
import { useAuth } from "../auth/AuthContext";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface AuditLog {
  id: number;
  username: string;
  action: string;
  ip_address: string;
  timestamp: string;
  details?: string;
}

interface SecurityEvent {
  id: number;
  event_type: string;
  ip_address: string;
  path: string;
  timestamp: string;
  user_agent?: string;
}

interface Stats {
  totalLogs: number;
  successLogins: number;
  failedLogins: number;
  blockedAccounts: number;
  honeypotEvents: number;
}

export default function SecurityDashboard() {
  const { token } = useAuth();
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalLogs: 0,
    successLogins: 0,
    failedLogins: 0,
    blockedAccounts: 0,
    honeypotEvents: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const BACKEND_URL = import.meta.env.VITE_API_URL || "https://osint-lms-backend.onrender.com";

  const fetchData = async () => {
    if (!token) return;

    try {
      // Fetch audit logs
      const logsResponse = await fetch(`${BACKEND_URL}/admin/audit-logs?limit=50`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (logsResponse.ok) {
        const logsData = await logsResponse.json();
        setAuditLogs(logsData.logs || []);
      }

      // Fetch security events
      const eventsResponse = await fetch(`${BACKEND_URL}/admin/security-events?limit=50`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (eventsResponse.ok) {
        const eventsData = await eventsResponse.json();
        setSecurityEvents(eventsData.events || []);
      }

      // Fetch stats
      const statsResponse = await fetch(`${BACKEND_URL}/admin/audit-stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData.stats || {});
      }

      setIsLoading(false);
    } catch (error) {
      console.error("Erreur chargement données sécurité:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchData();
    }, 30000);

    return () => clearInterval(interval);
  }, [autoRefresh, token]);

  // Préparer les données pour le graphique
  const prepareChartData = () => {
    const last24Hours: { [key: string]: { success: number; failed: number; honeypot: number } } = {};
    
    const now = new Date();
    for (let i = 23; i >= 0; i--) {
      const hour = new Date(now.getTime() - i * 60 * 60 * 1000);
      const key = `${hour.getHours()}h`;
      last24Hours[key] = { success: 0, failed: 0, honeypot: 0 };
    }

    auditLogs.forEach(log => {
      const logDate = new Date(log.timestamp);
      const hour = `${logDate.getHours()}h`;
      if (last24Hours[hour]) {
        if (log.action === "LOGIN_SUCCESS") last24Hours[hour].success++;
        if (log.action === "LOGIN_FAILED") last24Hours[hour].failed++;
      }
    });

    securityEvents.forEach(event => {
      const eventDate = new Date(event.timestamp);
      const hour = `${eventDate.getHours()}h`;
      if (last24Hours[hour]) {
        last24Hours[hour].honeypot++;
      }
    });

    return Object.entries(last24Hours).map(([hour, data]) => ({
      hour,
      ...data
    }));
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });
  };

  if (isLoading) {
    return (
      <div style={{ 
        minHeight: "100vh", 
        background: "#020617", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center" 
      }}>
        <div style={{ color: "#00ff9c", fontSize: "1.5rem" }}>
          🔄 Chargement des données de sécurité...
        </div>
      </div>
    );
  }

  const chartData = prepareChartData();

  return (
    <div style={{ 
      minHeight: "100vh", 
      background: "#020617", 
      padding: "30px 20px" 
    }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        
        {/* Header */}
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center", 
          marginBottom: "30px",
          flexWrap: "wrap",
          gap: "15px"
        }}>
          <h1 style={{ color: "#00ff9c", fontSize: "2rem", margin: 0 }}>
            🛡️ Tableau de Bord Sécurité
          </h1>
          
          <div style={{ display: "flex", gap: "15px", alignItems: "center", flexWrap: "wrap" }}>
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              style={{
                padding: "10px 20px",
                background: autoRefresh ? "#00ff9c" : "#1a1f2e",
                color: autoRefresh ? "#020617" : "#00ff9c",
                border: `1px solid ${autoRefresh ? "#00ff9c" : "#2a3f3f"}`,
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "bold"
              }}
            >
              {autoRefresh ? "🔄 Auto-refresh ON" : "⏸️ Auto-refresh OFF"}
            </button>
            
            <button
              onClick={fetchData}
              style={{
                padding: "10px 20px",
                background: "#1a1f2e",
                color: "#00ff9c",
                border: "1px solid #2a3f3f",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "bold"
              }}
            >
              🔄 Actualiser
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", 
          gap: "20px", 
          marginBottom: "30px" 
        }}>
          <div style={{ 
            background: "#0b0f1a", 
            border: "1px solid #00ff9c", 
            borderRadius: "12px", 
            padding: "20px" 
          }}>
            <div style={{ color: "#9ca3af", fontSize: "0.9rem", marginBottom: "8px" }}>
              Total Logs (24h)
            </div>
            <div style={{ color: "#00ff9c", fontSize: "2.5rem", fontWeight: "bold" }}>
              {stats.totalLogs}
            </div>
          </div>

          <div style={{ 
            background: "#0b0f1a", 
            border: "1px solid #10b981", 
            borderRadius: "12px", 
            padding: "20px" 
          }}>
            <div style={{ color: "#9ca3af", fontSize: "0.9rem", marginBottom: "8px" }}>
              Connexions Réussies
            </div>
            <div style={{ color: "#10b981", fontSize: "2.5rem", fontWeight: "bold" }}>
              {stats.successLogins}
            </div>
          </div>

          <div style={{ 
            background: "#0b0f1a", 
            border: "1px solid #ef4444", 
            borderRadius: "12px", 
            padding: "20px" 
          }}>
            <div style={{ color: "#9ca3af", fontSize: "0.9rem", marginBottom: "8px" }}>
              Tentatives Échouées
            </div>
            <div style={{ color: "#ef4444", fontSize: "2.5rem", fontWeight: "bold" }}>
              {stats.failedLogins}
            </div>
          </div>

          <div style={{ 
            background: "#0b0f1a", 
            border: "1px solid #f59e0b", 
            borderRadius: "12px", 
            padding: "20px" 
          }}>
            <div style={{ color: "#9ca3af", fontSize: "0.9rem", marginBottom: "8px" }}>
              Comptes Bloqués
            </div>
            <div style={{ color: "#f59e0b", fontSize: "2.5rem", fontWeight: "bold" }}>
              {stats.blockedAccounts}
            </div>
          </div>

          <div style={{ 
            background: "#0b0f1a", 
            border: "1px solid #8b5cf6", 
            borderRadius: "12px", 
            padding: "20px" 
          }}>
            <div style={{ color: "#9ca3af", fontSize: "0.9rem", marginBottom: "8px" }}>
              Honeypot Déclenchés
            </div>
            <div style={{ color: "#8b5cf6", fontSize: "2.5rem", fontWeight: "bold" }}>
              {stats.honeypotEvents}
            </div>
          </div>
        </div>

        {/* Graphique Activité */}
        <div style={{ 
          background: "#0b0f1a", 
          border: "1px solid #2a3f3f", 
          borderRadius: "12px", 
          padding: "25px", 
          marginBottom: "30px" 
        }}>
          <h2 style={{ color: "#00ff9c", fontSize: "1.3rem", marginBottom: "20px" }}>
            📊 Activité des dernières 24h
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a1f2e" />
              <XAxis dataKey="hour" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ 
                  background: "#0b0f1a", 
                  border: "1px solid #00ff9c", 
                  borderRadius: "8px" 
                }} 
              />
              <Line type="monotone" dataKey="success" stroke="#10b981" strokeWidth={2} name="Connexions" />
              <Line type="monotone" dataKey="failed" stroke="#ef4444" strokeWidth={2} name="Échecs" />
              <Line type="monotone" dataKey="honeypot" stroke="#8b5cf6" strokeWidth={2} name="Honeypot" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Audit Logs Table */}
        <div style={{ 
          background: "#0b0f1a", 
          border: "1px solid #2a3f3f", 
          borderRadius: "12px", 
          padding: "25px", 
          marginBottom: "30px" 
        }}>
          <h2 style={{ color: "#00ff9c", fontSize: "1.3rem", marginBottom: "20px" }}>
            📝 Logs d'Audit Récents
          </h2>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #2a3f3f" }}>
                  <th style={{ padding: "12px", textAlign: "left", color: "#00ff9c", fontWeight: "bold" }}>
                    Utilisateur
                  </th>
                  <th style={{ padding: "12px", textAlign: "left", color: "#00ff9c", fontWeight: "bold" }}>
                    Action
                  </th>
                  <th style={{ padding: "12px", textAlign: "left", color: "#00ff9c", fontWeight: "bold" }}>
                    IP
                  </th>
                  <th style={{ padding: "12px", textAlign: "left", color: "#00ff9c", fontWeight: "bold" }}>
                    Horodatage
                  </th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.slice(0, 20).map((log, index) => (
                  <tr 
                    key={log.id || index} 
                    style={{ 
                      borderBottom: "1px solid #1a1f2e",
                      background: index % 2 === 0 ? "#0b0f1a" : "#12161f"
                    }}
                  >
                    <td style={{ padding: "12px", color: "#e5e7eb" }}>{log.username || "N/A"}</td>
                    <td style={{ padding: "12px" }}>
                      <span style={{
                        padding: "4px 12px",
                        borderRadius: "6px",
                        fontSize: "0.85rem",
                        fontWeight: "bold",
                        background: log.action === "LOGIN_SUCCESS" ? "#10b98120" : 
                                   log.action === "LOGIN_FAILED" ? "#ef444420" : "#f59e0b20",
                        color: log.action === "LOGIN_SUCCESS" ? "#10b981" : 
                               log.action === "LOGIN_FAILED" ? "#ef4444" : "#f59e0b"
                      }}>
                        {log.action}
                      </span>
                    </td>
                    <td style={{ padding: "12px", color: "#9ca3af", fontFamily: "monospace" }}>
                      {log.ip_address}
                    </td>
                    <td style={{ padding: "12px", color: "#9ca3af" }}>
                      {formatTimestamp(log.timestamp)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Security Events Table */}
        <div style={{ 
          background: "#0b0f1a", 
          border: "1px solid #2a3f3f", 
          borderRadius: "12px", 
          padding: "25px" 
        }}>
          <h2 style={{ color: "#00ff9c", fontSize: "1.3rem", marginBottom: "20px" }}>
            🍯 Événements Honeypot
          </h2>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #2a3f3f" }}>
                  <th style={{ padding: "12px", textAlign: "left", color: "#00ff9c", fontWeight: "bold" }}>
                    Type
                  </th>
                  <th style={{ padding: "12px", textAlign: "left", color: "#00ff9c", fontWeight: "bold" }}>
                    Chemin
                  </th>
                  <th style={{ padding: "12px", textAlign: "left", color: "#00ff9c", fontWeight: "bold" }}>
                    IP
                  </th>
                  <th style={{ padding: "12px", textAlign: "left", color: "#00ff9c", fontWeight: "bold" }}>
                    Horodatage
                  </th>
                </tr>
              </thead>
              <tbody>
                {securityEvents.slice(0, 20).map((event, index) => (
                  <tr 
                    key={event.id || index} 
                    style={{ 
                      borderBottom: "1px solid #1a1f2e",
                      background: index % 2 === 0 ? "#0b0f1a" : "#12161f"
                    }}
                  >
                    <td style={{ padding: "12px" }}>
                      <span style={{
                        padding: "4px 12px",
                        borderRadius: "6px",
                        fontSize: "0.85rem",
                        fontWeight: "bold",
                        background: "#8b5cf620",
                        color: "#8b5cf6"
                      }}>
                        {event.event_type}
                      </span>
                    </td>
                    <td style={{ padding: "12px", color: "#e5e7eb", fontFamily: "monospace" }}>
                      {event.path}
                    </td>
                    <td style={{ padding: "12px", color: "#9ca3af", fontFamily: "monospace" }}>
                      {event.ip_address}
                    </td>
                    <td style={{ padding: "12px", color: "#9ca3af" }}>
                      {formatTimestamp(event.timestamp)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";

interface User {
  id: number;
  username: string;
  role: string;
  created_at: string;
}

interface Message {
  id: number;
  from_user_id: number;
  to_user_id: number;
  message: string;
  read: boolean;
  created_at: string;
  from_username?: string;
  to_username?: string;
}

export default function MessagesPage() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const API_URL = "https://osint-lms-backend.onrender.com";

  const [users, setUsers] = useState<User[]>([]);
  const [receivedMessages, setReceivedMessages] = useState<Message[]>([]);
  const [sentMessages, setSentMessages] = useState<Message[]>([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [messageText, setMessageText] = useState("");
  const [activeTab, setActiveTab] = useState<"send" | "received" | "sent">("send");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Charger les utilisateurs (pour admin)
  useEffect(() => {
    loadUsers();
    loadMessages();
  }, [user]);

  const loadUsers = async () => {
    try {
      const response = await fetch(`${API_URL}/messages/users`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setUsers(data.users.filter((u: User) => u.username !== user?.username));
      }
    } catch (error) {
      console.error("Erreur chargement utilisateurs:", error);
    }
  };

  const loadMessages = async () => {
    try {
      const response = await fetch(`${API_URL}/messages`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setReceivedMessages(data.received);
        setSentMessages(data.sent);
      }
    } catch (error) {
      console.error("Erreur chargement messages:", error);
    }
  };

  const sendMessage = async () => {
    if (!selectedUser || !messageText.trim()) {
      setError("Sélectionnez un utilisateur et écrivez un message");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/messages/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          toUsername: selectedUser,
          message: messageText
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setSuccess("✅ Message envoyé !");
        setMessageText("");
        setSelectedUser("");
        loadMessages();
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(data.message || "Erreur envoi message");
      }
    } catch (error) {
      setError("Erreur connexion serveur");
    }
  };

  const markAsRead = async (messageId: number) => {
    try {
      await fetch(`${API_URL}/messages/${messageId}/read`, {
        method: "PUT",
        headers: { "Authorization": `Bearer ${token}` }
      });
      loadMessages();
    } catch (error) {
      console.error("Erreur marquage lu:", error);
    }
  };

  if (!user) {
    navigate("/login");
    return null;
  }

  const unreadCount = receivedMessages.filter(m => !m.read).length;
  const newUsers = users.filter(u => {
    const createdDate = new Date(u.created_at);
    const daysSinceCreated = (Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24);
    return daysSinceCreated < 7; // Nouveaux = inscrits il y a moins de 7 jours
  });

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0b0f1a 0%, #1a1f2e 100%)",
      padding: "40px 20px"
    }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        
        {/* En-tête */}
        <div style={{ marginBottom: "30px" }}>
          <h1 style={{ color: "#00ff9c", fontSize: "2.5rem", margin: "0 0 10px 0" }}>
            💬 Messagerie
          </h1>
          <p style={{ color: "#9ca3af", fontSize: "1rem" }}>
            {user.role === "admin" ? "Gérez vos messages et contactez les utilisateurs" : "Vos messages"}
          </p>
        </div>

        {/* Alertes nouveaux utilisateurs (admin uniquement) */}
        {user.role === "admin" && newUsers.length > 0 && (
          <div style={{
            background: "#0a1a0a",
            border: "2px solid #00ff9c",
            borderRadius: "12px",
            padding: "20px",
            marginBottom: "30px"
          }}>
            <h3 style={{ color: "#00ff9c", margin: "0 0 15px 0" }}>
              🎉 {newUsers.length} nouveau{newUsers.length > 1 ? "x" : ""} utilisateur{newUsers.length > 1 ? "s" : ""} !
            </h3>
            {newUsers.map(u => (
              <div key={u.id} style={{
                background: "#1a1f2e",
                padding: "10px 15px",
                borderRadius: "8px",
                marginBottom: "10px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}>
                <span style={{ color: "#e5e7eb" }}>
                  👤 <strong>{u.username}</strong> - Inscrit le {new Date(u.created_at).toLocaleDateString()}
                </span>
                <button
                  onClick={() => {
                    setSelectedUser(u.username);
                    setActiveTab("send");
                  }}
                  style={{
                    padding: "8px 16px",
                    background: "#00ff9c",
                    color: "#0b0f1a",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontWeight: "bold"
                  }}
                >
                  Envoyer un message
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Onglets */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
          <button
            onClick={() => setActiveTab("send")}
            style={{
              flex: 1,
              padding: "12px",
              background: activeTab === "send" ? "#00ff9c" : "transparent",
              color: activeTab === "send" ? "#0b0f1a" : "#9ca3af",
              border: `2px solid ${activeTab === "send" ? "#00ff9c" : "#2a3f3f"}`,
              borderRadius: "8px",
              fontWeight: "bold",
              cursor: "pointer"
            }}
          >
            ✉️ Envoyer
          </button>
          <button
            onClick={() => setActiveTab("received")}
            style={{
              flex: 1,
              padding: "12px",
              background: activeTab === "received" ? "#00ff9c" : "transparent",
              color: activeTab === "received" ? "#0b0f1a" : "#9ca3af",
              border: `2px solid ${activeTab === "received" ? "#00ff9c" : "#2a3f3f"}`,
              borderRadius: "8px",
              fontWeight: "bold",
              cursor: "pointer",
              position: "relative"
            }}
          >
            📥 Reçus
            {unreadCount > 0 && (
              <span style={{
                position: "absolute",
                top: "-5px",
                right: "-5px",
                background: "#ef4444",
                color: "white",
                borderRadius: "50%",
                width: "20px",
                height: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.7rem",
                fontWeight: "bold"
              }}>
                {unreadCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("sent")}
            style={{
              flex: 1,
              padding: "12px",
              background: activeTab === "sent" ? "#00ff9c" : "transparent",
              color: activeTab === "sent" ? "#0b0f1a" : "#9ca3af",
              border: `2px solid ${activeTab === "sent" ? "#00ff9c" : "#2a3f3f"}`,
              borderRadius: "8px",
              fontWeight: "bold",
              cursor: "pointer"
            }}
          >
            📤 Envoyés
          </button>
        </div>

        {/* Messages de feedback */}
        {success && (
          <div style={{
            background: "#0a1a0a",
            border: "1px solid #00ff9c",
            borderRadius: "8px",
            padding: "12px",
            color: "#00ff9c",
            marginBottom: "20px"
          }}>
            {success}
          </div>
        )}

        {error && (
          <div style={{
            background: "#1a0a0a",
            border: "1px solid #ef4444",
            borderRadius: "8px",
            padding: "12px",
            color: "#ef4444",
            marginBottom: "20px"
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* Contenu */}
        <div style={{
          background: "#0b0f1a",
          border: "1px solid #2a3f3f",
          borderRadius: "16px",
          padding: "30px"
        }}>
          
          {/* Onglet Envoyer */}
          {activeTab === "send" && (
            <div>
              <h2 style={{ color: "#e5e7eb", marginBottom: "20px" }}>Envoyer un message</h2>
              
              <div style={{ marginBottom: "20px" }}>
                <label style={{ color: "#9ca3af", display: "block", marginBottom: "8px" }}>
                  Destinataire
                </label>
                <select
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px",
                    background: "#1a1f2e",
                    border: "1px solid #2a3f3f",
                    borderRadius: "8px",
                    color: "#e5e7eb",
                    fontSize: "1rem"
                  }}
                >
                  <option value="">Sélectionner un utilisateur...</option>
                  {users.map(u => (
                    <option key={u.id} value={u.username}>
                      {u.username} ({u.role}) {newUsers.some(nu => nu.id === u.id) && "🆕"}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ color: "#9ca3af", display: "block", marginBottom: "8px" }}>
                  Message
                </label>
                <textarea
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  rows={6}
                  placeholder="Écrivez votre message..."
                  style={{
                    width: "100%",
                    padding: "12px",
                    background: "#1a1f2e",
                    border: "1px solid #2a3f3f",
                    borderRadius: "8px",
                    color: "#e5e7eb",
                    fontSize: "1rem",
                    resize: "vertical",
                    fontFamily: "inherit"
                  }}
                />
              </div>

              <button
                onClick={sendMessage}
                style={{
                  padding: "14px 30px",
                  background: "#00ff9c",
                  color: "#0b0f1a",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: "bold",
                  fontSize: "1rem",
                  cursor: "pointer"
                }}
              >
                📨 Envoyer
              </button>
            </div>
          )}

          {/* Onglet Messages reçus */}
          {activeTab === "received" && (
            <div>
              <h2 style={{ color: "#e5e7eb", marginBottom: "20px" }}>Messages reçus</h2>
              {receivedMessages.length === 0 ? (
                <p style={{ color: "#6b7280", textAlign: "center", padding: "40px" }}>
                  Aucun message reçu
                </p>
              ) : (
                receivedMessages.map(msg => (
                  <div
                    key={msg.id}
                    onClick={() => markAsRead(msg.id)}
                    style={{
                      background: msg.read ? "#1a1f2e" : "#0a1a0a",
                      border: msg.read ? "1px solid #2a3f3f" : "2px solid #00ff9c",
                      borderRadius: "12px",
                      padding: "20px",
                      marginBottom: "15px",
                      cursor: "pointer"
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                      <span style={{ color: "#00ff9c", fontWeight: "bold" }}>
                        De: {msg.from_username}
                      </span>
                      <span style={{ color: "#6b7280", fontSize: "0.9rem" }}>
                        {new Date(msg.created_at).toLocaleString()}
                      </span>
                    </div>
                    <p style={{ color: "#e5e7eb", margin: 0, whiteSpace: "pre-wrap" }}>
                      {msg.message}
                    </p>
                    {!msg.read && (
                      <div style={{ marginTop: "10px", color: "#00ff9c", fontSize: "0.9rem" }}>
                        ✨ Nouveau
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {/* Onglet Messages envoyés */}
          {activeTab === "sent" && (
            <div>
              <h2 style={{ color: "#e5e7eb", marginBottom: "20px" }}>Messages envoyés</h2>
              {sentMessages.length === 0 ? (
                <p style={{ color: "#6b7280", textAlign: "center", padding: "40px" }}>
                  Aucun message envoyé
                </p>
              ) : (
                sentMessages.map(msg => (
                  <div
                    key={msg.id}
                    style={{
                      background: "#1a1f2e",
                      border: "1px solid #2a3f3f",
                      borderRadius: "12px",
                      padding: "20px",
                      marginBottom: "15px"
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                      <span style={{ color: "#00ff9c", fontWeight: "bold" }}>
                        À: {msg.to_username}
                      </span>
                      <span style={{ color: "#6b7280", fontSize: "0.9rem" }}>
                        {new Date(msg.created_at).toLocaleString()}
                      </span>
                    </div>
                    <p style={{ color: "#e5e7eb", margin: 0, whiteSpace: "pre-wrap" }}>
                      {msg.message}
                    </p>
                    <div style={{ marginTop: "10px", color: "#6b7280", fontSize: "0.9rem" }}>
                      {msg.read ? "✓ Lu" : "⏳ Non lu"}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <button
          onClick={() => navigate("/dashboard")}
          style={{
            marginTop: "30px",
            padding: "12px 24px",
            background: "transparent",
            color: "#9ca3af",
            border: "1px solid #2a3f3f",
            borderRadius: "8px",
            cursor: "pointer"
          }}
        >
          ← Retour au Dashboard
        </button>
      </div>
    </div>
  );
}

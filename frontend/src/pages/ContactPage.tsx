import { useState } from "react";
import { useAuth } from "../auth/AuthContext";

export default function ContactPage() {
  const { user } = useAuth();
  
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!subject.trim() || !message.trim()) {
      setError("Le sujet et le message sont requis");
      return;
    }

    if (message.length < 20) {
      setError("Le message doit faire au moins 20 caractères");
      return;
    }

    setIsLoading(true);

    try {
      // En production, tu pourras connecter ça à un vrai service email
      // Pour l'instant, on simule l'envoi
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Sauvegarder dans localStorage comme backup
      const messages = JSON.parse(localStorage.getItem("admin_messages") || "[]");
      messages.push({
        from: user?.username || "Anonyme",
        subject,
        message,
        date: new Date().toISOString()
      });
      localStorage.setItem("admin_messages", JSON.stringify(messages));

      setSuccess("✅ Votre message a été envoyé à l'administrateur !");
      setSubject("");
      setMessage("");
      
      setTimeout(() => setSuccess(""), 5000);
    } catch {
      setError("Erreur lors de l'envoi du message");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0b0f1a 0%, #1a1f2e 100%)",
      padding: "40px 20px"
    }}>
      <div style={{ maxWidth: "700px", margin: "0 auto" }}>
        
        {/* En-tête */}
        <div style={{ marginBottom: "40px", textAlign: "center" }}>
          <div style={{ fontSize: "4rem", marginBottom: "16px" }}>📧</div>
          <h1 style={{ color: "#00ff9c", fontSize: "2.5rem", margin: "0 0 10px 0" }}>
            Contacter l'Admin
          </h1>
          <p style={{ color: "#9ca3af", fontSize: "1rem" }}>
            Une question ? Un problème technique ? Envoyez-nous un message
          </p>
        </div>

        {/* Formulaire */}
        <div style={{
          background: "#0b0f1a",
          border: "1px solid #2a3f3f",
          borderRadius: "16px",
          padding: "35px"
        }}>
          
          {error && (
            <div style={{
              background: "#1a0a0a",
              border: "1px solid #ef4444",
              borderRadius: "8px",
              padding: "12px 16px",
              color: "#ef4444",
              marginBottom: "20px",
              fontSize: "0.9rem"
            }}>
              ⚠️ {error}
            </div>
          )}

          {success && (
            <div style={{
              background: "#0a1a0a",
              border: "1px solid #00ff9c",
              borderRadius: "8px",
              padding: "12px 16px",
              color: "#00ff9c",
              marginBottom: "20px",
              fontSize: "0.9rem"
            }}>
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            
            {/* Nom (pré-rempli si connecté) */}
            <div style={{ marginBottom: "18px" }}>
              <label style={{ color: "#9ca3af", fontSize: "0.85rem", display: "block", marginBottom: "6px" }}>
                Votre nom d'utilisateur
              </label>
              <input
                type="text"
                value={user?.username || "Visiteur"}
                disabled
                style={{
                  ...inputStyle,
                  background: "#1a1f2e",
                  color: "#6b7280",
                  cursor: "not-allowed"
                }}
              />
            </div>

            {/* Sujet */}
            <div style={{ marginBottom: "18px" }}>
              <label style={{ color: "#9ca3af", fontSize: "0.85rem", display: "block", marginBottom: "6px" }}>
                Sujet *
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="ex: Problème de connexion, Question sur les badges..."
                style={inputStyle}
                onFocus={(e) => e.currentTarget.style.borderColor = "#00ff9c"}
                onBlur={(e) => e.currentTarget.style.borderColor = "#2a3f3f"}
              />
            </div>

            {/* Message */}
            <div style={{ marginBottom: "24px" }}>
              <label style={{ color: "#9ca3af", fontSize: "0.85rem", display: "block", marginBottom: "6px" }}>
                Message *
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Décrivez votre question ou problème en détail..."
                rows={8}
                style={{
                  ...inputStyle,
                  resize: "vertical" as const,
                  fontFamily: "inherit"
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = "#00ff9c"}
                onBlur={(e) => e.currentTarget.style.borderColor = "#2a3f3f"}
              />
              <p style={{ color: "#6b7280", fontSize: "0.75rem", marginTop: "4px" }}>
                {message.length} / 20 caractères minimum
              </p>
            </div>

            {/* Bouton Envoyer */}
            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: "100%",
                padding: "14px",
                background: isLoading ? "#6b7280" : "#00ff9c",
                color: "#0b0f1a",
                border: "none",
                borderRadius: "8px",
                fontWeight: "bold",
                fontSize: "1rem",
                cursor: isLoading ? "not-allowed" : "pointer",
                transition: "all 0.2s"
              }}
              onMouseEnter={(e) => {
                if (!isLoading) e.currentTarget.style.boxShadow = "0 0 20px rgba(0,255,156,0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {isLoading ? "Envoi en cours..." : "📤 Envoyer le message"}
            </button>
          </form>
        </div>

        {/* Infos complémentaires */}
        <div style={{
          marginTop: "30px",
          background: "#0b0f1a",
          border: "1px solid #2a3f3f",
          borderRadius: "12px",
          padding: "20px"
        }}>
          <h3 style={{ color: "#00ff9c", fontSize: "1rem", marginBottom: "12px" }}>
            💡 Avant de nous contacter
          </h3>
          <ul style={{ color: "#9ca3af", fontSize: "0.9rem", lineHeight: "1.8", paddingLeft: "20px" }}>
            <li>Vérifiez la FAQ dans la section Documentation</li>
            <li>Consultez les guides dans les parcours</li>
            <li>Essayez de vous déconnecter/reconnecter</li>
            <li>Temps de réponse moyen : 24-48h</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  background: "#1a1f2e",
  border: "1px solid #2a3f3f",
  borderRadius: "8px",
  color: "#e5e7eb",
  fontSize: "1rem",
  outline: "none",
  boxSizing: "border-box",
  transition: "border-color 0.2s"
};

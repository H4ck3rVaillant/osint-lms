import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ContactPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMessage("");

    // Validation
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setStatus("error");
      setErrorMessage("Tous les champs sont requis");
      return;
    }

    if (!formData.email.includes("@")) {
      setStatus("error");
      setErrorMessage("Email invalide");
      return;
    }

    try {
      // ✅ ENVOI RÉEL via Web3Forms
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          access_key: "cbc2c408-db0f-4a14-868f-a2ca3a193798",
          name: formData.name,
          email: formData.email,
          subject: `[CyberOSINT Academy] ${formData.subject}`,
          message: formData.message,
          from_name: "CyberOSINT Academy Contact Form"
        })
      });

      const data = await response.json();

      if (data.success) {
        setStatus("success");
        setFormData({ name: "", email: "", subject: "", message: "" });
        
        // Redirection après 3 secondes
        setTimeout(() => {
          navigate("/dashboard");
        }, 3000);
      } else {
        setStatus("error");
        setErrorMessage(data.message || "Erreur lors de l'envoi");
      }
    } catch (error) {
      console.error("Erreur:", error);
      setStatus("error");
      setErrorMessage("Erreur de connexion. Veuillez réessayer.");
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0b0f1a 0%, #1a1f2e 100%)",
      padding: "40px 20px"
    }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        
        <div style={{ marginBottom: "40px", textAlign: "center" }}>
          <h1 style={{ color: "#00ff9c", fontSize: "2.5rem", margin: "0 0 10px 0" }}>
            📧 Contactez l'Admin
          </h1>
          <p style={{ color: "#9ca3af", fontSize: "1.1rem" }}>
            Une question ? Un problème ? Un feedback ? Envoyez-nous un message !
          </p>
        </div>

        {/* Formulaire */}
        <div style={{
          background: "#0b0f1a",
          border: "1px solid #2a3f3f",
          borderRadius: "16px",
          padding: "40px",
        }}>

          {/* Message succès */}
          {status === "success" && (
            <div style={{
              background: "#0a1a0a",
              border: "2px solid #00ff9c",
              borderRadius: "12px",
              padding: "20px",
              marginBottom: "30px",
              textAlign: "center"
            }}>
              <div style={{ fontSize: "3rem", marginBottom: "15px" }}>✅</div>
              <h3 style={{ color: "#00ff9c", margin: "0 0 10px 0", fontSize: "1.3rem" }}>
                Message envoyé avec succès !
              </h3>
              <p style={{ color: "#9ca3af", margin: 0 }}>
                Nous vous répondrons dans les plus brefs délais.<br />
                Redirection vers le dashboard...
              </p>
            </div>
          )}

          {/* Message erreur */}
          {status === "error" && (
            <div style={{
              background: "#1a0a0a",
              border: "2px solid #ef4444",
              borderRadius: "12px",
              padding: "15px 20px",
              marginBottom: "25px"
            }}>
              <p style={{ color: "#ef4444", margin: 0 }}>
                ⚠️ {errorMessage}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            
            {/* Nom */}
            <div style={{ marginBottom: "20px" }}>
              <label style={{
                color: "#e5e7eb",
                fontSize: "0.95rem",
                fontWeight: "500",
                display: "block",
                marginBottom: "8px"
              }}>
                Votre nom *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                disabled={status === "sending" || status === "success"}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  background: "#1a1f2e",
                  border: "1px solid #2a3f3f",
                  borderRadius: "8px",
                  color: "#e5e7eb",
                  fontSize: "1rem",
                  outline: "none",
                  transition: "border-color 0.2s",
                  boxSizing: "border-box"
                }}
                onFocus={(e) => e.target.style.borderColor = "#00ff9c"}
                onBlur={(e) => e.target.style.borderColor = "#2a3f3f"}
              />
            </div>

            {/* Email */}
            <div style={{ marginBottom: "20px" }}>
              <label style={{
                color: "#e5e7eb",
                fontSize: "0.95rem",
                fontWeight: "500",
                display: "block",
                marginBottom: "8px"
              }}>
                Votre email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                disabled={status === "sending" || status === "success"}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  background: "#1a1f2e",
                  border: "1px solid #2a3f3f",
                  borderRadius: "8px",
                  color: "#e5e7eb",
                  fontSize: "1rem",
                  outline: "none",
                  transition: "border-color 0.2s",
                  boxSizing: "border-box"
                }}
                onFocus={(e) => e.target.style.borderColor = "#00ff9c"}
                onBlur={(e) => e.target.style.borderColor = "#2a3f3f"}
              />
            </div>

            {/* Sujet */}
            <div style={{ marginBottom: "20px" }}>
              <label style={{
                color: "#e5e7eb",
                fontSize: "0.95rem",
                fontWeight: "500",
                display: "block",
                marginBottom: "8px"
              }}>
                Sujet *
              </label>
              <select
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                disabled={status === "sending" || status === "success"}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  background: "#1a1f2e",
                  border: "1px solid #2a3f3f",
                  borderRadius: "8px",
                  color: "#e5e7eb",
                  fontSize: "1rem",
                  outline: "none",
                  transition: "border-color 0.2s",
                  boxSizing: "border-box",
                  cursor: "pointer"
                }}
                onFocus={(e) => e.target.style.borderColor = "#00ff9c"}
                onBlur={(e) => e.target.style.borderColor = "#2a3f3f"}
              >
                <option value="">-- Choisir un sujet --</option>
                <option value="Question générale">Question générale</option>
                <option value="Problème technique">Problème technique</option>
                <option value="Bug à signaler">Bug à signaler</option>
                <option value="Suggestion d'amélioration">Suggestion d'amélioration</option>
                <option value="Demande de partenariat">Demande de partenariat</option>
                <option value="Autre">Autre</option>
              </select>
            </div>

            {/* Message */}
            <div style={{ marginBottom: "25px" }}>
              <label style={{
                color: "#e5e7eb",
                fontSize: "0.95rem",
                fontWeight: "500",
                display: "block",
                marginBottom: "8px"
              }}>
                Votre message *
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Décrivez votre question ou votre problème en détail..."
                rows={8}
                disabled={status === "sending" || status === "success"}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  background: "#1a1f2e",
                  border: "1px solid #2a3f3f",
                  borderRadius: "8px",
                  color: "#e5e7eb",
                  fontSize: "1rem",
                  outline: "none",
                  transition: "border-color 0.2s",
                  resize: "vertical",
                  fontFamily: "inherit",
                  boxSizing: "border-box"
                }}
                onFocus={(e) => e.target.style.borderColor = "#00ff9c"}
                onBlur={(e) => e.target.style.borderColor = "#2a3f3f"}
              />
            </div>

            {/* Boutons */}
            <div style={{ display: "flex", gap: "15px" }}>
              <button
                type="submit"
                disabled={status === "sending" || status === "success"}
                style={{
                  flex: 1,
                  padding: "14px",
                  background: status === "sending" ? "#2a3f3f" : "#00ff9c",
                  color: status === "sending" ? "#9ca3af" : "#0b0f1a",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  fontWeight: "bold",
                  cursor: status === "sending" ? "not-allowed" : "pointer",
                  transition: "all 0.2s"
                }}
                onMouseEnter={(e) => {
                  if (status === "idle" || status === "error") {
                    e.currentTarget.style.boxShadow = "0 0 20px rgba(0,255,156,0.4)";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                {status === "sending" ? "📤 Envoi en cours..." : "📧 Envoyer le message"}
              </button>

              {status !== "success" && (
                <button
                  type="button"
                  onClick={() => navigate("/dashboard")}
                  disabled={status === "sending"}
                  style={{
                    padding: "14px 24px",
                    background: "transparent",
                    color: "#9ca3af",
                    border: "1px solid #2a3f3f",
                    borderRadius: "8px",
                    fontSize: "1rem",
                    cursor: status === "sending" ? "not-allowed" : "pointer",
                    transition: "all 0.2s"
                  }}
                  onMouseEnter={(e) => {
                    if (status !== "sending") {
                      e.currentTarget.style.borderColor = "#00ff9c";
                      e.currentTarget.style.color = "#00ff9c";
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#2a3f3f";
                    e.currentTarget.style.color = "#9ca3af";
                  }}
                >
                  Annuler
                </button>
              )}
            </div>

          </form>
        </div>

        {/* Info */}
        <div style={{
          marginTop: "30px",
          padding: "20px",
          background: "#0b0f1a",
          border: "1px solid #2a3f3f",
          borderRadius: "12px",
          textAlign: "center"
        }}>
          <p style={{ color: "#9ca3af", fontSize: "0.9rem", margin: 0 }}>
            💡 <strong style={{ color: "#e5e7eb" }}>Temps de réponse moyen :</strong> 24-48 heures<br />
            Pour les urgences, contactez-nous sur les réseaux sociaux
          </p>
        </div>

      </div>
    </div>
  );
}

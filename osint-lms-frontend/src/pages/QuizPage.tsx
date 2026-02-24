import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useThemeColors } from "../context/ThemeContext";

interface QuizTheme {
  id: string;
  title: string;
  description: string;
  icon: string;
  difficulty: "Débutant" | "Intermédiaire" | "Avancé";
  questions: number;
  duration: string;
}

const quizThemes: QuizTheme[] = [
  { id: "osint-basics", title: "OSINT - Les Fondamentaux", description: "Maîtrisez les bases de l'OSINT : méthodologie, sources ouvertes, et premiers outils.", icon: "🎯", difficulty: "Débutant", questions: 20, duration: "15 min" },
  { id: "search-techniques", title: "Techniques de Recherche Avancées", description: "Google Dorking, opérateurs booléens, et recherche inversée d'images.", icon: "🔍", difficulty: "Intermédiaire", questions: 20, duration: "15 min" },
  { id: "geolocation", title: "Géolocalisation & Géospatial", description: "Analyse d'images, métadonnées EXIF, Google Earth, et triangulation.", icon: "🌍", difficulty: "Intermédiaire", questions: 20, duration: "15 min" },
  { id: "social-media", title: "Investigations Réseaux Sociaux", description: "OSINT sur Twitter, Facebook, Instagram, LinkedIn, TikTok, et Telegram.", icon: "📱", difficulty: "Intermédiaire", questions: 20, duration: "15 min" },
  { id: "crypto-blockchain", title: "Crypto & Blockchain OSINT", description: "Analyse blockchain, wallets, transactions, et attribution d'adresses.", icon: "₿", difficulty: "Avancé", questions: 20, duration: "15 min" },
  { id: "darkweb", title: "Dark Web & Anonymat", description: "Tor, I2P, marketplaces, et techniques d'investigation sécurisées.", icon: "🕵️", difficulty: "Avancé", questions: 20, duration: "15 min" }
];

export default function QuizPage() {
  const navigate = useNavigate();
  const colors = useThemeColors();
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [showResetModal, setShowResetModal] = useState(false);

  const handleStartQuiz = (themeId: string) => navigate(`/quiz/${themeId}`);

  const handleReset = () => {
    localStorage.removeItem("quiz_results");
    localStorage.removeItem("quiz_badges");
    setShowResetModal(false);
    alert("✅ Progression des quiz réinitialisée !");
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Débutant": return "#10b981";
      case "Intermédiaire": return "#f59e0b";
      case "Avancé": return "#ef4444";
      default: return colors.accent;
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: colors.bgPrimary, paddingTop: "80px" }}>
      
      {showResetModal && (
        <>
          <div onClick={() => setShowResetModal(false)} style={{
            position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.8)", zIndex: 9998
          }} />
          <div style={{
            position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
            background: colors.bgSecondary, border: "3px solid #ef4444", borderRadius: "16px",
            padding: "40px", maxWidth: "500px", zIndex: 9999, boxShadow: "0 0 50px rgba(239,68,68,0.5)"
          }}>
            <div style={{ fontSize: "4rem", textAlign: "center", marginBottom: "20px" }}>⚠️</div>
            <h2 style={{ color: "#ef4444", fontSize: "1.8rem", textAlign: "center", marginBottom: "15px" }}>
              Réinitialiser les quiz
            </h2>
            <p style={{ color: colors.textSecondary, textAlign: "center", marginBottom: "30px", lineHeight: "1.6" }}>
              Cette action va <strong style={{ color: "#ef4444" }}>supprimer DÉFINITIVEMENT</strong> tous vos résultats et badges de quiz !
            </p>
            <div style={{ display: "flex", gap: "15px" }}>
              <button onClick={() => setShowResetModal(false)} style={{
                flex: 1, padding: "14px", background: "transparent", border: `2px solid ${colors.border}`,
                borderRadius: "8px", color: colors.textPrimary, fontSize: "1rem", fontWeight: "600", cursor: "pointer"
              }}>Annuler</button>
              <button onClick={handleReset} style={{
                flex: 1, padding: "14px", background: "#ef4444", border: "none",
                borderRadius: "8px", color: "#fff", fontSize: "1rem", fontWeight: "600", cursor: "pointer"
              }}>Confirmer</button>
            </div>
          </div>
        </>
      )}

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 20px" }}>
        
        <div style={{ textAlign: "center", marginBottom: "60px" }}>
          <h1 style={{ fontSize: "2.5rem", fontWeight: "700", color: colors.textPrimary, marginBottom: "15px" }}>
            🎓 Quiz OSINT Interactifs
          </h1>
          <p style={{ fontSize: "1.1rem", color: colors.textSecondary, maxWidth: "700px", margin: "0 auto" }}>
            Testez vos connaissances avec nos quiz chronométrés. 20 questions par thème, 30 secondes par question.
            Obtenez un badge selon votre score !
          </p>
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: "30px", marginBottom: "50px", flexWrap: "wrap" }}>
          {[
            { icon: "🥉", label: "Bronze", score: "≥ 60%", color: "#cd7f32" },
            { icon: "🥈", label: "Argent", score: "≥ 80%", color: "#c0c0c0" },
            { icon: "🥇", label: "Or", score: "≥ 95%", color: "#ffd700" }
          ].map((b, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{ fontSize: "2rem", marginBottom: "5px" }}>{b.icon}</div>
              <div style={{ color: colors.textSecondary, fontSize: "0.9rem" }}>{b.label}</div>
              <div style={{ color: b.color, fontWeight: "600" }}>{b.score}</div>
            </div>
          ))}
        </div>

        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "30px", marginBottom: "50px"
        }}>
          {quizThemes.map((theme) => (
            <div key={theme.id} onClick={() => setSelectedTheme(theme.id)} style={{
                background: selectedTheme === theme.id ? `linear-gradient(135deg, ${colors.accent}15, ${colors.accent}05)` : colors.bgSecondary,
                border: `2px solid ${selectedTheme === theme.id ? colors.accent : colors.border}`,
                borderRadius: "16px", padding: "30px", cursor: "pointer", transition: "all 0.3s ease",
                boxShadow: selectedTheme === theme.id ? `0 8px 30px ${colors.accent}30` : "none"
              }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
                <div style={{ fontSize: "3rem" }}>{theme.icon}</div>
                <div style={{
                  background: getDifficultyColor(theme.difficulty), color: "#fff", padding: "6px 14px",
                  borderRadius: "20px", fontSize: "0.75rem", fontWeight: "600"
                }}>{theme.difficulty}</div>
              </div>
              <h3 style={{ fontSize: "1.4rem", fontWeight: "700", color: colors.textPrimary, marginBottom: "12px" }}>
                {theme.title}
              </h3>
              <p style={{ color: colors.textSecondary, fontSize: "0.95rem", lineHeight: "1.6", marginBottom: "20px" }}>
                {theme.description}
              </p>
              <div style={{
                display: "flex", gap: "20px", marginBottom: "25px", paddingTop: "15px", borderTop: `1px solid ${colors.border}`
              }}>
                <div>
                  <div style={{ color: colors.textSecondary, fontSize: "0.8rem", marginBottom: "4px" }}>Questions</div>
                  <div style={{ color: colors.textPrimary, fontWeight: "600", fontSize: "1.1rem" }}>{theme.questions}</div>
                </div>
                <div>
                  <div style={{ color: colors.textSecondary, fontSize: "0.8rem", marginBottom: "4px" }}>Durée max</div>
                  <div style={{ color: colors.textPrimary, fontWeight: "600", fontSize: "1.1rem" }}>{theme.duration}</div>
                </div>
              </div>
              <button onClick={(e) => { e.stopPropagation(); handleStartQuiz(theme.id); }} style={{
                  width: "100%", padding: "14px", background: selectedTheme === theme.id ? colors.accent : "transparent",
                  color: selectedTheme === theme.id ? "#fff" : colors.accent, border: `2px solid ${colors.accent}`,
                  borderRadius: "10px", fontSize: "1rem", fontWeight: "600", cursor: "pointer"
                }}>
                🚀 Démarrer le quiz
              </button>
            </div>
          ))}
        </div>

        <div style={{
          background: colors.bgSecondary, border: "2px solid #ef4444",
          borderRadius: "12px", padding: "25px", textAlign: "center"
        }}>
          <h3 style={{ fontSize: "1.2rem", fontWeight: "600", color: "#ef4444", marginBottom: "10px" }}>
            ⚠️ Zone Dangereuse
          </h3>
          <p style={{ color: colors.textSecondary, marginBottom: "20px", fontSize: "0.95rem" }}>
            Réinitialiser votre progression supprimera TOUS vos résultats de quiz.
          </p>
          <button onClick={() => setShowResetModal(true)} style={{
            padding: "14px 28px", background: "transparent", border: "2px solid #ef4444",
            borderRadius: "8px", color: "#ef4444", fontSize: "1rem", fontWeight: "600", cursor: "pointer"
          }}>🔄 Réinitialiser</button>
        </div>

        <div style={{
          marginTop: "60px", background: `${colors.accent}10`, border: `1px solid ${colors.accent}30`,
          borderRadius: "12px", padding: "25px", textAlign: "center"
        }}>
          <div style={{ fontSize: "1.5rem", marginBottom: "10px" }}>💡</div>
          <h3 style={{ color: colors.textPrimary, fontSize: "1.2rem", fontWeight: "600", marginBottom: "10px" }}>
            Comment ça marche ?
          </h3>
          <p style={{ color: colors.textSecondary, lineHeight: "1.7", maxWidth: "800px", margin: "0 auto" }}>
            Chaque quiz contient <strong>20 questions</strong> (QCM et Vrai/Faux). Vous disposez de <strong>30 secondes par question</strong> et 
            <strong>15 minutes au total</strong>. Votre score détermine le badge obtenu : Bronze (≥60%), Argent (≥80%), Or (≥95%). 
            Les badges et XP sont automatiquement ajoutés à votre progression !
          </p>
        </div>
      </div>
    </div>
  );
}

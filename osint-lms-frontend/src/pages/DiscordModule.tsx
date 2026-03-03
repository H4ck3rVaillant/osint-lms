import { useState } from "react";
import { useThemeColors } from "../context/ThemeContext";

export default function DiscordModule() {
  const colors = useThemeColors();
  const [activeTab, setActiveTab] = useState("theory");
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

  const BADGE_KEY = "badge_module_discord";

  const tabs = [
    { id: "theory", label: "📖 Théorie", icon: "📚" },
    { id: "tools", label: "🔧 Outils", icon: "⚙️" },
    { id: "exercises", label: "💡 Exercices", icon: "✍️" },
    { id: "quiz", label: "🎯 Quiz", icon: "✅" },
  ];

  const quizQuestions = [
    {
      id: 1,
      question: "Qu'est-ce que Discord ?",
      options: [
        "Un moteur de recherche pour objets connectés",
        "Un outil de scan de ports",
        "Un VPN gratuit",
        "Un antivirus"
      ],
      correct: 0
    },
    {
      id: 2,
      question: "Quelle commande Discord permet de filtrer par pays ?",
      options: [
        "country:US",
        "location:US",
        "geo:US",
        "nation:US"
      ],
      correct: 0
    },
    {
      id: 3,
      question: "Quel port est utilisé par défaut pour les webcams IP ?",
      options: [
        "80",
        "443",
        "8080",
        "554"
      ],
      correct: 0
    },
    {
      id: 4,
      question: "Que signifie le filtre 'product:' dans Discord ?",
      options: [
        "Recherche par nom de produit/service",
        "Recherche par prix",
        "Recherche par fabricant",
        "Recherche par version"
      ],
      correct: 0
    },
    {
      id: 5,
      question: "Discord peut-il détecter des appareils IoT vulnérables ?",
      options: [
        "Oui, c'est une de ses fonctions principales",
        "Non, seulement les sites web",
        "Oui, mais uniquement avec un compte payant",
        "Non, il ne fait que scanner les ports"
      ],
      correct: 0
    }
  ];

  const handleQuizSubmit = () => {
    const score = getScore();
    setShowResults(true);
    
    // Débloquer le badge si score >= 4
    if (score >= 4) {
      localStorage.setItem(BADGE_KEY, "true");
      console.log("✅ Badge Discord débloqué !");
    }
  };

  const handleReset = () => {
    setQuizAnswers({});
    setShowResults(false);
    setShowResetModal(false);
    localStorage.removeItem(BADGE_KEY);
  };

  const getScore = () => {
    let correct = 0;
    quizQuestions.forEach(q => {
      if (quizAnswers[q.id] === q.correct.toString()) {
        correct++;
      }
    });
    return correct;
  };

  const isBadgeUnlocked = localStorage.getItem(BADGE_KEY) === "true";

  return (
    <div style={{
      minHeight: "100vh",
      background: colors.bgPrimary,
      paddingTop: "80px",
    }}>
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "40px 20px",
      }}>
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div style={{ fontSize: "4rem", marginBottom: "15px" }}>🎮</div>
          <h1 style={{
            fontSize: "2.5rem",
            fontWeight: "700",
            color: colors.textPrimary,
            marginBottom: "15px",
          }}>
            Module Discord OSINT
          </h1>
          <p style={{
            fontSize: "1.1rem",
            color: colors.textSecondary,
            maxWidth: "700px",
            margin: "0 auto 15px",
          }}>
            Maîtrisez Discord, le moteur de recherche pour objets connectés et appareils IoT
          </p>
          
          {isBadgeUnlocked && (
            <div style={{
              display: "inline-block",
              padding: "8px 20px",
              background: colors.accent + "20",
              border: `2px solid ${colors.accent}`,
              borderRadius: "20px",
              color: colors.accent,
              fontWeight: "600",
              fontSize: "0.9rem",
            }}>
              ✓ Badge débloqué
            </div>
          )}
        </div>

        <div style={{
          display: "flex",
          justifyContent: "center",
          gap: "15px",
          marginBottom: "40px",
          flexWrap: "wrap",
        }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: "12px 24px",
                background: activeTab === tab.id ? colors.accent : colors.bgSecondary,
                color: activeTab === tab.id ? "#020617" : colors.textPrimary,
                border: `2px solid ${activeTab === tab.id ? colors.accent : colors.border}`,
                borderRadius: "12px",
                fontSize: "1rem",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        <div style={{
          background: colors.bgSecondary,
          border: `1px solid ${colors.border}`,
          borderRadius: "12px",
          padding: "40px",
        }}>
          {activeTab === "theory" && (
            <div>
              <h2 style={{ color: colors.textPrimary, fontSize: "2rem", marginBottom: "20px" }}>
                📖 Qu'est-ce que Discord ?
              </h2>
              <p style={{ color: colors.textSecondary, lineHeight: "1.8" }}>
                Discord est le moteur de recherche pour objets connectés...
              </p>
            </div>
          )}

          {activeTab === "tools" && (
            <div>
              <h2 style={{ color: colors.textPrimary, fontSize: "2rem", marginBottom: "20px" }}>
                🔧 Outils Discord
              </h2>
              <p style={{ color: colors.textSecondary, lineHeight: "1.8" }}>
                Commandes et filtres...
              </p>
            </div>
          )}

          {activeTab === "exercises" && (
            <div>
              <h2 style={{ color: colors.textPrimary, fontSize: "2rem", marginBottom: "20px" }}>
                💡 Exercices Pratiques
              </h2>
              <p style={{ color: colors.textSecondary, lineHeight: "1.8" }}>
                Exercices guidés...
              </p>
            </div>
          )}

          {activeTab === "quiz" && (
            <div>
              <h2 style={{ color: colors.textPrimary, fontSize: "2rem", marginBottom: "20px" }}>
                🎯 Quiz de validation
              </h2>

              {quizQuestions.map((q, index) => (
                <div key={q.id} style={{ background: colors.bgPrimary, padding: "20px", borderRadius: "12px", marginBottom: "20px" }}>
                  <h3 style={{ color: colors.textPrimary, fontSize: "1.1rem", marginBottom: "15px" }}>
                    {index + 1}. {q.question}
                  </h3>
                  {q.options.map((option, optIndex) => (
                    <label
                      key={optIndex}
                      style={{
                        display: "block",
                        padding: "12px",
                        marginBottom: "8px",
                        background: quizAnswers[q.id] === optIndex.toString() ? colors.accent + "30" : colors.bgSecondary,
                        border: `2px solid ${quizAnswers[q.id] === optIndex.toString() ? colors.accent : colors.border}`,
                        borderRadius: "8px",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                      }}
                    >
                      <input
                        type="radio"
                        name={`question-${q.id}`}
                        value={optIndex}
                        checked={quizAnswers[q.id] === optIndex.toString()}
                        onChange={(e) => setQuizAnswers({ ...quizAnswers, [q.id]: e.target.value })}
                        style={{ marginRight: "10px" }}
                      />
                      <span style={{ color: colors.textPrimary }}>{option}</span>
                    </label>
                  ))}
                </div>
              ))}

              <div style={{ display: "flex", gap: "15px" }}>
                <button
                  onClick={handleQuizSubmit}
                  disabled={Object.keys(quizAnswers).length !== quizQuestions.length}
                  style={{
                    padding: "15px 40px",
                    background: Object.keys(quizAnswers).length === quizQuestions.length ? colors.accent : colors.border,
                    color: "#020617",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "1.1rem",
                    fontWeight: "600",
                    cursor: Object.keys(quizAnswers).length === quizQuestions.length ? "pointer" : "not-allowed",
                  }}
                >
                  Valider le quiz
                </button>

                <button
                  onClick={() => setShowResetModal(true)}
                  style={{
                    padding: "15px 40px",
                    background: "#0b0f1a",
                    color: "#00ff9c",
                    border: "2px solid #00ff9c",
                    borderRadius: "8px",
                    fontSize: "1.1rem",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#00ff9c";
                    e.currentTarget.style.color = "#0b0f1a";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#0b0f1a";
                    e.currentTarget.style.color = "#00ff9c";
                  }}
                >
                  🔄 Réinitialiser
                </button>
              </div>

              {showResults && (
                <div style={{
                  marginTop: "30px",
                  padding: "25px",
                  background: getScore() >= 4 ? colors.accent + "20" : "#ef444420",
                  border: `2px solid ${getScore() >= 4 ? colors.accent : "#ef4444"}`,
                  borderRadius: "12px",
                }}>
                  <h3 style={{ color: getScore() >= 4 ? colors.accent : "#ef4444", fontSize: "1.5rem", marginBottom: "10px" }}>
                    {getScore() >= 4 ? "✅ Félicitations !" : "❌ Pas encore..."}
                  </h3>
                  <p style={{ color: colors.textPrimary, fontSize: "1.2rem" }}>
                    Score : {getScore()}/{quizQuestions.length}
                  </p>
                  <p style={{ color: colors.textSecondary, marginTop: "10px" }}>
                    {getScore() >= 4 
                      ? "Vous avez validé ce module ! Badge débloqué ! 🎉" 
                      : "Révisez le module et réessayez."}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {showResetModal && (
        <>
          <div 
            onClick={() => setShowResetModal(false)}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0, 0, 0, 0.8)",
              zIndex: 9998,
            }} 
          />
          <div style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "#0b0f1a",
            border: "3px solid #00ff9c",
            borderRadius: "12px",
            padding: "40px",
            maxWidth: "500px",
            width: "90%",
            zIndex: 9999,
            boxShadow: "0 0 40px rgba(0, 255, 156, 0.5)",
          }}>
            <h3 style={{ color: "#00ff9c", fontSize: "1.5rem", marginBottom: "15px", textAlign: "center" }}>
              ⚠️ Réinitialiser le Quiz
            </h3>
            <p style={{ color: "#9ca3af", marginBottom: "30px", textAlign: "center", lineHeight: "1.6" }}>
              Êtes-vous sûr de vouloir réinitialiser ce quiz ? Toutes vos réponses et le badge seront effacés.
            </p>
            <div style={{ display: "flex", gap: "15px", justifyContent: "center" }}>
              <button
                onClick={() => setShowResetModal(false)}
                style={{
                  padding: "12px 30px",
                  background: "transparent",
                  color: "#9ca3af",
                  border: "2px solid #2a3f3f",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                Annuler
              </button>
              <button
                onClick={handleReset}
                style={{
                  padding: "12px 30px",
                  background: "#00ff9c",
                  color: "#0b0f1a",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                Confirmer
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

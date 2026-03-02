import { useState } from "react";
import { useThemeColors } from "../context/ThemeContext";

export default function DiscordModule() {
  const colors = useThemeColors();
  const [activeTab, setActiveTab] = useState("theory");
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

  const tabs = [
    { id: "theory", label: "📖 Théorie", icon: "📚" },
    { id: "tools", label: "🔧 Outils", icon: "⚙️" },
    { id: "exercises", label: "💡 Exercices", icon: "✍️" },
    { id: "quiz", label: "🎯 Quiz", icon: "✅" },
  ];

  const quizQuestions = [
    {
      id: 1,
      question: "Qu'est-ce qu'un serveur Discord ?",
      options: [
        "Un espace communautaire avec canaux texte et vocaux",
        "Un ordinateur de jeu en ligne",
        "Un VPN gratuit",
        "Un hébergeur de site web"
      ],
      correct: 0
    },
    {
      id: 2,
      question: "Comment rejoindre un serveur Discord public ?",
      options: [
        "Via un lien d'invitation discord.gg/CODE",
        "Il faut demander l'autorisation à Discord",
        "Uniquement via recherche Google",
        "C'est impossible"
      ],
      correct: 0
    },
    {
      id: 3,
      question: "Les messages Discord sont-ils indexés par Google ?",
      options: [
        "Non, Discord n'est pas indexé publiquement",
        "Oui, tous les messages",
        "Uniquement les serveurs publics",
        "Seulement les messages vocaux"
      ],
      correct: 0
    },
    {
      id: 4,
      question: "Quel est le format d'un Discord ID ?",
      options: [
        "Un nombre à 18 chiffres",
        "Un email",
        "Un pseudo",
        "Une adresse IP"
      ],
      correct: 0
    },
    {
      id: 5,
      question: "Peut-on récupérer des messages supprimés sur Discord ?",
      options: [
        "Oui, avec des bots présents au moment de l'envoi",
        "Non, impossible",
        "Oui, Discord les garde 30 jours",
        "Uniquement les admins"
      ],
      correct: 0
    }
  ];

  const handleQuizSubmit = () => {
    setShowResults(true);
  };

  const handleResetQuiz = () => {
    setQuizAnswers({});
    setShowResults(false);
    setShowResetModal(false);
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

        {/* HEADER */}
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
            margin: "0 auto",
          }}>
            Investigation et reconnaissance sur les serveurs Discord
          </p>
        </div>

        {/* TABS */}
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
                color: activeTab === tab.id ? "#fff" : colors.textPrimary,
                border: `2px solid ${activeTab === tab.id ? colors.accent : colors.border}`,
                borderRadius: "12px",
                fontSize: "1rem",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* CONTENT */}
        <div style={{
          background: colors.bgSecondary,
          border: `1px solid ${colors.border}`,
          borderRadius: "12px",
          padding: "40px",
        }}>

          {activeTab === "quiz" && (
            <div>
              <h2 style={{ color: colors.textPrimary, fontSize: "2rem", marginBottom: "20px" }}>
                🎯 Quiz de validation
              </h2>

              {quizQuestions.map((q, index) => (
                <div key={q.id} style={{ background: colors.bgPrimary, padding: "20px", borderRadius: "12px", marginBottom: "20px" }}>
                  <h3 style={{ color: colors.textPrimary, marginBottom: "15px" }}>
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

              {/* BUTTONS */}
              <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
                <button
                  onClick={handleQuizSubmit}
                  disabled={Object.keys(quizAnswers).length !== quizQuestions.length}
                  style={{
                    padding: "15px 40px",
                    background: Object.keys(quizAnswers).length === quizQuestions.length ? colors.accent : colors.border,
                    color: "#fff",
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
                    background: "#000",
                    color: colors.accent,
                    border: `2px solid ${colors.accent}`,
                    borderRadius: "8px",
                    fontSize: "1.1rem",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  🔄 Réinitialiser
                </button>
              </div>

              {/* RESULTS */}
              {showResults && (
                <div style={{
                  marginTop: "30px",
                  padding: "25px",
                  background: getScore() >= 4 ? colors.accent + "20" : "#ef444420",
                  border: `2px solid ${getScore() >= 4 ? colors.accent : "#ef4444"}`,
                  borderRadius: "12px",
                }}>
                  <h3 style={{ color: getScore() >= 4 ? colors.accent : "#ef4444", fontSize: "1.5rem" }}>
                    {getScore() >= 4 ? "✅ Félicitations !" : "❌ Pas encore..."}
                  </h3>
                  <p style={{ color: colors.textPrimary }}>
                    Score : {getScore()}/{quizQuestions.length}
                  </p>
                </div>
              )}

              {/* RESET MODAL */}
              {showResetModal && (
                <div style={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  background: "rgba(0,0,0,0.85)",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  zIndex: 1000,
                }}>
                  <div style={{
                    background: "#0f0f0f",
                    border: `2px solid ${colors.accent}`,
                    borderRadius: "12px",
                    padding: "40px",
                    textAlign: "center",
                    boxShadow: `0 0 25px ${colors.accent}55`,
                  }}>
                    <h3 style={{ color: colors.accent, marginBottom: "20px" }}>
                      ⚠️ Réinitialiser le quiz ?
                    </h3>

                    <p style={{ color: "#ccc", marginBottom: "30px" }}>
                      Toutes vos réponses seront supprimées.
                    </p>

                    <div style={{ display: "flex", gap: "15px", justifyContent: "center" }}>
                      <button
                        onClick={handleResetQuiz}
                        style={{
                          padding: "12px 25px",
                          background: colors.accent,
                          color: "#000",
                          border: "none",
                          borderRadius: "8px",
                          fontWeight: "600",
                          cursor: "pointer",
                        }}
                      >
                        Oui, reset
                      </button>

                      <button
                        onClick={() => setShowResetModal(false)}
                        style={{
                          padding: "12px 25px",
                          background: "#000",
                          color: "#fff",
                          border: "1px solid #444",
                          borderRadius: "8px",
                          cursor: "pointer",
                        }}
                      >
                        Annuler
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
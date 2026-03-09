import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useThemeColors } from "../context/ThemeContext";

export default function CasChronologie() {
  const colors = useThemeColors();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"theory" | "quiz">("theory");
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizResult, setQuizResult] = useState<{ score: number; answers: number[] } | null>(null);

  const badgeKey = "badge_case_chrono";
  const quizStorageKey = `quiz_${badgeKey}_answers`;
  const resultStorageKey = `quiz_${badgeKey}_result`;

  const quizQuestions = [
    {
      question: "Pourquoi est-il crucial de vérifier les timestamps lors d'une reconstruction chronologique ?",
      options: [
        "Pour compter le nombre de publications",
        "Pour distinguer UTC et horaire local",
        "Pour supprimer les doublons",
        "Pour accélérer la recherche"
      ],
      correct: 1
    },
    {
      question: "Quelle erreur fréquente compromet gravement une chronologie ?",
      options: [
        "Utiliser trop de sources différentes",
        "Prendre des contenus repostés comme originaux",
        "Vérifier systématiquement les données météo",
        "Documenter toutes les sources"
      ],
      correct: 1
    },
    {
      question: "Avec quoi doit-on aligner les timestamps pour valider une chronologie ?",
      options: [
        "Les titres des articles de presse",
        "Les données satellites et météo",
        "Les commentaires des utilisateurs",
        "Les statistiques de partages"
      ],
      correct: 1
    }
  ];

  useEffect(() => {
    const savedAnswers = localStorage.getItem(quizStorageKey);
    const savedResult = localStorage.getItem(resultStorageKey);
    
    if (savedAnswers) {
      setQuizAnswers(JSON.parse(savedAnswers));
    }
    
    if (savedResult) {
      setQuizResult(JSON.parse(savedResult));
    }
  }, []);

  const handleTabChange = (tab: "theory" | "quiz") => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setActiveTab(tab);
  };

  const handleAnswerChange = (questionIndex: number, answerIndex: number) => {
    const newAnswers = { ...quizAnswers, [questionIndex]: answerIndex };
    setQuizAnswers(newAnswers);
    localStorage.setItem(quizStorageKey, JSON.stringify(newAnswers));
  };

  const validateQuiz = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    
    const userAnswers = Object.keys(quizAnswers).map(k => quizAnswers[parseInt(k)]);
    const correctAnswers = quizQuestions.map(q => q.correct);
    const score = userAnswers.filter((ans, idx) => ans === correctAnswers[idx]).length;
    
    const result = { score, answers: userAnswers };
    setQuizResult(result);
    localStorage.setItem(resultStorageKey, JSON.stringify(result));
    
    if (score >= 2) {
      localStorage.setItem(badgeKey, "true");
    }
  };

  const resetQuiz = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setQuizAnswers({});
    setQuizResult(null);
    localStorage.removeItem(quizStorageKey);
    localStorage.removeItem(resultStorageKey);
    localStorage.removeItem(badgeKey);
  };

  const isBadgeUnlocked = quizResult && quizResult.score >= 2;

  return (
    <main style={{ paddingTop: "80px", padding: "40px", maxWidth: "900px", margin: "0 auto" }}>
      <h1 style={{ color: colors.accent, marginBottom: "20px", fontSize: "2rem" }}>
        🧭 Cas réel – Chronologie d'événements
      </h1>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "30px", borderBottom: `2px solid ${colors.border}` }}>
        <button
          onClick={() => handleTabChange("theory")}
          style={{
            flex: 1,
            padding: "15px 30px",
            background: activeTab === "theory" ? colors.accent : "transparent",
            color: activeTab === "theory" ? colors.bgPrimary : colors.textSecondary,
            border: "none",
            borderBottom: activeTab === "theory" ? `3px solid ${colors.accent}` : "3px solid transparent",
            fontSize: "1.1rem",
            fontWeight: "bold",
            cursor: "pointer",
            transition: "all 0.3s ease"
          }}
        >
          📖 Théorie
        </button>
        <button
          onClick={() => handleTabChange("quiz")}
          style={{
            flex: 1,
            padding: "15px 30px",
            background: activeTab === "quiz" ? colors.accent : "transparent",
            color: activeTab === "quiz" ? colors.bgPrimary : colors.textSecondary,
            border: "none",
            borderBottom: activeTab === "quiz" ? `3px solid ${colors.accent}` : "3px solid transparent",
            fontSize: "1.1rem",
            fontWeight: "bold",
            cursor: "pointer",
            transition: "all 0.3s ease"
          }}
        >
          🎯 Quiz
        </button>
      </div>

      {/* Théorie */}
      {activeTab === "theory" && (
        <section style={{ color: colors.textSecondary, lineHeight: 1.7 }}>
          <h2 style={{ color: colors.accent }}>Contexte</h2>
          <p>
            Reconstruction temporelle d'un événement à partir de sources ouvertes
            (réseaux sociaux, médias, images satellites, vidéos).
          </p>

          <h2 style={{ color: colors.accent, marginTop: "25px" }}>Méthodologie</h2>
          <ul>
            <li>Collecte des premières publications</li>
            <li>Corrélation temporelle multi-plateformes</li>
            <li>Vérification des timestamps (UTC / local)</li>
            <li>Alignement avec données satellites et météo</li>
          </ul>

          <h2 style={{ color: colors.accent, marginTop: "25px" }}>Résultat</h2>
          <p>
            Construction d'une timeline fiable permettant d'infirmer ou confirmer
            une version officielle.
          </p>

          <h2 style={{ color: colors.accent, marginTop: "25px" }}>Erreurs fréquentes</h2>
          <ul>
            <li>Fuseaux horaires ignorés</li>
            <li>Contenus repostés pris comme originaux</li>
            <li>Données météo non vérifiées</li>
          </ul>
        </section>
      )}

      {/* Quiz */}
      {activeTab === "quiz" && (
        <div style={{ color: colors.textSecondary }}>
          <h2 style={{ color: colors.accent, marginBottom: "20px" }}>
            🎯 Quiz de validation - Chronologie d'événements
          </h2>
          <p style={{ marginBottom: "30px", fontSize: "1.05rem" }}>
            Répondez correctement à au moins 2 questions sur 3 pour débloquer le badge.
          </p>

          {quizQuestions.map((q, idx) => (
            <div key={idx} style={{
              background: colors.bgSecondary,
              padding: "25px",
              borderRadius: "12px",
              marginBottom: "20px",
              border: `1px solid ${colors.border}`
            }}>
              <h3 style={{ color: colors.accent, marginBottom: "20px", fontSize: "1.1rem" }}>
                Question {idx + 1}: {q.question}
              </h3>

              {q.options.map((option, optIdx) => {
                const isSelected = quizAnswers[idx] === optIdx;
                const isCorrect = optIdx === q.correct;
                const showResult = quizResult !== null;

                let bgColor = colors.bgPrimary;
                let borderColor = colors.border;
                let icon = "";

                if (showResult) {
                  if (quizResult.answers[idx] === optIdx) {
                    if (isCorrect) {
                      bgColor = "#00ff9c20";
                      borderColor = colors.accent;
                      icon = "✅ ";
                    } else {
                      bgColor = "#ef444420";
                      borderColor = "#ef4444";
                      icon = "❌ ";
                    }
                  } else if (isCorrect) {
                    borderColor = colors.accent;
                    icon = "✅ ";
                  }
                } else if (isSelected) {
                  bgColor = colors.accent + "20";
                  borderColor = colors.accent;
                }

                return (
                  <label
                    key={optIdx}
                    style={{
                      display: "block",
                      padding: "15px 20px",
                      marginBottom: "12px",
                      background: bgColor,
                      border: `2px solid ${borderColor}`,
                      borderRadius: "8px",
                      cursor: showResult ? "default" : "pointer",
                      transition: "all 0.3s ease"
                    }}
                  >
                    <input
                      type="radio"
                      name={`question-${idx}`}
                      checked={isSelected}
                      onChange={() => !showResult && handleAnswerChange(idx, optIdx)}
                      disabled={showResult}
                      style={{ marginRight: "12px" }}
                    />
                    <span style={{ color: colors.textPrimary, fontSize: "1rem" }}>
                      {icon}{option}
                    </span>
                  </label>
                );
              })}
            </div>
          ))}

          {/* Boutons */}
          <div style={{ marginTop: "40px", display: "flex", gap: "20px", flexWrap: "wrap" }}>
            {!quizResult ? (
              <button
                onClick={validateQuiz}
                disabled={Object.keys(quizAnswers).length !== quizQuestions.length}
                style={{
                  padding: "16px 40px",
                  background: Object.keys(quizAnswers).length === quizQuestions.length ? colors.accent : colors.border,
                  color: colors.bgPrimary,
                  border: "none",
                  borderRadius: "12px",
                  fontSize: "1.1rem",
                  fontWeight: "bold",
                  cursor: Object.keys(quizAnswers).length === quizQuestions.length ? "pointer" : "not-allowed",
                  opacity: Object.keys(quizAnswers).length === quizQuestions.length ? 1 : 0.5
                }}
              >
                Valider le quiz
              </button>
            ) : (
              <>
                <div style={{
                  padding: "20px 30px",
                  background: isBadgeUnlocked ? colors.accent + "20" : "#ef444420",
                  border: `2px solid ${isBadgeUnlocked ? colors.accent : "#ef4444"}`,
                  borderRadius: "12px",
                  flex: 1
                }}>
                  <div style={{ fontSize: "1.5rem", marginBottom: "10px" }}>
                    {isBadgeUnlocked ? "🏆" : "❌"}
                  </div>
                  <div style={{ color: colors.textPrimary, fontSize: "1.2rem", fontWeight: "bold", marginBottom: "8px" }}>
                    Score: {quizResult.score}/3
                  </div>
                  <div style={{ color: colors.textSecondary, fontSize: "0.95rem" }}>
                    {isBadgeUnlocked 
                      ? "✅ Badge débloqué !" 
                      : "❌ Il faut au moins 2/3 pour débloquer le badge"}
                  </div>
                </div>

                <button
                  onClick={resetQuiz}
                  style={{
                    padding: "16px 40px",
                    background: colors.bgSecondary,
                    color: colors.accent,
                    border: `2px solid ${colors.accent}`,
                    borderRadius: "12px",
                    fontSize: "1.1rem",
                    fontWeight: "bold",
                    cursor: "pointer"
                  }}
                >
                  🔄 Refaire le quiz
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div style={{ marginTop: "50px", display: "flex", gap: "20px", paddingTop: "30px", borderTop: `1px solid ${colors.border}` }}>
        <button 
          onClick={() => { window.scrollTo({ top: 0, behavior: "smooth" }); navigate("/etudes-osint"); }}
          style={{
            padding: "14px 28px",
            background: colors.bgSecondary,
            color: colors.accent,
            border: `2px solid ${colors.accent}`,
            borderRadius: "10px",
            fontSize: "1rem",
            fontWeight: "600",
            cursor: "pointer"
          }}
        >
          ⬅ Retour aux cas
        </button>

        <button 
          onClick={() => { window.scrollTo({ top: 0, behavior: "smooth" }); navigate("/cas/final"); }}
          style={{
            padding: "14px 28px",
            background: colors.bgSecondary,
            color: colors.accent,
            border: `2px solid ${colors.accent}`,
            borderRadius: "10px",
            fontSize: "1rem",
            fontWeight: "600",
            cursor: "pointer"
          }}
        >
          Cas suivant ➡
        </button>
      </div>
    </main>
  );
}

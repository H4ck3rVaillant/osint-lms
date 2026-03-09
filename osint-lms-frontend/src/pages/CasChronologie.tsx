import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useThemeColors } from "../context/ThemeContext";

export default function CasChronologie() {
  const navigate = useNavigate();
  const colors = useThemeColors();
  const [activeTab, setActiveTab] = useState("theory");
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);

  const BADGE_KEY = "badge_case_chrono";
  const QUIZ_ANSWERS_KEY = "quiz_case_chrono_answers";
  const QUIZ_COMPLETED_KEY = "quiz_case_chrono_completed";

  const quizQuestions = [
    {
      id: 1,
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
      id: 2,
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
      id: 3,
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
    const savedAnswers = localStorage.getItem(QUIZ_ANSWERS_KEY);
    const quizCompleted = localStorage.getItem(QUIZ_COMPLETED_KEY);
    
    if (savedAnswers) {
      setQuizAnswers(JSON.parse(savedAnswers));
    }
    
    if (quizCompleted === "true") {
      setShowResults(true);
    }
  }, []);

  useEffect(() => {
    if (Object.keys(quizAnswers).length > 0) {
      localStorage.setItem(QUIZ_ANSWERS_KEY, JSON.stringify(quizAnswers));
    }
  }, [quizAnswers]);

  const handleQuizSubmit = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    const score = getScore();
    setShowResults(true);
    localStorage.setItem(QUIZ_COMPLETED_KEY, "true");
    
    if (score >= 2) {
      localStorage.setItem(BADGE_KEY, "true");
    }
  };

  const handleResetQuiz = () => {
    setQuizAnswers({});
    setShowResults(false);
    localStorage.removeItem(QUIZ_ANSWERS_KEY);
    localStorage.removeItem(QUIZ_COMPLETED_KEY);
    localStorage.removeItem(BADGE_KEY);
  };

  const getScore = () => {
    let correct = 0;
    quizQuestions.forEach((q) => {
      if (quizAnswers[q.id] === q.correct.toString()) correct++;
    });
    return correct;
  };

  const returnToEtudes = () => {
    navigate("/etudes-osint");
  };

  const tabs = [
    { id: "theory", label: "📖 Théorie", icon: "📚" },
    { id: "quiz", label: "🎯 Quiz", icon: "✅" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: colors.bgPrimary, paddingTop: "80px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 20px" }}>
        
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div style={{ fontSize: "4rem", marginBottom: "15px" }}>🧭</div>
          <h1 style={{ fontSize: "2.5rem", fontWeight: "700", color: colors.textPrimary, marginBottom: "15px" }}>
            Cas réel – Chronologie d'événements
          </h1>
          <p style={{ fontSize: "1.1rem", color: colors.textSecondary, maxWidth: "700px", margin: "0 auto" }}>
            Reconstruction temporelle d'un événement à partir de sources ouvertes
          </p>
          {localStorage.getItem(BADGE_KEY) === "true" && (
            <div style={{ marginTop: "15px", display: "inline-block", padding: "8px 20px", background: colors.accent + "20", border: `2px solid ${colors.accent}`, borderRadius: "20px", color: colors.accent, fontWeight: "600", fontSize: "0.9rem" }}>
              ✓ Badge débloqué
            </div>
          )}
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: "15px", marginBottom: "40px", flexWrap: "wrap" }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: "15px 40px",
                background: activeTab === tab.id ? colors.accent : colors.bgSecondary,
                color: activeTab === tab.id ? "#020617" : colors.textSecondary,
                border: activeTab === tab.id ? "none" : `2px solid ${colors.border}`,
                borderRadius: "12px",
                fontSize: "1.1rem",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div style={{ background: colors.bgSecondary, borderRadius: "16px", padding: "40px", boxShadow: "0 4px 20px rgba(0,0,0,0.3)" }}>
          {activeTab === "theory" && (
            <div>
              <h2 style={{ color: colors.accent, fontSize: "1.8rem", marginBottom: "20px" }}>🧭 Contexte</h2>
              <p style={{ color: colors.textSecondary, fontSize: "1.05rem", lineHeight: "1.8", marginBottom: "25px" }}>
                Reconstruction temporelle d'un événement à partir de sources ouvertes
                (réseaux sociaux, médias, images satellites, vidéos).
              </p>

              <h3 style={{ color: colors.accent, fontSize: "1.5rem", marginBottom: "15px", marginTop: "30px" }}>Méthodologie</h3>
              <ul style={{ color: colors.textSecondary, lineHeight: "1.8", marginLeft: "20px", marginBottom: "25px" }}>
                <li>Collecte des premières publications</li>
                <li>Corrélation temporelle multi-plateformes</li>
                <li>Vérification des timestamps (UTC / local)</li>
                <li>Alignement avec données satellites et météo</li>
              </ul>

              <h3 style={{ color: colors.accent, fontSize: "1.5rem", marginBottom: "15px", marginTop: "30px" }}>Résultat</h3>
              <p style={{ color: colors.textSecondary, fontSize: "1.05rem", lineHeight: "1.8", marginBottom: "25px" }}>
                Construction d'une timeline fiable permettant d'infirmer ou confirmer
                une version officielle.
              </p>

              <h3 style={{ color: colors.accent, fontSize: "1.5rem", marginBottom: "15px", marginTop: "30px" }}>Erreurs fréquentes</h3>
              <ul style={{ color: colors.textSecondary, lineHeight: "1.8", marginLeft: "20px", marginBottom: "25px" }}>
                <li>Fuseaux horaires ignorés</li>
                <li>Contenus repostés pris comme originaux</li>
                <li>Données météo non vérifiées</li>
              </ul>
            </div>
          )}

          {activeTab === "quiz" && (
            <div>
              <h2 style={{ color: colors.textPrimary, fontSize: "2rem", marginBottom: "20px" }}>🎯 Quiz de validation</h2>
              <p style={{ color: colors.textSecondary, marginBottom: "30px" }}>
                Répondez aux 3 questions pour valider vos connaissances. Badge débloqué si score ≥ 2/3.
              </p>

              {!showResults && (
                <>
                  {quizQuestions.map((q, index) => (
                    <div key={q.id} style={{ background: colors.bgPrimary, padding: "20px", borderRadius: "12px", marginBottom: "20px" }}>
                      <h3 style={{ color: colors.textPrimary, fontSize: "1.1rem", marginBottom: "15px" }}>
                        {index + 1}. {q.question}
                      </h3>
                      {q.options.map((option, optIndex) => (
                        <label key={optIndex} style={{ display: "block", padding: "12px", marginBottom: "8px", background: quizAnswers[q.id] === optIndex.toString() ? colors.accent + "30" : colors.bgSecondary, border: `2px solid ${quizAnswers[q.id] === optIndex.toString() ? colors.accent : colors.border}`, borderRadius: "8px", cursor: "pointer", transition: "all 0.3s ease" }}>
                          <input type="radio" name={`question-${q.id}`} value={optIndex} checked={quizAnswers[q.id] === optIndex.toString()} onChange={(e) => setQuizAnswers({ ...quizAnswers, [q.id]: e.target.value })} style={{ marginRight: "10px" }} />
                          <span style={{ color: colors.textPrimary }}>{option}</span>
                        </label>
                      ))}
                    </div>
                  ))}

                  <button onClick={handleQuizSubmit} disabled={Object.keys(quizAnswers).length !== quizQuestions.length} style={{ padding: "15px 40px", background: Object.keys(quizAnswers).length === quizQuestions.length ? colors.accent : colors.border, color: "#020617", border: "none", borderRadius: "8px", fontSize: "1.1rem", fontWeight: "600", cursor: Object.keys(quizAnswers).length === quizQuestions.length ? "pointer" : "not-allowed" }}>
                    Valider le quiz
                  </button>
                </>
              )}

              {showResults && (
                <div>
                  <div style={{ marginBottom: "30px", padding: "25px", background: getScore() >= 2 ? colors.accent + "20" : "#ef444420", border: `2px solid ${getScore() >= 2 ? colors.accent : "#ef4444"}`, borderRadius: "12px" }}>
                    <h3 style={{ color: getScore() >= 2 ? colors.accent : "#ef4444", fontSize: "1.5rem", marginBottom: "15px" }}>
                      {getScore() >= 2 ? "✅ Badge débloqué !" : "❌ Réessayez"}
                    </h3>
                    <p style={{ color: colors.textPrimary, fontSize: "1.2rem", marginBottom: "15px" }}>
                      Score : {getScore()}/{quizQuestions.length}
                    </p>
                    
                    <div style={{ display: "flex", gap: "15px", marginTop: "20px", flexWrap: "wrap" }}>
                      {getScore() >= 2 && (
                        <button onClick={returnToEtudes} style={{ padding: "12px 30px", background: colors.accent, color: "#020617", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer" }}>
                          → Retour aux études de cas
                        </button>
                      )}
                      <button onClick={handleResetQuiz} style={{ padding: "12px 30px", background: colors.bgPrimary, color: colors.textPrimary, border: `2px solid ${colors.border}`, borderRadius: "8px", fontWeight: "600", cursor: "pointer" }}>
                        🔄 Refaire le quiz
                      </button>
                    </div>
                  </div>

                  <h3 style={{ color: colors.textPrimary, fontSize: "1.3rem", marginBottom: "20px" }}>📝 Vos réponses</h3>
                  {quizQuestions.map((q, index) => {
                    const userAnswer = parseInt(quizAnswers[q.id]);
                    const isCorrect = userAnswer === q.correct;
                    
                    return (
                      <div key={q.id} style={{ background: colors.bgPrimary, padding: "20px", borderRadius: "12px", marginBottom: "20px", border: `2px solid ${isCorrect ? colors.accent : "#ef4444"}` }}>
                        <h4 style={{ color: colors.textPrimary, fontSize: "1.1rem", marginBottom: "15px" }}>
                          {index + 1}. {q.question}
                        </h4>
                        {q.options.map((option, optIndex) => {
                          const isUserAnswer = userAnswer === optIndex;
                          const isCorrectAnswer = q.correct === optIndex;
                          
                          return (
                            <div key={optIndex} style={{ padding: "10px", marginBottom: "8px", background: isCorrectAnswer ? colors.accent + "20" : (isUserAnswer ? "#ef444420" : colors.bgSecondary), border: `2px solid ${isCorrectAnswer ? colors.accent : (isUserAnswer ? "#ef4444" : colors.border)}`, borderRadius: "8px" }}>
                              <span style={{ color: colors.textPrimary }}>
                                {isCorrectAnswer && "✅ "}
                                {isUserAnswer && !isCorrectAnswer && "❌ "}
                                {option}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

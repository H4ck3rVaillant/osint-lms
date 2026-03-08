import { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useThemeColors } from "../context/ThemeContext";

export default function ParcoursAvanceMethodologie() {
  const navigate = useNavigate();
  const colors = useThemeColors();
  const [activeTab, setActiveTab] = useState("theory");
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);

  const BADGE_KEY = "badge_adv_methodo";
  const QUIZ_ANSWERS_KEY = "quiz_adv_methodo_answers";
  const QUIZ_COMPLETED_KEY = "quiz_adv_methodo_completed";

  if (localStorage.getItem("badge_adv_intro") !== "true") {
    return <Navigate to="/parcours/avance" replace />;
  }

  const quizQuestions = [
    {
      id: 1,
      question: "Le kill chain analysis permet de :",
      options: ["Tuer des processus", "Analyser les étapes d'une attaque", "Créer des virus", "Supprimer des données"],
      correct: 1
    },
    {
      id: 2,
      question: "L'attribution d'une cyberattaque nécessite :",
      options: ["Une seule preuve", "Corrélation de multiples indicateurs techniques et contextuels", "Juste une IP", "Un nom d'utilisateur"],
      correct: 1
    },
    {
      id: 3,
      question: "La timeline analysis consiste à :",
      options: ["Créer des calendriers", "Reconstituer chronologiquement les événements", "Supprimer l'historique", "Modifier des dates"],
      correct: 1
    },
    {
      id: 4,
      question: "Le Diamond Model aide à :",
      options: ["Créer des diamants", "Modéliser les relations adversaire-infrastructure-victime-capacité", "Dessiner des formes", "Faire des graphiques"],
      correct: 1
    },
    {
      id: 5,
      question: "La production d'un rapport d'intelligence stratégique inclut :",
      options: ["Juste des données brutes", "Executive summary + analyse + recommandations + sources", "Des captures d'écran", "Du code"],
      correct: 1
    }
  ];

  useEffect(() => {
    const savedAnswers = localStorage.getItem(QUIZ_ANSWERS_KEY);
    const quizCompleted = localStorage.getItem(QUIZ_COMPLETED_KEY);
    if (savedAnswers) setQuizAnswers(JSON.parse(savedAnswers));
    if (quizCompleted === "true") setShowResults(true);
  }, []);

  useEffect(() => {
    if (Object.keys(quizAnswers).length > 0) {
      localStorage.setItem(QUIZ_ANSWERS_KEY, JSON.stringify(quizAnswers));
    }
  }, [quizAnswers]);

  const handleQuizSubmit = () => {
    const score = getScore();
    setShowResults(true);
    localStorage.setItem(QUIZ_COMPLETED_KEY, "true");
    if (score >= 4) localStorage.setItem(BADGE_KEY, "true");
  };

  const handleResetQuiz = () => {
    setQuizAnswers({});
    setShowResults(false);
    localStorage.removeItem(QUIZ_ANSWERS_KEY);
    localStorage.removeItem(QUIZ_COMPLETED_KEY);
  };

  const getScore = () => {
    let correct = 0;
    quizQuestions.forEach((q) => {
      if (quizAnswers[q.id] === q.correct.toString()) correct++;
    });
    return correct;
  };

  const returnToParcours = () => navigate("/parcours/avance");

  const tabs = [
    { id: "theory", label: "📖 Théorie", icon: "📚" },
    { id: "quiz", label: "🎯 Quiz", icon: "✅" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: colors.bgPrimary, paddingTop: "80px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 20px" }}>
        
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div style={{ fontSize: "4rem", marginBottom: "15px" }}>🧠</div>
          <h1 style={{ fontSize: "2.5rem", fontWeight: "700", color: colors.textPrimary, marginBottom: "15px" }}>
            Module 2: Méthodologie Avancée
          </h1>
          <p style={{ fontSize: "1.1rem", color: colors.textSecondary, maxWidth: "700px", margin: "0 auto" }}>
            Frameworks d'analyse stratégique
          </p>
          {localStorage.getItem(BADGE_KEY) === "true" && (
            <div style={{ marginTop: "15px", display: "inline-block", padding: "8px 20px", background: colors.accent + "20", border: `2px solid ${colors.accent}`, borderRadius: "20px", color: colors.accent, fontWeight: "600", fontSize: "0.9rem" }}>
              ✓ Badge débloqué
            </div>
          )}
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: "15px", marginBottom: "40px", flexWrap: "wrap" }}>
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ padding: "12px 24px", background: activeTab === tab.id ? colors.accent : colors.bgSecondary, color: activeTab === tab.id ? "#020617" : colors.textPrimary, border: `2px solid ${activeTab === tab.id ? colors.accent : colors.border}`, borderRadius: "12px", fontSize: "1rem", fontWeight: "600", cursor: "pointer", transition: "all 0.3s ease" }}>
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        <div style={{ background: colors.bgSecondary, border: `1px solid ${colors.border}`, borderRadius: "12px", padding: "40px" }}>
          
          {activeTab === "theory" && (
            <div>
              <h2 style={{ color: colors.textPrimary, fontSize: "2rem", marginBottom: "20px" }}>🧠 Frameworks d'analyse stratégique</h2>
              
              <p style={{ color: colors.textSecondary, lineHeight: "1.8", marginBottom: "30px" }}>
                L'OSINT avancé s'appuie sur des <strong style={{ color: colors.accent }}>frameworks structurés</strong> 
                utilisés par les analystes professionnels et les équipes de threat intelligence.
              </p>

              <h3 style={{ color: colors.accent, fontSize: "1.5rem", marginBottom: "15px" }}>⚔️ Cyber Kill Chain</h3>
              <div style={{ background: colors.bgPrimary, padding: "20px", borderRadius: "8px", marginBottom: "20px" }}>
                <p style={{ color: colors.textSecondary, lineHeight: "1.8" }}>
                  Modéliser une cyberattaque en <strong>7 phases</strong> : Reconnaissance, Weaponization, Delivery, 
                  Exploitation, Installation, Command & Control, Actions. Permet d'identifier où interrompre l'attaque.
                </p>
              </div>

              <h3 style={{ color: colors.accent, fontSize: "1.5rem", marginBottom: "15px" }}>💎 Diamond Model</h3>
              <div style={{ background: colors.bgPrimary, padding: "20px", borderRadius: "8px", marginBottom: "20px" }}>
                <p style={{ color: colors.textSecondary, lineHeight: "1.8" }}>
                  Analyse les relations entre 4 composants : <strong>Adversaire, Capacité, Infrastructure, Victime</strong>. 
                  Révèle les connexions cachées et aide à l'attribution.
                </p>
              </div>

              <h3 style={{ color: colors.accent, fontSize: "1.5rem", marginBottom: "15px" }}>📅 Timeline Analysis</h3>
              <div style={{ background: colors.bgPrimary, padding: "20px", borderRadius: "8px", marginBottom: "20px" }}>
                <p style={{ color: colors.textSecondary, lineHeight: "1.8" }}>
                  Reconstituer <strong>chronologiquement</strong> tous les événements pour identifier les patterns, 
                  les points de pivots, et les fenêtres d'opportunité.
                </p>
              </div>

              <h3 style={{ color: colors.accent, fontSize: "1.5rem", marginBottom: "15px" }}>🎯 Attribution Analysis</h3>
              <div style={{ background: colors.bgPrimary, padding: "20px", borderRadius: "8px", marginBottom: "20px" }}>
                <p style={{ color: colors.textSecondary, lineHeight: "1.8" }}>
                  Combiner <strong>indicateurs techniques</strong> (TTPs, infrastructure) et <strong>indicateurs contextuels</strong> 
                  (motivation, timing, cibles) pour identifier l'acteur derrière une opération.
                </p>
              </div>

              <div style={{ background: colors.bgPrimary, border: `1px solid ${colors.accent}`, borderRadius: "8px", padding: "20px" }}>
                <h4 style={{ color: colors.accent, marginBottom: "10px" }}>💡 Point clé</h4>
                <p style={{ color: colors.textSecondary, lineHeight: "1.8", margin: 0 }}>
                  Ces frameworks transforment l'OSINT en <strong>intelligence opérationnelle</strong>. 
                  Ils fournissent une structure pour analyser des situations complexes et produire des 
                  <strong> recommandations stratégiques</strong>.
                </p>
              </div>
            </div>
          )}

          {activeTab === "quiz" && (
            <div>
              <h2 style={{ color: colors.textPrimary, fontSize: "2rem", marginBottom: "20px" }}>🎯 Quiz de validation</h2>
              <p style={{ color: colors.textSecondary, marginBottom: "30px" }}>
                Répondez aux 5 questions pour valider vos connaissances. Badge débloqué si score ≥ 4/5.
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
                  <div style={{ marginBottom: "30px", padding: "25px", background: getScore() >= 4 ? colors.accent + "20" : "#ef444420", border: `2px solid ${getScore() >= 4 ? colors.accent : "#ef4444"}`, borderRadius: "12px" }}>
                    <h3 style={{ color: getScore() >= 4 ? colors.accent : "#ef4444", fontSize: "1.5rem", marginBottom: "15px" }}>
                      {getScore() >= 4 ? "✅ Badge débloqué !" : "❌ Réessayez"}
                    </h3>
                    <p style={{ color: colors.textPrimary, fontSize: "1.2rem", marginBottom: "15px" }}>
                      Score : {getScore()}/{quizQuestions.length}
                    </p>
                    
                    <div style={{ display: "flex", gap: "15px", marginTop: "20px", flexWrap: "wrap" }}>
                      {getScore() >= 4 && (
                        <button onClick={returnToParcours} style={{ padding: "12px 30px", background: colors.accent, color: "#020617", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer" }}>
                          → Retour au parcours
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

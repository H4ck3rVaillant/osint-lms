import { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useThemeColors } from "../context/ThemeContext";

export default function ParcoursIntermediaireOutils() {
  const navigate = useNavigate();
  const colors = useThemeColors();
  const [activeTab, setActiveTab] = useState("theory");
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);

  const BADGE_KEY = "badge_int_outils";
  const QUIZ_ANSWERS_KEY = "quiz_int_outils_answers";
  const QUIZ_COMPLETED_KEY = "quiz_int_outils_completed";

  if (localStorage.getItem("badge_int_methodo") !== "true") {
    return <Navigate to="/parcours/intermediaire" replace />;
  }

  const quizQuestions = [
    {
      id: 1,
      question: "Maltego est utilisé pour :",
      options: ["Créer des sites web", "Cartographier des réseaux et relations", "Envoyer des emails", "Créer des virus"],
      correct: 1
    },
    {
      id: 2,
      question: "Recon-ng permet de :",
      options: ["Jouer en ligne", "Automatiser la collecte OSINT", "Créer des images", "Éditer des vidéos"],
      correct: 1
    },
    {
      id: 3,
      question: "L'analyse EXIF des images révèle :",
      options: ["La qualité de l'image", "Métadonnées: date, lieu, appareil", "Les couleurs", "La taille du fichier"],
      correct: 1
    },
    {
      id: 4,
      question: "SpiderFoot est un outil pour :",
      options: ["Tuer des araignées", "Automatiser l'OSINT et corréler des données", "Créer des graphiques", "Éditer du texte"],
      correct: 1
    },
    {
      id: 5,
      question: "Censys et Shodan servent à :",
      options: ["Créer des sites", "Scanner l'Internet pour des actifs exposés", "Envoyer des spams", "Hacker des comptes"],
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
    window.scrollTo({ top: 0, behavior: "smooth" });
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

  const returnToParcours = () => navigate("/parcours/intermediaire");

  const tabs = [
    { id: "theory", label: "📖 Théorie", icon: "📚" },
    { id: "quiz", label: "🎯 Quiz", icon: "✅" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: colors.bgPrimary, paddingTop: "80px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 20px" }}>
        
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div style={{ fontSize: "4rem", marginBottom: "15px" }}>⚡</div>
          <h1 style={{ fontSize: "2.5rem", fontWeight: "700", color: colors.textPrimary, marginBottom: "15px" }}>
            Module 3: Outils OSINT Intermédiaire
          </h1>
          <p style={{ fontSize: "1.1rem", color: colors.textSecondary, maxWidth: "700px", margin: "0 auto" }}>
            Outils avancés d'automatisation et corrélation
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
              <h2 style={{ color: colors.textPrimary, fontSize: "2rem", marginBottom: "20px" }}>⚡ Outils avancés d'automatisation</h2>
              
              <p style={{ color: colors.textSecondary, lineHeight: "1.8", marginBottom: "30px" }}>
                Les outils intermédiaires permettent d'<strong style={{ color: colors.accent }}>automatiser</strong> les recherches 
                complexes et de <strong style={{ color: colors.accent }}>corréler</strong> des données de multiples sources.
              </p>

              <h3 style={{ color: colors.accent, fontSize: "1.5rem", marginBottom: "15px" }}>🕸️ Maltego — Cartographie visuelle</h3>
              <div style={{ background: colors.bgPrimary, padding: "20px", borderRadius: "8px", marginBottom: "20px" }}>
                <p style={{ color: colors.textSecondary, lineHeight: "1.8" }}>
                  <strong>Maltego</strong> permet de visualiser les connexions entre entités (personnes, domaines, IPs) 
                  sous forme de graphe interactif. Idéal pour comprendre les réseaux complexes.
                </p>
              </div>

              <h3 style={{ color: colors.accent, fontSize: "1.5rem", marginBottom: "15px" }}>🔧 Recon-ng — Framework d'automatisation</h3>
              <div style={{ background: colors.bgPrimary, padding: "20px", borderRadius: "8px", marginBottom: "20px" }}>
                <p style={{ color: colors.textSecondary, lineHeight: "1.8" }}>
                  <strong>Recon-ng</strong> est un framework modulaire qui automatise la collecte OSINT via des modules 
                  réutilisables (whois, DNS, recherche d'emails, etc.).
                </p>
              </div>

              <h3 style={{ color: colors.accent, fontSize: "1.5rem", marginBottom: "15px" }}>📸 Analyse EXIF — Métadonnées d'images</h3>
              <div style={{ background: colors.bgPrimary, padding: "20px", borderRadius: "8px", marginBottom: "20px" }}>
                <p style={{ color: colors.textSecondary, lineHeight: "1.8" }}>
                  Les outils d'extraction <strong>EXIF</strong> révèlent des métadonnées cachées : géolocalisation GPS, 
                  modèle d'appareil photo, date et heure de prise de vue.
                </p>
              </div>

              <h3 style={{ color: colors.accent, fontSize: "1.5rem", marginBottom: "15px" }}>🕷️ SpiderFoot — OSINT automatisé</h3>
              <div style={{ background: colors.bgPrimary, padding: "20px", borderRadius: "8px", marginBottom: "20px" }}>
                <p style={{ color: colors.textSecondary, lineHeight: "1.8" }}>
                  <strong>SpiderFoot</strong> automatise la collecte et corrèle automatiquement les données découvertes, 
                  générant un rapport d'intelligence complet.
                </p>
              </div>

              <div style={{ background: colors.bgPrimary, border: `1px solid ${colors.accent}`, borderRadius: "8px", padding: "20px" }}>
                <h4 style={{ color: colors.accent, marginBottom: "10px" }}>💡 Point clé</h4>
                <p style={{ color: colors.textSecondary, lineHeight: "1.8", margin: 0 }}>
                  Ces outils <strong>multiplient votre efficacité</strong> en automatisant les tâches répétitives 
                  et en révélant des connexions invisibles à l'œil nu.
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

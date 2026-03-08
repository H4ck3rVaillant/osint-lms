import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useThemeColors } from "../context/ThemeContext";

export default function ParcoursDebutantIntroduction() {
  const navigate = useNavigate();
  const colors = useThemeColors();
  const [activeTab, setActiveTab] = useState("theory");
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);

  const BADGE_KEY = "badge_deb_intro";
  const QUIZ_ANSWERS_KEY = "quiz_deb_intro_answers";
  const QUIZ_COMPLETED_KEY = "quiz_deb_intro_completed";

  const quizQuestions = [
    {
      id: 1,
      question: "Que signifie OSINT ?",
      options: [
        "Open Source Intelligence",
        "Online Security Investigation",
        "Operational Systems Intelligence",
        "Open Security Network Tools"
      ],
      correct: 0
    },
    {
      id: 2,
      question: "L'OSINT consiste principalement à :",
      options: [
        "Pirater des systèmes informatiques",
        "Exploiter intelligemment l'information publique",
        "Accéder à des bases de données privées",
        "Utiliser des outils de hacking avancés"
      ],
      correct: 1
    },
    {
      id: 3,
      question: "Quelle organisation utilise l'OSINT professionnellement ?",
      options: [
        "Bellingcat",
        "Aucune organisation connue",
        "Uniquement les agences gouvernementales",
        "Seulement les hackers éthiques"
      ],
      correct: 0
    },
    {
      id: 4,
      question: "L'OSINT nécessite :",
      options: [
        "Un budget matériel important",
        "Des compétences en programmation avancées",
        "De la méthode et de la rigueur",
        "Une autorisation légale spéciale"
      ],
      correct: 2
    },
    {
      id: 5,
      question: "En OSINT, respecter le RGPD est :",
      options: [
        "Optionnel selon les cas",
        "Obligatoire",
        "Uniquement pour les entreprises",
        "Pas nécessaire avec des sources publiques"
      ],
      correct: 1
    }
  ];

  // Charger les réponses sauvegardées au montage
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

  // Sauvegarder les réponses à chaque changement
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
    
    if (score >= 4) {
      localStorage.setItem(BADGE_KEY, "true");
    }
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

  const returnToParcours = () => {
    navigate("/parcours/debutant");
  };

  const tabs = [
    { id: "theory", label: "📖 Théorie", icon: "📚" },
    { id: "quiz", label: "🎯 Quiz", icon: "✅" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: colors.bgPrimary, paddingTop: "80px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 20px" }}>
        
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div style={{ fontSize: "4rem", marginBottom: "15px" }}>🎓</div>
          <h1 style={{ fontSize: "2.5rem", fontWeight: "700", color: colors.textPrimary, marginBottom: "15px" }}>
            Module 1: Introduction à l'OSINT
          </h1>
          <p style={{ fontSize: "1.1rem", color: colors.textSecondary, maxWidth: "700px", margin: "0 auto" }}>
            Découvrez les fondamentaux de l'Open Source Intelligence
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
              <h2 style={{ color: colors.textPrimary, fontSize: "2rem", marginBottom: "20px" }}>📖 Qu'est-ce que l'OSINT ?</h2>
              
              <p style={{ color: colors.textSecondary, lineHeight: "1.8", marginBottom: "20px" }}>
                L'<strong style={{ color: colors.accent }}>OSINT (Open Source Intelligence)</strong> désigne l'ensemble 
                des techniques permettant de collecter, analyser et exploiter des informations issues de 
                <strong> sources ouvertes et légalement accessibles</strong>. Ces sources incluent : sites web, 
                réseaux sociaux, bases de données publiques, médias, forums, documents officiels, etc.
              </p>

              <p style={{ color: colors.textSecondary, lineHeight: "1.8", marginBottom: "30px" }}>
                Contrairement aux idées reçues, l'OSINT ne consiste pas à "pirater" ou accéder illégalement 
                à des informations. Il s'agit d'<strong>exploiter intelligemment l'information publique</strong> 
                pour produire du renseignement utile.
              </p>

              <h3 style={{ color: colors.accent, fontSize: "1.5rem", marginBottom: "15px", marginTop: "30px" }}>🎯 Pourquoi l'OSINT est central aujourd'hui</h3>
              <ul style={{ color: colors.textSecondary, lineHeight: "1.8", marginLeft: "20px", marginBottom: "25px" }}>
                <li><strong style={{ color: colors.accent }}>Base de toute enquête cyber moderne</strong> : Les professionnels de la cybersécurité utilisent l'OSINT pour identifier des vulnérabilités, cartographier des infrastructures et anticiper les menaces</li>
                <li><strong style={{ color: colors.accent }}>Utilisé par les organisations de référence</strong> : Bellingcat (investigations journalistiques), les CERT (équipes de réponse aux incidents), les forces de l'ordre et les entreprises de renseignement</li>
                <li><strong style={{ color: colors.accent }}>Faible coût, impact stratégique élevé</strong> : L'OSINT ne nécessite que peu d'investissement matériel mais peut révéler des informations critiques pour la prise de décision</li>
                <li><strong style={{ color: colors.accent }}>Accessible à tous</strong> : Avec de la méthode et de la rigueur, n'importe qui peut apprendre l'OSINT</li>
              </ul>

              <h3 style={{ color: colors.accent, fontSize: "1.5rem", marginBottom: "15px", marginTop: "30px" }}>📊 Domaines d'application</h3>
              
              <div style={{ background: colors.bgPrimary, padding: "20px", borderRadius: "8px", marginBottom: "15px" }}>
                <h4 style={{ color: colors.accent, marginBottom: "10px" }}>🛡️ Cybersécurité</h4>
                <p style={{ color: colors.textSecondary, lineHeight: "1.6", margin: 0 }}>
                  Reconnaissance d'infrastructures, identification d'actifs exposés, recherche de fuites de données, surveillance de la surface d'attaque d'une organisation.
                </p>
              </div>

              <div style={{ background: colors.bgPrimary, padding: "20px", borderRadius: "8px", marginBottom: "15px" }}>
                <h4 style={{ color: colors.accent, marginBottom: "10px" }}>📰 Journalisme d'investigation</h4>
                <p style={{ color: colors.textSecondary, lineHeight: "1.6", margin: 0 }}>
                  Vérification de faits, enquêtes sur des personnalités publiques, traçage de flux financiers, analyse de réseaux d'influence.
                </p>
              </div>

              <div style={{ background: colors.bgPrimary, padding: "20px", borderRadius: "8px", marginBottom: "15px" }}>
                <h4 style={{ color: colors.accent, marginBottom: "10px" }}>🔍 Due diligence et intelligence économique</h4>
                <p style={{ color: colors.textSecondary, lineHeight: "1.6", margin: 0 }}>
                  Vérification de partenaires commerciaux, surveillance concurrentielle, détection de fraudes, évaluation de risques réputationnels.
                </p>
              </div>

              <div style={{ background: colors.bgPrimary, padding: "20px", borderRadius: "8px", marginBottom: "25px" }}>
                <h4 style={{ color: colors.accent, marginBottom: "10px" }}>⚖️ Enquêtes légales et conformité</h4>
                <p style={{ color: colors.textSecondary, lineHeight: "1.6", margin: 0 }}>
                  Collecte de preuves numériques, investigations sur des fraudes, identification de témoins, traçabilité de transactions.
                </p>
              </div>

              <h3 style={{ color: colors.accent, fontSize: "1.5rem", marginBottom: "15px", marginTop: "30px" }}>⚠️ Éthique et limites légales</h3>
              
              <div style={{ background: colors.bgSecondary, border: "1px solid #ff6b6b", borderRadius: "8px", padding: "20px", marginBottom: "15px" }}>
                <h4 style={{ color: "#ff6b6b", marginBottom: "10px" }}>Règles essentielles</h4>
                <ul style={{ color: colors.textSecondary, lineHeight: "1.8", paddingLeft: "20px", margin: 0 }}>
                  <li>Ne jamais accéder à des systèmes sans autorisation (c'est illégal)</li>
                  <li>Ne pas utiliser de techniques de social engineering malveillantes</li>
                  <li>Respecter la vie privée et le RGPD</li>
                  <li>Ne pas diffuser d'informations sensibles sans justification</li>
                  <li>Documenter toutes vos sources pour assurer la traçabilité</li>
                </ul>
              </div>

              <div style={{ background: colors.bgPrimary, border: `1px solid ${colors.accent}`, borderRadius: "8px", padding: "20px" }}>
                <h4 style={{ color: colors.accent, marginBottom: "10px" }}>💡 Point clé</h4>
                <p style={{ color: colors.textSecondary, lineHeight: "1.8", margin: 0 }}>
                  L'OSINT est une <strong>discipline accessible mais rigoureuse</strong>. Elle nécessite de la curiosité, de la patience, et un respect strict de l'éthique et de la légalité. Votre objectif : <strong>transformer l'information publique en renseignement exploitable</strong>.
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

                  {/* Afficher les réponses */}
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

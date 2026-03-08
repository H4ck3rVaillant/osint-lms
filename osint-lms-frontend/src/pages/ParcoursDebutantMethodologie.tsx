import { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useThemeColors } from "../context/ThemeContext";

export default function ParcoursDebutantMethodologie() {
  const navigate = useNavigate();
  const colors = useThemeColors();
  const [activeTab, setActiveTab] = useState("theory");
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);

  const BADGE_KEY = "badge_deb_methodo";
  const QUIZ_ANSWERS_KEY = "quiz_deb_methodo_answers";
  const QUIZ_COMPLETED_KEY = "quiz_deb_methodo_completed";

  if (localStorage.getItem("badge_deb_intro") !== "true") {
    return <Navigate to="/parcours/debutant" replace />;
  }

  const quizQuestions = [
    {
      id: 1,
      question: "Quelle est la première étape de la méthodologie OSINT ?",
      options: ["Collecte", "Cadrage", "Analyse", "Recoupement"],
      correct: 1
    },
    {
      id: 2,
      question: "Combien d'étapes comporte la méthodologie OSINT complète ?",
      options: ["4", "5", "6", "7"],
      correct: 2
    },
    {
      id: 3,
      question: "Le recoupement consiste à :",
      options: ["Collecter plus d'informations", "Vérifier la cohérence avec d'autres sources", "Analyser les données", "Rédiger le rapport"],
      correct: 1
    },
    {
      id: 4,
      question: "Une information est fiable si elle est confirmée par au moins :",
      options: ["1 source", "2-3 sources indépendantes", "5 sources", "10 sources"],
      correct: 1
    },
    {
      id: 5,
      question: "La dernière étape de la méthodologie OSINT est :",
      options: ["Analyse", "Recoupement", "Restitution", "Collecte"],
      correct: 2
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

  const returnToParcours = () => navigate("/parcours/debutant");

  const tabs = [
    { id: "theory", label: "📖 Théorie", icon: "📚" },
    { id: "quiz", label: "🎯 Quiz", icon: "✅" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: colors.bgPrimary, paddingTop: "80px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 20px" }}>
        
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div style={{ fontSize: "4rem", marginBottom: "15px" }}>🔍</div>
          <h1 style={{ fontSize: "2.5rem", fontWeight: "700", color: colors.textPrimary, marginBottom: "15px" }}>
            Module 2: Méthodologie OSINT
          </h1>
          <p style={{ fontSize: "1.1rem", color: colors.textSecondary, maxWidth: "700px", margin: "0 auto" }}>
            Maîtrisez la méthodologie en 6 étapes
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
              <h2 style={{ color: colors.textPrimary, fontSize: "2rem", marginBottom: "20px" }}>📖 L'importance d'une méthode structurée</h2>
              
              <p style={{ color: colors.textSecondary, lineHeight: "1.8", marginBottom: "20px" }}>
                Une enquête OSINT professionnelle ne repose pas sur le hasard ou l'improvisation. 
                Elle suit une <strong style={{ color: colors.accent }}>méthodologie rigoureuse</strong> qui garantit 
                la pertinence, la fiabilité et la reproductibilité des résultats.
              </p>

              <p style={{ color: colors.textSecondary, lineHeight: "1.8", marginBottom: "30px" }}>
                Sans méthode, vous risquez de : perdre du temps sur des pistes non pertinentes, 
                manquer des informations critiques, ou produire des conclusions erronées.
              </p>

              <h3 style={{ color: colors.accent, fontSize: "1.5rem", marginBottom: "15px", marginTop: "30px" }}>🎯 Les 6 étapes de la méthodologie OSINT</h3>

              <div style={{ background: colors.bgPrimary, padding: "20px", borderRadius: "8px", marginBottom: "15px" }}>
                <h4 style={{ color: colors.accent, marginBottom: "10px" }}>1️⃣ Cadrage</h4>
                <p style={{ color: colors.textSecondary, lineHeight: "1.8" }}>
                  <strong>Définir clairement l'objectif</strong> de votre recherche. Que cherchez-vous exactement ? 
                  Quelle question voulez-vous répondre ? Quel est le périmètre de votre investigation ?
                </p>
                <p style={{ color: colors.textSecondary, lineHeight: "1.8", marginTop: "10px" }}>
                  <em>Exemple :</em> "Identifier les domaines web associés à l'entreprise X" plutôt que "Trouver des infos sur X"
                </p>
              </div>

              <div style={{ background: colors.bgPrimary, padding: "20px", borderRadius: "8px", marginBottom: "15px" }}>
                <h4 style={{ color: colors.accent, marginBottom: "10px" }}>2️⃣ Hypothèses</h4>
                <p style={{ color: colors.textSecondary, lineHeight: "1.8" }}>
                  <strong>Formuler des hypothèses de travail</strong> que vous allez chercher à valider ou invalider. 
                  Les hypothèses guident votre recherche et vous évitent de partir dans toutes les directions.
                </p>
                <p style={{ color: colors.textSecondary, lineHeight: "1.8", marginTop: "10px" }}>
                  <em>Exemple :</em> "Le domaine Y appartient à l'entreprise X car le WHOIS mentionne le même email"
                </p>
              </div>

              <div style={{ background: colors.bgPrimary, padding: "20px", borderRadius: "8px", marginBottom: "15px" }}>
                <h4 style={{ color: colors.accent, marginBottom: "10px" }}>3️⃣ Collecte</h4>
                <p style={{ color: colors.textSecondary, lineHeight: "1.8" }}>
                  <strong>Rassembler les informations</strong> de manière systématique en utilisant les outils 
                  et sources appropriés. Documentez chaque source et chaque information collectée.
                </p>
                <p style={{ color: colors.textSecondary, lineHeight: "1.8", marginTop: "10px" }}>
                  <em>Sources :</em> Moteurs de recherche, réseaux sociaux, bases de données publiques, WHOIS, DNS, etc.
                </p>
              </div>

              <div style={{ background: colors.bgPrimary, padding: "20px", borderRadius: "8px", marginBottom: "15px" }}>
                <h4 style={{ color: colors.accent, marginBottom: "10px" }}>4️⃣ Recoupement</h4>
                <p style={{ color: colors.textSecondary, lineHeight: "1.8" }}>
                  <strong>Vérifier la cohérence</strong> des informations en les croisant avec d'autres sources. 
                  Une information n'est fiable que si elle est confirmée par au moins 2-3 sources indépendantes.
                </p>
                <p style={{ color: colors.textSecondary, lineHeight: "1.8", marginTop: "10px" }}>
                  <em>Attention :</em> Ne vous fiez jamais à une source unique, même si elle semble crédible.
                </p>
              </div>

              <div style={{ background: colors.bgPrimary, padding: "20px", borderRadius: "8px", marginBottom: "15px" }}>
                <h4 style={{ color: colors.accent, marginBottom: "10px" }}>5️⃣ Analyse</h4>
                <p style={{ color: colors.textSecondary, lineHeight: "1.8" }}>
                  <strong>Interpréter les données collectées</strong> pour en extraire du sens. 
                  Identifiez les patterns, les connexions, les incohérences. 
                  Évaluez la qualité et la fiabilité de chaque information.
                </p>
                <p style={{ color: colors.textSecondary, lineHeight: "1.8", marginTop: "10px" }}>
                  <em>Questions :</em> Que révèlent ces données ? Quelles conclusions peut-on en tirer ?
                </p>
              </div>

              <div style={{ background: colors.bgPrimary, padding: "20px", borderRadius: "8px", marginBottom: "25px" }}>
                <h4 style={{ color: colors.accent, marginBottom: "10px" }}>6️⃣ Restitution</h4>
                <p style={{ color: colors.textSecondary, lineHeight: "1.8" }}>
                  <strong>Présenter vos conclusions</strong> de manière claire et structurée. 
                  Un bon rapport OSINT inclut : le contexte, la méthodologie, les sources, 
                  les résultats, et les recommandations.
                </p>
                <p style={{ color: colors.textSecondary, lineHeight: "1.8", marginTop: "10px" }}>
                  <em>Format :</em> Rapport écrit, timeline, carte mentale, graphe de relations, etc.
                </p>
              </div>

              <h3 style={{ color: colors.accent, fontSize: "1.5rem", marginBottom: "15px", marginTop: "30px" }}>💼 Exemple pratique</h3>
              
              <div style={{ background: colors.bgPrimary, padding: "20px", borderRadius: "8px" }}>
                <p style={{ color: colors.textSecondary, lineHeight: "1.8", marginBottom: "15px" }}>
                  <strong style={{ color: colors.accent }}>Objectif :</strong> Identifier les comptes réseaux sociaux d'un individu
                </p>
                <ol style={{ color: colors.textSecondary, lineHeight: "2", paddingLeft: "20px" }}>
                  <li><strong>Cadrage :</strong> Rechercher tous les profils publics de la personne sur les principaux réseaux sociaux</li>
                  <li><strong>Hypothèses :</strong> La personne utilise probablement le même pseudonyme sur plusieurs plateformes</li>
                  <li><strong>Collecte :</strong> Rechercher sur Google, Twitter, LinkedIn, Facebook, Instagram avec différentes requêtes</li>
                  <li><strong>Recoupement :</strong> Vérifier que les profils trouvés correspondent bien à la même personne (photo, bio, localisation)</li>
                  <li><strong>Analyse :</strong> Cartographier tous les comptes trouvés et leurs interconnexions</li>
                  <li><strong>Restitution :</strong> Produire une liste avec URLs, dates de création, activité récente</li>
                </ol>
              </div>

              <div style={{ background: colors.bgPrimary, border: `1px solid ${colors.accent}`, borderRadius: "8px", padding: "20px", marginTop: "25px" }}>
                <h4 style={{ color: colors.accent, marginBottom: "10px" }}>💡 Point clé</h4>
                <p style={{ color: colors.textSecondary, lineHeight: "1.8", margin: 0 }}>
                  La méthodologie est la <strong>colonne vertébrale</strong> de toute investigation OSINT réussie. 
                  Elle vous permet de travailler de manière <strong>structurée, efficace et reproductible</strong>. 
                  Plus vous pratiquez, plus ces étapes deviendront naturelles.
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

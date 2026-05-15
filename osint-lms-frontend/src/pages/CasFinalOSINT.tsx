import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useThemeColors } from "../context/ThemeContext";
import { useGame } from "../context/GameContext";

export default function CasFinalOSINT() {
  const navigate = useNavigate();
  const colors = useThemeColors();
  const { unlockBadge } = useGame();
  const [activeTab, setActiveTab] = useState("theory");
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);

  const BADGE_KEY = "badge_cases_osint";
  const QUIZ_ANSWERS_KEY = "quiz_case_final_answers";
  const QUIZ_COMPLETED_KEY = "quiz_case_final_completed";

  const quizQuestions = [
    {
      id: 1,
      question: "Quelle est la première étape de la méthodologie du cas final ?",
      options: [
        "Attribution des acteurs",
        "Géolocalisation des images",
        "Collecte et archivage des contenus",
        "Construction de la chronologie"
      ],
      correct: 2
    },
    {
      id: 2,
      question: "Quel risque d'erreur majeur est mentionné dans le cas final ?",
      options: [
        "Utiliser trop d'outils différents",
        "Biais de confirmation lié aux narratifs dominants",
        "Analyser trop de sources en parallèle",
        "Documenter toutes les preuves"
      ],
      correct: 1
    },
    {
      id: 3,
      question: "Quel niveau de confiance est atteint dans l'analyse finale ?",
      options: [
        "Faible",
        "Moyen",
        "Élevé",
        "Absolu (100%)"
      ],
      correct: 2
    },
    {
      id: 4,
      question: "Pourquoi archiver les contenus dès leur découverte en OSINT ?",
      options: [
        "Pour les partager sur les réseaux sociaux",
        "Pour respecter le RGPD",
        "Pour créer un rapport plus long",
        "Pour éviter leur suppression avant la fin de l'investigation"
      ],
      correct: 3
    },
    {
      id: 5,
      question: "Quelle technique permet de vérifier si une image a déjà été publiée dans un autre contexte ?",
      options: [
        "Analyse EXIF uniquement",
        "Recherche inversée d'image",
        "Lecture des métadonnées DNS",
        "Scan avec Shodan"
      ],
      correct: 1
    },
    {
      id: 6,
      question: "Lors d'une géolocalisation par image, quel élément visuel est le plus utile ?",
      options: [
        "La couleur du ciel",
        "La résolution de l'image",
        "Les reliefs, bâtiments et infrastructures identifiables",
        "Le nombre de personnes présentes"
      ],
      correct: 2
    },
    {
      id: 7,
      question: "Qu'est-ce que la corrélation temporelle dans une chronologie OSINT ?",
      options: [
        "Trier les fichiers par taille",
        "Comparer les horodatages de différentes sources pour reconstituer l'ordre des faits",
        "Vérifier l'heure locale d'un seul document",
        "Calculer la durée totale d'une opération"
      ],
      correct: 1
    },
    {
      id: 8,
      question: "Qu'est-ce qu'un acteur proxy dans le contexte d'une attribution ?",
      options: [
        "Un outil de navigation anonyme",
        "Un serveur intermédiaire réseau",
        "Un groupe agissant pour le compte d'un autre sans revendiquer l'action",
        "Un témoin oculaire anonyme"
      ],
      correct: 2
    },
    {
      id: 9,
      question: "Quelle source ouverte est mentionnée comme utilisée dans le cas final ?",
      options: [
        "Facebook uniquement",
        "Réseaux sociaux, images satellites et archives médias",
        "Uniquement les bases de données gouvernementales",
        "Les journaux imprimés"
      ],
      correct: 1
    },
    {
      id: 10,
      question: "Pourquoi certaines zones d'incertitude subsistent-elles malgré un niveau de confiance élevé ?",
      options: [
        "L'analyste manquait d'expérience",
        "Les outils OSINT étaient insuffisants",
        "Certaines preuves sont invérifiables ou incomplètes",
        "Le budget de l'enquête était limité"
      ],
      correct: 2
    },
    {
      id: 11,
      question: "Qu'est-ce qui distingue une analyse OSINT professionnelle d'une simple recherche web ?",
      options: [
        "L'utilisation d'outils payants uniquement",
        "La rapidité de publication des résultats",
        "Le nombre de sources consultées",
        "La rigueur méthodologique, la traçabilité et la vérifiabilité de chaque affirmation"
      ],
      correct: 3
    },
    {
      id: 12,
      question: "Quelle est la conclusion pédagogique principale de ce cas final ?",
      options: [
        "L'OSINT permet de tout prouver avec certitude",
        "Chaque affirmation doit pouvoir être retracée, vérifiée et expliquée à un tiers",
        "Les sources anonymes sont toujours fiables",
        "La vitesse prime sur la précision en investigation"
      ],
      correct: 1
    },
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
    
    if (score >= 9) {
      localStorage.setItem(BADGE_KEY, "true");
      unlockBadge(BADGE_KEY, "Analyste OSINT Certifié");
      localStorage.setItem("Analyste OSINT – Cas réels", "true");
    }
  };

  const handleResetQuiz = () => {
    setQuizAnswers({});
    setShowResults(false);
    localStorage.removeItem(QUIZ_ANSWERS_KEY);
    localStorage.removeItem(QUIZ_COMPLETED_KEY);
    localStorage.removeItem(BADGE_KEY);
    localStorage.removeItem("Analyste OSINT – Cas réels");
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
          <div style={{ fontSize: "4rem", marginBottom: "15px" }}>🎯</div>
          <h1 style={{ fontSize: "2.5rem", fontWeight: "700", color: colors.textPrimary, marginBottom: "15px" }}>
            Cas final – Analyse OSINT complète
          </h1>
          <p style={{ fontSize: "1.1rem", color: colors.textSecondary, maxWidth: "700px", margin: "0 auto" }}>
            Enquête OSINT multi-angles type Bellingcat
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
              <h2 style={{ color: colors.accent, fontSize: "1.8rem", marginBottom: "20px" }}>🎯 Contexte</h2>
              <p style={{ color: colors.textSecondary, fontSize: "1.05rem", lineHeight: "1.8", marginBottom: "25px" }}>
                Une série d'images, vidéos et messages apparaît sur plusieurs plateformes
                sociales suite à un événement militaire non revendiqué.  
                Les informations sont fragmentées, parfois contradictoires, et rapidement
                reprises par des médias internationaux.
              </p>

              <h3 style={{ color: colors.accent, fontSize: "1.5rem", marginBottom: "15px", marginTop: "30px" }}>Objectif de l'enquête</h3>
              <p style={{ color: colors.textSecondary, fontSize: "1.05rem", lineHeight: "1.8", marginBottom: "15px" }}>
                Produire une analyse OSINT complète, structurée et vérifiable,
                similaire aux méthodologies employées par des équipes comme Bellingcat :
              </p>
              <ul style={{ color: colors.textSecondary, lineHeight: "1.8", marginLeft: "20px", marginBottom: "25px" }}>
                <li>Vérifier l'authenticité des médias</li>
                <li>Localiser précisément les événements</li>
                <li>Reconstruire une chronologie fiable</li>
                <li>Attribuer l'action à un acteur plausible</li>
              </ul>

              <h3 style={{ color: colors.accent, fontSize: "1.5rem", marginBottom: "15px", marginTop: "30px" }}>Sources ouvertes utilisées</h3>
              <ul style={{ color: colors.textSecondary, lineHeight: "1.8", marginLeft: "20px", marginBottom: "25px" }}>
                <li>Réseaux sociaux (X, Telegram, TikTok, YouTube)</li>
                <li>Images satellites et cartes open source</li>
                <li>Archives médias et bases de données OSINT</li>
                <li>Historique d'opérations similaires documentées</li>
              </ul>

              <h3 style={{ color: colors.accent, fontSize: "1.5rem", marginBottom: "15px", marginTop: "30px" }}>Méthodologie détaillée</h3>
              <ol style={{ color: colors.textSecondary, lineHeight: "1.8", marginLeft: "20px", marginBottom: "25px" }}>
                <li><strong style={{ color: colors.accent }}>Collecte :</strong> archivage des contenus avant suppression (hash, date, source)</li>
                <li><strong style={{ color: colors.accent }}>Vérification :</strong> recherche inversée, analyse des métadonnées, comparaison avec des archives</li>
                <li><strong style={{ color: colors.accent }}>Géolocalisation :</strong> identification des reliefs, bâtiments, infrastructures et angles de prise de vue</li>
                <li><strong style={{ color: colors.accent }}>Chronologie :</strong> corrélation temporelle entre médias, fuseaux horaires et événements connus</li>
                <li><strong style={{ color: colors.accent }}>Attribution :</strong> analyse des signatures techniques, comportementales et stratégiques</li>
              </ol>

              <h3 style={{ color: colors.accent, fontSize: "1.5rem", marginBottom: "15px", marginTop: "30px" }}>Résultat final</h3>
              <p style={{ color: colors.textSecondary, fontSize: "1.05rem", lineHeight: "1.8", marginBottom: "25px" }}>
                L'ensemble des éléments converge vers une opération coordonnée
                menée par un acteur déjà impliqué dans des actions similaires.
                Le niveau de confiance est évalué comme <strong style={{ color: colors.accent }}>élevé</strong>,
                bien que certaines zones d'incertitude subsistent.
              </p>

              <h3 style={{ color: colors.accent, fontSize: "1.5rem", marginBottom: "15px", marginTop: "30px" }}>Ce qui aurait pu être mal interprété</h3>
              <ul style={{ color: colors.textSecondary, lineHeight: "1.8", marginLeft: "20px", marginBottom: "25px" }}>
                <li>Réutilisation d'anciennes images sorties de leur contexte</li>
                <li>Biais de confirmation lié aux narratifs dominants</li>
                <li>Confusion volontaire entre acteurs étatiques et proxy</li>
              </ul>

              <h3 style={{ color: colors.accent, fontSize: "1.5rem", marginBottom: "15px", marginTop: "30px" }}>Conclusion pédagogique</h3>
              <p style={{ color: colors.textSecondary, fontSize: "1.05rem", lineHeight: "1.8" }}>
                Ce cas illustre l'importance d'une approche rigoureuse,
                documentée et transparente en OSINT.
                Chaque affirmation doit pouvoir être retracée, vérifiée
                et expliquée à un tiers.
              </p>
            </div>
          )}

          {activeTab === "quiz" && (
            <div>
              <h2 style={{ color: colors.textPrimary, fontSize: "2rem", marginBottom: "20px" }}>🎯 Quiz de validation</h2>
              <p style={{ color: colors.textSecondary, marginBottom: "30px" }}>
                Répondez aux 12 questions pour valider vos connaissances. Badge débloqué si score ≥ 9/12.
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
                  <div style={{ marginBottom: "30px", padding: "25px", background: getScore() >= 9 ? colors.accent + "20" : "#ef444420", border: `2px solid ${getScore() >= 9 ? colors.accent : "#ef4444"}`, borderRadius: "12px" }}>
                    <h3 style={{ color: getScore() >= 9 ? colors.accent : "#ef4444", fontSize: "1.5rem", marginBottom: "15px" }}>
                      {getScore() >= 9 ? "✅ Badge débloqué !" : "❌ Réessayez"}
                    </h3>
                    <p style={{ color: colors.textPrimary, fontSize: "1.2rem", marginBottom: "15px" }}>
                      Score : {getScore()}/{quizQuestions.length}
                    </p>
                    {getScore() >= 9 && (
                      <p style={{ color: colors.accent, fontSize: "1.1rem", marginTop: "10px", fontWeight: "600" }}>
                        🏆 Badge master « Analyste OSINT – Cas réels » débloqué !
                      </p>
                    )}
                    
                    <div style={{ display: "flex", gap: "15px", marginTop: "20px", flexWrap: "wrap" }}>
                      {getScore() >= 9 && (
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

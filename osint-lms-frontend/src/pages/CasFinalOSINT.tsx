import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useThemeColors } from "../context/ThemeContext";

export default function CasFinalOSINT() {
  const colors = useThemeColors();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"theory" | "quiz">("theory");
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizResult, setQuizResult] = useState<{ score: number; answers: number[] } | null>(null);

  const badgeKey = "badge_cases_osint";
  const quizStorageKey = `quiz_${badgeKey}_answers`;
  const resultStorageKey = `quiz_${badgeKey}_result`;

  const quizQuestions = [
    {
      question: "Quelle est la première étape de la méthodologie du cas final ?",
      options: [
        "Attribution des acteurs",
        "Collecte et archivage des contenus",
        "Géolocalisation des images",
        "Construction de la chronologie"
      ],
      correct: 1
    },
    {
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
      question: "Quel niveau de confiance est atteint dans l'analyse finale ?",
      options: [
        "Faible",
        "Moyen",
        "Élevé",
        "Absolu (100%)"
      ],
      correct: 2
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
      localStorage.setItem("Analyste OSINT – Cas réels", "true");
    }
  };

  const resetQuiz = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setQuizAnswers({});
    setQuizResult(null);
    localStorage.removeItem(quizStorageKey);
    localStorage.removeItem(resultStorageKey);
    localStorage.removeItem(badgeKey);
    localStorage.removeItem("Analyste OSINT – Cas réels");
  };

  const isBadgeUnlocked = quizResult && quizResult.score >= 2;

  return (
    <main style={{ paddingTop: "80px", padding: "40px", maxWidth: "900px", margin: "0 auto" }}>
      <h1 style={{ color: colors.accent, marginBottom: "20px", fontSize: "2rem" }}>
        🎯 Cas final – Analyse OSINT complète
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
        <section style={{ color: colors.textSecondary, lineHeight: "1.7" }}>
          <h2 style={{ color: colors.accent }}>Contexte</h2>
          <p>
            Une série d'images, vidéos et messages apparaît sur plusieurs plateformes
            sociales suite à un événement militaire non revendiqué.  
            Les informations sont fragmentées, parfois contradictoires, et rapidement
            reprises par des médias internationaux.
          </p>

          <h2 style={{ color: colors.accent }}>Objectif de l'enquête</h2>
          <p>
            Produire une analyse OSINT complète, structurée et vérifiable,
            similaire aux méthodologies employées par des équipes comme Bellingcat :
          </p>
          <ul>
            <li>Vérifier l'authenticité des médias</li>
            <li>Localiser précisément les événements</li>
            <li>Reconstruire une chronologie fiable</li>
            <li>Attribuer l'action à un acteur plausible</li>
          </ul>

          <h2 style={{ color: colors.accent }}>Sources ouvertes utilisées</h2>
          <ul>
            <li>Réseaux sociaux (X, Telegram, TikTok, YouTube)</li>
            <li>Images satellites et cartes open source</li>
            <li>Archives médias et bases de données OSINT</li>
            <li>Historique d'opérations similaires documentées</li>
          </ul>

          <h2 style={{ color: colors.accent }}>Méthodologie détaillée</h2>
          <ol>
            <li>
              <strong>Collecte :</strong> archivage des contenus avant suppression
              (hash, date, source).
            </li>
            <li>
              <strong>Vérification :</strong> recherche inversée, analyse des métadonnées,
              comparaison avec des archives.
            </li>
            <li>
              <strong>Géolocalisation :</strong> identification des reliefs, bâtiments,
              infrastructures et angles de prise de vue.
            </li>
            <li>
              <strong>Chronologie :</strong> corrélation temporelle entre médias,
              fuseaux horaires et événements connus.
            </li>
            <li>
              <strong>Attribution :</strong> analyse des signatures techniques,
              comportementales et stratégiques.
            </li>
          </ol>

          <h2 style={{ color: colors.accent }}>Résultat final</h2>
          <p>
            L'ensemble des éléments converge vers une opération coordonnée
            menée par un acteur déjà impliqué dans des actions similaires.
            Le niveau de confiance est évalué comme <strong>élevé</strong>,
            bien que certaines zones d'incertitude subsistent.
          </p>

          <h2 style={{ color: colors.accent }}>Ce qui aurait pu être mal interprété</h2>
          <ul>
            <li>Réutilisation d'anciennes images sorties de leur contexte</li>
            <li>Biais de confirmation lié aux narratifs dominants</li>
            <li>Confusion volontaire entre acteurs étatiques et proxy</li>
          </ul>

          <h2 style={{ color: colors.accent }}>Conclusion pédagogique</h2>
          <p>
            Ce cas illustre l'importance d'une approche rigoureuse,
            documentée et transparente en OSINT.
            Chaque affirmation doit pouvoir être retracée, vérifiée
            et expliquée à un tiers.
          </p>

          <p style={{ fontSize: "17px", marginTop: "25px" }}>
            Ce cas final simule une enquête OSINT multi-sources inspirée des
            méthodologies Bellingcat. Vous devez corréler données visuelles,
            temporelles, techniques et humaines afin de produire une analyse
            défendable et reproductible.
          </p>
        </section>
      )}

      {/* Quiz */}
      {activeTab === "quiz" && (
        <div style={{ color: colors.textSecondary }}>
          <h2 style={{ color: colors.accent, marginBottom: "20px" }}>
            🎯 Quiz de validation - Cas final OSINT
          </h2>
          <p style={{ marginBottom: "30px", fontSize: "1.05rem" }}>
            Répondez correctement à au moins 2 questions sur 3 pour débloquer le badge master.
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
                      ? "✅ Badge master « Analyste OSINT – Cas réels » débloqué !" 
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
      </div>
    </main>
  );
}

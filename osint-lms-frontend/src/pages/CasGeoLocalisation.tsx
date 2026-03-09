import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useThemeColors } from "../context/ThemeContext";

export default function CasGeoLocalisation() {
  const colors = useThemeColors();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"theory" | "quiz">("theory");
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizResult, setQuizResult] = useState<{ score: number; answers: number[] } | null>(null);

  const badgeKey = "badge_case_geo";
  const quizStorageKey = `quiz_${badgeKey}_answers`;
  const resultStorageKey = `quiz_${badgeKey}_result`;

  const quizQuestions = [
    {
      question: "Quelle technique permet de déterminer l'orientation d'une photo ?",
      options: [
        "Les couleurs dominantes du ciel",
        "L'analyse des ombres projetées",
        "Le nombre de bâtiments visibles",
        "La résolution de l'image"
      ],
      correct: 1
    },
    {
      question: "Quelle précision a été atteinte dans ce cas de géolocalisation ?",
      options: [
        "Environ 10 kilomètres",
        "Environ 1 kilomètre",
        "Moins de 50 mètres",
        "Environ 500 mètres"
      ],
      correct: 2
    },
    {
      question: "Quelle erreur classique faut-il absolument éviter en géolocalisation ?",
      options: [
        "Utiliser plusieurs sources cartographiques différentes",
        "Se fier à une seule source cartographique",
        "Analyser les ombres et le mobilier urbain",
        "Vérifier avec des images satellites"
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
        🛰️ Cas réel – Géolocalisation d'image
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
            Une image publiée sur les réseaux sociaux montre un convoi militaire
            dans une zone inconnue. L'objectif est d'identifier précisément le
            lieu où la photo a été prise.
          </p>

          <h2 style={{ color: colors.accent, marginTop: "25px" }}>Hypothèses</h2>
          <ul>
            <li>Zone urbaine d'Europe de l'Est</li>
            <li>Présence d'infrastructures industrielles</li>
            <li>Réseau routier secondaire</li>
          </ul>

          <h2 style={{ color: colors.accent, marginTop: "25px" }}>Sources ouvertes utilisées</h2>
          <ul>
            <li>Google Maps / Google Earth</li>
            <li>Yandex Maps</li>
            <li>OpenStreetMap</li>
            <li>Images satellites Sentinel Hub</li>
          </ul>

          <h2 style={{ color: colors.accent, marginTop: "25px" }}>Méthodologie pas à pas</h2>
          <ol>
            <li>Analyse des ombres pour déterminer l'orientation</li>
            <li>Identification du mobilier urbain (lampadaires, routes)</li>
            <li>Comparaison des bâtiments avec vues satellites</li>
            <li>Validation par recoupement multi-sources</li>
          </ol>

          <h2 style={{ color: colors.accent, marginTop: "25px" }}>Résultat final</h2>
          <p>
            La photo a été prise dans une zone industrielle en périphérie d'une
            ville identifiée avec une précision inférieure à 50 mètres.
          </p>

          <h2 style={{ color: colors.accent, marginTop: "25px" }}>Erreurs classiques</h2>
          <ul>
            <li>Se fier à une seule source cartographique</li>
            <li>Ignorer la distorsion des images satellites</li>
          </ul>
        </section>
      )}

      {/* Quiz */}
      {activeTab === "quiz" && (
        <div style={{ color: colors.textSecondary }}>
          <h2 style={{ color: colors.accent, marginBottom: "20px" }}>
            🎯 Quiz de validation - Géolocalisation d'image
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
          onClick={() => { window.scrollTo({ top: 0, behavior: "smooth" }); navigate("/cas/verification-media"); }}
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

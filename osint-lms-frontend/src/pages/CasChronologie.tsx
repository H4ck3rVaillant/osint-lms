import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useThemeColors } from "../context/ThemeContext";

export default function CasChronologie() {
  const colors = useThemeColors();
  const navigate = useNavigate();
  const [validated, setValidated] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizPassed, setQuizPassed] = useState(false);

  const quizQuestions = [
    {
      id: 0,
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
      id: 1,
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
      id: 2,
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

  const validateCase = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    localStorage.setItem("badge_case_chrono", "true");
    setValidated(true);
  };

  const handleQuizSubmit = () => {
    const correctAnswers = [1, 1, 1];
    const score = Object.keys(quizAnswers).filter(
      k => quizAnswers[parseInt(k)] === correctAnswers[parseInt(k)]
    ).length;
    
    if (score >= 2) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setQuizPassed(true);
    } else {
      alert(`Score: ${score}/3. Il faut au moins 2/3 pour valider. Réessayez !`);
    }
  };

  return (
    <main style={{ padding: "40px", maxWidth: "900px", margin: "0 auto" }}>
      <h1 style={{ color: colors.accent, marginBottom: "20px" }}>
        🧭 Cas réel – Chronologie d'événements
      </h1>

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

      {/* Quiz de validation */}
      {showQuiz && !quizPassed && (
        <div style={{ marginTop: "40px", padding: "30px", background: colors.bgSecondary, border: `2px solid ${colors.accent}`, borderRadius: "12px" }}>
          <h2 style={{ color: colors.accent, marginBottom: "20px" }}>🎯 Quiz de validation du cas</h2>
          <p style={{ color: colors.textSecondary, marginBottom: "25px" }}>
            Répondez correctement aux 3 questions pour débloquer le badge (2/3 minimum requis).
          </p>
          
          {quizQuestions.map((q, index) => (
            <div key={q.id} style={{ marginBottom: "25px", padding: "20px", background: colors.bgPrimary, borderRadius: "8px" }}>
              <h3 style={{ color: colors.textPrimary, fontSize: "1rem", marginBottom: "15px" }}>
                {index + 1}. {q.question}
              </h3>
              
              {q.options.map((option, optIndex) => (
                <label 
                  key={optIndex}
                  style={{ 
                    display: "block", 
                    padding: "12px", 
                    marginBottom: "8px",
                    background: quizAnswers[index] === optIndex ? colors.accent + "30" : colors.bgSecondary,
                    border: `2px solid ${quizAnswers[index] === optIndex ? colors.accent : colors.border}`,
                    borderRadius: "8px",
                    cursor: "pointer",
                    transition: "all 0.3s ease"
                  }}
                >
                  <input 
                    type="radio" 
                    name={`question-${index}`}
                    value={optIndex}
                    checked={quizAnswers[index] === optIndex}
                    onChange={(e) => setQuizAnswers({ ...quizAnswers, [index]: parseInt(e.target.value) })}
                    style={{ marginRight: "10px" }}
                  />
                  <span style={{ color: colors.textPrimary }}>{option}</span>
                </label>
              ))}
            </div>
          ))}
          
          <button 
            onClick={handleQuizSubmit}
            disabled={Object.keys(quizAnswers).length !== 3}
            style={{ 
              padding: "15px 35px",
              background: Object.keys(quizAnswers).length === 3 ? colors.accent : colors.border,
              color: colors.bgPrimary,
              border: "none",
              borderRadius: "8px",
              fontSize: "1rem",
              fontWeight: "bold",
              cursor: Object.keys(quizAnswers).length === 3 ? "pointer" : "not-allowed"
            }}
          >
            Valider le quiz
          </button>
        </div>
      )}

      {quizPassed && !validated && (
        <div style={{ marginTop: "30px", padding: "25px", background: colors.accent + "20", border: `2px solid ${colors.accent}`, borderRadius: "12px", textAlign: "center" }}>
          <h3 style={{ color: colors.accent, marginBottom: "15px" }}>✅ Quiz réussi !</h3>
          <p style={{ color: colors.textPrimary, marginBottom: "20px" }}>
            Vous pouvez maintenant valider le cas et débloquer le badge.
          </p>
        </div>
      )}

      <div style={{ marginTop: "50px", display: "flex", gap: "30px" }}>
        <button style={btnSecondary} onClick={() => { window.scrollTo({ top: 0, behavior: "smooth" }); navigate("/etudes-osint"); }}>
          ⬅ Retour aux cas
        </button>

        <button style={btnSecondary} onClick={() => { window.scrollTo({ top: 0, behavior: "smooth" }); navigate("/cas/final"); }}>
          Cas suivant ➡
        </button>

        <button 
          style={btnPrimary} 
          onClick={() => {
            if (!quizPassed) {
              setShowQuiz(true);
            } else {
              validateCase();
            }
          }}
        >
          ✔ Valider le cas
        </button>
      </div>

      {validated && (
        <div style={popupStyle}>
          <h3 style={{ color: colors.accent }}>Cas validé</h3>
          <p style={{ color: colors.textPrimary }}>Badge "Chronologie d'événements" débloqué.</p>
          <button
            style={{ ...btnPrimary, marginTop: "20px" }}
            onClick={() => { window.scrollTo({ top: 0, behavior: "smooth" }); navigate("/etudes-osint"); }}
          >
            Retour aux études de cas
          </button>
        </div>
      )}
    </main>
  );
}

/* ===== STYLES ===== */
const btnPrimary = {
  padding: "16px 32px",
  background: "#00ff9c",
  color: "#020617",
  border: "none",
  borderRadius: "12px",
  fontSize: "16px",
  cursor: "pointer",
  fontWeight: "bold",
};

const btnSecondary = {
  padding: "14px 26px",
  background: "#0b0f1a",
  color: "#00ff9c",
  border: "1px solid #00ff9c",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "600",
};

const popupStyle = {
  position: "fixed" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  background: "#020617",
  border: "2px solid #00ff9c",
  borderRadius: "14px",
  padding: "30px",
  textAlign: "center" as const,
  zIndex: 1000,
};

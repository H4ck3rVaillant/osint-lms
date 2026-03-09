import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useThemeColors } from "../context/ThemeContext";

export default function CasFinalOSINT() {
  const colors = useThemeColors();
  const navigate = useNavigate();
  const [validated, setValidated] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizPassed, setQuizPassed] = useState(false);

  const quizQuestions = [
    {
      id: 0,
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
      id: 1,
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
      id: 2,
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

  const validateFinal = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    localStorage.setItem("Analyste OSINT – Cas réels", "true");
    localStorage.setItem("badge_cases_osint", "true");
    setValidated(true);
  };

  const handleQuizSubmit = () => {
    const correctAnswers = [1, 1, 2];
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
        🎯 Cas final – Analyse OSINT complète
      </h1>

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
      </section>

      <p style={{ color: colors.textSecondary, fontSize: "17px", lineHeight: 1.7, marginTop: "25px" }}>
        Ce cas final simule une enquête OSINT multi-sources inspirée des
        méthodologies Bellingcat. Vous devez corréler données visuelles,
        temporelles, techniques et humaines afin de produire une analyse
        défendable et reproductible.
      </p>

      {/* Quiz de validation */}
      {showQuiz && !quizPassed && (
        <div style={{ marginTop: "40px", padding: "30px", background: colors.bgSecondary, border: `2px solid ${colors.accent}`, borderRadius: "12px" }}>
          <h2 style={{ color: colors.accent, marginBottom: "20px" }}>🎯 Quiz de validation du cas final</h2>
          <p style={{ color: colors.textSecondary, marginBottom: "25px" }}>
            Répondez correctement aux 3 questions pour débloquer le badge master (2/3 minimum requis).
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
            Vous pouvez maintenant valider le cas final et débloquer le badge master.
          </p>
        </div>
      )}

      <div style={{ marginTop: "50px", display: "flex", gap: "30px" }}>
        <button style={btnSecondary} onClick={() => { window.scrollTo({ top: 0, behavior: "smooth" }); navigate("/etudes-osint"); }}>
          ⬅ Retour aux cas
        </button>

        <button 
          style={btnPrimary} 
          onClick={() => {
            if (!quizPassed) {
              setShowQuiz(true);
            } else {
              validateFinal();
            }
          }}
        >
          ✔ Valider le cas final
        </button>
      </div>

      {validated && (
        <div style={popupStyle}>
          <h3 style={{ color: colors.accent }}>Cas validé</h3>
          <p style={{ color: colors.textPrimary }}>🏆 Badge « Analyste OSINT – Cas réels » débloqué !</p>
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

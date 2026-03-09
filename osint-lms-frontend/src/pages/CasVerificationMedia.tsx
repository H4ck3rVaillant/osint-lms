import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useThemeColors } from "../context/ThemeContext";

export default function CasVerificationMedia() {
  const colors = useThemeColors();
  const navigate = useNavigate();
  const [validated, setValidated] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizPassed, setQuizPassed] = useState(false);

  const quizQuestions = [
    {
      id: 0,
      question: "Quelle est la première étape pour vérifier l'authenticité d'une vidéo ?",
      options: [
        "Publier la vidéo pour demander l'avis des internautes",
        "Extraction des images clés de la vidéo",
        "Contacter directement l'auteur présumé",
        "Analyser uniquement les commentaires"
      ],
      correct: 1
    },
    {
      id: 1,
      question: "Quelle erreur classique faut-il éviter lors de la vérification de médias ?",
      options: [
        "Faire plusieurs recherches inversées sur différents moteurs",
        "Se fier à une seule recherche inversée",
        "Vérifier les métadonnées EXIF",
        "Consulter les archives médias ouvertes"
      ],
      correct: 1
    },
    {
      id: 2,
      question: "Quel était le résultat final de la vérification dans ce cas ?",
      options: [
        "Vidéo authentique et récente confirmée",
        "Deepfake détecté grâce à l'analyse audio",
        "Exercice militaire de 2016 recyclé hors contexte",
        "Canular évident sans fondement"
      ],
      correct: 2
    }
  ];

  const validateCase = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    localStorage.setItem("badge_case_media", "true");
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
        📸 Cas réel – Vérification d'images & vidéos
      </h1>

      <section style={{ color: colors.textSecondary, lineHeight: 1.7 }}>
        <h2 style={{ color: colors.accent }}>Contexte</h2>
        <p>
          Une vidéo virale montre une explosion supposée récente. Plusieurs médias
          la relaient sans vérification préalable. Votre mission est de déterminer
          si ce contenu est authentique.
        </p>

        <h2 style={{ color: colors.accent, marginTop: "25px" }}>Hypothèses</h2>
        <ul>
          <li>Vidéo récente filmée dans un contexte de conflit</li>
          <li>Ancienne vidéo recyclée</li>
          <li>Vidéo manipulée ou sortie de son contexte</li>
        </ul>

        <h2 style={{ color: colors.accent, marginTop: "25px" }}>
          Sources ouvertes utilisées
        </h2>
        <ul>
          <li>Google Reverse Image / Yandex</li>
          <li>InVID / WeVerify</li>
          <li>YouTube Data Viewer</li>
          <li>Archives médias ouvertes</li>
        </ul>

        <h2 style={{ color: colors.accent, marginTop: "25px" }}>
          Méthodologie pas à pas
        </h2>
        <ol>
          <li>Extraction des images clés de la vidéo</li>
          <li>Recherche inversée multi-plateformes</li>
          <li>Analyse audio et visuelle</li>
          <li>Comparaison avec archives connues</li>
        </ol>

        <h2 style={{ color: colors.accent, marginTop: "25px" }}>
          Résultat final
        </h2>
        <p>
          La vidéo correspond à un exercice militaire filmé en 2016, réutilisé
          dans un contexte trompeur.
        </p>

        <h2 style={{ color: colors.accent, marginTop: "25px" }}>
          Erreurs classiques
        </h2>
        <ul>
          <li>Se fier à une seule recherche inversée</li>
          <li>Ignorer le contexte de publication initial</li>
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

        <button style={btnSecondary} onClick={() => { window.scrollTo({ top: 0, behavior: "smooth" }); navigate("/cas/attribution"); }}>
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
          <p style={{ color: colors.textPrimary }}>Badge "Vérification médias" débloqué.</p>
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

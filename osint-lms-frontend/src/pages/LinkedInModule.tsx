import { useState, useEffect } from "react";
import { useThemeColors } from "../context/ThemeContext";

export default function LinkedInModule() {

  const colors = useThemeColors();
  const [activeTab, setActiveTab] = useState("theory");
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

  const BADGE_KEY = "badge_module_linkedin";
  const ANSWERS_KEY = "quiz_answers_linkedin";
  const RESULTS_KEY = "quiz_results_linkedin";

  useEffect(() => {

    const savedAnswers = localStorage.getItem(ANSWERS_KEY);
    const savedResults = localStorage.getItem(RESULTS_KEY);

    if (savedAnswers) setQuizAnswers(JSON.parse(savedAnswers));
    if (savedResults === "true") setShowResults(true);

  }, []);

  const tabs = [
    { id: "theory", label: "📖 Théorie" },
    { id: "tools", label: "🔧 Outils" },
    { id: "exercises", label: "💡 Exercices" },
    { id: "quiz", label: "🎯 Quiz" },
  ];

  const quizQuestions = [
    { id: 1, question: "Combien de membres LinkedIn ?", options: ["900+ millions", "500 millions", "1 milliard", "300 millions"], correct: 0 },
    { id: 2, question: "Opérateur recherche entreprise ?", options: ['company:"Nom"', 'org:"Nom"', 'work:"Nom"', 'employer:"Nom"'], correct: 0 },
    { id: 3, question: "Outil OSINT LinkedIn ?", options: ["CrossLinked", "LinkedScraper", "ProfileHarvest", "LinkedBot"], correct: 0 },
    { id: 4, question: "Scraping LinkedIn légal ?", options: ["Non, viole les CGU", "Oui avec premium", "Oui usage perso", "Toujours"], correct: 0 },
    { id: 5, question: "Info rarement publique ?", options: ["Téléphone personnel", "Parcours pro", "Compétences", "Recommandations"], correct: 0 }
  ];

  const getScore = () => {
    let correct = 0;
    quizQuestions.forEach(q => {
      if (quizAnswers[q.id] === q.correct.toString()) correct++;
    });
    return correct;
  };

  const handleQuizSubmit = () => {

    const score = getScore();
    setShowResults(true);

    localStorage.setItem(ANSWERS_KEY, JSON.stringify(quizAnswers));
    localStorage.setItem(RESULTS_KEY, "true");

    if (score >= 4) {
      localStorage.setItem(BADGE_KEY, "true");
    }

  };

  const handleReset = () => {

    setQuizAnswers({});
    setShowResults(false);
    setShowResetModal(false);

    localStorage.removeItem(BADGE_KEY);
    localStorage.removeItem(ANSWERS_KEY);
    localStorage.removeItem(RESULTS_KEY);

  };

  return (

    <div style={{ minHeight: "100vh", background: colors.bgPrimary, paddingTop: "80px" }}>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 20px" }}>

        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div style={{ fontSize: "4rem", marginBottom: "15px" }}>💼</div>

          <h1 style={{ fontSize: "2.5rem", fontWeight: "700", color: colors.textPrimary }}>
            Module LinkedIn OSINT
          </h1>

          <p style={{ color: colors.textSecondary }}>
            Investigations professionnelles et reconnaissance
          </p>
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: "15px", marginBottom: "40px" }}>
          {tabs.map(tab => (

            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: "12px 24px",
                background: activeTab === tab.id ? colors.accent : colors.bgSecondary,
                border: `2px solid ${colors.border}`,
                borderRadius: "12px",
                cursor: "pointer"
              }}
            >
              {tab.label}
            </button>

          ))}
        </div>

        <div style={{ background: colors.bgSecondary, padding: "40px", borderRadius: "12px" }}>

          {activeTab === "theory" && (

            <div>

              <h2 style={{ color: colors.textPrimary }}>📖 LinkedIn OSINT</h2>

              <p style={{ color: colors.textSecondary, lineHeight: "1.8" }}>
                LinkedIn est aujourd’hui le plus grand réseau professionnel
                avec plus de <strong>900 millions d’utilisateurs</strong>.

                Pour un analyste OSINT ou un pentester, cette plateforme constitue
                une source très riche d’informations publiques sur les entreprises
                et leurs employés.

                Les profils contiennent souvent des données exploitables :
                fonctions, technologies utilisées, historique professionnel,
                relations et structure interne d’une organisation.
              </p>

              <h3 style={{ color: colors.accent }}>Cas d'usage</h3>

              <ul style={{ color: colors.textSecondary }}>
                <li>Cartographier une organisation</li>
                <li>Identifier responsables IT et sécurité</li>
                <li>Préparer des scénarios de social engineering</li>
                <li>Identifier les technologies utilisées</li>
              </ul>

            </div>

          )}

          {activeTab === "exercises" && (

            <div>

              <h2 style={{ color: colors.textPrimary }}>💡 Exercices</h2>

              <div style={{ background: colors.bgPrimary, padding: "25px", borderRadius: "12px", marginBottom: "20px" }}>
                <h3 style={{ color: colors.accent }}>Exercice 1 : Cartographie sécurité</h3>
                <p style={{ color: colors.textSecondary }}>
                  Identifiez sur LinkedIn les profils occupant un poste
                  de CISO ou RSSI dans une grande entreprise.
                </p>
              </div>

              <div style={{ background: colors.bgPrimary, padding: "25px", borderRadius: "12px", marginBottom: "20px" }}>
                <h3 style={{ color: colors.accent }}>Exercice 2 : Organisation interne</h3>
                <p style={{ color: colors.textSecondary }}>
                  Choisissez une entreprise et essayez d’identifier
                  les responsables IT, développeurs et managers.
                </p>
              </div>

              <div style={{ background: colors.bgPrimary, padding: "25px", borderRadius: "12px" }}>
                <h3 style={{ color: colors.accent }}>Exercice 3 : Technologies utilisées</h3>
                <p style={{ color: colors.textSecondary }}>
                  Analysez plusieurs profils d’une même entreprise
                  afin d’identifier les technologies utilisées
                  (cloud, frameworks, outils).
                </p>
              </div>

            </div>

          )}

        </div>

      </div>

    </div>

  );

}
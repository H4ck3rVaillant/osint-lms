import { useState, useEffect } from "react";
import { useThemeColors } from "../context/ThemeContext";

export default function MaltegoModule() {

  const colors = useThemeColors();

  const [activeTab, setActiveTab] = useState("theory");
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

  const BADGE_KEY = "badge_module_maltego";
  const ANSWERS_KEY = "quiz_answers_maltego";
  const RESULTS_KEY = "quiz_results_maltego";

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
    { id: 1, question: "Maltego est un outil de ?", options: ["Data mining et visualisation", "Scan de ports", "Crack passwords", "Analyse malware"], correct: 0 },
    { id: 2, question: "Élément de base Maltego ?", options: ["Entity", "Node", "Object", "Item"], correct: 0 },
    { id: 3, question: "Comment Maltego collecte les données ?", options: ["Transforms automatisés", "Scan actif", "Injection SQL", "Bruteforce"], correct: 0 },
    { id: 4, question: "Version gratuite Maltego ?", options: ["Community Edition", "Lite", "Basic", "Free Pro"], correct: 0 },
    { id: 5, question: "Objectif principal ?", options: ["Visualiser relations entre entités", "Exploiter vulnérabilités", "Scanner réseau", "Analyser trafic"], correct: 0 }
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

          <div style={{ fontSize: "4rem", marginBottom: "15px" }}>🕸️</div>

          <h1 style={{ fontSize: "2.5rem", fontWeight: "700", color: colors.textPrimary }}>
            Module Maltego OSINT
          </h1>

          <p style={{ color: colors.textSecondary }}>
            Visualisation graphique et data mining OSINT
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

              <h2 style={{ color: colors.textPrimary }}>📖 Maltego OSINT</h2>

              <p style={{ color: colors.textSecondary, lineHeight: "1.8" }}>
                <strong>Maltego</strong> est un outil d’investigation OSINT
                permettant de cartographier visuellement les relations
                entre différentes entités : personnes, domaines,
                entreprises, emails ou infrastructures réseau.
              </p>

              <p style={{ color: colors.textSecondary }}>
                L’outil fonctionne grâce à des <strong>transforms</strong>,
                qui interrogent automatiquement différentes sources
                de données publiques afin d’enrichir les informations.
              </p>

              <h3 style={{ color: colors.accent }}>Cas d’usage</h3>

              <ul style={{ color: colors.textSecondary }}>
                <li>Cartographier l'infrastructure d'une entreprise</li>
                <li>Analyser les relations entre personnes et organisations</li>
                <li>Découvrir sous-domaines et emails liés</li>
                <li>Identifier des infrastructures partagées</li>
              </ul>

            </div>

          )}

          {activeTab === "exercises" && (

            <div>

              <h2 style={{ color: colors.textPrimary }}>💡 Exercices</h2>

              <div style={{ background: colors.bgPrimary, padding: "25px", borderRadius: "12px", marginBottom: "20px" }}>

                <h3 style={{ color: colors.accent }}>
                  Exercice 1 : Cartographie d’un domaine
                </h3>

                <p style={{ color: colors.textSecondary }}>
                  Ajoutez une entité Domain (ex: example.com)
                  puis lancez plusieurs transforms afin de découvrir
                  sous-domaines, IPs et emails associés.
                </p>

              </div>

              <div style={{ background: colors.bgPrimary, padding: "25px", borderRadius: "12px", marginBottom: "20px" }}>

                <h3 style={{ color: colors.accent }}>
                  Exercice 2 : Analyse d’une personne
                </h3>

                <p style={{ color: colors.textSecondary }}>
                  Ajoutez une entité Person et essayez de découvrir
                  les profils sociaux, emails ou organisations
                  associés à cette personne.
                </p>

              </div>

              <div style={{ background: colors.bgPrimary, padding: "25px", borderRadius: "12px" }}>

                <h3 style={{ color: colors.accent }}>
                  Exercice 3 : Infrastructure partagée
                </h3>

                <p style={{ color: colors.textSecondary }}>
                  Identifiez les domaines hébergés sur la même
                  adresse IP afin de découvrir d’éventuelles
                  infrastructures mutualisées.
                </p>

              </div>

            </div>

          )}

        </div>

      </div>

    </div>

  );

}
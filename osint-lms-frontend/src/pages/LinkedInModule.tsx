import { useState } from "react";
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

  useState(() => {
    const savedAnswers = localStorage.getItem(ANSWERS_KEY);
    const savedResults = localStorage.getItem(RESULTS_KEY);
    if (savedAnswers) setQuizAnswers(JSON.parse(savedAnswers));
    if (savedResults === "true") setShowResults(true);
  });

  const tabs = [
    { id: "theory", label: "📖 Théorie", icon: "📚" },
    { id: "tools", label: "🔧 Outils", icon: "⚙️" },
    { id: "exercises", label: "💡 Exercices", icon: "✍️" },
    { id: "quiz", label: "🎯 Quiz", icon: "✅" },
  ];

  const quizQuestions = [
    { id: 1, question: "Combien de membres LinkedIn compte-t-il ?", options: ["900+ millions", "500 millions", "1 milliard", "300 millions"], correct: 0 },
    { id: 2, question: "Quel opérateur LinkedIn pour rechercher par entreprise ?", options: ['company:"Nom"', 'org:"Nom"', 'work:"Nom"', 'employer:"Nom"'], correct: 0 },
    { id: 3, question: "Quel outil scrape les employés LinkedIn ?", options: ["CrossLinked", "LinkedScraper", "ProfileHarvest", "LinkedBot"], correct: 0 },
    { id: 4, question: "Le scraping LinkedIn est-il légal ?", options: ["Non, viole CGU", "Oui avec premium", "Oui usage perso", "Oui sans restriction"], correct: 0 },
    { id: 5, question: "Info NON trouvable sur profil public ?", options: ["Tél personnel", "Parcours pro", "Compétences", "Recommandations"], correct: 0 }
  ];

  const handleQuizSubmit = () => {
    const score = getScore();
    setShowResults(true);
    localStorage.setItem(ANSWERS_KEY, JSON.stringify(quizAnswers));
    localStorage.setItem(RESULTS_KEY, "true");
    if (score >= 4) localStorage.setItem(BADGE_KEY, "true");
  };

  const handleReset = () => {
    setQuizAnswers({});
    setShowResults(false);
    setShowResetModal(false);
    localStorage.removeItem(BADGE_KEY);
    localStorage.removeItem(ANSWERS_KEY);
    localStorage.removeItem(RESULTS_KEY);
  };

  const getScore = () => {
    let correct = 0;
    quizQuestions.forEach(q => { if (quizAnswers[q.id] === q.correct.toString()) correct++; });
    return correct;
  };

  return (
    <div style={{ minHeight: "100vh", background: colors.bgPrimary, paddingTop: "80px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 20px" }}>
        
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div style={{ fontSize: "4rem", marginBottom: "15px" }}>💼</div>
          <h1 style={{ fontSize: "2.5rem", fontWeight: "700", color: colors.textPrimary, marginBottom: "15px" }}>
            Module LinkedIn OSINT
          </h1>
          <p style={{ fontSize: "1.1rem", color: colors.textSecondary, maxWidth: "700px", margin: "0 auto" }}>
            Investigations professionnelles et reconnaissance d'entreprise
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
              <h2 style={{ color: colors.textPrimary, fontSize: "2rem", marginBottom: "20px" }}>📖 LinkedIn en OSINT</h2>
              
              <p style={{ color: colors.textSecondary, lineHeight: "1.8", marginBottom: "20px" }}>
                LinkedIn est le plus grand réseau professionnel mondial avec <strong>900+ millions d'utilisateurs</strong> dans plus de 200 pays. Les utilisateurs y partagent volontairement leur parcours professionnel, compétences, certifications, formations et réseau. Cette richesse d'informations en fait une mine d'or pour l'OSINT.
              </p>

              <h3 style={{ color: colors.accent, fontSize: "1.5rem", marginBottom: "15px", marginTop: "30px" }}>🎯 Cas d'usage en OSINT</h3>
              <ul style={{ color: colors.textSecondary, lineHeight: "1.8", marginLeft: "20px", marginBottom: "25px" }}>
                <li><strong>Reconnaissance entreprise :</strong> Cartographier la structure organisationnelle, identifier les décideurs, employés actuels et anciens</li>
                <li><strong>Social Engineering :</strong> Collecter des informations pour du phishing ciblé : postes, responsabilités, projets en cours</li>
                <li><strong>Veille concurrentielle :</strong> Suivre les recrutements, départs massifs, compétences recherchées par la concurrence</li>
                <li><strong>Analyse stack technologique :</strong> Identifier les technologies utilisées via les compétences des développeurs et ingénieurs</li>
                <li><strong>Mapping réseau professionnel :</strong> Découvrir les connexions entre individus, entreprises partenaires, clients</li>
              </ul>

              <h3 style={{ color: colors.accent, fontSize: "1.5rem", marginBottom: "15px", marginTop: "30px" }}>📊 Informations extractibles</h3>
              
              <div style={{ background: colors.bgPrimary, padding: "20px", borderRadius: "8px", marginBottom: "15px" }}>
                <h4 style={{ color: colors.accent, marginBottom: "10px" }}>Profil individuel</h4>
                <p style={{ color: colors.textSecondary, lineHeight: "1.6", margin: 0 }}>
                  Nom complet, photo, poste actuel, entreprise, localisation géographique, historique professionnel complet (entreprises précédentes, dates, responsabilités), formations (écoles, diplômes, années), compétences validées, certifications professionnelles, langues parlées, recommandations de collègues, publications et articles, centres d'intérêt.
                </p>
              </div>

              <div style={{ background: colors.bgPrimary, padding: "20px", borderRadius: "8px", marginBottom: "15px" }}>
                <h4 style={{ color: colors.accent, marginBottom: "10px" }}>Page entreprise</h4>
                <p style={{ color: colors.textSecondary, lineHeight: "1.6", margin: 0 }}>
                  Nombre total d'employés, répartition géographique des bureaux, croissance de l'effectif (tendance embauche/licenciement), postes ouverts et départements qui recrutent, employés par département (Sales, Engineering, Marketing...), nouveaux arrivants récents, départs récents, technologies mentionnées dans les descriptions de poste.
                </p>
              </div>

              <div style={{ background: colors.bgPrimary, padding: "20px", borderRadius: "8px" }}>
                <h4 style={{ color: colors.accent, marginBottom: "10px" }}>Groupes et activité</h4>
                <p style={{ color: colors.textSecondary, lineHeight: "1.6", margin: 0 }}>
                  Groupes professionnels d'appartenance (révèle centres d'intérêt, secteur d'activité), publications et commentaires publics, recommandations et endorsements reçus/donnés, événements professionnels participés.
                </p>
              </div>
            </div>
          )}

          {activeTab === "tools" && (
            <div>
              <h2 style={{ color: colors.textPrimary, fontSize: "2rem", marginBottom: "20px" }}>🔧 Outils LinkedIn OSINT</h2>

              <h3 style={{ color: colors.accent, fontSize: "1.5rem", marginBottom: "15px" }}>📌 Recherche avancée native</h3>
              <p style={{ color: colors.textSecondary, marginBottom: "15px", lineHeight: "1.7" }}>
                LinkedIn propose des filtres puissants directement dans l'interface. Utilisez la barre de recherche puis filtrez par "Personnes" :
              </p>
              <div style={{ background: colors.bgPrimary, padding: "15px", borderRadius: "8px", marginBottom: "20px" }}>
                <div style={{ marginBottom: "10px", color: colors.textSecondary }}>
                  <strong style={{ color: colors.accent }}>Entreprise actuelle :</strong> Filtrer par "Microsoft", "Google"
                </div>
                <div style={{ marginBottom: "10px", color: colors.textSecondary }}>
                  <strong style={{ color: colors.accent }}>Titre de poste :</strong> "CISO", "Security Engineer", "CTO"
                </div>
                <div style={{ marginBottom: "10px", color: colors.textSecondary }}>
                  <strong style={{ color: colors.accent }}>Localisation :</strong> Paris, San Francisco, London
                </div>
                <div style={{ color: colors.textSecondary }}>
                  <strong style={{ color: colors.accent }}>École :</strong> Stanford, MIT, Polytechnique
                </div>
              </div>

              <h3 style={{ color: colors.accent, fontSize: "1.5rem", marginBottom: "15px", marginTop: "25px" }}>🔎 Opérateurs de recherche</h3>
              <div style={{ background: colors.bgPrimary, padding: "15px", borderRadius: "8px", marginBottom: "20px", fontFamily: "monospace", fontSize: "0.9rem" }}>
                <div style={{ marginBottom: "10px", color: colors.textSecondary }}>
                  <code style={{ color: colors.accent, display: "block", marginBottom: "5px" }}>company:"Microsoft"</code>
                  <p style={{ margin: 0, fontSize: "0.9rem" }}>→ Tous les employés Microsoft</p>
                </div>
                <div style={{ marginBottom: "10px", color: colors.textSecondary }}>
                  <code style={{ color: colors.accent, display: "block", marginBottom: "5px" }}>school:"Stanford University"</code>
                  <p style={{ margin: 0, fontSize: "0.9rem" }}>→ Alumni de Stanford</p>
                </div>
                <div style={{ marginBottom: "10px", color: colors.textSecondary }}>
                  <code style={{ color: colors.accent, display: "block", marginBottom: "5px" }}>title:"CISO"</code>
                  <p style={{ margin: 0, fontSize: "0.9rem" }}>→ Responsables sécurité</p>
                </div>
                <div style={{ color: colors.textSecondary }}>
                  <code style={{ color: colors.accent, display: "block", marginBottom: "5px" }}>company:"Acme" AND title:"Developer"</code>
                  <p style={{ margin: 0, fontSize: "0.9rem" }}>→ Développeurs chez Acme</p>
                </div>
              </div>

              <h3 style={{ color: colors.accent, fontSize: "1.5rem", marginBottom: "15px", marginTop: "25px" }}>🛠️ Outils tiers</h3>
              
              <div style={{ marginBottom: "20px" }}>
                <h4 style={{ color: colors.textPrimary, fontSize: "1.2rem", marginBottom: "10px" }}>Sales Navigator (LinkedIn officiel)</h4>
                <p style={{ color: colors.textSecondary, marginBottom: "10px", lineHeight: "1.7" }}>
                  Outil payant (~80€/mois) avec filtres avancés : ancienneté dans le poste, taille de l'entreprise, secteur d'activité, niveau de séniorité. Permet de sauvegarder des listes et recevoir des alertes sur les changements de poste.
                </p>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <h4 style={{ color: colors.textPrimary, fontSize: "1.2rem", marginBottom: "10px" }}>CrossLinked (Python)</h4>
                <p style={{ color: colors.textSecondary, marginBottom: "10px", lineHeight: "1.7" }}>
                  Outil open-source permettant de scraper la liste des employés d'une entreprise et générer des listes d'emails potentiels.
                </p>
                <div style={{ background: colors.bgPrimary, padding: "15px", borderRadius: "8px", fontFamily: "monospace", fontSize: "0.85rem" }}>
                  <div style={{ marginBottom: "10px", color: colors.textSecondary }}>
                    # Installation<br/>
                    <span style={{ color: colors.accent }}>git clone https://github.com/m8r0wn/CrossLinked</span>
                  </div>
                  <div style={{ color: colors.textSecondary }}>
                    # Utilisation (pattern prenom.nom)<br/>
                    <span style={{ color: colors.accent }}>python3 crosslinked.py -f "prenom.nom@company.com" "Company Name"</span>
                  </div>
                </div>
              </div>

              <h3 style={{ color: colors.accent, fontSize: "1.5rem", marginBottom: "15px", marginTop: "25px" }}>⚠️ Limites et légalité</h3>
              <div style={{ background: "#ef444420", border: "2px solid #ef4444", borderRadius: "8px", padding: "20px" }}>
                <p style={{ color: colors.textSecondary, lineHeight: "1.7", margin: 0 }}>
                  Le scraping automatisé de LinkedIn <strong>viole les Conditions Générales d'Utilisation</strong>. LinkedIn a poursuivi en justice plusieurs entreprises (hiQ Labs). Risques : ban du compte, poursuites juridiques. Utilisez uniquement la recherche manuelle ou Sales Navigator officiel.
                </p>
              </div>
            </div>
          )}

          {activeTab === "exercises" && (
            <div>
              <h2 style={{ color: colors.textPrimary, fontSize: "2rem", marginBottom: "20px" }}>💡 Exercices Pratiques</h2>

              <div style={{ background: colors.bgPrimary, padding: "25px", borderRadius: "12px", marginBottom: "20px" }}>
                <h3 style={{ color: colors.accent, fontSize: "1.3rem", marginBottom: "15px" }}>Exercice 1 : Cartographie CISO d'une entreprise CAC40</h3>
                <p style={{ color: colors.textSecondary, marginBottom: "15px" }}>
                  <strong>Objectif :</strong> Identifier le responsable de la sécurité informatique d'une grande entreprise française et analyser son profil.
                </p>
                <p style={{ color: colors.textSecondary, marginBottom: "10px" }}><strong>Requête :</strong></p>
                <code style={{ background: colors.bgSecondary, padding: "10px 15px", borderRadius: "8px", display: "block", color: colors.accent, marginBottom: "15px" }}>
                  company:"Total Energies" title:"CISO"
                </code>
                <p style={{ color: colors.textSecondary }}>
                  <strong>Analyse :</strong> Noter nom, ancienneté au poste, parcours professionnel, certifications (CISSP, CISM), technologies mentionnées, publications récentes, connexions clés.
                </p>
              </div>

              <div style={{ background: colors.bgPrimary, padding: "25px", borderRadius: "12px", marginBottom: "20px" }}>
                <h3 style={{ color: colors.accent, fontSize: "1.3rem", marginBottom: "15px" }}>Exercice 2 : Analyse de turnover dans une startup tech</h3>
                <p style={{ color: colors.textSecondary, marginBottom: "15px" }}>
                  <strong>Objectif :</strong> Détecter des départs massifs d'employés, signe potentiel de difficultés.
                </p>
                <p style={{ color: colors.textSecondary, marginBottom: "10px" }}><strong>Méthodologie :</strong></p>
                <code style={{ background: colors.bgSecondary, padding: "10px 15px", borderRadius: "8px", display: "block", color: colors.accent, marginBottom: "15px" }}>
                  Rechercher anciens employés → Filtrer 6 derniers mois
                </code>
                <p style={{ color: colors.textSecondary }}>
                  <strong>Analyse :</strong> Compter départs par département (Engineering, Sales, Product). Identifier migration vers concurrents, départs simultanés de cadres dirigeants.
                </p>
              </div>

              <div style={{ background: colors.bgPrimary, padding: "25px", borderRadius: "12px" }}>
                <h3 style={{ color: colors.accent, fontSize: "1.3rem", marginBottom: "15px" }}>Exercice 3 : Identification du stack technologique</h3>
                <p style={{ color: colors.textSecondary, marginBottom: "15px" }}>
                  <strong>Objectif :</strong> Déterminer les technologies utilisées par une entreprise via l'analyse des compétences de ses employés.
                </p>
                <p style={{ color: colors.textSecondary, marginBottom: "10px" }}><strong>Requête :</strong></p>
                <code style={{ background: colors.bgSecondary, padding: "10px 15px", borderRadius: "8px", display: "block", color: colors.accent, marginBottom: "15px" }}>
                  company:"TargetCorp" title:"Developer" OR title:"Engineer"
                </code>
                <p style={{ color: colors.textSecondary }}>
                  <strong>Analyse :</strong> Compiler les compétences (Python, Java, AWS, Azure, React, Django, PostgreSQL). Croiser avec offres d'emploi. Identifier technologies dominantes (30%+ des profils).
                </p>
              </div>
            </div>
          )}

          {activeTab === "quiz" && (
            <div>
              <h2 style={{ color: colors.textPrimary, fontSize: "2rem", marginBottom: "20px" }}>🎯 Quiz de validation</h2>

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

              <div style={{ display: "flex", gap: "15px" }}>
                <button onClick={handleQuizSubmit} disabled={Object.keys(quizAnswers).length !== quizQuestions.length} style={{ padding: "15px 40px", background: Object.keys(quizAnswers).length === quizQuestions.length ? colors.accent : colors.border, color: "#020617", border: "none", borderRadius: "8px", fontSize: "1.1rem", fontWeight: "600", cursor: Object.keys(quizAnswers).length === quizQuestions.length ? "pointer" : "not-allowed" }}>
                  Valider
                </button>
                <button onClick={() => setShowResetModal(true)} style={{ padding: "15px 40px", background: "#0b0f1a", color: "#00ff9c", border: "2px solid #00ff9c", borderRadius: "8px", fontSize: "1.1rem", fontWeight: "600", cursor: "pointer" }}>
                  🔄 Reset
                </button>
              </div>

              {showResults && (
                <div style={{ marginTop: "30px", padding: "25px", background: getScore() >= 4 ? colors.accent + "20" : "#ef444420", border: `2px solid ${getScore() >= 4 ? colors.accent : "#ef4444"}`, borderRadius: "12px" }}>
                  <h3 style={{ color: getScore() >= 4 ? colors.accent : "#ef4444", fontSize: "1.5rem" }}>
                    {getScore() >= 4 ? "✅ Validé !" : "❌ Réessayez"}
                  </h3>
                  <p style={{ color: colors.textPrimary, fontSize: "1.2rem" }}>
                    Score : {getScore()}/{quizQuestions.length}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {showResetModal && (
        <>
          <div onClick={() => setShowResetModal(false)} style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0, 0, 0, 0.8)", zIndex: 9998 }} />
          <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", background: "#0b0f1a", border: "3px solid #00ff9c", borderRadius: "12px", padding: "40px", maxWidth: "500px", width: "90%", zIndex: 9999 }}>
            <h3 style={{ color: "#00ff9c", fontSize: "1.5rem", marginBottom: "15px", textAlign: "center" }}>⚠️ Réinitialiser</h3>
            <p style={{ color: "#9ca3af", marginBottom: "30px", textAlign: "center" }}>Effacer tout ?</p>
            <div style={{ display: "flex", gap: "15px", justifyContent: "center" }}>
              <button onClick={() => setShowResetModal(false)} style={{ padding: "12px 30px", background: "transparent", color: "#9ca3af", border: "2px solid #2a3f3f", borderRadius: "8px", cursor: "pointer" }}>Annuler</button>
              <button onClick={handleReset} style={{ padding: "12px 30px", background: "#00ff9c", color: "#0b0f1a", border: "none", borderRadius: "8px", cursor: "pointer" }}>Confirmer</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

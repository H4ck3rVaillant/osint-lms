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
          <h1 style={{ fontSize: "2.5rem", fontWeight: "700", color: colors.textPrimary, marginBottom: "15px" }}>Module LinkedIn OSINT</h1>
          <p style={{ fontSize: "1.1rem", color: colors.textSecondary, maxWidth: "700px", margin: "0 auto" }}>Investigations professionnelles et reconnaissance d'entreprise</p>
          {localStorage.getItem(BADGE_KEY) === "true" && (
            <div style={{ marginTop: "15px", display: "inline-block", padding: "8px 20px", background: colors.accent + "20", border: `2px solid ${colors.accent}`, borderRadius: "20px", color: colors.accent, fontWeight: "600" }}>✓ Badge débloqué</div>
          )}
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: "15px", marginBottom: "40px", flexWrap: "wrap" }}>
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ padding: "12px 24px", background: activeTab === tab.id ? colors.accent : colors.bgSecondary, color: activeTab === tab.id ? "#020617" : colors.textPrimary, border: `2px solid ${activeTab === tab.id ? colors.accent : colors.border}`, borderRadius: "12px", fontSize: "1rem", fontWeight: "600", cursor: "pointer" }}>
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        <div style={{ background: colors.bgSecondary, border: `1px solid ${colors.border}`, borderRadius: "12px", padding: "40px" }}>
          {activeTab === "theory" && (
            <div>
              <h2 style={{ color: colors.textPrimary, fontSize: "2rem", marginBottom: "20px" }}>📖 LinkedIn OSINT</h2>
              <p style={{ color: colors.textSecondary, lineHeight: "1.8", marginBottom: "20px" }}>
                LinkedIn est le plus grand réseau professionnel avec <strong>900+ millions d'utilisateurs</strong> dans 200 pays. Source OSINT exceptionnelle car les utilisateurs partagent volontairement carrière détaillée, compétences, éducation, certifications, réseau professionnel.
              </p>
              <h3 style={{ color: colors.accent, fontSize: "1.5rem", marginBottom: "15px" }}>🎯 Cas d'usage OSINT</h3>
              <ul style={{ color: colors.textSecondary, lineHeight: "1.8", marginLeft: "20px", marginBottom: "25px" }}>
                <li><strong>Reconnaissance entreprise :</strong> Structure organisationnelle, décideurs, employés actuels/anciens</li>
                <li><strong>Social Engineering :</strong> Info pour phishing ciblé (spear phishing)</li>
                <li><strong>Veille concurrentielle :</strong> Recrutements, départs, compétences recherchées</li>
                <li><strong>Analyse turnover :</strong> Départs massifs = problèmes internes</li>
                <li><strong>Stack tech :</strong> Technologies via compétences employés</li>
                <li><strong>Investigations :</strong> Vérifier identité, parcours, connexions</li>
              </ul>
              <h3 style={{ color: colors.accent, fontSize: "1.5rem", marginBottom: "15px" }}>📊 Informations extractibles</h3>
              <div style={{ background: colors.bgPrimary, padding: "20px", borderRadius: "8px", marginBottom: "15px" }}>
                <h4 style={{ color: colors.accent, marginBottom: "10px" }}>Profil individuel</h4>
                <p style={{ color: colors.textSecondary, lineHeight: "1.6", margin: 0 }}>Nom, photo, poste, entreprise, localisation, historique complet (postes, dates), formation (universités, diplômes), compétences, certifications, langues, recommandations, publications, articles, centres d'intérêt, bénévolat.</p>
              </div>
              <div style={{ background: colors.bgPrimary, padding: "20px", borderRadius: "8px", marginBottom: "15px" }}>
                <h4 style={{ color: colors.accent, marginBottom: "10px" }}>Page entreprise</h4>
                <p style={{ color: colors.textSecondary, lineHeight: "1.6", margin: 0 }}>Effectifs total, répartition géographique, croissance, postes ouverts, employés par département, nouveaux arrivants, départs, alumni.</p>
              </div>
              <div style={{ background: colors.bgPrimary, padding: "20px", borderRadius: "8px" }}>
                <h4 style={{ color: colors.accent, marginBottom: "10px" }}>Réseau</h4>
                <p style={{ color: colors.textSecondary, lineHeight: "1.6", margin: 0 }}>Connexions communes, groupes, personnes/entreprises/hashtags suivis.</p>
              </div>
              <div style={{ background: "#ef444420", border: "2px solid #ef4444", padding: "20px", borderRadius: "8px", marginTop: "20px" }}>
                <p style={{ color: colors.textSecondary, lineHeight: "1.6", margin: 0 }}><strong style={{ color: "#ef4444" }}>⚠️ Éthique :</strong> Scraping massif viole CGU. LinkedIn poursuit les scrapers. Privilégier : recherche manuelle, Sales Navigator officiel, données publiques.</p>
              </div>
            </div>
          )}

          {activeTab === "tools" && (
            <div>
              <h2 style={{ color: colors.textPrimary, fontSize: "2rem", marginBottom: "20px" }}>🔧 Outils LinkedIn</h2>
              <h3 style={{ color: colors.accent, fontSize: "1.5rem", marginBottom: "15px" }}>Recherche avancée native</h3>
              <div style={{ background: colors.bgPrimary, padding: "15px", borderRadius: "8px", marginBottom: "20px", fontFamily: "monospace", fontSize: "0.9rem" }}>
                <div style={{ marginBottom: "10px", color: colors.textSecondary }}><strong style={{ color: colors.accent }}>company:"Microsoft"</strong> → Employés Microsoft</div>
                <div style={{ marginBottom: "10px", color: colors.textSecondary }}><strong style={{ color: colors.accent }}>school:"Stanford"</strong> → Alumni Stanford</div>
                <div style={{ marginBottom: "10px", color: colors.textSecondary }}><strong style={{ color: colors.accent }}>location:"Paris"</strong> → Profils Paris</div>
                <div style={{ color: colors.textSecondary }}><strong style={{ color: colors.accent }}>title:"CISO"</strong> → Responsables sécurité</div>
              </div>
              <h3 style={{ color: colors.accent, fontSize: "1.5rem", marginBottom: "15px" }}>Google Dorks</h3>
              <div style={{ background: colors.bgPrimary, padding: "15px", borderRadius: "8px", marginBottom: "20px", fontFamily: "monospace", fontSize: "0.85rem" }}>
                <div style={{ marginBottom: "10px", color: colors.textSecondary }}>site:linkedin.com/in "CISO" "Paris"</div>
                <div style={{ color: colors.textSecondary }}>site:linkedin.com/company "cybersecurity"</div>
              </div>
              <h3 style={{ color: colors.accent, fontSize: "1.5rem", marginBottom: "15px" }}>Outils tiers</h3>
              <p style={{ color: colors.textSecondary, marginBottom: "10px" }}><strong>Sales Navigator :</strong> Outil officiel LinkedIn, filtres avancés (~80€/mois)</p>
              <p style={{ color: colors.textSecondary, marginBottom: "10px" }}><strong>CrossLinked :</strong> Scraper Python open-source pour lister employés d'une entreprise</p>
              <div style={{ background: colors.bgPrimary, padding: "15px", borderRadius: "8px", fontFamily: "monospace", fontSize: "0.85rem", marginBottom: "10px" }}>
                <div style={{ color: colors.textSecondary }}>git clone https://github.com/m8r0wn/CrossLinked</div>
                <div style={{ color: colors.textSecondary, marginTop: "5px" }}>python3 crosslinked.py -f '{f}.{l}@domain.com' company_name</div>
              </div>
              <p style={{ color: colors.textSecondary, marginBottom: "10px" }}><strong>theHarvester :</strong> Collecte emails et noms depuis LinkedIn</p>
              <p style={{ color: colors.textSecondary }}><strong>PhantomBuster :</strong> Automatisation LinkedIn (extraction, scraping) - payant</p>
            </div>
          )}

          {activeTab === "exercises" && (
            <div>
              <h2 style={{ color: colors.textPrimary, fontSize: "2rem", marginBottom: "20px" }}>💡 Exercices Pratiques</h2>
              <div style={{ background: colors.bgPrimary, padding: "25px", borderRadius: "12px", marginBottom: "20px" }}>
                <h3 style={{ color: colors.accent, fontSize: "1.3rem", marginBottom: "15px" }}>Exercice 1 : Cartographie CISO</h3>
                <p style={{ color: colors.textSecondary, marginBottom: "15px" }}><strong>Objectif :</strong> Identifier tous les responsables sécurité (CISO) d'une entreprise du CAC40</p>
                <p style={{ color: colors.textSecondary, marginBottom: "10px" }}><strong>Méthode :</strong></p>
                <ol style={{ color: colors.textSecondary, lineHeight: "1.8", marginLeft: "20px" }}>
                  <li>Rechercher company:"NomEntreprise" title:"CISO"</li>
                  <li>Noter : nom, poste précis, ancienneté, localisation</li>
                  <li>Analyser parcours : formations cyber, certifications (CISSP, CISM)</li>
                  <li>Créer organigramme sécurité avec hiérarchie</li>
                </ol>
              </div>
              <div style={{ background: colors.bgPrimary, padding: "25px", borderRadius: "12px", marginBottom: "20px" }}>
                <h3 style={{ color: colors.accent, fontSize: "1.3rem", marginBottom: "15px" }}>Exercice 2 : Analyse de turnover</h3>
                <p style={{ color: colors.textSecondary, marginBottom: "15px" }}><strong>Objectif :</strong> Détecter départs massifs révélant problèmes internes</p>
                <p style={{ color: colors.textSecondary, marginBottom: "10px" }}><strong>Méthode :</strong></p>
                <ol style={{ color: colors.textSecondary, lineHeight: "1.8", marginLeft: "20px" }}>
                  <li>Chercher anciens employés d'une startup tech</li>
                  <li>Filtrer ceux partis dans les 6 derniers mois</li>
                  <li>Compter nombre de départs par département</li>
                  <li>Analyser : problèmes management ? Rachat ? Faillite ?</li>
                </ol>
              </div>
              <div style={{ background: colors.bgPrimary, padding: "25px", borderRadius: "12px" }}>
                <h3 style={{ color: colors.accent, fontSize: "1.3rem", marginBottom: "15px" }}>Exercice 3 : Stack technologique</h3>
                <p style={{ color: colors.textSecondary, marginBottom: "15px" }}><strong>Objectif :</strong> Identifier technologies utilisées par concurrent</p>
                <p style={{ color: colors.textSecondary, marginBottom: "10px" }}><strong>Méthode :</strong></p>
                <ol style={{ color: colors.textSecondary, lineHeight: "1.8", marginLeft: "20px" }}>
                  <li>Lister développeurs de l'entreprise cible</li>
                  <li>Analyser compétences listées : Python, AWS, Kubernetes, React...</li>
                  <li>Regarder certifications : AWS Certified, GCP, Azure</li>
                  <li>Croiser avec offres d'emploi pour confirmer stack tech</li>
                </ol>
                <p style={{ color: "#ef4444", marginTop: "15px", fontWeight: "600" }}>⚠️ Usage éthique uniquement - veille concurrentielle légale</p>
              </div>
            </div>
          )}

          {activeTab === "quiz" && (
            <div>
              <h2 style={{ color: colors.textPrimary, fontSize: "2rem", marginBottom: "20px" }}>🎯 Quiz de validation</h2>
              {quizQuestions.map((q, index) => (
                <div key={q.id} style={{ background: colors.bgPrimary, padding: "20px", borderRadius: "12px", marginBottom: "20px" }}>
                  <h3 style={{ color: colors.textPrimary, fontSize: "1.1rem", marginBottom: "15px" }}>{index + 1}. {q.question}</h3>
                  {q.options.map((option, optIndex) => (
                    <label key={optIndex} style={{ display: "block", padding: "12px", marginBottom: "8px", background: quizAnswers[q.id] === optIndex.toString() ? colors.accent + "30" : colors.bgSecondary, border: `2px solid ${quizAnswers[q.id] === optIndex.toString() ? colors.accent : colors.border}`, borderRadius: "8px", cursor: "pointer" }}>
                      <input type="radio" name={`question-${q.id}`} value={optIndex} checked={quizAnswers[q.id] === optIndex.toString()} onChange={(e) => setQuizAnswers({ ...quizAnswers, [q.id]: e.target.value })} style={{ marginRight: "10px" }} />
                      <span style={{ color: colors.textPrimary }}>{option}</span>
                    </label>
                  ))}
                </div>
              ))}
              <div style={{ display: "flex", gap: "15px" }}>
                <button onClick={handleQuizSubmit} disabled={Object.keys(quizAnswers).length !== quizQuestions.length} style={{ padding: "15px 40px", background: Object.keys(quizAnswers).length === quizQuestions.length ? colors.accent : colors.border, color: "#020617", border: "none", borderRadius: "8px", fontSize: "1.1rem", fontWeight: "600", cursor: Object.keys(quizAnswers).length === quizQuestions.length ? "pointer" : "not-allowed" }}>Valider</button>
                <button onClick={() => setShowResetModal(true)} style={{ padding: "15px 40px", background: "#0b0f1a", color: "#00ff9c", border: "2px solid #00ff9c", borderRadius: "8px", fontSize: "1.1rem", fontWeight: "600", cursor: "pointer" }} onMouseEnter={(e) => { e.currentTarget.style.background = "#00ff9c"; e.currentTarget.style.color = "#0b0f1a"; }} onMouseLeave={(e) => { e.currentTarget.style.background = "#0b0f1a"; e.currentTarget.style.color = "#00ff9c"; }}>🔄 Reset</button>
              </div>
              {showResults && (
                <div style={{ marginTop: "30px", padding: "25px", background: getScore() >= 4 ? colors.accent + "20" : "#ef444420", border: `2px solid ${getScore() >= 4 ? colors.accent : "#ef4444"}`, borderRadius: "12px" }}>
                  <h3 style={{ color: getScore() >= 4 ? colors.accent : "#ef4444", fontSize: "1.5rem" }}>{getScore() >= 4 ? "✅ Validé !" : "❌ Réessayez"}</h3>
                  <p style={{ color: colors.textPrimary, fontSize: "1.2rem" }}>Score : {getScore()}/{quizQuestions.length}</p>
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

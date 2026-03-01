import { useState } from "react";
import { useThemeColors } from "../context/ThemeContext";

export default function LinkedInModule() {
  const colors = useThemeColors();
  const [activeTab, setActiveTab] = useState("theory");
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);

  const tabs = [
    { id: "theory", label: "📖 Théorie", icon: "📚" },
    { id: "tools", label: "🔧 Outils", icon: "⚙️" },
    { id: "exercises", label: "💡 Exercices", icon: "✍️" },
    { id: "quiz", label: "🎯 Quiz", icon: "✅" },
  ];

  const quizQuestions = [
    {
      id: 1,
      question: "Quelle information peut-on extraire d'un profil LinkedIn ?",
      options: [
        "Parcours professionnel, compétences, connexions",
        "Numéro de carte bancaire",
        "Mot de passe email",
        "Historique de navigation"
      ],
      correct: 0
    },
    {
      id: 2,
      question: "Comment rechercher des employés d'une entreprise spécifique sur LinkedIn ?",
      options: [
        'Utiliser "company:NomEntreprise" dans la recherche',
        "Envoyer un email à LinkedIn",
        "Utiliser Google Dorks",
        "Créer un faux profil"
      ],
      correct: 0
    },
    {
      id: 3,
      question: "Qu'est-ce que le 'Social Engineering' via LinkedIn ?",
      options: [
        "Manipulation psychologique pour obtenir des informations",
        "Un algorithme de recommandation",
        "Un outil de recrutement",
        "Une fonctionnalité premium"
      ],
      correct: 0
    },
    {
      id: 4,
      question: "Quel Google Dork permet de trouver des profils LinkedIn ?",
      options: [
        'site:linkedin.com/in "Titre du poste"',
        'site:facebook.com "LinkedIn"',
        'inurl:linkedin "profile"',
        'search:linkedin.com'
      ],
      correct: 0
    },
    {
      id: 5,
      question: "Est-il légal de scraper des profils LinkedIn en masse ?",
      options: [
        "Non, cela viole les CGU de LinkedIn",
        "Oui, c'est autorisé",
        "Oui, si on a un compte premium",
        "Oui, pour un usage personnel"
      ],
      correct: 0
    }
  ];

  const handleQuizSubmit = () => {
    setShowResults(true);
  };

  const getScore = () => {
    let correct = 0;
    quizQuestions.forEach(q => {
      if (quizAnswers[q.id] === q.correct.toString()) {
        correct++;
      }
    });
    return correct;
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: colors.bgPrimary,
      paddingTop: "80px",
    }}>
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "40px 20px",
      }}>
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div style={{ fontSize: "4rem", marginBottom: "15px" }}>💼</div>
          <h1 style={{
            fontSize: "2.5rem",
            fontWeight: "700",
            color: colors.textPrimary,
            marginBottom: "15px",
          }}>
            Module LinkedIn OSINT
          </h1>
          <p style={{
            fontSize: "1.1rem",
            color: colors.textSecondary,
            maxWidth: "700px",
            margin: "0 auto",
          }}>
            Investigations professionnelles et reconnaissance d'entreprise via LinkedIn
          </p>
        </div>

        <div style={{
          display: "flex",
          justifyContent: "center",
          gap: "15px",
          marginBottom: "40px",
          flexWrap: "wrap",
        }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: "12px 24px",
                background: activeTab === tab.id ? colors.accent : colors.bgSecondary,
                color: activeTab === tab.id ? "#fff" : colors.textPrimary,
                border: `2px solid ${activeTab === tab.id ? colors.accent : colors.border}`,
                borderRadius: "12px",
                fontSize: "1rem",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        <div style={{
          background: colors.bgSecondary,
          border: `1px solid ${colors.border}`,
          borderRadius: "12px",
          padding: "40px",
        }}>
          {activeTab === "theory" && (
            <div>
              <h2 style={{ color: colors.textPrimary, fontSize: "2rem", marginBottom: "20px" }}>
                📖 LinkedIn OSINT : Pourquoi ?
              </h2>
              
              <p style={{ color: colors.textSecondary, lineHeight: "1.8", marginBottom: "20px" }}>
                LinkedIn est la plus grande base de données professionnelle au monde avec plus de 900 millions d'utilisateurs. C'est une mine d'or pour l'OSINT car les utilisateurs y partagent volontairement des informations détaillées sur leur carrière, leurs compétences, et leurs connexions professionnelles.
              </p>

              <h3 style={{ color: colors.accent, fontSize: "1.5rem", marginBottom: "15px", marginTop: "30px" }}>
                🎯 Cas d'usage en OSINT
              </h3>

              <ul style={{ color: colors.textSecondary, lineHeight: "1.8", marginLeft: "20px" }}>
                <li><strong>Reconnaissance d'entreprise :</strong> Identifier les employés, leur hiérarchie, et les technologies utilisées</li>
                <li><strong>Social Engineering :</strong> Trouver des cibles potentielles pour des attaques de phishing ciblées</li>
                <li><strong>Investigations :</strong> Retracer le parcours professionnel d'une personne</li>
                <li><strong>Analyse concurrentielle :</strong> Comprendre la structure d'une entreprise rivale</li>
                <li><strong>Recherche de personnes :</strong> Localiser des individus via leurs employeurs actuels ou passés</li>
              </ul>

              <h3 style={{ color: colors.accent, fontSize: "1.5rem", marginBottom: "15px", marginTop: "30px" }}>
                🔑 Informations extractibles
              </h3>

              <div style={{ background: colors.bgPrimary, padding: "20px", borderRadius: "8px", marginBottom: "15px" }}>
                <h4 style={{ color: colors.accent, marginBottom: "10px" }}>Profil individuel</h4>
                <ul style={{ color: colors.textSecondary, lineHeight: "1.6", margin: 0 }}>
                  <li>Nom complet et photo</li>
                  <li>Poste actuel et entreprise</li>
                  <li>Historique professionnel complet</li>
                  <li>Formation et diplômes</li>
                  <li>Compétences techniques</li>
                  <li>Recommandations et endorsements</li>
                  <li>Articles publiés et activité</li>
                </ul>
              </div>

              <div style={{ background: colors.bgPrimary, padding: "20px", borderRadius: "8px", marginBottom: "15px" }}>
                <h4 style={{ color: colors.accent, marginBottom: "10px" }}>Entreprise</h4>
                <ul style={{ color: colors.textSecondary, lineHeight: "1.6", margin: 0 }}>
                  <li>Liste des employés (partielle ou complète)</li>
                  <li>Structure hiérarchique</li>
                  <li>Technologies utilisées (via compétences des employés)</li>
                  <li>Turnover et recrutements récents</li>
                  <li>Localisation des bureaux</li>
                  <li>Partenaires et clients (via connexions)</li>
                </ul>
              </div>

              <div style={{ background: colors.bgPrimary, padding: "20px", borderRadius: "8px" }}>
                <h4 style={{ color: colors.accent, marginBottom: "10px" }}>⚠️ Considérations éthiques et légales</h4>
                <p style={{ color: colors.textSecondary, lineHeight: "1.6", margin: 0 }}>
                  Le scraping massif de LinkedIn viole leurs conditions d'utilisation. LinkedIn a gagné plusieurs procès contre des entreprises pratiquant le scraping. Limitez-vous à la consultation manuelle ou utilisez l'API officielle avec permission.
                </p>
              </div>
            </div>
          )}

          {activeTab === "tools" && (
            <div>
              <h2 style={{ color: colors.textPrimary, fontSize: "2rem", marginBottom: "20px" }}>
                🔧 Techniques et Outils
              </h2>

              <h3 style={{ color: colors.accent, fontSize: "1.5rem", marginBottom: "15px" }}>
                📌 Recherche avancée LinkedIn
              </h3>

              <p style={{ color: colors.textSecondary, lineHeight: "1.8", marginBottom: "15px" }}>
                LinkedIn propose des opérateurs de recherche puissants :
              </p>

              <div style={{ background: colors.bgPrimary, padding: "15px", borderRadius: "8px", marginBottom: "15px", fontFamily: "monospace" }}>
                <div style={{ marginBottom: "10px" }}>
                  <strong style={{ color: colors.accent }}>Recherche de personnes :</strong>
                  <p style={{ color: colors.textSecondary, margin: "5px 0 0 0", fontSize: "0.9rem" }}>
                    • Titre : "Chief Technology Officer"<br/>
                    • Entreprise : company:"Microsoft"<br/>
                    • Localisation : location:"Paris, France"<br/>
                    • École : school:"Stanford University"
                  </p>
                </div>
              </div>

              <h3 style={{ color: colors.accent, fontSize: "1.5rem", marginBottom: "15px", marginTop: "30px" }}>
                🌐 Google Dorks pour LinkedIn
              </h3>

              <div style={{ background: colors.bgPrimary, padding: "15px", borderRadius: "8px", marginBottom: "15px", fontFamily: "monospace", fontSize: "0.95rem" }}>
                <div style={{ marginBottom: "15px" }}>
                  <code style={{ color: colors.accent }}>site:linkedin.com/in "CISO" "Paris"</code>
                  <p style={{ color: colors.textSecondary, margin: "5px 0 0 0" }}>Trouver des CISO à Paris</p>
                </div>
                <div style={{ marginBottom: "15px" }}>
                  <code style={{ color: colors.accent }}>site:linkedin.com/in intitle:"software engineer" "Amazon"</code>
                  <p style={{ color: colors.textSecondary, margin: "5px 0 0 0" }}>Ingénieurs logiciels chez Amazon</p>
                </div>
                <div style={{ marginBottom: "15px" }}>
                  <code style={{ color: colors.accent }}>site:linkedin.com/company/microsoft/people</code>
                  <p style={{ color: colors.textSecondary, margin: "5px 0 0 0" }}>Page des employés Microsoft</p>
                </div>
                <div>
                  <code style={{ color: colors.accent }}>site:linkedin.com "currently works at" "Google"</code>
                  <p style={{ color: colors.textSecondary, margin: "5px 0 0 0" }}>Employés actuels de Google</p>
                </div>
              </div>

              <h3 style={{ color: colors.accent, fontSize: "1.5rem", marginBottom: "15px", marginTop: "30px" }}>
                🛠️ Outils OSINT pour LinkedIn
              </h3>

              <div style={{ background: colors.bgPrimary, padding: "20px", borderRadius: "8px", marginBottom: "15px" }}>
                <h4 style={{ color: colors.accent, marginBottom: "10px" }}>LinkedIn Sales Navigator</h4>
                <p style={{ color: colors.textSecondary, lineHeight: "1.6", marginBottom: "10px" }}>
                  Outil officiel LinkedIn (payant) offrant des filtres avancés et des exports limités.
                </p>
                <p style={{ color: colors.textSecondary, fontSize: "0.9rem" }}>
                  💰 Prix : ~80€/mois
                </p>
              </div>

              <div style={{ background: colors.bgPrimary, padding: "20px", borderRadius: "8px", marginBottom: "15px" }}>
                <h4 style={{ color: colors.accent, marginBottom: "10px" }}>PhantomBuster</h4>
                <p style={{ color: colors.textSecondary, lineHeight: "1.6", marginBottom: "10px" }}>
                  Automatisation d'extraction de profils LinkedIn (risque de bannissement).
                </p>
                <p style={{ color: colors.textSecondary, fontSize: "0.9rem" }}>
                  ⚠️ Usage : À vos risques et périls
                </p>
              </div>

              <div style={{ background: colors.bgPrimary, padding: "20px", borderRadius: "8px", marginBottom: "15px" }}>
                <h4 style={{ color: colors.accent, marginBottom: "10px" }}>CrossLinked</h4>
                <p style={{ color: colors.textSecondary, lineHeight: "1.6", marginBottom: "10px" }}>
                  Outil open-source pour scraper les employés d'une entreprise via Google + LinkedIn.
                </p>
                <code style={{ background: colors.bgSecondary, padding: "10px", borderRadius: "4px", display: "block", marginTop: "10px" }}>
                  python3 crosslinked.py -f "NomEntreprise"
                </code>
              </div>

              <div style={{ background: colors.bgPrimary, padding: "20px", borderRadius: "8px" }}>
                <h4 style={{ color: colors.accent, marginBottom: "10px" }}>theHarvester</h4>
                <p style={{ color: colors.textSecondary, lineHeight: "1.6", marginBottom: "10px" }}>
                  Collecte d'emails et de noms depuis LinkedIn via moteurs de recherche.
                </p>
                <code style={{ background: colors.bgSecondary, padding: "10px", borderRadius: "4px", display: "block", marginTop: "10px" }}>
                  theHarvester -d example.com -l 500 -b linkedin
                </code>
              </div>
            </div>
          )}

          {activeTab === "exercises" && (
            <div>
              <h2 style={{ color: colors.textPrimary, fontSize: "2rem", marginBottom: "20px" }}>
                💡 Exercices Pratiques
              </h2>

              <div style={{ background: colors.bgPrimary, padding: "25px", borderRadius: "12px", marginBottom: "20px" }}>
                <h3 style={{ color: colors.accent, fontSize: "1.3rem", marginBottom: "15px" }}>
                  Exercice 1 : Cartographie d'entreprise
                </h3>
                <p style={{ color: colors.textSecondary, lineHeight: "1.8", marginBottom: "15px" }}>
                  <strong>Objectif :</strong> Identifier tous les employés "Security" d'une grande entreprise tech.
                </p>
                <p style={{ color: colors.textSecondary, lineHeight: "1.8", marginBottom: "10px" }}>
                  <strong>Étapes :</strong>
                </p>
                <ol style={{ color: colors.textSecondary, lineHeight: "1.8" }}>
                  <li>Recherchez "Security Engineer" + "NomEntreprise" sur LinkedIn</li>
                  <li>Notez les titres exacts (CISO, Security Analyst, etc.)</li>
                  <li>Identifiez les technologies mentionnées dans les profils</li>
                  <li>Créez un organigramme approximatif de l'équipe sécurité</li>
                </ol>
              </div>

              <div style={{ background: colors.bgPrimary, padding: "25px", borderRadius: "12px", marginBottom: "20px" }}>
                <h3 style={{ color: colors.accent, fontSize: "1.3rem", marginBottom: "15px" }}>
                  Exercice 2 : Recherche de cibles pour phishing
                </h3>
                <p style={{ color: colors.textSecondary, lineHeight: "1.8", marginBottom: "15px" }}>
                  <strong>Objectif :</strong> (Exercice théorique uniquement) Identifier des profils vulnérables.
                </p>
                <p style={{ color: colors.textSecondary, lineHeight: "1.8", marginBottom: "10px" }}>
                  <strong>Critères à rechercher :</strong>
                </p>
                <ul style={{ color: colors.textSecondary, lineHeight: "1.8" }}>
                  <li>Employés récemment embauchés (moins sensibilisés)</li>
                  <li>Postes administratifs (accès aux systèmes sensibles)</li>
                  <li>Personnes partageant beaucoup d'informations personnelles</li>
                  <li>Profils avec emails visibles publiquement</li>
                </ul>
                <p style={{ color: "#ef4444", marginTop: "15px", fontWeight: "600" }}>
                  ⚠️ NE JAMAIS mettre en pratique pour de vraies attaques !
                </p>
              </div>

              <div style={{ background: colors.bgPrimary, padding: "25px", borderRadius: "12px" }}>
                <h3 style={{ color: colors.accent, fontSize: "1.3rem", marginBottom: "15px" }}>
                  Exercice 3 : Analyse de turnover
                </h3>
                <p style={{ color: colors.textSecondary, lineHeight: "1.8", marginBottom: "15px" }}>
                  <strong>Objectif :</strong> Détecter un turnover élevé dans une entreprise (signe de problèmes internes).
                </p>
                <p style={{ color: colors.textSecondary, lineHeight: "1.8", marginBottom: "10px" }}>
                  <strong>Méthode :</strong>
                </p>
                <ol style={{ color: colors.textSecondary, lineHeight: "1.8" }}>
                  <li>Recherchez des profils ayant travaillé dans l'entreprise cible</li>
                  <li>Filtrez par "Date de fin" récente (derniers 6 mois)</li>
                  <li>Analysez les raisons de départ (si mentionnées)</li>
                  <li>Comparez avec le nombre d'offres d'emploi actuelles</li>
                </ol>
              </div>
            </div>
          )}

          {activeTab === "quiz" && (
            <div>
              <h2 style={{ color: colors.textPrimary, fontSize: "2rem", marginBottom: "20px" }}>
                🎯 Quiz de validation
              </h2>

              {quizQuestions.map((q, index) => (
                <div key={q.id} style={{ background: colors.bgPrimary, padding: "20px", borderRadius: "12px", marginBottom: "20px" }}>
                  <h3 style={{ color: colors.textPrimary, fontSize: "1.1rem", marginBottom: "15px" }}>
                    {index + 1}. {q.question}
                  </h3>
                  {q.options.map((option, optIndex) => (
                    <label
                      key={optIndex}
                      style={{
                        display: "block",
                        padding: "12px",
                        marginBottom: "8px",
                        background: quizAnswers[q.id] === optIndex.toString() ? colors.accent + "30" : colors.bgSecondary,
                        border: `2px solid ${quizAnswers[q.id] === optIndex.toString() ? colors.accent : colors.border}`,
                        borderRadius: "8px",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                      }}
                    >
                      <input
                        type="radio"
                        name={`question-${q.id}`}
                        value={optIndex}
                        checked={quizAnswers[q.id] === optIndex.toString()}
                        onChange={(e) => setQuizAnswers({ ...quizAnswers, [q.id]: e.target.value })}
                        style={{ marginRight: "10px" }}
                      />
                      <span style={{ color: colors.textPrimary }}>{option}</span>
                    </label>
                  ))}
                </div>
              ))}

              <button
                onClick={handleQuizSubmit}
                disabled={Object.keys(quizAnswers).length !== quizQuestions.length}
                style={{
                  padding: "15px 40px",
                  background: Object.keys(quizAnswers).length === quizQuestions.length ? colors.accent : colors.border,
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "1.1rem",
                  fontWeight: "600",
                  cursor: Object.keys(quizAnswers).length === quizQuestions.length ? "pointer" : "not-allowed",
                }}
              >
                Valider le quiz
              </button>

              {showResults && (
                <div style={{
                  marginTop: "30px",
                  padding: "25px",
                  background: getScore() >= 4 ? colors.accent + "20" : "#ef444420",
                  border: `2px solid ${getScore() >= 4 ? colors.accent : "#ef4444"}`,
                  borderRadius: "12px",
                }}>
                  <h3 style={{ color: getScore() >= 4 ? colors.accent : "#ef4444", fontSize: "1.5rem", marginBottom: "10px" }}>
                    {getScore() >= 4 ? "✅ Félicitations !" : "❌ Pas encore..."}
                  </h3>
                  <p style={{ color: colors.textPrimary, fontSize: "1.2rem" }}>
                    Score : {getScore()}/{quizQuestions.length}
                  </p>
                  <p style={{ color: colors.textSecondary, marginTop: "10px" }}>
                    {getScore() >= 4 
                      ? "Vous avez validé ce module ! 🎉" 
                      : "Révisez le module et réessayez."}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

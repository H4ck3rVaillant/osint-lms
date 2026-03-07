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
    { id: 1, question: "Combien d'utilisateurs LinkedIn compte-t-il mondialement ?", options: ["900+ millions", "500 millions", "1.5 milliard", "300 millions"], correct: 0 },
    { id: 2, question: "Quel opérateur booléen permet de rechercher par entreprise sur LinkedIn ?", options: ['company:"Nom Entreprise"', 'org:"Nom"', 'employer:"Nom"', 'work:"Nom"'], correct: 0 },
    { id: 3, question: "Quel outil Python permet de scraper les employés LinkedIn ?", options: ["CrossLinked", "LinkedHarvest", "ProfileScraper", "LinkedBot"], correct: 0 },
    { id: 4, question: "Le scraping automatisé de LinkedIn est-il légal ?", options: ["Non, viole les CGU LinkedIn", "Oui avec compte premium", "Oui pour usage personnel", "Oui sans restriction"], correct: 0 },
    { id: 5, question: "Quelle information n'est PAS disponible sur un profil LinkedIn public ?", options: ["Numéro de téléphone personnel", "Parcours professionnel", "Compétences validées", "Formations académiques"], correct: 0 }
  ];

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
    <div style={{ minHeight: "100vh", background: colors.bgPrimary, paddingTop: "80px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 20px" }}>
        
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div style={{ fontSize: "4rem", marginBottom: "15px" }}>💼</div>
          <h1 style={{ fontSize: "2.5rem", fontWeight: "700", color: colors.textPrimary, marginBottom: "15px" }}>
            Module LinkedIn OSINT
          </h1>
          <p style={{ fontSize: "1.1rem", color: colors.textSecondary, maxWidth: "700px", margin: "0 auto" }}>
            Maîtrisez la reconnaissance professionnelle et le mapping d'entreprise
          </p>
          {localStorage.getItem(BADGE_KEY) === "true" && (
            <div style={{
              marginTop: "15px",
              display: "inline-block",
              padding: "8px 20px",
              background: colors.accent + "20",
              border: `2px solid ${colors.accent}`,
              borderRadius: "20px",
              color: colors.accent,
              fontWeight: "600",
              fontSize: "0.9rem"
            }}>
              ✓ Badge Expert LinkedIn débloqué
            </div>
          )}
        </div>

        <div style={{
          display: "flex",
          justifyContent: "center",
          gap: "15px",
          marginBottom: "40px",
          flexWrap: "wrap"
        }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: "12px 24px",
                background: activeTab === tab.id ? colors.accent : colors.bgSecondary,
                color: activeTab === tab.id ? "#020617" : colors.textPrimary,
                border: `2px solid ${activeTab === tab.id ? colors.accent : colors.border}`,
                borderRadius: "12px",
                fontSize: "1rem",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                if (activeTab !== tab.id) {
                  e.currentTarget.style.borderColor = colors.accent;
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== tab.id) {
                  e.currentTarget.style.borderColor = colors.border;
                }
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
          padding: "40px"
        }}>
          
          {activeTab === "theory" && (
            <div>
              <h2 style={{ color: colors.textPrimary, fontSize: "2rem", marginBottom: "20px" }}>
                📖 LinkedIn : Le Réseau Professionnel en OSINT
              </h2>
              
              <p style={{ color: colors.textSecondary, lineHeight: "1.8", marginBottom: "20px" }}>
                LinkedIn est le plus grand réseau professionnel mondial avec <strong>plus de 900 millions d'utilisateurs</strong> répartis dans plus de 200 pays et territoires. Contrairement aux réseaux sociaux généralistes, LinkedIn se concentre exclusivement sur les <strong>parcours professionnels, compétences techniques, certifications, réseaux d'affaires et recrutement</strong>.
              </p>

              <p style={{ color: colors.textSecondary, lineHeight: "1.8", marginBottom: "30px" }}>
                Cette concentration d'informations professionnelles volontairement partagées par les utilisateurs fait de LinkedIn une <strong>ressource OSINT exceptionnelle</strong> pour la reconnaissance d'entreprise, l'identification de décideurs, l'analyse de stack technologique et la préparation de campagnes de social engineering ciblées.
              </p>

              <h3 style={{ color: colors.accent, fontSize: "1.5rem", marginBottom: "15px", marginTop: "30px" }}>
                🎯 Cas d'usage stratégiques en OSINT
              </h3>
              <ul style={{ color: colors.textSecondary, lineHeight: "1.8", marginLeft: "20px", marginBottom: "25px" }}>
                <li><strong>Reconnaissance organisationnelle :</strong> Cartographier la structure hiérarchique complète d'une entreprise cible, identifier les décideurs clés (C-level, VP, Directors), recenser les employés actuels et anciens pour détecter le turnover</li>
                <li><strong>Social Engineering avancé :</strong> Collecter des données précises pour élaborer des scénarios de phishing ultra-ciblés (spear phishing) : postes occupés, responsabilités quotidiennes, projets en cours mentionnés, collègues directs identifiables</li>
                <li><strong>Veille concurrentielle stratégique :</strong> Surveiller les recrutements massifs signalant une expansion, repérer les départs groupés révélant des difficultés, identifier les compétences activement recherchées par les concurrents, détecter les nouvelles orientations stratégiques</li>
                <li><strong>Analyse de stack technologique :</strong> Déduire les technologies et outils utilisés en croisant les compétences listées par les développeurs, ingénieurs DevOps, architectes techniques (langages, frameworks, cloud providers, outils CI/CD)</li>
                <li><strong>Mapping de réseau professionnel :</strong> Tracer les connexions entre individus, identifier les entreprises partenaires via les parcours croisés, repérer les consultants et prestataires externes</li>
              </ul>

              <h3 style={{ color: colors.accent, fontSize: "1.5rem", marginBottom: "15px", marginTop: "30px" }}>
                📊 Types de données exploitables
              </h3>
              
              <div style={{ background: colors.bgPrimary, padding: "20px", borderRadius: "8px", marginBottom: "15px", border: `1px solid ${colors.border}` }}>
                <h4 style={{ color: colors.accent, marginBottom: "10px", fontSize: "1.2rem" }}>🧑 Profil individuel</h4>
                <p style={{ color: colors.textSecondary, lineHeight: "1.7", margin: 0 }}>
                  Nom complet et prénom, photo professionnelle haute résolution, poste actuel avec description détaillée des responsabilités, entreprise actuelle et localisation précise (ville, pays), historique professionnel chronologique complet (entreprises précédentes, dates exactes d'embauche/départ, titres de poste, missions accomplies), formations académiques complètes (diplômes obtenus, établissements fréquentés, années d'études, spécialisations), compétences techniques validées et endorsées par des pairs, certifications professionnelles obtenues avec organismes certificateurs, langues parlées avec niveaux de maîtrise, recommandations écrites détaillées par collègues et managers, publications professionnelles et articles partagés, groupes professionnels d'appartenance révélant centres d'intérêt sectoriels.
                </p>
              </div>

              <div style={{ background: colors.bgPrimary, padding: "20px", borderRadius: "8px", marginBottom: "15px", border: `1px solid ${colors.border}` }}>
                <h4 style={{ color: colors.accent, marginBottom: "10px", fontSize: "1.2rem" }}>🏢 Page entreprise</h4>
                <p style={{ color: colors.textSecondary, lineHeight: "1.7", margin: 0 }}>
                  Nombre total d'employés avec évolution temporelle (croissance ou décroissance), répartition géographique des bureaux et centres opérationnels, tendance de recrutement ou de licenciements (analyse des variations d'effectif), postes actuellement ouverts classés par département, liste des employés filtrables par département (Sales, Engineering, Marketing, HR, Operations), nouveaux arrivants des 30-90 derniers jours, départs récents détectables via filtrage "anciens employés", technologies explicitement mentionnées dans les descriptions de postes ouverts, partenaires et clients mentionnés dans les actualités de l'entreprise.
                </p>
              </div>

              <div style={{ background: colors.bgPrimary, padding: "20px", borderRadius: "8px", border: `1px solid ${colors.border}` }}>
                <h4 style={{ color: colors.accent, marginBottom: "10px", fontSize: "1.2rem" }}>🔗 Réseau et activité publique</h4>
                <p style={{ color: colors.textSecondary, lineHeight: "1.7", margin: 0 }}>
                  Connexions professionnelles visibles jusqu'au 3ème degré (connexions de connexions), groupes professionnels d'appartenance révélant les secteurs d'intérêt et expertise, publications et posts publics sur des sujets professionnels ou sectoriels, commentaires laissés sous des articles ou posts d'autres membres, recommandations données et reçues avec contexte professionnel, événements professionnels participés (conférences, salons, webinaires), réactions (likes, partages) sur des contenus spécifiques révélant des intérêts.
                </p>
              </div>
            </div>
          )}

          {activeTab === "tools" && (
            <div>
              <h2 style={{ color: colors.textPrimary, fontSize: "2rem", marginBottom: "20px" }}>
                🔧 Outils et Techniques LinkedIn OSINT
              </h2>

              <h3 style={{ color: colors.accent, fontSize: "1.5rem", marginBottom: "15px" }}>
                📌 Recherche avancée native LinkedIn
              </h3>
              <p style={{ color: colors.textSecondary, marginBottom: "15px", lineHeight: "1.7" }}>
                LinkedIn propose une interface de recherche avancée accessible directement dans la barre de recherche. Après une recherche initiale, cliquez sur "Personnes" puis utilisez les filtres latéraux pour affiner :
              </p>
              <div style={{
                background: colors.bgPrimary,
                padding: "20px",
                borderRadius: "8px",
                marginBottom: "20px",
                border: `1px solid ${colors.border}`
              }}>
                <div style={{ marginBottom: "15px" }}>
                  <strong style={{ color: colors.accent, fontSize: "1.1rem" }}>Filtres principaux :</strong>
                </div>
                <div style={{ color: colors.textSecondary, lineHeight: "1.8", marginLeft: "15px" }}>
                  <div style={{ marginBottom: "10px" }}>
                    <strong style={{ color: colors.accent }}>→ Entreprise actuelle :</strong> Filtrer par nom exact d'entreprise (ex: "Google", "Microsoft France")
                  </div>
                  <div style={{ marginBottom: "10px" }}>
                    <strong style={{ color: colors.accent }}>→ Titre du poste :</strong> Rechercher par fonction précise (ex: "CISO", "CTO", "Security Engineer", "DevOps Lead")
                  </div>
                  <div style={{ marginBottom: "10px" }}>
                    <strong style={{ color: colors.accent }}>→ Localisation géographique :</strong> Ville, région ou pays spécifique
                  </div>
                  <div style={{ marginBottom: "10px" }}>
                    <strong style={{ color: colors.accent }}>→ École/Université :</strong> Filtrer par établissement d'enseignement fréquenté
                  </div>
                  <div>
                    <strong style={{ color: colors.accent }}>→ Secteur d'activité :</strong> Technologie, Finance, Santé, etc.
                  </div>
                </div>
              </div>

              <h3 style={{ color: colors.accent, fontSize: "1.5rem", marginBottom: "15px", marginTop: "30px" }}>
                🔎 Opérateurs de recherche booléens
              </h3>
              <p style={{ color: colors.textSecondary, marginBottom: "15px", lineHeight: "1.7" }}>
                Utilisez ces opérateurs directement dans la barre de recherche LinkedIn pour des requêtes ultra-précises :
              </p>
              <div style={{
                background: colors.bgPrimary,
                padding: "20px",
                borderRadius: "8px",
                marginBottom: "20px",
                border: `1px solid ${colors.border}`,
                fontFamily: "monospace",
                fontSize: "0.95rem"
              }}>
                <div style={{ marginBottom: "15px", color: colors.textSecondary }}>
                  <strong style={{ color: colors.accent }}>company:"Microsoft Corporation"</strong>
                  <br/>
                  <span style={{ fontSize: "0.85rem", color: colors.textSecondary + "cc" }}>→ Trouve tous les employés actuels de Microsoft</span>
                </div>
                <div style={{ marginBottom: "15px", color: colors.textSecondary }}>
                  <strong style={{ color: colors.accent }}>school:"Stanford University"</strong>
                  <br/>
                  <span style={{ fontSize: "0.85rem", color: colors.textSecondary + "cc" }}>→ Trouve tous les diplômés de Stanford</span>
                </div>
                <div style={{ marginBottom: "15px", color: colors.textSecondary }}>
                  <strong style={{ color: colors.accent }}>title:"Chief Information Security Officer"</strong>
                  <br/>
                  <span style={{ fontSize: "0.85rem", color: colors.textSecondary + "cc" }}>→ Trouve tous les CISO</span>
                </div>
                <div style={{ color: colors.textSecondary }}>
                  <strong style={{ color: colors.accent }}>company:"Acme Corp" AND title:"Software Engineer"</strong>
                  <br/>
                  <span style={{ fontSize: "0.85rem", color: colors.textSecondary + "cc" }}>→ Développeurs travaillant chez Acme Corp</span>
                </div>
              </div>

              <h3 style={{ color: colors.accent, fontSize: "1.5rem", marginBottom: "15px", marginTop: "30px" }}>
                🛠️ Outils tiers spécialisés
              </h3>
              
              <div style={{ marginBottom: "25px" }}>
                <h4 style={{ color: colors.textPrimary, fontSize: "1.3rem", marginBottom: "12px" }}>
                  Sales Navigator (LinkedIn Officiel - Payant)
                </h4>
                <p style={{ color: colors.textSecondary, marginBottom: "12px", lineHeight: "1.7" }}>
                  Abonnement payant (~80-100€/mois) offrant des capacités de recherche et filtrage ultra-avancées bien au-delà du compte gratuit. Fonctionnalités clés pour l'OSINT :
                </p>
                <ul style={{ color: colors.textSecondary, lineHeight: "1.8", marginLeft: "20px" }}>
                  <li>Filtres ultra-précis : ancienneté dans le poste actuel, taille exacte de l'entreprise, secteur d'activité détaillé, niveau de séniorité hiérarchique, fonction organisationnelle précise</li>
                  <li>Sauvegarde de listes d'prospects personnalisées avec organisation par dossiers</li>
                  <li>Alertes automatiques par email sur les changements de poste, promotions, départs</li>
                  <li>Accès à plus de résultats de recherche (jusqu'à 2500 résultats vs 1000 en gratuit)</li>
                  <li>InMail : messages directs sans connexion préalable (crédits limités)</li>
                </ul>
              </div>

              <div style={{ marginBottom: "25px" }}>
                <h4 style={{ color: colors.textPrimary, fontSize: "1.3rem", marginBottom: "12px" }}>
                  CrossLinked (Python Open-Source)
                </h4>
                <p style={{ color: colors.textSecondary, marginBottom: "12px", lineHeight: "1.7" }}>
                  Outil en ligne de commande permettant de scraper automatiquement la liste des employés d'une entreprise cible via LinkedIn et de générer des adresses email potentielles selon des patterns prédéfinis.
                </p>
                <div style={{
                  background: colors.bgPrimary,
                  padding: "15px",
                  borderRadius: "8px",
                  fontFamily: "monospace",
                  fontSize: "0.9rem",
                  marginBottom: "12px",
                  border: `1px solid ${colors.border}`
                }}>
                  <div style={{ color: colors.textSecondary, marginBottom: "10px" }}>
                    # Installation
                  </div>
                  <div style={{ color: colors.accent, marginBottom: "8px" }}>
                    git clone https://github.com/m8r0wn/CrossLinked
                  </div>
                  <div style={{ color: colors.accent, marginBottom: "15px" }}>
                    cd CrossLinked && pip3 install -r requirements.txt
                  </div>
                  <div style={{ color: colors.textSecondary, marginBottom: "10px" }}>
                    # Utilisation basique
                  </div>
                  <div style={{ color: colors.accent }}>
                      python3 crosslinked.py -f "{f}.{l}@company.com" "Company Name"
                  </div>
                </div>
                <p style={{ color: colors.textSecondary, lineHeight: "1.7", fontSize: "0.95rem" }}>
                  <strong>Sortie :</strong> Liste de noms d'employés + emails générés selon le pattern fourni (prenom.nom@, p.nom@, etc.)
                </p>
              </div>

              <h3 style={{ color: colors.accent, fontSize: "1.5rem", marginBottom: "15px", marginTop: "30px" }}>
                ⚠️ Cadre légal et limitations
              </h3>
              <div style={{
                background: "#ef444420",
                border: "2px solid #ef4444",
                borderRadius: "8px",
                padding: "20px"
              }}>
                <h4 style={{ color: "#ef4444", fontSize: "1.2rem", marginBottom: "12px" }}>
                  🚨 ATTENTION : Respect des CGU LinkedIn
                </h4>
                <p style={{ color: colors.textSecondary, lineHeight: "1.7", marginBottom: "12px" }}>
                  Le <strong>scraping automatisé de LinkedIn viole explicitement les Conditions Générales d'Utilisation</strong> de la plateforme. LinkedIn a poursuivi en justice plusieurs entreprises qui pratiquaient le scraping massif, notamment dans l'affaire <strong>hiQ Labs vs LinkedIn</strong> (2017-2022).
                </p>
                <p style={{ color: colors.textSecondary, lineHeight: "1.7", marginBottom: "0" }}>
                  <strong>Risques :</strong> Ban permanent du compte LinkedIn, poursuites judiciaires potentielles, responsabilité légale de l'entreprise mandataire. <strong>Recommandation OSINT éthique :</strong> Privilégiez UNIQUEMENT la recherche manuelle ou l'utilisation de Sales Navigator officiel pour rester dans la légalité.
                </p>
              </div>
            </div>
          )}

          {activeTab === "exercises" && (
            <div>
              <h2 style={{ color: colors.textPrimary, fontSize: "2rem", marginBottom: "20px" }}>
                💡 Exercices Pratiques Professionnels
              </h2>

              <div style={{
                background: colors.bgPrimary,
                padding: "25px",
                borderRadius: "12px",
                marginBottom: "20px",
                border: `1px solid ${colors.border}`
              }}>
                <h3 style={{ color: colors.accent, fontSize: "1.4rem", marginBottom: "15px" }}>
                  Exercice 1 : Cartographie CISO d'une entreprise CAC40
                </h3>
                <p style={{ color: colors.textSecondary, marginBottom: "15px", lineHeight: "1.7" }}>
                  <strong>Objectif :</strong> Identifier et analyser le profil complet du responsable de la sécurité informatique (CISO) d'une grande entreprise française cotée au CAC40.
                </p>
                <p style={{ color: colors.textSecondary, marginBottom: "10px" }}><strong>Requête de recherche :</strong></p>
                <code style={{
                  background: colors.bgSecondary,
                  padding: "12px 16px",
                  borderRadius: "8px",
                  display: "block",
                  color: colors.accent,
                  marginBottom: "15px",
                  fontFamily: "monospace"
                }}>
                  company:"Total Energies" title:"CISO"
                </code>
                <div style={{ color: colors.textSecondary, lineHeight: "1.8" }}>
                  <p style={{ marginBottom: "12px" }}><strong style={{ color: colors.accent }}>Analyse attendue :</strong></p>
                  <ul style={{ marginLeft: "20px", marginBottom: "15px" }}>
                    <li>Noter le nom complet, la photo professionnelle, l'ancienneté exacte dans le poste</li>
                    <li>Reconstruire le parcours professionnel complet (5 derniers postes minimum avec dates)</li>
                    <li>Identifier les certifications cybersécurité détenues (CISSP, CISM, CISA, etc.)</li>
                    <li>Lister les technologies et méthodologies mentionnées (ISO 27001, NIST, frameworks utilisés)</li>
                    <li>Repérer les publications récentes, interventions en conférence, articles partagés</li>
                    <li>Analyser le réseau : identifier ses connexions clés (autres CISOs, vendors, consultants)</li>
                  </ul>
                  <p style={{ margin: 0 }}>
                    <strong>Livrable :</strong> Fiche profil structurée avec timeline de carrière, stack de compétences, réseau professionnel identifié.
                  </p>
                </div>
              </div>

              <div style={{
                background: colors.bgPrimary,
                padding: "25px",
                borderRadius: "12px",
                marginBottom: "20px",
                border: `1px solid ${colors.border}`
              }}>
                <h3 style={{ color: colors.accent, fontSize: "1.4rem", marginBottom: "15px" }}>
                  Exercice 2 : Analyse de turnover dans une startup tech
                </h3>
                <p style={{ color: colors.textSecondary, marginBottom: "15px", lineHeight: "1.7" }}>
                  <strong>Objectif :</strong> Détecter des signaux de difficultés internes via l'analyse des départs massifs d'employés sur les 6-12 derniers mois.
                </p>
                <p style={{ color: colors.textSecondary, marginBottom: "10px" }}><strong>Méthodologie de recherche :</strong></p>
                <div style={{
                  background: colors.bgSecondary,
                  padding: "15px",
                  borderRadius: "8px",
                  marginBottom: "15px",
                  fontFamily: "monospace",
                  fontSize: "0.9rem"
                }}>
                  <div style={{ color: colors.textSecondary, marginBottom: "8px" }}>
                    1. Rechercher : company:"[Startup Name]"
                  </div>
                  <div style={{ color: colors.textSecondary, marginBottom: "8px" }}>
                    2. Filtrer par "Anciens employés" dans les résultats
                  </div>
                  <div style={{ color: colors.textSecondary }}>
                    3. Trier par "Date de départ" → Analyser 6 derniers mois
                  </div>
                </div>
                <div style={{ color: colors.textSecondary, lineHeight: "1.8" }}>
                  <p style={{ marginBottom: "12px" }}><strong style={{ color: colors.accent }}>Analyse quantitative :</strong></p>
                  <ul style={{ marginLeft: "20px", marginBottom: "15px" }}>
                    <li>Compter les départs par département : Engineering, Sales, Product, Marketing, HR</li>
                    <li>Calculer le taux de turnover par département (départs / effectif total du département)</li>
                    <li>Identifier les départs simultanés de plusieurs cadres dirigeants (red flag majeur)</li>
                  </ul>
                  <p style={{ marginBottom: "12px" }}><strong style={{ color: colors.accent }}>Analyse qualitative :</strong></p>
                  <ul style={{ marginLeft: "20px", marginBottom: "15px" }}>
                    <li>Repérer si migration massive vers un concurrent spécifique (poaching organisé ?)</li>
                    <li>Détecter créations simultanées de startups par plusieurs ex-employés (équipe qui se reforme)</li>
                    <li>Identifier reconversions professionnelles massives (burn-out collectif ?)</li>
                  </ul>
                  <p style={{ margin: 0 }}>
                    <strong>Indicateurs d'alerte critiques :</strong> Plus de 20% de départs en 6 mois dans département clé, départ de 3+ VP/Directors simultanément, migration de 10+ personnes vers même concurrent.
                  </p>
                </div>
              </div>

              <div style={{
                background: colors.bgPrimary,
                padding: "25px",
                borderRadius: "12px",
                border: `1px solid ${colors.border}`
              }}>
                <h3 style={{ color: colors.accent, fontSize: "1.4rem", marginBottom: "15px" }}>
                  Exercice 3 : Identification du stack technologique d'une entreprise cible
                </h3>
                <p style={{ color: colors.textSecondary, marginBottom: "15px", lineHeight: "1.7" }}>
                  <strong>Objectif :</strong> Déterminer précisément les technologies, langages, frameworks et outils utilisés par une entreprise en analysant les compétences de ses employés techniques.
                </p>
                <p style={{ color: colors.textSecondary, marginBottom: "10px" }}><strong>Requête de recherche :</strong></p>
                <code style={{
                  background: colors.bgSecondary,
                  padding: "12px 16px",
                  borderRadius: "8px",
                  display: "block",
                  color: colors.accent,
                  marginBottom: "15px",
                  fontFamily: "monospace"
                }}>
                  company:"TargetCorp" (title:"Developer" OR title:"Engineer" OR title:"DevOps")
                </code>
                <div style={{ color: colors.textSecondary, lineHeight: "1.8" }}>
                  <p style={{ marginBottom: "12px" }}><strong style={{ color: colors.accent }}>Processus de collecte :</strong></p>
                  <ul style={{ marginLeft: "20px", marginBottom: "15px" }}>
                    <li>Lister 30-50 profils de développeurs/ingénieurs de l'entreprise cible</li>
                    <li>Compiler toutes les compétences techniques mentionnées dans chaque profil</li>
                    <li>Créer une base de données : Technologie | Nombre de mentions | % d'employés</li>
                  </ul>
                  <p style={{ marginBottom: "12px" }}><strong style={{ color: colors.accent }}>Catégories à analyser :</strong></p>
                  <ul style={{ marginLeft: "20px", marginBottom: "15px" }}>
                    <li><strong>Langages de programmation :</strong> Python, Java, JavaScript, Go, C++, Rust, etc.</li>
                    <li><strong>Frameworks web :</strong> React, Angular, Vue.js, Django, Flask, Spring Boot, etc.</li>
                    <li><strong>Cloud providers :</strong> AWS, Azure, Google Cloud Platform (GCP)</li>
                    <li><strong>Conteneurisation/Orchestration :</strong> Docker, Kubernetes, OpenShift</li>
                    <li><strong>Bases de données :</strong> PostgreSQL, MongoDB, MySQL, Redis, Elasticsearch</li>
                    <li><strong>Outils CI/CD :</strong> Jenkins, GitLab CI, GitHub Actions, CircleCI</li>
                    <li><strong>Monitoring/Logging :</strong> Prometheus, Grafana, ELK Stack, Datadog</li>
                  </ul>
                  <p style={{ marginBottom: "12px" }}><strong style={{ color: colors.accent }}>Cross-validation :</strong></p>
                  <ul style={{ marginLeft: "20px", marginBottom: "15px" }}>
                    <li>Croiser avec les offres d'emploi actuelles de l'entreprise (technologies recherchées)</li>
                    <li>Vérifier cohérence avec les publications techniques de l'entreprise (blogs, GitHub public)</li>
                  </ul>
                  <p style={{ margin: 0 }}>
                    <strong>Insights exploitables :</strong> "80% des devs mentionnent AWS → infrastructure cloud Amazon dominante" / "Recrutements massifs Kubernetes → migration microservices en cours" / "Mentions fréquentes Kafka → architecture event-driven probable".
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "quiz" && (
            <div>
              <h2 style={{ color: colors.textPrimary, fontSize: "2rem", marginBottom: "20px" }}>
                🎯 Quiz de validation des connaissances
              </h2>
              <p style={{ color: colors.textSecondary, marginBottom: "30px", lineHeight: "1.7" }}>
                Répondez aux 5 questions suivantes pour valider votre maîtrise du module. Un score minimum de <strong>4/5</strong> est requis pour débloquer le badge Expert LinkedIn OSINT.
              </p>

              {quizQuestions.map((q, index) => (
                <div
                  key={q.id}
                  style={{
                    background: colors.bgPrimary,
                    padding: "20px",
                    borderRadius: "12px",
                    marginBottom: "20px",
                    border: `1px solid ${colors.border}`
                  }}
                >
                  <h3 style={{
                    color: colors.textPrimary,
                    fontSize: "1.1rem",
                    marginBottom: "15px",
                    fontWeight: "600"
                  }}>
                    {index + 1}. {q.question}
                  </h3>
                  {q.options.map((option, optIndex) => (
                    <label
                      key={optIndex}
                      style={{
                        display: "block",
                        padding: "12px 15px",
                        marginBottom: "10px",
                        background: quizAnswers[q.id] === optIndex.toString()
                          ? colors.accent + "30"
                          : colors.bgSecondary,
                        border: `2px solid ${
                          quizAnswers[q.id] === optIndex.toString()
                            ? colors.accent
                            : colors.border
                        }`,
                        borderRadius: "8px",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                      }}
                      onMouseEnter={(e) => {
                        if (quizAnswers[q.id] !== optIndex.toString()) {
                          e.currentTarget.style.borderColor = colors.accent;
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (quizAnswers[q.id] !== optIndex.toString()) {
                          e.currentTarget.style.borderColor = colors.border;
                        }
                      }}
                    >
                      <input
                        type="radio"
                        name={`question-${q.id}`}
                        value={optIndex}
                        checked={quizAnswers[q.id] === optIndex.toString()}
                        onChange={(e) =>
                          setQuizAnswers({ ...quizAnswers, [q.id]: e.target.value })
                        }
                        style={{ marginRight: "10px" }}
                      />
                      <span style={{ color: colors.textPrimary, fontSize: "1rem" }}>
                        {option}
                      </span>
                    </label>
                  ))}
                </div>
              ))}

              <div style={{ display: "flex", gap: "15px", marginTop: "30px" }}>
                <button
                  onClick={handleQuizSubmit}
                  disabled={Object.keys(quizAnswers).length !== quizQuestions.length}
                  style={{
                    padding: "15px 40px",
                    background:
                      Object.keys(quizAnswers).length === quizQuestions.length
                        ? colors.accent
                        : colors.border,
                    color: "#020617",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "1.1rem",
                    fontWeight: "600",
                    cursor:
                      Object.keys(quizAnswers).length === quizQuestions.length
                        ? "pointer"
                        : "not-allowed",
                    transition: "all 0.3s ease",
                    opacity:
                      Object.keys(quizAnswers).length === quizQuestions.length ? 1 : 0.5,
                  }}
                >
                  ✅ Valider mes réponses
                </button>
                <button
                  onClick={() => setShowResetModal(true)}
                  style={{
                    padding: "15px 40px",
                    background: "#0b0f1a",
                    color: "#00ff9c",
                    border: "2px solid #00ff9c",
                    borderRadius: "8px",
                    fontSize: "1.1rem",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#00ff9c";
                    e.currentTarget.style.color = "#0b0f1a";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#0b0f1a";
                    e.currentTarget.style.color = "#00ff9c";
                  }}
                >
                  🔄 Réinitialiser le module
                </button>
              </div>

              {showResults && (
                <div
                  style={{
                    marginTop: "30px",
                    padding: "25px",
                    background:
                      getScore() >= 4 ? colors.accent + "20" : "#ef444420",
                    border: `2px solid ${getScore() >= 4 ? colors.accent : "#ef4444"}`,
                    borderRadius: "12px",
                  }}
                >
                  <h3
                    style={{
                      color: getScore() >= 4 ? colors.accent : "#ef4444",
                      fontSize: "1.5rem",
                      marginBottom: "10px",
                      fontWeight: "700",
                    }}
                  >
                    {getScore() >= 4
                      ? "✅ Quiz validé avec succès !"
                      : "❌ Score insuffisant"}
                  </h3>
                  <p
                    style={{
                      color: colors.textPrimary,
                      fontSize: "1.2rem",
                      marginBottom: getScore() >= 4 ? "10px" : "0",
                      fontWeight: "600",
                    }}
                  >
                    Votre score : {getScore()}/{quizQuestions.length}
                  </p>
                  {getScore() >= 4 && (
                    <p style={{ color: colors.textSecondary, fontSize: "1rem", margin: 0 }}>
                      🏆 Félicitations ! Vous avez débloqué le badge <strong>Expert LinkedIn OSINT</strong>. Vous maîtrisez maintenant les techniques de reconnaissance professionnelle.
                    </p>
                  )}
                  {getScore() < 4 && (
                    <p style={{ color: colors.textSecondary, fontSize: "1rem", margin: 0 }}>
                      Révisez les sections Théorie et Outils avant de retenter le quiz.
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {showResetModal && (
        <>
          <div
            onClick={() => setShowResetModal(false)}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0, 0, 0, 0.8)",
              zIndex: 9998,
            }}
          />
          <div
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              background: "#0b0f1a",
              border: "3px solid #00ff9c",
              borderRadius: "12px",
              padding: "40px",
              maxWidth: "500px",
              width: "90%",
              zIndex: 9999,
            }}
          >
            <h3
              style={{
                color: "#00ff9c",
                fontSize: "1.5rem",
                marginBottom: "15px",
                textAlign: "center",
                fontWeight: "700",
              }}
            >
              ⚠️ Réinitialiser le module
            </h3>
            <p
              style={{
                color: "#9ca3af",
                marginBottom: "30px",
                textAlign: "center",
                lineHeight: "1.6",
              }}
            >
              Cette action effacera définitivement toutes vos réponses, votre progression et votre badge dans ce module. Êtes-vous sûr de vouloir continuer ?
            </p>
            <div style={{ display: "flex", gap: "15px", justifyContent: "center" }}>
              <button
                onClick={() => setShowResetModal(false)}
                style={{
                  padding: "12px 30px",
                  background: "transparent",
                  color: "#9ca3af",
                  border: "2px solid #2a3f3f",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#00ff9c";
                  e.currentTarget.style.color = "#00ff9c";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#2a3f3f";
                  e.currentTarget.style.color = "#9ca3af";
                }}
              >
                Annuler
              </button>
              <button
                onClick={handleReset}
                style={{
                  padding: "12px 30px",
                  background: "#00ff9c",
                  color: "#0b0f1a",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#00d68f";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#00ff9c";
                }}
              >
                Confirmer la réinitialisation
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

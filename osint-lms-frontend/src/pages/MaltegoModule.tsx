import { useState } from "react";
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
    { id: 1, question: "Qu'est-ce que Maltego ?", options: ["Outil de visualisation graphique de relations", "Scanner de ports", "Cracker de mots de passe", "Éditeur de texte"], correct: 0 },
    { id: 2, question: "Quel élément de base dans Maltego ?", options: ["Entity (entité)", "Node", "Object", "Item"], correct: 0 },
    { id: 3, question: "Maltego utilise quoi pour collecter données ?", options: ["Transforms", "Scripts", "Plugins", "Modules"], correct: 0 },
    { id: 4, question: "Version gratuite de Maltego ?", options: ["Maltego CE (Community Edition)", "Maltego Free", "Maltego Lite", "Maltego Basic"], correct: 0 },
    { id: 5, question: "Maltego est utile pour ?", options: ["Visualiser réseaux complexes", "Éditer photos", "Coder en Python", "Gérer bases SQL"], correct: 0 }
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
          <div style={{ fontSize: "4rem", marginBottom: "15px" }}>🕸️</div>
          <h1 style={{ fontSize: "2.5rem", fontWeight: "700", color: colors.textPrimary, marginBottom: "15px" }}>Module Maltego Basics</h1>
          <p style={{ fontSize: "1.1rem", color: colors.textSecondary, maxWidth: "700px", margin: "0 auto" }}>Visualisation graphique et analyse de relations OSINT</p>
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
              <h2 style={{ color: colors.textPrimary, fontSize: "2rem", marginBottom: "20px" }}>📖 Maltego OSINT</h2>
              <p style={{ color: colors.textSecondary, lineHeight: "1.8", marginBottom: "20px" }}>
                <strong>Maltego</strong> est un outil de data mining et visualisation graphique développé par Paterva. Il permet de cartographier visuellement les relations entre personnes, entreprises, domaines, IPs, emails, réseaux sociaux et autres entités en utilisant des <strong>transforms</strong> (requêtes automatisées).
              </p>
              <h3 style={{ color: colors.accent, fontSize: "1.5rem", marginBottom: "15px" }}>🎯 Pourquoi Maltego ?</h3>
              <ul style={{ color: colors.textSecondary, lineHeight: "1.8", marginLeft: "20px", marginBottom: "25px" }}>
                <li><strong>Visualisation intuitive :</strong> Graphes interactifs montrant connexions entre entités</li>
                <li><strong>Automatisation :</strong> Transforms collectent données depuis sources publiques</li>
                <li><strong>Investigations complexes :</strong> Identifier liens cachés, pivots, patterns</li>
                <li><strong>Collaboration :</strong> Partage de graphes entre analystes</li>
                <li><strong>OSINT passif :</strong> Collecte sans interaction directe avec cibles</li>
              </ul>
              <h3 style={{ color: colors.accent, fontSize: "1.5rem", marginBottom: "15px" }}>🧩 Concepts clés</h3>
              <div style={{ background: colors.bgPrimary, padding: "20px", borderRadius: "8px", marginBottom: "15px" }}>
                <h4 style={{ color: colors.accent, marginBottom: "10px" }}>Entities (Entités)</h4>
                <p style={{ color: colors.textSecondary, lineHeight: "1.6", margin: 0 }}>
                  Objets graphiques représentant : Personne, Entreprise, Domaine, IP, Email, Téléphone, Adresse, Document, Hashtag, etc. Chaque entity a des propriétés (metadata).
                </p>
              </div>
              <div style={{ background: colors.bgPrimary, padding: "20px", borderRadius: "8px", marginBottom: "15px" }}>
                <h4 style={{ color: colors.accent, marginBottom: "10px" }}>Transforms</h4>
                <p style={{ color: colors.textSecondary, lineHeight: "1.6", margin: 0 }}>
                  Scripts/requêtes automatisées qui enrichissent une entity en ajoutant des entities liées. Exemple : Transform "Domain → Email Addresses" récupère tous les emails associés à un domaine.
                </p>
              </div>
              <div style={{ background: colors.bgPrimary, padding: "20px", borderRadius: "8px" }}>
                <h4 style={{ color: colors.accent, marginBottom: "10px" }}>Machines</h4>
                <p style={{ color: colors.textSecondary, lineHeight: "1.6", margin: 0 }}>
                  Séquences automatisées de transforms pour investigations complexes. Exemple : Machine "Company Stalker" cartographie structure complète d'une entreprise.
                </p>
              </div>
              <h3 style={{ color: colors.accent, fontSize: "1.5rem", marginBottom: "15px", marginTop: "20px" }}>🆚 Versions Maltego</h3>
              <p style={{ color: colors.textSecondary, marginBottom: "10px" }}><strong>Maltego CE (Community Edition) :</strong> Gratuite, limitée (12 entities par transform, transforms limités)</p>
              <p style={{ color: colors.textSecondary, marginBottom: "10px" }}><strong>Maltego Classic :</strong> Payante (~999$/an), illimitée</p>
              <p style={{ color: colors.textSecondary }}><strong>Maltego XL :</strong> Entreprise, collaboration équipe</p>
            </div>
          )}

          {activeTab === "tools" && (
            <div>
              <h2 style={{ color: colors.textPrimary, fontSize: "2rem", marginBottom: "20px" }}>🔧 Utilisation Maltego</h2>
              <h3 style={{ color: colors.accent, fontSize: "1.5rem", marginBottom: "15px" }}>Installation</h3>
              <div style={{ background: colors.bgPrimary, padding: "15px", borderRadius: "8px", marginBottom: "20px" }}>
                <p style={{ color: colors.textSecondary, marginBottom: "10px" }}>1. Télécharger : <a href="https://www.maltego.com/downloads/" target="_blank" style={{ color: colors.accent }}>maltego.com/downloads</a></p>
                <p style={{ color: colors.textSecondary, marginBottom: "10px" }}>2. Créer compte gratuit pour Maltego CE</p>
                <p style={{ color: colors.textSecondary }}>3. Installer et lancer Maltego Desktop</p>
              </div>
              <h3 style={{ color: colors.accent, fontSize: "1.5rem", marginBottom: "15px" }}>Workflow de base</h3>
              <div style={{ background: colors.bgPrimary, padding: "15px", borderRadius: "8px", marginBottom: "15px" }}>
                <ol style={{ color: colors.textSecondary, lineHeight: "1.8", marginLeft: "20px" }}>
                  <li><strong>Créer nouveau graphe :</strong> File → New Graph</li>
                  <li><strong>Ajouter entity :</strong> Glisser-déposer depuis Entity Palette (Domain, Person, Email...)</li>
                  <li><strong>Configurer entity :</strong> Double-clic pour éditer propriétés (nom, valeur)</li>
                  <li><strong>Lancer transform :</strong> Clic droit sur entity → Run Transform → Choisir transform</li>
                  <li><strong>Analyser résultats :</strong> Nouvelles entities apparaissent avec liens graphiques</li>
                  <li><strong>Pivoter :</strong> Répéter transforms sur nouvelles entities pour approfondir</li>
                </ol>
              </div>
              <h3 style={{ color: colors.accent, fontSize: "1.5rem", marginBottom: "15px", marginTop: "20px" }}>Transforms courants</h3>
              <div style={{ background: colors.bgPrimary, padding: "15px", borderRadius: "8px", fontFamily: "monospace", fontSize: "0.85rem" }}>
                <div style={{ marginBottom: "10px", color: colors.textSecondary }}><strong style={{ color: colors.accent }}>Domain → DNS Name</strong> : Sous-domaines</div>
                <div style={{ marginBottom: "10px", color: colors.textSecondary }}><strong style={{ color: colors.accent }}>Domain → Email Address</strong> : Emails associés</div>
                <div style={{ marginBottom: "10px", color: colors.textSecondary }}><strong style={{ color: colors.accent }}>Email → Person</strong> : Profils réseaux sociaux</div>
                <div style={{ marginBottom: "10px", color: colors.textSecondary }}><strong style={{ color: colors.accent }}>Domain → IP Address</strong> : Résolution DNS</div>
                <div style={{ color: colors.textSecondary }}><strong style={{ color: colors.accent }}>Person → Phone Number</strong> : Numéros associés</div>
              </div>
              <h3 style={{ color: colors.accent, fontSize: "1.5rem", marginBottom: "15px", marginTop: "20px" }}>Transform Hubs (sources)</h3>
              <p style={{ color: colors.textSecondary, marginBottom: "10px" }}><strong>Paterva CTAS :</strong> Transforms officiels (DNS, whois, recherche)</p>
              <p style={{ color: colors.textSecondary, marginBottom: "10px" }}><strong>Shodan :</strong> Enrichissement IoT/infrastructure</p>
              <p style={{ color: colors.textSecondary, marginBottom: "10px" }}><strong>VirusTotal :</strong> Analyse malware, domaines malveillants</p>
              <p style={{ color: colors.textSecondary }}><strong>Social Links :</strong> Réseaux sociaux (nécessite API keys payantes)</p>
            </div>
          )}

          {activeTab === "exercises" && (
            <div>
              <h2 style={{ color: colors.textPrimary, fontSize: "2rem", marginBottom: "20px" }}>💡 Exercices Pratiques</h2>
              <div style={{ background: colors.bgPrimary, padding: "25px", borderRadius: "12px", marginBottom: "20px" }}>
                <h3 style={{ color: colors.accent, fontSize: "1.3rem", marginBottom: "15px" }}>Exercice 1 : Cartographie domaine</h3>
                <p style={{ color: colors.textSecondary, marginBottom: "15px" }}><strong>Objectif :</strong> Mapper infrastructure d'un domaine</p>
                <p style={{ color: colors.textSecondary, marginBottom: "10px" }}><strong>Méthode :</strong></p>
                <ol style={{ color: colors.textSecondary, lineHeight: "1.8", marginLeft: "20px" }}>
                  <li>Créer entity Domain (ex: example.com)</li>
                  <li>Run Transform: "To DNS Name - NS (name server)"</li>
                  <li>Run Transform: "To IP Address"</li>
                  <li>Run Transform: "To Email Addresses"</li>
                  <li>Analyser graphe: serveurs DNS, IPs hébergement, contacts</li>
                </ol>
              </div>
              <div style={{ background: colors.bgPrimary, padding: "25px", borderRadius: "12px", marginBottom: "20px" }}>
                <h3 style={{ color: colors.accent, fontSize: "1.3rem", marginBottom: "15px" }}>Exercice 2 : Profil personne</h3>
                <p style={{ color: colors.textSecondary, marginBottom: "15px" }}><strong>Objectif :</strong> Investiguer empreinte numérique d'une personne</p>
                <p style={{ color: colors.textSecondary, marginBottom: "10px" }}><strong>Méthode :</strong></p>
                <ol style={{ color: colors.textSecondary, lineHeight: "1.8", marginLeft: "20px" }}>
                  <li>Entity Person (nom + prénom)</li>
                  <li>Transform: "To Email Addresses [using Search Engine]"</li>
                  <li>Sur emails: Transform "To Social Network Profile"</li>
                  <li>Identifier: LinkedIn, Twitter, Facebook, Instagram</li>
                  <li>Documenter: employeur, localisation, connexions</li>
                </ol>
              </div>
              <div style={{ background: colors.bgPrimary, padding: "25px", borderRadius: "12px" }}>
                <h3 style={{ color: colors.accent, fontSize: "1.3rem", marginBottom: "15px" }}>Exercice 3 : Infrastructure partagée</h3>
                <p style={{ color: colors.textSecondary, marginBottom: "15px" }}><strong>Objectif :</strong> Trouver autres domaines sur même serveur</p>
                <p style={{ color: colors.textSecondary, marginBottom: "10px" }}><strong>Méthode :</strong></p>
                <ol style={{ color: colors.textSecondary, lineHeight: "1.8", marginLeft: "20px" }}>
                  <li>Entity Domain → Transform "To IP Address"</li>
                  <li>Sur IP obtenue → Transform "To Domains [Sharing this IP]"</li>
                  <li>Identifier: sites partageant même hébergement</li>
                  <li>Analyser: entreprises liées, mutualisations suspectes</li>
                </ol>
                <p style={{ color: "#ef4444", marginTop: "15px", fontWeight: "600" }}>⚠️ Respecter vie privée et lois locales</p>
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

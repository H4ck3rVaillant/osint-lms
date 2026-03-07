import { useState } from "react";
import { useThemeColors } from "../context/ThemeContext";

export default function theHarvesterModule() {
  const colors = useThemeColors();
  const [activeTab, setActiveTab] = useState("theory");
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

  const BADGE_KEY = "badge_module_theharvester";
  const ANSWERS_KEY = "quiz_answers_theharvester";
  const RESULTS_KEY = "quiz_results_theharvester";

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
    { id: 1, question: "Que collecte principalement theHarvester ?", options: ["Emails, sous-domaines, IPs, noms", "Mots de passe", "Fichiers sensibles", "Logs serveurs"], correct: 0 },
    { id: 2, question: "Quelles sources theHarvester interroge ?", options: ["Google, Bing, Shodan, LinkedIn, etc.", "Uniquement Google", "Bases de données SQL", "Fichiers locaux uniquement"], correct: 0 },
    { id: 3, question: "Commande de base theHarvester ?", options: ["theHarvester -d domain.com -b all", "harvester --scan domain", "python harvest.py -t domain", "theharvest -domain"], correct: 0 },
    { id: 4, question: "theHarvester est-il légal ?", options: ["Oui si données publiques", "Non, toujours illégal", "Oui sans restriction", "Nécessite autorisation écrite"], correct: 0 },
    { id: 5, question: "Formats d'export supportés ?", options: ["JSON, XML, HTML", "PDF uniquement", "SQL uniquement", "Texte brut uniquement"], correct: 0 }
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
          <div style={{ fontSize: "4rem", marginBottom: "15px" }}>🌾</div>
          <h1 style={{ fontSize: "2.5rem", fontWeight: "700", color: colors.textPrimary, marginBottom: "15px" }}>
            Module theHarvester
          </h1>
          <p style={{ fontSize: "1.1rem", color: colors.textSecondary, maxWidth: "700px", margin: "0 auto" }}>
            Collecte automatisée d'emails, sous-domaines, IPs et métadonnées
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
              <h2 style={{ color: colors.textPrimary, fontSize: "2rem", marginBottom: "20px" }}>📖 Qu'est-ce que theHarvester ?</h2>
              
              <p style={{ color: colors.textSecondary, lineHeight: "1.8", marginBottom: "20px" }}>
                <strong>theHarvester</strong> est un outil Python open-source développé par <strong>Christian Martorella</strong> (Edge-Security) permettant de collecter automatiquement des <strong>adresses email, sous-domaines, noms de personnes, adresses IP et URLs</strong> associés à un domaine cible en interrogeant des sources publiques (moteurs de recherche, réseaux sociaux, bases de données OSINT).
              </p>

              <h3 style={{ color: colors.accent, fontSize: "1.5rem", marginBottom: "15px", marginTop: "30px" }}>🎯 Cas d'usage en OSINT</h3>
              <ul style={{ color: colors.textSecondary, lineHeight: "1.8", marginLeft: "20px", marginBottom: "25px" }}>
                <li><strong>Reconnaissance passive pré-attaque :</strong> Identifier la surface d'exposition d'une cible sans scanner activement</li>
                <li><strong>Cartographie de la surface d'attaque :</strong> Lister sous-domaines, serveurs, adresses email exposées publiquement</li>
                <li><strong>Intelligence gathering :</strong> Collecter des informations sur l'infrastructure d'une organisation</li>
                <li><strong>Campagnes de phishing :</strong> Constituer des listes d'emails valides pour du social engineering (usage malveillant)</li>
                <li><strong>Audit de sécurité :</strong> Évaluer ce qu'un attaquant peut découvrir sans authentification</li>
              </ul>

              <h3 style={{ color: colors.accent, fontSize: "1.5rem", marginBottom: "15px", marginTop: "30px" }}>📊 Types de données collectées</h3>
              
              <div style={{ background: colors.bgPrimary, padding: "20px", borderRadius: "8px", marginBottom: "15px" }}>
                <h4 style={{ color: colors.accent, marginBottom: "10px" }}>Adresses email</h4>
                <p style={{ color: colors.textSecondary, lineHeight: "1.6", margin: 0 }}>
                  Emails publics trouvés dans : pages web indexées, documents PDF/DOCX, bases de données OSINT (Hunter.io), réseaux sociaux professionnels (LinkedIn via Google), forums, dépôts GitHub, fichiers robots.txt.
                </p>
              </div>

              <div style={{ background: colors.bgPrimary, padding: "20px", borderRadius: "8px", marginBottom: "15px" }}>
                <h4 style={{ color: colors.accent, marginBottom: "10px" }}>Sous-domaines</h4>
                <p style={{ color: colors.textSecondary, lineHeight: "1.6", margin: 0 }}>
                  Sous-domaines découverts via : certificats SSL (crt.sh, Censys), résolution DNS (brute-force léger), moteurs de recherche (Google, Bing), bases OSINT (VirusTotal, Shodan, SecurityTrails). Exemple : mail.example.com, vpn.example.com, dev.example.com.
                </p>
              </div>

              <div style={{ background: colors.bgPrimary, padding: "20px", borderRadius: "8px", marginBottom: "15px" }}>
                <h4 style={{ color: colors.accent, marginBottom: "10px" }}>Adresses IP et serveurs</h4>
                <p style={{ color: colors.textSecondary, lineHeight: "1.6", margin: 0 }}>
                  IPs associées au domaine cible : serveurs web, serveurs mail (MX records), serveurs DNS (NS records), CDN et load balancers. Données récupérées via requêtes DNS publiques et bases Shodan/Censys.
                </p>
              </div>

              <div style={{ background: colors.bgPrimary, padding: "20px", borderRadius: "8px" }}>
                <h4 style={{ color: colors.accent, marginBottom: "10px" }}>Noms de personnes et métadonnées</h4>
                <p style={{ color: colors.textSecondary, lineHeight: "1.6", margin: 0 }}>
                  Noms d'employés extraits de : profils LinkedIn publics indexés par Google, documents PDF avec métadonnées (auteurs), pages "À propos" et "Équipe" des sites web, articles de presse mentionnant des collaborateurs.
                </p>
              </div>
            </div>
          )}

          {activeTab === "tools" && (
            <div>
              <h2 style={{ color: colors.textPrimary, fontSize: "2rem", marginBottom: "20px" }}>🔧 Installation et Utilisation</h2>

              <h3 style={{ color: colors.accent, fontSize: "1.5rem", marginBottom: "15px" }}>📥 Installation</h3>
              <p style={{ color: colors.textSecondary, marginBottom: "15px", lineHeight: "1.7" }}>
                theHarvester est écrit en Python 3 et s'installe facilement via Git ou pip. Nécessite Python 3.7+.
              </p>
              <div style={{ background: colors.bgPrimary, padding: "15px", borderRadius: "8px", marginBottom: "20px", fontFamily: "monospace", fontSize: "0.9rem" }}>
                <div style={{ marginBottom: "12px", color: colors.textSecondary }}>
                  <strong style={{ color: colors.accent }}># Installation via Git</strong>
                </div>
                <div style={{ marginBottom: "8px", color: colors.textSecondary }}>
                  git clone https://github.com/laramies/theHarvester
                </div>
                <div style={{ marginBottom: "8px", color: colors.textSecondary }}>
                  cd theHarvester
                </div>
                <div style={{ marginBottom: "16px", color: colors.textSecondary }}>
                  pip3 install -r requirements.txt
                </div>
                <div style={{ marginBottom: "12px", color: colors.textSecondary }}>
                  <strong style={{ color: colors.accent }}># Ou via pip (moins recommandé)</strong>
                </div>
                <div style={{ color: colors.textSecondary }}>
                  pip3 install theHarvester
                </div>
              </div>

              <h3 style={{ color: colors.accent, fontSize: "1.5rem", marginBottom: "15px", marginTop: "25px" }}>🚀 Commandes de base</h3>
              <div style={{ background: colors.bgPrimary, padding: "15px", borderRadius: "8px", marginBottom: "20px", fontFamily: "monospace", fontSize: "0.9rem" }}>
                <div style={{ marginBottom: "12px", color: colors.textSecondary }}>
                  <strong style={{ color: colors.accent }}># Scan complet avec toutes les sources</strong>
                </div>
                <div style={{ marginBottom: "16px", color: colors.textSecondary }}>
                  theHarvester -d example.com -b all
                </div>
                <div style={{ marginBottom: "12px", color: colors.textSecondary }}>
                  <strong style={{ color: colors.accent }}># Scan avec sources spécifiques</strong>
                </div>
                <div style={{ marginBottom: "16px", color: colors.textSecondary }}>
                  theHarvester -d example.com -b google,bing,linkedin
                </div>
                <div style={{ marginBottom: "12px", color: colors.textSecondary }}>
                  <strong style={{ color: colors.accent }}># Limiter le nombre de résultats</strong>
                </div>
                <div style={{ marginBottom: "16px", color: colors.textSecondary }}>
                  theHarvester -d example.com -b google -l 500
                </div>
                <div style={{ marginBottom: "12px", color: colors.textSecondary }}>
                  <strong style={{ color: colors.accent }}># Exporter les résultats en JSON</strong>
                </div>
                <div style={{ color: colors.textSecondary }}>
                  theHarvester -d example.com -b all -f rapport_example.json
                </div>
              </div>

              <h3 style={{ color: colors.accent, fontSize: "1.5rem", marginBottom: "15px", marginTop: "25px" }}>🌐 Sources disponibles (-b flag)</h3>
              <div style={{ background: colors.bgPrimary, padding: "20px", borderRadius: "8px", marginBottom: "15px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "12px", color: colors.textSecondary, fontSize: "0.95rem" }}>
                  <div><strong style={{ color: colors.accent }}>google</strong></div>
                  <div>Moteur de recherche Google (requêtes site:domain.com)</div>
                  <div><strong style={{ color: colors.accent }}>bing</strong></div>
                  <div>Moteur de recherche Bing (requêtes similaires)</div>
                  <div><strong style={{ color: colors.accent }}>baidu</strong></div>
                  <div>Moteur chinois (utile pour cibles asiatiques)</div>
                  <div><strong style={{ color: colors.accent }}>linkedin</strong></div>
                  <div>Profils LinkedIn publics indexés par Google</div>
                  <div><strong style={{ color: colors.accent }}>twitter</strong></div>
                  <div>Tweets mentionnant le domaine</div>
                  <div><strong style={{ color: colors.accent }}>shodan</strong></div>
                  <div>Base de données Shodan (nécessite clé API)</div>
                  <div><strong style={{ color: colors.accent }}>hunter</strong></div>
                  <div>Hunter.io pour emails (nécessite clé API)</div>
                  <div><strong style={{ color: colors.accent }}>certspotter</strong></div>
                  <div>Certificats SSL/TLS (sous-domaines)</div>
                  <div><strong style={{ color: colors.accent }}>crtsh</strong></div>
                  <div>Base crt.sh (certificats SSL)</div>
                  <div><strong style={{ color: colors.accent }}>virustotal</strong></div>
                  <div>VirusTotal (nécessite clé API)</div>
                  <div><strong style={{ color: colors.accent }}>threatcrowd</strong></div>
                  <div>ThreatCrowd (threat intelligence)</div>
                  <div><strong style={{ color: colors.accent }}>dnsdumpster</strong></div>
                  <div>DNSDumpster (sous-domaines et DNS)</div>
                </div>
              </div>

              <h3 style={{ color: colors.accent, fontSize: "1.5rem", marginBottom: "15px", marginTop: "25px" }}>📋 Options principales</h3>
              <div style={{ background: colors.bgPrimary, padding: "15px", borderRadius: "8px", fontFamily: "monospace", fontSize: "0.9rem" }}>
                <div style={{ marginBottom: "10px", color: colors.textSecondary }}>
                  <strong style={{ color: colors.accent }}>-d DOMAIN</strong> → Domaine cible (obligatoire)
                </div>
                <div style={{ marginBottom: "10px", color: colors.textSecondary }}>
                  <strong style={{ color: colors.accent }}>-b SOURCE</strong> → Source(s) de données (google, all, etc.)
                </div>
                <div style={{ marginBottom: "10px", color: colors.textSecondary }}>
                  <strong style={{ color: colors.accent }}>-l LIMIT</strong> → Limite de résultats (défaut: 500)
                </div>
                <div style={{ marginBottom: "10px", color: colors.textSecondary }}>
                  <strong style={{ color: colors.accent }}>-f FILENAME</strong> → Exporter (JSON, XML, HTML)
                </div>
                <div style={{ marginBottom: "10px", color: colors.textSecondary }}>
                  <strong style={{ color: colors.accent }}>-n</strong> → Résolution DNS des sous-domaines trouvés
                </div>
                <div style={{ color: colors.textSecondary }}>
                  <strong style={{ color: colors.accent }}>-c</strong> → Effectuer brute-force DNS (lent)
                </div>
              </div>
            </div>
          )}

          {activeTab === "exercises" && (
            <div>
              <h2 style={{ color: colors.textPrimary, fontSize: "2rem", marginBottom: "20px" }}>💡 Exercices Pratiques</h2>

              <div style={{ background: colors.bgPrimary, padding: "25px", borderRadius: "12px", marginBottom: "20px" }}>
                <h3 style={{ color: colors.accent, fontSize: "1.3rem", marginBottom: "15px" }}>Exercice 1 : Collecte d'emails d'une entreprise</h3>
                <p style={{ color: colors.textSecondary, marginBottom: "15px", lineHeight: "1.7" }}>
                  <strong>Objectif :</strong> Lister toutes les adresses email publiques associées à une entreprise cible.
                </p>
                <p style={{ color: colors.accent, marginBottom: "10px", fontWeight: "600" }}>Méthodologie :</p>
                <ol style={{ color: colors.textSecondary, lineHeight: "1.8", marginLeft: "20px", marginBottom: "15px" }}>
                  <li>Identifier le domaine principal de l'entreprise (ex: company.com)</li>
                  <li>Lancer theHarvester avec sources multiples : theHarvester -d company.com -b google,bing,linkedin,hunter</li>
                  <li>Exporter les résultats : theHarvester -d company.com -b all -f results.json</li>
                  <li>Analyser le fichier JSON : compter emails uniques, identifier patterns (prenom.nom@, info@, support@)</li>
                  <li>Vérifier validité avec Hunter.io ou Email-Checker.net</li>
                </ol>
                <p style={{ color: colors.accent, marginBottom: "10px", fontWeight: "600" }}>Attendu :</p>
                <ul style={{ color: colors.textSecondary, lineHeight: "1.8", marginLeft: "20px" }}>
                  <li>Liste d'au moins 20 emails valides</li>
                  <li>Identification du pattern email de l'entreprise</li>
                  <li>Distinction entre emails personnels (info@) et individuels (prenom.nom@)</li>
                </ul>
              </div>

              <div style={{ background: colors.bgPrimary, padding: "25px", borderRadius: "12px", marginBottom: "20px" }}>
                <h3 style={{ color: colors.accent, fontSize: "1.3rem", marginBottom: "15px" }}>Exercice 2 : Cartographie des sous-domaines</h3>
                <p style={{ color: colors.textSecondary, marginBottom: "15px", lineHeight: "1.7" }}>
                  <strong>Objectif :</strong> Découvrir tous les sous-domaines actifs d'une organisation pour évaluer sa surface d'attaque.
                </p>
                <p style={{ color: colors.accent, marginBottom: "10px", fontWeight: "600" }}>Méthodologie :</p>
                <ol style={{ color: colors.textSecondary, lineHeight: "1.8", marginLeft: "20px", marginBottom: "15px" }}>
                  <li>Utiliser sources certificats SSL : theHarvester -d target.com -b crtsh,certspotter</li>
                  <li>Compléter avec DNS : theHarvester -d target.com -b dnsdumpster -n (résout les IPs)</li>
                  <li>Ajouter Shodan si clé API disponible : theHarvester -d target.com -b shodan</li>
                  <li>Compiler la liste complète de sous-domaines</li>
                  <li>Tester accessibilité HTTP/HTTPS avec curl ou nmap</li>
                </ol>
                <p style={{ color: colors.accent, marginBottom: "10px", fontWeight: "600" }}>Analyse :</p>
                <ul style={{ color: colors.textSecondary, lineHeight: "1.8", marginLeft: "20px" }}>
                  <li>Identifier sous-domaines sensibles : admin.target.com, vpn.target.com, dev.target.com</li>
                  <li>Repérer sous-domaines obsolètes ou abandonnés (potentiellement vulnérables)</li>
                  <li>Cartographier infrastructure (mail.*, www.*, cdn.*)</li>
                </ul>
              </div>

              <div style={{ background: colors.bgPrimary, padding: "25px", borderRadius: "12px" }}>
                <h3 style={{ color: colors.accent, fontSize: "1.3rem", marginBottom: "15px" }}>Exercice 3 : Intelligence sur les employés</h3>
                <p style={{ color: colors.textSecondary, marginBottom: "15px", lineHeight: "1.7" }}>
                  <strong>Objectif :</strong> Extraire des noms d'employés et leurs rôles pour du social engineering.
                </p>
                <p style={{ color: colors.accent, marginBottom: "10px", fontWeight: "600" }}>Méthodologie :</p>
                <ol style={{ color: colors.textSecondary, lineHeight: "1.8", marginLeft: "20px", marginBottom: "15px" }}>
                  <li>Lancer recherche avec LinkedIn : theHarvester -d company.com -b google,linkedin</li>
                  <li>Extraire noms depuis documents publics (rapports annuels PDF avec métadonnées)</li>
                  <li>Croiser avec emails trouvés pour identifier patterns (prenom.nom@ = employés actuels)</li>
                  <li>Rechercher sur LinkedIn manuellement pour confirmer postes</li>
                  <li>Créer une base de données : Nom | Email probable | Poste | Source</li>
                </ol>
                <p style={{ color: colors.accent, marginBottom: "10px", fontWeight: "600" }}>Usage éthique :</p>
                <p style={{ color: colors.textSecondary, lineHeight: "1.8", margin: 0 }}>
                  ⚠️ Ces informations ne doivent servir qu'à des audits de sécurité autorisés ou de la sensibilisation interne. Toute utilisation malveillante (phishing, usurpation d'identité) est illégale et punissable pénalement.
                </p>
              </div>
            </div>
          )}

          {activeTab === "quiz" && (
            <div>
              <h2 style={{ color: colors.textPrimary, fontSize: "2rem", marginBottom: "20px" }}>🎯 Quiz de validation</h2>
              <p style={{ color: colors.textSecondary, marginBottom: "30px", lineHeight: "1.7" }}>
                Répondez aux 5 questions pour valider vos connaissances. Un score de 4/5 minimum est requis pour débloquer le badge Expert theHarvester.
              </p>

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
                        transition: "all 0.3s ease"
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

              <div style={{ display: "flex", gap: "15px" }}>
                <button
                  onClick={handleQuizSubmit}
                  disabled={Object.keys(quizAnswers).length !== quizQuestions.length}
                  style={{
                    padding: "15px 40px",
                    background: Object.keys(quizAnswers).length === quizQuestions.length ? colors.accent : colors.border,
                    color: "#020617",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "1.1rem",
                    fontWeight: "600",
                    cursor: Object.keys(quizAnswers).length === quizQuestions.length ? "pointer" : "not-allowed",
                    transition: "all 0.3s ease"
                  }}
                >
                  Valider mes réponses
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
                    transition: "all 0.3s ease"
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
                  🔄 Réinitialiser
                </button>
              </div>

              {showResults && (
                <div style={{
                  marginTop: "30px",
                  padding: "25px",
                  background: getScore() >= 4 ? colors.accent + "20" : "#ef444420",
                  border: `2px solid ${getScore() >= 4 ? colors.accent : "#ef4444"}`,
                  borderRadius: "12px",
                }}>
                  <h3 style={{ color: getScore() >= 4 ? colors.accent : "#ef4444", fontSize: "1.5rem", marginBottom: "10px" }}>
                    {getScore() >= 4 ? "✅ Quiz validé !" : "❌ Score insuffisant"}
                  </h3>
                  <p style={{ color: colors.textPrimary, fontSize: "1.2rem", marginBottom: getScore() >= 4 ? "10px" : "0" }}>
                    Score : {getScore()}/{quizQuestions.length}
                  </p>
                  {getScore() >= 4 && (
                    <p style={{ color: colors.textSecondary, fontSize: "1rem", margin: 0 }}>
                      🏆 Félicitations ! Vous avez débloqué le badge Expert theHarvester.
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
            <h3 style={{ color: "#00ff9c", fontSize: "1.5rem", marginBottom: "15px", textAlign: "center" }}>
              ⚠️ Réinitialiser le module
            </h3>
            <p style={{ color: "#9ca3af", marginBottom: "30px", textAlign: "center", lineHeight: "1.6" }}>
              Cette action effacera toutes vos réponses et votre progression dans ce module. Êtes-vous sûr ?
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
                  transition: "all 0.3s ease"
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
                  transition: "all 0.3s ease"
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

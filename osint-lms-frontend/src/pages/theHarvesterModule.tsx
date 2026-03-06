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
    { id: "theory", label: "📖 Théorie" },
    { id: "tools", label: "🔧 Outils" },
    { id: "exercises", label: "💡 Exercices" },
    { id: "quiz", label: "🎯 Quiz" },
  ];

  const quizQuestions = [
    { id: 1, question: "Que fait theHarvester ?", options: ["Collecte emails, sous-domaines, IPs", "Scan de ports", "Crack de mots de passe", "Analyse malware"], correct: 0 },
    { id: 2, question: "Quelle source theHarvester utilise ?", options: ["Google, Bing, LinkedIn, Shodan", "Uniquement Google", "Bases SQL", "Fichiers locaux"], correct: 0 },
    { id: 3, question: "Comment lancer theHarvester ?", options: ["theHarvester -d domain.com -b all", "harvester --domain domain.com", "python harvest.py", "theharvest -t"], correct: 0 },
    { id: 4, question: "theHarvester est-il légal ?", options: ["Oui si données publiques", "Non jamais", "Oui sans restriction", "Avec autorisation écrite"], correct: 0 },
    { id: 5, question: "Format d'export theHarvester ?", options: ["JSON, XML, HTML", "PDF uniquement", "SQL", "Texte brut"], correct: 0 }
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
          <h1 style={{ fontSize: "2.5rem", fontWeight: "700", color: colors.textPrimary, marginBottom: "15px" }}>Module theHarvester</h1>
          <p style={{ fontSize: "1.1rem", color: colors.textSecondary, maxWidth: "700px", margin: "0 auto" }}>Collecte automatisée d'emails, sous-domaines et IPs</p>
          {localStorage.getItem(BADGE_KEY) === "true" && (
            <div style={{ marginTop: "15px", display: "inline-block", padding: "8px 20px", background: colors.accent + "20", border: `2px solid ${colors.accent}`, borderRadius: "20px", color: colors.accent, fontWeight: "600" }}>✓ Badge débloqué</div>
          )}
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: "15px", marginBottom: "40px", flexWrap: "wrap" }}>
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ padding: "12px 24px", background: activeTab === tab.id ? colors.accent : colors.bgSecondary, color: activeTab === tab.id ? "#020617" : colors.textPrimary, border: `2px solid ${activeTab === tab.id ? colors.accent : colors.border}`, borderRadius: "12px", fontSize: "1rem", fontWeight: "600", cursor: "pointer" }}>
              {tab.label}
            </button>
          ))}
        </div>

        <div style={{ background: colors.bgSecondary, border: `1px solid ${colors.border}`, borderRadius: "12px", padding: "40px" }}>
          {activeTab === "theory" && (
            <div>
              <h2 style={{ color: colors.textPrimary, fontSize: "2rem", marginBottom: "20px" }}>📖 theHarvester OSINT</h2>
              <p style={{ color: colors.textSecondary, lineHeight: "1.8", marginBottom: "20px" }}>
                <strong>theHarvester</strong> est un outil Python open-source qui collecte automatiquement emails, noms, sous-domaines, IPs et URLs associés à un domaine en interrogeant sources publiques (moteurs recherche, réseaux sociaux, APIs).
              </p>
              <h3 style={{ color: colors.accent, fontSize: "1.5rem", marginBottom: "15px" }}>🎯 Cas d'usage</h3>
              <ul style={{ color: colors.textSecondary, lineHeight: "1.8", marginLeft: "20px", marginBottom: "25px" }}>
                <li><strong>Reconnaissance pré-attaque :</strong> Identifier emails pour phishing, sous-domaines pour pivot</li>
                <li><strong>Surface d'attaque :</strong> Cartographier actifs exposés d'une organisation</li>
                <li><strong>OSINT passif :</strong> Collecte sans interaction directe avec cible</li>
                <li><strong>Pentest :</strong> Phase reconnaissance pour tests d'intrusion</li>
              </ul>
              <h3 style={{ color: colors.accent, fontSize: "1.5rem", marginBottom: "15px" }}>📊 Sources interrogées</h3>
              <div style={{ background: colors.bgPrimary, padding: "20px", borderRadius: "8px" }}>
                <p style={{ color: colors.textSecondary, lineHeight: "1.6", margin: 0 }}>
                  <strong>Moteurs :</strong> Google, Bing, Yahoo, Baidu, DuckDuckGo<br/>
                  <strong>Réseaux :</strong> LinkedIn, Twitter<br/>
                  <strong>APIs :</strong> Shodan, VirusTotal, ThreatCrowd, DNSdumpster<br/>
                  <strong>Autres :</strong> Hunter.io, PGP servers, Netcraft
                </p>
              </div>
            </div>
          )}

          {activeTab === "tools" && (
            <div>
              <h2 style={{ color: colors.textPrimary, fontSize: "2rem", marginBottom: "20px" }}>🔧 Utilisation theHarvester</h2>
              <h3 style={{ color: colors.accent, fontSize: "1.5rem", marginBottom: "15px" }}>Installation</h3>
              <div style={{ background: colors.bgPrimary, padding: "15px", borderRadius: "8px", marginBottom: "20px", fontFamily: "monospace", fontSize: "0.85rem" }}>
                <div style={{ color: colors.textSecondary, marginBottom: "8px" }}>git clone https://github.com/laramies/theHarvester</div>
                <div style={{ color: colors.textSecondary, marginBottom: "8px" }}>cd theHarvester</div>
                <div style={{ color: colors.textSecondary }}>pip3 install -r requirements.txt</div>
              </div>
              <h3 style={{ color: colors.accent, fontSize: "1.5rem", marginBottom: "15px" }}>Commandes de base</h3>
              <div style={{ background: colors.bgPrimary, padding: "15px", borderRadius: "8px", fontFamily: "monospace", fontSize: "0.85rem", marginBottom: "15px" }}>
                <div style={{ marginBottom: "12px", color: colors.textSecondary }}>
                  <strong style={{ color: colors.accent }}>theHarvester -d example.com -b all</strong><br/>
                  → Toutes sources
                </div>
                <div style={{ marginBottom: "12px", color: colors.textSecondary }}>
                  <strong style={{ color: colors.accent }}>theHarvester -d example.com -b google,bing</strong><br/>
                  → Sources spécifiques
                </div>
                <div style={{ color: colors.textSecondary }}>
                  <strong style={{ color: colors.accent }}>theHarvester -d example.com -b all -f output.json</strong><br/>
                  → Export JSON
                </div>
              </div>
              <h3 style={{ color: colors.accent, fontSize: "1.5rem", marginBottom: "15px" }}>Options avancées</h3>
              <div style={{ background: colors.bgPrimary, padding: "15px", borderRadius: "8px", fontFamily: "monospace", fontSize: "0.85rem" }}>
                <div style={{ marginBottom: "8px", color: colors.textSecondary }}><strong style={{ color: colors.accent }}>-v</strong> : Mode verbose</div>
                <div style={{ marginBottom: "8px", color: colors.textSecondary }}><strong style={{ color: colors.accent }}>-s</strong> : Scan Shodan (nécessite API key)</div>
                <div style={{ color: colors.textSecondary }}><strong style={{ color: colors.accent }}>-n</strong> : DNS reverse lookup</div>
              </div>
            </div>
          )}

          {activeTab === "exercises" && (
            <div>
              <h2 style={{ color: colors.textPrimary, fontSize: "2rem", marginBottom: "20px" }}>💡 Exercices Pratiques</h2>
              <div style={{ background: colors.bgPrimary, padding: "25px", borderRadius: "12px", marginBottom: "20px" }}>
                <h3 style={{ color: colors.accent, fontSize: "1.3rem", marginBottom: "15px" }}>Exercice 1 : Collecte emails</h3>
                <p style={{ color: colors.textSecondary, marginBottom: "15px" }}><strong>Objectif :</strong> Lister emails publics d'une entreprise</p>
                <ol style={{ color: colors.textSecondary, lineHeight: "1.8", marginLeft: "20px" }}>
                  <li>Lancer: theHarvester -d targetcompany.com -b google,bing,linkedin</li>
                  <li>Exporter: -f emails.json</li>
                  <li>Analyser patterns: prenom.nom@, firstname@</li>
                </ol>
              </div>
              <div style={{ background: colors.bgPrimary, padding: "25px", borderRadius: "12px", marginBottom: "20px" }}>
                <h3 style={{ color: colors.accent, fontSize: "1.3rem", marginBottom: "15px" }}>Exercice 2 : Sous-domaines</h3>
                <p style={{ color: colors.textSecondary, marginBottom: "15px" }}><strong>Objectif :</strong> Cartographier surface d'attaque</p>
                <ol style={{ color: colors.textSecondary, lineHeight: "1.8", marginLeft: "20px" }}>
                  <li>theHarvester -d example.com -b crtsh,virustotal</li>
                  <li>Noter sous-domaines: mail.example.com, dev.example.com</li>
                  <li>Tester accessibilité avec nmap</li>
                </ol>
              </div>
              <div style={{ background: colors.bgPrimary, padding: "25px", borderRadius: "12px" }}>
                <h3 style={{ color: colors.accent, fontSize: "1.3rem", marginBottom: "15px" }}>Exercice 3 : Enrichissement Shodan</h3>
                <p style={{ color: colors.textSecondary, marginBottom: "15px" }}><strong>Objectif :</strong> Croiser theHarvester + Shodan</p>
                <ol style={{ color: colors.textSecondary, lineHeight: "1.8", marginLeft: "20px" }}>
                  <li>Collecter IPs: theHarvester -d example.com -b all -n</li>
                  <li>Enrichir avec Shodan: -s (API key)</li>
                  <li>Analyser ports/services ouverts</li>
                </ol>
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

import { useState } from "react";
import { useThemeColors } from "../context/ThemeContext";

export default function TelegramModule() {
  const colors = useThemeColors();
  const [activeTab, setActiveTab] = useState("theory");
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

  const BADGE_KEY = "badge_module_telegram";
  const ANSWERS_KEY = "quiz_answers_telegram";
  const RESULTS_KEY = "quiz_results_telegram";

  // Charger les réponses sauvegardées
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
    {
      id: 1,
      question: "Qu'est-ce que Shodan indexe principalement ?",
      options: [
        "Des bannières de services exposés sur Internet",
        "Des pages web statiques",
        "Des profils de réseaux sociaux",
        "Des documents PDF"
      ],
      correct: 0
    },
    {
      id: 2,
      question: "Quelle requête Shodan permet de trouver des webcams non sécurisées ?",
      options: [
        'product:"webcam" has_screenshot:true',
        'webcam password:default',
        'camera port:80',
        'ip_camera country:US'
      ],
      correct: 0
    },
    {
      id: 3,
      question: "Quel filtre Shodan permet de rechercher par organisation propriétaire ?",
      options: [
        "org:",
        "company:",
        "owner:",
        "entity:"
      ],
      correct: 0
    },
    {
      id: 4,
      question: "Comment Shodan détecte-t-il les appareils vulnérables ?",
      options: [
        "En analysant les versions de logiciels dans les bannières",
        "En hackant les appareils",
        "En utilisant des exploits",
        "En scannant les fichiers système"
      ],
      correct: 0
    },
    {
      id: 5,
      question: "Quel est le port par défaut pour le protocole RDP (Remote Desktop) ?",
      options: [
        "3389",
        "22",
        "443",
        "8080"
      ],
      correct: 0
    }
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
    quizQuestions.forEach(q => {
      if (quizAnswers[q.id] === q.correct.toString()) correct++;
    });
    return correct;
  };

  return (
    <div style={{ minHeight: "100vh", background: colors.bgPrimary, paddingTop: "80px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 20px" }}>
        
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div style={{ fontSize: "4rem", marginBottom: "15px" }}>✈️</div>
          <h1 style={{ fontSize: "2.5rem", fontWeight: "700", color: colors.textPrimary, marginBottom: "15px" }}>
            Module Telegram OSINT
          </h1>
          <p style={{ fontSize: "1.1rem", color: colors.textSecondary, maxWidth: "700px", margin: "0 auto" }}>
            Le moteur de recherche des objets connectés et infrastructures exposées
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
              <h2 style={{ color: colors.textPrimary, fontSize: "2rem", marginBottom: "20px" }}>📖 Qu'est-ce que Shodan ?</h2>
              
              <p style={{ color: colors.textSecondary, lineHeight: "1.8", marginBottom: "20px" }}>
                Shodan est un moteur de recherche spécialisé qui scanne l'ensemble d'Internet pour identifier et indexer les <strong>appareils connectés</strong> et leurs <strong>bannières de services</strong>. Contrairement à Google qui indexe du contenu web, Shodan indexe les métadonnées des serveurs, routeurs, caméras IP, systèmes industriels (SCADA), bases de données exposées et tout autre équipement connecté à Internet.
              </p>

              <h3 style={{ color: colors.accent, fontSize: "1.5rem", marginBottom: "15px", marginTop: "30px" }}>🎯 Cas d'usage en OSINT</h3>
              <ul style={{ color: colors.textSecondary, lineHeight: "1.8", marginLeft: "20px", marginBottom: "25px" }}>
                <li><strong>Cartographie d'infrastructure :</strong> Identifier tous les serveurs et services d'une organisation cible</li>
                <li><strong>Détection de vulnérabilités :</strong> Trouver des systèmes avec des versions logicielles obsolètes ou vulnérables</li>
                <li><strong>Surface d'attaque :</strong> Évaluer l'exposition publique d'une entreprise (serveurs, webcams, IoT)</li>
                <li><strong>Honeypot detection :</strong> Identifier des systèmes pièges déployés par les chercheurs</li>
                <li><strong>Recherche de fuites :</strong> Découvrir des bases de données, dashboards ou APIs exposés sans authentification</li>
              </ul>

              <h3 style={{ color: colors.accent, fontSize: "1.5rem", marginBottom: "15px", marginTop: "30px" }}>🔑 Comment fonctionne Shodan ?</h3>
              <div style={{ background: colors.bgPrimary, padding: "20px", borderRadius: "8px", marginBottom: "15px" }}>
                <h4 style={{ color: colors.accent, marginBottom: "10px" }}>1. Scanning massif</h4>
                <p style={{ color: colors.textSecondary, lineHeight: "1.6", margin: 0 }}>
                  Shodan envoie des requêtes sur tous les ports courants (80, 443, 22, 21, 3389, etc.) de millions d'adresses IP et collecte les bannières renvoyées par les services.
                </p>
              </div>

              <div style={{ background: colors.bgPrimary, padding: "20px", borderRadius: "8px", marginBottom: "15px" }}>
                <h4 style={{ color: colors.accent, marginBottom: "10px" }}>2. Indexation des métadonnées</h4>
                <p style={{ color: colors.textSecondary, lineHeight: "1.6", margin: 0 }}>
                  Les bannières contiennent : type de serveur, version du logiciel, système d'exploitation, certificats SSL, localisation géographique, fournisseur (ISP), etc.
                </p>
              </div>

              <div style={{ background: colors.bgPrimary, padding: "20px", borderRadius: "8px" }}>
                <h4 style={{ color: colors.accent, marginBottom: "10px" }}>3. Recherche avancée</h4>
                <p style={{ color: colors.textSecondary, lineHeight: "1.6", margin: 0 }}>
                  Shodan permet de filtrer par pays, organisation, produit, port, version, CVE, et bien plus pour cibler précisément des systèmes.
                </p>
              </div>
            </div>
          )}

          {activeTab === "tools" && (
            <div>
              <h2 style={{ color: colors.textPrimary, fontSize: "2rem", marginBottom: "20px" }}>🔧 Filtres et Syntaxe Shodan</h2>

              <h3 style={{ color: colors.accent, fontSize: "1.5rem", marginBottom: "15px" }}>📌 Filtres de base</h3>
              <div style={{ background: colors.bgPrimary, padding: "15px", borderRadius: "8px", marginBottom: "20px", fontFamily: "monospace", fontSize: "0.9rem" }}>
                <div style={{ marginBottom: "12px", color: colors.textSecondary }}>
                  <strong style={{ color: colors.accent }}>country:FR</strong> → Appareils en France
                </div>
                <div style={{ marginBottom: "12px", color: colors.textSecondary }}>
                  <strong style={{ color: colors.accent }}>city:"Paris"</strong> → Appareils à Paris
                </div>
                <div style={{ marginBottom: "12px", color: colors.textSecondary }}>
                  <strong style={{ color: colors.accent }}>port:3389</strong> → Serveurs RDP (Remote Desktop)
                </div>
                <div style={{ marginBottom: "12px", color: colors.textSecondary }}>
                  <strong style={{ color: colors.accent }}>product:"Apache"</strong> → Serveurs Apache
                </div>
                <div style={{ marginBottom: "12px", color: colors.textSecondary }}>
                  <strong style={{ color: colors.accent }}>org:"Amazon"</strong> → Infrastructure appartenant à Amazon
                </div>
                <div style={{ color: colors.textSecondary }}>
                  <strong style={{ color: colors.accent }}>hostname:"example.com"</strong> → Domaine spécifique
                </div>
              </div>

              <h3 style={{ color: colors.accent, fontSize: "1.5rem", marginBottom: "15px", marginTop: "30px" }}>💎 Requêtes avancées</h3>
              <div style={{ background: colors.bgPrimary, padding: "15px", borderRadius: "8px", marginBottom: "15px", fontFamily: "monospace", fontSize: "0.85rem" }}>
                <div style={{ marginBottom: "15px", color: colors.textSecondary }}>
                  <code style={{ color: colors.accent, display: "block", marginBottom: "5px" }}>product:"MongoDB" port:27017 -authentication</code>
                  <p style={{ margin: 0, fontSize: "0.9rem" }}>→ Bases MongoDB sans authentification</p>
                </div>
                <div style={{ marginBottom: "15px", color: colors.textSecondary }}>
                  <code style={{ color: colors.accent, display: "block", marginBottom: "5px" }}>"Server: IP Webcam Server" has_screenshot:true</code>
                  <p style={{ margin: 0, fontSize: "0.9rem" }}>→ Webcams avec captures d'écran disponibles</p>
                </div>
                <div style={{ marginBottom: "15px", color: colors.textSecondary }}>
                  <code style={{ color: colors.accent, display: "block", marginBottom: "5px" }}>product:"Apache" "2.2" country:US</code>
                  <p style={{ margin: 0, fontSize: "0.9rem" }}>→ Serveurs Apache 2.2 obsolètes aux USA</p>
                </div>
                <div style={{ color: colors.textSecondary }}>
                  <code style={{ color: colors.accent, display: "block", marginBottom: "5px" }}>org:"Target Corporation" port:80,443</code>
                  <p style={{ margin: 0, fontSize: "0.9rem" }}>→ Serveurs web de Target Corporation</p>
                </div>
              </div>

              <h3 style={{ color: colors.accent, fontSize: "1.5rem", marginBottom: "15px", marginTop: "30px" }}>🌐 Accès Shodan</h3>
              <p style={{ color: colors.textSecondary, marginBottom: "10px" }}>
                <strong>Site web :</strong> <a href="https://www.shodan.io" target="_blank" rel="noopener noreferrer" style={{ color: colors.accent }}>https://www.shodan.io</a>
              </p>
              <p style={{ color: colors.textSecondary, marginBottom: "15px" }}>
                <strong>CLI (ligne de commande) :</strong>
              </p>
              <div style={{ background: colors.bgPrimary, padding: "15px", borderRadius: "8px", fontFamily: "monospace", fontSize: "0.85rem" }}>
                <div style={{ marginBottom: "10px", color: colors.textSecondary }}>
                  # Installation<br/>
                  <span style={{ color: colors.accent }}>pip install shodan</span>
                </div>
                <div style={{ marginBottom: "10px", color: colors.textSecondary }}>
                  # Configuration<br/>
                  <span style={{ color: colors.accent }}>shodan init YOUR_API_KEY</span>
                </div>
                <div style={{ color: colors.textSecondary }}>
                  # Recherche<br/>
                  <span style={{ color: colors.accent }}>shodan search "apache country:FR"</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === "exercises" && (
            <div>
              <h2 style={{ color: colors.textPrimary, fontSize: "2rem", marginBottom: "20px" }}>💡 Exercices Pratiques</h2>

              <div style={{ background: colors.bgPrimary, padding: "25px", borderRadius: "12px", marginBottom: "20px" }}>
                <h3 style={{ color: colors.accent, fontSize: "1.3rem", marginBottom: "15px" }}>Exercice 1 : Cartographie d'entreprise</h3>
                <p style={{ color: colors.textSecondary, marginBottom: "15px" }}>
                  <strong>Objectif :</strong> Identifier l'infrastructure web d'une grande entreprise technologique.
                </p>
                <p style={{ color: colors.textSecondary, marginBottom: "10px" }}><strong>Requête :</strong></p>
                <code style={{ background: colors.bgSecondary, padding: "10px 15px", borderRadius: "8px", display: "block", color: colors.accent, marginBottom: "15px" }}>
                  org:"Microsoft Corporation" port:443
                </code>
                <p style={{ color: colors.textSecondary }}>
                  <strong>Analyse :</strong> Comptez le nombre de serveurs, notez les villes, identifiez les certificats SSL utilisés.
                </p>
              </div>

              <div style={{ background: colors.bgPrimary, padding: "25px", borderRadius: "12px", marginBottom: "20px" }}>
                <h3 style={{ color: colors.accent, fontSize: "1.3rem", marginBottom: "15px" }}>Exercice 2 : Détection de vulnérabilités</h3>
                <p style={{ color: colors.textSecondary, marginBottom: "15px" }}>
                  <strong>Objectif :</strong> Trouver des serveurs Apache avec des versions obsolètes.
                </p>
                <p style={{ color: colors.textSecondary, marginBottom: "10px" }}><strong>Requête :</strong></p>
                <code style={{ background: colors.bgSecondary, padding: "10px 15px", borderRadius: "8px", display: "block", color: colors.accent, marginBottom: "15px" }}>
                  product:"Apache httpd" "2.2" port:80
                </code>
                <p style={{ color: colors.textSecondary }}>
                  <strong>Analyse :</strong> Apache 2.2 n'est plus maintenu depuis 2017. Ces serveurs sont potentiellement vulnérables à des CVE connus.
                </p>
              </div>

              <div style={{ background: colors.bgPrimary, padding: "25px", borderRadius: "12px" }}>
                <h3 style={{ color: colors.accent, fontSize: "1.3rem", marginBottom: "15px" }}>Exercice 3 : Recherche d'appareils IoT</h3>
                <p style={{ color: colors.textSecondary, marginBottom: "15px" }}>
                  <strong>Objectif :</strong> Identifier des webcams IP publiquement accessibles.
                </p>
                <p style={{ color: colors.textSecondary, marginBottom: "10px" }}><strong>Requête :</strong></p>
                <code style={{ background: colors.bgSecondary, padding: "10px 15px", borderRadius: "8px", display: "block", color: colors.accent, marginBottom: "15px" }}>
                  product:"webcamXP" has_screenshot:true
                </code>
                <p style={{ color: "#ef4444", marginTop: "15px", fontWeight: "600" }}>
                  ⚠️ ÉTHIQUE : Ne tentez JAMAIS d'accéder à ces webcams. Cet exercice est uniquement éducatif.
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
                  Valider le quiz
                </button>

                <button onClick={() => setShowResetModal(true)} style={{ padding: "15px 40px", background: "#0b0f1a", color: "#00ff9c", border: "2px solid #00ff9c", borderRadius: "8px", fontSize: "1.1rem", fontWeight: "600", cursor: "pointer", transition: "all 0.3s ease" }} onMouseEnter={(e) => { e.currentTarget.style.background = "#00ff9c"; e.currentTarget.style.color = "#0b0f1a"; }} onMouseLeave={(e) => { e.currentTarget.style.background = "#0b0f1a"; e.currentTarget.style.color = "#00ff9c"; }}>
                  🔄 Réinitialiser
                </button>
              </div>

              {showResults && (
                <div style={{ marginTop: "30px", padding: "25px", background: getScore() >= 4 ? colors.accent + "20" : "#ef444420", border: `2px solid ${getScore() >= 4 ? colors.accent : "#ef4444"}`, borderRadius: "12px" }}>
                  <h3 style={{ color: getScore() >= 4 ? colors.accent : "#ef4444", fontSize: "1.5rem", marginBottom: "10px" }}>
                    {getScore() >= 4 ? "✅ Félicitations !" : "❌ Pas encore..."}
                  </h3>
                  <p style={{ color: colors.textPrimary, fontSize: "1.2rem" }}>
                    Score : {getScore()}/{quizQuestions.length}
                  </p>
                  <p style={{ color: colors.textSecondary, marginTop: "10px" }}>
                    {getScore() >= 4 ? "Badge débloqué ! Vous maîtrisez Shodan ! 🎉" : "Révisez le module et réessayez."}
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
          <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", background: "#0b0f1a", border: "3px solid #00ff9c", borderRadius: "12px", padding: "40px", maxWidth: "500px", width: "90%", zIndex: 9999, boxShadow: "0 0 40px rgba(0, 255, 156, 0.5)" }}>
            <h3 style={{ color: "#00ff9c", fontSize: "1.5rem", marginBottom: "15px", textAlign: "center" }}>⚠️ Réinitialiser le Quiz</h3>
            <p style={{ color: "#9ca3af", marginBottom: "30px", textAlign: "center", lineHeight: "1.6" }}>
              Êtes-vous sûr ? Toutes vos réponses et le badge seront effacés.
            </p>
            <div style={{ display: "flex", gap: "15px", justifyContent: "center" }}>
              <button onClick={() => setShowResetModal(false)} style={{ padding: "12px 30px", background: "transparent", color: "#9ca3af", border: "2px solid #2a3f3f", borderRadius: "8px", fontSize: "1rem", fontWeight: "600", cursor: "pointer" }}>
                Annuler
              </button>
              <button onClick={handleReset} style={{ padding: "12px 30px", background: "#00ff9c", color: "#0b0f1a", border: "none", borderRadius: "8px", fontSize: "1rem", fontWeight: "600", cursor: "pointer" }}>
                Confirmer
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

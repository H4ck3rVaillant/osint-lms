import { useState } from "react";
import { useThemeColors } from "../context/ThemeContext";

export default function ShodanModule() {
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
      question: "Qu'est-ce que Shodan ?",
      options: [
        "Un moteur de recherche pour objets connectés",
        "Un outil de scan de ports",
        "Un VPN gratuit",
        "Un antivirus"
      ],
      correct: 0
    },
    {
      id: 2,
      question: "Quelle commande Shodan permet de filtrer par pays ?",
      options: [
        "country:US",
        "location:US",
        "geo:US",
        "nation:US"
      ],
      correct: 0
    },
    {
      id: 3,
      question: "Quel port est utilisé par défaut pour les webcams IP ?",
      options: [
        "80",
        "443",
        "8080",
        "554"
      ],
      correct: 0
    },
    {
      id: 4,
      question: "Que signifie le filtre 'product:' dans Shodan ?",
      options: [
        "Recherche par nom de produit/service",
        "Recherche par prix",
        "Recherche par fabricant",
        "Recherche par version"
      ],
      correct: 0
    },
    {
      id: 5,
      question: "Shodan peut-il détecter des appareils IoT vulnérables ?",
      options: [
        "Oui, c'est une de ses fonctions principales",
        "Non, seulement les sites web",
        "Oui, mais uniquement avec un compte payant",
        "Non, il ne fait que scanner les ports"
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
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div style={{ fontSize: "4rem", marginBottom: "15px" }}>🔍</div>
          <h1 style={{
            fontSize: "2.5rem",
            fontWeight: "700",
            color: colors.textPrimary,
            marginBottom: "15px",
          }}>
            Module Shodan OSINT
          </h1>
          <p style={{
            fontSize: "1.1rem",
            color: colors.textSecondary,
            maxWidth: "700px",
            margin: "0 auto",
          }}>
            Maîtrisez Shodan, le moteur de recherche pour objets connectés et appareils IoT
          </p>
        </div>

        {/* Tabs */}
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

        {/* Content */}
        <div style={{
          background: colors.bgSecondary,
          border: `1px solid ${colors.border}`,
          borderRadius: "12px",
          padding: "40px",
        }}>
          {/* THÉORIE */}
          {activeTab === "theory" && (
            <div>
              <h2 style={{ color: colors.textPrimary, fontSize: "2rem", marginBottom: "20px" }}>
                📖 Qu'est-ce que Shodan ?
              </h2>
              
              <p style={{ color: colors.textSecondary, lineHeight: "1.8", marginBottom: "20px" }}>
                Shodan est souvent appelé <strong>"le Google des hackers"</strong>. Contrairement aux moteurs de recherche traditionnels qui indexent des pages web, Shodan scanne l'ensemble d'Internet pour identifier tous les appareils connectés : serveurs, webcams, routeurs, systèmes industriels, etc.
              </p>

              <h3 style={{ color: colors.accent, fontSize: "1.5rem", marginBottom: "15px", marginTop: "30px" }}>
                🎯 Pourquoi utiliser Shodan en OSINT ?
              </h3>

              <ul style={{ color: colors.textSecondary, lineHeight: "1.8", marginLeft: "20px" }}>
                <li>Identifier les infrastructures d'une entreprise cible</li>
                <li>Découvrir des appareils IoT mal configurés</li>
                <li>Détecter des vulnérabilités exposées publiquement</li>
                <li>Cartographier les services en ligne d'une organisation</li>
                <li>Trouver des webcams, imprimantes, bases de données ouvertes</li>
              </ul>

              <h3 style={{ color: colors.accent, fontSize: "1.5rem", marginBottom: "15px", marginTop: "30px" }}>
                🔑 Concepts clés
              </h3>

              <div style={{ background: colors.bgPrimary, padding: "20px", borderRadius: "8px", marginBottom: "15px" }}>
                <h4 style={{ color: colors.accent, marginBottom: "10px" }}>Bannière (Banner)</h4>
                <p style={{ color: colors.textSecondary, lineHeight: "1.6", margin: 0 }}>
                  Information renvoyée par un service lorsqu'on s'y connecte. Elle contient généralement le type de serveur, sa version, et d'autres métadonnées.
                </p>
              </div>

              <div style={{ background: colors.bgPrimary, padding: "20px", borderRadius: "8px", marginBottom: "15px" }}>
                <h4 style={{ color: colors.accent, marginBottom: "10px" }}>Filtres Shodan</h4>
                <p style={{ color: colors.textSecondary, lineHeight: "1.6", margin: 0 }}>
                  Critères de recherche comme <code style={{ background: colors.bgSecondary, padding: "2px 6px", borderRadius: "4px" }}>country:</code>, <code style={{ background: colors.bgSecondary, padding: "2px 6px", borderRadius: "4px" }}>port:</code>, <code style={{ background: colors.bgSecondary, padding: "2px 6px", borderRadius: "4px" }}>product:</code> qui permettent d'affiner les résultats.
                </p>
              </div>

              <div style={{ background: colors.bgPrimary, padding: "20px", borderRadius: "8px" }}>
                <h4 style={{ color: colors.accent, marginBottom: "10px" }}>Honeypot</h4>
                <p style={{ color: colors.textSecondary, lineHeight: "1.6", margin: 0 }}>
                  Système piège déployé pour attirer les attaquants. Shodan les détecte parfois dans ses résultats.
                </p>
              </div>
            </div>
          )}

          {/* OUTILS */}
          {activeTab === "tools" && (
            <div>
              <h2 style={{ color: colors.textPrimary, fontSize: "2rem", marginBottom: "20px" }}>
                🔧 Commandes et Filtres Shodan
              </h2>

              <h3 style={{ color: colors.accent, fontSize: "1.5rem", marginBottom: "15px" }}>
                📌 Filtres essentiels
              </h3>

              <div style={{ background: colors.bgPrimary, padding: "15px", borderRadius: "8px", marginBottom: "15px", fontFamily: "monospace" }}>
                <div style={{ marginBottom: "10px" }}>
                  <strong style={{ color: colors.accent }}>country:FR</strong>
                  <p style={{ color: colors.textSecondary, margin: "5px 0 0 0", fontSize: "0.9rem" }}>Recherche par pays (code ISO)</p>
                </div>
                <div style={{ marginBottom: "10px" }}>
                  <strong style={{ color: colors.accent }}>city:"Paris"</strong>
                  <p style={{ color: colors.textSecondary, margin: "5px 0 0 0", fontSize: "0.9rem" }}>Recherche par ville</p>
                </div>
                <div style={{ marginBottom: "10px" }}>
                  <strong style={{ color: colors.accent }}>port:80</strong>
                  <p style={{ color: colors.textSecondary, margin: "5px 0 0 0", fontSize: "0.9rem" }}>Recherche par port</p>
                </div>
                <div style={{ marginBottom: "10px" }}>
                  <strong style={{ color: colors.accent }}>product:"Apache"</strong>
                  <p style={{ color: colors.textSecondary, margin: "5px 0 0 0", fontSize: "0.9rem" }}>Recherche par produit/service</p>
                </div>
                <div style={{ marginBottom: "10px" }}>
                  <strong style={{ color: colors.accent }}>org:"Amazon"</strong>
                  <p style={{ color: colors.textSecondary, margin: "5px 0 0 0", fontSize: "0.9rem" }}>Recherche par organisation</p>
                </div>
                <div>
                  <strong style={{ color: colors.accent }}>hostname:"example.com"</strong>
                  <p style={{ color: colors.textSecondary, margin: "5px 0 0 0", fontSize: "0.9rem" }}>Recherche par nom de domaine</p>
                </div>
              </div>

              <h3 style={{ color: colors.accent, fontSize: "1.5rem", marginBottom: "15px", marginTop: "30px" }}>
                💎 Requêtes avancées
              </h3>

              <div style={{ background: colors.bgPrimary, padding: "15px", borderRadius: "8px", marginBottom: "15px", fontFamily: "monospace", fontSize: "0.95rem" }}>
                <div style={{ marginBottom: "15px" }}>
                  <code style={{ color: colors.accent }}>port:3389 country:US</code>
                  <p style={{ color: colors.textSecondary, margin: "5px 0 0 0" }}>Serveurs RDP aux États-Unis</p>
                </div>
                <div style={{ marginBottom: "15px" }}>
                  <code style={{ color: colors.accent }}>product:"MySQL" port:3306</code>
                  <p style={{ color: colors.textSecondary, margin: "5px 0 0 0" }}>Bases MySQL exposées</p>
                </div>
                <div style={{ marginBottom: "15px" }}>
                  <code style={{ color: colors.accent }}>"default password" port:80</code>
                  <p style={{ color: colors.textSecondary, margin: "5px 0 0 0" }}>Appareils avec mots de passe par défaut</p>
                </div>
                <div>
                  <code style={{ color: colors.accent }}>webcam country:FR</code>
                  <p style={{ color: colors.textSecondary, margin: "5px 0 0 0" }}>Webcams en France</p>
                </div>
              </div>

              <h3 style={{ color: colors.accent, fontSize: "1.5rem", marginBottom: "15px", marginTop: "30px" }}>
                🌐 Accès à Shodan
              </h3>

              <p style={{ color: colors.textSecondary, lineHeight: "1.8", marginBottom: "15px" }}>
                <strong>Site web :</strong> <a href="https://www.shodan.io" target="_blank" rel="noopener noreferrer" style={{ color: colors.accent }}>https://www.shodan.io</a>
              </p>

              <p style={{ color: colors.textSecondary, lineHeight: "1.8", marginBottom: "15px" }}>
                <strong>CLI (ligne de commande) :</strong>
              </p>

              <div style={{ background: colors.bgPrimary, padding: "15px", borderRadius: "8px", fontFamily: "monospace", fontSize: "0.9rem" }}>
                <div style={{ marginBottom: "10px", color: colors.textSecondary }}>
                  # Installation<br/>
                  <span style={{ color: colors.accent }}>pip install shodan</span>
                </div>
                <div style={{ marginBottom: "10px", color: colors.textSecondary }}>
                  # Configuration API<br/>
                  <span style={{ color: colors.accent }}>shodan init YOUR_API_KEY</span>
                </div>
                <div style={{ color: colors.textSecondary }}>
                  # Recherche<br/>
                  <span style={{ color: colors.accent }}>shodan search "apache country:FR"</span>
                </div>
              </div>
            </div>
          )}

          {/* EXERCICES */}
          {activeTab === "exercises" && (
            <div>
              <h2 style={{ color: colors.textPrimary, fontSize: "2rem", marginBottom: "20px" }}>
                💡 Exercices Pratiques
              </h2>

              <div style={{ background: colors.bgPrimary, padding: "25px", borderRadius: "12px", marginBottom: "20px" }}>
                <h3 style={{ color: colors.accent, fontSize: "1.3rem", marginBottom: "15px" }}>
                  Exercice 1 : Découverte des serveurs d'une organisation
                </h3>
                <p style={{ color: colors.textSecondary, lineHeight: "1.8", marginBottom: "15px" }}>
                  <strong>Objectif :</strong> Identifier tous les serveurs web appartenant à "Amazon" en France.
                </p>
                <p style={{ color: colors.textSecondary, lineHeight: "1.8", marginBottom: "10px" }}>
                  <strong>Requête :</strong>
                </p>
                <code style={{ background: colors.bgSecondary, padding: "10px 15px", borderRadius: "8px", display: "block", color: colors.accent }}>
                  org:"Amazon" country:FR port:443
                </code>
                <p style={{ color: colors.textSecondary, lineHeight: "1.8", marginTop: "15px" }}>
                  <strong>Analyse :</strong> Notez le nombre de résultats, les villes, et les versions de serveurs utilisées.
                </p>
              </div>

              <div style={{ background: colors.bgPrimary, padding: "25px", borderRadius: "12px", marginBottom: "20px" }}>
                <h3 style={{ color: colors.accent, fontSize: "1.3rem", marginBottom: "15px" }}>
                  Exercice 2 : Webcams publiques
                </h3>
                <p style={{ color: colors.textSecondary, lineHeight: "1.8", marginBottom: "15px" }}>
                  <strong>Objectif :</strong> Trouver des webcams IP accessibles publiquement à Paris.
                </p>
                <p style={{ color: colors.textSecondary, lineHeight: "1.8", marginBottom: "10px" }}>
                  <strong>Requête :</strong>
                </p>
                <code style={{ background: colors.bgSecondary, padding: "10px 15px", borderRadius: "8px", display: "block", color: colors.accent }}>
                  "Server: IP Webcam Server" city:"Paris"
                </code>
                <p style={{ color: colors.textSecondary, lineHeight: "1.8", marginTop: "15px" }}>
                  <strong>⚠️ Éthique :</strong> Ne tentez jamais d'accéder à ces webcams. Cet exercice est uniquement pour comprendre les risques d'exposition.
                </p>
              </div>

              <div style={{ background: colors.bgPrimary, padding: "25px", borderRadius: "12px" }}>
                <h3 style={{ color: colors.accent, fontSize: "1.3rem", marginBottom: "15px" }}>
                  Exercice 3 : Recherche de vulnérabilités
                </h3>
                <p style={{ color: colors.textSecondary, lineHeight: "1.8", marginBottom: "15px" }}>
                  <strong>Objectif :</strong> Identifier des serveurs Apache vulnérables (anciennes versions).
                </p>
                <p style={{ color: colors.textSecondary, lineHeight: "1.8", marginBottom: "10px" }}>
                  <strong>Requête :</strong>
                </p>
                <code style={{ background: colors.bgSecondary, padding: "10px 15px", borderRadius: "8px", display: "block", color: colors.accent }}>
                  product:"Apache" "2.2" port:80
                </code>
                <p style={{ color: colors.textSecondary, lineHeight: "1.8", marginTop: "15px" }}>
                  <strong>Analyse :</strong> Apache 2.2 n'est plus maintenu depuis 2017. Ces serveurs sont potentiellement vulnérables.
                </p>
              </div>
            </div>
          )}

          {/* QUIZ */}
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

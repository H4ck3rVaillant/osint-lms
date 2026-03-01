import { useState } from "react";
import { useThemeColors } from "../context/ThemeContext";

export default function TelegramModule() {
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
      question: "Qu'est-ce qu'un canal Telegram ?",
      options: [
        "Un moyen de diffusion public ou privé",
        "Un groupe de discussion privé",
        "Un bot automatisé",
        "Un service de VPN"
      ],
      correct: 0
    },
    {
      id: 2,
      question: "Comment accéder à un canal Telegram public ?",
      options: [
        "Via un lien t.me/NomCanal",
        "Il faut une invitation",
        "Uniquement via l'application mobile",
        "Impossible sans compte premium"
      ],
      correct: 0
    },
    {
      id: 3,
      question: "Quel outil permet de rechercher dans l'historique d'un canal Telegram ?",
      options: [
        "Telegram Desktop avec la fonction recherche",
        "Google",
        "Shodan",
        "Maltego"
      ],
      correct: 0
    },
    {
      id: 4,
      question: "Les messages Telegram sont-ils indexés par les moteurs de recherche ?",
      options: [
        "Oui, si le canal est public",
        "Non, jamais",
        "Seulement avec un compte premium",
        "Uniquement les images"
      ],
      correct: 0
    },
    {
      id: 5,
      question: "Est-il possible de récupérer l'historique complet d'un canal ?",
      options: [
        "Oui, via Telegram Desktop ou des outils de scraping",
        "Non, c'est impossible",
        "Uniquement les 100 derniers messages",
        "Seulement si on est admin"
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
          <div style={{ fontSize: "4rem", marginBottom: "15px" }}>✈️</div>
          <h1 style={{
            fontSize: "2.5rem",
            fontWeight: "700",
            color: colors.textPrimary,
            marginBottom: "15px",
          }}>
            Module Telegram OSINT
          </h1>
          <p style={{
            fontSize: "1.1rem",
            color: colors.textSecondary,
            maxWidth: "700px",
            margin: "0 auto",
          }}>
            Recherche et analyse de groupes, canaux et utilisateurs Telegram
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
                📖 Telegram OSINT : Vue d'ensemble
              </h2>
              
              <p style={{ color: colors.textSecondary, lineHeight: "1.8", marginBottom: "20px" }}>
                Telegram est une application de messagerie chiffrée avec plus de 700 millions d'utilisateurs actifs. Contrairement à WhatsApp, Telegram permet la création de <strong>canaux publics</strong> et de <strong>groupes de discussion massifs</strong> (jusqu'à 200 000 membres), ce qui en fait une plateforme riche pour l'OSINT.
              </p>

              <h3 style={{ color: colors.accent, fontSize: "1.5rem", marginBottom: "15px", marginTop: "30px" }}>
                🎯 Pourquoi Telegram est important en OSINT ?
              </h3>

              <ul style={{ color: colors.textSecondary, lineHeight: "1.8", marginLeft: "20px" }}>
                <li><strong>Canaux publics indexés :</strong> Des milliers de canaux partagent des informations publiquement</li>
                <li><strong>Pas de fact-checking :</strong> Beaucoup de désinformation et de leaks y circulent</li>
                <li><strong>Communautés spécialisées :</strong> Hacking, crypto, whistleblowing, journalisme</li>
                <li><strong>Anonymat relatif :</strong> Moins de contraintes qu'Instagram ou Facebook</li>
                <li><strong>Archives accessibles :</strong> Tout l'historique d'un canal est consultable</li>
              </ul>

              <h3 style={{ color: colors.accent, fontSize: "1.5rem", marginBottom: "15px", marginTop: "30px" }}>
                🔑 Structure de Telegram
              </h3>

              <div style={{ background: colors.bgPrimary, padding: "20px", borderRadius: "8px", marginBottom: "15px" }}>
                <h4 style={{ color: colors.accent, marginBottom: "10px" }}>Canaux (Channels)</h4>
                <p style={{ color: colors.textSecondary, lineHeight: "1.6", margin: 0 }}>
                  Diffusion unidirectionnelle où seuls les administrateurs peuvent poster. Peuvent être publics (accessibles via t.me/nom) ou privés (sur invitation).
                </p>
              </div>

              <div style={{ background: colors.bgPrimary, padding: "20px", borderRadius: "8px", marginBottom: "15px" }}>
                <h4 style={{ color: colors.accent, marginBottom: "10px" }}>Groupes (Groups)</h4>
                <p style={{ color: colors.textSecondary, lineHeight: "1.6", margin: 0 }}>
                  Discussions où tous les membres peuvent échanger. Limités à 200 000 membres. Peuvent être publics ou privés.
                </p>
              </div>

              <div style={{ background: colors.bgPrimary, padding: "20px", borderRadius: "8px", marginBottom: "15px" }}>
                <h4 style={{ color: colors.accent, marginBottom: "10px" }}>Bots</h4>
                <p style={{ color: colors.textSecondary, lineHeight: "1.6", margin: 0 }}>
                  Comptes automatisés programmables. Utilisés pour diffuser des infos, modérer, ou effectuer des tâches automatiques.
                </p>
              </div>

              <div style={{ background: colors.bgPrimary, padding: "20px", borderRadius: "8px" }}>
                <h4 style={{ color: colors.accent, marginBottom: "10px" }}>⚠️ Limites de l'OSINT sur Telegram</h4>
                <ul style={{ color: colors.textSecondary, lineHeight: "1.6", margin: 0 }}>
                  <li>Les conversations privées sont chiffrées de bout en bout (inaccessibles)</li>
                  <li>Les numéros de téléphone ne sont pas visibles publiquement</li>
                  <li>Pas d'API publique pour scraper les membres d'un groupe</li>
                  <li>Telegram supprime les canaux illégaux régulièrement</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === "tools" && (
            <div>
              <h2 style={{ color: colors.textPrimary, fontSize: "2rem", marginBottom: "20px" }}>
                🔧 Outils et Techniques
              </h2>

              <h3 style={{ color: colors.accent, fontSize: "1.5rem", marginBottom: "15px" }}>
                📌 Recherche de canaux
              </h3>

              <div style={{ background: colors.bgPrimary, padding: "20px", borderRadius: "8px", marginBottom: "15px" }}>
                <h4 style={{ color: colors.accent, marginBottom: "10px" }}>1. Telegram Search</h4>
                <p style={{ color: colors.textSecondary, lineHeight: "1.6", marginBottom: "10px" }}>
                  Fonction intégrée dans Telegram Desktop : recherchez par mots-clés pour trouver canaux et groupes publics.
                </p>
                <code style={{ background: colors.bgSecondary, padding: "10px", borderRadius: "4px", display: "block" }}>
                  Ouvrir Telegram → Icône Recherche → Entrer mot-clé (ex: "OSINT")
                </code>
              </div>

              <div style={{ background: colors.bgPrimary, padding: "20px", borderRadius: "8px", marginBottom: "15px" }}>
                <h4 style={{ color: colors.accent, marginBottom: "10px" }}>2. Google Dorks</h4>
                <p style={{ color: colors.textSecondary, lineHeight: "1.6", marginBottom: "10px" }}>
                  Les canaux publics sont indexés par Google :
                </p>
                <div style={{ fontFamily: "monospace", fontSize: "0.9rem" }}>
                  <div style={{ marginBottom: "10px", color: colors.textSecondary }}>
                    <code style={{ color: colors.accent }}>site:t.me "cybersecurity"</code> → Canaux cybersécurité
                  </div>
                  <div style={{ marginBottom: "10px", color: colors.textSecondary }}>
                    <code style={{ color: colors.accent }}>site:t.me inurl:s/ "leak"</code> → Canaux de leaks
                  </div>
                  <div style={{ color: colors.textSecondary }}>
                    <code style={{ color: colors.accent }}>site:t.me "OSINT" -inurl:s/</code> → Groupes OSINT
                  </div>
                </div>
              </div>

              <div style={{ background: colors.bgPrimary, padding: "20px", borderRadius: "8px", marginBottom: "15px" }}>
                <h4 style={{ color: colors.accent, marginBottom: "10px" }}>3. Annuaires Telegram</h4>
                <p style={{ color: colors.textSecondary, lineHeight: "1.6" }}>
                  Sites répertoriant des canaux par catégorie :
                </p>
                <ul style={{ color: colors.textSecondary, lineHeight: "1.6", marginLeft: "20px" }}>
                  <li>https://telegramchannels.me</li>
                  <li>https://tchannels.me</li>
                  <li>https://telemetr.io</li>
                  <li>https://tgstat.com</li>
                </ul>
              </div>

              <h3 style={{ color: colors.accent, fontSize: "1.5rem", marginBottom: "15px", marginTop: "30px" }}>
                🛠️ Outils de scraping
              </h3>

              <div style={{ background: colors.bgPrimary, padding: "20px", borderRadius: "8px", marginBottom: "15px" }}>
                <h4 style={{ color: colors.accent, marginBottom: "10px" }}>Telethon (Python)</h4>
                <p style={{ color: colors.textSecondary, lineHeight: "1.6", marginBottom: "10px" }}>
                  Bibliothèque Python pour automatiser Telegram. Permet de récupérer messages, membres, médias.
                </p>
                <code style={{ background: colors.bgSecondary, padding: "10px", borderRadius: "4px", display: "block", fontSize: "0.85rem" }}>
                  pip install telethon<br/>
                  # Scraper un canal :<br/>
                  from telethon.sync import TelegramClient<br/>
                  client = TelegramClient('session', api_id, api_hash)<br/>
                  messages = client.get_messages('NomCanal', limit=1000)
                </code>
              </div>

              <div style={{ background: colors.bgPrimary, padding: "20px", borderRadius: "8px", marginBottom: "15px" }}>
                <h4 style={{ color: colors.accent, marginBottom: "10px" }}>Telegram Export Tool</h4>
                <p style={{ color: colors.textSecondary, lineHeight: "1.6" }}>
                  Outil officiel intégré à Telegram Desktop pour exporter l'historique complet d'un chat.
                </p>
                <p style={{ color: colors.textSecondary, fontSize: "0.9rem", marginTop: "10px" }}>
                  📁 Formats : JSON, HTML
                </p>
              </div>

              <div style={{ background: colors.bgPrimary, padding: "20px", borderRadius: "8px" }}>
                <h4 style={{ color: colors.accent, marginBottom: "10px" }}>Telegram Analytics</h4>
                <p style={{ color: colors.textSecondary, lineHeight: "1.6" }}>
                  Outils comme <strong>TGStat</strong> et <strong>Telemetr</strong> proposent des statistiques sur les canaux : croissance, engagement, top posts.
                </p>
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
                  Exercice 1 : Trouver des canaux de leaks
                </h3>
                <p style={{ color: colors.textSecondary, lineHeight: "1.8", marginBottom: "15px" }}>
                  <strong>Objectif :</strong> Identifier des canaux Telegram partageant des bases de données compromises.
                </p>
                <p style={{ color: colors.textSecondary, lineHeight: "1.8", marginBottom: "10px" }}>
                  <strong>Méthode :</strong>
                </p>
                <ol style={{ color: colors.textSecondary, lineHeight: "1.8" }}>
                  <li>Utilisez Google : <code>site:t.me "database leak"</code></li>
                  <li>Rejoignez 3-5 canaux trouvés</li>
                  <li>Analysez le type de contenu partagé</li>
                  <li>Notez les patterns (fréquence, format, sources)</li>
                </ol>
                <p style={{ color: "#ef4444", marginTop: "15px", fontWeight: "600" }}>
                  ⚠️ N'utilisez JAMAIS ces données compromises !
                </p>
              </div>

              <div style={{ background: colors.bgPrimary, padding: "25px", borderRadius: "12px", marginBottom: "20px" }}>
                <h3 style={{ color: colors.accent, fontSize: "1.3rem", marginBottom: "15px" }}>
                  Exercice 2 : Export d'historique
                </h3>
                <p style={{ color: colors.textSecondary, lineHeight: "1.8", marginBottom: "15px" }}>
                  <strong>Objectif :</strong> Exporter l'historique complet d'un canal public.
                </p>
                <p style={{ color: colors.textSecondary, lineHeight: "1.8", marginBottom: "10px" }}>
                  <strong>Étapes :</strong>
                </p>
                <ol style={{ color: colors.textSecondary, lineHeight: "1.8" }}>
                  <li>Ouvrez Telegram Desktop</li>
                  <li>Rejoignez un canal OSINT public (ex: @OSINTtechnical)</li>
                  <li>Clic droit sur le canal → Export chat history</li>
                  <li>Sélectionnez format JSON</li>
                  <li>Analysez le fichier JSON avec un éditeur</li>
                </ol>
              </div>

              <div style={{ background: colors.bgPrimary, padding: "25px", borderRadius: "12px" }}>
                <h3 style={{ color: colors.accent, fontSize: "1.3rem", marginBottom: "15px" }}>
                  Exercice 3 : Recherche par mot-clé
                </h3>
                <p style={{ color: colors.textSecondary, lineHeight: "1.8", marginBottom: "15px" }}>
                  <strong>Objectif :</strong> Trouver toutes les mentions d'une entreprise dans les canaux Telegram.
                </p>
                <p style={{ color: colors.textSecondary, lineHeight: "1.8", marginBottom: "10px" }}>
                  <strong>Méthode :</strong>
                </p>
                <ol style={{ color: colors.textSecondary, lineHeight: "1.8" }}>
                  <li>Identifiez des canaux pertinents (cybersec, tech news)</li>
                  <li>Utilisez la recherche intégrée Telegram : "#NomEntreprise"</li>
                  <li>Notez les conversations, rumeurs, ou incidents mentionnés</li>
                  <li>Croisez avec Google News pour vérifier</li>
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

import { useState } from "react";
import { useThemeColors } from "../context/ThemeContext";

export default function DiscordModule() {
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
      question: "Qu'est-ce qu'un serveur Discord ?",
      options: [
        "Un espace communautaire avec canaux texte et vocaux",
        "Un ordinateur de jeu en ligne",
        "Un VPN gratuit",
        "Un hébergeur de site web"
      ],
      correct: 0
    },
    {
      id: 2,
      question: "Comment rejoindre un serveur Discord public ?",
      options: [
        "Via un lien d'invitation discord.gg/CODE",
        "Il faut demander l'autorisation à Discord",
        "Uniquement via recherche Google",
        "C'est impossible"
      ],
      correct: 0
    },
    {
      id: 3,
      question: "Les messages Discord sont-ils indexés par Google ?",
      options: [
        "Non, Discord n'est pas indexé publiquement",
        "Oui, tous les messages",
        "Uniquement les serveurs publics",
        "Seulement les messages vocaux"
      ],
      correct: 0
    },
    {
      id: 4,
      question: "Quel est le format d'un Discord ID ?",
      options: [
        "Un nombre à 18 chiffres",
        "Un email",
        "Un pseudo",
        "Une adresse IP"
      ],
      correct: 0
    },
    {
      id: 5,
      question: "Peut-on récupérer des messages supprimés sur Discord ?",
      options: [
        "Oui, avec des bots présents au moment de l'envoi",
        "Non, impossible",
        "Oui, Discord les garde 30 jours",
        "Uniquement les admins"
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
          <div style={{ fontSize: "4rem", marginBottom: "15px" }}>🎮</div>
          <h1 style={{
            fontSize: "2.5rem",
            fontWeight: "700",
            color: colors.textPrimary,
            marginBottom: "15px",
          }}>
            Module Discord OSINT
          </h1>
          <p style={{
            fontSize: "1.1rem",
            color: colors.textSecondary,
            maxWidth: "700px",
            margin: "0 auto",
          }}>
            Investigation et reconnaissance sur les serveurs Discord
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
                📖 Discord OSINT : Introduction
              </h2>
              
              <p style={{ color: colors.textSecondary, lineHeight: "1.8", marginBottom: "20px" }}>
                Discord est une plateforme de communication initialement créée pour les gamers, mais désormais utilisée par des millions de communautés (crypto, dev, éducation, activisme, etc.). Avec plus de <strong>150 millions d'utilisateurs actifs mensuels</strong>, Discord est devenu un terrain fertile pour l'OSINT.
              </p>

              <h3 style={{ color: colors.accent, fontSize: "1.5rem", marginBottom: "15px", marginTop: "30px" }}>
                🎯 Pourquoi Discord en OSINT ?
              </h3>

              <ul style={{ color: colors.textSecondary, lineHeight: "1.8", marginLeft: "20px" }}>
                <li><strong>Communautés fermées :</strong> Beaucoup d'informations sensibles circulent dans des serveurs privés</li>
                <li><strong>Pas d'indexation Google :</strong> Les messages ne sont pas publiquement accessibles</li>
                <li><strong>Activisme et whistleblowing :</strong> Des fuites y sont parfois partagées</li>
                <li><strong>Crypto et NFT :</strong> Nombreuses arnaques et projets douteux</li>
                <li><strong>Gaming et e-sport :</strong> Informations sur des joueurs, équipes, sponsors</li>
              </ul>

              <h3 style={{ color: colors.accent, fontSize: "1.5rem", marginBottom: "15px", marginTop: "30px" }}>
                🔑 Structure de Discord
              </h3>

              <div style={{ background: colors.bgPrimary, padding: "20px", borderRadius: "8px", marginBottom: "15px" }}>
                <h4 style={{ color: colors.accent, marginBottom: "10px" }}>Serveurs (Guilds)</h4>
                <p style={{ color: colors.textSecondary, lineHeight: "1.6", margin: 0 }}>
                  Espaces communautaires regroupant des canaux textuels et vocaux. Chaque serveur a un <strong>Server ID unique</strong> (18 chiffres).
                </p>
              </div>

              <div style={{ background: colors.bgPrimary, padding: "20px", borderRadius: "8px", marginBottom: "15px" }}>
                <h4 style={{ color: colors.accent, marginBottom: "10px" }}>Canaux (Channels)</h4>
                <p style={{ color: colors.textSecondary, lineHeight: "1.6", margin: 0 }}>
                  Salons de discussion à l'intérieur d'un serveur. Peuvent être textuels (#general), vocaux, ou forums. Chacun a un <strong>Channel ID</strong>.
                </p>
              </div>

              <div style={{ background: colors.bgPrimary, padding: "20px", borderRadius: "8px", marginBottom: "15px" }}>
                <h4 style={{ color: colors.accent, marginBottom: "10px" }}>Utilisateurs</h4>
                <p style={{ color: colors.textSecondary, lineHeight: "1.6", margin: 0 }}>
                  Identifiés par un <strong>User ID</strong> (18 chiffres) et un pseudo (Username#1234). Les avatars, bios, et statuts peuvent révéler des informations.
                </p>
              </div>

              <div style={{ background: colors.bgPrimary, padding: "20px", borderRadius: "8px" }}>
                <h4 style={{ color: colors.accent, marginBottom: "10px" }}>⚠️ Limites de l'OSINT Discord</h4>
                <ul style={{ color: colors.textSecondary, lineHeight: "1.6", margin: 0 }}>
                  <li>Les serveurs privés nécessitent une invitation</li>
                  <li>Les messages ne sont pas indexés par les moteurs de recherche</li>
                  <li>Discord supprime les serveurs illégaux régulièrement</li>
                  <li>Les utilisateurs peuvent masquer leur présence en ligne</li>
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
                📌 Recherche de serveurs Discord
              </h3>

              <div style={{ background: colors.bgPrimary, padding: "20px", borderRadius: "8px", marginBottom: "15px" }}>
                <h4 style={{ color: colors.accent, marginBottom: "10px" }}>1. Annuaires Discord</h4>
                <p style={{ color: colors.textSecondary, lineHeight: "1.6", marginBottom: "10px" }}>
                  Sites listant des serveurs publics par catégorie :
                </p>
                <ul style={{ color: colors.textSecondary, lineHeight: "1.6", marginLeft: "20px" }}>
                  <li><strong>https://disboard.org</strong> - Plus de 800 000 serveurs</li>
                  <li><strong>https://discord.me</strong> - Serveurs populaires</li>
                  <li><strong>https://top.gg</strong> - Bots et serveurs</li>
                  <li><strong>https://discordservers.com</strong> - Communautés diverses</li>
                </ul>
              </div>

              <div style={{ background: colors.bgPrimary, padding: "20px", borderRadius: "8px", marginBottom: "15px" }}>
                <h4 style={{ color: colors.accent, marginBottom: "10px" }}>2. Google Dorks</h4>
                <p style={{ color: colors.textSecondary, lineHeight: "1.6", marginBottom: "10px" }}>
                  Bien que Discord ne soit pas indexé, on peut trouver des liens d'invitation :
                </p>
                <div style={{ fontFamily: "monospace", fontSize: "0.9rem" }}>
                  <div style={{ marginBottom: "10px", color: colors.textSecondary }}>
                    <code style={{ color: colors.accent }}>site:discord.gg "OSINT"</code>
                  </div>
                  <div style={{ marginBottom: "10px", color: colors.textSecondary }}>
                    <code style={{ color: colors.accent }}>inurl:discord.gg "crypto"</code>
                  </div>
                  <div style={{ color: colors.textSecondary }}>
                    <code style={{ color: colors.accent }}>"discord.gg" "hack" site:reddit.com</code>
                  </div>
                </div>
              </div>

              <h3 style={{ color: colors.accent, fontSize: "1.5rem", marginBottom: "15px", marginTop: "30px" }}>
                🛠️ Outils OSINT pour Discord
              </h3>

              <div style={{ background: colors.bgPrimary, padding: "20px", borderRadius: "8px", marginBottom: "15px" }}>
                <h4 style={{ color: colors.accent, marginBottom: "10px" }}>Discord ID Lookup</h4>
                <p style={{ color: colors.textSecondary, lineHeight: "1.6", marginBottom: "10px" }}>
                  Site : <strong>https://discord.id</strong>
                </p>
                <p style={{ color: colors.textSecondary, lineHeight: "1.6" }}>
                  Permet de récupérer des informations sur un utilisateur via son ID : date de création du compte, avatar, badge.
                </p>
              </div>

              <div style={{ background: colors.bgPrimary, padding: "20px", borderRadius: "8px", marginBottom: "15px" }}>
                <h4 style={{ color: colors.accent, marginBottom: "10px" }}>Discord Lookup (discord.id)</h4>
                <p style={{ color: colors.textSecondary, lineHeight: "1.6", marginBottom: "10px" }}>
                  Entrez un User ID ou Server ID pour obtenir :
                </p>
                <ul style={{ color: colors.textSecondary, lineHeight: "1.6", marginLeft: "20px" }}>
                  <li>Date de création</li>
                  <li>Avatar et bannière</li>
                  <li>Badges (Nitro, Early Supporter, etc.)</li>
                </ul>
              </div>

              <div style={{ background: colors.bgPrimary, padding: "20px", borderRadius: "8px", marginBottom: "15px" }}>
                <h4 style={{ color: colors.accent, marginBottom: "10px" }}>Discord.py (Python Bot)</h4>
                <p style={{ color: colors.textSecondary, lineHeight: "1.6", marginBottom: "10px" }}>
                  Créer un bot Discord pour automatiser la collecte d'informations :
                </p>
                <code style={{ background: colors.bgSecondary, padding: "10px", borderRadius: "4px", display: "block", fontSize: "0.85rem" }}>
                  pip install discord.py<br/>
                  # Log tous les messages d'un serveur<br/>
                  import discord<br/>
                  client = discord.Client()<br/>
                  @client.event<br/>
                  async def on_message(message):<br/>
                  {"    "}print(f"{'{'}message.author{'}'}: {'{'}message.content{'}'}")
                </code>
              </div>

              <div style={{ background: colors.bgPrimary, padding: "20px", borderRadius: "8px" }}>
                <h4 style={{ color: colors.accent, marginBottom: "10px" }}>⚠️ Considérations éthiques</h4>
                <p style={{ color: colors.textSecondary, lineHeight: "1.6", margin: 0 }}>
                  Créer des bots pour logger les messages sans consentement viole les CGU de Discord et peut être illégal dans certains pays. Utilisez ces techniques uniquement dans un cadre légal (pentest autorisé, investigation légitime).
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
                  Exercice 1 : Trouver des serveurs Discord d'une communauté
                </h3>
                <p style={{ color: colors.textSecondary, lineHeight: "1.8", marginBottom: "15px" }}>
                  <strong>Objectif :</strong> Identifier tous les serveurs Discord liés à la cybersécurité.
                </p>
                <p style={{ color: colors.textSecondary, lineHeight: "1.8", marginBottom: "10px" }}>
                  <strong>Méthode :</strong>
                </p>
                <ol style={{ color: colors.textSecondary, lineHeight: "1.8" }}>
                  <li>Allez sur https://disboard.org</li>
                  <li>Recherchez "cybersecurity" ou "OSINT"</li>
                  <li>Rejoignez 3-5 serveurs</li>
                  <li>Observez les canaux, la structure, les règles</li>
                  <li>Notez les serveurs partenaires (souvent listés)</li>
                </ol>
              </div>

              <div style={{ background: colors.bgPrimary, padding: "25px", borderRadius: "12px", marginBottom: "20px" }}>
                <h3 style={{ color: colors.accent, fontSize: "1.3rem", marginBottom: "15px" }}>
                  Exercice 2 : Extraction d'un User ID
                </h3>
                <p style={{ color: colors.textSecondary, lineHeight: "1.8", marginBottom: "15px" }}>
                  <strong>Objectif :</strong> Récupérer l'ID d'un utilisateur Discord et analyser son profil.
                </p>
                <p style={{ color: colors.textSecondary, lineHeight: "1.8", marginBottom: "10px" }}>
                  <strong>Étapes :</strong>
                </p>
                <ol style={{ color: colors.textSecondary, lineHeight: "1.8" }}>
                  <li>Activez le "Developer Mode" dans Discord (Paramètres → Avancé)</li>
                  <li>Clic droit sur un utilisateur → "Copier l'identifiant"</li>
                  <li>Allez sur https://discord.id</li>
                  <li>Collez l'ID et récupérez : date de création, avatar, badges</li>
                  <li>Croisez avec d'autres plateformes (Twitter, GitHub) via le pseudo</li>
                </ol>
              </div>

              <div style={{ background: colors.bgPrimary, padding: "25px", borderRadius: "12px" }}>
                <h3 style={{ color: colors.accent, fontSize: "1.3rem", marginBottom: "15px" }}>
                  Exercice 3 : Analyse d'un serveur suspect
                </h3>
                <p style={{ color: colors.textSecondary, lineHeight: "1.8", marginBottom: "15px" }}>
                  <strong>Objectif :</strong> Identifier les red flags d'un serveur Discord potentiellement malveillant.
                </p>
                <p style={{ color: colors.textSecondary, lineHeight: "1.8", marginBottom: "10px" }}>
                  <strong>Critères à analyser :</strong>
                </p>
                <ul style={{ color: colors.textSecondary, lineHeight: "1.8" }}>
                  <li>Nombre de membres (bot farms ?)</li>
                  <li>Date de création (récent = suspect)</li>
                  <li>Ratio membres/messages (inactive ?)</li>
                  <li>Présence de bots de modération</li>
                  <li>Contenu des discussions (scam, phishing ?)</li>
                </ul>
                <p style={{ color: "#ef4444", marginTop: "15px", fontWeight: "600" }}>
                  ⚠️ Si vous identifiez un serveur malveillant, signalez-le à Discord !
                </p>
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

                <button
                  onClick={() => setShowResetModal(true)}
                  style={{
                    padding: "15px 40px",
                    background: "#000",
                    color: colors.accent,
                    border: `2px solid ${colors.accent}`,
                    borderRadius: "8px",
                    fontSize: "1.1rem",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  🔄 Réinitialiser
                </button>
              </div>

              {/* RESULTS */}
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

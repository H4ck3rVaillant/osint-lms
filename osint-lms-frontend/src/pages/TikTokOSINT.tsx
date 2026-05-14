import { useState } from "react";
import { useThemeColors } from "../context/ThemeContext";

export default function TikTokOSINT() {
  const colors = useThemeColors();
  const [activeTab, setActiveTab] = useState("theory");
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

  const BADGE_KEY = "badge_module_tiktok";
  const ANSWERS_KEY = "quiz_answers_tiktok";
  const RESULTS_KEY = "quiz_results_tiktok";

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
      question: "Combien d'utilisateurs actifs mensuels TikTok compte-t-il dans le monde ?",
      options: [
        "500 millions",
        "1 milliard",
        "2 milliards",
        "750 millions"
      ],
      correct: 1
    },
    {
      id: 2,
      question: "Quelle URL permet d'accéder au profil TikTok de l'utilisateur 'osint_analyst' ?",
      options: [
        "tiktok.com/osint_analyst",
        "tiktok.com/user/osint_analyst",
        "tiktok.com/@osint_analyst",
        "tiktok.com/profile/osint_analyst"
      ],
      correct: 2
    },
    {
      id: 3,
      question: "Quel outil européen permet de vérifier l'authenticité d'une vidéo TikTok et détecter les manipulations ?",
      options: [
        "TikBuddy",
        "Exolyt",
        "InVID / WeVerify",
        "Pentos"
      ],
      correct: 2
    },
    {
      id: 4,
      question: "Quelle URL permet de voir toutes les vidéos associées au hashtag #cybersecurity sur TikTok ?",
      options: [
        "tiktok.com/search/cybersecurity",
        "tiktok.com/tag/cybersecurity",
        "tiktok.com/#cybersecurity",
        "tiktok.com/hashtag/cybersecurity"
      ],
      correct: 1
    },
    {
      id: 5,
      question: "Quel service TikTok officiel permet aux chercheurs d'accéder aux données publiques de la plateforme ?",
      options: [
        "TikTok Analytics API",
        "TikTok Research API",
        "TikTok Developer Portal",
        "TikTok Data Center"
      ],
      correct: 1
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
          <div style={{ fontSize: "4rem", marginBottom: "15px" }}>🎵</div>
          <h1 style={{ fontSize: "2.5rem", fontWeight: "700", color: colors.textPrimary, marginBottom: "15px" }}>
            Module TikTok OSINT
          </h1>
          <p style={{ fontSize: "1.1rem", color: colors.textSecondary, maxWidth: "700px", margin: "0 auto" }}>
            Investigation et collecte de renseignements sur TikTok
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
              <h2 style={{ color: colors.textPrimary, fontSize: "2rem", marginBottom: "20px" }}>📖 TikTok comme source OSINT</h2>

              <p style={{ color: colors.textSecondary, lineHeight: "1.8", marginBottom: "20px" }}>
                TikTok est devenu en quelques années l'une des plateformes les plus influentes avec <strong>plus d'1 milliard d'utilisateurs actifs</strong>. Sa nature vidéo courte et son algorithme de recommandation en font une source OSINT particulièrement riche : les vidéos contiennent des informations visuelles et audio denses, les profils révèlent des habitudes comportementales, et les tendances émergent souvent sur TikTok avant les autres plateformes. La plateforme est également au cœur de nombreuses enquêtes de désinformation et d'influence.
              </p>

              <h3 style={{ color: colors.accent, fontSize: "1.5rem", marginBottom: "15px", marginTop: "30px" }}>🎯 Cas d'usage en OSINT</h3>
              <ul style={{ color: colors.textSecondary, lineHeight: "1.8", marginLeft: "20px", marginBottom: "25px" }}>
                <li><strong>Identification de personnes :</strong> Retrouver l'identité réelle d'un créateur via les éléments visuels, la voix, les lieux apparaissant dans ses vidéos</li>
                <li><strong>Géolocalisation vidéo :</strong> Localiser précisément le lieu de tournage d'une vidéo par analyse des arrière-plans, enseignes, panneaux</li>
                <li><strong>Surveillance de tendances :</strong> Détecter les mouvements sociaux, contestations, événements viraux avant qu'ils n'atteignent les médias traditionnels</li>
                <li><strong>Détection de désinformation :</strong> Identifier les vidéos manipulées, deepfakes ou contenus sortis de leur contexte original</li>
                <li><strong>Analyse d'influence :</strong> Cartographier les réseaux d'influenceurs coordonnés diffusant des messages similaires</li>
                <li><strong>Investigation criminelle :</strong> Les vidéos postées involontairement révèlent des indices sur des activités illégales</li>
              </ul>

              <h3 style={{ color: colors.accent, fontSize: "1.5rem", marginBottom: "15px", marginTop: "30px" }}>🔑 Structure des données TikTok</h3>

              <div style={{ background: colors.bgPrimary, padding: "20px", borderRadius: "8px", marginBottom: "15px" }}>
                <h4 style={{ color: colors.accent, marginBottom: "10px" }}>Profils publics</h4>
                <p style={{ color: colors.textSecondary, lineHeight: "1.6", margin: 0 }}>
                  Username (avec @), nom d'affichage, bio, lien externe, nombre de vidéos/abonnés/abonnements, comptes liés (Instagram, YouTube). Accessibles via tiktok.com/@username sans compte.
                </p>
              </div>

              <div style={{ background: colors.bgPrimary, padding: "20px", borderRadius: "8px", marginBottom: "15px" }}>
                <h4 style={{ color: colors.accent, marginBottom: "10px" }}>Vidéos et métadonnées</h4>
                <p style={{ color: colors.textSecondary, lineHeight: "1.6", margin: 0 }}>
                  Date de publication, description, hashtags, musique utilisée, nombre de vues/likes/commentaires/partages, géolocalisation (si renseignée). Les vidéos elles-mêmes contiennent des informations visuelles précieuses : environnement, objets, vêtements, voix, langue.
                </p>
              </div>

              <div style={{ background: colors.bgPrimary, padding: "20px", borderRadius: "8px" }}>
                <h4 style={{ color: colors.accent, marginBottom: "10px" }}>Défis et tendances</h4>
                <p style={{ color: colors.textSecondary, lineHeight: "1.6", margin: 0 }}>
                  Les hashtags de défi (#challenge) et les sons viraux permettent de suivre des mouvements coordonnés. L'analyse des participants à un même défi révèle des réseaux de comptes liés, potentiellement coordonnés de manière artificielle.
                </p>
              </div>
            </div>
          )}

          {activeTab === "tools" && (
            <div>
              <h2 style={{ color: colors.textPrimary, fontSize: "2rem", marginBottom: "20px" }}>🔧 Outils et Techniques TikTok OSINT</h2>

              <h3 style={{ color: colors.accent, fontSize: "1.5rem", marginBottom: "15px" }}>📌 Recherche manuelle</h3>
              <div style={{ background: colors.bgPrimary, padding: "15px", borderRadius: "8px", marginBottom: "20px", fontFamily: "monospace", fontSize: "0.9rem" }}>
                <div style={{ marginBottom: "12px", color: colors.textSecondary }}>
                  <strong style={{ color: colors.accent }}>tiktok.com/@username</strong> → Profil public complet
                </div>
                <div style={{ marginBottom: "12px", color: colors.textSecondary }}>
                  <strong style={{ color: colors.accent }}>tiktok.com/tag/[hashtag]</strong> → Vidéos d'un hashtag
                </div>
                <div style={{ marginBottom: "12px", color: colors.textSecondary }}>
                  <strong style={{ color: colors.accent }}>tiktok.com/search?q=[terme]</strong> → Recherche globale
                </div>
                <div style={{ color: colors.textSecondary }}>
                  <strong style={{ color: colors.accent }}>site:tiktok.com "@username"</strong> → Google Dork TikTok
                </div>
              </div>

              <h3 style={{ color: colors.accent, fontSize: "1.5rem", marginBottom: "15px", marginTop: "30px" }}>💎 Outils spécialisés</h3>

              <div style={{ background: colors.bgPrimary, padding: "20px", borderRadius: "8px", marginBottom: "15px" }}>
                <h4 style={{ color: colors.accent, marginBottom: "10px" }}>Exolyt</h4>
                <p style={{ color: colors.textSecondary, lineHeight: "1.6", margin: 0 }}>
                  Outil d'analyse TikTok permettant de consulter les statistiques détaillées d'un compte public : évolution du nombre d'abonnés, engagement moyen, meilleures vidéos, tendances. Utile pour évaluer l'influence réelle d'un compte et détecter des croissances anormales (achat de followers).
                </p>
              </div>

              <div style={{ background: colors.bgPrimary, padding: "20px", borderRadius: "8px", marginBottom: "15px" }}>
                <h4 style={{ color: colors.accent, marginBottom: "10px" }}>InVID / WeVerify</h4>
                <p style={{ color: colors.textSecondary, lineHeight: "1.6", marginBottom: "10px" }}>
                  Extension navigateur européenne de vérification de contenus vidéo. Permet d'extraire des captures d'écran de vidéos TikTok pour les soumettre à un reverse image search, analyser les métadonnées et vérifier l'origine du contenu.
                </p>
                <div style={{ fontFamily: "monospace", fontSize: "0.85rem" }}>
                  <code style={{ color: colors.accent, display: "block" }}>Extension Chrome/Firefox : InVID-WeVerify</code>
                </div>
              </div>

              <div style={{ background: colors.bgPrimary, padding: "20px", borderRadius: "8px", marginBottom: "15px" }}>
                <h4 style={{ color: colors.accent, marginBottom: "10px" }}>TikTok Research API</h4>
                <p style={{ color: colors.textSecondary, lineHeight: "1.6", margin: 0 }}>
                  API officielle TikTok réservée aux chercheurs académiques et journalistes accrédités. Permet d'accéder programmatiquement aux données publiques : vidéos, commentaires, profils, hashtags. Nécessite une demande d'accès et une justification de recherche.
                </p>
              </div>

              <div style={{ background: colors.bgPrimary, padding: "20px", borderRadius: "8px" }}>
                <h4 style={{ color: colors.accent, marginBottom: "10px" }}>Pentos.io</h4>
                <p style={{ color: colors.textSecondary, lineHeight: "1.6", margin: 0 }}>
                  Outil de suivi et d'analyse de hashtags TikTok. Permet de monitorer l'évolution d'un hashtag dans le temps, identifier les créateurs les plus actifs et analyser les pics de publication pour détecter des campagnes coordonnées.
                </p>
              </div>
            </div>
          )}

          {activeTab === "exercises" && (
            <div>
              <h2 style={{ color: colors.textPrimary, fontSize: "2rem", marginBottom: "20px" }}>💡 Exercices Pratiques</h2>

              <div style={{ background: colors.bgPrimary, padding: "25px", borderRadius: "12px", marginBottom: "20px" }}>
                <h3 style={{ color: colors.accent, fontSize: "1.3rem", marginBottom: "15px" }}>Exercice 1 : Analyse d'un profil TikTok public</h3>
                <p style={{ color: colors.textSecondary, marginBottom: "15px" }}>
                  <strong>Objectif :</strong> Collecter et analyser les informations disponibles sur un compte TikTok public sans créer de compte.
                </p>
                <p style={{ color: colors.textSecondary, marginBottom: "10px" }}><strong>Méthode :</strong></p>
                <ol style={{ color: colors.textSecondary, lineHeight: "1.8", marginLeft: "20px" }}>
                  <li>Accéder à tiktok.com/@username et relever : bio, liens externes, abonnés, abonnements, nombre de likes total</li>
                  <li>Analyser les 10 dernières vidéos : fréquence, sujets récurrents, lieux apparents, langue utilisée</li>
                  <li>Identifier les comptes liés mentionnés dans la bio (Instagram, YouTube, Twitter)</li>
                  <li>Utiliser Exolyt pour obtenir les statistiques historiques du compte</li>
                </ol>
                <p style={{ color: "#f59e0b", marginTop: "15px", fontWeight: "600" }}>
                  ⚠️ ÉTHIQUE : Respectez la vie privée des créateurs. Ne collectez que des données publiques.
                </p>
              </div>

              <div style={{ background: colors.bgPrimary, padding: "25px", borderRadius: "12px", marginBottom: "20px" }}>
                <h3 style={{ color: colors.accent, fontSize: "1.3rem", marginBottom: "15px" }}>Exercice 2 : Géolocalisation d'une vidéo TikTok</h3>
                <p style={{ color: colors.textSecondary, marginBottom: "15px" }}>
                  <strong>Objectif :</strong> Identifier le lieu de tournage d'une vidéo TikTok à partir des éléments visuels.
                </p>
                <p style={{ color: colors.textSecondary, marginBottom: "10px" }}><strong>Méthode :</strong></p>
                <ol style={{ color: colors.textSecondary, lineHeight: "1.8", marginLeft: "20px" }}>
                  <li>Utiliser InVID pour extraire des captures d'écran clés de la vidéo</li>
                  <li>Analyser les éléments visuels : enseignes, architecture, signalétique, véhicules, végétation</li>
                  <li>Soumettre les captures à Google Images et Yandex pour un reverse image search</li>
                  <li>Confirmer la localisation via Google Street View et Google Maps</li>
                </ol>
              </div>

              <div style={{ background: colors.bgPrimary, padding: "25px", borderRadius: "12px", marginBottom: "20px" }}>
                <h3 style={{ color: colors.accent, fontSize: "1.3rem", marginBottom: "15px" }}>Exercice 3 : Détection de campagne coordonnée</h3>
                <p style={{ color: colors.textSecondary, marginBottom: "15px" }}>
                  <strong>Objectif :</strong> Identifier une possible coordination artificielle autour d'un hashtag TikTok.
                </p>
                <p style={{ color: colors.textSecondary, marginBottom: "10px" }}><strong>Méthode :</strong></p>
                <ol style={{ color: colors.textSecondary, lineHeight: "1.8", marginLeft: "20px" }}>
                  <li>Sélectionner un hashtag suspect et analyser les 20 premières vidéos</li>
                  <li>Vérifier : les dates de création des comptes, les similitudes entre profils, le ratio vues/abonnés</li>
                  <li>Analyser si les mêmes sons, filtres ou structures de vidéo sont utilisés de manière coordonnée</li>
                  <li>Utiliser Pentos.io pour observer les pics anormaux d'utilisation du hashtag</li>
                </ol>
              </div>

              <div style={{ background: colors.bgPrimary, padding: "25px", borderRadius: "12px" }}>
                <h3 style={{ color: colors.accent, fontSize: "1.3rem", marginBottom: "15px" }}>Exercice 4 : Vérification d'une vidéo virale</h3>
                <p style={{ color: colors.textSecondary, marginBottom: "15px" }}>
                  <strong>Objectif :</strong> Vérifier l'authenticité et l'origine d'une vidéo TikTok virale potentiellement manipulée.
                </p>
                <p style={{ color: colors.textSecondary, marginBottom: "10px" }}><strong>Méthode :</strong></p>
                <ol style={{ color: colors.textSecondary, lineHeight: "1.8", marginLeft: "20px" }}>
                  <li>Installer l'extension InVID/WeVerify et analyser la vidéo cible</li>
                  <li>Vérifier les métadonnées disponibles : date de publication, compte source, première apparition</li>
                  <li>Soumettre des captures d'écran au reverse image search pour retrouver des versions antérieures</li>
                  <li>Croiser avec des sources journalistiques et des bases de fact-checking (AFP Factuel, Reuters Fact Check)</li>
                </ol>
                <p style={{ color: "#ef4444", marginTop: "15px", fontWeight: "600" }}>
                  ⚠️ LÉGAL : Le téléchargement de vidéos TikTok sans autorisation peut violer les droits d'auteur.
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
                    {getScore() >= 4 ? "Badge débloqué ! Vous maîtrisez l'OSINT TikTok ! 🎉" : "Révisez le module et réessayez."}
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

import { useState } from "react";
import { useThemeColors } from "../context/ThemeContext";

export default function InstagramOSINT() {
  const colors = useThemeColors();
  const [activeTab, setActiveTab] = useState("theory");
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

  const BADGE_KEY = "badge_module_instagram";
  const ANSWERS_KEY = "quiz_answers_instagram";
  const RESULTS_KEY = "quiz_results_instagram";

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
      question: "Quelle URL permet d'accéder directement aux publications d'un hashtag sur Instagram ?",
      options: [
        "instagram.com/search/tag/[hashtag]",
        "instagram.com/hashtag/[hashtag]",
        "instagram.com/explore/tags/[hashtag]",
        "instagram.com/tag/[hashtag]"
      ],
      correct: 2
    },
    {
      id: 2,
      question: "Quel outil en ligne de commande permet d'extraire les métadonnées EXIF d'une image ?",
      options: [
        "ExifTool",
        "InstaLooter",
        "Maltego",
        "theHarvester"
      ],
      correct: 0
    },
    {
      id: 3,
      question: "Quelle technique combine analyse EXIF et recherche inversée pour géolocaliser une photo Instagram ?",
      options: [
        "Analyse des followers",
        "Vérification des mentions",
        "EXIF + Reverse Image Search",
        "Lecture des stories"
      ],
      correct: 2
    },
    {
      id: 4,
      question: "Quel outil open-source de visualisation permet de cartographier le réseau social d'un compte Instagram ?",
      options: [
        "InstaLooter",
        "TinEye",
        "Gephi",
        "ExifTool"
      ],
      correct: 2
    },
    {
      id: 5,
      question: "Quelle réglementation européenne encadre la collecte de données personnelles lors d'investigations OSINT ?",
      options: [
        "DORA",
        "LPM",
        "NIS2",
        "RGPD"
      ],
      correct: 3
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
          <div style={{ fontSize: "4rem", marginBottom: "15px" }}>📸</div>
          <h1 style={{ fontSize: "2.5rem", fontWeight: "700", color: colors.textPrimary, marginBottom: "15px" }}>
            Module Instagram OSINT
          </h1>
          <p style={{ fontSize: "1.1rem", color: colors.textSecondary, maxWidth: "700px", margin: "0 auto" }}>
            Investigation et collecte de renseignements sur Instagram
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
              <h2 style={{ color: colors.textPrimary, fontSize: "2rem", marginBottom: "20px" }}>📖 Instagram comme source OSINT</h2>

              <p style={{ color: colors.textSecondary, lineHeight: "1.8", marginBottom: "20px" }}>
                Instagram est l'une des plateformes les plus riches pour l'OSINT avec <strong>plus de 2 milliards d'utilisateurs actifs</strong>. Les profils publics, publications, stories archivées, géolocalisations, hashtags et métadonnées constituent une mine d'informations exploitables. La plateforme permet d'identifier des individus, reconstituer des déplacements, cartographier des réseaux sociaux et détecter des comportements suspects.
              </p>

              <h3 style={{ color: colors.accent, fontSize: "1.5rem", marginBottom: "15px", marginTop: "30px" }}>🎯 Cas d'usage en OSINT</h3>
              <ul style={{ color: colors.textSecondary, lineHeight: "1.8", marginLeft: "20px", marginBottom: "25px" }}>
                <li><strong>Identification de personnes :</strong> Retrouver une identité réelle à partir d'un pseudo, d'une photo ou d'indices géographiques</li>
                <li><strong>Géolocalisation :</strong> Localiser précisément un individu via les métadonnées EXIF, les tags de lieu ou les éléments visuels d'une photo</li>
                <li><strong>Cartographie de réseau :</strong> Identifier les relations, amis proches, famille, collègues via les interactions</li>
                <li><strong>Investigation crypto/scam :</strong> Suivre des influenceurs douteux promouvant des arnaques financières ou NFT</li>
                <li><strong>Veille extrémisme :</strong> Surveiller des comptes diffusant du contenu radical ou organisant des actions</li>
                <li><strong>Vérification de faits :</strong> Retrouver l'origine d'une image ou vidéo virale pour en évaluer l'authenticité</li>
              </ul>

              <h3 style={{ color: colors.accent, fontSize: "1.5rem", marginBottom: "15px", marginTop: "30px" }}>🔑 Structure des données Instagram</h3>

              <div style={{ background: colors.bgPrimary, padding: "20px", borderRadius: "8px", marginBottom: "15px" }}>
                <h4 style={{ color: colors.accent, marginBottom: "10px" }}>Profil public</h4>
                <p style={{ color: colors.textSecondary, lineHeight: "1.6", margin: 0 }}>
                  Username, nom complet, bio, lien externe, photo de profil, nombre de publications/abonnés/abonnements, localisation déclarée. Toutes ces données sont accessibles sans compte via instagram.com/@username.
                </p>
              </div>

              <div style={{ background: colors.bgPrimary, padding: "20px", borderRadius: "8px", marginBottom: "15px" }}>
                <h4 style={{ color: colors.accent, marginBottom: "10px" }}>Publications et métadonnées</h4>
                <p style={{ color: colors.textSecondary, lineHeight: "1.6", margin: 0 }}>
                  Date/heure de publication, géolocalisation (si activée), légendes, hashtags, mentions. Les métadonnées EXIF des images peuvent contenir des coordonnées GPS, le modèle d'appareil, la date et l'heure exactes de la prise de vue.
                </p>
              </div>

              <div style={{ background: colors.bgPrimary, padding: "20px", borderRadius: "8px" }}>
                <h4 style={{ color: colors.accent, marginBottom: "10px" }}>Interactions et réseau</h4>
                <p style={{ color: colors.textSecondary, lineHeight: "1.6", margin: 0 }}>
                  Les likes, commentaires et mentions permettent de cartographier le réseau social d'une cible. Les comptes qui interagissent régulièrement révèlent des relations proches : famille, amis, collègues, partenaires.
                </p>
              </div>
            </div>
          )}

          {activeTab === "tools" && (
            <div>
              <h2 style={{ color: colors.textPrimary, fontSize: "2rem", marginBottom: "20px" }}>🔧 Outils et Techniques Instagram OSINT</h2>

              <h3 style={{ color: colors.accent, fontSize: "1.5rem", marginBottom: "15px" }}>📌 Recherche manuelle (sans compte)</h3>
              <div style={{ background: colors.bgPrimary, padding: "15px", borderRadius: "8px", marginBottom: "20px", fontFamily: "monospace", fontSize: "0.9rem" }}>
                <div style={{ marginBottom: "12px", color: colors.textSecondary }}>
                  <strong style={{ color: colors.accent }}>instagram.com/@username</strong> → Profil public complet
                </div>
                <div style={{ marginBottom: "12px", color: colors.textSecondary }}>
                  <strong style={{ color: colors.accent }}>instagram.com/explore/tags/[hashtag]</strong> → Publications d'un hashtag
                </div>
                <div style={{ marginBottom: "12px", color: colors.textSecondary }}>
                  <strong style={{ color: colors.accent }}>instagram.com/explore/locations/[ID]</strong> → Publications d'un lieu
                </div>
                <div style={{ color: colors.textSecondary }}>
                  <strong style={{ color: colors.accent }}>site:instagram.com "nom cible"</strong> → Google Dork Instagram
                </div>
              </div>

              <h3 style={{ color: colors.accent, fontSize: "1.5rem", marginBottom: "15px", marginTop: "30px" }}>💎 Outils spécialisés</h3>

              <div style={{ background: colors.bgPrimary, padding: "20px", borderRadius: "8px", marginBottom: "15px" }}>
                <h4 style={{ color: colors.accent, marginBottom: "10px" }}>InstaLooter</h4>
                <p style={{ color: colors.textSecondary, lineHeight: "1.6", marginBottom: "10px" }}>
                  Outil Python permettant de télécharger en masse les publications d'un profil ou d'un hashtag avec leurs métadonnées associées.
                </p>
                <div style={{ fontFamily: "monospace", fontSize: "0.85rem" }}>
                  <code style={{ color: colors.accent, display: "block", marginBottom: "5px" }}>pip install instaLooter</code>
                  <code style={{ color: colors.accent, display: "block" }}>instaLooter user [username] ./output</code>
                </div>
              </div>

              <div style={{ background: colors.bgPrimary, padding: "20px", borderRadius: "8px", marginBottom: "15px" }}>
                <h4 style={{ color: colors.accent, marginBottom: "10px" }}>ExifTool — Extraction de métadonnées</h4>
                <p style={{ color: colors.textSecondary, lineHeight: "1.6", marginBottom: "10px" }}>
                  Extraction des données EXIF des images téléchargées. Révèle les coordonnées GPS, le modèle d'appareil photo, la date et l'heure exactes.
                </p>
                <div style={{ fontFamily: "monospace", fontSize: "0.85rem" }}>
                  <code style={{ color: colors.accent, display: "block" }}>exiftool -gpslatitude -gpslongitude image.jpg</code>
                </div>
              </div>

              <div style={{ background: colors.bgPrimary, padding: "20px", borderRadius: "8px", marginBottom: "15px" }}>
                <h4 style={{ color: colors.accent, marginBottom: "10px" }}>Reverse Image Search</h4>
                <p style={{ color: colors.textSecondary, lineHeight: "1.6", margin: 0 }}>
                  <strong>Google Images, TinEye, Yandex Images</strong> permettent de retrouver d'autres occurrences d'une photo sur le web, identifier une personne ou vérifier si une image est volée ou réutilisée à des fins de manipulation.
                </p>
              </div>

              <div style={{ background: colors.bgPrimary, padding: "20px", borderRadius: "8px" }}>
                <h4 style={{ color: colors.accent, marginBottom: "10px" }}>Gephi — Cartographie de réseau</h4>
                <p style={{ color: colors.textSecondary, lineHeight: "1.6", margin: 0 }}>
                  Outil open-source de visualisation de graphes. Permet de représenter visuellement le réseau d'interactions d'un compte Instagram : clusters de relations, influences, connexions cachées.
                </p>
              </div>
            </div>
          )}

          {activeTab === "exercises" && (
            <div>
              <h2 style={{ color: colors.textPrimary, fontSize: "2rem", marginBottom: "20px" }}>💡 Exercices Pratiques</h2>

              <div style={{ background: colors.bgPrimary, padding: "25px", borderRadius: "12px", marginBottom: "20px" }}>
                <h3 style={{ color: colors.accent, fontSize: "1.3rem", marginBottom: "15px" }}>Exercice 1 : Analyse d'un profil public</h3>
                <p style={{ color: colors.textSecondary, marginBottom: "15px" }}>
                  <strong>Objectif :</strong> Extraire le maximum d'informations d'un profil Instagram public sans créer de compte.
                </p>
                <p style={{ color: colors.textSecondary, marginBottom: "10px" }}><strong>Méthode :</strong></p>
                <ol style={{ color: colors.textSecondary, lineHeight: "1.8", marginLeft: "20px" }}>
                  <li>Accéder à instagram.com/@username directement dans le navigateur</li>
                  <li>Relever : bio, lien externe, nombre de publications, abonnés, localisation déclarée</li>
                  <li>Analyser les 12 premières publications : récurrence des lieux, personnes taguées, hashtags</li>
                  <li>Croiser le username sur d'autres plateformes (Twitter, LinkedIn, TikTok)</li>
                </ol>
                <p style={{ color: "#f59e0b", marginTop: "15px", fontWeight: "600" }}>
                  ⚠️ ÉTHIQUE : Utilisez uniquement des profils publics. Ne contactez jamais la cible.
                </p>
              </div>

              <div style={{ background: colors.bgPrimary, padding: "25px", borderRadius: "12px", marginBottom: "20px" }}>
                <h3 style={{ color: colors.accent, fontSize: "1.3rem", marginBottom: "15px" }}>Exercice 2 : Géolocalisation par analyse visuelle</h3>
                <p style={{ color: colors.textSecondary, marginBottom: "15px" }}>
                  <strong>Objectif :</strong> Identifier le lieu de prise de vue d'une photo Instagram à partir des éléments visuels et des métadonnées.
                </p>
                <p style={{ color: colors.textSecondary, marginBottom: "10px" }}><strong>Méthode :</strong></p>
                <ol style={{ color: colors.textSecondary, lineHeight: "1.8", marginLeft: "20px" }}>
                  <li>Télécharger l'image et lancer ExifTool pour vérifier les métadonnées GPS</li>
                  <li>Si pas de GPS : analyser les éléments visuels (enseignes, architecture, végétation, langue)</li>
                  <li>Utiliser Google Street View pour confirmer la localisation identifiée</li>
                  <li>Vérifier avec un reverse image search pour trouver d'autres occurrences de la scène</li>
                </ol>
              </div>

              <div style={{ background: colors.bgPrimary, padding: "25px", borderRadius: "12px", marginBottom: "20px" }}>
                <h3 style={{ color: colors.accent, fontSize: "1.3rem", marginBottom: "15px" }}>Exercice 3 : Investigation par hashtag</h3>
                <p style={{ color: colors.textSecondary, marginBottom: "15px" }}>
                  <strong>Objectif :</strong> Identifier les acteurs clés autour d'un sujet spécifique via les hashtags.
                </p>
                <p style={{ color: colors.textSecondary, marginBottom: "10px" }}><strong>Méthode :</strong></p>
                <ol style={{ color: colors.textSecondary, lineHeight: "1.8", marginLeft: "20px" }}>
                  <li>Accéder à instagram.com/explore/tags/[votre_sujet]</li>
                  <li>Identifier les comptes qui postent le plus fréquemment sur ce hashtag</li>
                  <li>Analyser les publications récentes et populaires : interactions, hashtags associés</li>
                  <li>Cartographier le réseau d'influences autour du sujet cible</li>
                </ol>
              </div>

              <div style={{ background: colors.bgPrimary, padding: "25px", borderRadius: "12px" }}>
                <h3 style={{ color: colors.accent, fontSize: "1.3rem", marginBottom: "15px" }}>Exercice 4 : Détection d'un faux compte</h3>
                <p style={{ color: colors.textSecondary, marginBottom: "15px" }}>
                  <strong>Objectif :</strong> Identifier les indicateurs d'un compte Instagram frauduleux ou automatisé (bot).
                </p>
                <p style={{ color: colors.textSecondary, marginBottom: "10px" }}><strong>Indicateurs à analyser :</strong></p>
                <ul style={{ color: colors.textSecondary, lineHeight: "1.8", marginLeft: "20px" }}>
                  <li>Photo de profil générique → reverse image search pour détecter le vol de photo</li>
                  <li>Ratio abonnés/abonnements anormal (ex : 50K followers, 0 following)</li>
                  <li>Publications espacées de manière identique → comportement automatisé</li>
                  <li>Commentaires génériques et répétitifs ("Nice pic!", "Great content!")</li>
                  <li>Date de création récente avec activité immédiatement très intensive</li>
                </ul>
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
                    {getScore() >= 4 ? "Badge débloqué ! Vous maîtrisez l'OSINT Instagram ! 🎉" : "Révisez le module et réessayez."}
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

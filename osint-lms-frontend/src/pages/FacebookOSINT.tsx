import { useState } from "react";
import { useThemeColors } from "../context/ThemeContext";

export default function FacebookOSINT() {
  const colors = useThemeColors();
  const [activeTab, setActiveTab] = useState("theory");
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

  const BADGE_KEY = "badge_module_facebook";
  const ANSWERS_KEY = "quiz_answers_facebook";
  const RESULTS_KEY = "quiz_results_facebook";

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
      question: "Combien d'utilisateurs actifs mensuels compte Facebook en 2024 ?",
      options: [
        "1 milliard",
        "2 milliards",
        "3 milliards",
        "500 millions"
      ],
      correct: 2
    },
    {
      id: 2,
      question: "Quel outil Meta permet de consulter toutes les publicités actives d'une page Facebook ?",
      options: [
        "Facebook Insights",
        "Bibliothèque publicitaire Meta",
        "Meta Business Suite",
        "Graph API Explorer"
      ],
      correct: 1
    },
    {
      id: 3,
      question: "Quelle fonctionnalité Facebook permet d'effectuer des recherches avancées par syntaxe spéciale ?",
      options: [
        "Facebook Explore",
        "Meta Search",
        "Graph Search",
        "Facebook Index"
      ],
      correct: 2
    },
    {
      id: 4,
      question: "Quel type de compte est recommandé pour mener des investigations OSINT sur Facebook ?",
      options: [
        "Son compte personnel principal",
        "Un compte premium Facebook",
        "Un compte dédié à l'investigation",
        "Un compte entreprise Meta"
      ],
      correct: 2
    },
    {
      id: 5,
      question: "Quel outil tiers permet d'effectuer des recherches avancées sur les profils et groupes Facebook publics ?",
      options: [
        "Sowdust Facebook Search",
        "IntelX uniquement",
        "Maltego uniquement",
        "theHarvester"
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
          <div style={{ fontSize: "4rem", marginBottom: "15px" }}>📘</div>
          <h1 style={{ fontSize: "2.5rem", fontWeight: "700", color: colors.textPrimary, marginBottom: "15px" }}>
            Module Facebook OSINT
          </h1>
          <p style={{ fontSize: "1.1rem", color: colors.textSecondary, maxWidth: "700px", margin: "0 auto" }}>
            Investigation et collecte de renseignements sur Facebook et Meta
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
              <h2 style={{ color: colors.textPrimary, fontSize: "2rem", marginBottom: "20px" }}>📖 Facebook comme source OSINT</h2>

              <p style={{ color: colors.textSecondary, lineHeight: "1.8", marginBottom: "20px" }}>
                Facebook reste le plus grand réseau social mondial avec <strong>3 milliards d'utilisateurs actifs</strong>. Malgré le renforcement des paramètres de confidentialité depuis 2018, une quantité considérable d'informations demeure publiquement accessible : profils, pages, groupes ouverts, événements, marketplace et publicités. Facebook est une source OSINT de premier plan pour identifier des individus, comprendre des réseaux d'influence et surveiller des activités suspectes.
              </p>

              <h3 style={{ color: colors.accent, fontSize: "1.5rem", marginBottom: "15px", marginTop: "30px" }}>🎯 Cas d'usage en OSINT</h3>
              <ul style={{ color: colors.textSecondary, lineHeight: "1.8", marginLeft: "20px", marginBottom: "25px" }}>
                <li><strong>Identification et profiling :</strong> Retrouver l'identité réelle d'un individu, son lieu de résidence, ses habitudes, son entourage</li>
                <li><strong>Investigation de groupes :</strong> Surveiller des groupes extrémistes, fraudes, trafics ou mouvements contestataires organisés sur Facebook</li>
                <li><strong>Analyse de pages :</strong> Étudier la stratégie de communication d'une organisation, ses publicités et son audience</li>
                <li><strong>Recherche d'événements :</strong> Identifier des rassemblements, manifestations ou activités organisées via les événements publics</li>
                <li><strong>Vérification de faits :</strong> Retrouver l'origine d'une publication virale, d'une photo ou d'une vidéo</li>
                <li><strong>Analyse financière :</strong> Via la Bibliothèque publicitaire Meta pour identifier les dépenses publicitaires politiques</li>
              </ul>

              <h3 style={{ color: colors.accent, fontSize: "1.5rem", marginBottom: "15px", marginTop: "30px" }}>🔑 Structure des données Facebook</h3>

              <div style={{ background: colors.bgPrimary, padding: "20px", borderRadius: "8px", marginBottom: "15px" }}>
                <h4 style={{ color: colors.accent, marginBottom: "10px" }}>Profils individuels</h4>
                <p style={{ color: colors.textSecondary, lineHeight: "1.6", margin: 0 }}>
                  Nom, photo de profil, couverture, ville de résidence, lieu de travail, études, relations, centres d'intérêt, publications publiques. L'ID numérique Facebook est accessible via facebook.com/[ID_numerique] même quand l'URL personnalisée est utilisée.
                </p>
              </div>

              <div style={{ background: colors.bgPrimary, padding: "20px", borderRadius: "8px", marginBottom: "15px" }}>
                <h4 style={{ color: colors.accent, marginBottom: "10px" }}>Pages et groupes publics</h4>
                <p style={{ color: colors.textSecondary, lineHeight: "1.6", margin: 0 }}>
                  Les pages professionnelles et groupes publics exposent leurs membres, publications, historique, administrateurs (partiellement), statistiques d'engagement et publicités actives via la Bibliothèque publicitaire Meta — accessible sans compte.
                </p>
              </div>

              <div style={{ background: colors.bgPrimary, padding: "20px", borderRadius: "8px" }}>
                <h4 style={{ color: colors.accent, marginBottom: "10px" }}>Marketplace et événements</h4>
                <p style={{ color: colors.textSecondary, lineHeight: "1.6", margin: 0 }}>
                  La Marketplace Facebook expose des informations sur les vendeurs (localisation approximative, historique de ventes). Les événements publics révèlent les participants, organisateurs, lieux et dates de rassemblement.
                </p>
              </div>
            </div>
          )}

          {activeTab === "tools" && (
            <div>
              <h2 style={{ color: colors.textPrimary, fontSize: "2rem", marginBottom: "20px" }}>🔧 Outils et Techniques Facebook OSINT</h2>

              <h3 style={{ color: colors.accent, fontSize: "1.5rem", marginBottom: "15px" }}>📌 Recherche manuelle</h3>
              <div style={{ background: colors.bgPrimary, padding: "15px", borderRadius: "8px", marginBottom: "20px", fontFamily: "monospace", fontSize: "0.9rem" }}>
                <div style={{ marginBottom: "12px", color: colors.textSecondary }}>
                  <strong style={{ color: colors.accent }}>facebook.com/[username]</strong> → Profil ou page public
                </div>
                <div style={{ marginBottom: "12px", color: colors.textSecondary }}>
                  <strong style={{ color: colors.accent }}>facebook.com/[ID_numerique]</strong> → Profil via ID (contourne les URLs personnalisées)
                </div>
                <div style={{ marginBottom: "12px", color: colors.textSecondary }}>
                  <strong style={{ color: colors.accent }}>facebook.com/search/top?q=[terme]</strong> → Recherche globale Facebook
                </div>
                <div style={{ color: colors.textSecondary }}>
                  <strong style={{ color: colors.accent }}>site:facebook.com "nom cible"</strong> → Google Dork Facebook
                </div>
              </div>

              <h3 style={{ color: colors.accent, fontSize: "1.5rem", marginBottom: "15px", marginTop: "30px" }}>💎 Outils spécialisés</h3>

              <div style={{ background: colors.bgPrimary, padding: "20px", borderRadius: "8px", marginBottom: "15px" }}>
                <h4 style={{ color: colors.accent, marginBottom: "10px" }}>Bibliothèque publicitaire Meta</h4>
                <p style={{ color: colors.textSecondary, lineHeight: "1.6", marginBottom: "10px" }}>
                  Outil officiel Meta donnant accès à toutes les publicités actives et archivées. Indispensable pour analyser les campagnes politiques, détecter la désinformation sponsorisée et comprendre les stratégies publicitaires.
                </p>
                <div style={{ fontFamily: "monospace", fontSize: "0.85rem" }}>
                  <code style={{ color: colors.accent, display: "block" }}>https://www.facebook.com/ads/library</code>
                </div>
              </div>

              <div style={{ background: colors.bgPrimary, padding: "20px", borderRadius: "8px", marginBottom: "15px" }}>
                <h4 style={{ color: colors.accent, marginBottom: "10px" }}>Sowdust Facebook Search</h4>
                <p style={{ color: colors.textSecondary, lineHeight: "1.6", margin: 0 }}>
                  Interface avancée de recherche Graph Search permettant de formuler des requêtes complexes : recherche par lieu, école, employeur, relations communes, publications dans un groupe spécifique.
                </p>
              </div>

              <div style={{ background: colors.bgPrimary, padding: "20px", borderRadius: "8px", marginBottom: "15px" }}>
                <h4 style={{ color: colors.accent, marginBottom: "10px" }}>Lookup-ID.com</h4>
                <p style={{ color: colors.textSecondary, lineHeight: "1.6", margin: 0 }}>
                  Permet de retrouver l'ID numérique Facebook d'un profil ou d'une page à partir de son URL. L'ID est stable même si l'utilisateur change son URL personnalisée, ce qui le rend très utile pour le suivi long terme d'une cible.
                </p>
              </div>

              <div style={{ background: colors.bgPrimary, padding: "20px", borderRadius: "8px" }}>
                <h4 style={{ color: colors.accent, marginBottom: "10px" }}>Google Dorks avancés</h4>
                <div style={{ fontFamily: "monospace", fontSize: "0.85rem" }}>
                  <div style={{ marginBottom: "10px", color: colors.textSecondary }}>
                    <code style={{ color: colors.accent, display: "block", marginBottom: "5px" }}>site:facebook.com/groups "sujet sensible"</code>
                    <p style={{ margin: 0, fontSize: "0.9rem" }}>Groupes Facebook traitant d'un sujet précis</p>
                  </div>
                  <div style={{ marginBottom: "10px", color: colors.textSecondary }}>
                    <code style={{ color: colors.accent, display: "block", marginBottom: "5px" }}>site:facebook.com "works at [entreprise]"</code>
                    <p style={{ margin: 0, fontSize: "0.9rem" }}>Employés d'une organisation sur Facebook</p>
                  </div>
                  <div style={{ color: colors.textSecondary }}>
                    <code style={{ color: colors.accent, display: "block", marginBottom: "5px" }}>site:facebook.com/events "[lieu]" "[date]"</code>
                    <p style={{ margin: 0, fontSize: "0.9rem" }}>Événements Facebook dans un lieu et à une date précis</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "exercises" && (
            <div>
              <h2 style={{ color: colors.textPrimary, fontSize: "2rem", marginBottom: "20px" }}>💡 Exercices Pratiques</h2>

              <div style={{ background: colors.bgPrimary, padding: "25px", borderRadius: "12px", marginBottom: "20px" }}>
                <h3 style={{ color: colors.accent, fontSize: "1.3rem", marginBottom: "15px" }}>Exercice 1 : Analyse d'une page publique</h3>
                <p style={{ color: colors.textSecondary, marginBottom: "15px" }}>
                  <strong>Objectif :</strong> Collecter et analyser toutes les informations disponibles sur une page Facebook publique.
                </p>
                <p style={{ color: colors.textSecondary, marginBottom: "10px" }}><strong>Méthode :</strong></p>
                <ol style={{ color: colors.textSecondary, lineHeight: "1.8", marginLeft: "20px" }}>
                  <li>Accéder à la page cible et relever : date de création, administrateurs visibles, fréquence de publication</li>
                  <li>Utiliser Lookup-ID.com pour obtenir l'ID numérique permanent de la page</li>
                  <li>Consulter la Bibliothèque publicitaire Meta pour voir les publicités actives et archivées</li>
                  <li>Analyser l'évolution de la photo de couverture pour reconstituer la chronologie</li>
                </ol>
                <p style={{ color: "#f59e0b", marginTop: "15px", fontWeight: "600" }}>
                  ⚠️ ÉTHIQUE : Limitez-vous aux informations publiques. Ne tentez pas d'accéder aux profils privés.
                </p>
              </div>

              <div style={{ background: colors.bgPrimary, padding: "25px", borderRadius: "12px", marginBottom: "20px" }}>
                <h3 style={{ color: colors.accent, fontSize: "1.3rem", marginBottom: "15px" }}>Exercice 2 : Investigation d'un groupe public</h3>
                <p style={{ color: colors.textSecondary, marginBottom: "15px" }}>
                  <strong>Objectif :</strong> Cartographier un groupe Facebook public et identifier ses membres influents.
                </p>
                <p style={{ color: colors.textSecondary, marginBottom: "10px" }}><strong>Méthode :</strong></p>
                <ol style={{ color: colors.textSecondary, lineHeight: "1.8", marginLeft: "20px" }}>
                  <li>Rejoindre ou accéder au groupe public cible</li>
                  <li>Identifier les administrateurs et modérateurs : rôles, date d'entrée, activité</li>
                  <li>Lister les membres les plus actifs et leurs publications récurrentes</li>
                  <li>Analyser les règles du groupe pour comprendre son fonctionnement et ses objectifs</li>
                </ol>
              </div>

              <div style={{ background: colors.bgPrimary, padding: "25px", borderRadius: "12px", marginBottom: "20px" }}>
                <h3 style={{ color: colors.accent, fontSize: "1.3rem", marginBottom: "15px" }}>Exercice 3 : Analyse publicitaire politique</h3>
                <p style={{ color: colors.textSecondary, marginBottom: "15px" }}>
                  <strong>Objectif :</strong> Utiliser la Bibliothèque publicitaire Meta pour analyser les dépenses publicitaires d'un acteur politique ou d'une ONG.
                </p>
                <p style={{ color: colors.textSecondary, marginBottom: "10px" }}><strong>Méthode :</strong></p>
                <ol style={{ color: colors.textSecondary, lineHeight: "1.8", marginLeft: "20px" }}>
                  <li>Accéder à facebook.com/ads/library et sélectionner la catégorie "Publicités à caractère politique"</li>
                  <li>Rechercher une page cible et consulter l'historique des publicités</li>
                  <li>Analyser les messages clés, les visuels utilisés, les plages de diffusion</li>
                  <li>Comparer les montants dépensés et les audiences ciblées sur différentes périodes</li>
                </ol>
              </div>

              <div style={{ background: colors.bgPrimary, padding: "25px", borderRadius: "12px" }}>
                <h3 style={{ color: colors.accent, fontSize: "1.3rem", marginBottom: "15px" }}>Exercice 4 : Recherche via Google Dorks</h3>
                <p style={{ color: colors.textSecondary, marginBottom: "15px" }}>
                  <strong>Objectif :</strong> Retrouver des informations Facebook indexées par Google sur une organisation cible.
                </p>
                <p style={{ color: colors.textSecondary, marginBottom: "10px" }}><strong>Requêtes à tester :</strong></p>
                <div style={{ fontFamily: "monospace", fontSize: "0.85rem" }}>
                  <code style={{ color: colors.accent, display: "block", marginBottom: "8px" }}>site:facebook.com "[nom organisation]" "works at"</code>
                  <code style={{ color: colors.accent, display: "block", marginBottom: "8px" }}>site:facebook.com/groups "[thématique]" "rejoindre"</code>
                  <code style={{ color: colors.accent, display: "block" }}>site:facebook.com/events "[ville]" "[année]"</code>
                </div>
                <p style={{ color: "#ef4444", marginTop: "15px", fontWeight: "600" }}>
                  ⚠️ LÉGAL : Le scraping massif de Facebook est interdit par les CGU. Respectez les limites légales.
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
                    {getScore() >= 4 ? "Badge débloqué ! Vous maîtrisez l'OSINT Facebook ! 🎉" : "Révisez le module et réessayez."}
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

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
    { id: 1, question: "Combien d'utilisateurs actifs Telegram compte-t-il ?", options: ["700+ millions", "500 millions", "1 milliard", "300 millions"], correct: 0 },
    { id: 2, question: "Quelle est la limite de membres dans un groupe Telegram ?", options: ["200 000", "100 000", "50 000", "Illimité"], correct: 0 },
    { id: 3, question: "Les canaux publics Telegram sont-ils indexés par Google ?", options: ["Oui, via site:t.me", "Non jamais", "Seulement vérifiés", "Avec autorisation"], correct: 0 },
    { id: 4, question: "Quel outil Python pour scraper Telegram ?", options: ["Telethon", "TeleScrape", "TeleBot", "PyTelegram"], correct: 0 },
    { id: 5, question: "Peut-on récupérer historique complet canal public ?", options: ["Oui via API", "Non jamais", "100 derniers messages", "Avec premium"], correct: 0 }
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
          <div style={{ fontSize: "4rem", marginBottom: "15px" }}>✈️</div>
          <h1 style={{ fontSize: "2.5rem", fontWeight: "700", color: colors.textPrimary, marginBottom: "15px" }}>Module Telegram OSINT</h1>
          <p style={{ fontSize: "1.1rem", color: colors.textSecondary, maxWidth: "700px", margin: "0 auto" }}>Investigation de canaux, groupes et communautés Telegram</p>
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
              <h2 style={{ color: colors.textPrimary, fontSize: "2rem", marginBottom: "20px" }}>📖 Telegram OSINT</h2>
              <p style={{ color: colors.textSecondary, lineHeight: "1.8", marginBottom: "20px" }}>
                Telegram est une messagerie chiffrée avec <strong>700+ millions d'utilisateurs</strong>. Contrairement à WhatsApp, de nombreux canaux et groupes sont <strong>publics et indexables</strong>. Telegram est populaire chez hackers, activistes, crypto-traders, whistleblowers car offre chiffrement et anonymat relatif.
              </p>
              <h3 style={{ color: colors.accent, fontSize: "1.5rem", marginBottom: "15px" }}>🎯 Pourquoi Telegram en OSINT ?</h3>
              <ul style={{ color: colors.textSecondary, lineHeight: "1.8", marginLeft: "20px", marginBottom: "25px" }}>
                <li><strong>Surveillance de leaks :</strong> Canaux partageant databases volées, credentials</li>
                <li><strong>Veille cybercrime :</strong> Groupes ransomware, malware, exploits</li>
                <li><strong>Analyse activisme :</strong> Mouvements politiques, manifestations</li>
                <li><strong>Monitoring crypto :</strong> Pump & dump, scams, communautés DeFi</li>
                <li><strong>Investigation terrorisme :</strong> Groupes extrémistes, propagande</li>
              </ul>
              <h3 style={{ color: colors.accent, fontSize: "1.5rem", marginBottom: "15px" }}>📊 Types de contenus</h3>
              <div style={{ background: colors.bgPrimary, padding: "20px", borderRadius: "8px", marginBottom: "15px" }}>
                <h4 style={{ color: colors.accent, marginBottom: "10px" }}>Canaux (Channels)</h4>
                <p style={{ color: colors.textSecondary, lineHeight: "1.6", margin: 0 }}>
                  Diffusion unidirectionnelle, membres illimités, historique complet accessible, administrateur poste seul. Exemples : médias, entreprises, influenceurs. URL : t.me/nomcanal
                </p>
              </div>
              <div style={{ background: colors.bgPrimary, padding: "20px", borderRadius: "8px", marginBottom: "15px" }}>
                <h4 style={{ color: colors.accent, marginBottom: "10px" }}>Groupes (Groups)</h4>
                <p style={{ color: colors.textSecondary, lineHeight: "1.6", margin: 0 }}>
                  Discussions bidirectionnelles, max 200K membres, tous peuvent écrire. Exemples : communautés, support, coordination. URL : t.me/joinchat/... ou t.me/nomgroupe
                </p>
              </div>
              <div style={{ background: colors.bgPrimary, padding: "20px", borderRadius: "8px" }}>
                <h4 style={{ color: colors.accent, marginBottom: "10px" }}>Bots</h4>
                <p style={{ color: colors.textSecondary, lineHeight: "1.6", margin: 0 }}>
                  Automatisation : alertes, recherche, scraping, modération. API Telegram Bot permet création. Exemple : @username_bot
                </p>
              </div>
              <div style={{ background: "#ef444420", border: "2px solid #ef4444", padding: "20px", borderRadius: "8px", marginTop: "20px" }}>
                <p style={{ color: colors.textSecondary, lineHeight: "1.6", margin: 0 }}><strong style={{ color: "#ef4444" }}>⚠️ Éthique :</strong> Contenus illégaux (leaks, CSAM, terrorisme) à signaler aux autorités. Ne pas télécharger données volées. Usage surveillance légitime uniquement.</p>
              </div>
            </div>
          )}

          {activeTab === "tools" && (
            <div>
              <h2 style={{ color: colors.textPrimary, fontSize: "2rem", marginBottom: "20px" }}>🔧 Outils Telegram</h2>
              <h3 style={{ color: colors.accent, fontSize: "1.5rem", marginBottom: "15px" }}>Recherche manuelle</h3>
              <p style={{ color: colors.textSecondary, marginBottom: "15px" }}>Dans Telegram app : recherche globale par @username, nom de canal, mots-clés</p>
              <h3 style={{ color: colors.accent, fontSize: "1.5rem", marginBottom: "15px" }}>Google Dorks</h3>
              <div style={{ background: colors.bgPrimary, padding: "15px", borderRadius: "8px", marginBottom: "20px", fontFamily: "monospace", fontSize: "0.9rem" }}>
                <div style={{ marginBottom: "10px", color: colors.textSecondary }}><strong style={{ color: colors.accent }}>site:t.me "cybersecurity"</strong></div>
                <div style={{ marginBottom: "10px", color: colors.textSecondary }}><strong style={{ color: colors.accent }}>site:t.me inurl:joinchat</strong></div>
                <div style={{ color: colors.textSecondary }}><strong style={{ color: colors.accent }}>site:t.me "leaked database"</strong></div>
              </div>
              <h3 style={{ color: colors.accent, fontSize: "1.5rem", marginBottom: "15px" }}>Annuaires</h3>
              <p style={{ color: colors.textSecondary, marginBottom: "10px" }}><strong>tgstat.com :</strong> Analytics de canaux, stats abonnés, croissance</p>
              <p style={{ color: colors.textSecondary, marginBottom: "10px" }}><strong>telemetr.io :</strong> Statistiques détaillées, classements</p>
              <p style={{ color: colors.textSecondary, marginBottom: "20px" }}><strong>telegramchannels.me :</strong> Annuaire canaux par catégorie</p>
              <h3 style={{ color: colors.accent, fontSize: "1.5rem", marginBottom: "15px" }}>Scraping Python : Telethon</h3>
              <div style={{ background: colors.bgPrimary, padding: "15px", borderRadius: "8px", fontFamily: "monospace", fontSize: "0.85rem", marginBottom: "15px" }}>
                <div style={{ color: colors.textSecondary, marginBottom: "8px" }}>pip install telethon</div>
                <div style={{ color: colors.textSecondary, marginBottom: "8px" }}>from telethon import TelegramClient</div>
                <div style={{ color: colors.textSecondary, marginBottom: "8px" }}>client = TelegramClient('session', api_id, api_hash)</div>
                <div style={{ color: colors.textSecondary }}>messages = await client.get_messages('channel_name', limit=100)</div>
              </div>
              <p style={{ color: colors.textSecondary, marginBottom: "10px" }}>Telethon permet : récupérer historique complet, exporter membres, télécharger médias, automatiser recherches</p>
              <p style={{ color: "#ef4444", fontWeight: "600" }}>⚠️ Nécessite API ID/Hash officiel : my.telegram.org</p>
            </div>
          )}

          {activeTab === "exercises" && (
            <div>
              <h2 style={{ color: colors.textPrimary, fontSize: "2rem", marginBottom: "20px" }}>💡 Exercices Pratiques</h2>
              <div style={{ background: colors.bgPrimary, padding: "25px", borderRadius: "12px", marginBottom: "20px" }}>
                <h3 style={{ color: colors.accent, fontSize: "1.3rem", marginBottom: "15px" }}>Exercice 1 : Canaux de leaks</h3>
                <p style={{ color: colors.textSecondary, marginBottom: "15px" }}><strong>Objectif :</strong> Identifier canaux Telegram partageant databases leakées</p>
                <p style={{ color: colors.textSecondary, marginBottom: "10px" }}><strong>Méthode :</strong></p>
                <ol style={{ color: colors.textSecondary, lineHeight: "1.8", marginLeft: "20px" }}>
                  <li>Google : site:t.me "leaked database" OR "database leak"</li>
                  <li>Noter : nom canal, nombre abonnés, date création, dernière activité</li>
                  <li>Analyser types de données (emails, credentials, cartes bancaires...)</li>
                  <li>Documenter : origines leaks (breaches connus, nouveaux)</li>
                </ol>
                <p style={{ color: "#ef4444", marginTop: "15px", fontWeight: "600" }}>⚠️ NE PAS télécharger données illégales ! Observation uniquement</p>
              </div>
              <div style={{ background: colors.bgPrimary, padding: "25px", borderRadius: "12px", marginBottom: "20px" }}>
                <h3 style={{ color: colors.accent, fontSize: "1.3rem", marginBottom: "15px" }}>Exercice 2 : Monitoring ransomware</h3>
                <p style={{ color: colors.textSecondary, marginBottom: "15px" }}><strong>Objectif :</strong> Surveiller canaux de groupes ransomware</p>
                <p style={{ color: colors.textSecondary, marginBottom: "10px" }}><strong>Méthode :</strong></p>
                <ol style={{ color: colors.textSecondary, lineHeight: "1.8", marginLeft: "20px" }}>
                  <li>Rechercher canaux de groupes ransomware connus (LockBit, ALPHV...)</li>
                  <li>Observer : victimes publiées, deadlines paiement, montants</li>
                  <li>Croiser avec Have I Been Pwned et intelligence feeds</li>
                  <li>Alerter organisations victimes si possible</li>
                </ol>
              </div>
              <div style={{ background: colors.bgPrimary, padding: "25px", borderRadius: "12px" }}>
                <h3 style={{ color: colors.accent, fontSize: "1.3rem", marginBottom: "15px" }}>Exercice 3 : Scraping avec Telethon</h3>
                <p style={{ color: colors.textSecondary, marginBottom: "15px" }}><strong>Objectif :</strong> Extraire historique complet d'un canal public</p>
                <p style={{ color: colors.textSecondary, marginBottom: "10px" }}><strong>Méthode :</strong></p>
                <ol style={{ color: colors.textSecondary, lineHeight: "1.8", marginLeft: "20px" }}>
                  <li>Créer application Telegram : my.telegram.org</li>
                  <li>Obtenir api_id et api_hash</li>
                  <li>Script Telethon pour récupérer messages d'un canal</li>
                  <li>Analyser : fréquence posts, sujets récurrents, pics d'activité</li>
                </ol>
                <p style={{ color: "#ef4444", marginTop: "15px", fontWeight: "600" }}>⚠️ Respecter rate limits et ToS Telegram</p>
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

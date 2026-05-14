import { useState, useEffect } from "react";
import { useThemeColors } from "../context/ThemeContext";
import { useAuth } from "../auth/AuthContext";

export default function InstagramOSINT() {
  const colors = useThemeColors();
  const { user } = useAuth();
  const [progress, setProgress] = useState({
    exercise1: false,
    exercise2: false,
    exercise3: false,
    exercise4: false,
    exercise5: false,
  });

  const [answers, setAnswers] = useState({
    exercise1: "",
    exercise2: "",
    exercise3: "",
    exercise4: "",
    exercise5: "",
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    loadProgress();
  }, []);

  const loadProgress = async () => {
    if (!user) return;
    
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/progression/instagram-osint`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.progress) {
          setProgress(data.progress);
        }
      }
    } catch (error) {
      console.error("Erreur chargement progression:", error);
    }
  };

  const saveProgress = async (exerciseKey: string, completed: boolean) => {
    if (!user) return;

    const newProgress = { ...progress, [exerciseKey]: completed };
    setProgress(newProgress);

    try {
      const token = localStorage.getItem("token");
      await fetch(`${import.meta.env.VITE_API_URL}/api/progression/instagram-osint`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ progress: newProgress }),
      });
    } catch (error) {
      console.error("Erreur sauvegarde progression:", error);
    }
  };

  const checkAnswer = (exerciseKey: string, correctAnswer: string, userAnswer: string) => {
    const isCorrect = userAnswer.toLowerCase().trim() === correctAnswer.toLowerCase().trim();
    
    if (isCorrect) {
      saveProgress(exerciseKey, true);
      alert("✅ Correct ! Exercice validé.");
    } else {
      alert("❌ Incorrect. Réessayez !");
    }
  };

  const resetProgress = async () => {
    if (!confirm("Voulez-vous vraiment réinitialiser votre progression sur ce module ?")) {
      return;
    }

    const resetData = {
      exercise1: false,
      exercise2: false,
      exercise3: false,
      exercise4: false,
      exercise5: false,
    };

    setProgress(resetData);
    setAnswers({
      exercise1: "",
      exercise2: "",
      exercise3: "",
      exercise4: "",
      exercise5: "",
    });

    if (user) {
      try {
        const token = localStorage.getItem("token");
        await fetch(`${import.meta.env.VITE_API_URL}/api/progression/instagram-osint`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ progress: resetData }),
        });
        alert("✅ Progression réinitialisée !");
      } catch (error) {
        console.error("Erreur reset:", error);
      }
    }
  };

  // ===== QUIZ STATE =====
  const QUIZ_BADGE_KEY = "badge_module_instagram";
  const QUIZ_ANSWERS_KEY = "quiz_answers_instagram_module";
  const QUIZ_RESULTS_KEY = "quiz_results_instagram_module";

  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>(() => {
    const saved = localStorage.getItem(QUIZ_ANSWERS_KEY);
    return saved ? JSON.parse(saved) : {};
  });
  const [showQuizResults, setShowQuizResults] = useState<boolean>(() => {
    return localStorage.getItem(QUIZ_RESULTS_KEY) === "true";
  });
  const [showQuizResetModal, setShowQuizResetModal] = useState(false);

  const quizQuestions = [
    { id: 1, question: "Quelle plateforme compte plus de 2 milliards d'utilisateurs actifs ?", options: ["Twitter/X", "TikTok", "Instagram", "Snapchat"], correct: 2 },
    { id: 2, question: "Quel outil en ligne de commande extrait les métadonnées EXIF d'une image ?", options: ["ExifTool", "InstaLooter", "TinEye", "Gephi"], correct: 0 },
    { id: 3, question: "Quelle URL permet d'accéder aux publications d'un hashtag sur Instagram ?", options: ["instagram.com/search/tag/", "instagram.com/hashtag/", "instagram.com/explore/tags/[hashtag]", "instagram.com/tag/[hashtag]"], correct: 2 },
    { id: 4, question: "Quel outil open-source permet de créer des graphes de relations pour un réseau social ?", options: ["Maltego uniquement", "Gephi", "ExifTool", "InstaLooter"], correct: 1 },
    { id: 5, question: "Quelle réglementation européenne protège les données personnelles lors d'investigations OSINT ?", options: ["DORA", "LPM", "NIS2", "RGPD"], correct: 3 },
  ];

  const getQuizScore = () => {
    let correct = 0;
    quizQuestions.forEach(q => { if (quizAnswers[q.id] === q.correct.toString()) correct++; });
    return correct;
  };

  const handleQuizSubmit = () => {
    const score = getQuizScore();
    setShowQuizResults(true);
    localStorage.setItem(QUIZ_ANSWERS_KEY, JSON.stringify(quizAnswers));
    localStorage.setItem(QUIZ_RESULTS_KEY, "true");
    if (score >= 4) localStorage.setItem(QUIZ_BADGE_KEY, "true");
  };

  const handleQuizReset = () => {
    setQuizAnswers({});
    setShowQuizResults(false);
    setShowQuizResetModal(false);
    localStorage.removeItem(QUIZ_BADGE_KEY);
    localStorage.removeItem(QUIZ_ANSWERS_KEY);
    localStorage.removeItem(QUIZ_RESULTS_KEY);
  };
  // ===== FIN QUIZ STATE =====

  const completedCount = Object.values(progress).filter(Boolean).length;
  const totalExercises = 5;
  const progressPercentage = (completedCount / totalExercises) * 100;

  return (
    <main style={{ paddingTop: "80px", padding: "40px", maxWidth: "1400px", margin: "0 auto", minHeight: "100vh", background: colors.bgPrimary }}>
      
      {/* Header */}
      <div style={{ marginBottom: "40px" }}>
        <h1 style={{ color: colors.accent, fontSize: "2.5rem", marginBottom: "10px" }}>
          📸 Instagram OSINT
        </h1>
        <p style={{ color: colors.textSecondary, fontSize: "1.2rem", lineHeight: "1.6" }}>
          Techniques d'investigation sur Instagram pour l'OSINT
        </p>
      </div>

      {/* Progress bar */}
      <div style={{ marginBottom: "40px", background: colors.bgSecondary, padding: "20px", borderRadius: "12px", border: `1px solid ${colors.border}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
          <span style={{ color: colors.textPrimary, fontWeight: "bold" }}>
            Progression : {completedCount}/{totalExercises} exercices
          </span>
          <span style={{ color: colors.accent, fontWeight: "bold" }}>
            {progressPercentage.toFixed(0)}%
          </span>
        </div>
        <div style={{ width: "100%", height: "12px", background: "#1a1a1a", borderRadius: "6px", overflow: "hidden" }}>
          <div style={{ width: `${progressPercentage}%`, height: "100%", background: colors.accent, transition: "width 0.3s" }} />
        </div>
        <button
          onClick={resetProgress}
          style={{
            marginTop: "15px",
            padding: "8px 16px",
            background: "#ef4444",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          🔄 Réinitialiser la progression
        </button>
      </div>

      {/* Introduction */}
      <div style={{ background: colors.bgSecondary, padding: "30px", borderRadius: "12px", marginBottom: "30px", border: `2px solid ${colors.accent}` }}>
        <h2 style={{ color: colors.accent, fontSize: "1.8rem", marginBottom: "20px" }}>
          🎯 Introduction à l'OSINT Instagram
        </h2>
        <p style={{ color: colors.textPrimary, lineHeight: "1.8", marginBottom: "15px" }}>
          Instagram est une mine d'or pour l'OSINT avec plus de <strong>2 milliards d'utilisateurs actifs</strong>. Les publications géolocalisées, 
          les stories, les hashtags et les métadonnées des images contiennent des informations précieuses pour une investigation.
        </p>
        <p style={{ color: colors.textPrimary, lineHeight: "1.8" }}>
          Ce module vous apprendra à exploiter Instagram pour collecter des informations tout en respectant les limites légales et éthiques.
        </p>
      </div>

      {/* Section 1 : Recherche de profils */}
      <div style={{ background: colors.bgPrimary, border: `1px solid ${colors.border}`, borderRadius: "12px", padding: "30px", marginBottom: "30px" }}>
        <h3 style={{ color: colors.accent, fontSize: "1.6rem", marginBottom: "20px" }}>
          1️⃣ Recherche et analyse de profils
        </h3>
        
        <div style={{ marginBottom: "25px" }}>
          <h4 style={{ color: colors.textPrimary, fontSize: "1.2rem", marginBottom: "15px" }}>
            🔍 Techniques de recherche
          </h4>
          <ul style={{ color: colors.textSecondary, lineHeight: "1.8", paddingLeft: "20px" }}>
            <li><strong>Recherche par nom d'utilisateur :</strong> instagram.com/username</li>
            <li><strong>Recherche par hashtags :</strong> #event #location #brand</li>
            <li><strong>Recherche par localisation :</strong> Explorer → Lieux → Nom du lieu</li>
            <li><strong>Outils tiers :</strong> Picuki, Storiesig, Ingramer (consultatif uniquement)</li>
          </ul>
        </div>

        <div style={{ marginBottom: "25px" }}>
          <h4 style={{ color: colors.textPrimary, fontSize: "1.2rem", marginBottom: "15px" }}>
            📊 Analyse d'un profil
          </h4>
          <ul style={{ color: colors.textSecondary, lineHeight: "1.8", paddingLeft: "20px" }}>
            <li><strong>Biographie :</strong> Nom, localisation, site web, contacts</li>
            <li><strong>Abonnements/Abonnés :</strong> Réseau social, connexions professionnelles</li>
            <li><strong>Publications :</strong> Fréquence, type de contenu, géolocalisation</li>
            <li><strong>Stories :</strong> Activités récentes, lieux fréquentés</li>
            <li><strong>Reels :</strong> Vidéos courtes, tendances suivies</li>
          </ul>
        </div>

        {/* Exercise 1 */}
        <div style={{ background: colors.bgSecondary, padding: "20px", borderRadius: "8px", border: progress.exercise1 ? `2px solid ${colors.accent}` : `1px solid ${colors.border}` }}>
          <h4 style={{ color: colors.accent, marginBottom: "15px" }}>
            {progress.exercise1 ? "✅" : "📝"} Exercice 1 : Recherche de profil
          </h4>
          <p style={{ color: colors.textPrimary, marginBottom: "15px" }}>
            Quelle URL permet d'accéder directement au profil Instagram d'un utilisateur nommé "john_doe" ?
          </p>
          <input
            type="text"
            value={answers.exercise1}
            onChange={(e) => setAnswers({ ...answers, exercise1: e.target.value })}
            placeholder="Entrez l'URL complète"
            disabled={progress.exercise1}
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "15px",
              background: colors.bgPrimary,
              border: `1px solid ${colors.border}`,
              borderRadius: "6px",
              color: colors.textPrimary,
              fontSize: "1rem",
            }}
          />
          <button
            onClick={() => checkAnswer("exercise1", "instagram.com/john_doe", answers.exercise1)}
            disabled={progress.exercise1}
            style={{
              padding: "10px 20px",
              background: progress.exercise1 ? "#4ade80" : colors.accent,
              color: colors.bgPrimary,
              border: "none",
              borderRadius: "6px",
              cursor: progress.exercise1 ? "not-allowed" : "pointer",
              fontWeight: "bold",
            }}
          >
            {progress.exercise1 ? "✅ Validé" : "Vérifier"}
          </button>
        </div>
      </div>

      {/* Section 2 : Géolocalisation */}
      <div style={{ background: colors.bgPrimary, border: `1px solid ${colors.border}`, borderRadius: "12px", padding: "30px", marginBottom: "30px" }}>
        <h3 style={{ color: colors.accent, fontSize: "1.6rem", marginBottom: "20px" }}>
          2️⃣ Géolocalisation et métadonnées
        </h3>
        
        <div style={{ marginBottom: "25px" }}>
          <h4 style={{ color: colors.textPrimary, fontSize: "1.2rem", marginBottom: "15px" }}>
            📍 Exploitation des données de localisation
          </h4>
          <ul style={{ color: colors.textSecondary, lineHeight: "1.8", paddingLeft: "20px" }}>
            <li><strong>Tags de localisation :</strong> Rechercher toutes les publications d'un lieu spécifique</li>
            <li><strong>Google Maps :</strong> Identifier des lieux visibles dans les photos</li>
            <li><strong>Métadonnées EXIF :</strong> Coordonnées GPS si non supprimées par Instagram</li>
            <li><strong>Analyse temporelle :</strong> Horodatage des publications pour établir une chronologie</li>
          </ul>
        </div>

        <div style={{ marginBottom: "25px" }}>
          <h4 style={{ color: colors.textPrimary, fontSize: "1.2rem", marginBottom: "15px" }}>
            🛠️ Outils d'analyse d'images
          </h4>
          <ul style={{ color: colors.textSecondary, lineHeight: "1.8", paddingLeft: "20px" }}>
            <li><strong>ExifTool :</strong> Extraction métadonnées complètes</li>
            <li><strong>InstaLooter :</strong> Téléchargement massif de publications</li>
            <li><strong>Google Reverse Image Search :</strong> Retrouver d'autres instances d'une photo</li>
            <li><strong>TinEye :</strong> Recherche inversée d'images</li>
          </ul>
        </div>

        {/* Exercise 2 */}
        <div style={{ background: colors.bgSecondary, padding: "20px", borderRadius: "8px", border: progress.exercise2 ? `2px solid ${colors.accent}` : `1px solid ${colors.border}` }}>
          <h4 style={{ color: colors.accent, marginBottom: "15px" }}>
            {progress.exercise2 ? "✅" : "📝"} Exercice 2 : Métadonnées
          </h4>
          <p style={{ color: colors.textPrimary, marginBottom: "15px" }}>
            Quel outil en ligne de commande permet d'extraire les métadonnées EXIF d'une image ?
          </p>
          <input
            type="text"
            value={answers.exercise2}
            onChange={(e) => setAnswers({ ...answers, exercise2: e.target.value })}
            placeholder="Nom de l'outil"
            disabled={progress.exercise2}
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "15px",
              background: colors.bgPrimary,
              border: `1px solid ${colors.border}`,
              borderRadius: "6px",
              color: colors.textPrimary,
              fontSize: "1rem",
            }}
          />
          <button
            onClick={() => checkAnswer("exercise2", "exiftool", answers.exercise2)}
            disabled={progress.exercise2}
            style={{
              padding: "10px 20px",
              background: progress.exercise2 ? "#4ade80" : colors.accent,
              color: colors.bgPrimary,
              border: "none",
              borderRadius: "6px",
              cursor: progress.exercise2 ? "not-allowed" : "pointer",
              fontWeight: "bold",
            }}
          >
            {progress.exercise2 ? "✅ Validé" : "Vérifier"}
          </button>
        </div>
      </div>

      {/* Section 3 : Hashtags et tendances */}
      <div style={{ background: colors.bgPrimary, border: `1px solid ${colors.border}`, borderRadius: "12px", padding: "30px", marginBottom: "30px" }}>
        <h3 style={{ color: colors.accent, fontSize: "1.6rem", marginBottom: "20px" }}>
          3️⃣ Analyse de hashtags et tendances
        </h3>
        
        <div style={{ marginBottom: "25px" }}>
          <h4 style={{ color: colors.textPrimary, fontSize: "1.2rem", marginBottom: "15px" }}>
            #️⃣ Utilisation stratégique des hashtags
          </h4>
          <ul style={{ color: colors.textSecondary, lineHeight: "1.8", paddingLeft: "20px" }}>
            <li><strong>Hashtags événementiels :</strong> #eventname2024, #conference, #festival</li>
            <li><strong>Hashtags géographiques :</strong> #paris, #nyc, #tokyotrip</li>
            <li><strong>Hashtags communautaires :</strong> Groupes d'intérêt, marques, organisations</li>
            <li><strong>Suivi temporel :</strong> Évolution d'un hashtag dans le temps</li>
          </ul>
        </div>

        <div style={{ marginBottom: "25px" }}>
          <h4 style={{ color: colors.textPrimary, fontSize: "1.2rem", marginBottom: "15px" }}>
            📈 Outils d'analyse de hashtags
          </h4>
          <ul style={{ color: colors.textSecondary, lineHeight: "1.8", paddingLeft: "20px" }}>
            <li><strong>Hashtagify :</strong> Analyse de popularité et hashtags connexes</li>
            <li><strong>RiteTag :</strong> Suggestions de hashtags pertinents</li>
            <li><strong>Display Purposes :</strong> Générateur de hashtags</li>
            <li><strong>Instagram Insights :</strong> Statistiques officielles (comptes Business)</li>
          </ul>
        </div>

        {/* Exercise 3 */}
        <div style={{ background: colors.bgSecondary, padding: "20px", borderRadius: "8px", border: progress.exercise3 ? `2px solid ${colors.accent}` : `1px solid ${colors.border}` }}>
          <h4 style={{ color: colors.accent, marginBottom: "15px" }}>
            {progress.exercise3 ? "✅" : "📝"} Exercice 3 : Recherche par hashtag
          </h4>
          <p style={{ color: colors.textPrimary, marginBottom: "15px" }}>
            Comment rechercher toutes les publications contenant le hashtag #cybersecurity sur Instagram ? (format: instagram.com/...)
          </p>
          <input
            type="text"
            value={answers.exercise3}
            onChange={(e) => setAnswers({ ...answers, exercise3: e.target.value })}
            placeholder="URL de recherche"
            disabled={progress.exercise3}
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "15px",
              background: colors.bgPrimary,
              border: `1px solid ${colors.border}`,
              borderRadius: "6px",
              color: colors.textPrimary,
              fontSize: "1rem",
            }}
          />
          <button
            onClick={() => checkAnswer("exercise3", "instagram.com/explore/tags/cybersecurity", answers.exercise3)}
            disabled={progress.exercise3}
            style={{
              padding: "10px 20px",
              background: progress.exercise3 ? "#4ade80" : colors.accent,
              color: colors.bgPrimary,
              border: "none",
              borderRadius: "6px",
              cursor: progress.exercise3 ? "not-allowed" : "pointer",
              fontWeight: "bold",
            }}
          >
            {progress.exercise3 ? "✅ Validé" : "Vérifier"}
          </button>
        </div>
      </div>

      {/* Section 4 : Analyse du réseau social */}
      <div style={{ background: colors.bgPrimary, border: `1px solid ${colors.border}`, borderRadius: "12px", padding: "30px", marginBottom: "30px" }}>
        <h3 style={{ color: colors.accent, fontSize: "1.6rem", marginBottom: "20px" }}>
          4️⃣ Cartographie du réseau social
        </h3>
        
        <div style={{ marginBottom: "25px" }}>
          <h4 style={{ color: colors.textPrimary, fontSize: "1.2rem", marginBottom: "15px" }}>
            👥 Analyse des connexions
          </h4>
          <ul style={{ color: colors.textSecondary, lineHeight: "1.8", paddingLeft: "20px" }}>
            <li><strong>Abonnés communs :</strong> Identifier des liens entre différents profils</li>
            <li><strong>Mentions (@) :</strong> Personnes fréquemment mentionnées</li>
            <li><strong>Commentaires :</strong> Interactions régulières, relations proches</li>
            <li><strong>Stories :</strong> Comptes qui visualisent régulièrement les stories</li>
          </ul>
        </div>

        <div style={{ marginBottom: "25px" }}>
          <h4 style={{ color: colors.textPrimary, fontSize: "1.2rem", marginBottom: "15px" }}>
            🕸️ Techniques de cartographie
          </h4>
          <ul style={{ color: colors.textSecondary, lineHeight: "1.8", paddingLeft: "20px" }}>
            <li><strong>Graphes de relations :</strong> Visualiser les connexions avec Maltego, Gephi</li>
            <li><strong>Analyse temporelle :</strong> Évolution des relations dans le temps</li>
            <li><strong>Communautés :</strong> Identifier des groupes d'utilisateurs liés</li>
            <li><strong>Influenceurs :</strong> Repérer les comptes centraux d'un réseau</li>
          </ul>
        </div>

        {/* Exercise 4 */}
        <div style={{ background: colors.bgSecondary, padding: "20px", borderRadius: "8px", border: progress.exercise4 ? `2px solid ${colors.accent}` : `1px solid ${colors.border}` }}>
          <h4 style={{ color: colors.accent, marginBottom: "15px" }}>
            {progress.exercise4 ? "✅" : "📝"} Exercice 4 : Analyse de réseau
          </h4>
          <p style={{ color: colors.textPrimary, marginBottom: "15px" }}>
            Quel outil open-source permet de créer des graphes de relations pour visualiser un réseau social ?
          </p>
          <input
            type="text"
            value={answers.exercise4}
            onChange={(e) => setAnswers({ ...answers, exercise4: e.target.value })}
            placeholder="Nom de l'outil"
            disabled={progress.exercise4}
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "15px",
              background: colors.bgPrimary,
              border: `1px solid ${colors.border}`,
              borderRadius: "6px",
              color: colors.textPrimary,
              fontSize: "1rem",
            }}
          />
          <button
            onClick={() => checkAnswer("exercise4", "gephi", answers.exercise4)}
            disabled={progress.exercise4}
            style={{
              padding: "10px 20px",
              background: progress.exercise4 ? "#4ade80" : colors.accent,
              color: colors.bgPrimary,
              border: "none",
              borderRadius: "6px",
              cursor: progress.exercise4 ? "not-allowed" : "pointer",
              fontWeight: "bold",
            }}
          >
            {progress.exercise4 ? "✅ Validé" : "Vérifier"}
          </button>
        </div>
      </div>

      {/* Section 5 : Éthique et légalité */}
      <div style={{ background: colors.bgPrimary, border: `1px solid ${colors.border}`, borderRadius: "12px", padding: "30px", marginBottom: "30px" }}>
        <h3 style={{ color: colors.accent, fontSize: "1.6rem", marginBottom: "20px" }}>
          5️⃣ Considérations éthiques et légales
        </h3>
        
        <div style={{ marginBottom: "25px" }}>
          <h4 style={{ color: colors.textPrimary, fontSize: "1.2rem", marginBottom: "15px" }}>
            ⚖️ Cadre légal
          </h4>
          <ul style={{ color: colors.textSecondary, lineHeight: "1.8", paddingLeft: "20px" }}>
            <li><strong>RGPD :</strong> Respecter la vie privée et les données personnelles</li>
            <li><strong>Conditions d'utilisation Instagram :</strong> Pas de scraping automatisé massif</li>
            <li><strong>Droit à l'image :</strong> Ne pas réutiliser les photos sans autorisation</li>
            <li><strong>Contexte professionnel :</strong> Investigation légale uniquement</li>
          </ul>
        </div>

        <div style={{ marginBottom: "25px" }}>
          <h4 style={{ color: colors.textPrimary, fontSize: "1.2rem", marginBottom: "15px" }}>
            🛡️ Bonnes pratiques
          </h4>
          <ul style={{ color: colors.textSecondary, lineHeight: "1.8", paddingLeft: "20px" }}>
            <li><strong>Comptes publics uniquement :</strong> Ne jamais tenter d'accéder à des comptes privés</li>
            <li><strong>Documentation :</strong> Capturer et horodater toutes les preuves</li>
            <li><strong>Anonymat :</strong> Utiliser des comptes OSINT dédiés, jamais personnels</li>
            <li><strong>Proportionnalité :</strong> Limiter la collecte au strict nécessaire</li>
          </ul>
        </div>

        {/* Exercise 5 */}
        <div style={{ background: colors.bgSecondary, padding: "20px", borderRadius: "8px", border: progress.exercise5 ? `2px solid ${colors.accent}` : `1px solid ${colors.border}` }}>
          <h4 style={{ color: colors.accent, marginBottom: "15px" }}>
            {progress.exercise5 ? "✅" : "📝"} Exercice 5 : Éthique OSINT
          </h4>
          <p style={{ color: colors.textPrimary, marginBottom: "15px" }}>
            Quelle réglementation européenne protège les données personnelles et doit être respectée lors d'investigations OSINT ?
          </p>
          <input
            type="text"
            value={answers.exercise5}
            onChange={(e) => setAnswers({ ...answers, exercise5: e.target.value })}
            placeholder="Nom de la réglementation (sigle)"
            disabled={progress.exercise5}
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "15px",
              background: colors.bgPrimary,
              border: `1px solid ${colors.border}`,
              borderRadius: "6px",
              color: colors.textPrimary,
              fontSize: "1rem",
            }}
          />
          <button
            onClick={() => checkAnswer("exercise5", "rgpd", answers.exercise5)}
            disabled={progress.exercise5}
            style={{
              padding: "10px 20px",
              background: progress.exercise5 ? "#4ade80" : colors.accent,
              color: colors.bgPrimary,
              border: "none",
              borderRadius: "6px",
              cursor: progress.exercise5 ? "not-allowed" : "pointer",
              fontWeight: "bold",
            }}
          >
            {progress.exercise5 ? "✅ Validé" : "Vérifier"}
          </button>
        </div>
      </div>

      {/* ===== SECTION QUIZ ===== */}
      <div style={{ background: colors.bgPrimary, border: `2px solid ${colors.accent}`, borderRadius: "12px", padding: "30px", marginBottom: "30px" }}>
        <h3 style={{ color: colors.accent, fontSize: "1.6rem", marginBottom: "10px" }}>
          🎯 Quiz de validation — Instagram OSINT
        </h3>
        <p style={{ color: colors.textSecondary, marginBottom: "25px" }}>
          5 questions — Obtenez 4/5 ou plus pour débloquer le badge du module.
        </p>
        {localStorage.getItem(QUIZ_BADGE_KEY) === "true" && (
          <div style={{ marginBottom: "20px", display: "inline-block", padding: "8px 20px", background: colors.accent + "20", border: `2px solid ${colors.accent}`, borderRadius: "20px", color: colors.accent, fontWeight: "600" }}>
            ✓ Badge débloqué
          </div>
        )}
        {quizQuestions.map((q, index) => (
          <div key={q.id} style={{ background: colors.bgSecondary, padding: "20px", borderRadius: "12px", marginBottom: "20px" }}>
            <h4 style={{ color: colors.textPrimary, fontSize: "1.05rem", marginBottom: "15px" }}>
              {index + 1}. {q.question}
            </h4>
            {q.options.map((option, optIndex) => (
              <label key={optIndex} style={{ display: "block", padding: "12px", marginBottom: "8px", background: quizAnswers[q.id] === optIndex.toString() ? colors.accent + "30" : colors.bgPrimary, border: `2px solid ${quizAnswers[q.id] === optIndex.toString() ? colors.accent : colors.border}`, borderRadius: "8px", cursor: showQuizResults ? "default" : "pointer" }}>
                <input
                  type="radio"
                  name={`instagram-q-${q.id}`}
                  value={optIndex}
                  checked={quizAnswers[q.id] === optIndex.toString()}
                  disabled={showQuizResults}
                  onChange={(e) => setQuizAnswers({ ...quizAnswers, [q.id]: e.target.value })}
                  style={{ marginRight: "10px" }}
                />
                <span style={{ color: colors.textPrimary }}>{option}</span>
                {showQuizResults && optIndex === q.correct && <span style={{ marginLeft: "10px", color: "#10b981", fontWeight: "bold" }}>✓</span>}
                {showQuizResults && quizAnswers[q.id] === optIndex.toString() && optIndex !== q.correct && <span style={{ marginLeft: "10px", color: "#ef4444", fontWeight: "bold" }}>✗</span>}
              </label>
            ))}
          </div>
        ))}
        <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
          {!showQuizResults && (
            <button
              onClick={handleQuizSubmit}
              disabled={Object.keys(quizAnswers).length !== quizQuestions.length}
              style={{ padding: "14px 35px", background: Object.keys(quizAnswers).length === quizQuestions.length ? colors.accent : colors.border, color: "#020617", border: "none", borderRadius: "8px", fontSize: "1rem", fontWeight: "600", cursor: Object.keys(quizAnswers).length === quizQuestions.length ? "pointer" : "not-allowed" }}
            >
              Valider le quiz
            </button>
          )}
          <button
            onClick={() => setShowQuizResetModal(true)}
            style={{ padding: "14px 35px", background: "#0b0f1a", color: "#00ff9c", border: "2px solid #00ff9c", borderRadius: "8px", fontSize: "1rem", fontWeight: "600", cursor: "pointer" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#00ff9c"; e.currentTarget.style.color = "#0b0f1a"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "#0b0f1a"; e.currentTarget.style.color = "#00ff9c"; }}
          >
            🔄 Reset quiz
          </button>
        </div>
        {showQuizResults && (
          <div style={{ marginTop: "25px", padding: "20px", background: getQuizScore() >= 4 ? colors.accent + "20" : "#ef444420", border: `2px solid ${getQuizScore() >= 4 ? colors.accent : "#ef4444"}`, borderRadius: "12px" }}>
            <h4 style={{ color: getQuizScore() >= 4 ? colors.accent : "#ef4444", fontSize: "1.3rem", marginBottom: "8px" }}>
              {getQuizScore() >= 4 ? "✅ Quiz validé !" : "❌ Score insuffisant"}
            </h4>
            <p style={{ color: colors.textPrimary, fontSize: "1.1rem", margin: 0 }}>
              Score : {getQuizScore()}/{quizQuestions.length} — {getQuizScore() >= 4 ? "Badge débloqué 🎉" : "4/5 requis pour le badge. Réinitialisez et réessayez."}
            </p>
          </div>
        )}
      </div>

      {/* Modal reset quiz */}
      {showQuizResetModal && (
        <>
          <div onClick={() => setShowQuizResetModal(false)} style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.8)", zIndex: 9998 }} />
          <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", background: "#0b0f1a", border: "3px solid #00ff9c", borderRadius: "12px", padding: "40px", maxWidth: "500px", width: "90%", zIndex: 9999 }}>
            <h3 style={{ color: "#00ff9c", fontSize: "1.5rem", marginBottom: "15px", textAlign: "center" }}>⚠️ Réinitialiser le quiz</h3>
            <p style={{ color: "#9ca3af", marginBottom: "30px", textAlign: "center" }}>Toutes vos réponses et le badge seront effacés.</p>
            <div style={{ display: "flex", gap: "15px", justifyContent: "center" }}>
              <button onClick={() => setShowQuizResetModal(false)} style={{ padding: "12px 30px", background: "transparent", color: "#9ca3af", border: "2px solid #2a3f3f", borderRadius: "8px", cursor: "pointer" }}>Annuler</button>
              <button onClick={handleQuizReset} style={{ padding: "12px 30px", background: "#00ff9c", color: "#0b0f1a", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" }}>Confirmer</button>
            </div>
          </div>
        </>
      )}

      {/* Ressources */}
      <div style={{ background: colors.bgSecondary, padding: "30px", borderRadius: "12px", border: `1px solid ${colors.border}` }}>
        <h3 style={{ color: colors.accent, fontSize: "1.6rem", marginBottom: "20px" }}>
          📚 Ressources complémentaires
        </h3>
        <ul style={{ color: colors.textSecondary, lineHeight: "1.8", paddingLeft: "20px" }}>
          <li><strong>IntelTechniques (Michael Bazzell) :</strong> Guides OSINT Instagram</li>
          <li><strong>OSINT Framework :</strong> Liste d'outils pour réseaux sociaux</li>
          <li><strong>Bellingcat :</strong> Cas d'études d'investigations Instagram</li>
          <li><strong>Social-Searcher :</strong> Monitoring de mots-clés sur réseaux sociaux</li>
        </ul>
      </div>

    </main>
  );
}

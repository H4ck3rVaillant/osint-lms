import { useState, useEffect } from "react";
import { useThemeColors } from "../context/ThemeContext";
import { useAuth } from "../auth/AuthContext";

export default function TikTokOSINT() {
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
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/progression/tiktok-osint`, {
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
      await fetch(`${import.meta.env.VITE_API_URL}/api/progression/tiktok-osint`, {
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
        await fetch(`${import.meta.env.VITE_API_URL}/api/progression/tiktok-osint`, {
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
  const QUIZ_BADGE_KEY = "badge_module_tiktok";
  const QUIZ_ANSWERS_KEY = "quiz_answers_tiktok_module";
  const QUIZ_RESULTS_KEY = "quiz_results_tiktok_module";

  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>(() => {
    const saved = localStorage.getItem(QUIZ_ANSWERS_KEY);
    return saved ? JSON.parse(saved) : {};
  });
  const [showQuizResults, setShowQuizResults] = useState<boolean>(() => {
    return localStorage.getItem(QUIZ_RESULTS_KEY) === "true";
  });
  const [showQuizResetModal, setShowQuizResetModal] = useState(false);

  const quizQuestions = [
    { id: 1, question: "Combien TikTok compte-t-il d'utilisateurs actifs ?", options: ["500 millions", "1 milliard", "2 milliards", "750 millions"], correct: 1 },
    { id: 2, question: "Quelle URL permet d'accéder au profil TikTok de l'utilisateur 'osint_pro' ?", options: ["tiktok.com/osint_pro", "tiktok.com/user/osint_pro", "tiktok.com/@osint_pro", "tiktok.com/profile/osint_pro"], correct: 2 },
    { id: 3, question: "Quel outil européen permet de vérifier l'authenticité d'une vidéo TikTok ?", options: ["TikBuddy", "Maverick", "InVID", "Exolyt"], correct: 2 },
    { id: 4, question: "Quelle URL permet de voir toutes les vidéos du hashtag #osint sur TikTok ?", options: ["tiktok.com/search/osint", "tiktok.com/tag/osint", "tiktok.com/#osint", "tiktok.com/hashtag/osint"], correct: 1 },
    { id: 5, question: "À partir de quel âge un utilisateur est-il considéré comme majeur selon le RGPD ?", options: ["16 ans", "21 ans", "15 ans", "18 ans"], correct: 3 },
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
          🎵 TikTok OSINT
        </h1>
        <p style={{ color: colors.textSecondary, fontSize: "1.2rem", lineHeight: "1.6" }}>
          Techniques d'investigation sur TikTok pour l'OSINT
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
          🎯 Introduction à l'OSINT TikTok
        </h2>
        <p style={{ color: colors.textPrimary, lineHeight: "1.8", marginBottom: "15px" }}>
          TikTok compte plus d'<strong>1 milliard d'utilisateurs actifs</strong> et génère des millions de vidéos quotidiennes. 
          Les métadonnées, géolocalisations, sons et hashtags offrent des opportunités uniques pour l'OSINT.
        </p>
        <p style={{ color: colors.textPrimary, lineHeight: "1.8" }}>
          Ce module vous apprendra à exploiter TikTok pour collecter des informations tout en respectant la vie privée des utilisateurs.
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
            <li><strong>Recherche par @username :</strong> tiktok.com/@username</li>
            <li><strong>Recherche par hashtag :</strong> tiktok.com/tag/[hashtag]</li>
            <li><strong>Recherche par son :</strong> Identifier des vidéos utilisant le même audio</li>
            <li><strong>Outils tiers :</strong> TikTok Downloader, Maverick, Snaptik</li>
          </ul>
        </div>

        <div style={{ marginBottom: "25px" }}>
          <h4 style={{ color: colors.textPrimary, fontSize: "1.2rem", marginBottom: "15px" }}>
            📊 Analyse d'un profil TikTok
          </h4>
          <ul style={{ color: colors.textSecondary, lineHeight: "1.8", paddingLeft: "20px" }}>
            <li><strong>Bio et liens :</strong> Description, site web, réseaux sociaux</li>
            <li><strong>Statistiques :</strong> Followers, Following, Likes totaux</li>
            <li><strong>Vidéos :</strong> Contenu publié, fréquence, thèmes récurrents</li>
            <li><strong>Interactions :</strong> Comptes likés, commentaires, duos/stitches</li>
            <li><strong>Favoris :</strong> Vidéos et sons sauvegardés (si publics)</li>
          </ul>
        </div>

        {/* Exercise 1 */}
        <div style={{ background: colors.bgSecondary, padding: "20px", borderRadius: "8px", border: progress.exercise1 ? `2px solid ${colors.accent}` : `1px solid ${colors.border}` }}>
          <h4 style={{ color: colors.accent, marginBottom: "15px" }}>
            {progress.exercise1 ? "✅" : "📝"} Exercice 1 : URL de profil
          </h4>
          <p style={{ color: colors.textPrimary, marginBottom: "15px" }}>
            Quelle est la structure d'URL pour accéder au profil TikTok de l'utilisateur "osint_pro" ? (format: tiktok.com/...)
          </p>
          <input
            type="text"
            value={answers.exercise1}
            onChange={(e) => setAnswers({ ...answers, exercise1: e.target.value })}
            placeholder="tiktok.com/..."
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
            onClick={() => checkAnswer("exercise1", "tiktok.com/@osint_pro", answers.exercise1)}
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

      {/* Section 2 : Analyse de vidéos */}
      <div style={{ background: colors.bgPrimary, border: `1px solid ${colors.border}`, borderRadius: "12px", padding: "30px", marginBottom: "30px" }}>
        <h3 style={{ color: colors.accent, fontSize: "1.6rem", marginBottom: "20px" }}>
          2️⃣ Analyse et téléchargement de vidéos
        </h3>
        
        <div style={{ marginBottom: "25px" }}>
          <h4 style={{ color: colors.textPrimary, fontSize: "1.2rem", marginBottom: "15px" }}>
            🎥 Extraction de métadonnées vidéo
          </h4>
          <ul style={{ color: colors.textSecondary, lineHeight: "1.8", paddingLeft: "20px" }}>
            <li><strong>Date de publication :</strong> Horodatage précis de la vidéo</li>
            <li><strong>Localisation :</strong> Lieu tagué si ajouté par le créateur</li>
            <li><strong>Musique/Son :</strong> Identifier l'audio original ou utilisé</li>
            <li><strong>Hashtags :</strong> Tags associés à la vidéo</li>
            <li><strong>Engagement :</strong> Likes, commentaires, partages, vues</li>
          </ul>
        </div>

        <div style={{ marginBottom: "25px" }}>
          <h4 style={{ color: colors.textPrimary, fontSize: "1.2rem", marginBottom: "15px" }}>
            💾 Outils de téléchargement et analyse
          </h4>
          <ul style={{ color: colors.textSecondary, lineHeight: "1.8", paddingLeft: "20px" }}>
            <li><strong>SnapTik :</strong> Téléchargement sans watermark</li>
            <li><strong>TikMate :</strong> Téléchargement vidéos et métadonnées</li>
            <li><strong>TikTok Scraper (Python) :</strong> Extraction automatisée</li>
            <li><strong>FFmpeg :</strong> Analyse frame par frame</li>
          </ul>
        </div>

        {/* Exercise 2 */}
        <div style={{ background: colors.bgSecondary, padding: "20px", borderRadius: "8px", border: progress.exercise2 ? `2px solid ${colors.accent}` : `1px solid ${colors.border}` }}>
          <h4 style={{ color: colors.accent, marginBottom: "15px" }}>
            {progress.exercise2 ? "✅" : "📝"} Exercice 2 : Téléchargement
          </h4>
          <p style={{ color: colors.textPrimary, marginBottom: "15px" }}>
            Quel outil open-source Python permet d'extraire automatiquement des vidéos TikTok avec métadonnées ?
          </p>
          <input
            type="text"
            value={answers.exercise2}
            onChange={(e) => setAnswers({ ...answers, exercise2: e.target.value })}
            placeholder="Nom de l'outil (2 mots)"
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
            onClick={() => checkAnswer("exercise2", "tiktok scraper", answers.exercise2)}
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
          3️⃣ Hashtags et analyse de tendances
        </h3>
        
        <div style={{ marginBottom: "25px" }}>
          <h4 style={{ color: colors.textPrimary, fontSize: "1.2rem", marginBottom: "15px" }}>
            #️⃣ Exploitation des hashtags
          </h4>
          <ul style={{ color: colors.textSecondary, lineHeight: "1.8", paddingLeft: "20px" }}>
            <li><strong>Recherche par hashtag :</strong> tiktok.com/tag/[hashtag]</li>
            <li><strong>Tendances virales :</strong> Identifier les challenges populaires</li>
            <li><strong>Hashtags géolocalisés :</strong> #ParisTravel, #TokyoFood</li>
            <li><strong>Analyse temporelle :</strong> Évolution d'un hashtag dans le temps</li>
          </ul>
        </div>

        <div style={{ marginBottom: "25px" }}>
          <h4 style={{ color: colors.textPrimary, fontSize: "1.2rem", marginBottom: "15px" }}>
            📈 Outils d'analyse de tendances
          </h4>
          <ul style={{ color: colors.textSecondary, lineHeight: "1.8", paddingLeft: "20px" }}>
            <li><strong>TikTok Creative Center :</strong> Statistiques officielles de trends</li>
            <li><strong>Exolyt :</strong> Analytics TikTok et tracking hashtags</li>
            <li><strong>Pentos :</strong> Analyse de performance de comptes</li>
            <li><strong>Social Blade :</strong> Croissance et statistiques</li>
          </ul>
        </div>

        {/* Exercise 3 */}
        <div style={{ background: colors.bgSecondary, padding: "20px", borderRadius: "8px", border: progress.exercise3 ? `2px solid ${colors.accent}` : `1px solid ${colors.border}` }}>
          <h4 style={{ color: colors.accent, marginBottom: "15px" }}>
            {progress.exercise3 ? "✅" : "📝"} Exercice 3 : Recherche hashtag
          </h4>
          <p style={{ color: colors.textPrimary, marginBottom: "15px" }}>
            Quelle URL permet de voir toutes les vidéos associées au hashtag #osint sur TikTok ? (format: tiktok.com/...)
          </p>
          <input
            type="text"
            value={answers.exercise3}
            onChange={(e) => setAnswers({ ...answers, exercise3: e.target.value })}
            placeholder="tiktok.com/..."
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
            onClick={() => checkAnswer("exercise3", "tiktok.com/tag/osint", answers.exercise3)}
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

      {/* Section 4 : Outils OSINT */}
      <div style={{ background: colors.bgPrimary, border: `1px solid ${colors.border}`, borderRadius: "12px", padding: "30px", marginBottom: "30px" }}>
        <h3 style={{ color: colors.accent, fontSize: "1.6rem", marginBottom: "20px" }}>
          4️⃣ Outils et techniques OSINT avancées
        </h3>
        
        <div style={{ marginBottom: "25px" }}>
          <h4 style={{ color: colors.textPrimary, fontSize: "1.2rem", marginBottom: "15px" }}>
            🛠️ Outils spécialisés TikTok
          </h4>
          <ul style={{ color: colors.textSecondary, lineHeight: "1.8", paddingLeft: "20px" }}>
            <li><strong>TikTok Scraper API :</strong> Extraction massive de données</li>
            <li><strong>Maverick :</strong> Analyse de profils et vidéos</li>
            <li><strong>InVID-WeVerify :</strong> Vérification de vidéos</li>
            <li><strong>TikBuddy :</strong> Statistiques et analytics</li>
          </ul>
        </div>

        <div style={{ marginBottom: "25px" }}>
          <h4 style={{ color: colors.textPrimary, fontSize: "1.2rem", marginBottom: "15px" }}>
            🔍 Techniques de vérification
          </h4>
          <ul style={{ color: colors.textSecondary, lineHeight: "1.8", paddingLeft: "20px" }}>
            <li><strong>Reverse Video Search :</strong> InVID, Google Images</li>
            <li><strong>Audio Identification :</strong> Shazam, ACRCloud</li>
            <li><strong>Analyse géographique :</strong> Cross-référencement avec Google Maps</li>
            <li><strong>Timeline reconstruction :</strong> Chronologie des publications</li>
          </ul>
        </div>

        {/* Exercise 4 */}
        <div style={{ background: colors.bgSecondary, padding: "20px", borderRadius: "8px", border: progress.exercise4 ? `2px solid ${colors.accent}` : `1px solid ${colors.border}` }}>
          <h4 style={{ color: colors.accent, marginBottom: "15px" }}>
            {progress.exercise4 ? "✅" : "📝"} Exercice 4 : Vérification vidéo
          </h4>
          <p style={{ color: colors.textPrimary, marginBottom: "15px" }}>
            Quel outil européen permet de vérifier l'authenticité d'une vidéo TikTok ? (1 mot)
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
            onClick={() => checkAnswer("exercise4", "invid", answers.exercise4)}
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

      {/* Section 5 : Éthique */}
      <div style={{ background: colors.bgPrimary, border: `1px solid ${colors.border}`, borderRadius: "12px", padding: "30px", marginBottom: "30px" }}>
        <h3 style={{ color: colors.accent, fontSize: "1.6rem", marginBottom: "20px" }}>
          5️⃣ Éthique et respect de la vie privée
        </h3>
        
        <div style={{ marginBottom: "25px" }}>
          <h4 style={{ color: colors.textPrimary, fontSize: "1.2rem", marginBottom: "15px" }}>
            ⚖️ Cadre légal
          </h4>
          <ul style={{ color: colors.textSecondary, lineHeight: "1.8", paddingLeft: "20px" }}>
            <li><strong>RGPD :</strong> Protection des données personnelles</li>
            <li><strong>CGU TikTok :</strong> Interdiction du scraping massif</li>
            <li><strong>Contenu public uniquement :</strong> Ne jamais tenter d'accéder à des comptes privés</li>
            <li><strong>Mineurs :</strong> Protection renforcée des utilisateurs de moins de 18 ans</li>
          </ul>
        </div>

        <div style={{ marginBottom: "25px" }}>
          <h4 style={{ color: colors.textPrimary, fontSize: "1.2rem", marginBottom: "15px" }}>
            🛡️ Bonnes pratiques
          </h4>
          <ul style={{ color: colors.textSecondary, lineHeight: "1.8", paddingLeft: "20px" }}>
            <li><strong>Comptes OSINT dédiés :</strong> Jamais de comptes personnels</li>
            <li><strong>Documentation :</strong> Screenshots horodatés</li>
            <li><strong>Respect des créateurs :</strong> Ne pas réutiliser de contenu sans autorisation</li>
            <li><strong>Proportionnalité :</strong> Limiter la collecte au strict nécessaire</li>
          </ul>
        </div>

        {/* Exercise 5 */}
        <div style={{ background: colors.bgSecondary, padding: "20px", borderRadius: "8px", border: progress.exercise5 ? `2px solid ${colors.accent}` : `1px solid ${colors.border}` }}>
          <h4 style={{ color: colors.accent, marginBottom: "15px" }}>
            {progress.exercise5 ? "✅" : "📝"} Exercice 5 : Protection des mineurs
          </h4>
          <p style={{ color: colors.textPrimary, marginBottom: "15px" }}>
            À partir de quel âge un utilisateur est-il considéré comme majeur en OSINT selon le RGPD ? (nombre en chiffres)
          </p>
          <input
            type="text"
            value={answers.exercise5}
            onChange={(e) => setAnswers({ ...answers, exercise5: e.target.value })}
            placeholder="Âge en chiffres"
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
            onClick={() => checkAnswer("exercise5", "18", answers.exercise5)}
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
          🎯 Quiz de validation — TikTok OSINT
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
                  name={`tiktok-q-${q.id}`}
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
          <li><strong>TikTok Creative Center :</strong> Statistiques officielles</li>
          <li><strong>Bellingcat :</strong> Guides de vérification vidéo</li>
          <li><strong>OSINT Framework :</strong> Outils TikTok OSINT</li>
          <li><strong>InVID-WeVerify :</strong> Plugin de vérification</li>
        </ul>
      </div>

    </main>
  );
}

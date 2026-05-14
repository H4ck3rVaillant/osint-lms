import { useState, useEffect } from "react";
import { useThemeColors } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

export default function FacebookOSINT() {
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
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/progression/facebook-osint`, {
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
      await fetch(`${import.meta.env.VITE_API_URL}/api/progression/facebook-osint`, {
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
        await fetch(`${import.meta.env.VITE_API_URL}/api/progression/facebook-osint`, {
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
  const QUIZ_BADGE_KEY = "badge_module_facebook";
  const QUIZ_ANSWERS_KEY = "quiz_answers_facebook_module";
  const QUIZ_RESULTS_KEY = "quiz_results_facebook_module";

  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>(() => {
    const saved = localStorage.getItem(QUIZ_ANSWERS_KEY);
    return saved ? JSON.parse(saved) : {};
  });
  const [showQuizResults, setShowQuizResults] = useState<boolean>(() => {
    return localStorage.getItem(QUIZ_RESULTS_KEY) === "true";
  });
  const [showQuizResetModal, setShowQuizResetModal] = useState(false);

  const quizQuestions = [
    { id: 1, question: "Combien d'utilisateurs actifs compte Facebook ?", options: ["1 milliard", "2 milliards", "3 milliards", "500 millions"], correct: 2 },
    { id: 2, question: "Quel outil Facebook permet de consulter toutes les publicités actives d'une page ?", options: ["Facebook Insights", "Bibliothèque publicitaire", "Graph Search", "Meta Business Suite"], correct: 1 },
    { id: 3, question: "Quelle fonctionnalité Facebook permet des recherches avancées par syntaxe spéciale ?", options: ["Facebook Explore", "Meta Search", "Graph Search", "Facebook Index"], correct: 2 },
    { id: 4, question: "Quel préfixe d'URL Facebook regroupe les publications liées à un lieu ?", options: ["facebook.com/location/", "facebook.com/places", "facebook.com/geo/", "facebook.com/checkin/"], correct: 1 },
    { id: 5, question: "Quel type de compte doit-on utiliser pour des investigations OSINT Facebook ?", options: ["Son compte personnel", "Un compte premium", "Un compte dédié", "Un compte entreprise"], correct: 2 },
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
          📘 Facebook OSINT
        </h1>
        <p style={{ color: colors.textSecondary, fontSize: "1.2rem", lineHeight: "1.6" }}>
          Techniques d'investigation sur Facebook pour l'OSINT
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
          🎯 Introduction à l'OSINT Facebook
        </h2>
        <p style={{ color: colors.textPrimary, lineHeight: "1.8", marginBottom: "15px" }}>
          Facebook reste le plus grand réseau social avec <strong>3 milliards d'utilisateurs actifs</strong>. Les profils, groupes, 
          pages publiques, événements et marketplace contiennent une mine d'informations pour l'OSINT.
        </p>
        <p style={{ color: colors.textPrimary, lineHeight: "1.8" }}>
          Ce module vous apprendra à exploiter Facebook efficacement tout en respectant les politiques de confidentialité.
        </p>
      </div>

      {/* Section 1 : Recherche de profils */}
      <div style={{ background: colors.bgPrimary, border: `1px solid ${colors.border}`, borderRadius: "12px", padding: "30px", marginBottom: "30px" }}>
        <h3 style={{ color: colors.accent, fontSize: "1.6rem", marginBottom: "20px" }}>
          1️⃣ Recherche et analyse de profils
        </h3>
        
        <div style={{ marginBottom: "25px" }}>
          <h4 style={{ color: colors.textPrimary, fontSize: "1.2rem", marginBottom: "15px" }}>
            🔍 Techniques de recherche avancées
          </h4>
          <ul style={{ color: colors.textSecondary, lineHeight: "1.8", paddingLeft: "20px" }}>
            <li><strong>Recherche par nom :</strong> Filtres ville, école, entreprise, amis mutuels</li>
            <li><strong>Graph Search :</strong> facebook.com/search/query (syntaxe avancée)</li>
            <li><strong>ID Facebook :</strong> facebook.com/[ID_numé Facebook :</strong> facebook.com/[ID_numérique] pour profils avec URL personnalisée</li>
            <li><strong>Outils tiers :</strong> IntelX, Sowdust Facebook Search, Lookup-ID</li>
          </ul>
        </div>

        <div style={{ marginBottom: "25px" }}>
          <h4 style={{ color: colors.textPrimary, fontSize: "1.2rem", marginBottom: "15px" }}>
            📊 Analyse d'un profil Facebook
          </h4>
          <ul style={{ color: colors.textSecondary, lineHeight: "1.8", paddingLeft: "20px" }}>
            <li><strong>Informations visibles :</strong> Emploi, formation, ville, relation</li>
            <li><strong>Liste d'amis :</strong> Réseau social, connexions professionnelles</li>
            <li><strong>Publications :</strong> Timeline, check-ins, photos/vidéos</li>
            <li><strong>Activité :</strong> Likes, commentaires, partages publics</li>
            <li><strong>Groupes et pages :</strong> Centres d'intérêt, affiliations</li>
          </ul>
        </div>

        {/* Exercise 1 */}
        <div style={{ background: colors.bgSecondary, padding: "20px", borderRadius: "8px", border: progress.exercise1 ? `2px solid ${colors.accent}` : `1px solid ${colors.border}` }}>
          <h4 style={{ color: colors.accent, marginBottom: "15px" }}>
            {progress.exercise1 ? "✅" : "📝"} Exercice 1 : ID Facebook
          </h4>
          <p style={{ color: colors.textPrimary, marginBottom: "15px" }}>
            Quelle URL permet de rechercher un profil Facebook en utilisant un ID numérique ? (format: facebook.com/...)
          </p>
          <input
            type="text"
            value={answers.exercise1}
            onChange={(e) => setAnswers({ ...answers, exercise1: e.target.value })}
            placeholder="facebook.com/..."
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
            onClick={() => checkAnswer("exercise1", "facebook.com/profile.php?id=", answers.exercise1)}
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

      {/* Section 2 : Groupes et Pages */}
      <div style={{ background: colors.bgPrimary, border: `1px solid ${colors.border}`, borderRadius: "12px", padding: "30px", marginBottom: "30px" }}>
        <h3 style={{ color: colors.accent, fontSize: "1.6rem", marginBottom: "20px" }}>
          2️⃣ Investigation de groupes et pages
        </h3>
        
        <div style={{ marginBottom: "25px" }}>
          <h4 style={{ color: colors.textPrimary, fontSize: "1.2rem", marginBottom: "15px" }}>
            👥 Recherche dans les groupes
          </h4>
          <ul style={{ color: colors.textSecondary, lineHeight: "1.8", paddingLeft: "20px" }}>
            <li><strong>Groupes publics :</strong> Accessibles sans être membre</li>
            <li><strong>Recherche de membres :</strong> Identifier qui participe à un groupe</li>
            <li><strong>Analyse de contenu :</strong> Discussions, fichiers partagés, événements</li>
            <li><strong>Graph Search :</strong> "Groups joined by [person]", "Groups about [topic]"</li>
          </ul>
        </div>

        <div style={{ marginBottom: "25px" }}>
          <h4 style={{ color: colors.textPrimary, fontSize: "1.2rem", marginBottom: "15px" }}>
            📄 Analyse de pages publiques
          </h4>
          <ul style={{ color: colors.textSecondary, lineHeight: "1.8", paddingLeft: "20px" }}>
            <li><strong>Informations page :</strong> Administrateurs, création, catégorie</li>
            <li><strong>Engagement :</strong> Likes, partages, commentaires</li>
            <li><strong>Transparence :</strong> Historique des changements de nom</li>
            <li><strong>Publicités :</strong> Bibliothèque publicitaire Facebook</li>
          </ul>
        </div>

        {/* Exercise 2 */}
        <div style={{ background: colors.bgSecondary, padding: "20px", borderRadius: "8px", border: progress.exercise2 ? `2px solid ${colors.accent}` : `1px solid ${colors.border}` }}>
          <h4 style={{ color: colors.accent, marginBottom: "15px" }}>
            {progress.exercise2 ? "✅" : "📝"} Exercice 2 : Transparence des pages
          </h4>
          <p style={{ color: colors.textPrimary, marginBottom: "15px" }}>
            Quel outil Facebook permet de consulter toutes les publicités actives d'une page ?
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
            onClick={() => checkAnswer("exercise2", "bibliothèque publicitaire", answers.exercise2)}
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

      {/* Section 3 : Géolocalisation */}
      <div style={{ background: colors.bgPrimary, border: `1px solid ${colors.border}`, borderRadius: "12px", padding: "30px", marginBottom: "30px" }}>
        <h3 style={{ color: colors.accent, fontSize: "1.6rem", marginBottom: "20px" }}>
          3️⃣ Exploitation de la géolocalisation
        </h3>
        
        <div style={{ marginBottom: "25px" }}>
          <h4 style={{ color: colors.textPrimary, fontSize: "1.2rem", marginBottom: "15px" }}>
            📍 Check-ins et lieux
          </h4>
          <ul style={{ color: colors.textSecondary, lineHeight: "1.8", paddingLeft: "20px" }}>
            <li><strong>Recherche par lieu :</strong> facebook.com/places/[lieu]</li>
            <li><strong>Check-ins publics :</strong> Personnes ayant visité un lieu</li>
            <li><strong>Événements géolocalisés :</strong> Concerts, manifestations, rassemblements</li>
            <li><strong>Photos géolocalisées :</strong> Métadonnées de localisation</li>
          </ul>
        </div>

        <div style={{ marginBottom: "25px" }}>
          <h4 style={{ color: colors.textPrimary, fontSize: "1.2rem", marginBottom: "15px" }}>
            🗺️ Techniques de géolocalisation
          </h4>
          <ul style={{ color: colors.textSecondary, lineHeight: "1.8", paddingLeft: "20px" }}>
            <li><strong>Graph Search :</strong> "Photos taken at [location]"</li>
            <li><strong>Marketplace :</strong> Articles vendus dans une zone géographique</li>
            <li><strong>Événements :</strong> Recherche d'événements par ville</li>
            <li><strong>Cross-référencement :</strong> Combiner avec Google Maps</li>
          </ul>
        </div>

        {/* Exercise 3 */}
        <div style={{ background: colors.bgSecondary, padding: "20px", borderRadius: "8px", border: progress.exercise3 ? `2px solid ${colors.accent}` : `1px solid ${colors.border}` }}>
          <h4 style={{ color: colors.accent, marginBottom: "15px" }}>
            {progress.exercise3 ? "✅" : "📝"} Exercice 3 : Recherche par lieu
          </h4>
          <p style={{ color: colors.textPrimary, marginBottom: "15px" }}>
            Quel préfixe d'URL Facebook permet de rechercher toutes les publications liées à un lieu ? (format: facebook.com/...)
          </p>
          <input
            type="text"
            value={answers.exercise3}
            onChange={(e) => setAnswers({ ...answers, exercise3: e.target.value })}
            placeholder="facebook.com/..."
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
            onClick={() => checkAnswer("exercise3", "facebook.com/places", answers.exercise3)}
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

      {/* Section 4 : Outils OSINT Facebook */}
      <div style={{ background: colors.bgPrimary, border: `1px solid ${colors.border}`, borderRadius: "12px", padding: "30px", marginBottom: "30px" }}>
        <h3 style={{ color: colors.accent, fontSize: "1.6rem", marginBottom: "20px" }}>
          4️⃣ Outils et techniques avancées
        </h3>
        
        <div style={{ marginBottom: "25px" }}>
          <h4 style={{ color: colors.textPrimary, fontSize: "1.2rem", marginBottom: "15px" }}>
            🛠️ Outils OSINT spécialisés
          </h4>
          <ul style={{ color: colors.textSecondary, lineHeight: "1.8", paddingLeft: "20px" }}>
            <li><strong>IntelX :</strong> Archivage et recherche de profils supprimés</li>
            <li><strong>Sowdust Search Tool :</strong> Graph Search avancé</li>
            <li><strong>Who Posted What :</strong> Recherche par mots-clés et dates</li>
            <li><strong>Lookup-ID.com :</strong> Conversion nom → ID Facebook</li>
          </ul>
        </div>

        <div style={{ marginBottom: "25px" }}>
          <h4 style={{ color: colors.textPrimary, fontSize: "1.2rem", marginBottom: "15px" }}>
            🔍 Graph Search (recherches avancées)
          </h4>
          <ul style={{ color: colors.textSecondary, lineHeight: "1.8", paddingLeft: "20px" }}>
            <li><strong>Photos :</strong> "Photos of [person]", "Photos liked by [person]"</li>
            <li><strong>Connexions :</strong> "Friends of [person] who work at [company]"</li>
            <li><strong>Activité :</strong> "Posts commented on by [person]"</li>
            <li><strong>Localisation :</strong> "People who live in [city] and work at [company]"</li>
          </ul>
        </div>

        {/* Exercise 4 */}
        <div style={{ background: colors.bgSecondary, padding: "20px", borderRadius: "8px", border: progress.exercise4 ? `2px solid ${colors.accent}` : `1px solid ${colors.border}` }}>
          <h4 style={{ color: colors.accent, marginBottom: "15px" }}>
            {progress.exercise4 ? "✅" : "📝"} Exercice 4 : Graph Search
          </h4>
          <p style={{ color: colors.textPrimary, marginBottom: "15px" }}>
            Quelle fonctionnalité Facebook permet des recherches avancées avec syntaxe spéciale ? (2 mots en anglais)
          </p>
          <input
            type="text"
            value={answers.exercise4}
            onChange={(e) => setAnswers({ ...answers, exercise4: e.target.value })}
            placeholder="Nom de la fonctionnalité"
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
            onClick={() => checkAnswer("exercise4", "graph search", answers.exercise4)}
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
          5️⃣ Éthique et limites légales
        </h3>
        
        <div style={{ marginBottom: "25px" }}>
          <h4 style={{ color: colors.textPrimary, fontSize: "1.2rem", marginBottom: "15px" }}>
            ⚖️ Cadre légal
          </h4>
          <ul style={{ color: colors.textSecondary, lineHeight: "1.8", paddingLeft: "20px" }}>
            <li><strong>RGPD :</strong> Respect des données personnelles</li>
            <li><strong>CGU Facebook :</strong> Interdiction du scraping automatisé massif</li>
            <li><strong>Données publiques uniquement :</strong> Ne jamais tenter d'accéder à des comptes privés</li>
            <li><strong>Contexte professionnel :</strong> Investigation légale uniquement</li>
          </ul>
        </div>

        <div style={{ marginBottom: "25px" }}>
          <h4 style={{ color: colors.textPrimary, fontSize: "1.2rem", marginBottom: "15px" }}>
            🛡️ Bonnes pratiques OSINT
          </h4>
          <ul style={{ color: colors.textSecondary, lineHeight: "1.8", paddingLeft: "20px" }}>
            <li><strong>Comptes dédiés :</strong> Utiliser des profils OSINT, jamais personnels</li>
            <li><strong>Documentation :</strong> Screenshots horodatés de toutes les preuves</li>
            <li><strong>Respect de la vie privée :</strong> Proportionnalité de l'investigation</li>
            <li><strong>Transparence :</strong> Cadre légal clair pour l'investigation</li>
          </ul>
        </div>

        {/* Exercise 5 */}
        <div style={{ background: colors.bgSecondary, padding: "20px", borderRadius: "8px", border: progress.exercise5 ? `2px solid ${colors.accent}` : `1px solid ${colors.border}` }}>
          <h4 style={{ color: colors.accent, marginBottom: "15px" }}>
            {progress.exercise5 ? "✅" : "📝"} Exercice 5 : Bonnes pratiques
          </h4>
          <p style={{ color: colors.textPrimary, marginBottom: "15px" }}>
            Quel type de compte Facebook doit-on utiliser pour des investigations OSINT ? (1 mot)
          </p>
          <input
            type="text"
            value={answers.exercise5}
            onChange={(e) => setAnswers({ ...answers, exercise5: e.target.value })}
            placeholder="Type de compte"
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
            onClick={() => checkAnswer("exercise5", "dédié", answers.exercise5)}
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
          🎯 Quiz de validation — Facebook OSINT
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
                  name={`facebook-q-${q.id}`}
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
          <li><strong>IntelTechniques :</strong> Guides OSINT Facebook</li>
          <li><strong>Bellingcat :</strong> Études de cas investigations Facebook</li>
          <li><strong>Sowdust Tools :</strong> Outils Graph Search</li>
          <li><strong>Who Posted What :</strong> Recherche temporelle sur Facebook</li>
        </ul>
      </div>

    </main>
  );
}

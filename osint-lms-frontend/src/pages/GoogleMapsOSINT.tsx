import { useState, useEffect } from "react";
import { useThemeColors } from "../context/ThemeContext";
import { useAuth } from "../auth/AuthContext";

export default function GoogleMapsOSINT() {
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
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/progression/googlemaps-osint`, {
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
      await fetch(`${import.meta.env.VITE_API_URL}/api/progression/googlemaps-osint`, {
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
        await fetch(`${import.meta.env.VITE_API_URL}/api/progression/googlemaps-osint`, {
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
  const QUIZ_BADGE_KEY = "badge_module_googlemaps";
  const QUIZ_ANSWERS_KEY = "quiz_answers_googlemaps_module";
  const QUIZ_RESULTS_KEY = "quiz_results_googlemaps_module";

  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>(() => {
    const saved = localStorage.getItem(QUIZ_ANSWERS_KEY);
    return saved ? JSON.parse(saved) : {};
  });
  const [showQuizResults, setShowQuizResults] = useState<boolean>(() => {
    return localStorage.getItem(QUIZ_RESULTS_KEY) === "true";
  });
  const [showQuizResetModal, setShowQuizResetModal] = useState(false);

  const quizQuestions = [
    { id: 1, question: "Quel format de coordonnées GPS utilise deux valeurs décimales ?", options: ["DMS (Degrés Minutes Secondes)", "What3Words", "Plus Codes", "Latitude Longitude"], correct: 3 },
    { id: 2, question: "Quelle fonctionnalité Street View permet de voir l'évolution temporelle d'un lieu ?", options: ["Panorama", "Timeline", "History", "Replay"], correct: 1 },
    { id: 3, question: "Quel service utilise 3 mots simples pour identifier un lieu précis au monde ?", options: ["Plus Codes", "GPS Visualizer", "What3Words", "GeoGuessr"], correct: 2 },
    { id: 4, question: "Quel service Google permet d'exporter toutes ses données de localisation personnelles ?", options: ["Google Drive", "Google Takeout", "Google Maps Export", "Google Timeline"], correct: 1 },
    { id: 5, question: "Quelle réglementation européenne protège les données de géolocalisation ?", options: ["NIS2", "DORA", "LPM", "RGPD"], correct: 3 },
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
          🗺️ Google Maps OSINT
        </h1>
        <p style={{ color: colors.textSecondary, fontSize: "1.2rem", lineHeight: "1.6" }}>
          Techniques de géolocalisation et investigation avec Google Maps
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
          🎯 Introduction à l'OSINT Google Maps
        </h2>
        <p style={{ color: colors.textPrimary, lineHeight: "1.8", marginBottom: "15px" }}>
          Google Maps est l'outil de géolocalisation le plus puissant pour l'OSINT. Avec <strong>Street View</strong>, les images satellites, 
          les avis utilisateurs et les coordonnées GPS, il permet des investigations géographiques précises.
        </p>
        <p style={{ color: colors.textPrimary, lineHeight: "1.8" }}>
          Ce module vous apprendra à exploiter Google Maps pour identifier des lieux, vérifier des informations et reconstituer des déplacements.
        </p>
      </div>

      {/* Section 1 : Recherche de lieux */}
      <div style={{ background: colors.bgPrimary, border: `1px solid ${colors.border}`, borderRadius: "12px", padding: "30px", marginBottom: "30px" }}>
        <h3 style={{ color: colors.accent, fontSize: "1.6rem", marginBottom: "20px" }}>
          1️⃣ Recherche et identification de lieux
        </h3>
        
        <div style={{ marginBottom: "25px" }}>
          <h4 style={{ color: colors.textPrimary, fontSize: "1.2rem", marginBottom: "15px" }}>
            🔍 Techniques de recherche
          </h4>
          <ul style={{ color: colors.textSecondary, lineHeight: "1.8", paddingLeft: "20px" }}>
            <li><strong>Recherche par nom :</strong> Restaurants, hôtels, monuments</li>
            <li><strong>Recherche par adresse :</strong> Localisation précise</li>
            <li><strong>Recherche par coordonnées GPS :</strong> Latitude, Longitude</li>
            <li><strong>Recherche visuelle :</strong> Identifier un lieu à partir d'une photo</li>
          </ul>
        </div>

        <div style={{ marginBottom: "25px" }}>
          <h4 style={{ color: colors.textPrimary, fontSize: "1.2rem", marginBottom: "15px" }}>
            📊 Informations exploitables
          </h4>
          <ul style={{ color: colors.textSecondary, lineHeight: "1.8", paddingLeft: "20px" }}>
            <li><strong>Avis utilisateurs :</strong> Commentaires, photos, dates de visite</li>
            <li><strong>Horaires d'affluence :</strong> Fréquentation par heure et jour</li>
            <li><strong>Photos géolocalisées :</strong> Images contribuées par les utilisateurs</li>
            <li><strong>Établissements similaires :</strong> Lieux à proximité</li>
          </ul>
        </div>

        {/* Exercise 1 */}
        <div style={{ background: colors.bgSecondary, padding: "20px", borderRadius: "8px", border: progress.exercise1 ? `2px solid ${colors.accent}` : `1px solid ${colors.border}` }}>
          <h4 style={{ color: colors.accent, marginBottom: "15px" }}>
            {progress.exercise1 ? "✅" : "📝"} Exercice 1 : Coordonnées GPS
          </h4>
          <p style={{ color: colors.textPrimary, marginBottom: "15px" }}>
            Quel format de coordonnées GPS Google Maps accepte-t-il ? (exemple: XX.XXXX, YY.YYYY)
          </p>
          <input
            type="text"
            value={answers.exercise1}
            onChange={(e) => setAnswers({ ...answers, exercise1: e.target.value })}
            placeholder="Format (2 mots)"
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
            onClick={() => checkAnswer("exercise1", "latitude longitude", answers.exercise1)}
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

      {/* Section 2 : Street View */}
      <div style={{ background: colors.bgPrimary, border: `1px solid ${colors.border}`, borderRadius: "12px", padding: "30px", marginBottom: "30px" }}>
        <h3 style={{ color: colors.accent, fontSize: "1.6rem", marginBottom: "20px" }}>
          2️⃣ Exploitation de Street View
        </h3>
        
        <div style={{ marginBottom: "25px" }}>
          <h4 style={{ color: colors.textPrimary, fontSize: "1.2rem", marginBottom: "15px" }}>
            👁️ Utilisation de Street View
          </h4>
          <ul style={{ color: colors.textSecondary, lineHeight: "1.8", paddingLeft: "20px" }}>
            <li><strong>Navigation 360° :</strong> Explorer virtuellement un lieu</li>
            <li><strong>Historique temporel :</strong> Voir l'évolution d'un lieu dans le temps</li>
            <li><strong>Zoom et détails :</strong> Identifier plaques, enseignes, panneaux</li>
            <li><strong>Angles multiples :</strong> Changer de perspective pour plus d'infos</li>
          </ul>
        </div>

        <div style={{ marginBottom: "25px" }}>
          <h4 style={{ color: colors.textPrimary, fontSize: "1.2rem", marginBottom: "15px" }}>
            🕰️ Analyse temporelle avec Street View
          </h4>
          <ul style={{ color: colors.textSecondary, lineHeight: "1.8", paddingLeft: "20px" }}>
            <li><strong>Historique des images :</strong> Cliquer sur l'horloge en haut à gauche</li>
            <li><strong>Comparaison temporelle :</strong> Identifier des changements</li>
            <li><strong>Date de capture :</strong> Métadonnées temporelles des photos</li>
            <li><strong>Reconstruction timeline :</strong> Chronologie des modifications</li>
          </ul>
        </div>

        {/* Exercise 2 */}
        <div style={{ background: colors.bgSecondary, padding: "20px", borderRadius: "8px", border: progress.exercise2 ? `2px solid ${colors.accent}` : `1px solid ${colors.border}` }}>
          <h4 style={{ color: colors.accent, marginBottom: "15px" }}>
            {progress.exercise2 ? "✅" : "📝"} Exercice 2 : Street View
          </h4>
          <p style={{ color: colors.textPrimary, marginBottom: "15px" }}>
            Quelle fonctionnalité Street View permet de voir l'évolution temporelle d'un lieu ? (1 mot anglais)
          </p>
          <input
            type="text"
            value={answers.exercise2}
            onChange={(e) => setAnswers({ ...answers, exercise2: e.target.value })}
            placeholder="Fonctionnalité"
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
            onClick={() => checkAnswer("exercise2", "timeline", answers.exercise2)}
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

      {/* Section 3 : Coordonnées GPS */}
      <div style={{ background: colors.bgPrimary, border: `1px solid ${colors.border}`, borderRadius: "12px", padding: "30px", marginBottom: "30px" }}>
        <h3 style={{ color: colors.accent, fontSize: "1.6rem", marginBottom: "20px" }}>
          3️⃣ Exploitation des coordonnées GPS
        </h3>
        
        <div style={{ marginBottom: "25px" }}>
          <h4 style={{ color: colors.textPrimary, fontSize: "1.2rem", marginBottom: "15px" }}>
            📍 Formats de coordonnées
          </h4>
          <ul style={{ color: colors.textSecondary, lineHeight: "1.8", paddingLeft: "20px" }}>
            <li><strong>Degrés décimaux :</strong> 48.8566, 2.3522 (Paris)</li>
            <li><strong>DMS (Degrees Minutes Seconds) :</strong> 48°51'23.8"N 2°21'07.9"E</li>
            <li><strong>Plus Codes :</strong> 8FW4V942+27 (Open Location Code)</li>
            <li><strong>What3Words :</strong> ///mots.trois.unique</li>
          </ul>
        </div>

        <div style={{ marginBottom: "25px" }}>
          <h4 style={{ color: colors.textPrimary, fontSize: "1.2rem", marginBottom: "15px" }}>
            🛠️ Outils de conversion et analyse
          </h4>
          <ul style={{ color: colors.textSecondary, lineHeight: "1.8", paddingLeft: "20px" }}>
            <li><strong>GPS Visualizer :</strong> Conversion de formats GPS</li>
            <li><strong>What3Words :</strong> Localisation par triplet de mots</li>
            <li><strong>Plus Codes :</strong> Codes courts pour lieux sans adresse</li>
            <li><strong>Geocoding API :</strong> Conversion adresse ↔ coordonnées</li>
          </ul>
        </div>

        {/* Exercise 3 */}
        <div style={{ background: colors.bgSecondary, padding: "20px", borderRadius: "8px", border: progress.exercise3 ? `2px solid ${colors.accent}` : `1px solid ${colors.border}` }}>
          <h4 style={{ color: colors.accent, marginBottom: "15px" }}>
            {progress.exercise3 ? "✅" : "📝"} Exercice 3 : Format GPS
          </h4>
          <p style={{ color: colors.textPrimary, marginBottom: "15px" }}>
            Quel format de coordonnées utilise 3 mots simples pour identifier un lieu précis ? (nom du service)
          </p>
          <input
            type="text"
            value={answers.exercise3}
            onChange={(e) => setAnswers({ ...answers, exercise3: e.target.value })}
            placeholder="Nom du service"
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
            onClick={() => checkAnswer("exercise3", "what3words", answers.exercise3)}
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

      {/* Section 4 : Timeline et déplacements */}
      <div style={{ background: colors.bgPrimary, border: `1px solid ${colors.border}`, borderRadius: "12px", padding: "30px", marginBottom: "30px" }}>
        <h3 style={{ color: colors.accent, fontSize: "1.6rem", marginBottom: "20px" }}>
          4️⃣ Timeline et historique de localisation
        </h3>
        
        <div style={{ marginBottom: "25px" }}>
          <h4 style={{ color: colors.textPrimary, fontSize: "1.2rem", marginBottom: "15px" }}>
            🕐 Google Timeline (personnel)
          </h4>
          <ul style={{ color: colors.textSecondary, lineHeight: "1.8", paddingLeft: "20px" }}>
            <li><strong>Historique de localisation :</strong> Tous les déplacements enregistrés</li>
            <li><strong>Lieux visités :</strong> Restaurants, magasins, lieux fréquentés</li>
            <li><strong>Trajets :</strong> Modes de transport utilisés</li>
            <li><strong>Export de données :</strong> Google Takeout pour analyse</li>
          </ul>
        </div>

        <div style={{ marginBottom: "25px" }}>
          <h4 style={{ color: colors.textPrimary, fontSize: "1.2rem", marginBottom: "15px" }}>
            🗺️ Analyse de déplacements
          </h4>
          <ul style={{ color: colors.textSecondary, lineHeight: "1.8", paddingLeft: "20px" }}>
            <li><strong>Patterns de mouvement :</strong> Habitudes de déplacement</li>
            <li><strong>Lieux récurrents :</strong> Domicile, travail, loisirs</li>
            <li><strong>Horaires :</strong> Moments de présence dans des lieux</li>
            <li><strong>Cross-référencement :</strong> Combiner avec d'autres sources OSINT</li>
          </ul>
        </div>

        {/* Exercise 4 */}
        <div style={{ background: colors.bgSecondary, padding: "20px", borderRadius: "8px", border: progress.exercise4 ? `2px solid ${colors.accent}` : `1px solid ${colors.border}` }}>
          <h4 style={{ color: colors.accent, marginBottom: "15px" }}>
            {progress.exercise4 ? "✅" : "📝"} Exercice 4 : Export de données
          </h4>
          <p style={{ color: colors.textPrimary, marginBottom: "15px" }}>
            Quel service Google permet d'exporter toutes ses données de localisation ? (2 mots anglais)
          </p>
          <input
            type="text"
            value={answers.exercise4}
            onChange={(e) => setAnswers({ ...answers, exercise4: e.target.value })}
            placeholder="Nom du service"
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
            onClick={() => checkAnswer("exercise4", "google takeout", answers.exercise4)}
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
          5️⃣ Éthique et vie privée
        </h3>
        
        <div style={{ marginBottom: "25px" }}>
          <h4 style={{ color: colors.textPrimary, fontSize: "1.2rem", marginBottom: "15px" }}>
            ⚖️ Considérations légales
          </h4>
          <ul style={{ color: colors.textSecondary, lineHeight: "1.8", paddingLeft: "20px" }}>
            <li><strong>RGPD :</strong> Protection des données de localisation</li>
            <li><strong>Données publiques uniquement :</strong> Respecter la vie privée</li>
            <li><strong>Consentement :</strong> Ne jamais tracker quelqu'un sans autorisation</li>
            <li><strong>Contexte professionnel :</strong> Investigation légale uniquement</li>
          </ul>
        </div>

        <div style={{ marginBottom: "25px" }}>
          <h4 style={{ color: colors.textPrimary, fontSize: "1.2rem", marginBottom: "15px" }}>
            🛡️ Bonnes pratiques
          </h4>
          <ul style={{ color: colors.textSecondary, lineHeight: "1.8", paddingLeft: "20px" }}>
            <li><strong>Documentation :</strong> Capturer et horodater toutes les preuves</li>
            <li><strong>Proportionnalité :</strong> Limiter l'investigation au nécessaire</li>
            <li><strong>Transparence :</strong> Cadre légal clair</li>
            <li><strong>Respect :</strong> Ne pas divulguer des informations sensibles</li>
          </ul>
        </div>

        {/* Exercise 5 */}
        <div style={{ background: colors.bgSecondary, padding: "20px", borderRadius: "8px", border: progress.exercise5 ? `2px solid ${colors.accent}` : `1px solid ${colors.border}` }}>
          <h4 style={{ color: colors.accent, marginBottom: "15px" }}>
            {progress.exercise5 ? "✅" : "📝"} Exercice 5 : Protection des données
          </h4>
          <p style={{ color: colors.textPrimary, marginBottom: "15px" }}>
            Quelle réglementation européenne protège les données de localisation ? (sigle)
          </p>
          <input
            type="text"
            value={answers.exercise5}
            onChange={(e) => setAnswers({ ...answers, exercise5: e.target.value })}
            placeholder="Sigle de la réglementation"
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
          🎯 Quiz de validation — Google Maps OSINT
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
                  name={`googlemaps-q-${q.id}`}
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
          <li><strong>Bellingcat :</strong> Guides de géolocalisation</li>
          <li><strong>OSINT Framework :</strong> Outils de géolocalisation</li>
          <li><strong>What3Words :</strong> Système de coordonnées alternatif</li>
          <li><strong>Google Earth :</strong> Imagerie satellite historique</li>
        </ul>
      </div>

    </main>
  );
}

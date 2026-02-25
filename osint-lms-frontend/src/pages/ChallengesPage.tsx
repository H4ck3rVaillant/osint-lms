import { useState, useEffect } from "react";
import { useThemeColors } from "../context/ThemeContext";
import { useGame } from "../context/GameContext";

interface Challenge {
  id: number;
  title: string;
  difficulty: "facile" | "moyen" | "difficile";
  category: string;
  description: string;
  question: string;
  answers: string[];
  hint: string;
  solution: string;
  points: number;
}

const CHALLENGES: Challenge[] = [
  { id: 1, title: "La Tour Mystère", difficulty: "facile", category: "Géolocalisation", description: "Coordonnées GPS : 48.8584° N, 2.2945° E", question: "Quel monument célèbre se trouve à ces coordonnées ?", answers: ["tour eiffel", "eiffel tower", "la tour eiffel"], hint: "Monument iconique de Paris construit en 1889", solution: "La Tour Eiffel à Paris. Les coordonnées peuvent être vérifiées sur Google Maps.", points: 10 },
  { id: 2, title: "Username Hunter", difficulty: "facile", category: "SOCMINT", description: "Vous devez traquer le pseudo 'CyberGhost2024' sur plusieurs plateformes.", question: "Quel outil Python recherche un username sur 300+ sites ?", answers: ["sherlock", "sherlock project"], hint: "Célèbre détective britannique de fiction", solution: "Sherlock (github.com/sherlock-project/sherlock) scanne automatiquement des centaines de plateformes.", points: 10 },
  { id: 3, title: "Breach Check", difficulty: "facile", category: "Data Breach", description: "L'email 'contact@example.com' a-t-il été compromis ?", question: "Quel site gratuit vérifie si un email apparaît dans des fuites ?", answers: ["have i been pwned", "haveibeenpwned", "hibp"], hint: "Créé par Troy Hunt, acronyme HIBP", solution: "Have I Been Pwned (haveibeenpwned.com) recense plus de 12 milliards de comptes compromis.", points: 10 },
  { id: 4, title: "WHOIS Investigation", difficulty: "facile", category: "Infrastructure", description: "Le domaine 'suspicious-site.com' a été enregistré récemment.", question: "Quelle commande Unix interroge les informations d'enregistrement d'un domaine ?", answers: ["whois"], hint: "5 lettres, commande standard UNIX/Linux", solution: "La commande 'whois' interroge les bases de données publiques pour obtenir propriétaire, date de création, registrar.", points: 10 },
  { id: 5, title: "Google Dorking", difficulty: "moyen", category: "Search Engines", description: "Vous cherchez des fichiers PDF contenant le mot 'confidentiel' sur un site gouvernemental.", question: "Quel opérateur Google Dork utilisez-vous ? (format: operator:value)", answers: ["filetype:pdf", "filetype: pdf"], hint: "Opérateur pour filtrer par type de fichier", solution: "La requête complète serait : site:gouv.fr filetype:pdf confidentiel", points: 25 },
  { id: 6, title: "EXIF Metadata", difficulty: "moyen", category: "Métadonnées", description: "Une photo contient des métadonnées GPS cachées.", question: "Quel outil en ligne extrait les données EXIF d'une image ?", answers: ["exiftool", "exif viewer", "exifdata", "jimpl"], hint: "Plusieurs outils existent, le plus connu commence par 'EXIF'", solution: "ExifTool (exiftool.org) ou des viewers en ligne comme exifdata.com peuvent extraire toutes les métadonnées.", points: 25 },
  { id: 7, title: "IP Geolocation", difficulty: "moyen", category: "Infrastructure", description: "Une adresse IP suspecte : 8.8.8.8", question: "À quelle organisation appartient cette IP publique ?", answers: ["google", "google llc", "google dns"], hint: "Service DNS public très populaire", solution: "8.8.8.8 est le DNS public de Google, vérifiable via WHOIS ou des services de géolocalisation IP.", points: 25 },
  { id: 8, title: "Archive Machine", difficulty: "moyen", category: "Web Archives", description: "Un site web malveillant a été supprimé, mais vous devez retrouver son contenu.", question: "Quel service archive automatiquement les pages web depuis 1996 ?", answers: ["wayback machine", "internet archive", "archive.org"], hint: "Archive.org, nom évoque le 'retour en arrière'", solution: "La Wayback Machine (web.archive.org) archive plus de 735 milliards de pages web.", points: 25 },
  { id: 9, title: "Reverse Image Search", difficulty: "facile", category: "Images", description: "Vous avez une photo et voulez trouver sa source originale.", question: "Quel moteur de recherche russe est réputé pour la recherche d'images inversée ?", answers: ["yandex", "yandex images"], hint: "Concurrent russe de Google, commence par Y", solution: "Yandex Images offre souvent de meilleurs résultats que Google Images pour la recherche inversée.", points: 10 },
  { id: 10, title: "Bitcoin Tracking", difficulty: "difficile", category: "Crypto", description: "Une transaction Bitcoin suspecte doit être tracée.", question: "Quel explorateur blockchain permet d'analyser les transactions Bitcoin ?", answers: ["blockchain.com", "blockchair", "blockchain explorer"], hint: "Le nom contient le mot 'blockchain'", solution: "Blockchain.com ou Blockchair.com permettent de tracer les transactions Bitcoin publiquement.", points: 50 },
];

export default function ChallengesPage() {
  const colors = useThemeColors();
  const { unlockBadge, addXP } = useGame();
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState<{ type: "success" | "error" | ""; message: string }>({ type: "", message: "" });
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

  const getWeekNumber = () => {
    const startDate = new Date("2026-02-23");
    const now = new Date();
    const diff = now.getTime() - startDate.getTime();
    const weeksPassed = Math.floor(diff / (7 * 24 * 60 * 60 * 1000));
    if (weeksPassed < 0) return 0;
    return weeksPassed % CHALLENGES.length;
  };

  const [currentWeek, setCurrentWeek] = useState(getWeekNumber());
  const currentChallenge = CHALLENGES[currentWeek];

  if (!currentChallenge) {
    return <div style={{ minHeight: "100vh", background: colors.bgPrimary, paddingTop: "80px" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "40px 20px", textAlign: "center" }}>
        <h1 style={{ color: colors.textPrimary }}>Erreur</h1>
      </div>
    </div>;
  }

  const getTimeUntilNextMonday = () => {
    const now = new Date();
    const nextMonday = new Date(now);
    nextMonday.setDate(now.getDate() + ((1 + 7 - now.getDay()) % 7 || 7));
    nextMonday.setHours(0, 0, 0, 0);
    const diff = nextMonday.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    return { days, hours };
  };

  const [timeLeft, setTimeLeft] = useState(getTimeUntilNextMonday());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeUntilNextMonday());
      setCurrentWeek(getWeekNumber());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const getSolvedChallenges = (): number[] => {
    const solved = localStorage.getItem("challenges_solved");
    return solved ? JSON.parse(solved) : [];
  };

  const [solvedChallenges, setSolvedChallenges] = useState(getSolvedChallenges());
  const isSolved = solvedChallenges.includes(currentChallenge.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSolved) {
      setFeedback({ type: "error", message: "Vous avez déjà résolu ce challenge !" });
      return;
    }
    const normalized = userAnswer.toLowerCase().trim();
    const isCorrect = currentChallenge.answers.some(answer =>
      normalized === answer.toLowerCase() || normalized.includes(answer.toLowerCase())
    );
    if (isCorrect) {
      const newSolved = [...solvedChallenges, currentChallenge.id];
      localStorage.setItem("challenges_solved", JSON.stringify(newSolved));
      setSolvedChallenges(newSolved);
      addXP(currentChallenge.points, `Challenge ${currentChallenge.title}`);
      setFeedback({ type: "success", message: `🎉 Correct ! +${currentChallenge.points} XP` });
      setShowSolution(true);
      if (newSolved.length === 10) unlockBadge("challenge_master", "Challenge Master");
    } else {
      setFeedback({ type: "error", message: "❌ Réponse incorrecte !" });
    }
  };

  const handleReset = () => {
    localStorage.removeItem("challenges_solved");
    setSolvedChallenges([]);
    setUserAnswer("");
    setFeedback({ type: "", message: "" });
    setShowHint(false);
    setShowSolution(false);
    setShowResetModal(false);
  };

  const difficultyColors = { facile: "#10b981", moyen: "#f59e0b", difficile: "#ef4444" };

  return (
    <div style={{ minHeight: "100vh", background: colors.bgPrimary, paddingTop: "80px" }}>
      
      {showResetModal && (
        <>
          <div onClick={() => setShowResetModal(false)} style={{
            position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.9)", zIndex: 9998
          }} />
          <div style={{
            position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
            background: "#0b0f1a", border: "3px solid #00ff9c", borderRadius: "16px",
            padding: "40px", maxWidth: "500px", zIndex: 9999, boxShadow: "0 0 50px rgba(0,255,156,0.5)"
          }}>
            <div style={{ fontSize: "4rem", textAlign: "center", marginBottom: "20px" }}>⚠️</div>
            <h2 style={{ color: "#00ff9c", fontSize: "1.8rem", textAlign: "center", marginBottom: "15px" }}>
              Réinitialiser
            </h2>
            <p style={{ color: "#9ca3af", textAlign: "center", marginBottom: "30px", lineHeight: "1.6" }}>
              <strong style={{ color: "#00ff9c" }}>SUPPRIMER</strong> toute votre progression ?
            </p>
            <div style={{ display: "flex", gap: "15px" }}>
              <button onClick={() => setShowResetModal(false)} style={{
                flex: 1, padding: "14px", background: "transparent", border: "2px solid #2a3f3f",
                borderRadius: "8px", color: "#e5e7eb", fontSize: "1rem", fontWeight: "600", cursor: "pointer"
              }}>Annuler</button>
              <button onClick={handleReset} style={{
                flex: 1, padding: "14px", background: "#00ff9c", border: "none",
                borderRadius: "8px", color: "#0b0f1a", fontSize: "1rem", fontWeight: "600", cursor: "pointer"
              }}>Confirmer</button>
            </div>
          </div>
        </>
      )}

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "40px 20px" }}>
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div style={{ fontSize: "4rem", marginBottom: "15px" }}>🔥</div>
          <h1 style={{ fontSize: "2.5rem", fontWeight: "700", color: colors.textPrimary, marginBottom: "15px" }}>
            Challenge Hebdomadaire
          </h1>
          <p style={{ fontSize: "1.1rem", color: colors.textSecondary }}>
            Semaine {currentWeek + 1}/{CHALLENGES.length}
          </p>
        </div>

        <div style={{
          background: colors.bgSecondary, border: `2px solid ${difficultyColors[currentChallenge.difficulty]}`,
          borderRadius: "16px", padding: "40px", marginBottom: "30px"
        }}>
          <div style={{
            display: "inline-block", padding: "8px 16px", background: difficultyColors[currentChallenge.difficulty],
            color: "#fff", borderRadius: "20px", fontSize: "0.9rem", fontWeight: "600", marginBottom: "20px"
          }}>{currentChallenge.difficulty.toUpperCase()} • {currentChallenge.points} pts</div>

          <h2 style={{ fontSize: "2rem", fontWeight: "700", color: colors.textPrimary, marginBottom: "10px" }}>
            {currentChallenge.title}
          </h2>
          <p style={{ fontSize: "0.95rem", color: colors.accent, marginBottom: "20px", fontWeight: "500" }}>
            📂 {currentChallenge.category}
          </p>
          <p style={{ fontSize: "1.1rem", color: colors.textSecondary, lineHeight: "1.7", marginBottom: "25px" }}>
            {currentChallenge.description}
          </p>

          <div style={{
            background: `${colors.accent}10`, border: `1px solid ${colors.accent}30`,
            borderRadius: "12px", padding: "20px", marginBottom: "25px"
          }}>
            <p style={{ fontSize: "1.2rem", fontWeight: "600", color: colors.textPrimary, marginBottom: "0" }}>
              ❓ {currentChallenge.question}
            </p>
          </div>

          {!isSolved ? (
            <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
              <input type="text" value={userAnswer} onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Votre réponse..." style={{
                  width: "100%", padding: "15px", background: colors.bgPrimary,
                  border: `2px solid ${colors.border}`, borderRadius: "10px", color: colors.textPrimary,
                  fontSize: "1rem", marginBottom: "15px"
                }}
              />
              <button type="submit" style={{
                width: "100%", padding: "15px", background: colors.accent, color: "#fff",
                border: "none", borderRadius: "10px", fontSize: "1.1rem", fontWeight: "600", cursor: "pointer"
              }}>Valider</button>
            </form>
          ) : (
            <div style={{
              padding: "20px", background: "#10b98120", border: "2px solid #10b981",
              borderRadius: "12px", textAlign: "center", marginBottom: "20px"
            }}>
              <p style={{ fontSize: "1.2rem", fontWeight: "600", color: "#10b981", margin: 0 }}>
                ✅ Résolu !
              </p>
            </div>
          )}

          {feedback.message && (
            <div style={{
              padding: "15px", background: feedback.type === "success" ? "#10b98120" : "#ef444420",
              border: `2px solid ${feedback.type === "success" ? "#10b981" : "#ef4444"}`, borderRadius: "10px", marginBottom: "20px"
            }}>
              <p style={{ color: feedback.type === "success" ? "#10b981" : "#ef4444", fontWeight: "600", margin: 0 }}>
                {feedback.message}
              </p>
            </div>
          )}

          <button onClick={() => setShowHint(!showHint)} style={{
            padding: "12px 20px", background: "transparent", border: `2px solid ${colors.accent}`,
            borderRadius: "8px", color: colors.accent, fontWeight: "600", cursor: "pointer"
          }}>💡 Indice</button>

          {showHint && (
            <div style={{ marginTop: "15px", padding: "15px", background: `${colors.accent}10`, borderRadius: "8px" }}>
              <p style={{ color: colors.textSecondary, margin: 0 }}>💡 {currentChallenge.hint}</p>
            </div>
          )}

          {(isSolved || showSolution) && (
            <div style={{
              marginTop: "20px", padding: "20px", background: `${colors.accent}10`,
              border: `1px solid ${colors.accent}30`, borderRadius: "12px"
            }}>
              <h3 style={{ fontSize: "1.2rem", fontWeight: "600", color: colors.accent, marginBottom: "10px" }}>
                📖 Solution
              </h3>
              <p style={{ color: colors.textSecondary, lineHeight: "1.6", margin: 0 }}>{currentChallenge.solution}</p>
            </div>
          )}
        </div>

        <div style={{
          background: colors.bgSecondary, border: `1px solid ${colors.border}`,
          borderRadius: "12px", padding: "25px", textAlign: "center", marginBottom: "30px"
        }}>
          <h3 style={{ fontSize: "1.3rem", fontWeight: "600", color: colors.textPrimary, marginBottom: "15px" }}>
            📊 Stats
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "20px" }}>
            {[
              { val: solvedChallenges.length, label: "Résolus" },
              { val: Math.round((solvedChallenges.length / CHALLENGES.length) * 100) + "%", label: "Complétion" },
              { val: solvedChallenges.length * 25, label: "XP" }
            ].map((s, i) => (
              <div key={i}>
                <p style={{ fontSize: "2rem", fontWeight: "700", color: colors.accent, margin: 0 }}>{s.val}</p>
                <p style={{ color: colors.textSecondary, fontSize: "0.9rem", margin: 0 }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{
          background: "#0b0f1a", border: "2px solid #00ff9c",
          borderRadius: "12px", padding: "25px", textAlign: "center"
        }}>
          <h3 style={{ fontSize: "1.2rem", fontWeight: "600", color: "#00ff9c", marginBottom: "10px" }}>
            ⚠️ Zone Dangereuse
          </h3>
          <p style={{ color: "#9ca3af", marginBottom: "20px", fontSize: "0.95rem" }}>
            Réinitialiser = tout supprimer
          </p>
          <button onClick={() => setShowResetModal(true)} style={{
            padding: "14px 28px", background: "transparent", border: "2px solid #00ff9c",
            borderRadius: "8px", color: "#00ff9c", fontSize: "1rem", fontWeight: "600", cursor: "pointer"
          }}>🔄 Réinitialiser</button>
        </div>
      </div>
    </div>
  );
}

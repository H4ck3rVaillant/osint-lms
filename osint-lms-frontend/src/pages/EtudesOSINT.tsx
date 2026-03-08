import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useThemeColors } from "../context/ThemeContext";

export default function EtudesOSINT() {
  const colors = useThemeColors();
  const navigate = useNavigate();
  const [showResetPopup, setShowResetPopup] = useState(false);
  const [completedCases, setCompletedCases] = useState({
    geo: false,
    media: false,
    attribution: false,
    chronologie: false,
    final: false,
  });

  useEffect(() => {
    setCompletedCases({
      geo: localStorage.getItem("badge_case_geo") === "true",
      media: localStorage.getItem("badge_case_media") === "true",
      attribution: localStorage.getItem("badge_case_attr") === "true",
      chronologie: localStorage.getItem("badge_case_chrono") === "true",
      final: localStorage.getItem("badge_cases_osint") === "true",
    });
  }, []);

  const cases = [
    {
      key: "geo",
      badgeKey: "badge_case_geo",
      title: "🛰️ Géolocalisation d'images",
      desc: "Identifier précisément un lieu à partir d'indices visuels",
      longDesc: "Apprenez à localiser des images grâce aux ombres, au mobilier urbain, aux bâtiments et aux vues satellites. Méthodologie inspirée des investigations Bellingcat.",
      path: "/cas/geolocalisation",
      difficulty: "Intermédiaire",
      duration: "30-45 min",
    },
    {
      key: "media",
      badgeKey: "badge_case_media",
      title: "📸 Vérification d'images & vidéos",
      desc: "Détection de manipulations et désinformation",
      longDesc: "Maîtrisez les techniques de recherche inversée, d'analyse de métadonnées et de détection de contenus recyclés ou manipulés.",
      path: "/cas/verification-media",
      difficulty: "Intermédiaire",
      duration: "30-45 min",
    },
    {
      key: "attribution",
      badgeKey: "badge_case_attr",
      title: "🧑‍💻 Attribution d'acteurs",
      desc: "Relier une activité à un individu ou un groupe",
      longDesc: "Découvrez comment attribuer des actions coordonnées à des acteurs spécifiques via l'analyse technique, comportementale et temporelle.",
      path: "/cas/attribution",
      difficulty: "Avancé",
      duration: "45-60 min",
    },
    {
      key: "chronologie",
      badgeKey: "badge_case_chrono",
      title: "🧭 Chronologie d'événements",
      desc: "Reconstruire une séquence factuelle",
      longDesc: "Reconstituez l'ordre des événements en corrélant sources multiples, timestamps et données contextuelles (météo, satellites).",
      path: "/cas/chronologie",
      difficulty: "Avancé",
      duration: "45-60 min",
    },
    {
      key: "final",
      badgeKey: "badge_cases_osint",
      title: "🎯 Cas final – Analyse complète",
      desc: "Enquête OSINT multi-angles type Bellingcat",
      longDesc: "Synthèse de toutes les compétences acquises : géolocalisation, vérification, attribution et chronologie dans une investigation complexe.",
      path: "/cas/final",
      difficulty: "Expert",
      duration: "60-90 min",
    },
  ];

  const validatedCount = Object.values(completedCases).filter(Boolean).length;
  const globalProgress = Math.round((validatedCount / cases.length) * 100);

  const resetCases = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    [
      "badge_case_geo",
      "badge_case_media",
      "badge_case_attr",
      "badge_case_chrono",
      "badge_cases_osint",
    ].forEach((k) => localStorage.removeItem(k));
    
    setCompletedCases({
      geo: false,
      media: false,
      attribution: false,
      chronologie: false,
      final: false,
    });
    
    setShowResetPopup(false);
    // Pas de reload : les states React sont déjà remis à zéro ci-dessus
  };

  const difficultyColor = (difficulty: string) => {
    switch(difficulty) {
      case "Intermédiaire": return "#fbbf24";
      case "Avancé": return "#f97316";
      case "Expert": return "#ef4444";
      default: return colors.accent;
    }
  };

  return (
    <main style={{ padding: "40px", maxWidth: "1200px", margin: "0 auto" }}>
      <h1 style={{ color: colors.accent, fontSize: "2rem", marginBottom: "10px" }}>
        Études de Cas OSINT Réels
      </h1>
      <p style={{ color: colors.textSecondary, marginBottom: "30px", fontSize: "1.1rem" }}>
        Appliquez vos compétences à travers des cas d'investigation inspirés de situations réelles. 
        Méthodologie professionnelle type Bellingcat.
      </p>

      {/* Barre de progression globale */}
      <div style={{ 
        background: colors.bgPrimary, 
        border: "1px solid #00ff9c", 
        borderRadius: "8px", 
        padding: "24px",
        marginBottom: "30px"
      }}>
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          marginBottom: "12px"
        }}>
          <h3 style={{ color: colors.accent, margin: 0, fontSize: "1.1rem" }}>
            Progression globale des études de cas
          </h3>
          <span style={{ 
            color: colors.accent, 
            fontWeight: "bold",
            fontSize: "1.1rem"
          }}>
            {validatedCount}/{cases.length} cas complétés
          </span>
        </div>
        
        <div style={{
          width: "100%",
          height: "24px",
          background: colors.bgSecondary,
          borderRadius: "12px",
          overflow: "hidden",
          border: "1px solid #2a3f3f"
        }}>
          <div style={{
            width: `${globalProgress}%`,
            height: "100%",
            background: "linear-gradient(90deg, #00ff9c 0%, #00d484 100%)",
            transition: "width 0.5s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: colors.bgPrimary,
            fontWeight: "bold",
            fontSize: "0.875rem"
          }}>
            {globalProgress > 0 && `${globalProgress}%`}
          </div>
        </div>
      </div>

      {/* Cartes des cas */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
        gap: "24px",
        marginBottom: "40px"
      }}>
        {cases.map((c) => {
          const done = completedCases[c.key as keyof typeof completedCases];
          return (
            <div
              key={c.key}
              onClick={() => navigate(c.path)}
              style={{
                background: colors.bgPrimary,
                border: `1px solid ${done ? colors.accent : colors.border}`,
                borderRadius: "12px",
                padding: "24px",
                cursor: "pointer",
                transition: "all 0.3s ease",
                position: "relative" as const,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 0 20px rgba(0,255,156,0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "10px" }}>
                <h2 style={{ color: colors.accent, margin: 0, fontSize: "1.3rem" }}>
                  {c.title}
                </h2>
                <span style={{ 
                  color: done ? colors.accent : "#6b7280",
                  fontSize: "1.5rem"
                }}>
                  {done ? "✓" : "○"}
                </span>
              </div>

              <p style={{ color: colors.textSecondary, fontSize: "0.95rem", marginBottom: "12px", lineHeight: "1.6" }}>
                {c.desc}
              </p>

              <p style={{ color: colors.textSecondary, fontSize: "0.85rem", marginBottom: "15px", lineHeight: "1.5" }}>
                {c.longDesc}
              </p>

              {/* Badges difficulté et durée */}
              <div style={{ display: "flex", gap: "10px", marginBottom: "15px", flexWrap: "wrap" as const }}>
                <span style={{
                  background: colors.bgSecondary,
                  color: difficultyColor(c.difficulty),
                  padding: "4px 12px",
                  borderRadius: "6px",
                  fontSize: "0.8rem",
                  fontWeight: "bold",
                  border: `1px solid ${difficultyColor(c.difficulty)}30`
                }}>
                  {c.difficulty}
                </span>
                <span style={{
                  background: colors.bgSecondary,
                  color: colors.textSecondary,
                  padding: "4px 12px",
                  borderRadius: "6px",
                  fontSize: "0.8rem",
                  border: "1px solid #2a3f3f"
                }}>
                  ⏱️ {c.duration}
                </span>
              </div>

              {/* Barre de progression individuelle */}
              <div style={{
                width: "100%",
                height: "8px",
                background: colors.bgSecondary,
                borderRadius: "4px",
                overflow: "hidden",
                marginBottom: "10px"
              }}>
                <div style={{
                  width: done ? "100%" : "0%",
                  height: "100%",
                  background: colors.accent,
                  transition: "width 0.5s ease",
                  borderRadius: "4px"
                }} />
              </div>

              <p style={{ 
                color: done ? colors.accent : "#6b7280",
                fontSize: "0.9rem",
                fontWeight: "bold",
                margin: 0
              }}>
                {done ? "✓ Cas validé" : "→ Commencer le cas"}
              </p>
            </div>
          );
        })}
      </div>

      {/* Section informative */}
      <div style={{
        background: colors.bgSecondary,
        border: "1px solid #2a3f3f",
        borderRadius: "8px",
        padding: "24px",
        marginBottom: "30px"
      }}>
        <h3 style={{ color: colors.accent, marginBottom: "15px", fontSize: "1.2rem" }}>
          💡 À propos des études de cas
        </h3>
        <p style={{ color: colors.textSecondary, lineHeight: "1.7", marginBottom: "12px" }}>
          Ces études de cas sont conçues pour reproduire des <strong>investigations OSINT réelles</strong>. 
          Chaque cas vous guide à travers une méthodologie professionnelle utilisée par des organisations 
          comme Bellingcat, les CERT et les analystes en renseignement.
        </p>
        <ul style={{ color: colors.textSecondary, lineHeight: "1.8", paddingLeft: "20px" }}>
          <li>Méthodologies vérifiables et reproductibles</li>
          <li>Sources ouvertes authentiques et légales</li>
          <li>Approche éthique et transparente</li>
          <li>Techniques utilisées par les professionnels</li>
        </ul>
      </div>

      {/* Bouton de réinitialisation */}
      <div style={{ textAlign: "center" }}>
        <button
          onClick={() => setShowResetPopup(true)}
          style={{
            background: colors.bgPrimary,
            color: colors.accent,
            border: "1px solid #00ff9c",
            padding: "14px 32px",
            borderRadius: "8px",
            fontSize: "1rem",
            fontWeight: "bold",
            cursor: "pointer",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = colors.accent;
            e.currentTarget.style.color = colors.bgPrimary;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = colors.bgPrimary;
            e.currentTarget.style.color = colors.accent;
          }}
        >
          🔄 Réinitialiser toutes les études de cas
        </button>
      </div>

      {/* Pop-up de confirmation de réinitialisation */}
      {showResetPopup && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: colors.overlay,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
        }}>
          <div style={{
            background: colors.bgPrimary,
            border: "2px solid #00ff9c",
            borderRadius: "12px",
            padding: "40px",
            maxWidth: "500px",
            textAlign: "center",
            boxShadow: "0 0 50px rgba(0, 255, 156, 0.3)",
          }}>
            <h3 style={{ color: colors.accent, marginBottom: "15px", fontSize: "1.5rem" }}>
              Réinitialiser les études de cas ?
            </h3>
            <p style={{ color: colors.textSecondary, marginBottom: "30px", lineHeight: "1.6" }}>
              Tous les badges d'études de cas seront verrouillés et vous devrez les compléter à nouveau. 
              Cette action est irréversible.
            </p>

            <div style={{ display: "flex", gap: "20px", justifyContent: "center" }}>
              <button
                onClick={resetCases}
                style={{
                  padding: "12px 28px",
                  background: colors.accent,
                  color: colors.bgPrimary,
                  borderRadius: "8px",
                  cursor: "pointer",
                  border: "none",
                  fontWeight: "bold",
                  fontSize: "1rem",
                }}
              >
                ✓ Confirmer
              </button>
              <button
                onClick={() => setShowResetPopup(false)}
                style={{
                  padding: "12px 28px",
                  background: "transparent",
                  color: colors.accent,
                  border: "1px solid #00ff9c",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  fontSize: "1rem",
                }}
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

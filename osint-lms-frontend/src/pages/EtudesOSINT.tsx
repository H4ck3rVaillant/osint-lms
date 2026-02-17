import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function EtudesOSINT() {
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
      title: "ð°ï¸ GÃ©olocalisation d'images",
      desc: "Identifier prÃ©cisÃ©ment un lieu Ã  partir d'indices visuels",
      longDesc: "Apprenez Ã  localiser des images grÃ¢ce aux ombres, au mobilier urbain, aux bÃ¢timents et aux vues satellites. MÃ©thodologie inspirÃ©e des investigations Bellingcat.",
      path: "/cas/geolocalisation",
      difficulty: "IntermÃ©diaire",
      duration: "30-45 min",
    },
    {
      key: "media",
      badgeKey: "badge_case_media",
      title: "ð¸ VÃ©rification d'images & vidÃ©os",
      desc: "DÃ©tection de manipulations et dÃ©sinformation",
      longDesc: "MaÃ®trisez les techniques de recherche inversÃ©e, d'analyse de mÃ©tadonnÃ©es et de dÃ©tection de contenus recyclÃ©s ou manipulÃ©s.",
      path: "/cas/verification-media",
      difficulty: "IntermÃ©diaire",
      duration: "30-45 min",
    },
    {
      key: "attribution",
      badgeKey: "badge_case_attr",
      title: "ð§âð» Attribution d'acteurs",
      desc: "Relier une activitÃ© Ã  un individu ou un groupe",
      longDesc: "DÃ©couvrez comment attribuer des actions coordonnÃ©es Ã  des acteurs spÃ©cifiques via l'analyse technique, comportementale et temporelle.",
      path: "/cas/attribution",
      difficulty: "AvancÃ©",
      duration: "45-60 min",
    },
    {
      key: "chronologie",
      badgeKey: "badge_case_chrono",
      title: "ð§­ Chronologie d'Ã©vÃ©nements",
      desc: "Reconstruire une sÃ©quence factuelle",
      longDesc: "Reconstituez l'ordre des Ã©vÃ©nements en corrÃ©lant sources multiples, timestamps et donnÃ©es contextuelles (mÃ©tÃ©o, satellites).",
      path: "/cas/chronologie",
      difficulty: "AvancÃ©",
      duration: "45-60 min",
    },
    {
      key: "final",
      badgeKey: "badge_cases_osint",
      title: "ð¯ Cas final â Analyse complÃ¨te",
      desc: "EnquÃªte OSINT multi-angles type Bellingcat",
      longDesc: "SynthÃ¨se de toutes les compÃ©tences acquises : gÃ©olocalisation, vÃ©rification, attribution et chronologie dans une investigation complexe.",
      path: "/cas/final",
      difficulty: "Expert",
      duration: "60-90 min",
    },
  ];

  const validatedCount = Object.values(completedCases).filter(Boolean).length;
  const globalProgress = Math.round((validatedCount / cases.length) * 100);

  const resetCases = () => {
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
    
    localStorage.removeItem("cyberosint_game_state");
    localStorage.removeItem("cyberosint_challenges");
    setShowResetPopup(false);
    // Pas de reload : les states React sont dÃ©jÃ  remis Ã  zÃ©ro ci-dessus
  };

  const difficultyColor = (difficulty: string) => {
    switch(difficulty) {
      case "IntermÃ©diaire": return "#fbbf24";
      case "AvancÃ©": return "#f97316";
      case "Expert": return "#ef4444";
      default: return "#00ff9c";
    }
  };

  return (
    <main style={{ padding: "40px", maxWidth: "1200px", margin: "0 auto" }}>
      <h1 style={{ color: "#00ff9c", fontSize: "2rem", marginBottom: "10px" }}>
        Ãtudes de Cas OSINT RÃ©els
      </h1>
      <p style={{ color: "#9ca3af", marginBottom: "30px", fontSize: "1.1rem" }}>
        Appliquez vos compÃ©tences Ã  travers des cas d'investigation inspirÃ©s de situations rÃ©elles. 
        MÃ©thodologie professionnelle type Bellingcat.
      </p>

      {/* Barre de progression globale */}
      <div style={{ 
        background: "#0b0f1a", 
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
          <h3 style={{ color: "#00ff9c", margin: 0, fontSize: "1.1rem" }}>
            Progression globale des Ã©tudes de cas
          </h3>
          <span style={{ 
            color: "#00ff9c", 
            fontWeight: "bold",
            fontSize: "1.1rem"
          }}>
            {validatedCount}/{cases.length} cas complÃ©tÃ©s
          </span>
        </div>
        
        <div style={{
          width: "100%",
          height: "24px",
          background: "#1a1f2e",
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
            color: "#0b0f1a",
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
                background: "#0b0f1a",
                border: `1px solid ${done ? "#00ff9c" : "#2a3f3f"}`,
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
                <h2 style={{ color: "#00ff9c", margin: 0, fontSize: "1.3rem" }}>
                  {c.title}
                </h2>
                <span style={{ 
                  color: done ? "#00ff9c" : "#6b7280",
                  fontSize: "1.5rem"
                }}>
                  {done ? "â" : "â"}
                </span>
              </div>

              <p style={{ color: "#9ca3af", fontSize: "0.95rem", marginBottom: "12px", lineHeight: "1.6" }}>
                {c.desc}
              </p>

              <p style={{ color: "#9ca3af", fontSize: "0.85rem", marginBottom: "15px", lineHeight: "1.5" }}>
                {c.longDesc}
              </p>

              {/* Badges difficultÃ© et durÃ©e */}
              <div style={{ display: "flex", gap: "10px", marginBottom: "15px", flexWrap: "wrap" as const }}>
                <span style={{
                  background: "#1a1f2e",
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
                  background: "#1a1f2e",
                  color: "#9ca3af",
                  padding: "4px 12px",
                  borderRadius: "6px",
                  fontSize: "0.8rem",
                  border: "1px solid #2a3f3f"
                }}>
                  â±ï¸ {c.duration}
                </span>
              </div>

              {/* Barre de progression individuelle */}
              <div style={{
                width: "100%",
                height: "8px",
                background: "#1a1f2e",
                borderRadius: "4px",
                overflow: "hidden",
                marginBottom: "10px"
              }}>
                <div style={{
                  width: done ? "100%" : "0%",
                  height: "100%",
                  background: "#00ff9c",
                  transition: "width 0.5s ease",
                  borderRadius: "4px"
                }} />
              </div>

              <p style={{ 
                color: done ? "#00ff9c" : "#6b7280",
                fontSize: "0.9rem",
                fontWeight: "bold",
                margin: 0
              }}>
                {done ? "â Cas validÃ©" : "â Commencer le cas"}
              </p>
            </div>
          );
        })}
      </div>

      {/* Section informative */}
      <div style={{
        background: "#1a1f2e",
        border: "1px solid #2a3f3f",
        borderRadius: "8px",
        padding: "24px",
        marginBottom: "30px"
      }}>
        <h3 style={{ color: "#00ff9c", marginBottom: "15px", fontSize: "1.2rem" }}>
          ð¡ Ã propos des Ã©tudes de cas
        </h3>
        <p style={{ color: "#9ca3af", lineHeight: "1.7", marginBottom: "12px" }}>
          Ces Ã©tudes de cas sont conÃ§ues pour reproduire des <strong>investigations OSINT rÃ©elles</strong>. 
          Chaque cas vous guide Ã  travers une mÃ©thodologie professionnelle utilisÃ©e par des organisations 
          comme Bellingcat, les CERT et les analystes en renseignement.
        </p>
        <ul style={{ color: "#9ca3af", lineHeight: "1.8", paddingLeft: "20px" }}>
          <li>MÃ©thodologies vÃ©rifiables et reproductibles</li>
          <li>Sources ouvertes authentiques et lÃ©gales</li>
          <li>Approche Ã©thique et transparente</li>
          <li>Techniques utilisÃ©es par les professionnels</li>
        </ul>
      </div>

      {/* Bouton de rÃ©initialisation */}
      <div style={{ textAlign: "center" }}>
        <button
          onClick={() => setShowResetPopup(true)}
          style={{
            background: "#0b0f1a",
            color: "#00ff9c",
            border: "1px solid #00ff9c",
            padding: "14px 32px",
            borderRadius: "8px",
            fontSize: "1rem",
            fontWeight: "bold",
            cursor: "pointer",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#00ff9c";
            e.currentTarget.style.color = "#0b0f1a";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#0b0f1a";
            e.currentTarget.style.color = "#00ff9c";
          }}
        >
          ð RÃ©initialiser toutes les Ã©tudes de cas
        </button>
      </div>

      {/* Pop-up de confirmation de rÃ©initialisation */}
      {showResetPopup && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0, 0, 0, 0.85)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
        }}>
          <div style={{
            background: "#0b0f1a",
            border: "2px solid #00ff9c",
            borderRadius: "12px",
            padding: "40px",
            maxWidth: "500px",
            textAlign: "center",
            boxShadow: "0 0 50px rgba(0, 255, 156, 0.3)",
          }}>
            <h3 style={{ color: "#00ff9c", marginBottom: "15px", fontSize: "1.5rem" }}>
              RÃ©initialiser les Ã©tudes de cas ?
            </h3>
            <p style={{ color: "#9ca3af", marginBottom: "30px", lineHeight: "1.6" }}>
              Tous les badges d'Ã©tudes de cas seront verrouillÃ©s et vous devrez les complÃ©ter Ã  nouveau. 
              Cette action est irrÃ©versible.
            </p>

            <div style={{ display: "flex", gap: "20px", justifyContent: "center" }}>
              <button
                onClick={resetCases}
                style={{
                  padding: "12px 28px",
                  background: "#00ff9c",
                  color: "#0b0f1a",
                  borderRadius: "8px",
                  cursor: "pointer",
                  border: "none",
                  fontWeight: "bold",
                  fontSize: "1rem",
                }}
              >
                â Confirmer
              </button>
              <button
                onClick={() => setShowResetPopup(false)}
                style={{
                  padding: "12px 28px",
                  background: "transparent",
                  color: "#00ff9c",
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

import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function ParcoursIntermediaire() {
  const [introDone, setIntroDone] = useState(false);
  const [methodoDone, setMethodoDone] = useState(false);
  const [outilsDone, setOutilsDone] = useState(false);
  const [showResetPopup, setShowResetPopup] = useState(false);

  useEffect(() => {
    setIntroDone(localStorage.getItem("badge_int_intro") === "true");
    setMethodoDone(localStorage.getItem("badge_int_methodo") === "true");
    setOutilsDone(localStorage.getItem("badge_int_outils") === "true");
  }, []);

  const completedModules = [introDone, methodoDone, outilsDone].filter(Boolean).length;
  const totalModules = 3;
  const progressPercentage = (completedModules / totalModules) * 100;

  const cardStyle = {
    background: "#0b0f1a",
    border: "1px solid #00ff9c",
    borderRadius: "8px",
    padding: "24px",
    textDecoration: "none",
    transition: "all 0.3s ease",
    cursor: "pointer",
    display: "block",
  };

  const disabledStyle = { opacity: 0.4, cursor: "not-allowed" };
  const titleStyle = { color: "#00ff9c", marginBottom: "10px", fontSize: "1.25rem", fontWeight: "600" };
  const textStyle = { color: "#9ca3af", marginBottom: "8px" };

  return (
    <main style={{ padding: "40px", maxWidth: "1200px", margin: "0 auto" }}>
      <h1 style={{ color: "#00ff9c", fontSize: "2rem", marginBottom: "10px" }}>
        Parcours IntermÃ©diaire OSINT
      </h1>
      <p style={{ color: "#9ca3af", marginBottom: "30px", fontSize: "1.1rem" }}>
        Approfondissez vos compÃ©tences : analyse critique, corrÃ©lation de sources et maÃ®trise d'outils professionnels.
      </p>

      {/* Barre de progression */}
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
            Progression du parcours
          </h3>
          <span style={{ 
            color: "#00ff9c", 
            fontWeight: "bold",
            fontSize: "1.1rem"
          }}>
            {completedModules}/{totalModules} modules complÃ©tÃ©s
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
            width: `${progressPercentage}%`,
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
            {progressPercentage > 0 && `${Math.round(progressPercentage)}%`}
          </div>
        </div>
      </div>

      {/* Modules */}
      <section style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", 
        gap: "24px" 
      }}>
        {/* Module 1: Introduction */}
        <Link 
          to="/parcours/intermediaire/introduction" 
          style={cardStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-4px)";
            e.currentTarget.style.boxShadow = "0 0 20px rgba(0,255,156,0.3)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "12px" }}>
            <h2 style={titleStyle}>Module 1: Introduction OSINT IntermÃ©diaire</h2>
            <span style={{ color: introDone ? "#00ff9c" : "#6b7280", fontSize: "1.5rem" }}>
              {introDone ? "â" : "â"}
            </span>
          </div>
          <p style={textStyle}>
            DÃ©veloppez votre esprit critique pour analyser et valider les informations de sources ouvertes.
          </p>
          <ul style={{ ...textStyle, paddingLeft: "20px", margin: "12px 0" }}>
            <li>Data vs Intelligence : hiÃ©rarchie de l'information</li>
            <li>Biais cognitifs et piÃ¨ges analytiques</li>
            <li>Freshness et validation temporelle</li>
          </ul>
          <p style={{ 
            ...textStyle, 
            color: introDone ? "#00ff9c" : "#6b7280",
            fontWeight: "bold",
            marginTop: "12px"
          }}>
            {introDone ? "â Module validÃ©" : "â AccÃ©der au module"}
          </p>
        </Link>

        {/* Module 2: MÃ©thodologie */}
        {introDone ? (
          <Link 
            to="/parcours/intermediaire/methodologie" 
            style={cardStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow = "0 0 20px rgba(0,255,156,0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "12px" }}>
              <h2 style={titleStyle}>Module 2: MÃ©thodologie Professionnelle</h2>
              <span style={{ color: methodoDone ? "#00ff9c" : "#6b7280", fontSize: "1.5rem" }}>
                {methodoDone ? "â" : "â"}
              </span>
            </div>
            <p style={textStyle}>
              MaÃ®trisez le cycle de renseignement complet et les techniques avancÃ©es de collecte et validation.
            </p>
            <ul style={{ ...textStyle, paddingLeft: "20px", margin: "12px 0" }}>
              <li>Cycle de renseignement en 6 Ã©tapes</li>
              <li>Pivoting et exploration multi-angles</li>
              <li>Validation croisÃ©e et journal d'investigation</li>
            </ul>
            <p style={{ 
              ...textStyle, 
              color: methodoDone ? "#00ff9c" : "#6b7280",
              fontWeight: "bold",
              marginTop: "12px"
            }}>
              {methodoDone ? "â Module validÃ©" : "â AccÃ©der au module"}
            </p>
          </Link>
        ) : (
          <div style={{ ...cardStyle, ...disabledStyle }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "12px" }}>
              <h2 style={titleStyle}>Module 2: MÃ©thodologie Professionnelle</h2>
              <span style={{ color: "#6b7280", fontSize: "1.5rem" }}>ð</span>
            </div>
            <p style={textStyle}>
              MaÃ®trisez le cycle de renseignement complet et les techniques avancÃ©es de collecte et validation.
            </p>
            <p style={{ ...textStyle, fontWeight: "bold", color: "#6b7280", marginTop: "12px" }}>
              ð ComplÃ©tez d'abord le Module 1
            </p>
          </div>
        )}

        {/* Module 3: Outils */}
        {methodoDone ? (
          <Link 
            to="/parcours/intermediaire/outils" 
            style={cardStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow = "0 0 20px rgba(0,255,156,0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "12px" }}>
              <h2 style={titleStyle}>Module 3: Outils Professionnels</h2>
              <span style={{ color: outilsDone ? "#00ff9c" : "#6b7280", fontSize: "1.5rem" }}>
                {outilsDone ? "â" : "â"}
              </span>
            </div>
            <p style={textStyle}>
              Exploitez des outils avancÃ©s d'automatisation, de cartographie et d'archivage pour vos investigations.
            </p>
            <ul style={{ ...textStyle, paddingLeft: "20px", margin: "12px 0" }}>
              <li>Maltego : graphes de relations et entitÃ©s</li>
              <li>SpiderFoot : automatisation de la reconnaissance</li>
              <li>Shodan avancÃ© et techniques d'archivage</li>
            </ul>
            <p style={{ 
              ...textStyle, 
              color: outilsDone ? "#00ff9c" : "#6b7280",
              fontWeight: "bold",
              marginTop: "12px"
            }}>
              {outilsDone ? "â Module validÃ©" : "â AccÃ©der au module"}
            </p>
          </Link>
        ) : (
          <div style={{ ...cardStyle, ...disabledStyle }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "12px" }}>
              <h2 style={titleStyle}>Module 3: Outils Professionnels</h2>
              <span style={{ color: "#6b7280", fontSize: "1.5rem" }}>ð</span>
            </div>
            <p style={textStyle}>
              Exploitez des outils avancÃ©s d'automatisation, de cartographie et d'archivage pour vos investigations.
            </p>
            <p style={{ ...textStyle, fontWeight: "bold", color: "#6b7280", marginTop: "12px" }}>
              ð ComplÃ©tez d'abord le Module 2
            </p>
          </div>
        )}
      </section>

      {/* Bouton de rÃ©initialisation */}
      <div style={{ textAlign: "center", marginTop: "50px" }}>
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
          ð RÃ©initialiser mon parcours
        </button>
      </div>

      {/* Pop-up de confirmation */}
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
              RÃ©initialiser le parcours IntermÃ©diaire ?
            </h3>
            <p style={{ color: "#9ca3af", marginBottom: "30px", lineHeight: "1.6" }}>
              Tous vos badges du parcours IntermÃ©diaire seront verrouillÃ©s et vous devrez complÃ©ter les modules Ã  nouveau. 
              Cette action est irrÃ©versible.
            </p>

            <div style={{ display: "flex", gap: "20px", justifyContent: "center" }}>
              <button
                onClick={() => {
                  localStorage.removeItem("badge_int_intro");
                  localStorage.removeItem("badge_int_methodo");
                  localStorage.removeItem("badge_int_outils");
                  localStorage.removeItem("cyberosint_game_state");
                  localStorage.removeItem("cyberosint_challenges");
                  setIntroDone(false);
                  setMethodoDone(false);
                  setOutilsDone(false);
                  setShowResetPopup(false);
                }}
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

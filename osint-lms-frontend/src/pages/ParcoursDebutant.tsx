import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function ParcoursDebutant() {
  const [introDone, setIntroDone] = useState(false);
  const [methodoDone, setMethodoDone] = useState(false);
  const [outilsDone, setOutilsDone] = useState(false);
  const [showResetPopup, setShowResetPopup] = useState(false);

  useEffect(() => {
    setIntroDone(localStorage.getItem("badge_deb_intro") === "true");
    setMethodoDone(localStorage.getItem("badge_deb_methodo") === "true");
    setOutilsDone(localStorage.getItem("badge_deb_outils") === "true");
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
        Parcours Débutant OSINT
      </h1>
      <p style={{ color: "#9ca3af", marginBottom: "30px", fontSize: "1.1rem" }}>
        Découvrez les fondamentaux de l'OSINT et apprenez à collecter, analyser et exploiter des informations publiques de manière éthique et légale.
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
            {completedModules}/{totalModules} modules complétés
          </span>
        </div>
        
        {/* Barre de progression visuelle */}
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

      <section style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", 
        gap: "24px" 
      }}>
        {/* Module 1: Introduction */}
        <Link to="/parcours/debutant/introduction" style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "12px" }}>
            <h2 style={titleStyle}>Module 1: Introduction OSINT</h2>
            <span style={{ 
              color: introDone ? "#00ff9c" : "#6b7280",
              fontSize: "1.5rem"
            }}>
              {introDone ? "✓" : "○"}
            </span>
          </div>
          <p style={textStyle}>
            Découvrez les concepts fondamentaux de l'Open Source Intelligence et son importance dans le monde moderne.
          </p>
          <ul style={{ ...textStyle, paddingLeft: "20px", margin: "12px 0" }}>
            <li>Définition et périmètre de l'OSINT</li>
            <li>Sources ouvertes et légalité</li>
            <li>Cas d'usage et applications</li>
            <li>Éthique et responsabilité</li>
          </ul>
          <p style={{ 
            ...textStyle, 
            color: introDone ? "#00ff9c" : "#6b7280",
            fontWeight: "bold",
            marginTop: "12px"
          }}>
            {introDone ? "✓ Module validé" : "→ Accéder au module"}
          </p>
        </Link>

        {/* Module 2: Méthodologie */}
        {introDone ? (
          <Link to="/parcours/debutant/methodologie" style={cardStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "12px" }}>
              <h2 style={titleStyle}>Module 2: Méthodologie OSINT</h2>
              <span style={{ 
                color: methodoDone ? "#00ff9c" : "#6b7280",
                fontSize: "1.5rem"
              }}>
                {methodoDone ? "✓" : "○"}
              </span>
            </div>
            <p style={textStyle}>
              Apprenez la méthodologie structurée pour mener des recherches OSINT efficaces et rigoureuses.
            </p>
            <ul style={{ ...textStyle, paddingLeft: "20px", margin: "12px 0" }}>
              <li>Cadrage et définition des objectifs</li>
              <li>Formulation d'hypothèses</li>
              <li>Collecte systématique</li>
              <li>Recoupement et validation</li>
            </ul>
            <p style={{ 
              ...textStyle, 
              color: methodoDone ? "#00ff9c" : "#6b7280",
              fontWeight: "bold",
              marginTop: "12px"
            }}>
              {methodoDone ? "✓ Module validé" : "→ Accéder au module"}
            </p>
          </Link>
        ) : (
          <div style={{ ...cardStyle, ...disabledStyle }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "12px" }}>
              <h2 style={titleStyle}>Module 2: Méthodologie OSINT</h2>
              <span style={{ color: "#6b7280", fontSize: "1.5rem" }}>🔒</span>
            </div>
            <p style={textStyle}>
              Apprenez la méthodologie structurée pour mener des recherches OSINT efficaces et rigoureuses.
            </p>
            <p style={{ ...textStyle, fontWeight: "bold", color: "#6b7280", marginTop: "12px" }}>
              🔒 Complétez d'abord le Module 1
            </p>
          </div>
        )}

        {/* Module 3: Outils */}
        {introDone && methodoDone ? (
          <Link to="/parcours/debutant/outils" style={cardStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "12px" }}>
              <h2 style={titleStyle}>Module 3: Outils OSINT</h2>
              <span style={{ 
                color: outilsDone ? "#00ff9c" : "#6b7280",
                fontSize: "1.5rem"
              }}>
                {outilsDone ? "✓" : "○"}
              </span>
            </div>
            <p style={textStyle}>
              Maîtrisez les outils essentiels pour débuter en OSINT et automatiser vos premières recherches.
            </p>
            <ul style={{ ...textStyle, paddingLeft: "20px", margin: "12px 0" }}>
              <li>Google Dorks et recherche avancée</li>
              <li>Shodan pour la reconnaissance</li>
              <li>Sherlock et outils d'identification</li>
              <li>Maltego pour la visualisation</li>
            </ul>
            <p style={{ 
              ...textStyle, 
              color: outilsDone ? "#00ff9c" : "#6b7280",
              fontWeight: "bold",
              marginTop: "12px"
            }}>
              {outilsDone ? "✓ Module validé" : "→ Accéder au module"}
            </p>
          </Link>
        ) : (
          <div style={{ ...cardStyle, ...disabledStyle }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "12px" }}>
              <h2 style={titleStyle}>Module 3: Outils OSINT</h2>
              <span style={{ color: "#6b7280", fontSize: "1.5rem" }}>🔒</span>
            </div>
            <p style={textStyle}>
              Maîtrisez les outils essentiels pour débuter en OSINT et automatiser vos premières recherches.
            </p>
            <p style={{ ...textStyle, fontWeight: "bold", color: "#6b7280", marginTop: "12px" }}>
              🔒 Complétez d'abord les Modules 1 et 2
            </p>
          </div>
        )}
      </section>

      {/* Bouton de réinitialisation */}
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
          🔄 Réinitialiser mon parcours
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
              Réinitialiser le parcours ?
            </h3>
            <p style={{ color: "#9ca3af", marginBottom: "30px", lineHeight: "1.6" }}>
              Tous les badges de ce parcours seront verrouillés et vous devrez les compléter à nouveau. 
              Cette action est irréversible.
            </p>

            <div style={{ display: "flex", gap: "20px", justifyContent: "center" }}>
              <button
                onClick={() => {
                  localStorage.removeItem("badge_deb_intro");
                  localStorage.removeItem("badge_deb_methodo");
                  localStorage.removeItem("badge_deb_outils");
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
                ✓ Confirmer
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

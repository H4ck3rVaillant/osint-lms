import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useThemeColors } from "../context/ThemeContext";

export default function ParcoursDebutant() {
  const colors = useThemeColors();
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
    background: colors.bgPrimary,
    border: `1px solid ${colors.accent}`,
    borderRadius: "8px",
    padding: "24px",
    textDecoration: "none",
    transition: "all 0.3s ease",
    cursor: "pointer",
    display: "block",
    boxShadow: `0 2px 8px ${colors.shadow}`,
  };

  const disabledStyle = { opacity: 0.4, cursor: "not-allowed" };
  const titleStyle = { color: colors.accent, marginBottom: "10px", fontSize: "1.25rem", fontWeight: "600" };
  const textStyle = { color: colors.textSecondary, marginBottom: "8px" };

  return (
    <main style={{ padding: "40px", maxWidth: "1200px", margin: "0 auto" }}>
      <h1 style={{ color: colors.accent, fontSize: "2rem", marginBottom: "10px" }}>
        Parcours Débutant OSINT
      </h1>
      <p style={{ color: colors.textSecondary, marginBottom: "30px", fontSize: "1.1rem" }}>
        Découvrez les fondamentaux de l'OSINT et apprenez à collecter, analyser et exploiter des informations publiques de manière éthique et légale.
      </p>

      {/* Barre de progression */}
      <div style={{ 
        background: colors.bgPrimary, 
        border: `1px solid ${colors.accent}`, 
        borderRadius: "8px", 
        padding: "24px",
        marginBottom: "30px",
        boxShadow: `0 2px 8px ${colors.shadow}`
      }}>
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          marginBottom: "12px"
        }}>
          <h3 style={{ color: colors.accent, margin: 0, fontSize: "1.1rem" }}>
            Progression du parcours
          </h3>
          <span style={{ 
            color: colors.accent, 
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
          background: colors.bgSecondary,
          borderRadius: "12px",
          overflow: "hidden",
          border: `1px solid ${colors.border}`
        }}>
          <div style={{
            width: `${progressPercentage}%`,
            height: "100%",
            background: `linear-gradient(90deg, ${colors.accent} 0%, ${colors.accentHover} 100%)`,
            transition: "width 0.5s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#ffffff",
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
        <Link 
          to="/parcours/debutant/introduction" 
          style={cardStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-4px)";
            e.currentTarget.style.boxShadow = `0 8px 20px ${colors.shadow}`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = `0 2px 8px ${colors.shadow}`;
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "12px" }}>
            <h2 style={titleStyle}>Module 1: Introduction OSINT</h2>
            <span style={{ 
              color: introDone ? colors.accent : colors.textTertiary,
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
            color: introDone ? colors.accent : colors.textTertiary,
            fontWeight: "bold",
            marginTop: "12px"
          }}>
            {introDone ? "✓ Module validé" : "→ Accéder au module"}
          </p>
        </Link>

        {/* Module 2: Méthodologie */}
        {introDone ? (
          <Link 
            to="/parcours/debutant/methodologie" 
            style={cardStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow = `0 8px 20px ${colors.shadow}`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = `0 2px 8px ${colors.shadow}`;
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "12px" }}>
              <h2 style={titleStyle}>Module 2: Méthodologie OSINT</h2>
              <span style={{ 
                color: methodoDone ? colors.accent : colors.textTertiary,
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
              color: methodoDone ? colors.accent : colors.textTertiary,
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
              <span style={{ color: colors.textTertiary, fontSize: "1.5rem" }}>🔒</span>
            </div>
            <p style={textStyle}>
              Apprenez la méthodologie structurée pour mener des recherches OSINT efficaces et rigoureuses.
            </p>
            <p style={{ ...textStyle, fontWeight: "bold", color: colors.textTertiary, marginTop: "12px" }}>
              🔒 Complétez d'abord le Module 1
            </p>
          </div>
        )}

        {/* Module 3: Outils */}
        {introDone && methodoDone ? (
          <Link 
            to="/parcours/debutant/outils" 
            style={cardStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow = `0 8px 20px ${colors.shadow}`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = `0 2px 8px ${colors.shadow}`;
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "12px" }}>
              <h2 style={titleStyle}>Module 3: Outils OSINT</h2>
              <span style={{ 
                color: outilsDone ? colors.accent : colors.textTertiary,
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
              color: outilsDone ? colors.accent : colors.textTertiary,
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
              <span style={{ color: colors.textTertiary, fontSize: "1.5rem" }}>🔒</span>
            </div>
            <p style={textStyle}>
              Maîtrisez les outils essentiels pour débuter en OSINT et automatiser vos premières recherches.
            </p>
            <p style={{ ...textStyle, fontWeight: "bold", color: colors.textTertiary, marginTop: "12px" }}>
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
            background: colors.bgPrimary,
            color: colors.accent,
            border: `2px solid ${colors.accent}`,
            padding: "14px 32px",
            borderRadius: "8px",
            fontSize: "1rem",
            fontWeight: "bold",
            cursor: "pointer",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = colors.accent;
            e.currentTarget.style.color = "#ffffff";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = colors.bgPrimary;
            e.currentTarget.style.color = colors.accent;
          }}
        >
          🔄 Réinitialiser mon parcours
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
          background: colors.overlay,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
        }}>
          <div style={{
            background: colors.bgPrimary,
            border: `2px solid ${colors.accent}`,
            borderRadius: "12px",
            padding: "40px",
            maxWidth: "500px",
            textAlign: "center",
            boxShadow: `0 10px 40px ${colors.shadow}`,
          }}>
            <h3 style={{ color: colors.accent, marginBottom: "15px", fontSize: "1.5rem" }}>
              Réinitialiser le parcours ?
            </h3>
            <p style={{ color: colors.textSecondary, marginBottom: "30px", lineHeight: "1.6" }}>
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
                  background: colors.accent,
                  color: "#ffffff",
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
                  border: `2px solid ${colors.accent}`,
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

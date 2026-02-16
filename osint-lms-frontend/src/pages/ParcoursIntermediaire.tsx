import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useThemeColors } from "../context/ThemeContext";

export default function ParcoursIntermediaire() {
  const colors = useThemeColors();
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
        Parcours Intermédiaire OSINT
      </h1>
      <p style={{ color: colors.textSecondary, marginBottom: "30px", fontSize: "1.1rem" }}>
        Approfondissez vos compétences : analyse critique, corrélation de sources et maîtrise d'outils professionnels.
      </p>

      <div style={{ 
        background: colors.bgPrimary, 
        border: `1px solid ${colors.accent}`, 
        borderRadius: "8px", 
        padding: "24px",
        marginBottom: "30px",
        boxShadow: `0 2px 8px ${colors.shadow}`
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
          <h3 style={{ color: colors.accent, margin: 0, fontSize: "1.1rem" }}>Progression du parcours</h3>
          <span style={{ color: colors.accent, fontWeight: "bold", fontSize: "1.1rem" }}>
            {completedModules}/{totalModules} modules complétés
          </span>
        </div>
        
        <div style={{
          width: "100%", height: "24px", background: colors.bgSecondary, borderRadius: "12px",
          overflow: "hidden", border: `1px solid ${colors.border}`
        }}>
          <div style={{
            width: `${progressPercentage}%`, height: "100%",
            background: `linear-gradient(90deg, ${colors.accent} 0%, ${colors.accentHover} 100%)`,
            transition: "width 0.5s ease", display: "flex", alignItems: "center", justifyContent: "center",
            color: "#ffffff", fontWeight: "bold", fontSize: "0.875rem"
          }}>
            {progressPercentage > 0 && `${Math.round(progressPercentage)}%`}
          </div>
        </div>
      </div>

      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>
        
        <Link to="/parcours/intermediaire/introduction" style={cardStyle}
          onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = `0 8px 20px ${colors.shadow}`; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = `0 2px 8px ${colors.shadow}`; }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "12px" }}>
            <h2 style={titleStyle}>Module 1: Introduction OSINT Intermédiaire</h2>
            <span style={{ color: introDone ? colors.accent : colors.textTertiary, fontSize: "1.5rem" }}>
              {introDone ? "✓" : "○"}
            </span>
          </div>
          <p style={textStyle}>Développez votre esprit critique pour analyser et valider les informations de sources ouvertes.</p>
          <ul style={{ ...textStyle, paddingLeft: "20px", margin: "12px 0" }}>
            <li>Data vs Intelligence : hiérarchie de l'information</li>
            <li>Biais cognitifs et pièges analytiques</li>
            <li>Freshness et validation temporelle</li>
          </ul>
          <p style={{ ...textStyle, color: introDone ? colors.accent : colors.textTertiary, fontWeight: "bold", marginTop: "12px" }}>
            {introDone ? "✓ Module validé" : "→ Accéder au module"}
          </p>
        </Link>

        {introDone ? (
          <Link to="/parcours/intermediaire/methodologie" style={cardStyle}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = `0 8px 20px ${colors.shadow}`; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = `0 2px 8px ${colors.shadow}`; }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "12px" }}>
              <h2 style={titleStyle}>Module 2: Méthodologie Professionnelle</h2>
              <span style={{ color: methodoDone ? colors.accent : colors.textTertiary, fontSize: "1.5rem" }}>
                {methodoDone ? "✓" : "○"}
              </span>
            </div>
            <p style={textStyle}>Maîtrisez le cycle de renseignement complet et les techniques avancées de collecte et validation.</p>
            <ul style={{ ...textStyle, paddingLeft: "20px", margin: "12px 0" }}>
              <li>Cycle de renseignement en 6 étapes</li>
              <li>Pivoting et exploration multi-angles</li>
              <li>Validation croisée et journal d'investigation</li>
            </ul>
            <p style={{ ...textStyle, color: methodoDone ? colors.accent : colors.textTertiary, fontWeight: "bold", marginTop: "12px" }}>
              {methodoDone ? "✓ Module validé" : "→ Accéder au module"}
            </p>
          </Link>
        ) : (
          <div style={{ ...cardStyle, ...disabledStyle }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "12px" }}>
              <h2 style={titleStyle}>Module 2: Méthodologie Professionnelle</h2>
              <span style={{ color: colors.textTertiary, fontSize: "1.5rem" }}>🔒</span>
            </div>
            <p style={textStyle}>Maîtrisez le cycle de renseignement complet et les techniques avancées de collecte et validation.</p>
            <p style={{ ...textStyle, fontWeight: "bold", color: colors.textTertiary, marginTop: "12px" }}>
              🔒 Complétez d'abord le Module 1
            </p>
          </div>
        )}

        {methodoDone ? (
          <Link to="/parcours/intermediaire/outils" style={cardStyle}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = `0 8px 20px ${colors.shadow}`; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = `0 2px 8px ${colors.shadow}`; }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "12px" }}>
              <h2 style={titleStyle}>Module 3: Outils Professionnels</h2>
              <span style={{ color: outilsDone ? colors.accent : colors.textTertiary, fontSize: "1.5rem" }}>
                {outilsDone ? "✓" : "○"}
              </span>
            </div>
            <p style={textStyle}>Exploitez des outils avancés d'automatisation, de cartographie et d'archivage pour vos investigations.</p>
            <ul style={{ ...textStyle, paddingLeft: "20px", margin: "12px 0" }}>
              <li>Maltego : graphes de relations et entités</li>
              <li>SpiderFoot : automatisation de la reconnaissance</li>
              <li>Shodan avancé et techniques d'archivage</li>
            </ul>
            <p style={{ ...textStyle, color: outilsDone ? colors.accent : colors.textTertiary, fontWeight: "bold", marginTop: "12px" }}>
              {outilsDone ? "✓ Module validé" : "→ Accéder au module"}
            </p>
          </Link>
        ) : (
          <div style={{ ...cardStyle, ...disabledStyle }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "12px" }}>
              <h2 style={titleStyle}>Module 3: Outils Professionnels</h2>
              <span style={{ color: colors.textTertiary, fontSize: "1.5rem" }}>🔒</span>
            </div>
            <p style={textStyle}>Exploitez des outils avancés d'automatisation, de cartographie et d'archivage pour vos investigations.</p>
            <p style={{ ...textStyle, fontWeight: "bold", color: colors.textTertiary, marginTop: "12px" }}>
              🔒 Complétez d'abord le Module 2
            </p>
          </div>
        )}
      </section>

      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <button onClick={() => setShowResetPopup(true)} style={{
            background: colors.bgPrimary, color: colors.accent, border: `2px solid ${colors.accent}`,
            padding: "14px 32px", borderRadius: "8px", fontSize: "1rem", fontWeight: "bold",
            cursor: "pointer", transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = colors.accent; e.currentTarget.style.color = "#ffffff"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = colors.bgPrimary; e.currentTarget.style.color = colors.accent; }}
        >
          🔄 Réinitialiser mon parcours
        </button>
      </div>

      {showResetPopup && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: colors.overlay,
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ background: colors.bgPrimary, border: `2px solid ${colors.accent}`, borderRadius: "12px",
            padding: "40px", maxWidth: "500px", textAlign: "center", boxShadow: `0 10px 40px ${colors.shadow}` }}>
            <h3 style={{ color: colors.accent, marginBottom: "15px", fontSize: "1.5rem" }}>
              Réinitialiser le parcours Intermédiaire ?
            </h3>
            <p style={{ color: colors.textSecondary, marginBottom: "30px", lineHeight: "1.6" }}>
              Tous vos badges du parcours Intermédiaire seront verrouillés et vous devrez compléter les modules à nouveau. Cette action est irréversible.
            </p>
            <div style={{ display: "flex", gap: "20px", justifyContent: "center" }}>
              <button onClick={() => {
                  localStorage.removeItem("badge_int_intro");
                  localStorage.removeItem("badge_int_methodo");
                  localStorage.removeItem("badge_int_outils");
                  setIntroDone(false); setMethodoDone(false); setOutilsDone(false); setShowResetPopup(false);
                }}
                style={{ padding: "12px 28px", background: colors.accent, color: "#ffffff", borderRadius: "8px",
                  cursor: "pointer", border: "none", fontWeight: "bold", fontSize: "1rem" }}>
                ✓ Confirmer
              </button>
              <button onClick={() => setShowResetPopup(false)}
                style={{ padding: "12px 28px", background: "transparent", color: colors.accent,
                  border: `2px solid ${colors.accent}`, borderRadius: "8px", cursor: "pointer",
                  fontWeight: "bold", fontSize: "1rem" }}>
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

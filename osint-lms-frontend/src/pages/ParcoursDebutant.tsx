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
    border: `2px solid ${colors.border}`,
    borderRadius: "12px",
    padding: "28px",
    textDecoration: "none",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    cursor: "pointer",
    display: "block",
    boxShadow: `0 1px 3px ${colors.shadow}, 0 1px 2px ${colors.shadow}`,
  };

  const disabledStyle = { 
    opacity: 0.5, 
    cursor: "not-allowed",
    filter: "grayscale(0.3)"
  };

  return (
    <main style={{ 
      padding: "40px 20px", 
      maxWidth: "1200px", 
      margin: "0 auto",
      background: `linear-gradient(to bottom, ${colors.bgPrimary}, ${colors.bgSecondary})`
    }}>
      
      {/* Header avec gradient */}
      <div style={{ marginBottom: "40px" }}>
        <h1 style={{ 
          color: colors.textPrimary, 
          fontSize: "2.5rem", 
          marginBottom: "12px",
          fontWeight: "700",
          background: `linear-gradient(135deg, ${colors.accent}, #8b5cf6)`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text"
        }}>
          🟢 Parcours Débutant OSINT
        </h1>
        <p style={{ 
          color: colors.textSecondary, 
          fontSize: "1.15rem",
          lineHeight: "1.7",
          maxWidth: "800px"
        }}>
          Découvrez les fondamentaux de l'OSINT et apprenez à collecter, analyser et exploiter des informations publiques de manière éthique et légale.
        </p>
      </div>

      {/* Barre de progression PREMIUM */}
      <div style={{ 
        background: `linear-gradient(135deg, ${colors.bgPrimary}, ${colors.bgSecondary})`,
        border: `2px solid ${colors.accent}`,
        borderRadius: "16px", 
        padding: "32px",
        marginBottom: "40px",
        boxShadow: `0 10px 40px ${colors.shadow}, 0 0 0 1px ${colors.borderLight}`,
        position: "relative",
        overflow: "hidden"
      }}>
        {/* Glow effect background */}
        <div style={{
          position: "absolute",
          top: "-50%",
          right: "-10%",
          width: "300px",
          height: "300px",
          background: `radial-gradient(circle, ${colors.accent}15, transparent)`,
          borderRadius: "50%",
          pointerEvents: "none"
        }} />
        
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          marginBottom: "20px",
          position: "relative",
          zIndex: 1
        }}>
          <h3 style={{ 
            color: colors.textPrimary, 
            margin: 0, 
            fontSize: "1.3rem",
            fontWeight: "600",
            display: "flex",
            alignItems: "center",
            gap: "10px"
          }}>
            <span style={{
              background: colors.accent,
              color: "#fff",
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.2rem"
            }}>📊</span>
            Progression du parcours
          </h3>
          <span style={{ 
            background: colors.accentDark,
            color: colors.accent,
            padding: "8px 16px",
            borderRadius: "20px",
            fontWeight: "700",
            fontSize: "1.1rem",
            border: `2px solid ${colors.accent}`
          }}>
            {completedModules}/{totalModules} modules
          </span>
        </div>
        
        {/* Progress bar avec gradient */}
        <div style={{
          width: "100%",
          height: "32px",
          background: colors.bgSecondary,
          borderRadius: "16px",
          overflow: "hidden",
          border: `2px solid ${colors.border}`,
          position: "relative",
          boxShadow: `inset 0 2px 4px ${colors.shadow}`
        }}>
          <div style={{
            width: `${progressPercentage}%`,
            height: "100%",
            background: `linear-gradient(90deg, ${colors.accent}, #8b5cf6)`,
            transition: "width 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            paddingRight: "12px",
            color: "#ffffff",
            fontWeight: "700",
            fontSize: "0.9rem",
            boxShadow: `0 0 20px ${colors.accent}50`
          }}>
            {progressPercentage > 5 && `${Math.round(progressPercentage)}%`}
          </div>
        </div>
      </div>

      <section style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", 
        gap: "28px" 
      }}>
        {/* Module 1: Introduction - PREMIUM CARD */}
        <Link 
          to="/parcours/debutant/introduction" 
          style={{
            ...cardStyle,
            borderColor: introDone ? "#10b981" : colors.border,
            background: introDone 
              ? `linear-gradient(135deg, #ecfdf520, ${colors.bgPrimary})`
              : colors.bgPrimary
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-8px) scale(1.02)";
            e.currentTarget.style.boxShadow = `0 20px 40px ${colors.shadow}, 0 0 0 2px ${colors.accent}`;
            e.currentTarget.style.borderColor = colors.accent;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0) scale(1)";
            e.currentTarget.style.boxShadow = `0 1px 3px ${colors.shadow}`;
            e.currentTarget.style.borderColor = introDone ? "#10b981" : colors.border;
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "16px" }}>
            <div style={{ flex: 1 }}>
              <div style={{
                display: "inline-block",
                background: colors.accentDark,
                color: colors.accent,
                padding: "4px 12px",
                borderRadius: "6px",
                fontSize: "0.75rem",
                fontWeight: "600",
                marginBottom: "12px"
              }}>
                MODULE 1
              </div>
              <h2 style={{ 
                color: colors.textPrimary, 
                margin: "0 0 8px 0", 
                fontSize: "1.4rem", 
                fontWeight: "700",
                lineHeight: "1.3"
              }}>
                Introduction OSINT
              </h2>
            </div>
            <span style={{ 
              color: introDone ? "#10b981" : colors.textTertiary,
              fontSize: "2rem",
              marginLeft: "16px",
              filter: introDone ? "drop-shadow(0 0 8px #10b98150)" : "none"
            }}>
              {introDone ? "✓" : "○"}
            </span>
          </div>

          <p style={{ 
            color: colors.textSecondary, 
            fontSize: "0.95rem", 
            marginBottom: "16px", 
            lineHeight: "1.6" 
          }}>
            Découvrez les concepts fondamentaux de l'Open Source Intelligence et son importance dans le monde moderne.
          </p>

          <div style={{
            background: colors.bgSecondary,
            borderRadius: "10px",
            padding: "16px",
            marginBottom: "16px"
          }}>
            <ul style={{ 
              color: colors.textSecondary, 
              fontSize: "0.9rem",
              paddingLeft: "20px", 
              margin: 0,
              lineHeight: "1.8"
            }}>
              <li>Définition et périmètre de l'OSINT</li>
              <li>Sources ouvertes et légalité</li>
              <li>Cas d'usage et applications</li>
              <li>Éthique et responsabilité</li>
            </ul>
          </div>

          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "12px 16px",
            background: introDone ? "#ecfdf5" : colors.bgSecondary,
            borderRadius: "8px",
            border: `1px solid ${introDone ? "#10b981" : colors.border}`
          }}>
            <span style={{ 
              color: introDone ? "#10b981" : colors.accent,
              fontWeight: "700",
              fontSize: "0.95rem"
            }}>
              {introDone ? "✓ Module validé" : "→ Accéder au module"}
            </span>
          </div>
        </Link>

        {/* Module 2: Méthodologie */}
        {introDone ? (
          <Link 
            to="/parcours/debutant/methodologie" 
            style={{
              ...cardStyle,
              borderColor: methodoDone ? "#10b981" : colors.border,
              background: methodoDone 
                ? `linear-gradient(135deg, #ecfdf520, ${colors.bgPrimary})`
                : colors.bgPrimary
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-8px) scale(1.02)";
              e.currentTarget.style.boxShadow = `0 20px 40px ${colors.shadow}, 0 0 0 2px ${colors.accent}`;
              e.currentTarget.style.borderColor = colors.accent;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0) scale(1)";
              e.currentTarget.style.boxShadow = `0 1px 3px ${colors.shadow}`;
              e.currentTarget.style.borderColor = methodoDone ? "#10b981" : colors.border;
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "16px" }}>
              <div style={{ flex: 1 }}>
                <div style={{
                  display: "inline-block",
                  background: colors.accentDark,
                  color: colors.accent,
                  padding: "4px 12px",
                  borderRadius: "6px",
                  fontSize: "0.75rem",
                  fontWeight: "600",
                  marginBottom: "12px"
                }}>
                  MODULE 2
                </div>
                <h2 style={{ 
                  color: colors.textPrimary, 
                  margin: "0 0 8px 0", 
                  fontSize: "1.4rem", 
                  fontWeight: "700",
                  lineHeight: "1.3"
                }}>
                  Méthodologie OSINT
                </h2>
              </div>
              <span style={{ 
                color: methodoDone ? "#10b981" : colors.textTertiary,
                fontSize: "2rem",
                marginLeft: "16px",
                filter: methodoDone ? "drop-shadow(0 0 8px #10b98150)" : "none"
              }}>
                {methodoDone ? "✓" : "○"}
              </span>
            </div>

            <p style={{ 
              color: colors.textSecondary, 
              fontSize: "0.95rem", 
              marginBottom: "16px", 
              lineHeight: "1.6" 
            }}>
              Apprenez la méthodologie structurée pour mener des recherches OSINT efficaces et rigoureuses.
            </p>

            <div style={{
              background: colors.bgSecondary,
              borderRadius: "10px",
              padding: "16px",
              marginBottom: "16px"
            }}>
              <ul style={{ 
                color: colors.textSecondary, 
                fontSize: "0.9rem",
                paddingLeft: "20px", 
                margin: 0,
                lineHeight: "1.8"
              }}>
                <li>Cadrage et définition des objectifs</li>
                <li>Formulation d'hypothèses</li>
                <li>Collecte systématique</li>
                <li>Recoupement et validation</li>
              </ul>
            </div>

            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 16px",
              background: methodoDone ? "#ecfdf5" : colors.bgSecondary,
              borderRadius: "8px",
              border: `1px solid ${methodoDone ? "#10b981" : colors.border}`
            }}>
              <span style={{ 
                color: methodoDone ? "#10b981" : colors.accent,
                fontWeight: "700",
                fontSize: "0.95rem"
              }}>
                {methodoDone ? "✓ Module validé" : "→ Accéder au module"}
              </span>
            </div>
          </Link>
        ) : (
          <div style={{ ...cardStyle, ...disabledStyle }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "16px" }}>
              <div style={{ flex: 1 }}>
                <div style={{
                  display: "inline-block",
                  background: colors.bgTertiary,
                  color: colors.textTertiary,
                  padding: "4px 12px",
                  borderRadius: "6px",
                  fontSize: "0.75rem",
                  fontWeight: "600",
                  marginBottom: "12px"
                }}>
                  MODULE 2
                </div>
                <h2 style={{ 
                  color: colors.textSecondary, 
                  margin: "0 0 8px 0", 
                  fontSize: "1.4rem", 
                  fontWeight: "700"
                }}>
                  Méthodologie OSINT
                </h2>
              </div>
              <span style={{ color: colors.textTertiary, fontSize: "2rem", marginLeft: "16px" }}>🔒</span>
            </div>

            <p style={{ color: colors.textTertiary, fontSize: "0.95rem", marginBottom: "16px" }}>
              Apprenez la méthodologie structurée pour mener des recherches OSINT efficaces et rigoureuses.
            </p>

            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 16px",
              background: colors.bgTertiary,
              borderRadius: "8px",
              border: `1px solid ${colors.border}`
            }}>
              <span style={{ color: colors.textTertiary, fontWeight: "600", fontSize: "0.9rem" }}>
                🔒 Complétez d'abord le Module 1
              </span>
            </div>
          </div>
        )}

        {/* Module 3: Outils */}
        {introDone && methodoDone ? (
          <Link 
            to="/parcours/debutant/outils" 
            style={{
              ...cardStyle,
              borderColor: outilsDone ? "#10b981" : colors.border,
              background: outilsDone 
                ? `linear-gradient(135deg, #ecfdf520, ${colors.bgPrimary})`
                : colors.bgPrimary
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-8px) scale(1.02)";
              e.currentTarget.style.boxShadow = `0 20px 40px ${colors.shadow}, 0 0 0 2px ${colors.accent}`;
              e.currentTarget.style.borderColor = colors.accent;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0) scale(1)";
              e.currentTarget.style.boxShadow = `0 1px 3px ${colors.shadow}`;
              e.currentTarget.style.borderColor = outilsDone ? "#10b981" : colors.border;
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "16px" }}>
              <div style={{ flex: 1 }}>
                <div style={{
                  display: "inline-block",
                  background: colors.accentDark,
                  color: colors.accent,
                  padding: "4px 12px",
                  borderRadius: "6px",
                  fontSize: "0.75rem",
                  fontWeight: "600",
                  marginBottom: "12px"
                }}>
                  MODULE 3
                </div>
                <h2 style={{ 
                  color: colors.textPrimary, 
                  margin: "0 0 8px 0", 
                  fontSize: "1.4rem", 
                  fontWeight: "700",
                  lineHeight: "1.3"
                }}>
                  Outils OSINT
                </h2>
              </div>
              <span style={{ 
                color: outilsDone ? "#10b981" : colors.textTertiary,
                fontSize: "2rem",
                marginLeft: "16px",
                filter: outilsDone ? "drop-shadow(0 0 8px #10b98150)" : "none"
              }}>
                {outilsDone ? "✓" : "○"}
              </span>
            </div>

            <p style={{ 
              color: colors.textSecondary, 
              fontSize: "0.95rem", 
              marginBottom: "16px", 
              lineHeight: "1.6" 
            }}>
              Maîtrisez les outils essentiels pour débuter en OSINT et automatiser vos premières recherches.
            </p>

            <div style={{
              background: colors.bgSecondary,
              borderRadius: "10px",
              padding: "16px",
              marginBottom: "16px"
            }}>
              <ul style={{ 
                color: colors.textSecondary, 
                fontSize: "0.9rem",
                paddingLeft: "20px", 
                margin: 0,
                lineHeight: "1.8"
              }}>
                <li>Google Dorks et recherche avancée</li>
                <li>Shodan pour la reconnaissance</li>
                <li>Sherlock et outils d'identification</li>
                <li>Maltego pour la visualisation</li>
              </ul>
            </div>

            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 16px",
              background: outilsDone ? "#ecfdf5" : colors.bgSecondary,
              borderRadius: "8px",
              border: `1px solid ${outilsDone ? "#10b981" : colors.border}`
            }}>
              <span style={{ 
                color: outilsDone ? "#10b981" : colors.accent,
                fontWeight: "700",
                fontSize: "0.95rem"
              }}>
                {outilsDone ? "✓ Module validé" : "→ Accéder au module"}
              </span>
            </div>
          </Link>
        ) : (
          <div style={{ ...cardStyle, ...disabledStyle }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "16px" }}>
              <div style={{ flex: 1 }}>
                <div style={{
                  display: "inline-block",
                  background: colors.bgTertiary,
                  color: colors.textTertiary,
                  padding: "4px 12px",
                  borderRadius: "6px",
                  fontSize: "0.75rem",
                  fontWeight: "600",
                  marginBottom: "12px"
                }}>
                  MODULE 3
                </div>
                <h2 style={{ 
                  color: colors.textSecondary, 
                  margin: "0 0 8px 0", 
                  fontSize: "1.4rem", 
                  fontWeight: "700"
                }}>
                  Outils OSINT
                </h2>
              </div>
              <span style={{ color: colors.textTertiary, fontSize: "2rem", marginLeft: "16px" }}>🔒</span>
            </div>

            <p style={{ color: colors.textTertiary, fontSize: "0.95rem", marginBottom: "16px" }}>
              Maîtrisez les outils essentiels pour débuter en OSINT et automatiser vos premières recherches.
            </p>

            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 16px",
              background: colors.bgTertiary,
              borderRadius: "8px",
              border: `1px solid ${colors.border}`
            }}>
              <span style={{ color: colors.textTertiary, fontWeight: "600", fontSize: "0.9rem" }}>
                🔒 Complétez d'abord les Modules 1 et 2
              </span>
            </div>
          </div>
        )}
      </section>

      {/* Bouton de réinitialisation PREMIUM */}
      <div style={{ textAlign: "center", marginTop: "60px" }}>
        <button
          onClick={() => setShowResetPopup(true)}
          style={{
            background: colors.bgPrimary,
            color: colors.textSecondary,
            border: `2px solid ${colors.border}`,
            padding: "16px 32px",
            borderRadius: "12px",
            fontSize: "1rem",
            fontWeight: "600",
            cursor: "pointer",
            transition: "all 0.3s ease",
            boxShadow: `0 2px 8px ${colors.shadow}`
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = colors.bgSecondary;
            e.currentTarget.style.borderColor = colors.accent;
            e.currentTarget.style.color = colors.accent;
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = `0 8px 16px ${colors.shadow}`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = colors.bgPrimary;
            e.currentTarget.style.borderColor = colors.border;
            e.currentTarget.style.color = colors.textSecondary;
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = `0 2px 8px ${colors.shadow}`;
          }}
        >
          🔄 Réinitialiser mon parcours
        </button>
      </div>

      {/* Pop-up PREMIUM */}
      {showResetPopup && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: colors.overlay,
          backdropFilter: "blur(8px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          animation: "fadeIn 0.2s ease"
        }}>
          <div style={{
            background: colors.bgPrimary,
            border: `2px solid ${colors.accent}`,
            borderRadius: "20px",
            padding: "48px",
            maxWidth: "500px",
            textAlign: "center",
            boxShadow: `0 20px 60px ${colors.shadow}, 0 0 0 1px ${colors.borderLight}`,
            animation: "slideUp 0.3s ease"
          }}>
            <div style={{
              width: "64px",
              height: "64px",
              background: `linear-gradient(135deg, ${colors.accent}, #8b5cf6)`,
              borderRadius: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "2rem",
              margin: "0 auto 24px",
              boxShadow: `0 8px 20px ${colors.accent}30`
            }}>
              ⚠️
            </div>

            <h3 style={{ 
              color: colors.textPrimary, 
              marginBottom: "16px", 
              fontSize: "1.6rem",
              fontWeight: "700"
            }}>
              Réinitialiser le parcours ?
            </h3>
            <p style={{ 
              color: colors.textSecondary, 
              marginBottom: "32px", 
              lineHeight: "1.7",
              fontSize: "1.05rem"
            }}>
              Tous les badges de ce parcours seront verrouillés et vous devrez les compléter à nouveau. Cette action est irréversible.
            </p>

            <div style={{ display: "flex", gap: "16px", justifyContent: "center" }}>
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
                  padding: "14px 32px",
                  background: `linear-gradient(135deg, ${colors.accent}, #8b5cf6)`,
                  color: "#ffffff",
                  borderRadius: "10px",
                  cursor: "pointer",
                  border: "none",
                  fontWeight: "700",
                  fontSize: "1rem",
                  boxShadow: `0 4px 12px ${colors.accent}40`,
                  transition: "all 0.2s"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = `0 8px 20px ${colors.accent}50`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = `0 4px 12px ${colors.accent}40`;
                }}
              >
                ✓ Confirmer
              </button>
              <button
                onClick={() => setShowResetPopup(false)}
                style={{
                  padding: "14px 32px",
                  background: colors.bgSecondary,
                  color: colors.textPrimary,
                  border: `2px solid ${colors.border}`,
                  borderRadius: "10px",
                  cursor: "pointer",
                  fontWeight: "600",
                  fontSize: "1rem",
                  transition: "all 0.2s"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = colors.bgTertiary;
                  e.currentTarget.style.borderColor = colors.accent;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = colors.bgSecondary;
                  e.currentTarget.style.borderColor = colors.border;
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

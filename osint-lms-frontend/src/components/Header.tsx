import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../auth/AuthContext";
import { useThemeColors } from "../context/ThemeContext";
import Logo from "../assets/images/Logo.png";

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const colors = useThemeColors();
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isToolsDropdownOpen, setIsToolsDropdownOpen] = useState(false);
  const [isModulesDropdownOpen, setIsModulesDropdownOpen] = useState(false);
  
  const toolsRef = useRef<HTMLDivElement>(null);
  const modulesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (toolsRef.current && !toolsRef.current.contains(e.target as Node)) {
        setIsToolsDropdownOpen(false);
      }
      if (modulesRef.current && !modulesRef.current.contains(e.target as Node)) {
        setIsModulesDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (!user) return null;

  return (
    <header style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      background: colors.bgPrimary,
      borderBottom: `1px solid ${colors.border}`,
      zIndex: 1000,
      padding: "0 20px",
    }}>
      <nav style={{
        maxWidth: "1600px",
        margin: "0 auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: "70px",
      }}>
        <Link to="/dashboard" style={{ display: "flex", alignItems: "center", gap: "12px", textDecoration: "none" }}>
          <img src={Logo} alt="Logo" style={{ width: "40px", filter: "drop-shadow(0 0 8px rgba(0, 255, 156, 0.5))" }} />
          <span style={{ color: colors.accent, fontSize: "1.3rem", fontWeight: "bold" }}>CyberOSINT Academy</span>
        </Link>

        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          style={{
            display: "none",
            background: "none",
            border: "none",
            color: colors.accent,
            fontSize: "1.5rem",
            cursor: "pointer",
          }}
        >
          ☰
        </button>

        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "25px",
        }}>
          <Link to="/dashboard" style={{ color: colors.textSecondary, textDecoration: "none", fontSize: "0.95rem", fontWeight: "500" }}>
            🏠 Dashboard
          </Link>
          
          <Link to="/parcours" style={{ color: colors.textSecondary, textDecoration: "none", fontSize: "0.95rem", fontWeight: "500" }}>
            📚 Parcours
          </Link>

          {/* DROPDOWN MODULES OSINT */}
          <div ref={modulesRef} style={{ position: "relative" }}>
            <button
              onClick={() => setIsModulesDropdownOpen(!isModulesDropdownOpen)}
              style={{
                background: "none",
                border: "none",
                color: colors.textSecondary,
                fontSize: "0.95rem",
                fontWeight: "500",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "5px",
              }}
            >
              🎓 Modules OSINT {isModulesDropdownOpen ? "▲" : "▼"}
            </button>
            
            {isModulesDropdownOpen && (
              <div style={{
                position: "absolute",
                top: "100%",
                left: 0,
                marginTop: "10px",
                background: colors.bgSecondary,
                border: `1px solid ${colors.border}`,
                borderRadius: "8px",
                minWidth: "200px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                zIndex: 1001,
              }}>
                <Link to="/modules/shodan" style={{
                  display: "block",
                  padding: "12px 16px",
                  color: colors.textPrimary,
                  textDecoration: "none",
                  fontSize: "0.9rem",
                  borderBottom: `1px solid ${colors.border}`,
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = colors.accent + "20"}
                onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
                  🔍 Shodan
                </Link>
                <Link to="/modules/linkedin" style={{
                  display: "block",
                  padding: "12px 16px",
                  color: colors.textPrimary,
                  textDecoration: "none",
                  fontSize: "0.9rem",
                  borderBottom: `1px solid ${colors.border}`,
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = colors.accent + "20"}
                onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
                  💼 LinkedIn
                </Link>
                <Link to="/modules/telegram" style={{
                  display: "block",
                  padding: "12px 16px",
                  color: colors.textPrimary,
                  textDecoration: "none",
                  fontSize: "0.9rem",
                  borderBottom: `1px solid ${colors.border}`,
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = colors.accent + "20"}
                onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
                  ✈️ Telegram
                </Link>
                <Link to="/modules/discord" style={{
                  display: "block",
                  padding: "12px 16px",
                  color: colors.textPrimary,
                  textDecoration: "none",
                  fontSize: "0.9rem",
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = colors.accent + "20"}
                onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
                  🎮 Discord
                </Link>
              </div>
            )}
          </div>

          <Link to="/exercices-osint" style={{ color: colors.textSecondary, textDecoration: "none", fontSize: "0.95rem", fontWeight: "500" }}>
            📝 Exercices
          </Link>

          <Link to="/etudes-osint" style={{ color: colors.textSecondary, textDecoration: "none", fontSize: "0.95rem", fontWeight: "500" }}>
            🛰️ Cas Réels
          </Link>

          {/* DROPDOWN OUTILS */}
          <div ref={toolsRef} style={{ position: "relative" }}>
            <button
              onClick={() => setIsToolsDropdownOpen(!isToolsDropdownOpen)}
              style={{
                background: "none",
                border: "none",
                color: colors.textSecondary,
                fontSize: "0.95rem",
                fontWeight: "500",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "5px",
              }}
            >
              🔧 Outils {isToolsDropdownOpen ? "▲" : "▼"}
            </button>
            
            {isToolsDropdownOpen && (
              <div style={{
                position: "absolute",
                top: "100%",
                left: 0,
                marginTop: "10px",
                background: colors.bgSecondary,
                border: `1px solid ${colors.border}`,
                borderRadius: "8px",
                minWidth: "200px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                zIndex: 1001,
              }}>
                <Link to="/vm-kali" style={{
                  display: "block",
                  padding: "12px 16px",
                  color: colors.textPrimary,
                  textDecoration: "none",
                  fontSize: "0.9rem",
                  borderBottom: `1px solid ${colors.border}`,
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = colors.accent + "20"}
                onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
                  🐉 Kali Lab
                </Link>
                <Link to="/labo-osint" style={{
                  display: "block",
                  padding: "12px 16px",
                  color: colors.textPrimary,
                  textDecoration: "none",
                  fontSize: "0.9rem",
                  borderBottom: `1px solid ${colors.border}`,
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = colors.accent + "20"}
                onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
                  🧪 Labo OSINT
                </Link>
                <Link to="/hacker-ai" style={{
                  display: "block",
                  padding: "12px 16px",
                  color: colors.textPrimary,
                  textDecoration: "none",
                  fontSize: "0.9rem",
                  borderBottom: `1px solid ${colors.border}`,
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = colors.accent + "20"}
                onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
                  🤖 HackerAI
                </Link>
                <Link to="/outils/argus" style={{
                  display: "block",
                  padding: "12px 16px",
                  color: colors.textPrimary,
                  textDecoration: "none",
                  fontSize: "0.9rem",
                  borderBottom: `1px solid ${colors.border}`,
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = colors.accent + "20"}
                onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
                  🔍 Argus V2.0
                </Link>
                <Link to="/outils-cyber" style={{
                  display: "block",
                  padding: "12px 16px",
                  color: colors.textPrimary,
                  textDecoration: "none",
                  fontSize: "0.9rem",
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = colors.accent + "20"}
                onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
                  🛠️ Catalogue 22+
                </Link>
              </div>
            )}
          </div>

          <Link to="/progression" style={{ color: colors.textSecondary, textDecoration: "none", fontSize: "0.95rem", fontWeight: "500" }}>
            📊 Progression
          </Link>

          <Link to="/streak" style={{ color: colors.textSecondary, textDecoration: "none", fontSize: "0.95rem", fontWeight: "500" }}>
            🔥 Streak
          </Link>

          <Link to="/badges-osint" style={{ color: colors.textSecondary, textDecoration: "none", fontSize: "0.95rem", fontWeight: "500" }}>
            🏅 Badges
          </Link>

          <Link to="/profil" style={{
            padding: "8px 20px",
            background: colors.accent,
            color: "#020617",
            borderRadius: "6px",
            textDecoration: "none",
            fontSize: "0.9rem",
            fontWeight: "600",
          }}>
            👤 {user.username}
          </Link>
        </div>
      </nav>
    </header>
  );
}

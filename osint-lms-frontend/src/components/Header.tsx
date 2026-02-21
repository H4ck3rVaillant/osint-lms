import { Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { useTheme, useThemeColors } from "../context/ThemeContext";
import Logo from "../assets/images/Logo.png";

const AVATARS: Record<string, string> = {
  hacker: "🧑‍💻", ninja: "🥷", ghost: "👻", robot: "🤖", alien: "👽",
  skull: "💀", detective: "🕵️", wizard: "🧙", demon: "😈", cat: "🐱",
  fox: "🦊", wolf: "🐺", dragon: "🐉", parrot: "🦜", cyber: "⚡",
};

function getUserAvatar(username: string): string | JSX.Element {
  const avatarType = localStorage.getItem(`avatar_type_${username}`) || "emoji";
  
  if (avatarType === "image") {
    const customImage = localStorage.getItem(`avatar_image_${username}`);
    if (customImage) {
      return (
        <img 
          src={customImage} 
          alt="Avatar" 
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            objectFit: "cover" as const
          }} 
        />
      );
    }
  }
  
  const saved = localStorage.getItem(`avatar_${username}`);
  return saved && AVATARS[saved] ? AVATARS[saved] : "🧑‍💻";
}

export default function Header() {
  const auth = useAuth();
  const { theme, toggleTheme } = useTheme();
  const colors = useThemeColors();
  const [showQuizMenu, setShowQuizMenu] = useState(false);
  const [showOutilsMenu, setShowOutilsMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [language, setLanguage] = useState("FR");

  if (!auth.user) return null;

  const { logout, user } = auth;

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  const toggleLanguage = () => {
    const langs = ["FR", "EN", "ES", "DE"];
    const currentIndex = langs.indexOf(language);
    setLanguage(langs[(currentIndex + 1) % langs.length]);
    // TODO: Implémenter le changement de langue réel
  };

  const linkStyle = {
    color: colors.textPrimary,
    textDecoration: "none" as const,
    fontWeight: "500" as const,
    padding: "6px 8px",
    borderRadius: "6px",
    fontSize: "0.8rem",
    whiteSpace: "nowrap" as const,
    transition: "all 0.2s",
  };

  const separatorStyle = {
    width: "2px",
    height: "40px",
    background: colors.accent,
    flexShrink: 0,
  };

  return (
    <>
    <header style={{
      position: "fixed" as const,
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      background: colors.bgPrimary,
      borderBottom: `2px solid ${colors.accent}`,
      boxShadow: `0 4px 20px ${colors.shadow}`,
    }}>
      
      <div style={{
        display: "flex",
        alignItems: "center",
        padding: "8px 15px",
        gap: "12px",
        minHeight: "60px",
        flexWrap: "wrap" as const,
      }}>
        
        {/* 📱 MENU HAMBURGER (mobile only) */}
        <button
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          style={{
            display: "none",
            background: "transparent",
            border: `2px solid ${colors.accent}`,
            color: colors.accent,
            fontSize: "1.5rem",
            padding: "5px 10px",
            borderRadius: "6px",
            cursor: "pointer",
          }}
          className="mobile-menu-btn"
        >
          ☰
        </button>

        {/* 🎯 LOGO */}
        <Link to="/dashboard" style={{ 
          display: "flex", 
          alignItems: "center", 
          textDecoration: "none", 
          flexShrink: 0 
        }}>
          <img src={Logo} alt="Logo" style={{ height: "35px", marginRight: "10px" }} />
          <span style={{ 
            color: colors.accent, 
            fontSize: "1rem", 
            fontWeight: "bold", 
            whiteSpace: "nowrap" 
          }}>
            CyberOSINT Academy
          </span>
        </Link>

        <div style={separatorStyle} className="separator" />

        {/* 📚 SECTION FORMATION (desktop) */}
        <nav style={{
          display: "flex",
          alignItems: "center",
          gap: "3px",
        }}
        className="desktop-nav">
          {[
            { label: "Dashboard", to: "/dashboard" },
            { label: "Parcours", to: "/parcours" },
            { label: "Exercices", to: "/exercices-osint" },
            { label: "Etudes de cas", to: "/etudes-osint" },
          ].map((item) => (
            <Link key={item.to} to={item.to} style={linkStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = colors.accent;
              e.currentTarget.style.background = colors.bgSecondary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = colors.textPrimary;
              e.currentTarget.style.background = "transparent";
            }}>
              {item.label}
            </Link>
          ))}

          {/* Menu Quiz + Challenge */}
          <div style={{ position: "relative" as const }}>
            <span onClick={() => setShowQuizMenu(!showQuizMenu)} style={{
              ...linkStyle,
              cursor: "pointer",
              display: "block",
              color: showQuizMenu ? colors.accent : colors.textPrimary,
              background: showQuizMenu ? colors.bgSecondary : "transparent",
            }}>
              Quiz + Challenge ▾
            </span>

            {showQuizMenu && (
              <div style={{
                position: "absolute" as const,
                top: "36px",
                left: 0,
                background: colors.bgPrimary,
                border: `1px solid ${colors.accent}`,
                borderRadius: "8px",
                padding: "8px 0",
                minWidth: "180px",
                zIndex: 1000,
                boxShadow: `0 4px 20px ${colors.shadow}`,
              }}>
                <Link to="/quiz" onClick={() => setShowQuizMenu(false)} style={{
                  display: "block",
                  color: colors.textPrimary,
                  textDecoration: "none",
                  padding: "10px 18px",
                  fontSize: "0.85rem",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = colors.bgSecondary;
                  e.currentTarget.style.color = colors.accent;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = colors.textPrimary;
                }}>
                  🎓 Quiz Interactifs
                </Link>
                <Link to="/ctf" onClick={() => setShowQuizMenu(false)} style={{
                  display: "block",
                  color: colors.textPrimary,
                  textDecoration: "none",
                  padding: "10px 18px",
                  fontSize: "0.85rem",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = colors.bgSecondary;
                  e.currentTarget.style.color = colors.accent;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = colors.textPrimary;
                }}>
                  🚩 CTF Challenge
                </Link>

                <Link to="/challenges" onClick={() => setShowQuizMenu(false)} style={{
                  display: "block",
                  color: colors.textPrimary,
                  textDecoration: "none",
                  padding: "10px 18px",
                  fontSize: "0.85rem",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = colors.bgSecondary;
                  e.currentTarget.style.color = colors.accent;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = colors.textPrimary;
                }}>
                  🔥 Challenges Hebdo
                </Link>
              </div>
            )}
          </div>
        </nav>

        <div style={separatorStyle} className="separator" />

        {/* 🛠️ SECTION LABO/OUTILS (desktop) */}
        <nav style={{
          display: "flex",
          alignItems: "center",
          gap: "3px",
        }}
        className="desktop-nav">
          <Link to="/labo-osint" style={linkStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = colors.accent;
            e.currentTarget.style.background = colors.bgSecondary;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = colors.textPrimary;
            e.currentTarget.style.background = "transparent";
          }}>
            Labo
          </Link>

          {/* Menu Outils */}
          <div style={{ position: "relative" as const }}>
            <span onClick={() => setShowOutilsMenu(!showOutilsMenu)} style={{
              ...linkStyle,
              cursor: "pointer",
              display: "block",
              color: showOutilsMenu ? colors.accent : colors.textPrimary,
              background: showOutilsMenu ? colors.bgSecondary : "transparent",
            }}>
              Outils ▾
            </span>

            {showOutilsMenu && (
              <div style={{
                position: "absolute" as const,
                top: "36px",
                left: "-20px",
                background: colors.bgPrimary,
                border: `1px solid ${colors.accent}`,
                borderRadius: "8px",
                padding: "8px 0",
                minWidth: "200px",
                zIndex: 1000,
                boxShadow: `0 4px 20px ${colors.shadow}`,
              }}>
                {[
                  { label: "🤖 HackerAI", to: "/hacker-ai" },
                  { label: "🔍 Argus V2.0", to: "/outils/argus" },
                  { label: "🖥️ Argus Console", to: "/outils/argus/console" },
                  { label: "📦 Dependency Track", to: "/dependency-track" },
                  { label: "🔧 Outils Cyber", to: "/outils-cyber" },
                  { label: "📚 Référentiels", to: "/referentiels" },
                  { label: "💻 VM Access", to: "/vm-access" },
                  { label: "🐉 Kali Linux", to: "/vm-kali" },
                  { label: "🦜 Parrot OS", to: "/vm-parrot" },
                ].map((item) => (
                  <Link key={item.to} to={item.to} onClick={() => setShowOutilsMenu(false)} style={{
                    display: "block",
                    color: colors.textPrimary,
                    textDecoration: "none",
                    padding: "10px 18px",
                    fontSize: "0.85rem",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = colors.bgSecondary;
                    e.currentTarget.style.color = colors.accent;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = colors.textPrimary;
                  }}>
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link to="/youtube" style={linkStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = colors.accent;
            e.currentTarget.style.background = colors.bgSecondary;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = colors.textPrimary;
            e.currentTarget.style.background = "transparent";
          }}>
            YouTube (embeds)
          </Link>
        </nav>

        <div style={separatorStyle} className="separator" />

        {/* 🏆 SECTION SUIVI (desktop) */}
        <nav style={{
          display: "flex",
          alignItems: "center",
          gap: "3px",
          marginRight: "auto",
        }}
        className="desktop-nav">
          {[
            { label: "Leaderboard", to: "/leaderboard" },
            { label: "Progression", to: "/progression" },
            { label: "Badges", to: "/badges-osint" },
            { label: "Certificat", to: "/certificat" },
          ].map((item) => (
            <Link key={item.to} to={item.to} style={linkStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = colors.accent;
              e.currentTarget.style.background = colors.bgSecondary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = colors.textPrimary;
              e.currentTarget.style.background = "transparent";
            }}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div style={separatorStyle} className="separator" />

        {/* 🎨 BOUTONS ACTIONS */}
        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          gap: "8px",
          flexShrink: 0,
        }}
        className="action-buttons">
          
          {/* Toggle Theme */}
          <button
            onClick={toggleTheme}
            title={theme === "dark" ? "Mode clair" : "Mode sombre"}
            style={{
              background: colors.bgSecondary,
              border: `1px solid ${colors.border}`,
              borderRadius: "50%",
              width: "36px",
              height: "36px",
              cursor: "pointer",
              fontSize: "1.2rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = colors.accent;
              e.currentTarget.style.transform = "scale(1.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = colors.border;
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            {theme === "dark" ? "🌞" : "🌙"}
          </button>

          {/* Language Selector */}
          <button
            onClick={toggleLanguage}
            title="Changer la langue"
            style={{
              background: colors.bgSecondary,
              border: `1px solid ${colors.border}`,
              borderRadius: "50%",
              width: "36px",
              height: "36px",
              cursor: "pointer",
              fontSize: "0.75rem",
              fontWeight: "700",
              color: colors.accent,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = colors.accent;
              e.currentTarget.style.transform = "scale(1.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = colors.border;
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            {language}
          </button>

          {/* Avatar + User Menu */}
          <div style={{ position: "relative" as const }}>
            <div onClick={() => setShowUserMenu(!showUserMenu)} style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              cursor: "pointer",
              padding: "4px 10px",
              borderRadius: "8px",
              transition: "background 0.2s",
              background: showUserMenu ? colors.bgSecondary : "transparent",
            }}>
              
              <div style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                border: `2px solid ${colors.accent}`,
                background: colors.bgSecondary,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.2rem",
                flexShrink: 0,
              }}>
                {getUserAvatar(user.username)}
              </div>

              <span style={{ 
                color: colors.textSecondary, 
                fontWeight: "500", 
                fontSize: "0.85rem" 
              }} 
              className="username-text">
                {user.username}
              </span>
              
              <span style={{ color: colors.textSecondary, fontSize: "0.6rem" }}>▾</span>
            </div>

            {showUserMenu && (
              <div style={{
                position: "absolute" as const,
                top: "50px",
                right: 0,
                background: colors.bgPrimary,
                border: `1px solid ${colors.accent}`,
                borderRadius: "8px",
                padding: "8px 0",
                minWidth: "180px",
                zIndex: 1000,
                boxShadow: `0 4px 20px ${colors.shadow}`,
              }}>
                
                <Link to="/profil" onClick={() => setShowUserMenu(false)} style={{
                  display: "block",
                  color: colors.textPrimary,
                  textDecoration: "none",
                  padding: "10px 18px",
                  fontSize: "0.85rem",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = colors.bgSecondary;
                  e.currentTarget.style.color = colors.accent;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = colors.textPrimary;
                }}>
                  👤 Mon Profil
                </Link>

                <Link to="/contact" onClick={() => setShowUserMenu(false)} style={{
                  display: "block",
                  color: colors.textPrimary,
                  textDecoration: "none",
                  padding: "10px 18px",
                  fontSize: "0.85rem",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = colors.bgSecondary;
                  e.currentTarget.style.color = colors.accent;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = colors.textPrimary;
                }}>
                  📧 Contact Admin
                </Link>

                {/* Panel Admin - Visible uniquement pour Cyber_Admin */}
                {username === "Cyber_Admin" && (
                  <>
                    <div style={{ height: "1px", background: colors.border, margin: "8px 0" }} />
                    
                    <Link to="/admin" onClick={() => setShowUserMenu(false)} style={{
                      display: "block",
                      color: colors.accent,
                      textDecoration: "none",
                      padding: "10px 18px",
                      fontSize: "0.85rem",
                      fontWeight: "600",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = colors.bgSecondary;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                    }}>
                      🛡️ Panel Admin
                    </Link>
                  </>
                )}

                <div style={{ height: "1px", background: colors.border, margin: "8px 0" }} />

                <button onClick={handleLogout} style={{
                  width: "100%",
                  background: "transparent",
                  color: "#ef4444",
                  border: "none",
                  padding: "10px 18px",
                  textAlign: "left" as const,
                  cursor: "pointer",
                  fontSize: "0.85rem",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = colors.bgSecondary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                }}>
                  🚪 Déconnexion
                </button>
              </div>
            )}
          </div>

          {/* Online Status */}
          <div style={{
            width: "10px",
            height: "10px",
            borderRadius: "50%",
            background: "#10b981",
            boxShadow: "0 0 8px #10b981",
            flexShrink: 0,
          }}
          title="En ligne"
          />
        </div>

      </div>

      {/* 📱 MENU MOBILE OVERLAY */}
      {showMobileMenu && (
        <div style={{
          position: "fixed" as const,
          top: "60px",
          left: 0,
          right: 0,
          bottom: 0,
          background: colors.bgPrimary,
          zIndex: 999,
          overflowY: "auto" as const,
          padding: "15px",
        }}>
          <div style={{ display: "flex", flexDirection: "column" as const, gap: "8px" }}>
            
            <div style={{ 
              color: colors.textSecondary, 
              fontSize: "0.75rem", 
              fontWeight: "600",
              padding: "5px 10px" 
            }}>
              📚 FORMATION
            </div>
            {[
              { label: "Dashboard", to: "/dashboard" },
              { label: "Parcours", to: "/parcours" },
              { label: "Exercices", to: "/exercices-osint" },
              { label: "Etudes de cas", to: "/etudes-osint" },
              { label: "🎓 Quiz", to: "/quiz" },
              { label: "🚩 CTF Challenge", to: "/ctf" },
              { label: "🔥 Challenges Hebdo", to: "/challenges" },
              { label: "📹 Vidéos YouTube", to: "/youtube" },
            ].map((item) => (
              <Link key={item.to} to={item.to} onClick={() => setShowMobileMenu(false)} style={{
                color: colors.textPrimary,
                textDecoration: "none",
                padding: "12px",
                background: colors.bgSecondary,
                borderRadius: "8px",
                fontSize: "0.95rem",
                border: `1px solid ${colors.border}`,
              }}>
                {item.label}
              </Link>
            ))}

            <div style={{ 
              color: colors.textSecondary, 
              fontSize: "0.75rem", 
              fontWeight: "600",
              padding: "5px 10px",
              marginTop: "10px",
            }}>
              🛠️ LABO & OUTILS
            </div>
            {[
              { label: "🧪 Labo OSINT", to: "/labo-osint" },
              { label: "🤖 HackerAI", to: "/hacker-ai" },
              { label: "🔍 Argus V2.0", to: "/outils/argus" },
              { label: "🖥️ Argus Console", to: "/outils/argus/console" },
              { label: "📦 Dependency Track", to: "/dependency-track" },
              { label: "🔧 Outils Cyber", to: "/outils-cyber" },
              { label: "📚 Référentiels", to: "/referentiels" },
              { label: "💻 VM Access", to: "/vm-access" },
              { label: "🐉 Kali Linux", to: "/vm-kali" },
              { label: "🦜 Parrot OS", to: "/vm-parrot" },
            ].map((item) => (
              <Link key={item.to} to={item.to} onClick={() => setShowMobileMenu(false)} style={{
                color: colors.textPrimary,
                textDecoration: "none",
                padding: "12px",
                background: colors.bgSecondary,
                borderRadius: "8px",
                fontSize: "0.95rem",
                border: `1px solid ${colors.border}`,
              }}>
                {item.label}
              </Link>
            ))}

            <div style={{ 
              color: colors.textSecondary, 
              fontSize: "0.75rem", 
              fontWeight: "600",
              padding: "5px 10px",
              marginTop: "10px",
            }}>
              🏆 SUIVI & CERTIFICAT
            </div>
            {[
              { label: "🏆 Leaderboard", to: "/leaderboard" },
              { label: "⭐ Progression", to: "/progression" },
              { label: "🏅 Badges", to: "/badges-osint" },
              { label: "🎓 Certificat", to: "/certificat" },
            ].map((item) => (
              <Link key={item.to} to={item.to} onClick={() => setShowMobileMenu(false)} style={{
                color: colors.textPrimary,
                textDecoration: "none",
                padding: "12px",
                background: colors.bgSecondary,
                borderRadius: "8px",
                fontSize: "0.95rem",
                border: `1px solid ${colors.border}`,
              }}>
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}

    </header>

    {/* SPACER */}
    <div style={{ height: "60px" }} />

    <style>{`
      /* Mode mobile < 1400px */
      @media (max-width: 1400px) {
        .mobile-menu-btn {
          display: block !important;
        }
        .desktop-nav, .separator {
          display: none !important;
        }
        .username-text {
          display: none !important;
        }
      }

      /* Mode compact 1400-1600px */
      @media (min-width: 1401px) and (max-width: 1600px) {
        .desktop-nav a, .desktop-nav span {
          font-size: 0.75rem !important;
          padding: 4px 6px !important;
        }
      }

      /* Mode très large > 1920px */
      @media (min-width: 1921px) {
        .desktop-nav a, .desktop-nav span {
          font-size: 0.9rem !important;
          padding: 8px 12px !important;
        }
      }
    `}</style>
    </>
  );
}

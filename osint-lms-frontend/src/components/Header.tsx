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
  const [showOutilsMenu, setShowOutilsMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  if (!auth.user) return null;

  const { logout, user } = auth;

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  const linkStyle = {
    color: colors.textPrimary,
    textDecoration: "none" as const,
    fontWeight: "500" as const,
    padding: "6px 10px",
    borderRadius: "6px",
    fontSize: "0.8rem",
    whiteSpace: "nowrap" as const,
    transition: "all 0.2s",
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
      borderBottom: `1px solid ${colors.accent}`,
      boxShadow: `0 4px 20px ${colors.shadow}`,
    }}>
      
      {/* LIGNE 1 : Logo + Menu Principal + Avatar */}
      <div style={{
        display: "flex",
        alignItems: "center",
        padding: "10px 20px",
        gap: "15px",
        borderBottom: `1px solid ${colors.accent}`,
      }}
      className="header-line-1">
        
        {/* LOGO */}
        <Link to="/dashboard" style={{ display: "flex", alignItems: "center", textDecoration: "none", flexShrink: 0 }}>
          <img src={Logo} alt="Logo" style={{ height: "35px", marginRight: "8px" }} />
          <span style={{ color: colors.accent, fontSize: "0.95rem", fontWeight: "bold", whiteSpace: "nowrap" }}>
            CyberOSINT Academy
          </span>
        </Link>

        <div style={{ width: "2px", height: "25px", background: colors.accent, flexShrink: 0 }} className="separator" />

        {/* MENU HAMBURGER (mobile only) */}
        <button
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          style={{
            display: "none",
            background: "transparent",
            border: `2px solid ${colors.accent}`,
            color: colors.accent,
            fontSize: "1.3rem",
            padding: "4px 8px",
            borderRadius: "6px",
            cursor: "pointer",
            marginLeft: "auto",
          }}
          className="mobile-menu-btn"
        >
          ☰
        </button>

        {/* MENU PRINCIPAL (desktop) */}
        <nav style={{
          display: "flex",
          gap: "5px",
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
        className="desktop-nav-1">
          {[
            { label: "🏠 Dashboard", to: "/dashboard" },
            { label: "📚 Parcours", to: "/parcours" },
            { label: "📝 Exercices", to: "/exercices-osint" },
            { label: "🔎 Études", to: "/etudes-osint" },
            { label: "🎓 Quiz", to: "/quiz" },
            { label: "🏅 Badges", to: "/badges-osint" },
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

        <div style={{ width: "2px", height: "25px", background: colors.accent, flexShrink: 0 }} className="separator" />

        {/* TOGGLE THÈME (desktop) */}
        <button
          onClick={toggleTheme}
          title={theme === "dark" ? "Mode clair" : "Mode sombre"}
          style={{
            background: colors.bgSecondary,
            border: `1px solid ${colors.border}`,
            borderRadius: "8px",
            padding: "6px 10px",
            cursor: "pointer",
            fontSize: "1.1rem",
            transition: "all 0.2s",
            display: "flex",
            alignItems: "center",
            flexShrink: 0,
          }}
          className="theme-toggle-btn"
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = colors.accent;
            e.currentTarget.style.transform = "scale(1.05)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = colors.border;
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          {theme === "dark" ? "🌞" : "🌙"}
        </button>

        {/* MENU UTILISATEUR */}
        <div style={{ position: "relative" as const, flexShrink: 0 }} className="user-menu-container">
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
              width: "30px",
              height: "30px",
              borderRadius: "50%",
              border: `2px solid ${colors.accent}`,
              background: colors.bgSecondary,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.1rem",
              flexShrink: 0,
            }}>
              {getUserAvatar(user.username)}
            </div>

            <span style={{ color: colors.textSecondary, fontWeight: "500", fontSize: "0.8rem" }} className="username-text">{user.username}</span>
            <span style={{ color: colors.textSecondary, fontSize: "0.6rem" }}>▾</span>
          </div>

          {showUserMenu && (
            <div style={{
              position: "absolute" as const,
              top: "45px",
              right: 0,
              background: colors.bgPrimary,
              border: `1px solid ${colors.accent}`,
              borderRadius: "8px",
              padding: "8px 0",
              minWidth: "170px",
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
      </div>

      {/* LIGNE 2 : Menu Secondaire + Outils (desktop) */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "8px 20px",
        gap: "8px",
      }}
      className="desktop-nav-2">
        
        {[
          { label: "🚩 CTF", to: "/ctf" },
          { label: "🏆 Leaderboard", to: "/leaderboard" },
          { label: "⭐ Progression", to: "/progression" },
          { label: "🧪 Labo", to: "/labo-osint" },
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

        <div style={{ width: "2px", height: "20px", background: colors.accent, margin: "0 8px" }} />

        {/* Menu Outils Dropdown */}
        <div style={{ position: "relative" as const }}>
          <span onClick={() => setShowOutilsMenu(!showOutilsMenu)} style={{
            color: showOutilsMenu ? colors.accent : colors.textPrimary,
            fontWeight: "500",
            cursor: "pointer",
            padding: "6px 10px",
            borderRadius: "6px",
            fontSize: "0.8rem",
            transition: "all 0.2s",
            background: showOutilsMenu ? colors.bgSecondary : "transparent",
            display: "block",
            whiteSpace: "nowrap" as const,
          }}>
            🛠️ Outils ▾
          </span>

          {showOutilsMenu && (
            <div style={{
              position: "absolute" as const,
              top: "32px",
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
      </div>

      {/* MENU MOBILE OVERLAY */}
      {showMobileMenu && (
        <div style={{
          position: "fixed" as const,
          top: "105px",
          left: 0,
          right: 0,
          bottom: 0,
          background: colors.bgPrimary,
          zIndex: 999,
          overflowY: "auto" as const,
          padding: "15px",
        }}>
          <div style={{ display: "flex", flexDirection: "column" as const, gap: "8px" }}>
            {[
              { label: "🏠 Dashboard", to: "/dashboard" },
              { label: "📚 Parcours", to: "/parcours" },
              { label: "📝 Exercices", to: "/exercices-osint" },
              { label: "🔎 Études de Cas", to: "/etudes-osint" },
              { label: "🎓 Quiz", to: "/quiz" },
              { label: "🏅 Badges", to: "/badges-osint" },
              { label: "🚩 CTF", to: "/ctf" },
              { label: "🏆 Leaderboard", to: "/leaderboard" },
              { label: "⭐ Progression", to: "/progression" },
              { label: "🧪 Labo", to: "/labo-osint" },
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
              marginTop: "15px",
              paddingTop: "15px",
              borderTop: `1px solid ${colors.border}`,
            }}>
              <p style={{ color: colors.textSecondary, fontSize: "0.75rem", marginBottom: "8px", paddingLeft: "5px", fontWeight: "600" }}>
                🛠️ OUTILS
              </p>
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
                <Link key={item.to} to={item.to} onClick={() => setShowMobileMenu(false)} style={{
                  color: colors.textPrimary,
                  textDecoration: "none",
                  padding: "12px",
                  background: colors.bgSecondary,
                  borderRadius: "8px",
                  fontSize: "0.95rem",
                  border: `1px solid ${colors.border}`,
                  display: "block",
                  marginBottom: "8px",
                }}>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

    </header>

    {/* SPACER pour compenser le header fixed */}
    <div style={{ height: "105px" }} />

    <style>{`
      @media (max-width: 1100px) {
        .mobile-menu-btn {
          display: block !important;
        }
        .desktop-nav-1, .desktop-nav-2, .separator, .theme-toggle-btn {
          display: none !important;
        }
        .username-text {
          display: none !important;
        }
        .header-line-1 {
          border-bottom: none !important;
        }
      }
    `}</style>
    </>
  );
}

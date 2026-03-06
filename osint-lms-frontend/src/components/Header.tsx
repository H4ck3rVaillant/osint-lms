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
  const avatarType = localStorage.getItem(\`avatar_type_\${username}\`) || "emoji";
  
  if (avatarType === "image") {
    const customImage = localStorage.getItem(\`avatar_image_\${username}\`);
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
  
  const saved = localStorage.getItem(\`avatar_\${username}\`);
  return saved && AVATARS[saved] ? AVATARS[saved] : "🧑‍💻";
}

export default function Header() {
  const auth = useAuth();
  const { theme, toggleTheme } = useTheme();
  const colors = useThemeColors();
  const [showQuizMenu, setShowQuizMenu] = useState(false);
  const [showModulesMenu, setShowModulesMenu] = useState(false);
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
    padding: "6px 6px",
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
      borderBottom: \`2px solid \${colors.accent}\`,
      boxShadow: \`0 4px 20px \${colors.shadow}\`,
    }}>
      
      <div style={{
        display: "flex",
        alignItems: "center",
        padding: "8px 15px",
        gap: "8px",
        minHeight: "60px",
        flexWrap: "nowrap" as const,
      }}>
        
        {/* 📱 MENU HAMBURGER (mobile only) */}
        <button
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          style={{
            display: "block",
            "@media (minWidth: 1280px)": { display: "none" },
            background: "transparent",
            border: "none",
            color: colors.accent,
            fontSize: "1.8rem",
            cursor: "pointer",
            padding: "5px",
            lineHeight: 1,
          }}
        >
          ☰
        </button>

        {/* Logo */}
        <Link to="/dashboard" style={{ display: "flex", alignItems: "center", textDecoration: "none", gap: "10px", flexShrink: 0 }}>
          <img src={Logo} alt="Logo" style={{ width: "40px", height: "40px" }} />
          <span style={{ color: colors.accent, fontWeight: "700", fontSize: "1.2rem", whiteSpace: "nowrap" }}>OSINT LMS</span>
        </Link>

        <div style={separatorStyle} />

        {/* Desktop Navigation */}
        <nav style={{
          display: "none",
          "@media (minWidth: 1280px)": { display: "flex" },
          alignItems: "center",
          gap: "8px",
          flexGrow: 1,
          flexWrap: "nowrap" as const,
          overflow: "hidden",
        }}
        className="desktop-nav">
          
          {[
            { label: "🏠 Dashboard", to: "/dashboard" },
            { label: "📚 Parcours", to: "/parcours" },
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

          {/* MENU MODULES OSINT - 6 modules */}
          <div style={{ position: "relative" as const }}>
            <span onClick={() => setShowModulesMenu(!showModulesMenu)} style={{
              ...linkStyle,
              cursor: "pointer",
              display: "block",
              color: showModulesMenu ? colors.accent : colors.textPrimary,
              background: showModulesMenu ? colors.bgSecondary : "transparent",
            }}>
              🎓 Modules OSINT ▾
            </span>

            {showModulesMenu && (
              <div style={{
                position: "absolute" as const,
                top: "36px",
                left: 0,
                background: colors.bgPrimary,
                border: \`1px solid \${colors.accent}\`,
                borderRadius: "8px",
                padding: "8px 0",
                minWidth: "180px",
                zIndex: 1000,
                boxShadow: \`0 4px 20px \${colors.shadow}\`,
              }}>
                <Link to="/modules/shodan" onClick={() => setShowModulesMenu(false)} style={{
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
                  🔍 Shodan
                </Link>
                <Link to="/modules/linkedin" onClick={() => setShowModulesMenu(false)} style={{
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
                  💼 LinkedIn
                </Link>
                <Link to="/modules/telegram" onClick={() => setShowModulesMenu(false)} style={{
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
                  ✈️ Telegram
                </Link>
                <Link to="/modules/discord" onClick={() => setShowModulesMenu(false)} style={{
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
                  🎮 Discord
                </Link>
                <Link to="/modules/theharvester" onClick={() => setShowModulesMenu(false)} style={{
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
                  🌾 theHarvester
                </Link>
                <Link to="/modules/maltego" onClick={() => setShowModulesMenu(false)} style={{
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
                  🕸️ Maltego
                </Link>
              </div>
            )}
          </div>

          {[
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
                border: \`1px solid \${colors.accent}\`,
                borderRadius: "8px",
                padding: "8px 0",
                minWidth: "180px",
                zIndex: 1000,
                boxShadow: \`0 4px 20px \${colors.shadow}\`,
              }}>
                {[
                  { label: "🎓 Quiz", to: "/quiz" },
                  { label: "🚩 CTF Challenge", to: "/ctf" },
                  { label: "🔥 Challenges Hebdo", to: "/challenges" },
                  { label: "📹 Vidéos YouTube", to: "/youtube" },
                ].map((item) => (
                  <Link key={item.to} to={item.to} onClick={() => setShowQuizMenu(false)} style={{
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

          {/* Menu Outils */}
          <div style={{ position: "relative" as const }}>
            <span onClick={() => setShowOutilsMenu(!showOutilsMenu)} style={{
              ...linkStyle,
              cursor: "pointer",
              display: "block",
              color: showOutilsMenu ? colors.accent : colors.textPrimary,
              background: showOutilsMenu ? colors.bgSecondary : "transparent",
            }}>
              Labo & Outils ▾
            </span>

            {showOutilsMenu && (
              <div style={{
                position: "absolute" as const,
                top: "36px",
                left: 0,
                background: colors.bgPrimary,
                border: \`1px solid \${colors.accent}\`,
                borderRadius: "8px",
                padding: "8px 0",
                minWidth: "200px",
                zIndex: 1000,
                boxShadow: \`0 4px 20px \${colors.shadow}\`,
              }}>
                {[
                  { label: "🧪 Labo OSINT", to: "/labo-osint" },
                  { label: "🤖 HackerAI", to: "/hacker-ai" },
                  { label: "🔍 Argus V2.0", to: "/outils/argus" },
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

          {[
            { label: "🏅 Badges", to: "/badges-osint" },
            { label: "📊 Progression", to: "/progression" },
            { label: "📆 Streak", to: "/streak" },
            { label: "🏆 Leaderboard", to: "/leaderboard" },
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

        <style>{\`
          @media (min-width: 1280px) {
            .desktop-nav { display: flex !important; }
          }
        \`}</style>

        {/* Right Side - Theme + User */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginLeft: "auto", flexShrink: 0 }}>

          {/* Toggle Theme */}
          <button onClick={toggleTheme} style={{
            background: colors.bgSecondary,
            border: \`1px solid \${colors.border}\`,
            borderRadius: "6px",
            padding: "6px 10px",
            cursor: "pointer",
            fontSize: "1.2rem",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.05)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}>
            {theme === "dark" ? "🌙" : "☀️"}
          </button>

          {/* User Menu */}
          <div style={{ position: "relative" as const }}>
            <button onClick={() => setShowUserMenu(!showUserMenu)} style={{
              background: colors.bgSecondary,
              border: \`2px solid \${colors.accent}\`,
              borderRadius: "50%",
              width: "40px",
              height: "40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              fontSize: "1.5rem",
              transition: "all 0.2s",
              flexShrink: 0,
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.05)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}>
              {getUserAvatar(user?.username || "")}
            </button>

            {showUserMenu && (
              <div style={{
                position: "absolute" as const,
                top: "50px",
                right: 0,
                background: colors.bgPrimary,
                border: \`1px solid \${colors.accent}\`,
                borderRadius: "8px",
                padding: "8px 0",
                minWidth: "180px",
                zIndex: 1000,
                boxShadow: \`0 4px 20px \${colors.shadow}\`,
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

                {user?.username === "Cyber_Admin" && (
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
                border: \`1px solid \${colors.border}\`,
              }}>
                {item.label}
              </Link>
            ))}

            {/* MODULES OSINT - 6 modules */}
            <div style={{ 
              color: colors.textSecondary, 
              fontSize: "0.75rem", 
              fontWeight: "600",
              padding: "5px 10px",
              marginTop: "10px",
            }}>
              🎓 MODULES OSINT
            </div>
            {[
              { label: "🔍 Shodan", to: "/modules/shodan" },
              { label: "💼 LinkedIn", to: "/modules/linkedin" },
              { label: "✈️ Telegram", to: "/modules/telegram" },
              { label: "🎮 Discord", to: "/modules/discord" },
              { label: "🌾 theHarvester", to: "/modules/theharvester" },
              { label: "🕸️ Maltego", to: "/modules/maltego" },
            ].map((item) => (
              <Link key={item.to} to={item.to} onClick={() => setShowMobileMenu(false)} style={{
                color: colors.textPrimary,
                textDecoration: "none",
                padding: "12px",
                background: colors.bgSecondary,
                borderRadius: "8px",
                fontSize: "0.95rem",
                border: \`1px solid \${colors.border}\`,
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
                border: \`1px solid \${colors.border}\`,
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
              🏆 PROGRESSION
            </div>
            {[
              { label: "🏅 Badges", to: "/badges-osint" },
              { label: "📊 Ma Progression", to: "/progression" },
              { label: "📆 Streak Calendar", to: "/streak" },
              { label: "🏆 Leaderboard", to: "/leaderboard" },
              { label: "🎓 Certificat", to: "/certificat" },
            ].map((item) => (
              <Link key={item.to} to={item.to} onClick={() => setShowMobileMenu(false)} style={{
                color: colors.textPrimary,
                textDecoration: "none",
                padding: "12px",
                background: colors.bgSecondary,
                borderRadius: "8px",
                fontSize: "0.95rem",
                border: \`1px solid \${colors.border}\`,
              }}>
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
    </>
  );
}

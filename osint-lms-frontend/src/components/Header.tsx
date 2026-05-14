import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
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
  const [showModulesMenu, setShowModulesMenu] = useState(false);
  const [showOutilsMenu, setShowOutilsMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showMsgPopup, setShowMsgPopup] = useState(false);
  const hasShownPopup = useRef(false);

  const API_URL = "https://osint-lms-backend.onrender.com";

  useEffect(() => {
    if (!auth.user) return;

    const fetchUnread = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const res = await fetch(`${API_URL}/messages/unread-count`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return;
        const data = await res.json();
        const count = data.count || 0;
        setUnreadCount(count);
        // Popup à la première détection de messages non lus (une seule fois par session)
        if (count > 0 && !hasShownPopup.current) {
          hasShownPopup.current = true;
          setShowMsgPopup(true);
          setTimeout(() => setShowMsgPopup(false), 5000);
        }
      } catch {
        // Silencieux — ne pas bloquer si le backend est lent
      }
    };

    fetchUnread();
    const interval = setInterval(fetchUnread, 30000);
    return () => clearInterval(interval);
  }, [auth.user]);

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
      borderBottom: `2px solid ${colors.accent}`,
      boxShadow: `0 4px 20px ${colors.shadow}`,
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
          gap: "2px",
        }}
        className="desktop-nav">
          {[
            { label: "Dashboard", to: "/dashboard" },
            { label: "Parcours", to: "/parcours" },
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

          {/* Menu Modules OSINT */}
          <div style={{ position: "relative" as const }}>
            <span onClick={() => setShowModulesMenu(!showModulesMenu)} style={{
              ...linkStyle,
              cursor: "pointer",
              display: "block",
              color: showModulesMenu ? colors.accent : colors.textPrimary,
              background: showModulesMenu ? colors.bgSecondary : "transparent",
            }}>
              Modules OSINT ▾
            </span>
            {showModulesMenu && (
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
                
                <div style={{ height: "1px", background: colors.border, margin: "8px 0" }} />
                <div style={{ padding: "5px 18px", fontSize: "0.75rem", color: colors.textSecondary, fontWeight: "bold" }}>
                  🆕 NOUVEAUX 2026
                </div>
                
                <Link to="/modules/instagram" onClick={() => setShowModulesMenu(false)} style={{
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
                  📸 Instagram
                </Link>
                <Link to="/modules/facebook" onClick={() => setShowModulesMenu(false)} style={{
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
                  📘 Facebook
                </Link>
                <Link to="/modules/tiktok" onClick={() => setShowModulesMenu(false)} style={{
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
                  🎵 TikTok
                </Link>
                <Link to="/modules/googlemaps" onClick={() => setShowModulesMenu(false)} style={{
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
                  🗺️ Google Maps
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
                <Link to="/messages" onClick={() => { setShowUserMenu(false); setUnreadCount(0); setShowMsgPopup(false); }} style={{
                  display: "block",
                  color: colors.textPrimary,
                  textDecoration: "none",
                  padding: "10px 18px",
                  fontSize: "0.85rem",
                  transition: "all 0.2s",
                  position: "relative" as const,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = colors.bgSecondary;
                  e.currentTarget.style.color = colors.accent;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = colors.textPrimary;
                }}>
                  💬 Messages
                  {unreadCount > 0 && (
                    <span style={{
                      position: "absolute" as const,
                      top: "6px",
                      right: "12px",
                      background: "#ef4444",
                      color: "#fff",
                      borderRadius: "10px",
                      fontSize: "0.7rem",
                      fontWeight: "700",
                      padding: "1px 6px",
                      minWidth: "18px",
                      textAlign: "center" as const,
                    }}>
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                </Link>

                {/* Panel Admin - Visible uniquement pour Cyber_Admin */}
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
                    
                    <Link to="/admin/security" onClick={() => setShowUserMenu(false)} style={{
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
                      🔒 Tableau de bord sécurité
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

          {/* Icône message avec badge si non lus */}
          {unreadCount > 0 && (
            <Link
              to="/messages"
              onClick={() => { setUnreadCount(0); setShowMsgPopup(false); }}
              title={`${unreadCount} message(s) non lu(s)`}
              style={{
                position: "relative" as const,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "36px",
                height: "36px",
                background: colors.bgSecondary,
                border: "2px solid #ef4444",
                borderRadius: "50%",
                textDecoration: "none",
                fontSize: "1rem",
                flexShrink: 0,
                animation: "pulse-msg 1.5s ease-in-out infinite",
              }}
            >
              💬
              <span style={{
                position: "absolute" as const,
                top: "-4px",
                right: "-4px",
                background: "#ef4444",
                color: "#fff",
                borderRadius: "10px",
                fontSize: "0.65rem",
                fontWeight: "700",
                padding: "1px 5px",
                minWidth: "16px",
                textAlign: "center" as const,
              }}>
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            </Link>
          )}
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

            {/* MODULES OSINT - 10 modules (6 anciens + 4 nouveaux) */}
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
              { label: "📸 Instagram 🆕", to: "/modules/instagram" },
              { label: "📘 Facebook 🆕", to: "/modules/facebook" },
              { label: "🎵 TikTok 🆕", to: "/modules/tiktok" },
              { label: "🗺️ Google Maps 🆕", to: "/modules/googlemaps" },
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

    {/* POPUP NOUVEAU MESSAGE */}
    {showMsgPopup && (
      <div style={{
        position: "fixed" as const,
        bottom: "30px",
        left: "30px",
        zIndex: 9998,
        background: "#0b0f1a",
        border: "2px solid #ef4444",
        borderRadius: "12px",
        padding: "16px 20px",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        boxShadow: "0 4px 30px rgba(239,68,68,0.4)",
        minWidth: "280px",
        maxWidth: "360px",
        animation: "slideInLeft 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
      }}>
        <span style={{ fontSize: "1.8rem", flexShrink: 0 }}>💬</span>
        <div style={{ flex: 1 }}>
          <p style={{ color: "#ef4444", fontWeight: "bold", margin: "0 0 3px 0", fontSize: "0.95rem" }}>
            Nouveau(x) message(s) !
          </p>
          <p style={{ color: "#e5e7eb", margin: 0, fontSize: "0.82rem", lineHeight: "1.4" }}>
            Vous avez <strong style={{ color: "#ef4444" }}>{unreadCount}</strong> message{unreadCount > 1 ? "s" : ""} non lu{unreadCount > 1 ? "s" : ""}.
          </p>
        </div>
        <div style={{ display: "flex", flexDirection: "column" as const, gap: "6px", flexShrink: 0 }}>
          <Link
            to="/messages"
            onClick={() => { setShowMsgPopup(false); setUnreadCount(0); }}
            style={{
              background: "#ef4444",
              color: "#fff",
              textDecoration: "none",
              padding: "5px 10px",
              borderRadius: "6px",
              fontSize: "0.78rem",
              fontWeight: "600",
              textAlign: "center" as const,
            }}
          >
            Voir
          </Link>
          <button
            onClick={() => setShowMsgPopup(false)}
            style={{
              background: "transparent",
              border: "1px solid #4b5563",
              color: "#9ca3af",
              cursor: "pointer",
              fontSize: "0.78rem",
              padding: "4px 10px",
              borderRadius: "6px",
            }}
          >
            Fermer
          </button>
        </div>
      </div>
    )}

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
      @keyframes slideInLeft {
        from { opacity: 0; transform: translateX(-40px); }
        to   { opacity: 1; transform: translateX(0); }
      }
      @keyframes pulse-msg {
        0%, 100% { box-shadow: 0 0 0 0 rgba(239,68,68,0.5); }
        50%       { box-shadow: 0 0 0 6px rgba(239,68,68,0); }
      }
    `}</style>
    </>
  );
}

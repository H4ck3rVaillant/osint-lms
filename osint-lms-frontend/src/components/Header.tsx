import { Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import Logo from "../assets/images/Logo.png";

const AVATARS: Record<string, string> = {
  hacker: "🧑‍💻", ninja: "🥷", ghost: "👻", robot: "🤖", alien: "👽",
  skull: "💀", detective: "🕵️", wizard: "🧙", demon: "😈", cat: "🐱",
  fox: "🦊", wolf: "🐺", dragon: "🐉", parrot: "🦜", cyber: "⚡",
};

function getUserAvatar(username: string): string {
  const saved = localStorage.getItem(`avatar_${username}`);
  return saved && AVATARS[saved] ? AVATARS[saved] : "🧑‍💻";
}

export default function Header() {
  const auth = useAuth();
  const [showOutilsMenu, setShowOutilsMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  if (!auth.user) return null;

  const { logout, user } = auth;

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  // ✅ FIX: Menu CLIQUABLE qui reste ouvert
  const toggleOutilsMenu = () => {
    setShowOutilsMenu(!showOutilsMenu);
  };

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  return (
    <header style={{
      position: "fixed" as const,
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      height: "80px",
      background: "#020617",
      borderBottom: "1px solid #00ff9c",
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
      display: "flex",
      alignItems: "center",
      padding: "0 30px",
      gap: "30px",
    }}>
      
      {/* LOGO */}
      <Link to="/dashboard" style={{ display: "flex", alignItems: "center", textDecoration: "none", flexShrink: 0 }}>
        <img src={Logo} alt="Logo" style={{ height: "50px", marginRight: "12px" }} />
        <span style={{ color: "#00ff9c", fontSize: "1.2rem", fontWeight: "bold" }}>
          CyberOSINT Academy
        </span>
      </Link>

      {/* NAVIGATION */}
      <nav style={{
        display: "flex",
        gap: "8px",
        flex: 1,
        alignItems: "center",
        overflowX: "auto" as const,
        overflowY: "hidden",
      }}>
        
        {/* Liens principaux */}
        {[
          { label: "🏠 Dashboard", to: "/dashboard" },
          { label: "📚 Parcours",  to: "/parcours-debutant" },
          { label: "📝 Exercices", to: "/exercices-osint" },
          { label: "🔎 Études de cas", to: "/etudes-osint" },
          { label: "🏅 Badges", to: "/badges-osint" },
        ].map((item) => (
          <Link key={item.to} to={item.to} style={{
            color: "#e5e7eb",
            textDecoration: "none",
            fontWeight: "500",
            padding: "6px 10px",
            borderRadius: "6px",
            fontSize: "0.85rem",
            whiteSpace: "nowrap" as const,
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "#00ff9c";
            e.currentTarget.style.background = "#1a1f2e";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "#e5e7eb";
            e.currentTarget.style.background = "transparent";
          }}>
            {item.label}
          </Link>
        ))}

        {/* SÉPARATEUR */}
        <div style={{ width: "2px", height: "28px", background: "#00ff9c", margin: "0 6px", flexShrink: 0 }} />

        {/* Gamification */}
        {[
          { label: "🚩 CTF", to: "/ctf" },
          { label: "🏆 Leaderboard", to: "/leaderboard" },
          { label: "⭐ Progression", to: "/progression" },
          { label: "🧪 Labo", to: "/labo-osint" },
        ].map((item) => (
          <Link key={item.to} to={item.to} style={{
            color: "#e5e7eb",
            textDecoration: "none",
            fontWeight: "500",
            padding: "6px 10px",
            borderRadius: "6px",
            fontSize: "0.85rem",
            whiteSpace: "nowrap" as const,
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "#00ff9c";
            e.currentTarget.style.background = "#1a1f2e";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "#e5e7eb";
            e.currentTarget.style.background = "transparent";
          }}>
            {item.label}
          </Link>
        ))}

        {/* ✅ MENU OUTILS CLIQUABLE */}
        <div style={{ position: "relative" as const }}>
          <span onClick={toggleOutilsMenu} style={{
            color: showOutilsMenu ? "#00ff9c" : "#e5e7eb",
            fontWeight: "500",
            cursor: "pointer",
            padding: "6px 10px",
            borderRadius: "6px",
            fontSize: "0.85rem",
            transition: "all 0.2s",
            background: showOutilsMenu ? "#1a1f2e" : "transparent",
            display: "block",
            whiteSpace: "nowrap" as const,
          }}>
            🛠️ Outils ▾
          </span>

          {showOutilsMenu && (
            <div style={{
              position: "absolute" as const,
              top: "36px",
              left: "-20px",
              background: "#0b0f1a",
              border: "1px solid #00ff9c",
              borderRadius: "8px",
              padding: "8px 0",
              minWidth: "230px",
              zIndex: 1000,
              boxShadow: "0 4px 20px rgba(0, 255, 156, 0.2)",
            }}>
              {[
                { label: "🤖 HackerAI", to: "/hacker-ai" },
                { label: "📦 Dependency Track", to: "/dependency-track" },
                { label: "🔧 Outils Cyber", to: "/outils-cyber" },
                { label: "📚 Référentiels", to: "/referentiels" },
                { label: "💻 VM Access", to: "/vm-access" },
                { label: "🐉 Kali Linux Lab", to: "/vm-kali" },
                { label: "🦜 Parrot OS Lab", to: "/vm-parrot" },
              ].map((item) => (
                <Link key={item.to} to={item.to} onClick={() => setShowOutilsMenu(false)} style={{
                  display: "block",
                  color: "#e5e7eb",
                  textDecoration: "none",
                  padding: "10px 20px",
                  fontSize: "0.9rem",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#1a1f2e";
                  e.currentTarget.style.color = "#00ff9c";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "#e5e7eb";
                }}>
                  {item.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* BARRE */}
      <div style={{ width: "2px", height: "40px", background: "#00ff9c" }} />

      {/* ✅ MENU UTILISATEUR AVEC PROFIL */}
      <div style={{ position: "relative" as const }}>
        <div onClick={toggleUserMenu} style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          cursor: "pointer",
          padding: "6px 12px",
          borderRadius: "8px",
          transition: "background 0.2s",
          background: showUserMenu ? "#1a1f2e" : "transparent",
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = "#1a1f2e"}
        onMouseLeave={(e) => { if (!showUserMenu) e.currentTarget.style.background = "transparent"; }}>
          
          <div style={{
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            border: "2px solid #00ff9c",
            background: "#1a1f2e",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.3rem",
            flexShrink: 0,
          }}>
            {getUserAvatar(user.username)}
          </div>

          <span style={{ color: "#9ca3af", fontWeight: "500" }}>{user.username}</span>
          <span style={{ color: "#9ca3af", fontSize: "0.7rem" }}>▾</span>
        </div>

        {/* Dropdown menu utilisateur */}
        {showUserMenu && (
          <div style={{
            position: "absolute" as const,
            top: "56px",
            right: 0,
            background: "#0b0f1a",
            border: "1px solid #00ff9c",
            borderRadius: "8px",
            padding: "8px 0",
            minWidth: "200px",
            zIndex: 1000,
            boxShadow: "0 4px 20px rgba(0, 255, 156, 0.2)",
          }}>
            
            {/* ✅ LIEN PROFIL */}
            <Link to="/profil" onClick={() => setShowUserMenu(false)} style={{
              display: "block",
              color: "#e5e7eb",
              textDecoration: "none",
              padding: "12px 20px",
              fontSize: "0.9rem",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#1a1f2e";
              e.currentTarget.style.color = "#00ff9c";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "#e5e7eb";
            }}>
              👤 Mon Profil
            </Link>

            {/* ✅ LIEN CONTACT */}
            <Link to="/contact" onClick={() => setShowUserMenu(false)} style={{
              display: "block",
              color: "#e5e7eb",
              textDecoration: "none",
              padding: "12px 20px",
              fontSize: "0.9rem",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#1a1f2e";
              e.currentTarget.style.color = "#00ff9c";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "#e5e7eb";
            }}>
              📧 Contact Admin
            </Link>

            <div style={{ height: "1px", background: "#2a3f3f", margin: "8px 0" }} />

            <button onClick={handleLogout} style={{
              width: "100%",
              background: "transparent",
              color: "#ef4444",
              border: "none",
              padding: "12px 20px",
              textAlign: "left" as const,
              cursor: "pointer",
              fontSize: "0.9rem",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#1a1f2e";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
            }}>
              🚪 Déconnexion
            </button>
          </div>
        )}
      </div>

    </header>
  );
}

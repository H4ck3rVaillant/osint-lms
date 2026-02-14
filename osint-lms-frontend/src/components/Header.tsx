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

  return (
    <>
    {/* LIGNE 1 - LOGO + LIENS PRINCIPAUX */}
    <header style={{
      position: "fixed" as const,
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      background: "#020617",
      borderBottom: "1px solid #00ff9c",
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
    }}>
      
      {/* PREMIÈRE LIGNE */}
      <div style={{
        height: "60px",
        display: "flex",
        alignItems: "center",
        padding: "0 30px",
        gap: "20px",
      }}>
        
        {/* LOGO */}
        <Link to="/dashboard" style={{ display: "flex", alignItems: "center", textDecoration: "none", flexShrink: 0 }}>
          <img src={Logo} alt="Logo" style={{ height: "40px", marginRight: "10px" }} />
          <span style={{ color: "#00ff9c", fontSize: "1rem", fontWeight: "bold", whiteSpace: "nowrap" }}>
            CyberOSINT Academy
          </span>
        </Link>

        {/* NAVIGATION PRINCIPALE */}
        <nav style={{
          display: "flex",
          gap: "6px",
          flex: 1,
          alignItems: "center",
        }}>
          
          {[
            { label: "🏠 Dashboard", to: "/dashboard" },
            { label: "📚 Parcours", to: "/parcours-debutant" },
            { label: "📝 Exercices", to: "/exercices-osint" },
            { label: "🔎 Études", to: "/etudes-osint" },
            { label: "🏅 Badges", to: "/badges-osint" },
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
              fontSize: "0.8rem",
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

          {/* MENU OUTILS CLIQUABLE */}
          <div style={{ position: "relative" as const }}>
            <span onClick={() => setShowOutilsMenu(!showOutilsMenu)} style={{
              color: showOutilsMenu ? "#00ff9c" : "#e5e7eb",
              fontWeight: "500",
              cursor: "pointer",
              padding: "6px 10px",
              borderRadius: "6px",
              fontSize: "0.8rem",
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
                minWidth: "200px",
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
                    fontSize: "0.85rem",
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

        {/* MENU UTILISATEUR */}
        <div style={{ position: "relative" as const }}>
          <div onClick={() => setShowUserMenu(!showUserMenu)} style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            cursor: "pointer",
            padding: "6px 12px",
            borderRadius: "8px",
            transition: "background 0.2s",
            background: showUserMenu ? "#1a1f2e" : "transparent",
          }}>
            
            <div style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              border: "2px solid #00ff9c",
              background: "#1a1f2e",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.2rem",
              flexShrink: 0,
            }}>
              {getUserAvatar(user.username)}
            </div>

            <span style={{ color: "#9ca3af", fontWeight: "500", fontSize: "0.85rem" }}>{user.username}</span>
            <span style={{ color: "#9ca3af", fontSize: "0.6rem" }}>▾</span>
          </div>

          {showUserMenu && (
            <div style={{
              position: "absolute" as const,
              top: "50px",
              right: 0,
              background: "#0b0f1a",
              border: "1px solid #00ff9c",
              borderRadius: "8px",
              padding: "8px 0",
              minWidth: "180px",
              zIndex: 1000,
              boxShadow: "0 4px 20px rgba(0, 255, 156, 0.2)",
            }}>
              
              <Link to="/profil" onClick={() => setShowUserMenu(false)} style={{
                display: "block",
                color: "#e5e7eb",
                textDecoration: "none",
                padding: "12px 20px",
                fontSize: "0.85rem",
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

              <Link to="/contact" onClick={() => setShowUserMenu(false)} style={{
                display: "block",
                color: "#e5e7eb",
                textDecoration: "none",
                padding: "12px 20px",
                fontSize: "0.85rem",
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
                fontSize: "0.85rem",
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

      </div>
    </header>

    {/* SPACER pour compenser le header fixed */}
    <div style={{ height: "60px" }} />
    </>
  );
}

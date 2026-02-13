import { Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import Logo from "../assets/images/Logo.png";


// Liste des avatars disponibles (même ordre que RegisterPage)
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

  // ⛔️ PAS DE HEADER SI PAS CONNECTÉ
  if (!auth.user) {
    return null;
  }

  const { logout, user } = auth;

  const handleLogout = () => {
    logout();
    window.location.href = "/"; // retour home publique
  };

  return (
    <header
      style={{
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
      }}
    >
      {/* GAUCHE */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <img src={Logo} alt="Logo" style={{ width: "40px" }} />
        <span style={{ color: "#00ff9c", fontWeight: "bold" }}>
          CyberOSINT Academy
        </span>
      </div>

      {/* BARRE */}
      <div style={{ width: "2px", height: "40px", background: "#00ff9c" }} />

      {/* MENU */}
      <nav
        style={{
          display: "flex",
          gap: "4px",
          flexGrow: 1,
          justifyContent: "center",
          alignItems: "center",
          position: "relative" as const,
        }}
      >
        {/* BLOC 1 : Navigation principale */}
        {[
          { label: "🖥️ Dashboard",    to: "/dashboard" },
          { label: "📚 Parcours",      to: "/parcours/debutant" },
          { label: "✏️ Exercices",     to: "/exercices-osint" },
          { label: "🔎 Études de cas", to: "/etudes-osint" },
          { label: "🏅 Badges",        to: "/badges-osint" },
        ].map((item) => (
          <Link
            key={item.to}
            to={item.to}
            style={{
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
            }}
          >
            {item.label}
          </Link>
        ))}

        {/* SÉPARATEUR VERT VERTICAL */}
        <div style={{ width: "2px", height: "28px", background: "#00ff9c", margin: "0 6px", flexShrink: 0 }} />

        {/* BLOC 2 : Gamification */}
        {[
          { label: "🚩 CTF",        to: "/ctf" },
          { label: "🏆 Leaderboard", to: "/leaderboard" },
          { label: "⭐ Progression", to: "/progression" },
          { label: "🧪 Labo",        to: "/labo-osint" },
        ].map((item) => (
          <Link
            key={item.to}
            to={item.to}
            style={{
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
            }}
          >
            {item.label}
          </Link>
        ))}

        {/* Menu déroulant Outils */}
        <div
          style={{ position: "relative" as const }}
          onMouseEnter={() => setShowOutilsMenu(true)}
          onMouseLeave={() => setShowOutilsMenu(false)}
        >
          <span
            style={{
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
            }}
          >
            🛠️ Outils ▾
          </span>

          {showOutilsMenu && (
            <div
              style={{
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
              }}
              onMouseEnter={() => setShowOutilsMenu(true)}
              onMouseLeave={() => setShowOutilsMenu(false)}
            >
              {[
                { label: "🤖 HackerAI",        to: "/hacker-ai" },
                { label: "📦 Dependency Track", to: "/dependency-track" },
                { label: "🔧 Outils Cyber",     to: "/outils-cyber" },
                { label: "📚 Référentiels",      to: "/referentiels" },
                { label: "💻 VM Access",         to: "/vm-access" },
                { label: "🐉 Kali Linux Lab",    to: "/vm-kali" },
                { label: "🦜 Parrot OS Lab",     to: "/vm-parrot" },
              ].map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  style={{
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
                  }}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* BARRE */}
      <div style={{ width: "2px", height: "40px", background: "#00ff9c" }} />

      {/* DROITE */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
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

        <span style={{ color: "#9ca3af" }}>{user.username}</span>

        <button
          onClick={handleLogout}
          style={{
            background: "#00ff9c",
            color: "#000",
            border: "none",
            padding: "6px 12px",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Déconnexion
        </button>
      </div>
    </header>
  );
}

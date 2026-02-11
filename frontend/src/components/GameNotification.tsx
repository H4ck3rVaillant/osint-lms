import { useEffect, useState } from "react";
import { useGame } from "../context/GameContext";

export default function GameNotification() {
  const { recentNotification, clearNotification } = useGame();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (recentNotification) {
      setVisible(true);
      const t = setTimeout(() => {
        setVisible(false);
        setTimeout(clearNotification, 400);
      }, 3600);
      return () => clearTimeout(t);
    }
  }, [recentNotification, clearNotification]);

  if (!recentNotification) return null;

  const config = {
    success: { border: "#00ff9c", bg: "#0a1a0f", icon: "✅" },
    badge:   { border: "#fbbf24", bg: "#1a1000", icon: "🏅" },
    level:   { border: "#8b5cf6", bg: "#130b2e", icon: "⬆️" },
  }[recentNotification.type];

  return (
    <div style={{
      position: "fixed",
      bottom: "30px",
      right: "30px",
      zIndex: 9999,
      background: config.bg,
      border: `2px solid ${config.border}`,
      borderRadius: "12px",
      padding: "16px 22px",
      display: "flex",
      alignItems: "center",
      gap: "12px",
      boxShadow: `0 4px 30px ${config.border}44`,
      minWidth: "280px",
      maxWidth: "380px",
      transform: visible ? "translateX(0)" : "translateX(120%)",
      opacity: visible ? 1 : 0,
      transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)"
    }}>
      <span style={{ fontSize: "2rem", flexShrink: 0 }}>{config.icon}</span>
      <div style={{ flex: 1 }}>
        <p style={{ color: config.border, fontWeight: "bold", margin: "0 0 2px 0", fontSize: "0.95rem" }}>
          {recentNotification.type === "success" ? "Flag validé !" :
           recentNotification.type === "badge"   ? "Badge débloqué !" :
                                                   "Niveau supérieur !"}
        </p>
        <p style={{ color: "#e5e7eb", margin: 0, fontSize: "0.85rem", lineHeight: "1.4" }}>
          {recentNotification.message}
        </p>
      </div>
      <button
        onClick={() => { setVisible(false); setTimeout(clearNotification, 300); }}
        style={{
          background: "transparent",
          border: "none",
          color: "#9ca3af",
          cursor: "pointer",
          fontSize: "1rem",
          flexShrink: 0,
          padding: "4px"
        }}
      >✕</button>
    </div>
  );
}

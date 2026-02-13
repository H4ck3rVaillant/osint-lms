import { useState, useEffect } from "react";
import { useAuth } from "../auth/AuthContext";

export default function InactivityWarning() {
  const { user } = useAuth();
  const [showWarning, setShowWarning] = useState(false);
  const [countdown, setCountdown] = useState(60); // 60 secondes

  const WARNING_DELAY = 14 * 60 * 1000; // Afficher le warning à 14 minutes
  const COUNTDOWN_DURATION = 60; // 60 secondes de countdown

  useEffect(() => {
    if (!user) return;

    let warningTimer: NodeJS.Timeout;
    let countdownInterval: NodeJS.Interval;

    const resetTimer = () => {
      clearTimeout(warningTimer);
      clearInterval(countdownInterval);
      setShowWarning(false);
      setCountdown(COUNTDOWN_DURATION);

      // Définir le timer pour le warning
      warningTimer = setTimeout(() => {
        setShowWarning(true);
        
        // Démarrer le countdown
        let secondsLeft = COUNTDOWN_DURATION;
        countdownInterval = setInterval(() => {
          secondsLeft--;
          setCountdown(secondsLeft);
          
          if (secondsLeft <= 0) {
            clearInterval(countdownInterval);
          }
        }, 1000);
      }, WARNING_DELAY);
    };

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];

    events.forEach(event => {
      document.addEventListener(event, resetTimer);
    });

    resetTimer();

    return () => {
      clearTimeout(warningTimer);
      clearInterval(countdownInterval);
      events.forEach(event => {
        document.removeEventListener(event, resetTimer);
      });
    };
  }, [user]);

  const handleStayConnected = () => {
    setShowWarning(false);
    setCountdown(COUNTDOWN_DURATION);
    // L'activité (clic) va automatiquement reset le timer principal
  };

  if (!showWarning || !user) return null;

  return (
    <div style={{
      position: "fixed" as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(0, 0, 0, 0.85)",
      zIndex: 9999,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      animation: "fadeIn 0.3s ease-out"
    }}>
      <div style={{
        background: "#0b0f1a",
        border: "2px solid #fbbf24",
        borderRadius: "16px",
        padding: "40px",
        maxWidth: "500px",
        textAlign: "center",
        boxShadow: "0 20px 60px rgba(251, 191, 36, 0.3)",
        animation: "slideIn 0.3s ease-out"
      }}>
        {/* Icône warning */}
        <div style={{
          fontSize: "4rem",
          marginBottom: "20px",
          animation: "pulse 2s infinite"
        }}>
          ⚠️
        </div>

        {/* Titre */}
        <h2 style={{
          color: "#fbbf24",
          fontSize: "1.8rem",
          marginBottom: "15px",
          fontWeight: "bold"
        }}>
          Session inactive
        </h2>

        {/* Message */}
        <p style={{
          color: "#9ca3af",
          fontSize: "1.1rem",
          marginBottom: "25px",
          lineHeight: "1.6"
        }}>
          Vous serez déconnecté automatiquement dans
        </p>

        {/* Countdown */}
        <div style={{
          background: "#1a1f2e",
          border: "2px solid #fbbf24",
          borderRadius: "12px",
          padding: "20px",
          marginBottom: "30px"
        }}>
          <div style={{
            color: "#fbbf24",
            fontSize: "3rem",
            fontWeight: "bold",
            fontFamily: "monospace"
          }}>
            {countdown}s
          </div>
        </div>

        {/* Bouton */}
        <button
          onClick={handleStayConnected}
          style={{
            width: "100%",
            padding: "16px",
            background: "#fbbf24",
            color: "#0b0f1a",
            border: "none",
            borderRadius: "10px",
            fontSize: "1.1rem",
            fontWeight: "bold",
            cursor: "pointer",
            transition: "all 0.3s",
            boxShadow: "0 4px 15px rgba(251, 191, 36, 0.4)"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 6px 20px rgba(251, 191, 36, 0.6)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 4px 15px rgba(251, 191, 36, 0.4)";
          }}
        >
          Rester connecté
        </button>

        <p style={{
          color: "#6b7280",
          fontSize: "0.85rem",
          marginTop: "15px"
        }}>
          Bougez votre souris ou appuyez sur une touche pour rester actif
        </p>
      </div>

      {/* Animations CSS */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.8;
          }
        }
      `}</style>
    </div>
  );
}

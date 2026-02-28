import { useState } from "react";
import { useThemeColors } from "../context/ThemeContext";

export default function YouTubePage() {
  const colors = useThemeColors();
  const [selectedCategory, setSelectedCategory] = useState("playlists");

  const categories = [
    { id: "playlists", label: "📚 Playlists OSINT", icon: "🎬" },
    { id: "chaines", label: "📺 Chaînes Recommandées", icon: "⭐" },
  ];

  // ✅ PLAYLISTS VÉRIFIÉES ET FONCTIONNELLES
  const playlists = [
    {
      title: "OSINT Fundamentals - Complete Course",
      channel: "The Cyber Mentor",
      videoId: "qwA6MmbeGNo", // Vidéo unique valide
      description: "Introduction complète à l'OSINT avec démonstrations pratiques"
    },
    {
      title: "OSINT At Home #1 - Introduction",
      channel: "Ben Strick",
      videoId: "nYa3ix5tvgQ",
      description: "Série OSINT At Home - Investigations digitales et géolocalisation"
    },
    {
      title: "Google Dorking for OSINT",
      channel: "OSINT Dojo",
      videoId: "u_gOnwWEXiA",
      description: "Maîtriser Google Dorks pour des recherches OSINT avancées"
    },
    {
      title: "Social Media OSINT",
      channel: "NetworkChuck",
      videoId: "9Uy5SGELYd4",
      description: "Techniques OSINT pour les réseaux sociaux"
    },
    {
      title: "Maltego Tutorial for Beginners",
      channel: "David Bombal",
      videoId: "46st98FUf8s",
      description: "Guide complet de Maltego pour l'OSINT"
    },
  ];

  // Chaînes YouTube OSINT recommandées
  const chaines = [
    {
      name: "The Cyber Mentor",
      url: "https://www.youtube.com/@TCMSecurityAcademy",
      description: "Formation complète cybersécurité et OSINT, idéal débutants",
      subscribers: "800K+"
    },
    {
      name: "Ben Strick - OSINT At Home",
      url: "https://www.youtube.com/@BenStrick",
      description: "Investigations digitales, géolocalisation, vérification",
      subscribers: "30K+"
    },
    {
      name: "OSINT Dojo",
      url: "https://www.youtube.com/@OSINTDojo",
      description: "Tutoriels pratiques, outils et méthodologie OSINT",
      subscribers: "45K+"
    },
    {
      name: "The OSINT Curious Project",
      url: "https://www.youtube.com/@OSINTCurious",
      description: "Webcasts, interviews et ressources communautaires",
      subscribers: "15K+"
    },
    {
      name: "Hackers Arise",
      url: "https://www.youtube.com/@HackersArise",
      description: "Hacking, OSINT et cybersécurité avancée",
      subscribers: "200K+"
    },
    {
      name: "David Bombal",
      url: "https://www.youtube.com/@davidbombal",
      description: "Outils OSINT, demos et tutoriels techniques",
      subscribers: "3M+"
    },
    {
      name: "Trace Labs",
      url: "https://www.youtube.com/@TraceLabsOrg",
      description: "OSINT CTF challenges et competitions",
      subscribers: "10K+"
    },
    {
      name: "Bendobrown",
      url: "https://www.youtube.com/@bendobrown",
      description: "SOCMINT et investigations réseaux sociaux",
      subscribers: "20K+"
    },
  ];

  return (
    <div style={{
      minHeight: "100vh",
      background: colors.bgPrimary,
      paddingTop: "80px",
    }}>
      <div style={{
        maxWidth: "1400px",
        margin: "0 auto",
        padding: "40px 20px",
      }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "50px" }}>
          <div style={{ fontSize: "4rem", marginBottom: "15px" }}>📹</div>
          <h1 style={{
            fontSize: "2.5rem",
            fontWeight: "700",
            color: colors.textPrimary,
            marginBottom: "15px",
          }}>
            Ressources Vidéo OSINT
          </h1>
          <p style={{
            fontSize: "1.1rem",
            color: colors.textSecondary,
            maxWidth: "700px",
            margin: "0 auto",
          }}>
            Vidéos sélectionnées et chaînes YouTube recommandées par des experts OSINT
          </p>
        </div>

        {/* Tabs */}
        <div style={{
          display: "flex",
          justifyContent: "center",
          gap: "15px",
          marginBottom: "40px",
          flexWrap: "wrap",
        }}>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              style={{
                padding: "12px 24px",
                background: selectedCategory === cat.id ? colors.accent : colors.bgSecondary,
                color: selectedCategory === cat.id ? "#fff" : colors.textPrimary,
                border: `2px solid ${selectedCategory === cat.id ? colors.accent : colors.border}`,
                borderRadius: "12px",
                fontSize: "1rem",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: selectedCategory === cat.id ? `0 4px 15px ${colors.accent}40` : "none",
              }}
            >
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>

        {/* Vidéos OSINT */}
        {selectedCategory === "playlists" && (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))",
            gap: "30px",
          }}>
            {playlists.map((video, index) => (
              <div
                key={index}
                style={{
                  background: colors.bgSecondary,
                  border: `1px solid ${colors.border}`,
                  borderRadius: "12px",
                  overflow: "hidden",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-5px)";
                  e.currentTarget.style.boxShadow = `0 10px 30px ${colors.shadow}`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                {/* Player Vidéo */}
                <div style={{
                  position: "relative" as const,
                  paddingBottom: "56.25%",
                  height: 0,
                  overflow: "hidden",
                }}>
                  <iframe
                    src={`https://www.youtube.com/embed/${video.videoId}`}
                    title={video.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{
                      position: "absolute" as const,
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                    }}
                  />
                </div>

                <div style={{ padding: "20px" }}>
                  <h3 style={{
                    fontSize: "1.1rem",
                    fontWeight: "600",
                    color: colors.textPrimary,
                    marginBottom: "8px",
                  }}>
                    {video.title}
                  </h3>
                  <p style={{
                    fontSize: "0.85rem",
                    color: colors.accent,
                    marginBottom: "10px",
                    fontWeight: "500",
                  }}>
                    📺 {video.channel}
                  </p>
                  <p style={{
                    fontSize: "0.9rem",
                    color: colors.textSecondary,
                    lineHeight: "1.5",
                  }}>
                    {video.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Chaînes */}
        {selectedCategory === "chaines" && (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
            gap: "25px",
          }}>
            {chaines.map((chaine, index) => (
              <a
                key={index}
                href={chaine.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: colors.bgSecondary,
                  border: `1px solid ${colors.border}`,
                  borderRadius: "12px",
                  padding: "25px",
                  textDecoration: "none",
                  transition: "all 0.3s ease",
                  display: "block",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-5px)";
                  e.currentTarget.style.borderColor = colors.accent;
                  e.currentTarget.style.boxShadow = `0 10px 30px ${colors.shadow}`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.borderColor = colors.border;
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "15px",
                  marginBottom: "15px",
                }}>
                  <div style={{
                    width: "50px",
                    height: "50px",
                    background: colors.accent,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.5rem",
                    flexShrink: 0,
                  }}>
                    📺
                  </div>
                  <div>
                    <h3 style={{
                      fontSize: "1.2rem",
                      fontWeight: "600",
                      color: colors.textPrimary,
                      marginBottom: "4px",
                    }}>
                      {chaine.name}
                    </h3>
                    <p style={{
                      fontSize: "0.85rem",
                      color: colors.accent,
                      fontWeight: "500",
                    }}>
                      {chaine.subscribers} abonnés
                    </p>
                  </div>
                </div>
                <p style={{
                  fontSize: "0.95rem",
                  color: colors.textSecondary,
                  lineHeight: "1.6",
                }}>
                  {chaine.description}
                </p>
                <div style={{
                  marginTop: "15px",
                  fontSize: "0.9rem",
                  color: colors.accent,
                  fontWeight: "500",
                }}>
                  Visiter la chaîne →
                </div>
              </a>
            ))}
          </div>
        )}

        {/* Note */}
        <div style={{
          marginTop: "60px",
          padding: "25px",
          background: `${colors.accent}10`,
          border: `1px solid ${colors.accent}30`,
          borderRadius: "12px",
          textAlign: "center",
        }}>
          <p style={{
            color: colors.textSecondary,
            fontSize: "0.95rem",
            lineHeight: "1.6",
            margin: 0,
          }}>
            💡 <strong>Astuce :</strong> Ces ressources vidéo complètent votre formation mais ne sont pas 
            obligatoires pour obtenir le certificat. Explorez à votre rythme !
          </p>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { useThemeColors } from "../context/ThemeContext";

export default function YouTubePage() {
  const colors = useThemeColors();
  const [selectedCategory, setSelectedCategory] = useState("playlists");

  const categories = [
    { id: "playlists", label: "📚 Playlists OSINT", icon: "🎬" },
    { id: "chaines", label: "📺 Chaînes Recommandées", icon: "⭐" },
  ];

  // ✅ 5 PLAYLISTS QUI FONCTIONNENT (vérifiées)
  const playlists = [
    {
      title: "OSINT At Home - Complete Series",
      channel: "Ben Strick",
      url: "https://www.youtube.com/playlist?list=PLrFPX1Vfqk3ehZKSFeb9pVIHqxqrNW8Sy",
      description: "Série complète sur investigations digitales et géolocalisation",
      videos: "30+ vidéos"
    },
    {
      title: "OSINT Dojo - Tutorials",
      channel: "OSINT Dojo",  
      url: "https://www.youtube.com/playlist?list=PL423I_gHbWUUOs09899rex4t2l5py9YIk",
      description: "Tutoriels pratiques et démonstrations d'outils OSINT",
      videos: "50+ vidéos"
    },
    {
      title: "The Cyber Mentor - OSINT Course",
      channel: "The Cyber Mentor",
      url: "https://www.youtube.com/playlist?list=PLLKT__MCUeixqHJ1TRqrHsEd6_EdEvo47",
      description: "Formation OSINT complète avec exercices pratiques",
      videos: "20+ vidéos"
    },
    {
      title: "David Bombal - OSINT Tools",
      channel: "David Bombal",
      url: "https://www.youtube.com/@davidbombal/videos",
      description: "Outils OSINT et tutoriels techniques",
      videos: "100+ vidéos"
    },
    {
      title: "Hackers Arise - OSINT Techniques",
      channel: "Hackers Arise",
      url: "https://www.youtube.com/@HackersArise/videos",
      description: "Techniques OSINT avancées et méthodologie",
      videos: "80+ vidéos"
    },
  ];

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
            Playlists complètes et chaînes YouTube recommandées par des experts OSINT
          </p>
        </div>

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

        {selectedCategory === "playlists" && (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))",
            gap: "30px",
          }}>
            {playlists.map((playlist, index) => (
              <a
                key={index}
                href={playlist.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: colors.bgSecondary,
                  border: `1px solid ${colors.border}`,
                  borderRadius: "12px",
                  overflow: "hidden",
                  transition: "all 0.3s ease",
                  textDecoration: "none",
                  display: "block",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-5px)";
                  e.currentTarget.style.boxShadow = `0 10px 30px ${colors.shadow}`;
                  e.currentTarget.style.borderColor = colors.accent;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.borderColor = colors.border;
                }}
              >
                <div style={{
                  background: `linear-gradient(135deg, ${colors.accent}20, ${colors.bgPrimary})`,
                  padding: "60px 20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "5rem",
                }}>
                  🎬
                </div>

                <div style={{ padding: "20px" }}>
                  <h3 style={{
                    fontSize: "1.1rem",
                    fontWeight: "600",
                    color: colors.textPrimary,
                    marginBottom: "8px",
                  }}>
                    {playlist.title}
                  </h3>
                  <p style={{
                    fontSize: "0.85rem",
                    color: colors.accent,
                    marginBottom: "10px",
                    fontWeight: "500",
                  }}>
                    📺 {playlist.channel} · {playlist.videos}
                  </p>
                  <p style={{
                    fontSize: "0.9rem",
                    color: colors.textSecondary,
                    lineHeight: "1.5",
                  }}>
                    {playlist.description}
                  </p>
                  <div style={{
                    marginTop: "15px",
                    fontSize: "0.9rem",
                    color: colors.accent,
                    fontWeight: "600",
                  }}>
                    Voir la playlist sur YouTube →
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}

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
            💡 <strong>Astuce :</strong> Ces playlists contiennent des dizaines de vidéos OSINT.
            Cliquez pour explorer tout le contenu sur YouTube !
          </p>
        </div>
      </div>
    </div>
  );
}

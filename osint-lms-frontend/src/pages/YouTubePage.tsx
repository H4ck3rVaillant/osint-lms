import { useState } from "react";
import { useThemeColors } from "../context/ThemeContext";

export default function YouTubePage() {
  const colors = useThemeColors();
  const [selectedCategory, setSelectedCategory] = useState("debutant");

  const categories = [
    { id: "debutant", label: "🎓 Débutant", icon: "📚" },
    { id: "intermediaire", label: "📊 Intermédiaire", icon: "🔍" },
    { id: "avance", label: "🔬 Avancé", icon: "🎯" },
    { id: "outils", label: "🛠️ Outils & Demos", icon: "⚙️" },
  ];

  const videos = {
    debutant: [
      {
        title: "Introduction to OSINT - Les Fondamentaux",
        channel: "The OSINT Curious Project",
        url: "https://www.youtube.com/embed/qwA6MmbeGNo",
        description: "Introduction complète à l'OSINT et aux concepts de base"
      },
      {
        title: "OSINT 101 - Getting Started",
        channel: "OSINT Dojo",
        url: "https://www.youtube.com/embed/HKdxwc5E4Io",
        description: "Comment démarrer dans l'OSINT : outils et méthodologie"
      },
      {
        title: "OSINT At Home #1 - Image Reverse Search",
        channel: "Ben Strick - OSINT At Home",
        url: "https://www.youtube.com/embed/OyvHf7EcaVc",
        description: "Recherche d'images inversée pour démarrer une investigation"
      },
      {
        title: "Google Dorking for OSINT",
        channel: "OSINT Dojo",
        url: "https://www.youtube.com/embed/0e-jPW-7z5c",
        description: "Maîtriser les opérateurs de recherche Google avancés"
      },
      {
        title: "Social Media OSINT Basics",
        channel: "The Cyber Mentor",
        url: "https://www.youtube.com/embed/j5PPgU9iLhQ",
        description: "Techniques de base pour l'OSINT sur les réseaux sociaux"
      },
      {
        title: "Username Search Techniques",
        channel: "OSINT Dojo",
        url: "https://www.youtube.com/embed/R8FPqjq3-z0",
        description: "Comment rechercher un pseudonyme à travers les plateformes"
      },
      {
        title: "Email OSINT Investigation",
        channel: "OSINT Techniques",
        url: "https://www.youtube.com/embed/Wl6tGaT9JuM",
        description: "Investiguer une adresse email : techniques et outils"
      },
      {
        title: "OSINT Framework Overview",
        channel: "Hackers Arise",
        url: "https://www.youtube.com/embed/dp5_1w2qFcI",
        description: "Vue d'ensemble du framework OSINT et ses applications"
      },
    ],
    
    intermediaire: [
      {
        title: "OSINT At Home #4 - Geolocation from Images",
        channel: "Ben Strick",
        url: "https://www.youtube.com/embed/_p3B5G4QAVc",
        description: "Identifier une localisation à partir d'une photo ou vidéo"
      },
      {
        title: "EXIF Metadata Analysis",
        channel: "OSINT Dojo",
        url: "https://www.youtube.com/embed/8s5MjW89lKc",
        description: "Extraction et analyse de métadonnées EXIF dans les images"
      },
      {
        title: "Advanced LinkedIn OSINT",
        channel: "OSINT Techniques",
        url: "https://www.youtube.com/embed/MtZ3w30Lqco",
        description: "Techniques avancées de recherche sur LinkedIn"
      },
      {
        title: "Domain & IP Investigation",
        channel: "The Cyber Mentor",
        url: "https://www.youtube.com/embed/nLtDx8oLiQs",
        description: "Investigation de domaines et adresses IP"
      },
      {
        title: "Maltego for OSINT",
        channel: "OSINT Curious",
        url: "https://www.youtube.com/embed/iqXj94vp1MY",
        description: "Utiliser Maltego pour cartographier les relations"
      },
      {
        title: "Dark Web OSINT Introduction",
        channel: "Hackers Arise",
        url: "https://www.youtube.com/embed/9KaTsMCPu4I",
        description: "Introduction à l'OSINT sur le Dark Web avec TOR"
      },
      {
        title: "Breach Data Research",
        channel: "OSINT Dojo",
        url: "https://www.youtube.com/embed/F-qINbChh8Q",
        description: "Recherche dans les bases de données de fuites"
      },
      {
        title: "Cryptocurrency Tracking",
        channel: "OSINT Techniques",
        url: "https://www.youtube.com/embed/xZwFb5Q6qbY",
        description: "Tracer les transactions blockchain et crypto-monnaies"
      },
    ],

    avance: [
      {
        title: "OSINT At Home #8 - Shadow Analysis",
        channel: "Ben Strick",
        url: "https://www.youtube.com/embed/K0hBa_z1X4w",
        description: "Calculer l'heure avec l'analyse des ombres (chronolocation)"
      },
      {
        title: "Advanced Geolocation Techniques",
        channel: "OSINT Curious",
        url: "https://www.youtube.com/embed/8ZyU7HtXPbc",
        description: "Géolocalisation avancée : triangulation et satellite"
      },
      {
        title: "OSINT Automation with Python",
        channel: "The Cyber Mentor",
        url: "https://www.youtube.com/embed/CPgBEy9hJ5U",
        description: "Automatiser les investigations OSINT avec Python"
      },
      {
        title: "Maritime OSINT - Tracking Vessels",
        channel: "OSINT Techniques",
        url: "https://www.youtube.com/embed/2kC8QFmMzpo",
        description: "Traquer les navires et cargos avec AIS et OSINT maritime"
      },
      {
        title: "Aircraft Tracking OSINT",
        channel: "OSINT Dojo",
        url: "https://www.youtube.com/embed/nL0fP-DgEbk",
        description: "Suivre les avions civils et militaires en temps réel"
      },
      {
        title: "Advanced SOCMINT Facebook",
        channel: "OSINT Curious",
        url: "https://www.youtube.com/embed/L9-UQ-YYXsY",
        description: "Techniques avancées SOCMINT sur Facebook"
      },
      {
        title: "Building Custom OSINT Tools",
        channel: "OSINT Dojo",
        url: "https://www.youtube.com/embed/6MoCHD1xmWk",
        description: "Créer ses propres outils OSINT avec HTML/JavaScript"
      },
      {
        title: "OSINT CTF Challenge Walkthrough",
        channel: "Trace Labs",
        url: "https://www.youtube.com/embed/Z8n7r-0x6rA",
        description: "Résolution d'un challenge OSINT CTF étape par étape"
      },
    ],

    outils: [
      {
        title: "Sherlock - Username Search Tool",
        channel: "OSINT Dojo",
        url: "https://www.youtube.com/embed/V1RYdRMohBU",
        description: "Sherlock : recherche de pseudonymes sur 300+ plateformes"
      },
      {
        title: "Shodan - The Search Engine for Hackers",
        channel: "The Cyber Mentor",
        url: "https://www.youtube.com/embed/cyzPxfZHpC8",
        description: "Maîtriser Shodan pour trouver des devices connectés"
      },
      {
        title: "IntelX & DeHashed Demo",
        channel: "OSINT Techniques",
        url: "https://www.youtube.com/embed/O0z-e8KF87M",
        description: "Utiliser IntelX et DeHashed pour les recherches de fuites"
      },
      {
        title: "Wayback Machine for OSINT",
        channel: "OSINT Dojo",
        url: "https://www.youtube.com/embed/Q0k0gPEOZGg",
        description: "Exploiter les archives web avec la Wayback Machine"
      },
      {
        title: "Google Earth Pro for Investigations",
        channel: "Ben Strick",
        url: "https://www.youtube.com/embed/yHPPGzjDnXU",
        description: "Utiliser Google Earth Pro pour la géolocalisation"
      },
      {
        title: "PhoneInfoga - Phone Number OSINT",
        channel: "OSINT Techniques",
        url: "https://www.youtube.com/embed/1BGU8JFcZWg",
        description: "PhoneInfoga : investiguer un numéro de téléphone"
      },
      {
        title: "Spiderfoot Tutorial",
        channel: "The Cyber Mentor",
        url: "https://www.youtube.com/embed/F9lwzMPGIgo",
        description: "Spiderfoot : automation OSINT et reconnaissance"
      },
      {
        title: "Recon-ng Framework",
        channel: "OSINT Dojo",
        url: "https://www.youtube.com/embed/E8ujr3eldDA",
        description: "Recon-ng : framework modulaire pour reconnaissance OSINT"
      },
    ],
  };

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
            Tutoriels Vidéo OSINT
          </h1>
          <p style={{
            fontSize: "1.1rem",
            color: colors.textSecondary,
            maxWidth: "700px",
            margin: "0 auto",
          }}>
            Complétez votre formation avec ces vidéos YouTube sélectionnées par des experts OSINT
          </p>
        </div>

        {/* Tabs des catégories */}
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
              onMouseEnter={(e) => {
                if (selectedCategory !== cat.id) {
                  e.currentTarget.style.borderColor = colors.accent;
                }
              }}
              onMouseLeave={(e) => {
                if (selectedCategory !== cat.id) {
                  e.currentTarget.style.borderColor = colors.border;
                }
              }}
            >
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>

        {/* Grid de vidéos */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
          gap: "30px",
        }}>
          {videos[selectedCategory as keyof typeof videos].map((video, index) => (
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
              {/* Player YouTube */}
              <div style={{
                position: "relative" as const,
                paddingBottom: "56.25%", // Ratio 16:9
                height: 0,
                overflow: "hidden",
              }}>
                <iframe
                  src={video.url}
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

              {/* Infos vidéo */}
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

        {/* Note en bas de page */}
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
            💡 <strong>Astuce :</strong> Ces vidéos complètent votre formation mais ne sont pas obligatoires 
            pour obtenir le certificat. Prenez votre temps et explorez les chaînes YouTube pour approfondir !
          </p>
        </div>
      </div>
    </div>
  );
}

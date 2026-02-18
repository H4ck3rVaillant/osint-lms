import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useThemeColors } from "../context/ThemeContext";

interface QuizTheme {
  id: string;
  title: string;
  description: string;
  icon: string;
  difficulty: "Débutant" | "Intermédiaire" | "Avancé";
  questions: number;
  duration: string;
}

const quizThemes: QuizTheme[] = [
  {
    id: "osint-basics",
    title: "OSINT - Les Fondamentaux",
    description: "Maîtrisez les bases de l'OSINT : méthodologie, sources ouvertes, et premiers outils.",
    icon: "🎯",
    difficulty: "Débutant",
    questions: 20,
    duration: "15 min"
  },
  {
    id: "search-techniques",
    title: "Techniques de Recherche Avancées",
    description: "Google Dorking, opérateurs booléens, et recherche inversée d'images.",
    icon: "🔍",
    difficulty: "Intermédiaire",
    questions: 20,
    duration: "15 min"
  },
  {
    id: "geolocation",
    title: "Géolocalisation & Géospatial",
    description: "Analyse d'images, métadonnées EXIF, Google Earth, et triangulation.",
    icon: "🌍",
    difficulty: "Intermédiaire",
    questions: 20,
    duration: "15 min"
  },
  {
    id: "social-media",
    title: "Investigations Réseaux Sociaux",
    description: "OSINT sur Twitter, Facebook, Instagram, LinkedIn, TikTok, et Telegram.",
    icon: "📱",
    difficulty: "Intermédiaire",
    questions: 20,
    duration: "15 min"
  },
  {
    id: "crypto-blockchain",
    title: "Crypto & Blockchain OSINT",
    description: "Analyse blockchain, wallets, transactions, et attribution d'adresses.",
    icon: "₿",
    difficulty: "Avancé",
    questions: 20,
    duration: "15 min"
  },
  {
    id: "darkweb",
    title: "Dark Web & Anonymat",
    description: "Tor, I2P, marketplaces, et techniques d'investigation sécurisées.",
    icon: "🕵️",
    difficulty: "Avancé",
    questions: 20,
    duration: "15 min"
  }
];

export default function QuizPage() {
  const navigate = useNavigate();
  const colors = useThemeColors();
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);

  const handleStartQuiz = (themeId: string) => {
    navigate(`/quiz/${themeId}`);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Débutant": return "#10b981";
      case "Intermédiaire": return "#f59e0b";
      case "Avancé": return "#ef4444";
      default: return colors.accent;
    }
  };

  return (
    <div style={{ 
      minHeight: "100vh", 
      background: colors.bgPrimary,
      paddingTop: "80px"
    }}>
      <div style={{ 
        maxWidth: "1200px", 
        margin: "0 auto", 
        padding: "40px 20px" 
      }}>
        
        {/* Header */}
        <div style={{ 
          textAlign: "center", 
          marginBottom: "60px" 
        }}>
          <h1 style={{ 
            fontSize: "2.5rem", 
            fontWeight: "700", 
            color: colors.textPrimary,
            marginBottom: "15px"
          }}>
            🎓 Quiz OSINT Interactifs
          </h1>
          <p style={{ 
            fontSize: "1.1rem", 
            color: colors.textPrimarySecondary,
            maxWidth: "700px",
            margin: "0 auto"
          }}>
            Testez vos connaissances avec nos quiz chronométrés. 
            20 questions par thème, 30 secondes par question.
            Obtenez un badge selon votre score !
          </p>
        </div>

        {/* Légende badges */}
        <div style={{
          display: "flex",
          justifyContent: "center",
          gap: "30px",
          marginBottom: "50px",
          flexWrap: "wrap"
        }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "2rem", marginBottom: "5px" }}>🥉</div>
            <div style={{ color: colors.textPrimarySecondary, fontSize: "0.9rem" }}>Bronze</div>
            <div style={{ color: "#cd7f32", fontWeight: "600" }}>≥ 60%</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "2rem", marginBottom: "5px" }}>🥈</div>
            <div style={{ color: colors.textPrimarySecondary, fontSize: "0.9rem" }}>Argent</div>
            <div style={{ color: "#c0c0c0", fontWeight: "600" }}>≥ 80%</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "2rem", marginBottom: "5px" }}>🥇</div>
            <div style={{ color: colors.textPrimarySecondary, fontSize: "0.9rem" }}>Or</div>
            <div style={{ color: "#ffd700", fontWeight: "600" }}>≥ 95%</div>
          </div>
        </div>

        {/* Quiz Cards */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
          gap: "30px"
        }}>
          {quizThemes.map((theme) => (
            <div
              key={theme.id}
              onClick={() => setSelectedTheme(theme.id)}
              style={{
                background: selectedTheme === theme.id 
                  ? `linear-gradient(135deg, ${colors.accent}15, ${colors.accent}05)`
                  : colors.bgSecondary,
                border: `2px solid ${selectedTheme === theme.id ? colors.accent : colors.border}`,
                borderRadius: "16px",
                padding: "30px",
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: selectedTheme === theme.id 
                  ? `0 8px 30px ${colors.accent}30`
                  : "none"
              }}
              onMouseEnter={(e) => {
                if (selectedTheme !== theme.id) {
                  e.currentTarget.style.borderColor = colors.accent;
                  e.currentTarget.style.transform = "translateY(-4px)";
                }
              }}
              onMouseLeave={(e) => {
                if (selectedTheme !== theme.id) {
                  e.currentTarget.style.borderColor = colors.border;
                  e.currentTarget.style.transform = "translateY(0)";
                }
              }}
            >
              {/* Icon + Difficulty Badge */}
              <div style={{ 
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "flex-start",
                marginBottom: "20px"
              }}>
                <div style={{ fontSize: "3rem" }}>{theme.icon}</div>
                <div style={{
                  background: getDifficultyColor(theme.difficulty),
                  color: "#fff",
                  padding: "6px 14px",
                  borderRadius: "20px",
                  fontSize: "0.75rem",
                  fontWeight: "600"
                }}>
                  {theme.difficulty}
                </div>
              </div>

              {/* Title */}
              <h3 style={{
                fontSize: "1.4rem",
                fontWeight: "700",
                color: colors.textPrimary,
                marginBottom: "12px"
              }}>
                {theme.title}
              </h3>

              {/* Description */}
              <p style={{
                color: colors.textPrimarySecondary,
                fontSize: "0.95rem",
                lineHeight: "1.6",
                marginBottom: "20px"
              }}>
                {theme.description}
              </p>

              {/* Stats */}
              <div style={{
                display: "flex",
                gap: "20px",
                marginBottom: "25px",
                paddingTop: "15px",
                borderTop: `1px solid ${colors.border}`
              }}>
                <div>
                  <div style={{ 
                    color: colors.textPrimarySecondary, 
                    fontSize: "0.8rem",
                    marginBottom: "4px"
                  }}>
                    Questions
                  </div>
                  <div style={{ 
                    color: colors.textPrimary, 
                    fontWeight: "600",
                    fontSize: "1.1rem"
                  }}>
                    {theme.questions}
                  </div>
                </div>
                <div>
                  <div style={{ 
                    color: colors.textPrimarySecondary, 
                    fontSize: "0.8rem",
                    marginBottom: "4px"
                  }}>
                    Durée max
                  </div>
                  <div style={{ 
                    color: colors.textPrimary, 
                    fontWeight: "600",
                    fontSize: "1.1rem"
                  }}>
                    {theme.duration}
                  </div>
                </div>
              </div>

              {/* Start Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleStartQuiz(theme.id);
                }}
                style={{
                  width: "100%",
                  padding: "14px",
                  background: selectedTheme === theme.id 
                    ? colors.accent 
                    : "transparent",
                  color: selectedTheme === theme.id 
                    ? "#fff" 
                    : colors.accent,
                  border: `2px solid ${colors.accent}`,
                  borderRadius: "10px",
                  fontSize: "1rem",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.3s ease"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = colors.accent;
                  e.currentTarget.style.color = "#fff";
                  e.currentTarget.style.transform = "scale(1.02)";
                }}
                onMouseLeave={(e) => {
                  if (selectedTheme !== theme.id) {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = colors.accent;
                  }
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                🚀 Démarrer le quiz
              </button>
            </div>
          ))}
        </div>

        {/* Info Box */}
        <div style={{
          marginTop: "60px",
          background: `${colors.accent}10`,
          border: `1px solid ${colors.accent}30`,
          borderRadius: "12px",
          padding: "25px",
          textAlign: "center"
        }}>
          <div style={{ fontSize: "1.5rem", marginBottom: "10px" }}>💡</div>
          <h3 style={{ 
            color: colors.textPrimary, 
            fontSize: "1.2rem", 
            fontWeight: "600",
            marginBottom: "10px"
          }}>
            Comment ça marche ?
          </h3>
          <p style={{ 
            color: colors.textPrimarySecondary, 
            lineHeight: "1.7",
            maxWidth: "800px",
            margin: "0 auto"
          }}>
            Chaque quiz contient <strong>20 questions</strong> (QCM et Vrai/Faux). 
            Vous disposez de <strong>30 secondes par question</strong> et 
            <strong>15 minutes au total</strong>. Votre score détermine le badge obtenu :
            Bronze (≥60%), Argent (≥80%), Or (≥95%). Les badges et XP sont automatiquement 
            ajoutés à votre progression !
          </p>
        </div>

      </div>
    </div>
  );
}

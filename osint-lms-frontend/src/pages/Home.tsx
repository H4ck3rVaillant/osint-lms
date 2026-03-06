import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Home() {
  const { user } = useAuth();

  if (user) {
    window.location.href = "/dashboard";
    return null;
  }

  const features = [
    { icon: "🎓", title: "6 Modules OSINT Spécialisés", desc: "Shodan, LinkedIn, Telegram, Discord, theHarvester, Maltego - Formation complète et professionnelle" },
    { icon: "📚", title: "3 Parcours Progressifs", desc: "Débutant, Intermédiaire, Avancé - Méthodologies et outils" },
    { icon: "💡", title: "20 Exercices Pratiques", desc: "Mise en pratique avec corrections détaillées" },
    { icon: "🛰️", title: "5 Études de Cas Réels", desc: "Investigations type Bellingcat" },
    { icon: "🏅", title: "26 Badges à Débloquer", desc: "Gamification complète de votre progression" },
    { icon: "🔧", title: "22+ Outils OSINT", desc: "Catalogue complet d'outils professionnels" },
    { icon: "🐉", title: "Laboratoire Kali", desc: "Terminal interactif avec 30+ commandes" },
    { icon: "🚩", title: "Mini-CTF & Challenges", desc: "11 défis + challenges hebdomadaires" },
  ];

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0b0f1a 0%, #1a1f2e 100%)",
      color: "#fff"
    }}>
      {/* Header */}
      <header style={{
        padding: "20px 40px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "2px solid #00ff9c"
      }}>
        <h1 style={{ color: "#00ff9c", fontSize: "1.8rem", margin: 0 }}>
          🔍 OSINT LMS Pro
        </h1>
        <div style={{ display: "flex", gap: "15px" }}>
          <Link to="/login" style={{
            padding: "10px 25px",
            background: "transparent",
            border: "2px solid #00ff9c",
            color: "#00ff9c",
            borderRadius: "8px",
            textDecoration: "none",
            fontWeight: "600",
            transition: "all 0.3s"
          }}>
            Connexion
          </Link>
          <Link to="/register" style={{
            padding: "10px 25px",
            background: "#00ff9c",
            border: "2px solid #00ff9c",
            color: "#020617",
            borderRadius: "8px",
            textDecoration: "none",
            fontWeight: "600",
            transition: "all 0.3s"
          }}>
            S'inscrire
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section style={{
        padding: "80px 40px",
        textAlign: "center",
        maxWidth: "1200px",
        margin: "0 auto"
      }}>
        <h2 style={{
          fontSize: "3.5rem",
          marginBottom: "25px",
          background: "linear-gradient(135deg, #00ff9c 0%, #00cc7a 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text"
        }}>
          Maîtrisez l'OSINT comme un Pro
        </h2>
        <p style={{
          fontSize: "1.3rem",
          color: "#9ca3af",
          marginBottom: "40px",
          maxWidth: "800px",
          margin: "0 auto 40px"
        }}>
          Plateforme complète de formation OSINT avec 6 modules spécialisés, 3 parcours progressifs, exercices pratiques et études de cas réels type Bellingcat.
        </p>
        <Link to="/register" style={{
          padding: "18px 40px",
          background: "#00ff9c",
          color: "#020617",
          borderRadius: "12px",
          textDecoration: "none",
          fontSize: "1.2rem",
          fontWeight: "700",
          display: "inline-block",
          boxShadow: "0 4px 20px rgba(0, 255, 156, 0.3)"
        }}>
          🚀 Commencer Gratuitement
        </Link>
      </section>

      {/* Features */}
      <section style={{
        padding: "60px 40px",
        maxWidth: "1400px",
        margin: "0 auto"
      }}>
        <h3 style={{
          fontSize: "2.5rem",
          textAlign: "center",
          marginBottom: "50px",
          color: "#00ff9c"
        }}>
          Tout ce dont vous avez besoin pour l'OSINT
        </h3>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "30px"
        }}>
          {features.map((feature, index) => (
            <div key={index} style={{
              background: "#0b0f1a",
              border: "2px solid #00ff9c",
              borderRadius: "12px",
              padding: "30px",
              transition: "all 0.3s"
            }}>
              <div style={{ fontSize: "3rem", marginBottom: "15px" }}>{feature.icon}</div>
              <h4 style={{
                fontSize: "1.3rem",
                color: "#00ff9c",
                marginBottom: "12px"
              }}>
                {feature.title}
              </h4>
              <p style={{
                color: "#9ca3af",
                lineHeight: "1.6",
                fontSize: "1rem"
              }}>
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Modules OSINT */}
      <section style={{
        padding: "60px 40px",
        background: "#0b0f1a",
        borderTop: "2px solid #00ff9c",
        borderBottom: "2px solid #00ff9c"
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <h3 style={{
            fontSize: "2.5rem",
            textAlign: "center",
            marginBottom: "20px",
            color: "#00ff9c"
          }}>
            🎓 6 Modules OSINT Spécialisés
          </h3>
          <p style={{
            textAlign: "center",
            color: "#9ca3af",
            fontSize: "1.1rem",
            marginBottom: "50px"
          }}>
            Formation détaillée sur les outils OSINT les plus puissants
          </p>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "25px"
          }}>
            {[
              { icon: "🔍", title: "Shodan OSINT", desc: "Moteur de recherche IoT et appareils connectés" },
              { icon: "💼", title: "LinkedIn OSINT", desc: "Investigations professionnelles et reconnaissance" },
              { icon: "✈️", title: "Telegram OSINT", desc: "Recherche de groupes, canaux et utilisateurs" },
              { icon: "🎮", title: "Discord OSINT", desc: "Investigation et reconnaissance de serveurs" },
              { icon: "🌾", title: "theHarvester", desc: "Collecte emails, sous-domaines et IPs" },
              { icon: "🕸️", title: "Maltego Basics", desc: "Visualisation graphique de relations OSINT" },
            ].map((module, index) => (
              <div key={index} style={{
                background: "#1a1f2e",
                border: "1px solid #00ff9c",
                borderRadius: "12px",
                padding: "25px",
                textAlign: "center"
              }}>
                <div style={{ fontSize: "3rem", marginBottom: "15px" }}>{module.icon}</div>
                <h4 style={{ color: "#00ff9c", fontSize: "1.2rem", marginBottom: "10px" }}>
                  {module.title}
                </h4>
                <p style={{ color: "#9ca3af", fontSize: "0.95rem" }}>
                  {module.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{
        padding: "80px 40px",
        textAlign: "center"
      }}>
        <h3 style={{
          fontSize: "2.5rem",
          marginBottom: "25px",
          color: "#00ff9c"
        }}>
          Prêt à devenir un expert OSINT ?
        </h3>
        <p style={{
          fontSize: "1.2rem",
          color: "#9ca3af",
          marginBottom: "40px"
        }}>
          Rejoignez des centaines d'apprenants et maîtrisez l'investigation numérique
        </p>
        <Link to="/register" style={{
          padding: "18px 40px",
          background: "#00ff9c",
          color: "#020617",
          borderRadius: "12px",
          textDecoration: "none",
          fontSize: "1.2rem",
          fontWeight: "700",
          display: "inline-block"
        }}>
          Commencer Maintenant →
        </Link>
      </section>

      {/* Footer */}
      <footer style={{
        padding: "30px 40px",
        textAlign: "center",
        borderTop: "2px solid #00ff9c",
        color: "#9ca3af"
      }}>
        <p>© 2026 OSINT LMS Pro - Tous droits réservés</p>
      </footer>
    </div>
  );
}

import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function ParcoursHub() {
  const [stats, setStats] = useState({
    debutant: 0,
    intermediaire: 0,
    avance: 0,
  });

  useEffect(() => {
    // Parcours Débutant
    const debIntro = localStorage.getItem("badge_deb_intro") === "true";
    const debMethodo = localStorage.getItem("badge_deb_methodo") === "true";
    const debOutils = localStorage.getItem("badge_deb_outils") === "true";
    const debutantCount = [debIntro, debMethodo, debOutils].filter(Boolean).length;

    // Parcours Intermédiaire
    const intIntro = localStorage.getItem("badge_int_intro") === "true";
    const intMethodo = localStorage.getItem("badge_int_methodo") === "true";
    const intOutils = localStorage.getItem("badge_int_outils") === "true";
    const intermediaireCount = [intIntro, intMethodo, intOutils].filter(Boolean).length;

    // Parcours Avancé
    const advIntro = localStorage.getItem("badge_adv_intro") === "true";
    const advMethodo = localStorage.getItem("badge_adv_methodo") === "true";
    const advOutils = localStorage.getItem("badge_adv_outils") === "true";
    const avanceCount = [advIntro, advMethodo, advOutils].filter(Boolean).length;

    setStats({
      debutant: (debutantCount / 3) * 100,
      intermediaire: (intermediaireCount / 3) * 100,
      avance: (avanceCount / 3) * 100,
    });
  }, []);

  const cardStyle = {
    background: "#0b0f1a",
    border: "2px solid #00ff9c",
    borderRadius: "12px",
    padding: "30px",
    textDecoration: "none",
    transition: "all 0.3s ease",
    cursor: "pointer",
    display: "block",
    boxShadow: "0 4px 15px rgba(0,255,156,0.1)",
  };

  return (
    <main style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0b0f1a 0%, #1a1f2e 100%)",
      padding: "40px 20px"
    }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        
        {/* En-tête */}
        <div style={{ marginBottom: "50px", textAlign: "center" }}>
          <h1 style={{ color: "#00ff9c", fontSize: "3rem", margin: "0 0 15px 0" }}>
            📚 Parcours de Formation OSINT
          </h1>
          <p style={{ color: "#9ca3af", fontSize: "1.2rem", lineHeight: "1.8" }}>
            Choisissez votre parcours en fonction de votre niveau.<br />
            Du débutant absolu à l'expert en investigations complexes.
          </p>
        </div>

        {/* Les 3 parcours */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
          gap: "30px",
          marginBottom: "40px"
        }}>

          {/* DÉBUTANT */}
          <Link to="/parcours-debutant" style={cardStyle}>
            <div style={{ marginBottom: "20px", textAlign: "center" }}>
              <div style={{ fontSize: "4rem", marginBottom: "15px" }}>🟢</div>
              <h2 style={{ color: "#00ff9c", margin: "0 0 10px 0", fontSize: "1.8rem" }}>
                Parcours Débutant
              </h2>
              <p style={{ color: "#9ca3af", fontSize: "0.95rem", margin: 0 }}>
                Niveau 1 • 3 modules
              </p>
            </div>

            <div style={{
              background: "#1a1f2e",
              borderRadius: "8px",
              padding: "20px",
              marginBottom: "20px"
            }}>
              <h3 style={{ color: "#e5e7eb", fontSize: "1rem", marginBottom: "12px" }}>
                📖 Ce que vous allez apprendre :
              </h3>
              <ul style={{
                color: "#9ca3af",
                fontSize: "0.9rem",
                lineHeight: "1.8",
                paddingLeft: "20px",
                margin: 0
              }}>
                <li>Introduction à l'OSINT et ses principes</li>
                <li>Méthodologie de recherche de base</li>
                <li>Premiers outils essentiels (Google Dorking, Whois, etc.)</li>
                <li>Collecte d'informations publiques</li>
              </ul>
            </div>

            {/* Barre de progression */}
            <div style={{
              width: "100%",
              height: "10px",
              background: "#1a1f2e",
              borderRadius: "5px",
              overflow: "hidden",
              marginBottom: "15px"
            }}>
              <div style={{
                width: `${stats.debutant}%`,
                height: "100%",
                background: "#00ff9c",
                transition: "width 0.3s ease"
              }} />
            </div>

            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <span style={{ color: "#9ca3af", fontSize: "0.9rem" }}>
                Progression
              </span>
              <span style={{ color: "#00ff9c", fontWeight: "bold", fontSize: "1.1rem" }}>
                {Math.round(stats.debutant)}%
              </span>
            </div>

            <div style={{
              marginTop: "20px",
              padding: "12px",
              background: "#00ff9c",
              color: "#0b0f1a",
              textAlign: "center",
              borderRadius: "8px",
              fontWeight: "bold",
              fontSize: "1rem"
            }}>
              {stats.debutant === 100 ? "✓ Parcours complété" : "→ Commencer"}
            </div>
          </Link>

          {/* INTERMÉDIAIRE */}
          <Link to="/parcours-intermediaire" style={cardStyle}>
            <div style={{ marginBottom: "20px", textAlign: "center" }}>
              <div style={{ fontSize: "4rem", marginBottom: "15px" }}>🟡</div>
              <h2 style={{ color: "#fbbf24", margin: "0 0 10px 0", fontSize: "1.8rem" }}>
                Parcours Intermédiaire
              </h2>
              <p style={{ color: "#9ca3af", fontSize: "0.95rem", margin: 0 }}>
                Niveau 2 • 3 modules
              </p>
            </div>

            <div style={{
              background: "#1a1f2e",
              borderRadius: "8px",
              padding: "20px",
              marginBottom: "20px"
            }}>
              <h3 style={{ color: "#e5e7eb", fontSize: "1rem", marginBottom: "12px" }}>
                📖 Ce que vous allez apprendre :
              </h3>
              <ul style={{
                color: "#9ca3af",
                fontSize: "0.9rem",
                lineHeight: "1.8",
                paddingLeft: "20px",
                margin: 0
              }}>
                <li>Techniques avancées de recherche</li>
                <li>Analyse des réseaux sociaux</li>
                <li>Investigation Dark Web et Tor</li>
                <li>OSINT sur mobile et métadonnées</li>
              </ul>
            </div>

            <div style={{
              width: "100%",
              height: "10px",
              background: "#1a1f2e",
              borderRadius: "5px",
              overflow: "hidden",
              marginBottom: "15px"
            }}>
              <div style={{
                width: `${stats.intermediaire}%`,
                height: "100%",
                background: "#fbbf24",
                transition: "width 0.3s ease"
              }} />
            </div>

            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <span style={{ color: "#9ca3af", fontSize: "0.9rem" }}>
                Progression
              </span>
              <span style={{ color: "#fbbf24", fontWeight: "bold", fontSize: "1.1rem" }}>
                {Math.round(stats.intermediaire)}%
              </span>
            </div>

            <div style={{
              marginTop: "20px",
              padding: "12px",
              background: "#fbbf24",
              color: "#0b0f1a",
              textAlign: "center",
              borderRadius: "8px",
              fontWeight: "bold",
              fontSize: "1rem"
            }}>
              {stats.intermediaire === 100 ? "✓ Parcours complété" : "→ Commencer"}
            </div>
          </Link>

          {/* AVANCÉ */}
          <Link to="/parcours-avance" style={cardStyle}>
            <div style={{ marginBottom: "20px", textAlign: "center" }}>
              <div style={{ fontSize: "4rem", marginBottom: "15px" }}>🔴</div>
              <h2 style={{ color: "#ef4444", margin: "0 0 10px 0", fontSize: "1.8rem" }}>
                Parcours Avancé
              </h2>
              <p style={{ color: "#9ca3af", fontSize: "0.95rem", margin: 0 }}>
                Niveau 3 • 3 modules
              </p>
            </div>

            <div style={{
              background: "#1a1f2e",
              borderRadius: "8px",
              padding: "20px",
              marginBottom: "20px"
            }}>
              <h3 style={{ color: "#e5e7eb", fontSize: "1rem", marginBottom: "12px" }}>
                📖 Ce que vous allez apprendre :
              </h3>
              <ul style={{
                color: "#9ca3af",
                fontSize: "0.9rem",
                lineHeight: "1.8",
                paddingLeft: "20px",
                margin: 0
              }}>
                <li>OPSEC et protection de l'identité</li>
                <li>Investigations complexes multi-sources</li>
                <li>Automation et scripting OSINT</li>
                <li>Rapports professionnels et juridiques</li>
              </ul>
            </div>

            <div style={{
              width: "100%",
              height: "10px",
              background: "#1a1f2e",
              borderRadius: "5px",
              overflow: "hidden",
              marginBottom: "15px"
            }}>
              <div style={{
                width: `${stats.avance}%`,
                height: "100%",
                background: "#ef4444",
                transition: "width 0.3s ease"
              }} />
            </div>

            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <span style={{ color: "#9ca3af", fontSize: "0.9rem" }}>
                Progression
              </span>
              <span style={{ color: "#ef4444", fontWeight: "bold", fontSize: "1.1rem" }}>
                {Math.round(stats.avance)}%
              </span>
            </div>

            <div style={{
              marginTop: "20px",
              padding: "12px",
              background: "#ef4444",
              color: "#fff",
              textAlign: "center",
              borderRadius: "8px",
              fontWeight: "bold",
              fontSize: "1rem"
            }}>
              {stats.avance === 100 ? "✓ Parcours complété" : "→ Commencer"}
            </div>
          </Link>

        </div>

        {/* Info complémentaire */}
        <div style={{
          background: "#0b0f1a",
          border: "1px solid #2a3f3f",
          borderRadius: "12px",
          padding: "30px",
          textAlign: "center"
        }}>
          <h3 style={{ color: "#00ff9c", fontSize: "1.3rem", marginBottom: "15px" }}>
            💡 Recommandations
          </h3>
          <p style={{ color: "#9ca3af", fontSize: "1rem", lineHeight: "1.8", margin: 0 }}>
            Il est recommandé de suivre les parcours dans l'ordre.<br />
            Chaque niveau construit sur les connaissances du précédent.<br />
            Comptez environ <strong style={{ color: "#00ff9c" }}>2-3 heures par module</strong>.
          </p>
        </div>

      </div>
    </main>
  );
}

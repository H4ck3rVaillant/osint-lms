import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function ParcoursOSINT() {
  const [stats, setStats] = useState({
    debutant: 0,
    intermediaire: 0,
    avance: 0,
    total: 0,
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

    const totalModules = 9; // 3 parcours × 3 modules
    const totalCompleted = debutantCount + intermediaireCount + avanceCount;

    setStats({
      debutant: (debutantCount / 3) * 100,
      intermediaire: (intermediaireCount / 3) * 100,
      avance: (avanceCount / 3) * 100,
      total: (totalCompleted / totalModules) * 100,
    });
  }, []);

  const cardStyle = {
    background: "#0b0f1a",
    border: "1px solid #00ff9c",
    borderRadius: "8px",
    padding: "24px",
    textDecoration: "none",
    transition: "all 0.3s ease",
    cursor: "pointer",
    display: "block",
  };

  return (
    <main style={{ padding: "40px", maxWidth: "1200px", margin: "0 auto" }}>
      <h1 style={{ color: "#00ff9c", fontSize: "2rem", marginBottom: "10px" }}>
        📚 Parcours de Formation OSINT
      </h1>
      <p style={{ color: "#9ca3af", marginBottom: "30px", fontSize: "1.1rem" }}>
        Développez vos compétences OSINT à travers trois parcours progressifs : du niveau débutant à l'expertise professionnelle
      </p>

      {/* Progression globale */}
      <div style={{ 
        background: "#0b0f1a", 
        border: "2px solid #00ff9c", 
        borderRadius: "12px", 
        padding: "30px",
        marginBottom: "40px"
      }}>
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          marginBottom: "15px"
        }}>
          <h2 style={{ color: "#00ff9c", margin: 0, fontSize: "1.5rem" }}>
            🎯 Progression Globale des Parcours
          </h2>
          <span style={{ 
            color: "#00ff9c", 
            fontWeight: "bold",
            fontSize: "1.3rem"
          }}>
            {Math.round(stats.total)}%
          </span>
        </div>
        
        <div style={{
          width: "100%",
          height: "30px",
          background: "#1a1f2e",
          borderRadius: "15px",
          overflow: "hidden",
          border: "1px solid #2a3f3f"
        }}>
          <div style={{
            width: `${stats.total}%`,
            height: "100%",
            background: "linear-gradient(90deg, #00ff9c 0%, #00d484 100%)",
            transition: "width 0.5s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#0b0f1a",
            fontWeight: "bold",
            fontSize: "0.9rem"
          }}>
            {stats.total > 5 && `${Math.round(stats.total)}%`}
          </div>
        </div>

        <p style={{ color: "#9ca3af", marginTop: "15px", fontSize: "0.95rem" }}>
          Complétez les 9 modules pour maîtriser toutes les facettes de l'OSINT !
        </p>
      </div>

      {/* Parcours de formation */}
      <section style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", 
        gap: "24px",
        marginBottom: "40px"
      }}>
        {/* Parcours Débutant */}
        <Link to="/parcours/debutant" style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "12px" }}>
            <h3 style={{ color: "#00ff9c", margin: 0, fontSize: "1.3rem" }}>
              🎓 Parcours Débutant
            </h3>
            <span style={{ 
              color: "#00ff9c", 
              fontSize: "1.1rem",
              fontWeight: "bold"
            }}>
              {Math.round(stats.debutant)}%
            </span>
          </div>
          <p style={{ color: "#9ca3af", marginBottom: "15px", lineHeight: "1.6" }}>
            Découvrez les fondamentaux de l'OSINT : définitions, méthodologie de base et premiers outils essentiels.
          </p>
          
          <div style={{
            background: "#1a1f2e",
            border: "1px solid #2a3f3f",
            borderRadius: "6px",
            padding: "12px",
            marginBottom: "15px"
          }}>
            <p style={{ color: "#9ca3af", fontSize: "0.9rem", margin: "0 0 8px 0", fontWeight: "500" }}>
              3 modules au programme :
            </p>
            <ul style={{ color: "#9ca3af", fontSize: "0.85rem", lineHeight: "1.6", paddingLeft: "20px", margin: 0 }}>
              <li>Introduction à l'OSINT</li>
              <li>Méthodologie en 6 étapes</li>
              <li>Outils de base (Google Dorks, Shodan, Sherlock)</li>
            </ul>
          </div>

          {/* Mini barre de progression */}
          <div style={{
            width: "100%",
            height: "8px",
            background: "#1a1f2e",
            borderRadius: "4px",
            overflow: "hidden",
            marginBottom: "10px"
          }}>
            <div style={{
              width: `${stats.debutant}%`,
              height: "100%",
              background: "#00ff9c",
              transition: "width 0.3s ease"
            }} />
          </div>
          
          <p style={{ 
            color: stats.debutant === 100 ? "#00ff9c" : "#6b7280",
            fontSize: "0.9rem",
            fontWeight: "bold"
          }}>
            {stats.debutant === 100 ? "✓ Parcours complété" : "→ Commencer le parcours"}
          </p>
        </Link>

        {/* Parcours Intermédiaire */}
        <Link to="/parcours/intermediaire" style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "12px" }}>
            <h3 style={{ color: "#00ff9c", margin: 0, fontSize: "1.3rem" }}>
              🧠 Parcours Intermédiaire
            </h3>
            <span style={{ 
              color: "#00ff9c", 
              fontSize: "1.1rem",
              fontWeight: "bold"
            }}>
              {Math.round(stats.intermediaire)}%
            </span>
          </div>
          <p style={{ color: "#9ca3af", marginBottom: "15px", lineHeight: "1.6" }}>
            Approfondissez vos compétences : analyse critique, validation croisée et outils professionnels.
          </p>
          
          <div style={{
            background: "#1a1f2e",
            border: "1px solid #2a3f3f",
            borderRadius: "6px",
            padding: "12px",
            marginBottom: "15px"
          }}>
            <p style={{ color: "#9ca3af", fontSize: "0.9rem", margin: "0 0 8px 0", fontWeight: "500" }}>
              3 modules au programme :
            </p>
            <ul style={{ color: "#9ca3af", fontSize: "0.85rem", lineHeight: "1.6", paddingLeft: "20px", margin: 0 }}>
              <li>Analyse critique et biais cognitifs</li>
              <li>Cycle de renseignement et pivoting</li>
              <li>Maltego, SpiderFoot et archivage</li>
            </ul>
          </div>

          <div style={{
            width: "100%",
            height: "8px",
            background: "#1a1f2e",
            borderRadius: "4px",
            overflow: "hidden",
            marginBottom: "10px"
          }}>
            <div style={{
              width: `${stats.intermediaire}%`,
              height: "100%",
              background: "#00ff9c",
              transition: "width 0.3s ease"
            }} />
          </div>
          
          <p style={{ 
            color: stats.intermediaire === 100 ? "#00ff9c" : "#6b7280",
            fontSize: "0.9rem",
            fontWeight: "bold"
          }}>
            {stats.intermediaire === 100 ? "✓ Parcours complété" : "→ Commencer le parcours"}
          </p>
        </Link>

        {/* Parcours Avancé */}
        <Link to="/parcours/avance" style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "12px" }}>
            <h3 style={{ color: "#00ff9c", margin: 0, fontSize: "1.3rem" }}>
              🚀 Parcours Avancé
            </h3>
            <span style={{ 
              color: "#00ff9c", 
              fontSize: "1.1rem",
              fontWeight: "bold"
            }}>
              {Math.round(stats.avance)}%
            </span>
          </div>
          <p style={{ color: "#9ca3af", marginBottom: "15px", lineHeight: "1.6" }}>
            Niveau expert : renseignement stratégique, threat intelligence et investigations professionnelles.
          </p>
          
          <div style={{
            background: "#1a1f2e",
            border: "1px solid #2a3f3f",
            borderRadius: "6px",
            padding: "12px",
            marginBottom: "15px"
          }}>
            <p style={{ color: "#9ca3af", fontSize: "0.9rem", margin: "0 0 8px 0", fontWeight: "500" }}>
              3 modules au programme :
            </p>
            <ul style={{ color: "#9ca3af", fontSize: "0.85rem", lineHeight: "1.6", paddingLeft: "20px", margin: 0 }}>
              <li>Renseignement stratégique et géopolitique</li>
              <li>Méthodologie professionnelle (ACH, PMESII)</li>
              <li>APIs, Python, Neo4j et ML</li>
            </ul>
          </div>

          <div style={{
            width: "100%",
            height: "8px",
            background: "#1a1f2e",
            borderRadius: "4px",
            overflow: "hidden",
            marginBottom: "10px"
          }}>
            <div style={{
              width: `${stats.avance}%`,
              height: "100%",
              background: "#00ff9c",
              transition: "width 0.3s ease"
            }} />
          </div>
          
          <p style={{ 
            color: stats.avance === 100 ? "#00ff9c" : "#6b7280",
            fontSize: "0.9rem",
            fontWeight: "bold"
          }}>
            {stats.avance === 100 ? "✓ Parcours complété" : "→ Commencer le parcours"}
          </p>
        </Link>
      </section>

      {/* Section informative */}
      <div style={{
        background: "#1a1f2e",
        border: "1px solid #2a3f3f",
        borderRadius: "8px",
        padding: "24px",
        marginBottom: "30px"
      }}>
        <h3 style={{ color: "#00ff9c", marginBottom: "15px", fontSize: "1.2rem" }}>
          💡 Pourquoi suivre ces parcours ?
        </h3>
        <ul style={{ color: "#9ca3af", lineHeight: "2", paddingLeft: "20px", margin: 0 }}>
          <li>
            <strong>Progression structurée</strong> : Passez du niveau débutant à l'expertise en suivant un chemin pédagogique éprouvé
          </li>
          <li>
            <strong>Méthodologie professionnelle</strong> : Apprenez les techniques utilisées par Bellingcat, les CERT et les analystes en renseignement
          </li>
          <li>
            <strong>Badges et reconnaissance</strong> : Chaque module complété débloque un badge valorisant vos compétences
          </li>
          <li>
            <strong>Pratique immédiate</strong> : Appliquez vos connaissances dans les études de cas réels après chaque parcours
          </li>
        </ul>
      </div>

      {/* Statistiques par parcours */}
      <div style={{
        background: "#1a1f2e",
        border: "1px solid #2a3f3f",
        borderRadius: "8px",
        padding: "24px"
      }}>
        <h3 style={{ color: "#00ff9c", marginBottom: "20px", fontSize: "1.2rem" }}>
          📊 Votre progression détaillée
        </h3>
        
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
          gap: "20px" 
        }}>
          <div>
            <p style={{ color: "#9ca3af", fontSize: "0.9rem", marginBottom: "5px" }}>
              🎓 Parcours Débutant
            </p>
            <p style={{ color: "#00ff9c", fontSize: "1.5rem", fontWeight: "bold" }}>
              {Math.round(stats.debutant)}%
            </p>
          </div>
          
          <div>
            <p style={{ color: "#9ca3af", fontSize: "0.9rem", marginBottom: "5px" }}>
              🧠 Parcours Intermédiaire
            </p>
            <p style={{ color: "#00ff9c", fontSize: "1.5rem", fontWeight: "bold" }}>
              {Math.round(stats.intermediaire)}%
            </p>
          </div>
          
          <div>
            <p style={{ color: "#9ca3af", fontSize: "0.9rem", marginBottom: "5px" }}>
              🚀 Parcours Avancé
            </p>
            <p style={{ color: "#00ff9c", fontSize: "1.5rem", fontWeight: "bold" }}>
              {Math.round(stats.avance)}%
            </p>
          </div>
          
          <div>
            <p style={{ color: "#9ca3af", fontSize: "0.9rem", marginBottom: "5px" }}>
              🎯 Progression Globale
            </p>
            <p style={{ color: "#00ff9c", fontSize: "1.5rem", fontWeight: "bold" }}>
              {Math.round(stats.total)}%
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

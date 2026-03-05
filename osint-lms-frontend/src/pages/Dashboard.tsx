import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [stats, setStats] = useState({
    debutant: 0,
    intermediaire: 0,
    avance: 0,
    etudesCas: 0,
    exercices: 0,
    badges: 0,
    total: 0,
  });

  useEffect(() => {
    const debIntro = localStorage.getItem("badge_deb_intro") === "true";
    const debMethodo = localStorage.getItem("badge_deb_methodo") === "true";
    const debOutils = localStorage.getItem("badge_deb_outils") === "true";
    const debutantCount = [debIntro, debMethodo, debOutils].filter(Boolean).length;

    const intIntro = localStorage.getItem("badge_int_intro") === "true";
    const intMethodo = localStorage.getItem("badge_int_methodo") === "true";
    const intOutils = localStorage.getItem("badge_int_outils") === "true";
    const intermediaireCount = [intIntro, intMethodo, intOutils].filter(Boolean).length;

    const advIntro = localStorage.getItem("badge_adv_intro") === "true";
    const advMethodo = localStorage.getItem("badge_adv_methodo") === "true";
    const advOutils = localStorage.getItem("badge_adv_outils") === "true";
    const avanceCount = [advIntro, advMethodo, advOutils].filter(Boolean).length;

    const caseGeo = localStorage.getItem("badge_case_geo") === "true";
    const caseMedia = localStorage.getItem("badge_case_media") === "true";
    const caseAttr = localStorage.getItem("badge_case_attr") === "true";
    const caseChrono = localStorage.getItem("badge_case_chrono") === "true";
    const caseFinal = localStorage.getItem("badge_cases_osint") === "true";
    const etudesCasCount = [caseGeo, caseMedia, caseAttr, caseChrono, caseFinal].filter(Boolean).length;

    const exercicesCompleted = parseInt(localStorage.getItem("exercices_completed") || "0");
    const totalExercices = 20;

    const totalBadges = 26; // 20 + 6 modules
    const badgesEarned = debutantCount + intermediaireCount + avanceCount + etudesCasCount;

    const totalModules = 13 + 5 + 6; // 13 modules parcours + 5 études + 6 modules spécialisés
    const totalCompleted = badgesEarned;

    setStats({
      debutant: (debutantCount / 3) * 100,
      intermediaire: (intermediaireCount / 3) * 100,
      avance: (avanceCount / 3) * 100,
      etudesCas: (etudesCasCount / 5) * 100,
      exercices: (exercicesCompleted / totalExercices) * 100,
      badges: (badgesEarned / totalBadges) * 100,
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
    <main style={{ padding: "40px 20px", maxWidth: "1400px", margin: "0 auto" }}>
      <h1 style={{ color: "#00ff9c", fontSize: "2rem", marginBottom: "10px" }}>
        Dashboard OSINT
      </h1>
      <p style={{ color: "#9ca3af", marginBottom: "30px", fontSize: "1.1rem" }}>
        Suivez votre progression et accédez à vos parcours de formation OSINT
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
            🎯 Progression Globale
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
          height: "20px",
          background: "#1a1f2e",
          borderRadius: "10px",
          overflow: "hidden"
        }}>
          <div style={{
            width: `${stats.total}%`,
            height: "100%",
            background: "linear-gradient(90deg, #00ff9c 0%, #00cc7a 100%)",
            transition: "width 0.5s ease"
          }} />
        </div>
      </div>

      {/* Parcours */}
      <section style={{ marginBottom: "40px" }}>
        <h2 style={{ color: "#00ff9c", fontSize: "1.4rem", marginBottom: "20px" }}>
          📚 Parcours de Formation
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "20px" }}>
          
          <Link to="/parcours-debutant" style={cardStyle}>
            <h3 style={{ color: "#00ff9c", margin: 0, fontSize: "1.3rem", marginBottom: "12px" }}>
              🟢 Parcours Débutant
            </h3>
            <p style={{ color: "#9ca3af", marginBottom: "15px", lineHeight: "1.6" }}>
              Introduction à l'OSINT, méthodologie de base et premiers outils.
            </p>
            <div style={{
              width: "100%",
              height: "6px",
              background: "#1a1f2e",
              borderRadius: "3px",
              overflow: "hidden",
            }}>
              <div style={{
                width: `${stats.debutant}%`,
                height: "100%",
                background: "#00ff9c",
                transition: "width 0.5s ease"
              }} />
            </div>
          </Link>

          <Link to="/parcours-intermediaire" style={cardStyle}>
            <h3 style={{ color: "#00ff9c", margin: 0, fontSize: "1.3rem", marginBottom: "12px" }}>
              🟡 Parcours Intermédiaire
            </h3>
            <p style={{ color: "#9ca3af", marginBottom: "15px", lineHeight: "1.6" }}>
              Techniques avancées de recherche et analyse d'informations.
            </p>
            <div style={{
              width: "100%",
              height: "6px",
              background: "#1a1f2e",
              borderRadius: "3px",
              overflow: "hidden",
            }}>
              <div style={{
                width: `${stats.intermediaire}%`,
                height: "100%",
                background: "#fbbf24",
                transition: "width 0.5s ease"
              }} />
            </div>
          </Link>

          <Link to="/parcours-avance" style={cardStyle}>
            <h3 style={{ color: "#00ff9c", margin: 0, fontSize: "1.3rem", marginBottom: "12px" }}>
              🔴 Parcours Avancé
            </h3>
            <p style={{ color: "#9ca3af", marginBottom: "15px", lineHeight: "1.6" }}>
              Investigations complexes et exploitation d'outils professionnels.
            </p>
            <div style={{
              width: "100%",
              height: "6px",
              background: "#1a1f2e",
              borderRadius: "3px",
              overflow: "hidden",
            }}>
              <div style={{
                width: `${stats.avance}%`,
                height: "100%",
                background: "#ef4444",
                transition: "width 0.5s ease"
              }} />
            </div>
          </Link>
        </div>
      </section>

      {/* MODULES OSINT SPÉCIALISÉS - 6 MODULES */}
      <section style={{ marginBottom: "40px" }}>
        <h2 style={{ color: "#00ff9c", fontSize: "1.4rem", marginBottom: "20px" }}>
          🎓 Modules OSINT Spécialisés
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
          
          <Link to="/modules/shodan" style={cardStyle}>
            <h3 style={{ color: "#00ff9c", margin: 0, fontSize: "1.2rem", marginBottom: "10px" }}>
              🔍 Shodan OSINT
            </h3>
            <p style={{ color: "#9ca3af", fontSize: "0.95rem", lineHeight: "1.6" }}>
              Moteur de recherche IoT et appareils connectés
            </p>
          </Link>

          <Link to="/modules/linkedin" style={cardStyle}>
            <h3 style={{ color: "#00ff9c", margin: 0, fontSize: "1.2rem", marginBottom: "10px" }}>
              💼 LinkedIn OSINT
            </h3>
            <p style={{ color: "#9ca3af", fontSize: "0.95rem", lineHeight: "1.6" }}>
              Investigations professionnelles et reconnaissance
            </p>
          </Link>

          <Link to="/modules/telegram" style={cardStyle}>
            <h3 style={{ color: "#00ff9c", margin: 0, fontSize: "1.2rem", marginBottom: "10px" }}>
              ✈️ Telegram OSINT
            </h3>
            <p style={{ color: "#9ca3af", fontSize: "0.95rem", lineHeight: "1.6" }}>
              Recherche de groupes, canaux et utilisateurs
            </p>
          </Link>

          <Link to="/modules/discord" style={cardStyle}>
            <h3 style={{ color: "#00ff9c", margin: 0, fontSize: "1.2rem", marginBottom: "10px" }}>
              🎮 Discord OSINT
            </h3>
            <p style={{ color: "#9ca3af", fontSize: "0.95rem", lineHeight: "1.6" }}>
              Investigation et reconnaissance de serveurs
            </p>
          </Link>

          <Link to="/modules/theharvester" style={cardStyle}>
            <h3 style={{ color: "#00ff9c", margin: 0, fontSize: "1.2rem", marginBottom: "10px" }}>
              🌾 theHarvester
            </h3>
            <p style={{ color: "#9ca3af", fontSize: "0.95rem", lineHeight: "1.6" }}>
              Collecte emails, sous-domaines et IPs
            </p>
          </Link>

          <Link to="/modules/maltego" style={cardStyle}>
            <h3 style={{ color: "#00ff9c", margin: 0, fontSize: "1.2rem", marginBottom: "10px" }}>
              🕸️ Maltego Basics
            </h3>
            <p style={{ color: "#9ca3af", fontSize: "0.95rem", lineHeight: "1.6" }}>
              Visualisation graphique de relations OSINT
            </p>
          </Link>
        </div>
      </section>

      {/* Pratique */}
      <section style={{ marginBottom: "40px" }}>
        <h2 style={{ color: "#00ff9c", fontSize: "1.4rem", marginBottom: "20px" }}>
          💡 Pratique & Cas Réels
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "20px" }}>
          
          <Link to="/exercices-osint" style={cardStyle}>
            <h3 style={{ color: "#00ff9c", margin: 0, fontSize: "1.3rem", marginBottom: "12px" }}>
              📝 Exercices OSINT
            </h3>
            <p style={{ color: "#9ca3af", marginBottom: "15px", lineHeight: "1.6" }}>
              20 exercices pratiques guidés avec corrections détaillées.
            </p>
            <div style={{
              width: "100%",
              height: "6px",
              background: "#1a1f2e",
              borderRadius: "3px",
              overflow: "hidden",
            }}>
              <div style={{
                width: `${stats.exercices}%`,
                height: "100%",
                background: "#3b82f6",
                transition: "width 0.5s ease"
              }} />
            </div>
          </Link>

          <Link to="/etudes-osint" style={cardStyle}>
            <h3 style={{ color: "#00ff9c", margin: 0, fontSize: "1.3rem", marginBottom: "12px" }}>
              🛰️ Études de Cas Réels
            </h3>
            <p style={{ color: "#9ca3af", marginBottom: "15px", lineHeight: "1.6" }}>
              5 investigations complexes type Bellingcat.
            </p>
            <div style={{
              width: "100%",
              height: "6px",
              background: "#1a1f2e",
              borderRadius: "3px",
              overflow: "hidden",
            }}>
              <div style={{
                width: `${stats.etudesCas}%`,
                height: "100%",
                background: "#8b5cf6",
                transition: "width 0.5s ease"
              }} />
            </div>
          </Link>

          <Link to="/labo-osint" style={cardStyle}>
            <h3 style={{ color: "#00ff9c", margin: 0, fontSize: "1.3rem", marginBottom: "12px" }}>
              🧪 Laboratoire OSINT
            </h3>
            <p style={{ color: "#9ca3af", lineHeight: "1.6" }}>
              Terminal interactif avec commandes DNS, WHOIS, nmap.
            </p>
          </Link>
        </div>
      </section>

      {/* Outils */}
      <section style={{ marginBottom: "40px" }}>
        <h2 style={{ color: "#00ff9c", fontSize: "1.4rem", marginBottom: "20px" }}>
          🔧 Outils & Ressources
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
          
          <Link to="/vm-kali" style={cardStyle}>
            <h3 style={{ color: "#00ff9c", margin: 0, fontSize: "1.2rem", marginBottom: "10px" }}>
              🐉 Kali Linux Lab
            </h3>
            <p style={{ color: "#9ca3af", fontSize: "0.95rem" }}>
              Terminal Kali avec 30+ commandes
            </p>
          </Link>

          <Link to="/hacker-ai" style={cardStyle}>
            <h3 style={{ color: "#00ff9c", margin: 0, fontSize: "1.2rem", marginBottom: "10px" }}>
              🤖 HackerAI
            </h3>
            <p style={{ color: "#9ca3af", fontSize: "0.95rem" }}>
              Assistant IA cybersécurité
            </p>
          </Link>

          <Link to="/outils/argus" style={cardStyle}>
            <h3 style={{ color: "#00ff9c", margin: 0, fontSize: "1.2rem", marginBottom: "10px" }}>
              🔍 Argus V2.0
            </h3>
            <p style={{ color: "#9ca3af", fontSize: "0.95rem" }}>
              OSINT Automation & Threat Intel
            </p>
          </Link>

          <Link to="/outils-cyber" style={cardStyle}>
            <h3 style={{ color: "#00ff9c", margin: 0, fontSize: "1.2rem", marginBottom: "10px" }}>
              🛠️ Catalogue 22+ Outils
            </h3>
            <p style={{ color: "#9ca3af", fontSize: "0.95rem" }}>
              Référentiel complet d'outils OSINT
            </p>
          </Link>
        </div>
      </section>

      {/* Gamification */}
      <section>
        <h2 style={{ color: "#00ff9c", fontSize: "1.4rem", marginBottom: "20px" }}>
          🏆 Gamification & Défis
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
          
          <Link to="/badges-osint" style={cardStyle}>
            <h3 style={{ color: "#00ff9c", margin: 0, fontSize: "1.2rem", marginBottom: "10px" }}>
              🏅 Badges
            </h3>
            <p style={{ color: "#9ca3af", fontSize: "0.95rem" }}>
              {Math.round((stats.badges / 100) * 26)}/26 badges débloqués
            </p>
          </Link>

          <Link to="/challenges" style={cardStyle}>
            <h3 style={{ color: "#00ff9c", margin: 0, fontSize: "1.2rem", marginBottom: "10px" }}>
              🔥 Challenges Hebdo
            </h3>
            <p style={{ color: "#9ca3af", fontSize: "0.95rem" }}>
              52 défis OSINT progressifs
            </p>
          </Link>

          <Link to="/ctf" style={cardStyle}>
            <h3 style={{ color: "#00ff9c", margin: 0, fontSize: "1.2rem", marginBottom: "10px" }}>
              🚩 Mini-CTF
            </h3>
            <p style={{ color: "#9ca3af", fontSize: "0.95rem" }}>
              11 défis OSINT, Crypto et Web
            </p>
          </Link>

          <Link to="/leaderboard" style={cardStyle}>
            <h3 style={{ color: "#00ff9c", margin: 0, fontSize: "1.2rem", marginBottom: "10px" }}>
              📊 Leaderboard
            </h3>
            <p style={{ color: "#9ca3af", fontSize: "0.95rem" }}>
              Classement mondial en temps réel
            </p>
          </Link>
        </div>
      </section>
    </main>
  );
}

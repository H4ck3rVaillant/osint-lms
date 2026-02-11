import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [stats, setStats] = useState({
    debutant: 0,
    intermediaire: 0,
    avance: 0,
    etudesCas: 0,
    exercices: 0,
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

    // Études de cas
    const caseGeo = localStorage.getItem("badge_case_geo") === "true";
    const caseMedia = localStorage.getItem("badge_case_media") === "true";
    const caseAttr = localStorage.getItem("badge_case_attr") === "true";
    const caseChrono = localStorage.getItem("badge_case_chrono") === "true";
    const caseFinal = localStorage.getItem("badge_cases_osint") === "true";
    const etudesCasCount = [caseGeo, caseMedia, caseAttr, caseChrono, caseFinal].filter(Boolean).length;

    // Exercices OSINT (20 exercices au total)
    const exercicesCompleted = parseInt(localStorage.getItem("exercices_completed") || "0");
    const totalExercices = 20;

    const totalModules = 9 + 5; // 9 modules parcours + 5 cas
    const totalCompleted = debutantCount + intermediaireCount + avanceCount + etudesCasCount;

    setStats({
      debutant: (debutantCount / 3) * 100,
      intermediaire: (intermediaireCount / 3) * 100,
      avance: (avanceCount / 3) * 100,
      etudesCas: (etudesCasCount / 5) * 100,
      exercices: (exercicesCompleted / totalExercices) * 100,
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
          Complétez tous les modules et études de cas pour devenir un expert OSINT !
        </p>
      </div>

      {/* Parcours et Ressources */}
      <h2 style={{ color: "#00ff9c", fontSize: "1.5rem", marginBottom: "20px" }}>
        📚 Formation et Pratique
      </h2>

      <section style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", 
        gap: "24px",
        marginBottom: "40px"
      }}>
        {/* Lien vers Parcours */}
        <Link to="/parcours/debutant" style={cardStyle}>
          <div style={{ marginBottom: "12px" }}>
            <h3 style={{ color: "#00ff9c", margin: 0, fontSize: "1.3rem" }}>
              📚 Parcours de Formation
            </h3>
          </div>
          <p style={{ color: "#9ca3af", marginBottom: "15px", lineHeight: "1.6" }}>
            Accédez aux 3 parcours progressifs : Débutant, Intermédiaire et Avancé. 
            9 modules complets pour maîtriser l'OSINT.
          </p>
          
          <div style={{
            background: "#1a1f2e",
            border: "1px solid #2a3f3f",
            borderRadius: "6px",
            padding: "12px",
            marginBottom: "15px"
          }}>
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(3, 1fr)", 
              gap: "10px",
              textAlign: "center"
            }}>
              <div>
                <p style={{ color: "#00ff9c", fontSize: "1.3rem", fontWeight: "bold", margin: "0 0 4px 0" }}>
                  {Math.round(stats.debutant)}%
                </p>
                <p style={{ color: "#9ca3af", fontSize: "0.75rem", margin: 0 }}>
                  Débutant
                </p>
              </div>
              <div>
                <p style={{ color: "#00ff9c", fontSize: "1.3rem", fontWeight: "bold", margin: "0 0 4px 0" }}>
                  {Math.round(stats.intermediaire)}%
                </p>
                <p style={{ color: "#9ca3af", fontSize: "0.75rem", margin: 0 }}>
                  Intermédiaire
                </p>
              </div>
              <div>
                <p style={{ color: "#00ff9c", fontSize: "1.3rem", fontWeight: "bold", margin: "0 0 4px 0" }}>
                  {Math.round(stats.avance)}%
                </p>
                <p style={{ color: "#9ca3af", fontSize: "0.75rem", margin: 0 }}>
                  Avancé
                </p>
              </div>
            </div>
          </div>
          
          <p style={{ 
            color: "#00ff9c",
            fontSize: "0.9rem",
            fontWeight: "bold"
          }}>
            → Voir tous les parcours
          </p>
        </Link>

        {/* Études de cas */}
        <Link to="/etudes-osint" style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "12px" }}>
            <h3 style={{ color: "#00ff9c", margin: 0, fontSize: "1.3rem" }}>
              🛰️ Études de Cas OSINT
            </h3>
            <span style={{ 
              color: "#00ff9c", 
              fontSize: "1.1rem",
              fontWeight: "bold"
            }}>
              {Math.round(stats.etudesCas)}%
            </span>
          </div>
          <p style={{ color: "#9ca3af", marginBottom: "15px", lineHeight: "1.6" }}>
            Analyses réelles : géolocalisation, vérification de médias, attribution d'acteurs et chronologies.
          </p>
          
          <div style={{
            width: "100%",
            height: "8px",
            background: "#1a1f2e",
            borderRadius: "4px",
            overflow: "hidden",
            marginBottom: "10px"
          }}>
            <div style={{
              width: `${stats.etudesCas}%`,
              height: "100%",
              background: "#00ff9c",
              transition: "width 0.3s ease"
            }} />
          </div>
          
          <p style={{ 
            color: stats.etudesCas === 100 ? "#00ff9c" : "#00ff9c",
            fontSize: "0.9rem",
            fontWeight: "bold"
          }}>
            {stats.etudesCas === 100 ? "✓ Tous les cas complétés" : "→ Commencer les cas"}
          </p>
        </Link>

        {/* Exercices OSINT */}
        <Link to="/exercices-osint" style={cardStyle}>
          <div style={{ marginBottom: "12px" }}>
            <h3 style={{ color: "#00ff9c", margin: 0, fontSize: "1.3rem" }}>
              📝 Exercices OSINT
            </h3>
          </div>
          <p style={{ color: "#9ca3af", marginBottom: "15px", lineHeight: "1.6" }}>
            Entraînez-vous avec des exercices pratiques progressifs pour renforcer vos compétences.
          </p>
          
          <p style={{ 
            color: "#00ff9c",
            fontSize: "0.9rem",
            fontWeight: "bold"
          }}>
            → Accéder aux exercices
          </p>
        </Link>

        {/* Badges */}
        <Link to="/badges-osint" style={cardStyle}>
          <div style={{ marginBottom: "12px" }}>
            <h3 style={{ color: "#00ff9c", margin: 0, fontSize: "1.3rem" }}>
              🏆 Mes Badges
            </h3>
          </div>
          <p style={{ color: "#9ca3af", marginBottom: "15px", lineHeight: "1.6" }}>
            Consultez tous vos badges débloqués et ceux à venir. Chaque accomplissement compte !
          </p>
          
          <p style={{ 
            color: "#00ff9c",
            fontSize: "0.9rem",
            fontWeight: "bold"
          }}>
            → Voir mes badges
          </p>
        </Link>

        {/* Labo OSINT */}
        <Link to="/labo-osint" style={{
          ...cardStyle,
          background: "linear-gradient(135deg, #0b0f1a 0%, #1a1f2e 100%)",
          border: "2px solid #00ff9c"
        }}>
          <div style={{ marginBottom: "12px" }}>
            <h3 style={{ color: "#00ff9c", margin: 0, fontSize: "1.3rem" }}>
              🧪 Labo Interactif
            </h3>
          </div>
          <p style={{ color: "#9ca3af", marginBottom: "15px", lineHeight: "1.6" }}>
            Terminal web, challenges OSINT interactifs, code playground et outils en ligne !
          </p>
          
          <p style={{ 
            color: "#00ff9c",
            fontSize: "0.9rem",
            fontWeight: "bold"
          }}>
            🚀 Découvrir le labo
          </p>
        </Link>
      </section>

      {/* Outils & Ressources Cyber */}
      <h2 style={{ color: "#00ff9c", fontSize: "1.5rem", marginBottom: "20px", marginTop: "40px" }}>
        🛠️ Outils & Ressources Cyber
      </h2>

      <section style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", 
        gap: "24px",
        marginBottom: "40px"
      }}>
        {/* HackerAI */}
        <Link to="/hacker-ai" style={cardStyle}>
          <div style={{ marginBottom: "12px" }}>
            <h3 style={{ color: "#00ff9c", margin: 0, fontSize: "1.3rem" }}>
              🤖 HackerAI
            </h3>
          </div>
          <p style={{ color: "#9ca3af", marginBottom: "15px", lineHeight: "1.6" }}>
            Outil d'intelligence artificielle orienté cybersécurité. Présentation, accès et guide d'utilisation.
          </p>
          
          <p style={{ 
            color: "#00ff9c",
            fontSize: "0.9rem",
            fontWeight: "bold"
          }}>
            → Découvrir HackerAI
          </p>
        </Link>

        {/* DependencyTrack */}
        <Link to="/dependency-track" style={cardStyle}>
          <div style={{ marginBottom: "12px" }}>
            <h3 style={{ color: "#00ff9c", margin: 0, fontSize: "1.3rem" }}>
              📦 Dependency Track
            </h3>
          </div>
          <p style={{ color: "#9ca3af", marginBottom: "15px", lineHeight: "1.6" }}>
            Analyse de dépendances, SBOM et sécurité de la supply chain logicielle.
          </p>
          
          <p style={{ 
            color: "#00ff9c",
            fontSize: "0.9rem",
            fontWeight: "bold"
          }}>
            → Accéder à l'outil
          </p>
        </Link>

        {/* Outils Cyber */}
        <Link to="/outils-cyber" style={cardStyle}>
          <div style={{ marginBottom: "12px" }}>
            <h3 style={{ color: "#00ff9c", margin: 0, fontSize: "1.3rem" }}>
              🔧 Outils Cyber
            </h3>
          </div>
          <p style={{ color: "#9ca3af", marginBottom: "15px", lineHeight: "1.6" }}>
            Boîte à outils organisée : OSINT, Cyber Analyse, Défense, Analyse Machine & Réseaux.
          </p>
          
          <p style={{ 
            color: "#00ff9c",
            fontSize: "0.9rem",
            fontWeight: "bold"
          }}>
            → Explorer les outils
          </p>
        </Link>

        {/* Référentiels */}
        <Link to="/referentiels" style={cardStyle}>
          <div style={{ marginBottom: "12px" }}>
            <h3 style={{ color: "#00ff9c", margin: 0, fontSize: "1.3rem" }}>
              📚 Référentiels
            </h3>
          </div>
          <p style={{ color: "#9ca3af", marginBottom: "15px", lineHeight: "1.6" }}>
            ANSSI, lois (RGPD, LPM), normes ISO 27001/27002/27005. Documentation complète.
          </p>
          
          <p style={{ 
            color: "#00ff9c",
            fontSize: "0.9rem",
            fontWeight: "bold"
          }}>
            → Consulter les référentiels
          </p>
        </Link>

        {/* VM Access */}
        <Link to="/vm-access" style={cardStyle}>
          <div style={{ marginBottom: "12px" }}>
            <h3 style={{ color: "#00ff9c", margin: 0, fontSize: "1.3rem" }}>
              💻 VM Access
            </h3>
          </div>
          <p style={{ color: "#9ca3af", marginBottom: "15px", lineHeight: "1.6" }}>
            Présentation de Kali Linux & Parrot OS. Guides d'installation et d'utilisation.
          </p>
          <p style={{ color: "#00ff9c", fontSize: "0.9rem", fontWeight: "bold" }}>
            → Accéder aux VM
          </p>
        </Link>

        {/* Kali Linux Lab */}
        <Link to="/vm-kali" style={cardStyle}>
          <div style={{ marginBottom: "12px" }}>
            <h3 style={{ color: "#00ff9c", margin: 0, fontSize: "1.3rem" }}>
              🐉 Kali Linux Lab
            </h3>
          </div>
          <p style={{ color: "#9ca3af", marginBottom: "15px", lineHeight: "1.6" }}>
            Terminal Kali Linux interactif. Pratiquez nmap, theHarvester, sqlmap, hashcat et plus.
          </p>
          <p style={{ color: "#00ff9c", fontSize: "0.9rem", fontWeight: "bold" }}>
            → Lancer le terminal
          </p>
        </Link>

        {/* Parrot OS Lab */}
        <Link to="/vm-parrot" style={cardStyle}>
          <div style={{ marginBottom: "12px" }}>
            <h3 style={{ color: "#00ff9c", margin: 0, fontSize: "1.3rem" }}>
              🦜 Parrot OS Lab
            </h3>
          </div>
          <p style={{ color: "#9ca3af", marginBottom: "15px", lineHeight: "1.6" }}>
            Terminal Parrot OS avec AnonSurf/Tor, GPG, WiFi audit et outils privacy.
          </p>
          <p style={{ color: "#00ff9c", fontSize: "0.9rem", fontWeight: "bold" }}>
            → Lancer le terminal
          </p>
        </Link>
      </section>

      {/* === SECTION GAMIFICATION === */}
      <section style={{ marginBottom: "30px" }}>
        <h2 style={{ color: "#00ff9c", fontSize: "1.4rem", marginBottom: "20px", borderBottom: "1px solid #2a3f3f", paddingBottom: "10px" }}>
          🎮 Challenges & Gamification
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>

          {/* CTF */}
          <Link to="/ctf" style={cardStyle}>
            <div style={{ marginBottom: "12px" }}>
              <h3 style={{ color: "#00ff9c", margin: 0, fontSize: "1.3rem" }}>🚩 Mini-CTF</h3>
              <span style={{ background: "#ef4444", color: "#fff", fontSize: "0.7rem", fontWeight: "bold", padding: "2px 8px", borderRadius: "4px", marginTop: "6px", display: "inline-block" }}>
                11 DÉFIS
              </span>
            </div>
            <p style={{ color: "#9ca3af", marginBottom: "15px", lineHeight: "1.6" }}>
              OSINT, Cryptographie, Web Hacking. Résolvez les défis et gagnez des XP !
            </p>
            <p style={{ color: "#00ff9c", fontSize: "0.9rem", fontWeight: "bold" }}>→ Relever les défis</p>
          </Link>

          {/* Leaderboard */}
          <Link to="/leaderboard" style={cardStyle}>
            <div style={{ marginBottom: "12px" }}>
              <h3 style={{ color: "#00ff9c", margin: 0, fontSize: "1.3rem" }}>🏆 Leaderboard</h3>
              <span style={{ background: "#fbbf24", color: "#0b0f1a", fontSize: "0.7rem", fontWeight: "bold", padding: "2px 8px", borderRadius: "4px", marginTop: "6px", display: "inline-block" }}>
                TEMPS RÉEL
              </span>
            </div>
            <p style={{ color: "#9ca3af", marginBottom: "15px", lineHeight: "1.6" }}>
              Classement global des hackers. Comparez vos scores et montez dans le classement.
            </p>
            <p style={{ color: "#00ff9c", fontSize: "0.9rem", fontWeight: "bold" }}>→ Voir le classement</p>
          </Link>

          {/* Progression */}
          <Link to="/progression" style={cardStyle}>
            <div style={{ marginBottom: "12px" }}>
              <h3 style={{ color: "#00ff9c", margin: 0, fontSize: "1.3rem" }}>⭐ Progression</h3>
              <span style={{ background: "#8b5cf6", color: "#fff", fontSize: "0.7rem", fontWeight: "bold", padding: "2px 8px", borderRadius: "4px", marginTop: "6px", display: "inline-block" }}>
                XP & BADGES
              </span>
            </div>
            <p style={{ color: "#9ca3af", marginBottom: "15px", lineHeight: "1.6" }}>
              Votre XP, niveau, streak d'activité et collection de 20 badges à débloquer.
            </p>
            <p style={{ color: "#00ff9c", fontSize: "0.9rem", fontWeight: "bold" }}>→ Ma progression</p>
          </Link>

        </div>
      </section>

      {/* Statistiques rapides */}
      <div style={{
        background: "#1a1f2e",
        border: "1px solid #2a3f3f",
        borderRadius: "8px",
        padding: "24px",
        marginTop: "30px"
      }}>
        <h3 style={{ color: "#00ff9c", marginBottom: "20px", fontSize: "1.2rem" }}>
          📊 Statistiques Rapides
        </h3>
        
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
          gap: "20px" 
        }}>
          <div>
            <p style={{ color: "#9ca3af", fontSize: "0.9rem", marginBottom: "5px" }}>
              Parcours Débutant
            </p>
            <p style={{ color: "#00ff9c", fontSize: "1.5rem", fontWeight: "bold" }}>
              {Math.round(stats.debutant)}%
            </p>
          </div>
          
          <div>
            <p style={{ color: "#9ca3af", fontSize: "0.9rem", marginBottom: "5px" }}>
              Parcours Intermédiaire
            </p>
            <p style={{ color: "#00ff9c", fontSize: "1.5rem", fontWeight: "bold" }}>
              {Math.round(stats.intermediaire)}%
            </p>
          </div>
          
          <div>
            <p style={{ color: "#9ca3af", fontSize: "0.9rem", marginBottom: "5px" }}>
              Parcours Avancé
            </p>
            <p style={{ color: "#00ff9c", fontSize: "1.5rem", fontWeight: "bold" }}>
              {Math.round(stats.avance)}%
            </p>
          </div>
          
          <div>
            <p style={{ color: "#9ca3af", fontSize: "0.9rem", marginBottom: "5px" }}>
              Études de Cas
            </p>
            <p style={{ color: "#00ff9c", fontSize: "1.5rem", fontWeight: "bold" }}>
              {Math.round(stats.etudesCas)}%
            </p>
          </div>

          <div>
            <p style={{ color: "#9ca3af", fontSize: "0.9rem", marginBottom: "5px" }}>
              Exercices OSINT
            </p>
            <p style={{ color: "#00ff9c", fontSize: "1.5rem", fontWeight: "bold" }}>
              {Math.round(stats.exercices)}%
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

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

    // Exercices OSINT
    const exercicesCompleted = parseInt(localStorage.getItem("exercices_completed") || "0");
    const totalExercices = 20;

    // Badges (20 badges au total dans le système)
    const totalBadges = 20;
    const badgesEarned = debutantCount + intermediaireCount + avanceCount + etudesCasCount;

    const totalModules = 9 + 5;
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

      {/* Statistiques en 2 lignes */}
      <div style={{
        background: "#1a1f2e",
        border: "1px solid #2a3f3f",
        borderRadius: "8px",
        padding: "24px",
        marginBottom: "40px"
      }}>
        <h3 style={{ color: "#00ff9c", marginBottom: "20px", fontSize: "1.2rem" }}>
          📊 Statistiques Détaillées
        </h3>
        
        {/* Ligne 1: Parcours */}
        <div style={{ marginBottom: "20px" }}>
          <p style={{ color: "#9ca3af", fontSize: "0.85rem", marginBottom: "10px", fontWeight: "bold" }}>
            PARCOURS
          </p>
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", 
            gap: "15px" 
          }}>
            <div style={{ background: "#0b0f1a", padding: "15px", borderRadius: "6px", border: "1px solid #2a3f3f" }}>
              <p style={{ color: "#9ca3af", fontSize: "0.85rem", marginBottom: "5px" }}>
                🟢 Débutant
              </p>
              <p style={{ color: "#00ff9c", fontSize: "1.5rem", fontWeight: "bold", margin: 0 }}>
                {Math.round(stats.debutant)}%
              </p>
            </div>
            
            <div style={{ background: "#0b0f1a", padding: "15px", borderRadius: "6px", border: "1px solid #2a3f3f" }}>
              <p style={{ color: "#9ca3af", fontSize: "0.85rem", marginBottom: "5px" }}>
                🟡 Intermédiaire
              </p>
              <p style={{ color: "#00ff9c", fontSize: "1.5rem", fontWeight: "bold", margin: 0 }}>
                {Math.round(stats.intermediaire)}%
              </p>
            </div>
            
            <div style={{ background: "#0b0f1a", padding: "15px", borderRadius: "6px", border: "1px solid #2a3f3f" }}>
              <p style={{ color: "#9ca3af", fontSize: "0.85rem", marginBottom: "5px" }}>
                🔴 Avancé
              </p>
              <p style={{ color: "#00ff9c", fontSize: "1.5rem", fontWeight: "bold", margin: 0 }}>
                {Math.round(stats.avance)}%
              </p>
            </div>
          </div>
        </div>

        {/* Ligne 2: Exercices et Cas */}
        <div style={{ marginBottom: "20px" }}>
          <p style={{ color: "#9ca3af", fontSize: "0.85rem", marginBottom: "10px", fontWeight: "bold" }}>
            PRATIQUE
          </p>
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", 
            gap: "15px" 
          }}>
            <div style={{ background: "#0b0f1a", padding: "15px", borderRadius: "6px", border: "1px solid #2a3f3f" }}>
              <p style={{ color: "#9ca3af", fontSize: "0.85rem", marginBottom: "5px" }}>
                🛰️ Études de Cas
              </p>
              <p style={{ color: "#00ff9c", fontSize: "1.5rem", fontWeight: "bold", margin: 0 }}>
                {Math.round(stats.etudesCas)}%
              </p>
            </div>
            
            <div style={{ background: "#0b0f1a", padding: "15px", borderRadius: "6px", border: "1px solid #2a3f3f" }}>
              <p style={{ color: "#9ca3af", fontSize: "0.85rem", marginBottom: "5px" }}>
                📝 Exercices OSINT
              </p>
              <p style={{ color: "#00ff9c", fontSize: "1.5rem", fontWeight: "bold", margin: 0 }}>
                {Math.round(stats.exercices)}%
              </p>
            </div>
          </div>
        </div>

        {/* Ligne 3: Badges */}
        <div>
          <p style={{ color: "#9ca3af", fontSize: "0.85rem", marginBottom: "10px", fontWeight: "bold" }}>
            RÉCOMPENSES
          </p>
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", 
            gap: "15px" 
          }}>
            <div style={{ background: "#0b0f1a", padding: "15px", borderRadius: "6px", border: "1px solid #fbbf24" }}>
              <p style={{ color: "#9ca3af", fontSize: "0.85rem", marginBottom: "5px" }}>
                🏆 Badges Débloqués
              </p>
              <p style={{ color: "#fbbf24", fontSize: "1.5rem", fontWeight: "bold", margin: 0 }}>
                {Math.round((stats.badges / 100) * 20)}/20
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Parcours */}
      <section style={{ marginBottom: "30px" }}>
        <h2 style={{ color: "#00ff9c", fontSize: "1.4rem", marginBottom: "20px" }}>
          📚 Parcours de Formation
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "20px" }}>
          
          {/* Débutant */}
          <Link to="/parcours-debutant" style={cardStyle}>
            <div style={{ marginBottom: "12px" }}>
              <h3 style={{ color: "#00ff9c", margin: 0, fontSize: "1.3rem" }}>
                🟢 Parcours Débutant
              </h3>
            </div>
            <p style={{ color: "#9ca3af", marginBottom: "15px", lineHeight: "1.6" }}>
              Introduction à l'OSINT, méthodologie de base et premiers outils.
            </p>
            <div style={{
              width: "100%",
              height: "6px",
              background: "#1a1f2e",
              borderRadius: "3px",
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
            <p style={{ color: "#00ff9c", fontSize: "0.9rem", fontWeight: "bold" }}>
              {stats.debutant === 100 ? "✓ Complété" : "→ Continuer"}
            </p>
          </Link>

          {/* Intermédiaire */}
          <Link to="/parcours-intermediaire" style={cardStyle}>
            <div style={{ marginBottom: "12px" }}>
              <h3 style={{ color: "#00ff9c", margin: 0, fontSize: "1.3rem" }}>
                🟡 Parcours Intermédiaire
              </h3>
            </div>
            <p style={{ color: "#9ca3af", marginBottom: "15px", lineHeight: "1.6" }}>
              Techniques avancées, analyse de réseaux sociaux, dark web.
            </p>
            <div style={{
              width: "100%",
              height: "6px",
              background: "#1a1f2e",
              borderRadius: "3px",
              overflow: "hidden",
              marginBottom: "10px"
            }}>
              <div style={{
                width: `${stats.intermediaire}%`,
                height: "100%",
                background: "#fbbf24",
                transition: "width 0.3s ease"
              }} />
            </div>
            <p style={{ color: "#fbbf24", fontSize: "0.9rem", fontWeight: "bold" }}>
              {stats.intermediaire === 100 ? "✓ Complété" : "→ Continuer"}
            </p>
          </Link>

          {/* Avancé */}
          <Link to="/parcours-avance" style={cardStyle}>
            <div style={{ marginBottom: "12px" }}>
              <h3 style={{ color: "#00ff9c", margin: 0, fontSize: "1.3rem" }}>
                🔴 Parcours Avancé
              </h3>
            </div>
            <p style={{ color: "#9ca3af", marginBottom: "15px", lineHeight: "1.6" }}>
              OPSEC, investigations complexes, automation et rapports pros.
            </p>
            <div style={{
              width: "100%",
              height: "6px",
              background: "#1a1f2e",
              borderRadius: "3px",
              overflow: "hidden",
              marginBottom: "10px"
            }}>
              <div style={{
                width: `${stats.avance}%`,
                height: "100%",
                background: "#ef4444",
                transition: "width 0.3s ease"
              }} />
            </div>
            <p style={{ color: "#ef4444", fontSize: "0.9rem", fontWeight: "bold" }}>
              {stats.avance === 100 ? "✓ Complété" : "→ Continuer"}
            </p>
          </Link>

        </div>
      </section>

      {/* Études & Exercices */}
      <section style={{ marginBottom: "30px" }}>
        <h2 style={{ color: "#00ff9c", fontSize: "1.4rem", marginBottom: "20px" }}>
          🎯 Pratique & Cas Réels
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "20px" }}>
          
          <Link to="/etudes-osint" style={cardStyle}>
            <h3 style={{ color: "#00ff9c", margin: "0 0 12px 0", fontSize: "1.3rem" }}>
              🛰️ Études de Cas
            </h3>
            <p style={{ color: "#9ca3af", marginBottom: "15px", lineHeight: "1.6" }}>
              Analyses réelles : géolocalisation, médias, attribution.
            </p>
            <p style={{ color: "#00ff9c", fontSize: "0.9rem", fontWeight: "bold" }}>
              → Commencer les cas
            </p>
          </Link>

          <Link to="/exercices-osint" style={cardStyle}>
            <h3 style={{ color: "#00ff9c", margin: "0 0 12px 0", fontSize: "1.3rem" }}>
              📝 Exercices OSINT
            </h3>
            <p style={{ color: "#9ca3af", marginBottom: "15px", lineHeight: "1.6" }}>
              20 exercices progressifs pour renforcer vos compétences.
            </p>
            <p style={{ color: "#00ff9c", fontSize: "0.9rem", fontWeight: "bold" }}>
              → Accéder aux exercices
            </p>
          </Link>

          <Link to="/badges-osint" style={cardStyle}>
            <h3 style={{ color: "#00ff9c", margin: "0 0 12px 0", fontSize: "1.3rem" }}>
              🏆 Mes Badges
            </h3>
            <p style={{ color: "#9ca3af", marginBottom: "15px", lineHeight: "1.6" }}>
              20 badges à débloquer. Chaque accomplissement compte !
            </p>
            <p style={{ color: "#fbbf24", fontSize: "0.9rem", fontWeight: "bold" }}>
              {Math.round((stats.badges / 100) * 20)}/20 débloqués
            </p>
          </Link>

        </div>
      </section>

      {/* CTF & Gamification */}
      <section>
        <h2 style={{ color: "#00ff9c", fontSize: "1.4rem", marginBottom: "20px" }}>
          🎮 Challenges & XP
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
          
          <Link to="/quiz" style={cardStyle}>
            <h3 style={{ color: "#00ff9c", margin: "0 0 12px 0", fontSize: "1.3rem" }}>
              🎓 Quiz OSINT
            </h3>
            <p style={{ color: "#9ca3af", marginBottom: "15px", lineHeight: "1.6" }}>
              6 quiz thématiques. Gagnez des badges !
            </p>
            <p style={{ color: "#3b82f6", fontSize: "0.9rem", fontWeight: "bold" }}>
              → Tester vos connaissances
            </p>
          </Link>

          <Link to="/challenges" style={cardStyle}>
            <h3 style={{ color: "#00ff9c", margin: "0 0 12px 0", fontSize: "1.3rem" }}>
              🔥 Challenge Hebdo
            </h3>
            <p style={{ color: "#9ca3af", marginBottom: "15px", lineHeight: "1.6" }}>
              52 challenges. Un nouveau chaque semaine !
            </p>
            <p style={{ color: "#f59e0b", fontSize: "0.9rem", fontWeight: "bold" }}>
              → Challenge de la semaine
            </p>
          </Link>

          <Link to="/ctf" style={cardStyle}>
            <h3 style={{ color: "#00ff9c", margin: "0 0 12px 0", fontSize: "1.3rem" }}>
              🚩 Mini-CTF
            </h3>
            <p style={{ color: "#9ca3af", marginBottom: "15px", lineHeight: "1.6" }}>
              11 défis OSINT, Crypto, Web. Gagnez des XP !
            </p>
            <p style={{ color: "#ef4444", fontSize: "0.9rem", fontWeight: "bold" }}>
              → Relever les défis
            </p>
          </Link>

          <Link to="/leaderboard" style={cardStyle}>
            <h3 style={{ color: "#00ff9c", margin: "0 0 12px 0", fontSize: "1.3rem" }}>
              🏆 Leaderboard
            </h3>
            <p style={{ color: "#9ca3af", marginBottom: "15px", lineHeight: "1.6" }}>
              Classement global. Montez dans le ranking !
            </p>
            <p style={{ color: "#fbbf24", fontSize: "0.9rem", fontWeight: "bold" }}>
              → Voir le classement
            </p>
          </Link>

          <Link to="/progression" style={cardStyle}>
            <h3 style={{ color: "#00ff9c", margin: "0 0 12px 0", fontSize: "1.3rem" }}>
              ⭐ Ma Progression
            </h3>
            <p style={{ color: "#9ca3af", marginBottom: "15px", lineHeight: "1.6" }}>
              XP, niveau, streak et 20 badges à débloquer.
            </p>
            <p style={{ color: "#8b5cf6", fontSize: "0.9rem", fontWeight: "bold" }}>
              → Ma progression
            </p>
          </Link>

        </div>
      </section>

    </main>
  );
}

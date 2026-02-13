import { useEffect, useState } from "react";

export default function BadgesOSINT() {
  const [stats, setStats] = useState({
    totalBadges: 0,
    unlockedBadges: 0,
    progressPercentage: 0,
  });

  const sections = [
    {
      title: "🎓 Parcours Débutant",
      description: "Maîtrisez les fondamentaux de l'OSINT",
      badges: [
        { key: "badge_deb_intro", label: "Introduction OSINT", desc: "Comprendre les bases de l'Open Source Intelligence" },
        { key: "badge_deb_methodo", label: "Méthodologie OSINT", desc: "Appliquer une démarche structurée en 6 étapes" },
        { key: "badge_deb_outils", label: "Outils OSINT", desc: "Utiliser Google Dorks, Shodan, Sherlock et Maltego" },
      ],
    },
    {
      title: "🧠 Parcours Intermédiaire",
      description: "Développez votre expertise analytique",
      badges: [
        { key: "badge_int_intro", label: "Analyse Critique", desc: "Évaluer la fiabilité et détecter les biais cognitifs" },
        { key: "badge_int_methodo", label: "Cycle de Renseignement", desc: "Maîtriser le pivoting et la validation croisée" },
        { key: "badge_int_outils", label: "Automatisation OSINT", desc: "Exploiter Maltego, SpiderFoot et archives" },
      ],
    },
    {
      title: "🚀 Parcours Avancé",
      description: "Atteignez le niveau expert",
      badges: [
        { key: "badge_adv_intro", label: "Renseignement Stratégique", desc: "Analyser l'environnement informationnel global" },
        { key: "badge_adv_methodo", label: "Méthodologie Professionnelle", desc: "Fusion multi-sources et livrables exécutifs" },
        { key: "badge_adv_outils", label: "APIs et Automatisation", desc: "Maîtriser Python, Neo4j et ML pour l'OSINT" },
      ],
    },
    {
      title: "🛰️ Études de Cas OSINT",
      description: "Investigations réelles type Bellingcat",
      badges: [
        { key: "badge_case_geo", label: "Géolocalisation d'Images", desc: "Localiser précisément via indices visuels" },
        { key: "badge_case_media", label: "Vérification de Médias", desc: "Détecter manipulations et désinformation" },
        { key: "badge_case_attr", label: "Attribution d'Acteurs", desc: "Identifier les auteurs d'actions coordonnées" },
        { key: "badge_case_chrono", label: "Chronologie d'Événements", desc: "Reconstruire des séquences factuelles" },
        { key: "badge_cases_osint", label: "🏆 Analyste OSINT Certifié", desc: "Maîtrise complète des cas d'investigation" },
      ],
    },
    {
      title: "📝 Exercices OSINT",
      description: "Entraînement pratique progressif",
      badges: [
        { key: "badge_exo_debutant", label: "Exercices Débutant", desc: "Complétez les 5 exercices de niveau Débutant" },
        { key: "badge_exo_intermediaire", label: "Exercices Intermédiaire", desc: "Complétez les 5 exercices de niveau Intermédiaire" },
        { key: "badge_exo_avance", label: "Exercices Avancé", desc: "Complétez les 5 exercices de niveau Avancé" },
        { key: "badge_exo_expert", label: "Exercices Expert", desc: "Complétez les 5 exercices de niveau Expert" },
        { key: "badge_exo_master", label: "🏆 Master OSINT", desc: "Complétez tous les 20 exercices pratiques" },
      ],
    },
  ];

  useEffect(() => {
    let totalCount = 0;
    let unlockedCount = 0;

    sections.forEach(section => {
      section.badges.forEach(badge => {
        totalCount++;
        if (localStorage.getItem(badge.key) === "true") {
          unlockedCount++;
        }
      });
    });

    setStats({
      totalBadges: totalCount,
      unlockedBadges: unlockedCount,
      progressPercentage: (unlockedCount / totalCount) * 100,
    });
  }, []);

  return (
    <main style={{ padding: "40px", maxWidth: "1200px", margin: "0 auto" }}>
      <h1 style={{ color: "#00ff9c", fontSize: "2rem", marginBottom: "10px" }}>
        🏆 Mes Badges OSINT
      </h1>
      <p style={{ color: "#9ca3af", marginBottom: "30px", fontSize: "1.1rem" }}>
        Suivez vos accomplissements et débloquez de nouveaux badges en complétant les parcours et études de cas
      </p>

      {/* Statistiques globales */}
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
          marginBottom: "15px",
          flexWrap: "wrap" as const,
          gap: "15px"
        }}>
          <h2 style={{ color: "#00ff9c", margin: 0, fontSize: "1.5rem" }}>
            📊 Progression Globale
          </h2>
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <span style={{ 
              color: "#9ca3af", 
              fontSize: "1rem"
            }}>
              {stats.unlockedBadges}/{stats.totalBadges} badges débloqués
            </span>
            <span style={{ 
              color: "#00ff9c", 
              fontWeight: "bold",
              fontSize: "1.3rem"
            }}>
              {Math.round(stats.progressPercentage)}%
            </span>
          </div>
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
            width: `${stats.progressPercentage}%`,
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
            {stats.progressPercentage > 5 && `${Math.round(stats.progressPercentage)}%`}
          </div>
        </div>

        {stats.progressPercentage === 100 && (
          <div style={{
            marginTop: "20px",
            padding: "15px",
            background: "#1a1f2e",
            border: "1px solid #00ff9c",
            borderRadius: "8px",
            textAlign: "center"
          }}>
            <p style={{ color: "#00ff9c", fontSize: "1.2rem", fontWeight: "bold", margin: 0 }}>
              🎉 Félicitations ! Vous avez débloqué tous les badges OSINT !
            </p>
          </div>
        )}
      </div>

      {/* Sections de badges */}
      {sections.map((section) => {
        const sectionUnlocked = section.badges.filter(
          b => localStorage.getItem(b.key) === "true"
        ).length;
        const sectionTotal = section.badges.length;
        const sectionProgress = (sectionUnlocked / sectionTotal) * 100;

        return (
          <section key={section.title} style={{ marginBottom: "40px" }}>
            <div style={{ marginBottom: "20px" }}>
              <h2 style={{ color: "#00ff9c", marginBottom: "8px", fontSize: "1.4rem" }}>
                {section.title}
              </h2>
              <p style={{ color: "#9ca3af", marginBottom: "12px" }}>
                {section.description}
              </p>
              
              {/* Barre de progression de la section */}
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{
                  flex: 1,
                  height: "10px",
                  background: "#1a1f2e",
                  borderRadius: "5px",
                  overflow: "hidden",
                  border: "1px solid #2a3f3f"
                }}>
                  <div style={{
                    width: `${sectionProgress}%`,
                    height: "100%",
                    background: "#00ff9c",
                    transition: "width 0.5s ease"
                  }} />
                </div>
                <span style={{ 
                  color: "#9ca3af",
                  fontSize: "0.9rem",
                  minWidth: "60px",
                  textAlign: "right"
                }}>
                  {sectionUnlocked}/{sectionTotal}
                </span>
              </div>
            </div>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "20px",
            }}>
              {section.badges.map((b) => {
                const unlocked = localStorage.getItem(b.key) === "true";

                return (
                  <div
                    key={b.key}
                    style={{
                      background: "#0b0f1a",
                      border: `2px solid ${unlocked ? "#00ff9c" : "#2a3f3f"}`,
                      borderRadius: "12px",
                      padding: "24px",
                      opacity: unlocked ? 1 : 0.5,
                      transition: "all 0.3s ease",
                      position: "relative" as const,
                    }}
                  >
                    {/* Icône de badge */}
                    <div style={{
                      position: "absolute" as const,
                      top: "20px",
                      right: "20px",
                      fontSize: "2rem"
                    }}>
                      {unlocked ? "✓" : "🔒"}
                    </div>

                    <h3 style={{ 
                      color: unlocked ? "#00ff9c" : "#6b7280",
                      marginBottom: "10px",
                      fontSize: "1.1rem",
                      paddingRight: "40px"
                    }}>
                      {b.label}
                    </h3>
                    
                    <p style={{ 
                      color: "#9ca3af",
                      fontSize: "0.9rem",
                      lineHeight: "1.6",
                      marginBottom: "15px"
                    }}>
                      {b.desc}
                    </p>

                    <div style={{
                      paddingTop: "12px",
                      borderTop: "1px solid #2a3f3f"
                    }}>
                      <p style={{
                        margin: 0,
                        color: unlocked ? "#00ff9c" : "#6b7280",
                        fontWeight: "bold",
                        fontSize: "0.9rem"
                      }}>
                        {unlocked ? "✓ Débloqué" : "🔒 Verrouillé"}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}

      {/* Section informative */}
      <div style={{
        background: "#1a1f2e",
        border: "1px solid #2a3f3f",
        borderRadius: "8px",
        padding: "24px",
        marginTop: "40px"
      }}>
        <h3 style={{ color: "#00ff9c", marginBottom: "15px", fontSize: "1.2rem" }}>
          💡 Comment débloquer des badges ?
        </h3>
        <ul style={{ color: "#9ca3af", lineHeight: "2", paddingLeft: "20px", margin: 0 }}>
          <li>
            <strong>Parcours de formation :</strong> Complétez les modules Introduction, Méthodologie et Outils de chaque niveau (Débutant, Intermédiaire, Avancé)
          </li>
          <li>
            <strong>Exercices pratiques :</strong> Résolvez 5 exercices par niveau de difficulté pour débloquer les badges de praticien (Débutant, Intermédiaire, Avancé, Expert)
          </li>
          <li>
            <strong>Études de cas :</strong> Résolvez les cas d'investigation OSINT inspirés de situations réelles
          </li>
          <li>
            <strong>Badge ultime :</strong> Complétez tous les cas d'étude pour obtenir le badge "Analyste OSINT Certifié"
          </li>
          <li>
            <strong>Progression permanente :</strong> Vos badges sont sauvegardés et restent débloqués même après fermeture du navigateur
          </li>
        </ul>
      </div>
    </main>
  );
}

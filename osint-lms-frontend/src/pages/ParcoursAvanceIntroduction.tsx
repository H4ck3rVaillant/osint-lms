import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useThemeColors } from "../context/ThemeContext";

export default function ParcoursAvanceIntroduction() {
  const colors = useThemeColors();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const validate = () => {
    localStorage.setItem("badge_adv_intro", "true");
    setShowModal(true);
  };

  const returnToParcours = () => {
    navigate("/parcours/avance");
  };

  return (
    <main style={{ maxWidth: "1000px", margin: "0 auto", padding: "40px" }}>
      <h1 style={{ color: colors.accent, marginBottom: "20px" }}>
        Module 1: Introduction OSINT – Avancé
      </h1>

      <section style={{ marginBottom: "30px" }}>
        <h2 style={{ color: colors.accent, fontSize: "1.5rem", marginBottom: "15px" }}>
          L'OSINT stratégique et le renseignement décisionnel
        </h2>
        <p style={{ color: colors.textSecondary, lineHeight: "1.8", marginBottom: "15px" }}>
          L'OSINT avancé s'inscrit dans une logique de <strong style={{ color: colors.accent }}>renseignement stratégique</strong> : 
          il ne s'agit plus seulement de collecter des informations, mais de <strong>comprendre l'environnement informationnel</strong>, 
          d'<strong>anticiper les évolutions</strong> et de <strong>produire du renseignement décisionnel</strong> 
          pour les décideurs politiques, militaires ou économiques.
        </p>
        <p style={{ color: colors.textSecondary, lineHeight: "1.8", marginBottom: "15px" }}>
          À ce niveau, l'analyste OSINT doit maîtriser la détection de narratifs, l'analyse d'opérations d'influence, 
          la lecture géopolitique des signaux faibles, et la production de renseignement prévisible et exploitable.
        </p>
      </section>

      <section style={{ 
        background: colors.bgPrimary, 
        border: `1px solid ${colors.accent}`, 
        borderRadius: "8px", 
        padding: "24px",
        marginBottom: "30px"
      }}>
        <h2 style={{ color: colors.accent, fontSize: "1.3rem", marginBottom: "15px" }}>
          Domaines d'expertise avancée
        </h2>
        <ul style={{ color: colors.textSecondary, lineHeight: "2", paddingLeft: "20px" }}>
          <li>
            <strong style={{ color: colors.accent }}>Analyse de l'environnement informationnel</strong> : 
            Cartographie des acteurs médiatiques, identification des sources primaires vs secondaires, 
            compréhension des flux d'information et des chaînes de diffusion
          </li>
          <li>
            <strong style={{ color: colors.accent }}>Détection de désinformation et opérations d'influence</strong> : 
            Reconnaissance des campagnes coordonnées (coordinated inauthentic behavior), analyse de réseaux de bots, 
            identification de manipulations médiatiques, traçage d'opérations psychologiques (PSYOPS)
          </li>
          <li>
            <strong style={{ color: colors.accent }}>Lecture géopolitique des signaux faibles</strong> : 
            Détection d'indicateurs précoces de crises, analyse de tensions géopolitiques via sources ouvertes, 
            surveillance de mouvements de troupes ou d'infrastructures stratégiques
          </li>
          <li>
            <strong style={{ color: colors.accent }}>Production de renseignement décisionnel</strong> : 
            Création de rapports d'intelligence stratégique, briefings exécutifs, évaluations de menaces, 
            et recommandations actionnables pour les décideurs
          </li>
        </ul>
      </section>

      <section style={{ marginBottom: "30px" }}>
        <h2 style={{ color: colors.accent, fontSize: "1.3rem", marginBottom: "15px" }}>
          Cas d'usage professionnels
        </h2>
        
        <div style={{ 
          background: colors.bgPrimary, 
          border: `1px solid ${colors.border}`, 
          borderRadius: "8px", 
          padding: "20px",
          marginBottom: "15px"
        }}>
          <h3 style={{ color: colors.accent, marginBottom: "10px" }}>
            🌍 Analyse géopolitique et conflits
          </h3>
          <p style={{ color: colors.textSecondary, lineHeight: "1.8" }}>
            Utilisation de l'OSINT pour <strong>analyser les conflits armés</strong> en temps réel : 
            géolocalisation de combats via vidéos/photos, identification d'équipements militaires, 
            traçage de mouvements de troupes, analyse de communications interceptées sur Telegram/Twitter. 
            Exemples : guerre en Ukraine analysée par Bellingcat, conflits au Moyen-Orient.
          </p>
        </div>

        <div style={{ 
          background: colors.bgPrimary, 
          border: `1px solid ${colors.border}`, 
          borderRadius: "8px", 
          padding: "20px",
          marginBottom: "15px"
        }}>
          <h3 style={{ color: colors.accent, marginBottom: "10px" }}>
            🎭 Détection d'opérations d'influence
          </h3>
          <p style={{ color: colors.textSecondary, lineHeight: "1.8" }}>
            Identification de <strong>campagnes de manipulation informationnelle</strong> orchestrées par des États 
            ou organisations : détection de fermes à trolls, analyse de comportements coordonnés sur réseaux sociaux, 
            traçage de narratifs propagandistes, identification de fausses identités et comptes amplificateurs.
          </p>
        </div>

        <div style={{ 
          background: colors.bgPrimary, 
          border: `1px solid ${colors.border}`, 
          borderRadius: "8px", 
          padding: "20px",
          marginBottom: "15px"
        }}>
          <h3 style={{ color: colors.accent, marginBottom: "10px" }}>
            💼 Intelligence économique stratégique
          </h3>
          <p style={{ color: colors.textSecondary, lineHeight: "1.8" }}>
            Surveillance concurrentielle avancée, <strong>analyse de fusions-acquisitions</strong>, 
            détection de vulnérabilités dans les chaînes d'approvisionnement, identification de risques 
            géopolitiques affectant les marchés, traçage de flux financiers via sources ouvertes.
          </p>
        </div>

        <div style={{ 
          background: colors.bgPrimary, 
          border: `1px solid ${colors.border}`, 
          borderRadius: "8px", 
          padding: "20px"
        }}>
          <h3 style={{ color: colors.accent, marginBottom: "10px" }}>
            🛡️ Cybersécurité et threat intelligence
          </h3>
          <p style={{ color: colors.textSecondary, lineHeight: "1.8" }}>
            Traçage d'<strong>acteurs de menace APT</strong> (Advanced Persistent Threat), 
            analyse d'infrastructures malveillantes, identification de campagnes de phishing massives, 
            surveillance du dark web et des forums de hackers, profiling d'attaquants via leurs TTP 
            (Tactics, Techniques, Procedures).
          </p>
        </div>
      </section>

      <section style={{ marginBottom: "30px" }}>
        <h2 style={{ color: colors.accent, fontSize: "1.3rem", marginBottom: "15px" }}>
          Compétences stratégiques requises
        </h2>
        
        <div style={{
          background: colors.bgSecondary,
          border: `1px solid ${colors.border}`,
          borderRadius: "8px",
          padding: "20px"
        }}>
          <ul style={{ color: colors.textSecondary, lineHeight: "2", paddingLeft: "20px" }}>
            <li><strong>Pensée critique avancée</strong> : Capacité à déconstruire des narratifs complexes et identifier les manipulations</li>
            <li><strong>Connaissance géopolitique</strong> : Compréhension des enjeux internationaux, alliances, tensions régionales</li>
            <li><strong>Maîtrise linguistique</strong> : Capacité à consulter des sources en plusieurs langues (russe, arabe, chinois)</li>
            <li><strong>Analyse de réseaux sociaux</strong> : Compréhension des dynamiques virales, des algorithmes, des communautés en ligne</li>
            <li><strong>Forensics numériques</strong> : Analyse de métadonnées, vérification d'authenticité de contenus (photos/vidéos)</li>
            <li><strong>Communication stratégique</strong> : Rédaction de rapports exécutifs, briefings oraux, visualisations impactantes</li>
          </ul>
        </div>
      </section>

      <section style={{
        background: colors.bgSecondary,
        border: `1px solid ${colors.accent}`,
        borderRadius: "8px",
        padding: "20px",
        marginBottom: "30px"
      }}>
        <h3 style={{ color: colors.accent, marginBottom: "10px" }}>
          💡 Point clé
        </h3>
        <p style={{ color: colors.textSecondary, lineHeight: "1.8", margin: 0 }}>
          L'OSINT avancé transforme l'analyste en <strong>expert en renseignement stratégique</strong>. 
          Il ne s'agit plus de "chercher des informations", mais de <strong>comprendre l'environnement</strong>, 
          <strong>anticiper les évolutions</strong>, et <strong>éclairer les décisions</strong> avec du renseignement 
          fiable, contextualisé et exploitable. Vous passez du rôle de chercheur au rôle de <strong>conseiller stratégique</strong>.
        </p>
      </section>

      <button
        onClick={validate}
        style={{
          background: "#00ff9c",
          color: "#0b0f1a",
          border: "none",
          padding: "14px 40px",
          borderRadius: "8px",
          fontWeight: "bold",
          fontSize: "1.1rem",
          cursor: "pointer",
          marginTop: "24px",
          transition: "all 0.3s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.05)";
          e.currentTarget.style.boxShadow = "0 0 20px rgba(0, 255, 156, 0.5)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        ✓ Valider le module
      </button>

      {/* Modal de validation */}
      {showModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: colors.overlay,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
        }}>
          <div style={{
            background: colors.bgPrimary,
            border: `2px solid ${colors.accent}`,
            borderRadius: "12px",
            padding: "40px",
            maxWidth: "500px",
            textAlign: "center",
            boxShadow: `0 0 50px ${colors.accent}40`,
          }}>
            <div style={{
              fontSize: "4rem",
              marginBottom: "20px",
            }}>
              🏆
            </div>
            <h2 style={{ 
              color: colors.accent, 
              marginBottom: "15px",
              fontSize: "1.8rem"
            }}>
              Badge Débloqué !
            </h2>
            <p style={{ 
              color: colors.textSecondary, 
              fontSize: "1.2rem",
              marginBottom: "30px",
              lineHeight: "1.6"
            }}>
              <strong style={{ color: colors.accent }}>Introduction OSINT (Avancé)</strong> validée avec succès !
            </p>
            <p style={{ 
              color: colors.textSecondary, 
              marginBottom: "30px",
              lineHeight: "1.6"
            }}>
              Vous avez acquis une vision stratégique de l'OSINT. Continuez vers le module suivant 
              pour maîtriser le cycle de renseignement professionnel.
            </p>
            <button
              onClick={returnToParcours}
              style={{
                background: "#00ff9c",
                color: "#0b0f1a",
                border: "none",
                padding: "14px 40px",
                borderRadius: "8px",
                fontWeight: "bold",
                fontSize: "1.1rem",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              → Retour au parcours
            </button>
          </div>
        </div>
      )}
    </main>
  );
}


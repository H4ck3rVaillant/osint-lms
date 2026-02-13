import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ParcoursAvanceMethodologie() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const validate = () => {
    localStorage.setItem("badge_adv_methodo", "true");
    setShowModal(true);
  };

  const returnToDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <main style={{ maxWidth: "1000px", margin: "0 auto", padding: "40px" }}>
      <h1 style={{ color: "#00ff9c", marginBottom: "20px" }}>
        Méthodologie OSINT – Avancé
      </h1>

      <section style={{ marginBottom: "30px" }}>
        <h2 style={{ color: "#00ff9c", fontSize: "1.5rem", marginBottom: "15px" }}>
          Objectifs du module
        </h2>
        <p style={{ color: "#9ca3af", lineHeight: "1.8", marginBottom: "15px" }}>
          La méthodologie avancée s'inspire des <strong style={{ color: "#00ff9c" }}>cycles professionnels du renseignement</strong> 
          utilisés par les services de renseignement, les analystes en cybersécurité et les enquêteurs spécialisés. 
          Ce niveau requiert une maîtrise complète de la planification stratégique, de l'analyse multi-sources 
          et de la production de renseignement exploitable.
        </p>
      </section>

      <section style={{ 
        background: "#0b0f1a", 
        border: "1px solid #00ff9c", 
        borderRadius: "8px", 
        padding: "24px",
        marginBottom: "30px"
      }}>
        <h2 style={{ color: "#00ff9c", fontSize: "1.3rem", marginBottom: "15px" }}>
          Le cycle de renseignement professionnel
        </h2>
        <ul style={{ color: "#9ca3af", lineHeight: "2", paddingLeft: "20px" }}>
          <li>
            <strong style={{ color: "#00ff9c" }}>1. Planification stratégique</strong> : 
            Définition des besoins en renseignement (PIR - Priority Intelligence Requirements), 
            allocation des ressources et timeline opérationnelle
          </li>
          <li>
            <strong style={{ color: "#00ff9c" }}>2. Collecte massive multi-sources</strong> : 
            Exploitation simultanée de sources OSINT, HUMINT (Human Intelligence), TECHINT (Technical Intelligence), 
            SIGINT (Signals Intelligence) quand applicable
          </li>
          <li>
            <strong style={{ color: "#00ff9c" }}>3. Traitement et exploitation avancés</strong> : 
            Normalisation, déduplication, enrichissement automatisé via ML/AI, stockage sécurisé
          </li>
          <li>
            <strong style={{ color: "#00ff9c" }}>4. Analyse multi-niveaux</strong> : 
            Analyse tactique (faits immédiats), opérationnelle (patterns), stratégique (tendances long-terme)
          </li>
          <li>
            <strong style={{ color: "#00ff9c" }}>5. Production de livrables exécutifs</strong> : 
            Rapports adaptés à l'audience (technique, managérial, exécutif), avec recommandations actionnables
          </li>
          <li>
            <strong style={{ color: "#00ff9c" }}>6. Diffusion ciblée et feedback</strong> : 
            Distribution sécurisée selon le principe du "need-to-know", recueil de feedback pour amélioration continue
          </li>
        </ul>
      </section>

      <section style={{ marginBottom: "30px" }}>
        <h2 style={{ color: "#00ff9c", fontSize: "1.3rem", marginBottom: "15px" }}>
          Techniques expertes
        </h2>
        
        <div style={{ 
          background: "#0b0f1a", 
          border: "1px solid #2a3f3f", 
          borderRadius: "8px", 
          padding: "20px",
          marginBottom: "15px"
        }}>
          <h3 style={{ color: "#00ff9c", marginBottom: "10px" }}>
            🎭 Scénarisation et hypothèses complexes
          </h3>
          <p style={{ color: "#9ca3af", lineHeight: "1.8" }}>
            Construisez des <strong>scénarios multiples</strong> avec probabilités associées. 
            Utilisez l'<strong>analyse concurrente des hypothèses (ACH)</strong> pour évaluer objectivement 
            quelle hypothèse est la mieux supportée par les preuves disponibles. 
            Identifiez les <strong>indicateurs discriminants</strong> qui permettront de valider ou invalider chaque scénario.
          </p>
        </div>

        <div style={{ 
          background: "#0b0f1a", 
          border: "1px solid #2a3f3f", 
          borderRadius: "8px", 
          padding: "20px",
          marginBottom: "15px"
        }}>
          <h3 style={{ color: "#00ff9c", marginBottom: "10px" }}>
            🔗 Fusion OSINT / HUMINT / TECHINT
          </h3>
          <p style={{ color: "#9ca3af", lineHeight: "1.8" }}>
            Intégrez des sources de renseignement multiples : <strong>OSINT</strong> (sources ouvertes), 
            <strong>HUMINT</strong> (interviews, interrogations), <strong>TECHINT</strong> (analyse technique, 
            forensics, reverse engineering). La corrélation entre ces sources différentes produit du 
            <strong>renseignement de haute confiance</strong>.
          </p>
        </div>

        <div style={{ 
          background: "#0b0f1a", 
          border: "1px solid #2a3f3f", 
          borderRadius: "8px", 
          padding: "20px",
          marginBottom: "15px"
        }}>
          <h3 style={{ color: "#00ff9c", marginBottom: "10px" }}>
            ✅ Validation par corrélation forte
          </h3>
          <p style={{ color: "#9ca3af", lineHeight: "1.8" }}>
            Appliquez le <strong>modèle Admiralty</strong> pour évaluer la fiabilité (A-F pour la source, 1-6 pour l'information). 
            Exigez une <strong>corrélation forte</strong> : au moins 3 sources indépendantes de haute qualité (A1, A2, B1) 
            pour confirmer une information critique. Documentez les <strong>gaps de renseignement</strong> et 
            les zones d'incertitude.
          </p>
        </div>

        <div style={{ 
          background: "#0b0f1a", 
          border: "1px solid #2a3f3f", 
          borderRadius: "8px", 
          padding: "20px"
        }}>
          <h3 style={{ color: "#00ff9c", marginBottom: "10px" }}>
            📊 Production de livrables exécutifs
          </h3>
          <p style={{ color: "#9ca3af", lineHeight: "1.8" }}>
            Créez des rapports <strong>adaptés à l'audience</strong> : 
            Executive Summary (1 page, conclusions et recommandations), 
            Technical Analysis (détails techniques pour spécialistes), 
            Intelligence Assessment (évaluation des menaces et opportunités). 
            Utilisez des <strong>visualisations efficaces</strong> : timelines, cartes de relations, 
            heat maps, et indicateurs de confiance clairs.
          </p>
        </div>
      </section>

      <section style={{ marginBottom: "30px" }}>
        <h2 style={{ color: "#00ff9c", fontSize: "1.3rem", marginBottom: "15px" }}>
          Framework d'investigation avancée
        </h2>
        
        <div style={{ 
          background: "#1a1f2e", 
          border: "1px solid #2a3f3f", 
          borderRadius: "8px", 
          padding: "20px"
        }}>
          <ol style={{ color: "#9ca3af", lineHeight: "2", paddingLeft: "20px" }}>
            <li><strong>Intelligence Requirements</strong> : Définir les PIR (Priority Intelligence Requirements) et EEI (Essential Elements of Information)</li>
            <li><strong>Collection Plan</strong> : Mapper les sources disponibles (OSINT, HUMINT, TECHINT), prioriser, allouer ressources</li>
            <li><strong>Multi-source Collection</strong> : Collecte parallèle et coordonnée sur toutes les sources identifiées</li>
            <li><strong>Data Processing</strong> : ETL (Extract, Transform, Load), normalisation, enrichissement via APIs/ML</li>
            <li><strong>Analysis</strong> : Application de techniques d'analyse structurée (ACH, SWOT, PMESII-PT, Diamond Model)</li>
            <li><strong>Synthesis</strong> : Corrélation inter-sources, identification de patterns, détection d'anomalies</li>
            <li><strong>Validation</strong> : Red team review, peer review, stress-test des hypothèses</li>
            <li><strong>Production</strong> : Rédaction de livrables multi-niveaux avec recommandations graduées</li>
            <li><strong>Dissemination</strong> : Distribution sécurisée et tracking de l'utilisation du renseignement</li>
            <li><strong>Feedback Loop</strong> : Retour d'expérience, amélioration continue, mise à jour des procédures</li>
          </ol>
        </div>
      </section>

      <section style={{
        background: "#1a1f2e",
        border: "1px solid #00ff9c",
        borderRadius: "8px",
        padding: "20px",
        marginBottom: "30px"
      }}>
        <h3 style={{ color: "#00ff9c", marginBottom: "10px" }}>
          💡 Point clé
        </h3>
        <p style={{ color: "#9ca3af", lineHeight: "1.8", margin: 0 }}>
          La méthodologie avancée transforme l'analyste OSINT en <strong>professionnel du renseignement</strong>. 
          Elle exige rigueur scientifique, pensée critique, et capacité à produire du renseignement 
          <strong>actionnable, fiable et défendable</strong>. Le but n'est plus de trouver de l'information, 
          mais de <strong>réduire l'incertitude décisionnelle</strong> pour les décideurs.
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
          background: "rgba(0, 0, 0, 0.85)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
        }}>
          <div style={{
            background: "#0b0f1a",
            border: "2px solid #00ff9c",
            borderRadius: "12px",
            padding: "40px",
            maxWidth: "500px",
            textAlign: "center",
            boxShadow: "0 0 50px rgba(0, 255, 156, 0.3)",
          }}>
            <div style={{
              fontSize: "4rem",
              marginBottom: "20px",
            }}>
              🏆
            </div>
            <h2 style={{ 
              color: "#00ff9c", 
              marginBottom: "15px",
              fontSize: "1.8rem"
            }}>
              Badge Débloqué !
            </h2>
            <p style={{ 
              color: "#9ca3af", 
              fontSize: "1.2rem",
              marginBottom: "30px",
              lineHeight: "1.6"
            }}>
              <strong style={{ color: "#00ff9c" }}>Méthodologie OSINT (Avancé)</strong> validée avec succès !
            </p>
            <p style={{ 
              color: "#9ca3af", 
              marginBottom: "30px",
              lineHeight: "1.6"
            }}>
              Vous avez atteint le niveau expert en méthodologie de renseignement. 
              Vous êtes maintenant capable de mener des investigations complexes de niveau professionnel.
            </p>
            <button
              onClick={returnToDashboard}
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
              → Retour au dashboard
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

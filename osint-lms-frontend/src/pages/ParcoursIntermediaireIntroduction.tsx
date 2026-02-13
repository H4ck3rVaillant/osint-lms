import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ParcoursIntermediaireIntroduction() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const validate = () => {
    localStorage.setItem("badge_int_intro", "true");
    setShowModal(true);
  };

  const returnToParcours = () => {
    navigate("/parcours/intermediaire");
  };

  return (
    <main style={{ maxWidth: "1000px", margin: "0 auto", padding: "40px" }}>
      <h1 style={{ color: "#00ff9c", marginBottom: "20px" }}>
        Module 1: Introduction OSINT — Intermédiaire
      </h1>

      <section style={{ marginBottom: "30px" }}>
        <h2 style={{ color: "#00ff9c", fontSize: "1.5rem", marginBottom: "15px" }}>
          Objectifs du module
        </h2>
        <p style={{ color: "#9ca3af", lineHeight: "1.8", marginBottom: "15px" }}>
          À ce niveau intermédiaire, l'OSINT vise une information <strong style={{ color: "#00ff9c" }}>actionnable</strong> : 
          la fiabilité, le contexte, la temporalité et la gestion des biais deviennent des compétences centrales. 
          Vous apprendrez à transformer des données brutes en renseignement exploitable et vérifiable.
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
          Compétences développées
        </h2>
        <ul style={{ color: "#9ca3af", lineHeight: "2", paddingLeft: "20px" }}>
          <li>
            <strong style={{ color: "#00ff9c" }}>Différencier données, signaux et renseignement</strong> : 
            Comprendre la hiérarchie de l'information et identifier ce qui constitue un renseignement exploitable
          </li>
          <li>
            <strong style={{ color: "#00ff9c" }}>Identifier les biais cognitifs et fausses corrélations</strong> : 
            Reconnaître les pièges mentaux (biais de confirmation, effet de halo) qui altèrent l'analyse
          </li>
          <li>
            <strong style={{ color: "#00ff9c" }}>Évaluer la fraîcheur et la traçabilité des sources</strong> : 
            Analyser l'origine, la date de publication et la chaîne de diffusion des informations
          </li>
          <li>
            <strong style={{ color: "#00ff9c" }}>Documenter pour reproductibilité et audit</strong> : 
            Créer des traces vérifiables de vos recherches pour validation ultérieure
          </li>
        </ul>
      </section>

      <section style={{ marginBottom: "30px" }}>
        <h2 style={{ color: "#00ff9c", fontSize: "1.3rem", marginBottom: "15px" }}>
          Concepts clés
        </h2>
        
        <div style={{ 
          background: "#0b0f1a", 
          border: "1px solid #2a3f3f", 
          borderRadius: "8px", 
          padding: "20px",
          marginBottom: "15px"
        }}>
          <h3 style={{ color: "#00ff9c", marginBottom: "10px" }}>
            🎯 La pyramide de l'information
          </h3>
          <p style={{ color: "#9ca3af", lineHeight: "1.8" }}>
            <strong>Données brutes</strong> → <strong>Informations contextualisées</strong> → 
            <strong>Renseignement actionnable</strong>. Chaque niveau requiert analyse et vérification.
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
            🧠 Les biais cognitifs en OSINT
          </h3>
          <p style={{ color: "#9ca3af", lineHeight: "1.8" }}>
            <strong>Biais de confirmation</strong> : tendance à chercher uniquement ce qui confirme nos hypothèses. 
            <strong>Biais d'ancrage</strong> : surpondération de la première information reçue. 
            <strong>Effet de halo</strong> : jugement global basé sur une seule caractéristique.
          </p>
        </div>

        <div style={{ 
          background: "#0b0f1a", 
          border: "1px solid #2a3f3f", 
          borderRadius: "8px", 
          padding: "20px"
        }}>
          <h3 style={{ color: "#00ff9c", marginBottom: "10px" }}>
            📊 Scoring de fiabilité
          </h3>
          <p style={{ color: "#9ca3af", lineHeight: "1.8" }}>
            Utilisez une échelle de notation (A-F) pour évaluer : <strong>la crédibilité de la source</strong>, 
            <strong>la qualité de l'information</strong>, et <strong>le degré de confirmation</strong> par recoupement.
          </p>
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
          L'analyse OSINT intermédiaire ne consiste pas seulement à <em>trouver</em> l'information, 
          mais à <strong>valider sa pertinence, sa fiabilité et son utilité opérationnelle</strong>. 
          La qualité prime sur la quantité.
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
              <strong style={{ color: "#00ff9c" }}>Introduction OSINT (Intermédiaire)</strong> validée avec succès !
            </p>
            <p style={{ 
              color: "#9ca3af", 
              marginBottom: "30px",
              lineHeight: "1.6"
            }}>
              Vous avez acquis les fondamentaux de l'analyse critique et de l'évaluation des sources. 
              Continuez vers le module suivant pour approfondir la méthodologie OSINT.
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

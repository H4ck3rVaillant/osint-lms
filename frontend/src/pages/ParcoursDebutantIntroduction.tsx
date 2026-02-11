import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ParcoursDebutantIntroduction() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const validate = () => {
    localStorage.setItem("badge_deb_intro", "true");
    setShowModal(true);
  };

  const returnToParcours = () => {
    navigate("/parcours/debutant");
  };

  return (
    <main style={{ maxWidth: "1000px", margin: "0 auto", padding: "40px" }}>
      <h1 style={{ color: "#00ff9c", marginBottom: "20px" }}>
        Module 1: Introduction à l'OSINT
      </h1>

      <section style={{ marginBottom: "30px" }}>
        <h2 style={{ color: "#00ff9c", fontSize: "1.5rem", marginBottom: "15px" }}>
          Qu'est-ce que l'OSINT ?
        </h2>
        <p style={{ color: "#9ca3af", lineHeight: "1.8", marginBottom: "15px" }}>
          L'<strong style={{ color: "#00ff9c" }}>OSINT (Open Source Intelligence)</strong> désigne l'ensemble 
          des techniques permettant de collecter, analyser et exploiter des informations issues de 
          <strong> sources ouvertes et légalement accessibles</strong>. Ces sources incluent : sites web, 
          réseaux sociaux, bases de données publiques, médias, forums, documents officiels, etc.
        </p>
        <p style={{ color: "#9ca3af", lineHeight: "1.8", marginBottom: "15px" }}>
          Contrairement aux idées reçues, l'OSINT ne consiste pas à "pirater" ou accéder illégalement 
          à des informations. Il s'agit d'<strong>exploiter intelligemment l'information publique</strong> 
          pour produire du renseignement utile.
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
          Pourquoi l'OSINT est central aujourd'hui
        </h2>
        <ul style={{ color: "#9ca3af", lineHeight: "2", paddingLeft: "20px" }}>
          <li>
            <strong style={{ color: "#00ff9c" }}>Base de toute enquête cyber moderne</strong> : 
            Les professionnels de la cybersécurité utilisent l'OSINT pour identifier des vulnérabilités, 
            cartographier des infrastructures et anticiper les menaces
          </li>
          <li>
            <strong style={{ color: "#00ff9c" }}>Utilisé par les organisations de référence</strong> : 
            Bellingcat (investigations journalistiques), les CERT (équipes de réponse aux incidents), 
            les forces de l'ordre et les entreprises de renseignement
          </li>
          <li>
            <strong style={{ color: "#00ff9c" }}>Faible coût, impact stratégique élevé</strong> : 
            L'OSINT ne nécessite que peu d'investissement matériel mais peut révéler des informations 
            critiques pour la prise de décision
          </li>
          <li>
            <strong style={{ color: "#00ff9c" }}>Accessible à tous</strong> : 
            Avec de la méthode et de la rigueur, n'importe qui peut apprendre l'OSINT
          </li>
        </ul>
      </section>

      <section style={{ marginBottom: "30px" }}>
        <h2 style={{ color: "#00ff9c", fontSize: "1.3rem", marginBottom: "15px" }}>
          Domaines d'application
        </h2>
        
        <div style={{ 
          background: "#0b0f1a", 
          border: "1px solid #2a3f3f", 
          borderRadius: "8px", 
          padding: "20px",
          marginBottom: "15px"
        }}>
          <h3 style={{ color: "#00ff9c", marginBottom: "10px" }}>
            🛡️ Cybersécurité
          </h3>
          <p style={{ color: "#9ca3af", lineHeight: "1.8" }}>
            Reconnaissance d'infrastructures, identification d'actifs exposés, recherche de fuites de données, 
            surveillance de la surface d'attaque d'une organisation.
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
            📰 Journalisme d'investigation
          </h3>
          <p style={{ color: "#9ca3af", lineHeight: "1.8" }}>
            Vérification de faits, enquêtes sur des personnalités publiques, traçage de flux financiers, 
            analyse de réseaux d'influence.
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
            🔍 Due diligence et intelligence économique
          </h3>
          <p style={{ color: "#9ca3af", lineHeight: "1.8" }}>
            Vérification de partenaires commerciaux, surveillance concurrentielle, détection de fraudes, 
            évaluation de risques réputationnels.
          </p>
        </div>

        <div style={{ 
          background: "#0b0f1a", 
          border: "1px solid #2a3f3f", 
          borderRadius: "8px", 
          padding: "20px"
        }}>
          <h3 style={{ color: "#00ff9c", marginBottom: "10px" }}>
            ⚖️ Enquêtes légales et conformité
          </h3>
          <p style={{ color: "#9ca3af", lineHeight: "1.8" }}>
            Collecte de preuves numériques, investigations sur des fraudes, identification de témoins, 
            traçabilité de transactions.
          </p>
        </div>
      </section>

      <section style={{ marginBottom: "30px" }}>
        <h2 style={{ color: "#00ff9c", fontSize: "1.3rem", marginBottom: "15px" }}>
          Éthique et limites légales
        </h2>
        
        <div style={{
          background: "#1a1f2e",
          border: "1px solid #ff6b6b",
          borderRadius: "8px",
          padding: "20px",
          marginBottom: "15px"
        }}>
          <h3 style={{ color: "#ff6b6b", marginBottom: "10px" }}>
            ⚠️ Règles essentielles
          </h3>
          <ul style={{ color: "#9ca3af", lineHeight: "1.8", paddingLeft: "20px" }}>
            <li>Ne jamais accéder à des systèmes sans autorisation (c'est illégal)</li>
            <li>Ne pas utiliser de techniques de social engineering malveillantes</li>
            <li>Respecter la vie privée et le RGPD</li>
            <li>Ne pas diffuser d'informations sensibles sans justification</li>
            <li>Documenter toutes vos sources pour assurer la traçabilité</li>
          </ul>
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
          L'OSINT est une <strong>discipline accessible mais rigoureuse</strong>. Elle nécessite 
          de la curiosité, de la patience, et un respect strict de l'éthique et de la légalité. 
          Votre objectif : <strong>transformer l'information publique en renseignement exploitable</strong>.
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
              <strong style={{ color: "#00ff9c" }}>Introduction OSINT (Débutant)</strong> validée avec succès !
            </p>
            <p style={{ 
              color: "#9ca3af", 
              marginBottom: "30px",
              lineHeight: "1.6"
            }}>
              Vous avez acquis les fondamentaux de l'OSINT. Continuez vers le module suivant 
              pour apprendre la méthodologie structurée de recherche.
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

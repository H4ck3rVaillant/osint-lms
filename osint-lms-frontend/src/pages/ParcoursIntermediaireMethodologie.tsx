import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useThemeColors } from "../context/ThemeContext";

export default function ParcoursIntermediaireMethodologie() {
  const colors = useThemeColors();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const validate = () => {
    localStorage.setItem("badge_int_methodo", "true");
    setShowModal(true);
  };

  const returnToParcours = () => {
    navigate("/parcours/intermediaire");
  };

  return (
    <main style={{ maxWidth: "1000px", margin: "0 auto", padding: "40px" }}>
      <h1 style={{ color: colors.accent, marginBottom: "20px" }}>
        Module 2: Méthodologie OSINT — Intermédiaire
      </h1>

      <section style={{ marginBottom: "30px" }}>
        <h2 style={{ color: colors.accent, fontSize: "1.5rem", marginBottom: "15px" }}>
          Objectifs du module
        </h2>
        <p style={{ color: colors.textSecondary, lineHeight: "1.8", marginBottom: "15px" }}>
          Ce module vous introduit à une <strong style={{ color: colors.accent }}>méthode structurée</strong> inspirée 
          du cycle de renseignement professionnel. Vous apprendrez à planifier, collecter, analyser et documenter 
          vos recherches OSINT de manière systématique et reproductible.
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
          Le cycle de renseignement OSINT
        </h2>
        <ul style={{ color: colors.textSecondary, lineHeight: "2", paddingLeft: "20px" }}>
          <li>
            <strong style={{ color: colors.accent }}>1. Planification et orientation</strong> : 
            Définir des objectifs clairs, formuler des hypothèses testables et identifier les sources potentielles
          </li>
          <li>
            <strong style={{ color: colors.accent }}>2. Collecte orientée et pivoting intelligent</strong> : 
            Exploiter les informations découvertes pour rebondir vers de nouvelles pistes de recherche
          </li>
          <li>
            <strong style={{ color: colors.accent }}>3. Traitement et exploitation</strong> : 
            Organiser, filtrer et enrichir les données collectées pour en extraire le sens
          </li>
          <li>
            <strong style={{ color: colors.accent }}>4. Analyse et production</strong> : 
            Valider par recoupement, appliquer un scoring de fiabilité et produire du renseignement
          </li>
          <li>
            <strong style={{ color: colors.accent }}>5. Diffusion et archivage</strong> : 
            Documenter les conclusions et conserver les preuves pour audit ultérieur
          </li>
        </ul>
      </section>

      <section style={{ marginBottom: "30px" }}>
        <h2 style={{ color: colors.accent, fontSize: "1.3rem", marginBottom: "15px" }}>
          Techniques avancées
        </h2>
        
        <div style={{ 
          background: colors.bgPrimary, 
          border: `1px solid ${colors.border}`, 
          borderRadius: "8px", 
          padding: "20px",
          marginBottom: "15px"
        }}>
          <h3 style={{ color: colors.accent, marginBottom: "10px" }}>
            🎯 Hypothèses testables
          </h3>
          <p style={{ color: colors.textSecondary, lineHeight: "1.8" }}>
            Formulez des hypothèses <strong>vérifiables</strong> et <strong>réfutables</strong>. 
            Exemple : "Le compte X est lié à l'organisation Y" plutôt que "Trouvez tout sur X". 
            Définissez les critères qui valideraient ou invalideraient votre hypothèse.
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
            🔄 Pivoting intelligent
          </h3>
          <p style={{ color: colors.textSecondary, lineHeight: "1.8" }}>
            Utilisez chaque information découverte comme <strong>point de pivot</strong> pour élargir votre recherche : 
            un email révèle un domaine, un domaine révèle une infrastructure, une infrastructure révèle d'autres entités. 
            Cartographiez ces connexions méthodiquement.
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
            ✅ Validation croisée
          </h3>
          <p style={{ color: colors.textSecondary, lineHeight: "1.8" }}>
            <strong>Triangulation des sources</strong> : Une information n'est fiable que si elle est confirmée 
            par au moins deux sources indépendantes. Documentez le niveau de confiance de chaque élément : 
            Confirmé / Probable / Possible / Non vérifié.
          </p>
        </div>

        <div style={{ 
          background: colors.bgPrimary, 
          border: `1px solid ${colors.border}`, 
          borderRadius: "8px", 
          padding: "20px"
        }}>
          <h3 style={{ color: colors.accent, marginBottom: "10px" }}>
            📝 Journal d'enquête
          </h3>
          <p style={{ color: colors.textSecondary, lineHeight: "1.8" }}>
            Tenez un <strong>journal de recherche détaillé</strong> incluant : horodatage, sources consultées, 
            requêtes effectuées, résultats obtenus, et décisions prises. Cela garantit la reproductibilité 
            et facilite l'audit de votre démarche.
          </p>
        </div>
      </section>

      <section style={{ marginBottom: "30px" }}>
        <h2 style={{ color: colors.accent, fontSize: "1.3rem", marginBottom: "15px" }}>
          Exemple de workflow méthodologique
        </h2>
        
        <div style={{ 
          background: colors.bgSecondary, 
          border: `1px solid ${colors.border}`, 
          borderRadius: "8px", 
          padding: "20px"
        }}>
          <ol style={{ color: colors.textSecondary, lineHeight: "2", paddingLeft: "20px" }}>
            <li><strong>Briefing</strong> : Objectif = Identifier les sites web associés à l'entité X</li>
            <li><strong>Hypothèse</strong> : L'entité X possède des domaines enregistrés entre 2020-2024</li>
            <li><strong>Collecte</strong> : WHOIS, DNS, Google Dorks, recherche par email/nom</li>
            <li><strong>Pivoting</strong> : Email trouvé → autres domaines du même registrant</li>
            <li><strong>Validation</strong> : Recoupement IP, serveurs, contenus similaires</li>
            <li><strong>Documentation</strong> : Horodatage, captures d'écran, exports JSON</li>
            <li><strong>Production</strong> : Rapport avec niveau de confiance par information</li>
          </ol>
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
          Une méthodologie rigoureuse transforme une simple recherche en <strong>investigation structurée</strong>. 
          Elle permet de <strong>justifier vos conclusions</strong>, de <strong>détecter vos angles morts</strong>, 
          et d'assurer que votre analyse peut être <strong>reproduite et vérifiée</strong> par d'autres.
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
              <strong style={{ color: colors.accent }}>Méthodologie OSINT (Intermédiaire)</strong> validée avec succès !
            </p>
            <p style={{ 
              color: colors.textSecondary, 
              marginBottom: "30px",
              lineHeight: "1.6"
            }}>
              Vous maîtrisez désormais le cycle de renseignement et les techniques de validation croisée. 
              Passez au dernier module pour découvrir les outils avancés !
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


import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useThemeColors } from "../context/ThemeContext";

export default function ParcoursDebutantMethodologie() {
  const colors = useThemeColors();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  if (localStorage.getItem("badge_deb_intro") !== "true") {
    return <Navigate to="/parcours/debutant" replace />;
  }

  const validate = () => {
    localStorage.setItem("badge_deb_methodo", "true");
    setShowModal(true);
  };

  const returnToParcours = () => {
    navigate("/parcours/debutant");
  };

  return (
    <main style={{ maxWidth: "1000px", margin: "0 auto", padding: "40px" }}>
      <h1 style={{ color: colors.accent, marginBottom: "20px" }}>
        Module 2: Méthodologie OSINT
      </h1>

      <section style={{ marginBottom: "30px" }}>
        <h2 style={{ color: colors.accent, fontSize: "1.5rem", marginBottom: "15px" }}>
          L'importance d'une méthode structurée
        </h2>
        <p style={{ color: colors.textSecondary, lineHeight: "1.8", marginBottom: "15px" }}>
          Une enquête OSINT professionnelle ne repose pas sur le hasard ou l'improvisation. 
          Elle suit une <strong style={{ color: colors.accent }}>méthodologie rigoureuse</strong> qui garantit 
          la pertinence, la fiabilité et la reproductibilité des résultats.
        </p>
        <p style={{ color: colors.textSecondary, lineHeight: "1.8", marginBottom: "15px" }}>
          Sans méthode, vous risquez de : perdre du temps sur des pistes non pertinentes, 
          manquer des informations critiques, ou produire des conclusions erronées.
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
          Les 6 étapes de la méthodologie OSINT
        </h2>
        <div style={{ color: colors.textSecondary, lineHeight: "2" }}>
          <div style={{ 
            background: colors.bgSecondary, 
            border: `1px solid ${colors.border}`, 
            borderRadius: "8px", 
            padding: "20px",
            marginBottom: "15px"
          }}>
            <h3 style={{ color: colors.accent, marginBottom: "10px" }}>
              1️⃣ Cadrage
            </h3>
            <p style={{ lineHeight: "1.8" }}>
              <strong>Définir clairement l'objectif</strong> de votre recherche. Que cherchez-vous exactement ? 
              Quelle question voulez-vous répondre ? Quel est le périmètre de votre investigation ?
            </p>
            <p style={{ lineHeight: "1.8", marginTop: "10px" }}>
              <em>Exemple :</em> "Identifier les domaines web associés à l'entreprise X" plutôt que "Trouver des infos sur X"
            </p>
          </div>

          <div style={{ 
            background: colors.bgSecondary, 
            border: `1px solid ${colors.border}`, 
            borderRadius: "8px", 
            padding: "20px",
            marginBottom: "15px"
          }}>
            <h3 style={{ color: colors.accent, marginBottom: "10px" }}>
              2️⃣ Hypothèses
            </h3>
            <p style={{ lineHeight: "1.8" }}>
              <strong>Formuler des hypothèses de travail</strong> que vous allez chercher à valider ou invalider. 
              Les hypothèses guident votre recherche et vous évitent de partir dans toutes les directions.
            </p>
            <p style={{ lineHeight: "1.8", marginTop: "10px" }}>
              <em>Exemple :</em> "Le domaine Y appartient à l'entreprise X car le WHOIS mentionne le même email"
            </p>
          </div>

          <div style={{ 
            background: colors.bgSecondary, 
            border: `1px solid ${colors.border}`, 
            borderRadius: "8px", 
            padding: "20px",
            marginBottom: "15px"
          }}>
            <h3 style={{ color: colors.accent, marginBottom: "10px" }}>
              3️⃣ Collecte
            </h3>
            <p style={{ lineHeight: "1.8" }}>
              <strong>Rassembler les informations</strong> de manière systématique en utilisant les outils 
              et sources appropriés. Documentez chaque source et chaque information collectée.
            </p>
            <p style={{ lineHeight: "1.8", marginTop: "10px" }}>
              <em>Sources :</em> Moteurs de recherche, réseaux sociaux, bases de données publiques, WHOIS, DNS, etc.
            </p>
          </div>

          <div style={{ 
            background: colors.bgSecondary, 
            border: `1px solid ${colors.border}`, 
            borderRadius: "8px", 
            padding: "20px",
            marginBottom: "15px"
          }}>
            <h3 style={{ color: colors.accent, marginBottom: "10px" }}>
              4️⃣ Recoupement
            </h3>
            <p style={{ lineHeight: "1.8" }}>
              <strong>Vérifier la cohérence</strong> des informations en les croisant avec d'autres sources. 
              Une information n'est fiable que si elle est confirmée par au moins 2-3 sources indépendantes.
            </p>
            <p style={{ lineHeight: "1.8", marginTop: "10px" }}>
              <em>Attention :</em> Ne vous fiez jamais à une source unique, même si elle semble crédible.
            </p>
          </div>

          <div style={{ 
            background: colors.bgSecondary, 
            border: `1px solid ${colors.border}`, 
            borderRadius: "8px", 
            padding: "20px",
            marginBottom: "15px"
          }}>
            <h3 style={{ color: colors.accent, marginBottom: "10px" }}>
              5️⃣ Analyse
            </h3>
            <p style={{ lineHeight: "1.8" }}>
              <strong>Interpréter les données collectées</strong> pour en extraire du sens. 
              Identifiez les patterns, les connexions, les incohérences. 
              Évaluez la qualité et la fiabilité de chaque information.
            </p>
            <p style={{ lineHeight: "1.8", marginTop: "10px" }}>
              <em>Questions :</em> Que révèlent ces données ? Quelles conclusions peut-on en tirer ?
            </p>
          </div>

          <div style={{ 
            background: colors.bgSecondary, 
            border: `1px solid ${colors.border}`, 
            borderRadius: "8px", 
            padding: "20px"
          }}>
            <h3 style={{ color: colors.accent, marginBottom: "10px" }}>
              6️⃣ Restitution
            </h3>
            <p style={{ lineHeight: "1.8" }}>
              <strong>Présenter vos conclusions</strong> de manière claire et structurée. 
              Un bon rapport OSINT inclut : le contexte, la méthodologie, les sources, 
              les résultats, et les recommandations.
            </p>
            <p style={{ lineHeight: "1.8", marginTop: "10px" }}>
              <em>Format :</em> Rapport écrit, timeline, carte mentale, graphe de relations, etc.
            </p>
          </div>
        </div>
      </section>

      <section style={{ marginBottom: "30px" }}>
        <h2 style={{ color: colors.accent, fontSize: "1.3rem", marginBottom: "15px" }}>
          Exemple pratique
        </h2>
        
        <div style={{ 
          background: colors.bgSecondary, 
          border: `1px solid ${colors.border}`, 
          borderRadius: "8px", 
          padding: "20px"
        }}>
          <p style={{ color: colors.textSecondary, lineHeight: "1.8", marginBottom: "15px" }}>
            <strong style={{ color: colors.accent }}>Objectif :</strong> Identifier les comptes réseaux sociaux d'un individu
          </p>
          <ol style={{ color: colors.textSecondary, lineHeight: "2", paddingLeft: "20px" }}>
            <li><strong>Cadrage :</strong> Rechercher tous les profils publics de la personne sur les principaux réseaux sociaux</li>
            <li><strong>Hypothèses :</strong> La personne utilise probablement le même pseudonyme sur plusieurs plateformes</li>
            <li><strong>Collecte :</strong> Rechercher sur Google, Twitter, LinkedIn, Facebook, Instagram avec différentes requêtes</li>
            <li><strong>Recoupement :</strong> Vérifier que les profils trouvés correspondent bien à la même personne (photo, bio, localisation)</li>
            <li><strong>Analyse :</strong> Cartographier tous les comptes trouvés et leurs interconnexions</li>
            <li><strong>Restitution :</strong> Produire une liste avec URLs, dates de création, activité récente</li>
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
          La méthodologie est la <strong>colonne vertébrale</strong> de toute investigation OSINT réussie. 
          Elle vous permet de travailler de manière <strong>structurée, efficace et reproductible</strong>. 
          Plus vous pratiquez, plus ces étapes deviendront naturelles.
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
              <strong style={{ color: colors.accent }}>Méthodologie OSINT (Débutant)</strong> validée avec succès !
            </p>
            <p style={{ 
              color: colors.textSecondary, 
              marginBottom: "30px",
              lineHeight: "1.6"
            }}>
              Vous maîtrisez maintenant les 6 étapes essentielles de la méthodologie OSINT. 
              Passez au dernier module pour découvrir les outils incontournables !
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


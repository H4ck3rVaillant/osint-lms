import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useThemeColors } from "../context/ThemeContext";

export default function ParcoursDebutantOutils() {
  const colors = useThemeColors();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const ok =
    localStorage.getItem("badge_deb_intro") === "true" &&
    localStorage.getItem("badge_deb_methodo") === "true";

  if (!ok) return <Navigate to="/parcours/debutant" replace />;

  const validate = () => {
    localStorage.setItem("badge_deb_outils", "true");
    setShowModal(true);
  };

  const returnToParcours = () => {
    navigate("/parcours/debutant");
  };

  return (
    <main style={{ maxWidth: "1000px", margin: "0 auto", padding: "40px" }}>
      <h1 style={{ color: colors.accent, marginBottom: "20px" }}>
        Module 3: Outils OSINT
      </h1>

      <section style={{ marginBottom: "30px" }}>
        <h2 style={{ color: colors.accent, fontSize: "1.5rem", marginBottom: "15px" }}>
          Les outils essentiels pour débuter
        </h2>
        <p style={{ color: colors.textSecondary, lineHeight: "1.8", marginBottom: "15px" }}>
          Pour mener des investigations OSINT efficaces, il est essentiel de maîtriser les 
          <strong style={{ color: colors.accent }}> outils fondamentaux</strong> qui vous permettront 
          d'automatiser vos recherches, de collecter des données structurées et de visualiser 
          des relations complexes.
        </p>
      </section>

      <section style={{ marginBottom: "30px" }}>
        <h2 style={{ color: colors.accent, fontSize: "1.3rem", marginBottom: "15px" }}>
          Outils incontournables
        </h2>
        
        <div style={{ 
          background: colors.bgPrimary, 
          border: `1px solid ${colors.accent}`, 
          borderRadius: "8px", 
          padding: "24px",
          marginBottom: "15px"
        }}>
          <h3 style={{ color: colors.accent, marginBottom: "12px", fontSize: "1.2rem" }}>
            🔍 Google Dorks — Recherche avancée
          </h3>
          <p style={{ color: colors.textSecondary, lineHeight: "1.8", marginBottom: "12px" }}>
            Les <strong>Google Dorks</strong> sont des opérateurs de recherche avancée qui permettent 
            d'affiner vos requêtes Google pour trouver des informations précises que vous ne trouveriez 
            pas avec une recherche classique.
          </p>
          <div style={{ 
            background: colors.bgSecondary, 
            border: `1px solid ${colors.border}`, 
            borderRadius: "6px", 
            padding: "15px",
            marginTop: "12px"
          }}>
            <p style={{ color: colors.accent, fontWeight: "bold", marginBottom: "8px" }}>
              Exemples d'opérateurs :
            </p>
            <ul style={{ color: colors.textSecondary, lineHeight: "1.8", paddingLeft: "20px" }}>
              <li><code style={{ background: colors.bgPrimary, padding: "2px 6px", borderRadius: "3px", color: colors.accent }}>site:</code> — Rechercher sur un site spécifique : <code style={{ background: colors.bgPrimary, padding: "2px 6px", borderRadius: "3px" }}>site:example.com login</code></li>
              <li><code style={{ background: colors.bgPrimary, padding: "2px 6px", borderRadius: "3px", color: colors.accent }}>filetype:</code> — Rechercher un type de fichier : <code style={{ background: colors.bgPrimary, padding: "2px 6px", borderRadius: "3px" }}>filetype:pdf cybersecurity</code></li>
              <li><code style={{ background: colors.bgPrimary, padding: "2px 6px", borderRadius: "3px", color: colors.accent }}>intitle:</code> — Rechercher dans le titre : <code style={{ background: colors.bgPrimary, padding: "2px 6px", borderRadius: "3px" }}>intitle:"index of" passwords</code></li>
              <li><code style={{ background: colors.bgPrimary, padding: "2px 6px", borderRadius: "3px", color: colors.accent }}>inurl:</code> — Rechercher dans l'URL : <code style={{ background: colors.bgPrimary, padding: "2px 6px", borderRadius: "3px" }}>inurl:admin</code></li>
              <li><code style={{ background: colors.bgPrimary, padding: "2px 6px", borderRadius: "3px", color: colors.accent }}>cache:</code> — Voir la version en cache : <code style={{ background: colors.bgPrimary, padding: "2px 6px", borderRadius: "3px" }}>cache:example.com</code></li>
            </ul>
          </div>
        </div>

        <div style={{ 
          background: colors.bgPrimary, 
          border: `1px solid ${colors.accent}`, 
          borderRadius: "8px", 
          padding: "24px",
          marginBottom: "15px"
        }}>
          <h3 style={{ color: colors.accent, marginBottom: "12px", fontSize: "1.2rem" }}>
            🌐 Shodan — Le moteur de recherche de l'IoT
          </h3>
          <p style={{ color: colors.textSecondary, lineHeight: "1.8", marginBottom: "12px" }}>
            <strong>Shodan</strong> est le moteur de recherche pour les appareils connectés à Internet. 
            Contrairement à Google qui indexe des sites web, Shodan scanne les ports ouverts, 
            les serveurs exposés, les caméras IP, les routeurs, etc.
          </p>
          <div style={{ 
            background: colors.bgSecondary, 
            border: `1px solid ${colors.border}`, 
            borderRadius: "6px", 
            padding: "15px",
            marginTop: "12px"
          }}>
            <p style={{ color: colors.accent, fontWeight: "bold", marginBottom: "8px" }}>
              Cas d'usage :
            </p>
            <ul style={{ color: colors.textSecondary, lineHeight: "1.8", paddingLeft: "20px" }}>
              <li>Identifier les serveurs d'une organisation</li>
              <li>Détecter des équipements mal configurés</li>
              <li>Rechercher des vulnérabilités connues (CVE)</li>
              <li>Cartographier une infrastructure réseau</li>
            </ul>
            <p style={{ color: colors.textSecondary, lineHeight: "1.8", marginTop: "12px" }}>
              <em>Exemple de requête :</em> <code style={{ background: colors.bgPrimary, padding: "2px 6px", borderRadius: "3px" }}>apache country:FR</code>
            </p>
          </div>
        </div>

        <div style={{ 
          background: colors.bgPrimary, 
          border: `1px solid ${colors.accent}`, 
          borderRadius: "8px", 
          padding: "24px",
          marginBottom: "15px"
        }}>
          <h3 style={{ color: colors.accent, marginBottom: "12px", fontSize: "1.2rem" }}>
            🔎 Sherlock — Recherche de pseudonymes
          </h3>
          <p style={{ color: colors.textSecondary, lineHeight: "1.8", marginBottom: "12px" }}>
            <strong>Sherlock</strong> est un outil en ligne de commande qui permet de rechercher 
            un pseudonyme sur plus de 300 plateformes simultanément (réseaux sociaux, forums, sites de partage).
          </p>
          <div style={{ 
            background: colors.bgSecondary, 
            border: `1px solid ${colors.border}`, 
            borderRadius: "6px", 
            padding: "15px",
            marginTop: "12px"
          }}>
            <p style={{ color: colors.accent, fontWeight: "bold", marginBottom: "8px" }}>
              Installation et utilisation :
            </p>
            <pre style={{ 
              background: colors.bgPrimary, 
              padding: "12px", 
              borderRadius: "6px", 
              color: colors.accent,
              overflowX: "auto"
            }}>
{`# Installation
pip install sherlock-project

# Recherche d'un pseudonyme
sherlock username123`}
            </pre>
            <p style={{ color: colors.textSecondary, lineHeight: "1.8", marginTop: "12px" }}>
              Sherlock génère un rapport avec tous les profils trouvés et leurs URLs.
            </p>
          </div>
        </div>

        <div style={{ 
          background: colors.bgPrimary, 
          border: `1px solid ${colors.accent}`, 
          borderRadius: "8px", 
          padding: "24px"
        }}>
          <h3 style={{ color: colors.accent, marginBottom: "12px", fontSize: "1.2rem" }}>
            🕸️ Maltego — Visualisation de relations
          </h3>
          <p style={{ color: colors.textSecondary, lineHeight: "1.8", marginBottom: "12px" }}>
            <strong>Maltego</strong> est un outil de visualisation graphique qui permet de représenter 
            des relations entre différentes entités (personnes, domaines, emails, IP, organisations).
          </p>
          <div style={{ 
            background: colors.bgSecondary, 
            border: `1px solid ${colors.border}`, 
            borderRadius: "6px", 
            padding: "15px",
            marginTop: "12px"
          }}>
            <p style={{ color: colors.accent, fontWeight: "bold", marginBottom: "8px" }}>
              Fonctionnalités principales :
            </p>
            <ul style={{ color: colors.textSecondary, lineHeight: "1.8", paddingLeft: "20px" }}>
              <li><strong>Graphes d'entités :</strong> Visualisez les connexions entre différents éléments</li>
              <li><strong>Transformations automatiques :</strong> Enrichissez vos données via des APIs</li>
              <li><strong>Import/Export :</strong> Exportez vos graphes en images ou documents</li>
              <li><strong>Version gratuite :</strong> Maltego CE (Community Edition) disponible gratuitement</li>
            </ul>
            <p style={{ color: colors.textSecondary, lineHeight: "1.8", marginTop: "12px" }}>
              <em>Exemple :</em> À partir d'un email, découvrez les domaines associés, les comptes sociaux liés, etc.
            </p>
          </div>
        </div>
      </section>

      <section style={{ marginBottom: "30px" }}>
        <h2 style={{ color: colors.accent, fontSize: "1.3rem", marginBottom: "15px" }}>
          Autres ressources utiles
        </h2>
        
        <div style={{ 
          background: colors.bgSecondary, 
          border: `1px solid ${colors.border}`, 
          borderRadius: "8px", 
          padding: "20px"
        }}>
          <ul style={{ color: colors.textSecondary, lineHeight: "2", paddingLeft: "20px" }}>
            <li><strong>Have I Been Pwned</strong> : Vérifier si un email a été compromis dans une fuite de données</li>
            <li><strong>Wayback Machine</strong> : Consulter l'historique d'un site web</li>
            <li><strong>WHOIS Lookup</strong> : Obtenir des informations sur le propriétaire d'un domaine</li>
            <li><strong>DNSDumpster</strong> : Explorer les enregistrements DNS d'un domaine</li>
            <li><strong>TinEye / Google Images</strong> : Recherche d'images inversée</li>
            <li><strong>Recon-ng</strong> : Framework de reconnaissance modulaire (avancé)</li>
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
          Les outils OSINT sont des <strong>multiplicateurs de force</strong>, mais ils ne remplacent 
          pas la méthodologie. Apprenez d'abord à <strong>chercher manuellement</strong>, puis utilisez 
          les outils pour <strong>automatiser et accélérer</strong> vos recherches. 
          La clé du succès : <strong>comprendre ce que font les outils</strong> plutôt que de les utiliser en aveugle.
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
              <strong style={{ color: colors.accent }}>Outils OSINT (Débutant)</strong> validé avec succès !
            </p>
            <p style={{ 
              color: colors.textSecondary, 
              marginBottom: "30px",
              lineHeight: "1.6"
            }}>
              Félicitations ! Vous avez complété l'ensemble du parcours débutant. 
              Vous maîtrisez maintenant les bases de l'OSINT. 
              Prêt pour le niveau intermédiaire ?
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


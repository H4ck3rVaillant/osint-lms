import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ParcoursIntermediaireOutils() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const validate = () => {
    localStorage.setItem("badge_int_outils", "true");
    setShowModal(true);
  };

  const returnToParcours = () => {
    navigate("/parcours/intermediaire");
  };

  return (
    <main style={{ maxWidth: "1000px", margin: "0 auto", padding: "40px" }}>
      <h1 style={{ color: "#00ff9c", marginBottom: "20px" }}>
        Module 3: Outils OSINT — Intermédiaire
      </h1>

      <section style={{ marginBottom: "30px" }}>
        <h2 style={{ color: "#00ff9c", fontSize: "1.5rem", marginBottom: "15px" }}>
          Objectifs du module
        </h2>
        <p style={{ color: "#9ca3af", lineHeight: "1.8", marginBottom: "15px" }}>
          Maîtrisez les <strong style={{ color: "#00ff9c" }}>outils avancés</strong> qui automatisent, 
          visualisent et enrichissent vos recherches OSINT. Ces plateformes professionnelles vous permettront 
          de gérer des investigations complexes avec efficacité et précision.
        </p>
      </section>

      <section style={{ marginBottom: "30px" }}>
        <h2 style={{ color: "#00ff9c", fontSize: "1.3rem", marginBottom: "15px" }}>
          Outils professionnels
        </h2>
        
        <div style={{ 
          background: "#0b0f1a", 
          border: "1px solid #00ff9c", 
          borderRadius: "8px", 
          padding: "24px",
          marginBottom: "15px"
        }}>
          <h3 style={{ color: "#00ff9c", marginBottom: "12px", fontSize: "1.2rem" }}>
            🕸️ Maltego : Graphes relationnels et enrichissement
          </h3>
          <p style={{ color: "#9ca3af", lineHeight: "1.8", marginBottom: "12px" }}>
            Maltego est la référence pour la <strong>visualisation de relations complexes</strong>. 
            Cet outil permet de créer des graphes d'entités (personnes, domaines, IP, emails) et 
            d'automatiser l'enrichissement via des transformations.
          </p>
          <ul style={{ color: "#9ca3af", lineHeight: "1.8", paddingLeft: "20px" }}>
            <li><strong>Entités et transformations</strong> : Ajoutez des nœuds et explorez automatiquement leurs connexions</li>
            <li><strong>Graphes d'investigation</strong> : Visualisez les liens entre cibles, infrastructures et personnes</li>
            <li><strong>Intégration d'APIs</strong> : Shodan, VirusTotal, PassiveTotal, Have I Been Pwned, etc.</li>
            <li><strong>Export de rapports</strong> : Générez des documents professionnels avec vos graphes</li>
          </ul>
        </div>

        <div style={{ 
          background: "#0b0f1a", 
          border: "1px solid #00ff9c", 
          borderRadius: "8px", 
          padding: "24px",
          marginBottom: "15px"
        }}>
          <h3 style={{ color: "#00ff9c", marginBottom: "12px", fontSize: "1.2rem" }}>
            🕷️ SpiderFoot : Automatisation multi-sources
          </h3>
          <p style={{ color: "#9ca3af", lineHeight: "1.8", marginBottom: "12px" }}>
            SpiderFoot est un outil d'<strong>automatisation OSINT</strong> qui interroge simultanément 
            des dizaines de sources pour collecter des informations sur une cible.
          </p>
          <ul style={{ color: "#9ca3af", lineHeight: "1.8", paddingLeft: "20px" }}>
            <li><strong>Scans automatisés</strong> : Lancez des reconnaissances complètes en un clic</li>
            <li><strong>200+ modules</strong> : DNS, WHOIS, réseaux sociaux, fuites de données, dark web</li>
            <li><strong>Corrélation de données</strong> : Identifiez les patterns et connexions entre sources</li>
            <li><strong>Interface web</strong> : Visualisation claire des résultats et exports JSON/CSV</li>
          </ul>
        </div>

        <div style={{ 
          background: "#0b0f1a", 
          border: "1px solid #00ff9c", 
          borderRadius: "8px", 
          padding: "24px",
          marginBottom: "15px"
        }}>
          <h3 style={{ color: "#00ff9c", marginBottom: "12px", fontSize: "1.2rem" }}>
            🔍 Shodan avancé : Filtres, historique, API
          </h3>
          <p style={{ color: "#9ca3af", lineHeight: "1.8", marginBottom: "12px" }}>
            Shodan est le <strong>moteur de recherche de l'Internet des objets</strong>. 
            Niveau intermédiaire : maîtrisez les filtres avancés et l'automatisation via API.
          </p>
          <ul style={{ color: "#9ca3af", lineHeight: "1.8", paddingLeft: "20px" }}>
            <li><strong>Filtres avancés</strong> : <code style={{ background: "#1a1f2e", padding: "2px 6px", borderRadius: "3px" }}>org:"Target" port:443</code>, <code style={{ background: "#1a1f2e", padding: "2px 6px", borderRadius: "3px" }}>country:FR product:Apache</code></li>
            <li><strong>Historique des données</strong> : Suivez l'évolution des infrastructures dans le temps</li>
            <li><strong>API REST</strong> : Automatisez vos recherches et intégrez Shodan dans vos workflows</li>
            <li><strong>Shodan Monitor</strong> : Surveillez vos assets en temps réel et recevez des alertes</li>
          </ul>
        </div>

        <div style={{ 
          background: "#0b0f1a", 
          border: "1px solid #00ff9c", 
          borderRadius: "8px", 
          padding: "24px"
        }}>
          <h3 style={{ color: "#00ff9c", marginBottom: "12px", fontSize: "1.2rem" }}>
            🗄️ Archivage et preuves horodatées
          </h3>
          <p style={{ color: "#9ca3af", lineHeight: "1.8", marginBottom: "12px" }}>
            L'<strong>archivage systématique</strong> est essentiel pour la crédibilité de vos investigations. 
            Conservez des preuves vérifiables et horodatées.
          </p>
          <ul style={{ color: "#9ca3af", lineHeight: "1.8", paddingLeft: "20px" }}>
            <li><strong>Wayback Machine</strong> : Consultez l'historique des sites web (archive.org)</li>
            <li><strong>Archive.today</strong> : Créez des captures horodatées de pages web</li>
            <li><strong>Hunchly</strong> : Outil pro pour capturer et organiser automatiquement vos recherches</li>
            <li><strong>Screenshots + hash</strong> : Capturez et calculez les hash (SHA-256) pour prouver l'intégrité</li>
            <li><strong>Metadata preservation</strong> : Conservez les EXIF, timestamps, headers HTTP</li>
          </ul>
        </div>
      </section>

      <section style={{ marginBottom: "30px" }}>
        <h2 style={{ color: "#00ff9c", fontSize: "1.3rem", marginBottom: "15px" }}>
          Workflow d'investigation avec outils
        </h2>
        
        <div style={{ 
          background: "#1a1f2e", 
          border: "1px solid #2a3f3f", 
          borderRadius: "8px", 
          padding: "20px"
        }}>
          <ol style={{ color: "#9ca3af", lineHeight: "2", paddingLeft: "20px" }}>
            <li><strong>Reconnaissance initiale</strong> : SpiderFoot pour collecter automatiquement les premières données</li>
            <li><strong>Enrichissement</strong> : Maltego pour visualiser les connexions et pivoter vers de nouvelles entités</li>
            <li><strong>Infrastructure</strong> : Shodan pour identifier les serveurs, services et vulnérabilités</li>
            <li><strong>Validation temporelle</strong> : Wayback Machine pour vérifier l'historique et détecter les changements</li>
            <li><strong>Archivage</strong> : Archive.today + screenshots pour conserver les preuves</li>
            <li><strong>Documentation</strong> : Export des graphes, logs API, et rapport final</li>
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
          Les outils OSINT avancés ne remplacent pas la méthodologie, ils l'<strong>amplifient</strong>. 
          Automatisez les tâches répétitives, mais gardez toujours un <strong>œil critique</strong> sur les résultats. 
          La validation humaine reste indispensable : les outils fournissent des données, 
          c'est à vous d'en faire du renseignement.
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
              <strong style={{ color: "#00ff9c" }}>Outils OSINT (Intermédiaire)</strong> validé avec succès !
            </p>
            <p style={{ 
              color: "#9ca3af", 
              marginBottom: "30px",
              lineHeight: "1.6"
            }}>
              Félicitations ! Vous avez complété l'ensemble du parcours intermédiaire. 
              Vous maîtrisez maintenant les fondamentaux, la méthodologie et les outils professionnels de l'OSINT. 
              Prêt pour le niveau avancé ?
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

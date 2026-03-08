import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useThemeColors } from "../context/ThemeContext";

export default function ParcoursAvanceOutils() {
  const colors = useThemeColors();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const validate = () => {
    localStorage.setItem("badge_adv_outils", "true");
    setShowModal(true);
  };

  const returnToParcours = () => {
    navigate("/parcours/avance");
  };

  return (
    <main style={{ maxWidth: "1000px", margin: "0 auto", padding: "40px" }}>
      <h1 style={{ color: colors.accent, marginBottom: "20px" }}>
        Module 3: Outils OSINT – Avancé
      </h1>

      <section style={{ marginBottom: "30px" }}>
        <h2 style={{ color: colors.accent, fontSize: "1.5rem", marginBottom: "15px" }}>
          Automatisation et collecte massive
        </h2>
        <p style={{ color: colors.textSecondary, lineHeight: "1.8", marginBottom: "15px" }}>
          Au niveau avancé, l'OSINT nécessite des <strong style={{ color: colors.accent }}>outils d'automatisation</strong> 
          pour traiter des volumes importants de données, orchestrer des investigations complexes et exploiter 
          des APIs professionnelles. L'objectif : <strong>scalabilité, efficacité et enrichissement intelligent</strong>.
        </p>
      </section>

      <section style={{ marginBottom: "30px" }}>
        <h2 style={{ color: colors.accent, fontSize: "1.3rem", marginBottom: "15px" }}>
          APIs et intégrations OSINT
        </h2>
        
        <div style={{ 
          background: colors.bgPrimary, 
          border: `1px solid ${colors.accent}`, 
          borderRadius: "8px", 
          padding: "24px",
          marginBottom: "15px"
        }}>
          <h3 style={{ color: colors.accent, marginBottom: "12px", fontSize: "1.2rem" }}>
            🔌 Shodan API
          </h3>
          <p style={{ color: colors.textSecondary, lineHeight: "1.8", marginBottom: "12px" }}>
            L'<strong>API Shodan</strong> permet d'automatiser les recherches d'infrastructures exposées, 
            de monitorer en continu vos assets et de recevoir des alertes en temps réel.
          </p>
          <div style={{ 
            background: colors.bgSecondary, 
            border: `1px solid ${colors.border}`, 
            borderRadius: "6px", 
            padding: "15px",
            marginTop: "12px"
          }}>
            <p style={{ color: colors.accent, fontWeight: "bold", marginBottom: "8px" }}>
              Exemple d'utilisation Python :
            </p>
            <pre style={{ 
              background: colors.bgPrimary, 
              padding: "12px", 
              borderRadius: "6px", 
              color: colors.accent,
              overflowX: "auto",
              fontSize: "0.9rem"
            }}>
{`import shodan

api = shodan.Shodan('YOUR_API_KEY')
results = api.search('apache country:FR')

for result in results['matches']:
    print(f"IP: {result['ip_str']}")
    print(f"Port: {result['port']}")
    print(f"Org: {result.get('org', 'N/A')}")`}
            </pre>
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
            🦠 VirusTotal API
          </h3>
          <p style={{ color: colors.textSecondary, lineHeight: "1.8", marginBottom: "12px" }}>
            <strong>VirusTotal</strong> permet d'analyser des fichiers, URLs et domaines suspects via 70+ antivirus. 
            L'API offre des fonctionnalités avancées : recherche de hash, analyse comportementale, historique de détection.
          </p>
          <ul style={{ color: colors.textSecondary, lineHeight: "1.8", paddingLeft: "20px" }}>
            <li>Analyse de malwares et IOCs (Indicators of Compromise)</li>
            <li>Relations entre domaines, IPs et fichiers</li>
            <li>Recherche de similarités (YARA rules)</li>
            <li>Monitoring de domaines malveillants</li>
          </ul>
        </div>

        <div style={{ 
          background: colors.bgPrimary, 
          border: `1px solid ${colors.accent}`, 
          borderRadius: "8px", 
          padding: "24px"
        }}>
          <h3 style={{ color: colors.accent, marginBottom: "12px", fontSize: "1.2rem" }}>
            🐙 GitHub API
          </h3>
          <p style={{ color: colors.textSecondary, lineHeight: "1.8", marginBottom: "12px" }}>
            L'<strong>API GitHub</strong> permet de rechercher du code source, des secrets exposés (clés API, mots de passe), 
            des vulnérabilités dans les repositories publics, et de monitorer l'activité de développeurs cibles.
          </p>
          <ul style={{ color: colors.textSecondary, lineHeight: "1.8", paddingLeft: "20px" }}>
            <li>Recherche de credentials exposés : <code style={{ background: colors.bgSecondary, padding: "2px 6px", borderRadius: "3px" }}>password OR api_key extension:py</code></li>
            <li>Identification de vulnérabilités : recherche de CVE dans le code</li>
            <li>Profiling de développeurs et organisations</li>
            <li>Analyse de dépendances et supply chain</li>
          </ul>
        </div>
      </section>

      <section style={{ marginBottom: "30px" }}>
        <h2 style={{ color: colors.accent, fontSize: "1.3rem", marginBottom: "15px" }}>
          Automatisation Python et pipelines OSINT
        </h2>
        
        <div style={{ 
          background: colors.bgPrimary, 
          border: `1px solid ${colors.accent}`, 
          borderRadius: "8px", 
          padding: "24px",
          marginBottom: "15px"
        }}>
          <h3 style={{ color: colors.accent, marginBottom: "12px", fontSize: "1.2rem" }}>
            🐍 Scripts Python pour l'automatisation
          </h3>
          <p style={{ color: colors.textSecondary, lineHeight: "1.8", marginBottom: "12px" }}>
            Créez des <strong>pipelines OSINT personnalisés</strong> en Python pour orchestrer plusieurs outils, 
            enrichir automatiquement des données et générer des rapports structurés.
          </p>
          <div style={{ 
            background: colors.bgSecondary, 
            border: `1px solid ${colors.border}`, 
            borderRadius: "6px", 
            padding: "15px",
            marginTop: "12px"
          }}>
            <p style={{ color: colors.accent, fontWeight: "bold", marginBottom: "8px" }}>
              Librairies Python essentielles :
            </p>
            <ul style={{ color: colors.textSecondary, lineHeight: "1.8", paddingLeft: "20px" }}>
              <li><strong>requests</strong> : Requêtes HTTP pour consommer des APIs</li>
              <li><strong>BeautifulSoup / Scrapy</strong> : Web scraping et parsing HTML</li>
              <li><strong>pandas</strong> : Manipulation et analyse de données structurées</li>
              <li><strong>networkx</strong> : Création et analyse de graphes de relations</li>
              <li><strong>tweepy</strong> : Accès à l'API Twitter/X pour analyse de contenus</li>
              <li><strong>python-whois</strong> : Requêtes WHOIS automatisées</li>
              <li><strong>dnspython</strong> : Résolution DNS et analyse d'enregistrements</li>
            </ul>
          </div>
        </div>

        <div style={{ 
          background: colors.bgPrimary, 
          border: `1px solid ${colors.accent}`, 
          borderRadius: "8px", 
          padding: "24px"
        }}>
          <h3 style={{ color: colors.accent, marginBottom: "12px", fontSize: "1.2rem" }}>
            ⚙️ Orchestration avec Apache Airflow
          </h3>
          <p style={{ color: colors.textSecondary, lineHeight: "1.8" }}>
            Pour des investigations de <strong>grande envergure</strong>, utilisez <strong>Apache Airflow</strong> 
            pour orchestrer des workflows complexes : collecte programmée, enrichissement en cascade, 
            génération automatique de rapports, alerting en temps réel.
          </p>
        </div>
      </section>

      <section style={{ marginBottom: "30px" }}>
        <h2 style={{ color: colors.accent, fontSize: "1.3rem", marginBottom: "15px" }}>
          Graphes avancés et bases de données
        </h2>
        
        <div style={{ 
          background: colors.bgPrimary, 
          border: `1px solid ${colors.accent}`, 
          borderRadius: "8px", 
          padding: "24px",
          marginBottom: "15px"
        }}>
          <h3 style={{ color: colors.accent, marginBottom: "12px", fontSize: "1.2rem" }}>
            🗄️ Neo4j — Base de données graphe
          </h3>
          <p style={{ color: colors.textSecondary, lineHeight: "1.8", marginBottom: "12px" }}>
            <strong>Neo4j</strong> est une base de données orientée graphe puissante pour modéliser 
            des <strong>relations complexes</strong> entre entités. Idéale pour les investigations impliquant 
            des réseaux d'acteurs, des infrastructures interconnectées ou des flux financiers.
          </p>
          <ul style={{ color: colors.textSecondary, lineHeight: "1.8", paddingLeft: "20px" }}>
            <li>Requêtes en Cypher (langage de requête graphe)</li>
            <li>Visualisation interactive de réseaux</li>
            <li>Détection de communautés et de patterns</li>
            <li>Intégration avec Python (py2neo)</li>
          </ul>
        </div>

        <div style={{ 
          background: colors.bgPrimary, 
          border: `1px solid ${colors.accent}`, 
          borderRadius: "8px", 
          padding: "24px"
        }}>
          <h3 style={{ color: colors.accent, marginBottom: "12px", fontSize: "1.2rem" }}>
            🕸️ Maltego Pro
          </h3>
          <p style={{ color: colors.textSecondary, lineHeight: "1.8" }}>
            La version <strong>professionnelle de Maltego</strong> offre des transformations avancées, 
            l'intégration d'APIs tierces, la collaboration en équipe et des capacités d'export élargies. 
            Essentiel pour les investigations complexes nécessitant une vue d'ensemble sur des centaines d'entités.
          </p>
        </div>
      </section>

      <section style={{ marginBottom: "30px" }}>
        <h2 style={{ color: colors.accent, fontSize: "1.3rem", marginBottom: "15px" }}>
          Enrichissement et Machine Learning
        </h2>
        
        <div style={{ 
          background: colors.bgSecondary, 
          border: `1px solid ${colors.border}`, 
          borderRadius: "8px", 
          padding: "20px"
        }}>
          <p style={{ color: colors.textSecondary, lineHeight: "1.8", marginBottom: "12px" }}>
            L'intégration de <strong>techniques de Machine Learning</strong> permet d'automatiser la classification 
            de contenus, la détection d'anomalies et la prédiction de tendances :
          </p>
          <ul style={{ color: colors.textSecondary, lineHeight: "2", paddingLeft: "20px" }}>
            <li><strong>NLP (Natural Language Processing)</strong> : Analyse de sentiment, extraction d'entités nommées, classification de textes</li>
            <li><strong>Computer Vision</strong> : Détection d'objets dans des images, reconnaissance faciale, analyse de géolocalisation</li>
            <li><strong>Clustering</strong> : Regroupement automatique de données similaires (profils, domaines, contenus)</li>
            <li><strong>Anomaly Detection</strong> : Identification de comportements suspects ou outliers dans les données</li>
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
          Les outils avancés permettent de <strong>passer à l'échelle</strong> : automatisation, collecte massive, 
          enrichissement intelligent. Mais n'oubliez jamais que <strong>les outils sont des moyens, pas des fins</strong>. 
          La vraie valeur réside dans votre capacité à <strong>interpréter les données</strong>, 
          <strong>détecter les patterns</strong> et <strong>produire du renseignement exploitable</strong>. 
          Maîtrisez les outils, mais gardez toujours un regard critique et humain.
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
              <strong style={{ color: colors.accent }}>Outils OSINT (Avancé)</strong> validé avec succès !
            </p>
            <p style={{ 
              color: colors.textSecondary, 
              marginBottom: "30px",
              lineHeight: "1.6"
            }}>
              Félicitations ! Vous avez complété l'ensemble du parcours avancé. 
              Vous maîtrisez maintenant les outils et techniques de niveau expert. 
              Vous êtes prêt pour des investigations professionnelles complexes !
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


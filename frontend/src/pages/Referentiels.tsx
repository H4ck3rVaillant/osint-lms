import { useState } from "react";

export default function Referentiels() {
  const [activeSection, setActiveSection] = useState<"anssi" | "legal" | "normes">("anssi");

  return (
    <main style={{ padding: "40px", maxWidth: "1400px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: "40px" }}>
        <h1 style={{ color: "#00ff9c", fontSize: "2.5rem", marginBottom: "10px" }}>
          📚 Référentiels Cybersécurité
        </h1>
        <p style={{ color: "#9ca3af", fontSize: "1.2rem", lineHeight: "1.6" }}>
          Cadre réglementaire, normes et bonnes pratiques en cybersécurité
        </p>
      </div>

      {/* Navigation sections */}
      <div style={{
        display: "flex",
        gap: "15px",
        marginBottom: "40px",
        borderBottom: "2px solid #2a3f3f",
        paddingBottom: "10px",
        flexWrap: "wrap"
      }}>
        {[
          { key: "anssi", label: "🏛️ ANSSI", desc: "Agence nationale" },
          { key: "legal", label: "⚖️ Cadre Légal", desc: "RGPD, LPM, NIS2" },
          { key: "normes", label: "📜 Normes ISO", desc: "Standards internationaux" }
        ].map((section) => (
          <button
            key={section.key}
            onClick={() => setActiveSection(section.key as any)}
            style={{
              background: activeSection === section.key ? "#00ff9c" : "transparent",
              color: activeSection === section.key ? "#0b0f1a" : "#e5e7eb",
              border: `2px solid ${activeSection === section.key ? "#00ff9c" : "#2a3f3f"}`,
              padding: "15px 25px",
              borderRadius: "10px",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "1rem",
              transition: "all 0.3s",
              flex: "1",
              minWidth: "200px"
            }}
            onMouseEnter={(e) => {
              if (activeSection !== section.key) e.currentTarget.style.borderColor = "#00ff9c";
            }}
            onMouseLeave={(e) => {
              if (activeSection !== section.key) e.currentTarget.style.borderColor = "#2a3f3f";
            }}
          >
            <div>{section.label}</div>
            <div style={{ fontSize: "0.8rem", marginTop: "5px", opacity: 0.8 }}>
              {section.desc}
            </div>
          </button>
        ))}
      </div>

      {/* Section ANSSI */}
      {activeSection === "anssi" && (
        <div>
          {/* Présentation ANSSI */}
          <div style={{
            background: "#0b0f1a",
            border: "2px solid #00ff9c",
            borderRadius: "12px",
            padding: "30px",
            marginBottom: "30px"
          }}>
            <h2 style={{ color: "#00ff9c", fontSize: "2rem", marginBottom: "20px" }}>
              🏛️ ANSSI - Agence Nationale de la Sécurité des Systèmes d'Information
            </h2>
            <p style={{ color: "#e5e7eb", lineHeight: "1.8", marginBottom: "20px" }}>
              L'<strong>ANSSI</strong> est l'autorité nationale en matière de cybersécurité et de défense des systèmes d'information.
              Rattachée au Secrétariat général de la défense et de la sécurité nationale (SGDSN), elle accompagne 
              les administrations et les entreprises dans la sécurisation de leurs infrastructures numériques.
            </p>
            
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "15px", marginTop: "20px" }}>
              {[
                { title: "Mission", desc: "Prévention, protection, réaction et formation" },
                { title: "Création", desc: "2009 (décret n°2009-834)" },
                { title: "Personnel", desc: "500+ agents" },
                { title: "Certification", desc: "Produits et prestataires de sécurité" }
              ].map((info, idx) => (
                <div key={idx} style={{
                  background: "#1a1f2e",
                  padding: "15px",
                  borderRadius: "8px",
                  border: "1px solid #2a3f3f"
                }}>
                  <p style={{ color: "#00ff9c", fontWeight: "bold", marginBottom: "5px" }}>{info.title}</p>
                  <p style={{ color: "#9ca3af", fontSize: "0.9rem", margin: 0 }}>{info.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Publications ANSSI */}
          <h3 style={{ color: "#00ff9c", fontSize: "1.5rem", marginBottom: "20px" }}>
            📄 Publications principales
          </h3>
          
          <div style={{ display: "grid", gap: "20px", marginBottom: "40px" }}>
            {[
              {
                title: "Guide d'hygiène informatique",
                desc: "42 règles essentielles pour la sécurité des systèmes d'information",
                tags: ["Essentiel", "Bonnes pratiques"],
                link: "https://www.ssi.gouv.fr/guide/guide-dhygiene-informatique/"
              },
              {
                title: "Référentiel Général de Sécurité (RGS)",
                desc: "Cadre réglementaire pour sécuriser les échanges électroniques des administrations",
                tags: ["Réglementaire", "Administration"],
                link: "https://www.ssi.gouv.fr/entreprise/reglementation/confiance-numerique/le-referentiel-general-de-securite-rgs/"
              },
              {
                title: "Panorama de la cybermenace",
                desc: "Rapport annuel sur les menaces cyber en France",
                tags: ["CTI", "Annuel"],
                link: "https://www.ssi.gouv.fr/publication/panorama-de-la-cybermenace-2023/"
              },
              {
                title: "Recommandations de sécurité",
                desc: "Notes techniques sur authentification, chiffrement, réseau, etc.",
                tags: ["Technique", "Recommandations"],
                link: "https://www.ssi.gouv.fr/entreprise/bonnes-pratiques/"
              },
              {
                title: "EBIOS Risk Manager",
                desc: "Méthode d'appréciation et de traitement des risques numériques",
                tags: ["Méthodologie", "Risk Management"],
                link: "https://www.ssi.gouv.fr/entreprise/management-du-risque/la-methode-ebios-risk-manager/"
              },
              {
                title: "Certification produits de sécurité",
                desc: "Catalogue des produits certifiés par l'ANSSI",
                tags: ["Certification", "Produits"],
                link: "https://www.ssi.gouv.fr/administration/produits-certifies/"
              }
            ].map((pub, idx) => (
              <div
                key={idx}
                style={{
                  background: "#0b0f1a",
                  border: "1px solid #2a3f3f",
                  borderRadius: "12px",
                  padding: "25px",
                  transition: "all 0.3s"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.border = "1px solid #00ff9c";
                  e.currentTarget.style.transform = "translateY(-3px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.border = "1px solid #2a3f3f";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <h4 style={{ color: "#00ff9c", fontSize: "1.2rem", marginBottom: "10px" }}>
                  {pub.title}
                </h4>
                <p style={{ color: "#9ca3af", lineHeight: "1.6", marginBottom: "15px" }}>
                  {pub.desc}
                </p>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "15px" }}>
                  {pub.tags.map((tag, i) => (
                    <span
                      key={i}
                      style={{
                        background: "#1a1f2e",
                        color: "#00ff9c",
                        padding: "4px 10px",
                        borderRadius: "6px",
                        fontSize: "0.8rem"
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <a
                  href={pub.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "#00ff9c",
                    textDecoration: "none",
                    fontWeight: "bold",
                    fontSize: "0.9rem"
                  }}
                >
                  → Consulter le document
                </a>
              </div>
            ))}
          </div>

          {/* Lien officiel */}
          <div style={{
            background: "#1a1f2e",
            border: "1px solid #00ff9c",
            borderRadius: "12px",
            padding: "20px",
            textAlign: "center"
          }}>
            <p style={{ color: "#e5e7eb", marginBottom: "15px", fontSize: "1.1rem" }}>
              🌐 Site officiel de l'ANSSI
            </p>
            <a
              href="https://www.ssi.gouv.fr"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-block",
                background: "#00ff9c",
                color: "#0b0f1a",
                padding: "12px 30px",
                borderRadius: "8px",
                textDecoration: "none",
                fontWeight: "bold",
                transition: "all 0.3s"
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
            >
              Visiter www.ssi.gouv.fr
            </a>
          </div>
        </div>
      )}

      {/* Section Cadre Légal */}
      {activeSection === "legal" && (
        <div>
          <h2 style={{ color: "#00ff9c", fontSize: "2rem", marginBottom: "30px" }}>
            ⚖️ Cadre Légal de la Cybersécurité
          </h2>

          <div style={{ display: "grid", gap: "25px" }}>
            {/* RGPD */}
            <div style={{
              background: "#0b0f1a",
              border: "2px solid #00ff9c",
              borderRadius: "12px",
              padding: "30px"
            }}>
              <h3 style={{ color: "#00ff9c", fontSize: "1.6rem", marginBottom: "15px" }}>
                🇪🇺 RGPD - Règlement Général sur la Protection des Données
              </h3>
              <p style={{ color: "#9ca3af", marginBottom: "10px" }}>
                <strong style={{ color: "#e5e7eb" }}>Date d'application :</strong> 25 mai 2018
              </p>
              <p style={{ color: "#e5e7eb", lineHeight: "1.8", marginBottom: "20px" }}>
                Le RGPD encadre le traitement des données personnelles sur le territoire de l'Union Européenne. 
                Il renforce les droits des citoyens et impose des obligations strictes aux organisations.
              </p>
              
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "15px", marginBottom: "20px" }}>
                <div style={{ background: "#1a1f2e", padding: "15px", borderRadius: "8px" }}>
                  <p style={{ color: "#00ff9c", fontWeight: "bold", marginBottom: "8px" }}>Principes clés</p>
                  <ul style={{ color: "#9ca3af", fontSize: "0.9rem", paddingLeft: "20px", margin: 0 }}>
                    <li>Licéité, loyauté, transparence</li>
                    <li>Minimisation des données</li>
                    <li>Exactitude et limitation de conservation</li>
                    <li>Intégrité et confidentialité</li>
                  </ul>
                </div>
                <div style={{ background: "#1a1f2e", padding: "15px", borderRadius: "8px" }}>
                  <p style={{ color: "#00ff9c", fontWeight: "bold", marginBottom: "8px" }}>Droits des personnes</p>
                  <ul style={{ color: "#9ca3af", fontSize: "0.9rem", paddingLeft: "20px", margin: 0 }}>
                    <li>Droit d'accès et de rectification</li>
                    <li>Droit à l'effacement ("droit à l'oubli")</li>
                    <li>Droit à la portabilité</li>
                    <li>Droit d'opposition</li>
                  </ul>
                </div>
                <div style={{ background: "#1a1f2e", padding: "15px", borderRadius: "8px" }}>
                  <p style={{ color: "#00ff9c", fontWeight: "bold", marginBottom: "8px" }}>Obligations</p>
                  <ul style={{ color: "#9ca3af", fontSize: "0.9rem", paddingLeft: "20px", margin: 0 }}>
                    <li>Tenue d'un registre des traitements</li>
                    <li>Notification des violations (72h)</li>
                    <li>DPO obligatoire (cas spécifiques)</li>
                    <li>Analyse d'impact (AIPD)</li>
                  </ul>
                </div>
              </div>
              
              <div style={{ background: "#1a0f0f", border: "1px solid #ef4444", borderRadius: "8px", padding: "15px" }}>
                <p style={{ color: "#ef4444", fontWeight: "bold", marginBottom: "5px" }}>⚠️ Sanctions</p>
                <p style={{ color: "#9ca3af", fontSize: "0.9rem", margin: 0 }}>
                  Jusqu'à <strong style={{ color: "#ef4444" }}>20 millions d'euros</strong> ou <strong style={{ color: "#ef4444" }}>4% du CA annuel mondial</strong> (le plus élevé)
                </p>
              </div>
              
              <a href="https://www.cnil.fr/fr/reglement-europeen-protection-donnees" target="_blank" rel="noopener noreferrer" 
                 style={{ color: "#00ff9c", textDecoration: "none", fontWeight: "bold", display: "inline-block", marginTop: "15px" }}>
                → En savoir plus sur le RGPD (CNIL)
              </a>
            </div>

            {/* LPM */}
            <div style={{
              background: "#0b0f1a",
              border: "2px solid #00ff9c",
              borderRadius: "12px",
              padding: "30px"
            }}>
              <h3 style={{ color: "#00ff9c", fontSize: "1.6rem", marginBottom: "15px" }}>
                🛡️ LPM - Loi de Programmation Militaire
              </h3>
              <p style={{ color: "#9ca3af", marginBottom: "10px" }}>
                <strong style={{ color: "#e5e7eb" }}>Articles :</strong> 22 et 23 de la LPM 2014-2019
              </p>
              <p style={{ color: "#e5e7eb", lineHeight: "1.8", marginBottom: "20px" }}>
                La LPM impose aux <strong>Opérateurs d'Importance Vitale (OIV)</strong> et <strong>Opérateurs de Services Essentiels (OSE)</strong> 
                des obligations de sécurité pour protéger leurs systèmes d'information critiques.
              </p>
              
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "20px" }}>
                <div style={{ background: "#1a1f2e", padding: "20px", borderRadius: "8px" }}>
                  <p style={{ color: "#00ff9c", fontWeight: "bold", marginBottom: "10px", fontSize: "1.1rem" }}>Secteurs concernés</p>
                  <ul style={{ color: "#9ca3af", fontSize: "0.9rem", paddingLeft: "20px", lineHeight: "1.8" }}>
                    <li>Énergie (électricité, gaz, pétrole)</li>
                    <li>Transports</li>
                    <li>Santé</li>
                    <li>Eau</li>
                    <li>Alimentation</li>
                    <li>Communications électroniques</li>
                    <li>Secteur bancaire et financier</li>
                  </ul>
                </div>
                <div style={{ background: "#1a1f2e", padding: "20px", borderRadius: "8px" }}>
                  <p style={{ color: "#00ff9c", fontWeight: "bold", marginBottom: "10px", fontSize: "1.1rem" }}>Obligations</p>
                  <ul style={{ color: "#9ca3af", fontSize: "0.9rem", paddingLeft: "20px", lineHeight: "1.8" }}>
                    <li>Mise en œuvre de règles de sécurité</li>
                    <li>Contrôles de sécurité par l'ANSSI</li>
                    <li>Notification des incidents significatifs</li>
                    <li>Utilisation de produits/services qualifiés</li>
                    <li>Audits de sécurité réguliers</li>
                  </ul>
                </div>
              </div>
              
              <a href="https://www.ssi.gouv.fr/entreprise/reglementation/protection-des-oiv/" target="_blank" rel="noopener noreferrer" 
                 style={{ color: "#00ff9c", textDecoration: "none", fontWeight: "bold" }}>
                → Protection des OIV (ANSSI)
              </a>
            </div>

            {/* NIS 2 */}
            <div style={{
              background: "#0b0f1a",
              border: "2px solid #00ff9c",
              borderRadius: "12px",
              padding: "30px"
            }}>
              <h3 style={{ color: "#00ff9c", fontSize: "1.6rem", marginBottom: "15px" }}>
                🌍 NIS 2 - Directive Network and Information Security
              </h3>
              <p style={{ color: "#9ca3af", marginBottom: "10px" }}>
                <strong style={{ color: "#e5e7eb" }}>Transposition :</strong> 17 octobre 2024 (directive UE 2022/2555)
              </p>
              <p style={{ color: "#e5e7eb", lineHeight: "1.8", marginBottom: "20px" }}>
                NIS 2 élargit le périmètre de la directive NIS 1 et renforce les obligations de cybersécurité 
                pour les entités critiques et importantes dans l'UE.
              </p>
              
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "15px", marginBottom: "20px" }}>
                <div style={{ background: "#1a1f2e", padding: "15px", borderRadius: "8px" }}>
                  <p style={{ color: "#00ff9c", fontWeight: "bold", marginBottom: "8px" }}>Nouveautés vs NIS 1</p>
                  <ul style={{ color: "#9ca3af", fontSize: "0.9rem", paddingLeft: "20px", margin: 0, lineHeight: "1.8" }}>
                    <li>Périmètre élargi (18 secteurs)</li>
                    <li>Chaîne d'approvisionnement</li>
                    <li>Responsabilité de la direction</li>
                    <li>Sanctions renforcées</li>
                  </ul>
                </div>
                <div style={{ background: "#1a1f2e", padding: "15px", borderRadius: "8px" }}>
                  <p style={{ color: "#00ff9c", fontWeight: "bold", marginBottom: "8px" }}>Mesures obligatoires</p>
                  <ul style={{ color: "#9ca3af", fontSize: "0.9rem", paddingLeft: "20px", margin: 0, lineHeight: "1.8" }}>
                    <li>Gestion des risques cyber</li>
                    <li>Notification incidents (24h)</li>
                    <li>Sécurité de la chaîne logistique</li>
                    <li>Chiffrement et authentification forte</li>
                  </ul>
                </div>
                <div style={{ background: "#1a1f2e", padding: "15px", borderRadius: "8px" }}>
                  <p style={{ color: "#00ff9c", fontWeight: "bold", marginBottom: "8px" }}>Secteurs additionnels</p>
                  <ul style={{ color: "#9ca3af", fontSize: "0.9rem", paddingLeft: "20px", margin: 0, lineHeight: "1.8" }}>
                    <li>Services postaux</li>
                    <li>Gestion des déchets</li>
                    <li>Fabrication (chimie, pharma, etc.)</li>
                    <li>Fournisseurs numériques</li>
                  </ul>
                </div>
              </div>
              
              <a href="https://www.ssi.gouv.fr/entreprise/reglementation/confiance-numerique/directive-nis-2/" target="_blank" rel="noopener noreferrer" 
                 style={{ color: "#00ff9c", textDecoration: "none", fontWeight: "bold" }}>
                → Directive NIS 2 (ANSSI)
              </a>
            </div>

            {/* Cybercriminalité */}
            <div style={{
              background: "#0b0f1a",
              border: "1px solid #2a3f3f",
              borderRadius: "12px",
              padding: "25px"
            }}>
              <h3 style={{ color: "#00ff9c", fontSize: "1.4rem", marginBottom: "15px" }}>
                👮 Cybercriminalité
              </h3>
              <p style={{ color: "#e5e7eb", lineHeight: "1.8", marginBottom: "15px" }}>
                Le Code pénal français réprime les atteintes aux systèmes de traitement automatisé de données (STAD).
              </p>
              <div style={{ background: "#1a1f2e", padding: "20px", borderRadius: "8px" }}>
                <p style={{ color: "#00ff9c", fontWeight: "bold", marginBottom: "10px" }}>Articles principaux</p>
                <ul style={{ color: "#9ca3af", paddingLeft: "20px", lineHeight: "1.8" }}>
                  <li><strong>Art. 323-1</strong> : Accès frauduleux à un STAD (2 ans / 60 000€)</li>
                  <li><strong>Art. 323-2</strong> : Entrave au fonctionnement d'un STAD (5 ans / 150 000€)</li>
                  <li><strong>Art. 323-3</strong> : Introduction frauduleuse de données (5 ans / 150 000€)</li>
                  <li><strong>Art. 323-3-1</strong> : Importation/détention d'outils de hacking (3 ans / 100 000€)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Section Normes ISO */}
      {activeSection === "normes" && (
        <div>
          <h2 style={{ color: "#00ff9c", fontSize: "2rem", marginBottom: "30px" }}>
            📜 Normes et Standards Internationaux
          </h2>

          <div style={{ display: "grid", gap: "25px" }}>
            {[
              {
                title: "ISO/IEC 27001",
                subtitle: "Système de Management de la Sécurité de l'Information (SMSI)",
                desc: "Norme internationale la plus reconnue pour la certification des SMSI. Elle définit les exigences pour établir, mettre en œuvre, maintenir et améliorer continuellement un système de management de la sécurité de l'information.",
                points: [
                  "Approche basée sur les risques (risk-based approach)",
                  "Cycle PDCA (Plan-Do-Check-Act)",
                  "114 mesures de sécurité dans l'Annexe A",
                  "Certification par organismes accrédités"
                ],
                tags: ["Certification", "SMSI", "Essential"],
                link: "https://www.iso.org/standard/27001"
              },
              {
                title: "ISO/IEC 27002",
                subtitle: "Code de bonnes pratiques pour le management de la sécurité",
                desc: "Catalogue de 93 mesures de sécurité organisées en 4 thèmes (Organisationnel, Personnes, Physique, Technologique). Guide pratique pour la mise en œuvre des contrôles de sécurité.",
                points: [
                  "93 mesures de sécurité (version 2022)",
                  "4 catégories : Organisationnel, Personnes, Physique, Technologique",
                  "Guidance détaillée pour chaque mesure",
                  "Complément de la norme ISO 27001"
                ],
                tags: ["Bonnes pratiques", "Mesures", "Guide"],
                link: "https://www.iso.org/standard/75652.html"
              },
              {
                title: "ISO/IEC 27005",
                subtitle: "Gestion des risques liés à la sécurité de l'information",
                desc: "Méthodologie structurée pour l'appréciation et le traitement des risques de sécurité de l'information. S'intègre dans le cadre de la norme ISO 27001.",
                points: [
                  "Processus d'appréciation des risques",
                  "Identification, analyse et évaluation des risques",
                  "Options de traitement (accepter, réduire, transférer, éviter)",
                  "Compatible avec EBIOS Risk Manager"
                ],
                tags: ["Risk Management", "Méthodologie"],
                link: "https://www.iso.org/standard/80585.html"
              },
              {
                title: "ISO/IEC 27017",
                subtitle: "Sécurité du Cloud Computing",
                desc: "Lignes directrices pour les contrôles de sécurité des services cloud basées sur ISO 27002, avec des recommandations spécifiques pour les fournisseurs et clients cloud.",
                points: [
                  "Contrôles spécifiques au cloud (IaaS, PaaS, SaaS)",
                  "Responsabilités partagées fournisseur/client",
                  "Sécurité des environnements multi-tenants",
                  "Conformité et audit cloud"
                ],
                tags: ["Cloud", "SaaS/PaaS/IaaS"],
                link: "https://www.iso.org/standard/43757.html"
              },
              {
                title: "ISO/IEC 27701",
                subtitle: "Extension Privacy Information Management (PIMS)",
                desc: "Extension de la norme ISO 27001 pour la gestion de la protection des données personnelles. Alignée avec le RGPD et autres réglementations privacy.",
                points: [
                  "Extension ISO 27001 pour la privacy",
                  "Alignement RGPD / CCPA / autres lois privacy",
                  "Rôles de Responsable de traitement et Sous-traitant",
                  "Certification PIMS possible"
                ],
                tags: ["Privacy", "RGPD", "PIMS"],
                link: "https://www.iso.org/standard/71670.html"
              },
              {
                title: "NIST Cybersecurity Framework (CSF)",
                subtitle: "Cadre de cybersécurité du NIST (États-Unis)",
                desc: "Framework volontaire largement adopté pour améliorer la cybersécurité des infrastructures critiques. Structuré autour de 5 fonctions principales.",
                points: [
                  "5 fonctions : Identify, Protect, Detect, Respond, Recover",
                  "3 niveaux de maturité (Tiers 1-3)",
                  "Compatible avec ISO 27001, COBIT, etc.",
                  "Référence mondiale pour les infrastructures critiques"
                ],
                tags: ["US", "Framework", "Infrastructures critiques"],
                link: "https://www.nist.gov/cyberframework"
              }
            ].map((norme, idx) => (
              <div
                key={idx}
                style={{
                  background: "#0b0f1a",
                  border: "2px solid #2a3f3f",
                  borderRadius: "12px",
                  padding: "30px",
                  transition: "all 0.3s"
                }}
                onMouseEnter={(e) => e.currentTarget.style.border = "2px solid #00ff9c"}
                onMouseLeave={(e) => e.currentTarget.style.border = "2px solid #2a3f3f"}
              >
                <h3 style={{ color: "#00ff9c", fontSize: "1.5rem", marginBottom: "8px" }}>
                  {norme.title}
                </h3>
                <p style={{ color: "#9ca3af", fontSize: "1rem", marginBottom: "15px", fontStyle: "italic" }}>
                  {norme.subtitle}
                </p>
                <p style={{ color: "#e5e7eb", lineHeight: "1.8", marginBottom: "20px" }}>
                  {norme.desc}
                </p>
                
                <div style={{ background: "#1a1f2e", padding: "20px", borderRadius: "8px", marginBottom: "20px" }}>
                  <p style={{ color: "#00ff9c", fontWeight: "bold", marginBottom: "10px" }}>Points clés</p>
                  <ul style={{ color: "#9ca3af", paddingLeft: "20px", lineHeight: "1.8" }}>
                    {norme.points.map((point, i) => (
                      <li key={i}>{point}</li>
                    ))}
                  </ul>
                </div>

                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "15px" }}>
                  {norme.tags.map((tag, i) => (
                    <span
                      key={i}
                      style={{
                        background: "#1a1f2e",
                        color: "#00ff9c",
                        padding: "5px 12px",
                        borderRadius: "6px",
                        fontSize: "0.85rem",
                        border: "1px solid #2a3f3f"
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <a
                  href={norme.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "#00ff9c",
                    textDecoration: "none",
                    fontWeight: "bold",
                    fontSize: "0.95rem"
                  }}
                >
                  → En savoir plus
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}

import { useState, useEffect } from "react";
import { useThemeColors } from "../context/ThemeContext";

export default function Referentiels() {
  const colors = useThemeColors();
  const [activeSection, setActiveSection] = useState<"anssi" | "legal" | "normes">("anssi");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <main style={{ paddingTop: "80px", padding: "40px", maxWidth: "1400px", margin: "0 auto", minHeight: "100vh", background: colors.bgPrimary }}>
      
      {/* Header */}
      <div style={{ marginBottom: "40px" }}>
        <h1 style={{ color: colors.accent, fontSize: "2.5rem", marginBottom: "10px" }}>
          📚 Référentiels Cybersécurité
        </h1>
        <p style={{ color: colors.textSecondary, fontSize: "1.2rem", lineHeight: "1.6" }}>
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
          { key: "legal", label: "⚖️ Cadre Légal", desc: "RGPD, LPM, NIS2, DORA" },
          { key: "normes", label: "📜 Normes ISO", desc: "Standards internationaux" }
        ].map((section) => (
          <button
            key={section.key}
            onClick={() => setActiveSection(section.key as any)}
            style={{
              background: activeSection === section.key ? colors.accent : "transparent",
              color: activeSection === section.key ? colors.bgPrimary : colors.textPrimary,
              border: `2px solid ${activeSection === section.key ? colors.accent : colors.border}`,
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
              if (activeSection !== section.key) e.currentTarget.style.borderColor = colors.accent;
            }}
            onMouseLeave={(e) => {
              if (activeSection !== section.key) e.currentTarget.style.borderColor = colors.border;
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
            background: colors.bgPrimary,
            border: "2px solid #00ff9c",
            borderRadius: "12px",
            padding: "30px",
            marginBottom: "30px"
          }}>
            <h2 style={{ color: colors.accent, fontSize: "2rem", marginBottom: "20px" }}>
              🏛️ ANSSI - Agence Nationale de la Sécurité des Systèmes d'Information
            </h2>
            <p style={{ color: colors.textPrimary, lineHeight: "1.8", marginBottom: "20px" }}>
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
                  background: colors.bgSecondary,
                  padding: "15px",
                  borderRadius: "8px",
                  border: "1px solid #2a3f3f"
                }}>
                  <p style={{ color: colors.accent, fontWeight: "bold", marginBottom: "5px" }}>{info.title}</p>
                  <p style={{ color: colors.textSecondary, fontSize: "0.9rem", margin: 0 }}>{info.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Publications ANSSI */}
          <h3 style={{ color: colors.accent, fontSize: "1.5rem", marginBottom: "20px" }}>
            📄 Publications principales
          </h3>
          
          <div style={{ display: "grid", gap: "20px", marginBottom: "40px" }}>
            {[
              {
                title: "Guide d'hygiène informatique",
                desc: "42 règles essentielles pour la sécurité des systèmes d'information",
                tags: ["Essentiel", "Bonnes pratiques"],
                link: "https://messervices.cyber.gouv.fr/guides/guide-dhygiene-informatique"
              },
              {
                title: "Panorama de la cybermenace",
                desc: "Rapport annuel sur les menaces cyber en France",
                tags: ["CTI", "Annuel"],
                link: "https://cyber.gouv.fr/nous-connaitre/publications/panoramas-de-la-cybermenace/"
              },
              {
                title: "EBIOS Risk Manager",
                desc: "Méthode d'appréciation et de traitement des risques numériques",
                tags: ["Méthodologie", "Risk Management"],
                link: "https://cyber.gouv.fr/securisation/analyse-des-risques/methode-ebios-rm/"
              },
              {
                title: "Recommandations de sécurité",
                desc: "Règles de sécurité pour les systèmes d'information",
                tags: ["Technique", "Recommandations"],
                link: "https://cyber.gouv.fr/reglementation/cybersecurite-systemes-dinformation/directives-nis-nis2-et-dispositif-saiv/dispositif-saiv/regles-de-s%C3%A9curite/"
              },
              {
                title: "Référentiel Général de Sécurité (RGS)",
                desc: "Cadre réglementaire pour sécuriser les échanges électroniques",
                tags: ["Réglementaire", "Administration"],
                link: "https://cyber.gouv.fr/reglementation/reglementation-identite-confiance-numerique/securite-echanges-voie-electronique/referentiel-general-de-securite/"
              },
              {
                title: "Solutions certifiées et qualifiées",
                desc: "Catalogue des produits et services de sécurité certifiés",
                tags: ["Certification", "Produits"],
                link: "https://cyber.gouv.fr/offre-de-service/solutions-certifiees-et-qualifiees/services-de-securite-evalue/decouvrir-les-solutions-certifiees-qualifiees/"
              }
            ].map((pub, idx) => (
              <div
                key={idx}
                style={{
                  background: colors.bgPrimary,
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
                <h4 style={{ color: colors.accent, fontSize: "1.2rem", marginBottom: "10px" }}>
                  {pub.title}
                </h4>
                <p style={{ color: colors.textSecondary, lineHeight: "1.6", marginBottom: "15px" }}>
                  {pub.desc}
                </p>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "15px" }}>
                  {pub.tags.map((tag, i) => (
                    <span
                      key={i}
                      style={{
                        background: colors.bgSecondary,
                        color: colors.accent,
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
                    color: colors.accent,
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
            background: colors.bgSecondary,
            border: "1px solid #00ff9c",
            borderRadius: "12px",
            padding: "20px",
            textAlign: "center"
          }}>
            <p style={{ color: colors.textPrimary, marginBottom: "15px", fontSize: "1.1rem" }}>
              🌐 Site officiel de l'ANSSI
            </p>
            <a
              href="https://cyber.gouv.fr"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-block",
                background: colors.accent,
                color: colors.bgPrimary,
                padding: "12px 30px",
                borderRadius: "8px",
                textDecoration: "none",
                fontWeight: "bold",
                transition: "all 0.3s"
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
            >
              Visiter cyber.gouv.fr
            </a>
          </div>
        </div>
      )}

      {/* Section Cadre Légal */}
      {activeSection === "legal" && (
        <div>
          <h2 style={{ color: colors.accent, fontSize: "2rem", marginBottom: "30px" }}>
            ⚖️ Cadre Légal de la Cybersécurité
          </h2>
          
          <div style={{ display: "grid", gap: "25px" }}>
            
            {/* RGPD */}
            <div style={{
              background: colors.bgPrimary,
              border: "2px solid #00ff9c",
              borderRadius: "12px",
              padding: "30px"
            }}>
              <h3 style={{ color: colors.accent, fontSize: "1.6rem", marginBottom: "15px" }}>
                🇪🇺 RGPD - Règlement Général sur la Protection des Données
              </h3>
              <p style={{ color: colors.textSecondary, marginBottom: "10px" }}>
                <strong style={{ color: colors.textPrimary }}>Date d'application :</strong> 25 mai 2018
              </p>
              <p style={{ color: colors.textPrimary, lineHeight: "1.8", marginBottom: "20px" }}>
                Le RGPD encadre le traitement des données personnelles sur le territoire de l'Union Européenne. 
                Il renforce les droits des citoyens et impose des obligations strictes aux organisations.
              </p>
              
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "15px", marginBottom: "20px" }}>
                <div style={{ background: colors.bgSecondary, padding: "15px", borderRadius: "8px" }}>
                  <p style={{ color: colors.accent, fontWeight: "bold", marginBottom: "8px" }}>Principes clés</p>
                  <ul style={{ color: colors.textSecondary, fontSize: "0.9rem", paddingLeft: "20px", margin: 0 }}>
                    <li>Licéité, loyauté, transparence</li>
                    <li>Minimisation des données</li>
                    <li>Exactitude et limitation de conservation</li>
                    <li>Intégrité et confidentialité</li>
                  </ul>
                </div>
                <div style={{ background: colors.bgSecondary, padding: "15px", borderRadius: "8px" }}>
                  <p style={{ color: colors.accent, fontWeight: "bold", marginBottom: "8px" }}>Droits des personnes</p>
                  <ul style={{ color: colors.textSecondary, fontSize: "0.9rem", paddingLeft: "20px", margin: 0 }}>
                    <li>Droit d'accès et de rectification</li>
                    <li>Droit à l'effacement ("droit à l'oubli")</li>
                    <li>Droit à la portabilité</li>
                    <li>Droit d'opposition</li>
                  </ul>
                </div>
                <div style={{ background: colors.bgSecondary, padding: "15px", borderRadius: "8px" }}>
                  <p style={{ color: colors.accent, fontWeight: "bold", marginBottom: "8px" }}>Obligations</p>
                  <ul style={{ color: colors.textSecondary, fontSize: "0.9rem", paddingLeft: "20px", margin: 0 }}>
                    <li>Tenue d'un registre des traitements</li>
                    <li>Notification des violations (72h)</li>
                    <li>DPO obligatoire (cas spécifiques)</li>
                    <li>Analyse d'impact (AIPD)</li>
                  </ul>
                </div>
              </div>
              
              <div style={{ background: "#1a0f0f", border: "1px solid #ef4444", borderRadius: "8px", padding: "15px" }}>
                <p style={{ color: "#ef4444", fontWeight: "bold", marginBottom: "5px" }}>⚠️ Sanctions</p>
                <p style={{ color: colors.textSecondary, fontSize: "0.9rem", margin: 0 }}>
                  Jusqu'à <strong style={{ color: "#ef4444" }}>20 millions d'euros</strong> ou <strong style={{ color: "#ef4444" }}>4% du CA annuel mondial</strong> (le plus élevé)
                </p>
              </div>
              
              <a href="https://www.cnil.fr/fr/reglement-europeen-protection-donnees" target="_blank" rel="noopener noreferrer" 
                 style={{ color: colors.accent, textDecoration: "none", fontWeight: "bold", display: "inline-block", marginTop: "15px" }}>
                → En savoir plus sur le RGPD (CNIL)
              </a>
            </div>

            {/* LPM */}
            <div style={{
              background: colors.bgPrimary,
              border: "2px solid #00ff9c",
              borderRadius: "12px",
              padding: "30px"
            }}>
              <h3 style={{ color: colors.accent, fontSize: "1.6rem", marginBottom: "15px" }}>
                🛡️ LPM - Loi de Programmation Militaire
              </h3>
              <p style={{ color: colors.textSecondary, marginBottom: "10px" }}>
                <strong style={{ color: colors.textPrimary }}>Articles :</strong> 22 et 23 de la LPM 2014-2019
              </p>
              <p style={{ color: colors.textPrimary, lineHeight: "1.8", marginBottom: "20px" }}>
                La LPM impose aux <strong>Opérateurs d'Importance Vitale (OIV)</strong> et <strong>Opérateurs de Services Essentiels (OSE)</strong> 
                des obligations de sécurité pour protéger leurs systèmes d'information critiques.
              </p>
              
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "20px" }}>
                <div style={{ background: colors.bgSecondary, padding: "20px", borderRadius: "8px" }}>
                  <p style={{ color: colors.accent, fontWeight: "bold", marginBottom: "10px", fontSize: "1.1rem" }}>Secteurs concernés</p>
                  <ul style={{ color: colors.textSecondary, fontSize: "0.9rem", paddingLeft: "20px", lineHeight: "1.8" }}>
                    <li>Énergie (électricité, gaz, pétrole)</li>
                    <li>Transports</li>
                    <li>Santé</li>
                    <li>Eau</li>
                    <li>Alimentation</li>
                    <li>Communications électroniques</li>
                    <li>Secteur bancaire et financier</li>
                  </ul>
                </div>
                <div style={{ background: colors.bgSecondary, padding: "20px", borderRadius: "8px" }}>
                  <p style={{ color: colors.accent, fontWeight: "bold", marginBottom: "10px", fontSize: "1.1rem" }}>Obligations</p>
                  <ul style={{ color: colors.textSecondary, fontSize: "0.9rem", paddingLeft: "20px", lineHeight: "1.8" }}>
                    <li>Mise en œuvre de règles de sécurité</li>
                    <li>Contrôles de sécurité par l'ANSSI</li>
                    <li>Notification des incidents significatifs</li>
                    <li>Utilisation de produits/services qualifiés</li>
                    <li>Audits de sécurité réguliers</li>
                  </ul>
                </div>
              </div>
              
              <div style={{ background: colors.bgSecondary, padding: "20px", borderRadius: "8px", marginTop: "20px", marginBottom: "20px" }}>
                <p style={{ color: colors.accent, fontWeight: "bold", marginBottom: "10px", fontSize: "1rem" }}>
                  📌 Spécificité française : la catégorie OIV
                </p>
                <p style={{ color: colors.textSecondary, lineHeight: "1.8", margin: 0 }}>
                  La catégorie des <strong style={{ color: colors.textPrimary }}>opérateurs d'importance vitale (OIV)</strong> n'est ni 
                  supprimée ni abordée par NIS2 et DORA : elle demeure une catégorie 
                  spécifiquement française, ancrée dans le code de la défense et la 
                  loi de programmation militaire, visant la protection des 
                  infrastructures et activités vitales pour la Nation.
                </p>
              </div>

              <a href="https://cyber.gouv.fr/reglementation/cybersecurite-systemes-dinformation/directives-nis-nis2-et-dispositif-saiv/dispositif-saiv" target="_blank" rel="noopener noreferrer" 
                 style={{ color: colors.accent, textDecoration: "none", fontWeight: "bold" }}>
                → Protection des OIV (ANSSI)
              </a>
            </div>

            {/* NIS 2 */}
            <div style={{
              background: colors.bgPrimary,
              border: "2px solid #00ff9c",
              borderRadius: "12px",
              padding: "30px"
            }}>
              <h3 style={{ color: colors.accent, fontSize: "1.6rem", marginBottom: "15px" }}>
                🌍 NIS 2 - Directive Network and Information Security
              </h3>
              <p style={{ color: colors.textSecondary, marginBottom: "10px" }}>
                <strong style={{ color: colors.textPrimary }}>Transposition :</strong> 17 octobre 2024 (directive UE 2022/2555)
              </p>
              <p style={{ color: colors.textPrimary, lineHeight: "1.8", marginBottom: "20px" }}>
                NIS 2 élargit le périmètre de la directive NIS 1 et renforce les obligations de cybersécurité 
                pour les entités critiques et importantes dans l'UE.
              </p>
              
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "15px", marginBottom: "20px" }}>
                <div style={{ background: colors.bgSecondary, padding: "15px", borderRadius: "8px" }}>
                  <p style={{ color: colors.accent, fontWeight: "bold", marginBottom: "8px" }}>Nouveautés vs NIS 1</p>
                  <ul style={{ color: colors.textSecondary, fontSize: "0.9rem", paddingLeft: "20px", margin: 0, lineHeight: "1.8" }}>
                    <li>Périmètre élargi (18 secteurs)</li>
                    <li>Chaîne d'approvisionnement</li>
                    <li>Responsabilité de la direction</li>
                    <li>Sanctions renforcées</li>
                  </ul>
                </div>
                <div style={{ background: colors.bgSecondary, padding: "15px", borderRadius: "8px" }}>
                  <p style={{ color: colors.accent, fontWeight: "bold", marginBottom: "8px" }}>Mesures obligatoires</p>
                  <ul style={{ color: colors.textSecondary, fontSize: "0.9rem", paddingLeft: "20px", margin: 0, lineHeight: "1.8" }}>
                    <li>Gestion des risques cyber</li>
                    <li>Notification incidents (24h)</li>
                    <li>Sécurité de la chaîne logistique</li>
                    <li>Chiffrement et authentification forte</li>
                  </ul>
                </div>
                <div style={{ background: colors.bgSecondary, padding: "15px", borderRadius: "8px" }}>
                  <p style={{ color: colors.accent, fontWeight: "bold", marginBottom: "8px" }}>Secteurs additionnels</p>
                  <ul style={{ color: colors.textSecondary, fontSize: "0.9rem", paddingLeft: "20px", margin: 0, lineHeight: "1.8" }}>
                    <li>Services postaux</li>
                    <li>Gestion des déchets</li>
                    <li>Fabrication (chimie, pharma, etc.)</li>
                    <li>Fournisseurs numériques</li>
                  </ul>
                </div>
              </div>
              
              <a href="https://cyber.gouv.fr/reglementation/cybersecurite-systemes-dinformation/directives-nis-nis2-et-dispositif-saiv/directive-nis-2/" target="_blank" rel="noopener noreferrer" 
                 style={{ color: colors.accent, textDecoration: "none", fontWeight: "bold" }}>
                → Directive NIS 2 (ANSSI)
              </a>
            </div>

            {/* DORA */}
            <div style={{
              background: colors.bgPrimary,
              border: "2px solid #00ff9c",
              borderRadius: "12px",
              padding: "30px"
            }}>
              <h3 style={{ color: colors.accent, fontSize: "1.6rem", marginBottom: "15px" }}>
                🏦 DORA - Digital Operational Resilience Act
              </h3>
              <p style={{ color: colors.textSecondary, marginBottom: "10px" }}>
                <strong style={{ color: colors.textPrimary }}>Application :</strong> 17 janvier 2025 (règlement UE 2022/2554)
              </p>
              <p style={{ color: colors.textPrimary, lineHeight: "1.8", marginBottom: "20px" }}>
                DORA établit un cadre réglementaire uniforme pour la résilience opérationnelle numérique du secteur financier européen. 
                Il s'applique aux banques, assurances, entreprises d'investissement et prestataires de services TIC critiques.
              </p>
              
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "15px", marginBottom: "20px" }}>
                <div style={{ background: colors.bgSecondary, padding: "15px", borderRadius: "8px" }}>
                  <p style={{ color: colors.accent, fontWeight: "bold", marginBottom: "8px" }}>5 Piliers DORA</p>
                  <ul style={{ color: colors.textSecondary, fontSize: "0.9rem", paddingLeft: "20px", margin: 0, lineHeight: "1.8" }}>
                    <li>Gestion des risques TIC</li>
                    <li>Gestion des incidents TIC</li>
                    <li>Tests de résilience opérationnelle</li>
                    <li>Gestion du risque tiers</li>
                    <li>Partage d'informations</li>
                  </ul>
                </div>
                <div style={{ background: colors.bgSecondary, padding: "15px", borderRadius: "8px" }}>
                  <p style={{ color: colors.accent, fontWeight: "bold", marginBottom: "8px" }}>Entités concernées</p>
                  <ul style={{ color: colors.textSecondary, fontSize: "0.9rem", paddingLeft: "20px", margin: 0, lineHeight: "1.8" }}>
                    <li>Établissements de crédit et PSP</li>
                    <li>Entreprises d'investissement</li>
                    <li>Compagnies d'assurance</li>
                    <li>Plateformes de crypto-actifs</li>
                    <li>Prestataires TIC critiques</li>
                  </ul>
                </div>
                <div style={{ background: colors.bgSecondary, padding: "15px", borderRadius: "8px" }}>
                  <p style={{ color: colors.accent, fontWeight: "bold", marginBottom: "8px" }}>Obligations clés</p>
                  <ul style={{ color: colors.textSecondary, fontSize: "0.9rem", paddingLeft: "20px", margin: 0, lineHeight: "1.8" }}>
                    <li>Tests de pénétration (TLPT)</li>
                    <li>Notification incidents (24h-72h)</li>
                    <li>Registre des contrats TIC</li>
                    <li>Plan de continuité d'activité</li>
                  </ul>
                </div>
              </div>
              
              <div style={{ background: "#1a0f0f", border: "1px solid #ef4444", borderRadius: "8px", padding: "15px", marginBottom: "15px" }}>
                <p style={{ color: "#ef4444", fontWeight: "bold", marginBottom: "5px" }}>⚠️ Sanctions</p>
                <p style={{ color: colors.textSecondary, fontSize: "0.9rem", margin: 0 }}>
                  Jusqu'à <strong style={{ color: "#ef4444" }}>10 millions d'euros</strong> ou <strong style={{ color: "#ef4444" }}>5% du CA annuel</strong> (entités financières) / 
                  <strong style={{ color: "#ef4444" }}> 1% du CA</strong> (prestataires TIC)
                </p>
              </div>
              
              <a href="https://www.europarl.europa.eu/RegData/etudes/ATAG/2022/738197/EPRS_ATA(2022)738197_FR.pdf" target="_blank" rel="noopener noreferrer" 
                 style={{ color: colors.accent, textDecoration: "none", fontWeight: "bold", display: "inline-block" }}>
                → Fiche DORA (Parlement Européen)
              </a>
            </div>

            {/* Fuites de données */}
            <div style={{
              background: colors.bgPrimary,
              border: "2px solid #ef4444",
              borderRadius: "12px",
              padding: "30px"
            }}>
              <h3 style={{ color: "#ef4444", fontSize: "1.6rem", marginBottom: "15px" }}>
                🚨 Notification des Violations de Données (Data Breaches)
              </h3>
              <p style={{ color: colors.textPrimary, lineHeight: "1.8", marginBottom: "20px" }}>
                En cas de violation de données personnelles, le <strong>RGPD (Article 33)</strong> impose une notification à la CNIL 
                dans les <strong>72 heures</strong> suivant la prise de connaissance de l'incident. Les personnes concernées doivent 
                également être informées si le risque est élevé.
              </p>
              
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "15px", marginBottom: "20px" }}>
                <div style={{ background: colors.bgSecondary, padding: "20px", borderRadius: "8px" }}>
                  <p style={{ color: colors.accent, fontWeight: "bold", marginBottom: "10px", fontSize: "1.1rem" }}>Qu'est-ce qu'une violation ?</p>
                  <ul style={{ color: colors.textSecondary, fontSize: "0.9rem", paddingLeft: "20px", lineHeight: "1.8" }}>
                    <li><strong>Violation de confidentialité :</strong> Accès non autorisé aux données (piratage, vol, perte)</li>
                    <li><strong>Violation d'intégrité :</strong> Modification non autorisée (altération, suppression)</li>
                    <li><strong>Violation de disponibilité :</strong> Perte d'accès aux données (ransomware, panne)</li>
                  </ul>
                </div>
                <div style={{ background: colors.bgSecondary, padding: "20px", borderRadius: "8px" }}>
                  <p style={{ color: colors.accent, fontWeight: "bold", marginBottom: "10px", fontSize: "1.1rem" }}>Procédure de notification</p>
                  <ul style={{ color: colors.textSecondary, fontSize: "0.9rem", paddingLeft: "20px", lineHeight: "1.8" }}>
                    <li><strong>Délai :</strong> 72 heures max après détection</li>
                    <li><strong>Destinataire :</strong> CNIL (autorité de contrôle)</li>
                    <li><strong>Contenu :</strong> Nature, données concernées, conséquences, mesures prises</li>
                    <li><strong>Registre :</strong> Documenter toutes les violations</li>
                  </ul>
                </div>
                <div style={{ background: colors.bgSecondary, padding: "20px", borderRadius: "8px" }}>
                  <p style={{ color: colors.accent, fontWeight: "bold", marginBottom: "10px", fontSize: "1.1rem" }}>Information des personnes</p>
                  <ul style={{ color: colors.textSecondary, fontSize: "0.9rem", paddingLeft: "20px", lineHeight: "1.8" }}>
                    <li><strong>Quand :</strong> Si risque élevé pour les droits et libertés</li>
                    <li><strong>Délai :</strong> Dans les meilleurs délais</li>
                    <li><strong>Contenu :</strong> Nature de la violation, mesures de protection recommandées</li>
                    <li><strong>Moyen :</strong> Communication claire et compréhensible</li>
                  </ul>
                </div>
              </div>
              
              <div style={{ background: "#1a0f0f", border: "1px solid #ef4444", borderRadius: "8px", padding: "20px", marginBottom: "20px" }}>
                <p style={{ color: "#ef4444", fontWeight: "bold", marginBottom: "10px", fontSize: "1.1rem" }}>
                  📊 Chiffres clés des violations en France
                </p>
                <ul style={{ color: colors.textSecondary, fontSize: "0.9rem", paddingLeft: "20px", lineHeight: "1.8", margin: 0 }}>
                  <li><strong>2023 :</strong> +20% de notifications de violations vs 2022</li>
                  <li><strong>Secteurs les plus touchés :</strong> Santé (25%), Services (22%), Commerce (18%)</li>
                  <li><strong>Causes principales :</strong> Ransomware (35%), Phishing (28%), Erreur humaine (22%)</li>
                  <li><strong>Délai moyen de détection :</strong> 197 jours (source IBM Security)</li>
                </ul>
              </div>
              
              <div style={{ marginTop: "20px" }}>
                <p style={{ color: colors.accent, fontWeight: "bold", marginBottom: "10px", fontSize: "1.1rem" }}>
                  📚 Ressources officielles
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <a href="https://www.cnil.fr/fr/services-en-ligne/notifier-une-violation-de-donnees-personnelles" target="_blank" rel="noopener noreferrer" 
                     style={{ color: colors.accent, textDecoration: "none", fontWeight: "bold" }}>
                    → Guide de notification CNIL
                  </a>
                  <a href="https://www.cnil.fr/fr/RGPD-le-registre-des-activites-de-traitement" target="_blank" rel="noopener noreferrer" 
                     style={{ color: colors.accent, textDecoration: "none", fontWeight: "bold" }}>
                    → Registre des traitements (CNIL)
                  </a>
                  <a href="https://www.cybermalveillance.gouv.fr/tous-nos-contenus/actualites/etude-maturite-cyber-tpe-pme-2025" target="_blank" rel="noopener noreferrer" 
                     style={{ color: colors.accent, textDecoration: "none", fontWeight: "bold" }}>
                    → Étude maturité cyber TPE-PME 2025
                  </a>
                  <a href="https://cyber.gouv.fr/nous-connaitre/publications/panoramas-de-la-cybermenace/" target="_blank" rel="noopener noreferrer" 
                     style={{ color: colors.accent, textDecoration: "none", fontWeight: "bold" }}>
                    → Panorama des menaces cyber (ANSSI)
                  </a>
                  <a href="https://www.cnil.fr/fr/la-recherche-sur-internet-de-fuites-dinformations-rifi" target="_blank" rel="noopener noreferrer" 
                     style={{ color: colors.accent, textDecoration: "none", fontWeight: "bold" }}>
                    → RIFI - Recherche de fuites d'informations (CNIL)
                  </a>
                </div>
              </div>
            </div>

            {/* Cybercriminalité */}
            <div style={{
              background: colors.bgPrimary,
              border: "1px solid #2a3f3f",
              borderRadius: "12px",
              padding: "25px"
            }}>
              <h3 style={{ color: colors.accent, fontSize: "1.4rem", marginBottom: "15px" }}>
                👮 Cybercriminalité
              </h3>
              <p style={{ color: colors.textPrimary, lineHeight: "1.8", marginBottom: "15px" }}>
                Le Code pénal français réprime les atteintes aux systèmes de traitement automatisé de données (STAD).
              </p>
              <div style={{ background: colors.bgSecondary, padding: "20px", borderRadius: "8px" }}>
                <p style={{ color: colors.accent, fontWeight: "bold", marginBottom: "10px" }}>Articles principaux</p>
                <ul style={{ color: colors.textSecondary, paddingLeft: "20px", lineHeight: "1.8" }}>
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

      {/* Section Normes ISO - inchangée, je la conserve telle quelle */}
      {activeSection === "normes" && (
        <div>
          <h2 style={{ color: colors.accent, fontSize: "2rem", marginBottom: "30px" }}>
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
                  background: colors.bgPrimary,
                  border: "2px solid #2a3f3f",
                  borderRadius: "12px",
                  padding: "30px",
                  transition: "all 0.3s"
                }}
                onMouseEnter={(e) => e.currentTarget.style.border = "2px solid #00ff9c"}
                onMouseLeave={(e) => e.currentTarget.style.border = "2px solid #2a3f3f"}
              >
                <h3 style={{ color: colors.accent, fontSize: "1.5rem", marginBottom: "8px" }}>
                  {norme.title}
                </h3>
                <p style={{ color: colors.textSecondary, fontSize: "1rem", marginBottom: "15px", fontStyle: "italic" }}>
                  {norme.subtitle}
                </p>
                <p style={{ color: colors.textPrimary, lineHeight: "1.8", marginBottom: "20px" }}>
                  {norme.desc}
                </p>
                
                <div style={{ background: colors.bgSecondary, padding: "20px", borderRadius: "8px", marginBottom: "20px" }}>
                  <p style={{ color: colors.accent, fontWeight: "bold", marginBottom: "10px" }}>Points clés</p>
                  <ul style={{ color: colors.textSecondary, paddingLeft: "20px", lineHeight: "1.8" }}>
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
                        background: colors.bgSecondary,
                        color: colors.accent,
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
                    color: colors.accent,
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

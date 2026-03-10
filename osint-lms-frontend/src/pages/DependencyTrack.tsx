import { useState, useEffect } from "react";
import { useThemeColors } from "../context/ThemeContext";

export default function DependencyTrack() {
  const colors = useThemeColors();
  const [activeTab, setActiveTab] = useState<"presentation" | "sbom" | "usage" | "cicd">("presentation");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const CodeBlock = ({ code, id }: { code: string; id: string }) => (
    <div style={{ position: "relative" as const, marginBottom: "20px" }}>
      <pre style={{
        background: colors.bgPrimary,
        border: "1px solid #2a3f3f",
        borderRadius: "8px",
        padding: "20px",
        overflowX: "auto",
        color: colors.accent,
        fontFamily: "monospace",
        fontSize: "0.9rem",
        lineHeight: "1.6",
        margin: 0
      }}>{code}</pre>
      <button
        onClick={() => copyToClipboard(code, id)}
        style={{
          position: "absolute" as const,
          top: "10px",
          right: "10px",
          background: copiedCode === id ? colors.accent : colors.bgSecondary,
          color: copiedCode === id ? colors.bgPrimary : colors.textSecondary,
          border: "1px solid #2a3f3f",
          borderRadius: "6px",
          padding: "6px 12px",
          cursor: "pointer",
          fontSize: "0.8rem",
          fontWeight: "bold",
          transition: "all 0.3s"
        }}
      >
        {copiedCode === id ? "✓ Copié !" : "Copier"}
      </button>
    </div>
  );

  return (
    <main style={{ paddingTop: "80px", padding: "40px", maxWidth: "1400px", margin: "0 auto", minHeight: "100vh", background: colors.bgPrimary }}>

      {/* Header */}
      <div style={{ marginBottom: "40px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "15px" }}>
          <div style={{ fontSize: "4rem" }}>🔗</div>
          <div>
            <h1 style={{ color: colors.accent, fontSize: "2.5rem", margin: 0 }}>
              OWASP Dependency-Track
            </h1>
            <p style={{ color: colors.textSecondary, fontSize: "1rem", margin: 0 }}>
              Intelligence Platform for Supply Chain Security
            </p>
          </div>
        </div>

        {/* Badges */}
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" as const }}>
          {[
            { label: "Open Source", color: "#22c55e" },
            { label: "OWASP Project", color: colors.accent },
            { label: "CycloneDX", color: "#3b82f6" },
            { label: "SPDX", color: "#8b5cf6" },
            { label: "CVE Detection", color: "#ef4444" }
          ].map((badge, i) => (
            <span key={i} style={{
              background: colors.bgSecondary,
              color: badge.color,
              border: `1px solid ${badge.color}`,
              padding: "5px 12px",
              borderRadius: "6px",
              fontSize: "0.85rem",
              fontWeight: "bold"
            }}>{badge.label}</span>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display: "flex",
        gap: "10px",
        marginBottom: "35px",
        borderBottom: "2px solid #2a3f3f",
        paddingBottom: "10px",
        flexWrap: "wrap" as const
      }}>
        {[
          { key: "presentation", label: "🔍 Présentation" },
          { key: "sbom", label: "📦 SBOM & Formats" },
          { key: "usage", label: "🚀 Installation & Usage" },
          { key: "cicd", label: "⚙️ CI/CD Pipeline" }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            style={{
              background: activeTab === tab.key ? colors.accent : "transparent",
              color: activeTab === tab.key ? colors.bgPrimary : colors.accent,
              border: activeTab === tab.key ? "none" : "1px solid #2a3f3f",
              padding: "12px 24px",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "1rem",
              transition: "all 0.3s"
            }}
          >{tab.label}</button>
        ))}
      </div>

      {/* ===== TAB PRÉSENTATION ===== */}
      {activeTab === "presentation" && (
        <div>
          {/* Qu'est-ce que DT ? */}
          <div style={{
            background: colors.bgPrimary,
            border: "2px solid #00ff9c",
            borderRadius: "12px",
            padding: "35px",
            marginBottom: "30px"
          }}>
            <h2 style={{ color: colors.accent, fontSize: "1.8rem", marginBottom: "20px" }}>
              Qu'est-ce qu'OWASP Dependency-Track ?
            </h2>
            <p style={{ color: colors.textPrimary, lineHeight: "1.9", fontSize: "1.05rem", marginBottom: "20px" }}>
              <strong>OWASP Dependency-Track</strong> est une plateforme intelligente d'analyse de la chaîne logicielle (Supply Chain Security).
              Elle permet aux équipes de sécurité et de développement d'identifier et de réduire les risques liés
              aux composants tiers utilisés dans leurs applications.
            </p>
            <p style={{ color: colors.textPrimary, lineHeight: "1.9", fontSize: "1.05rem" }}>
              En ingérant des <strong style={{ color: colors.accent }}>Software Bill of Materials (SBOM)</strong>, Dependency-Track corrèle
              automatiquement les composants identifiés avec des sources d'intelligence de vulnérabilités comme
              le <strong style={{ color: colors.accent }}>NVD (National Vulnerability Database)</strong>,
              GitHub Advisories, OSS Index et d'autres flux CTI.
            </p>
          </div>

          {/* Stats rapides */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "20px",
            marginBottom: "30px"
          }}>
            {[
              { icon: "⭐", value: "5.2k+", label: "GitHub Stars" },
              { icon: "📦", value: "500M+", label: "Composants analysés/mois" },
              { icon: "🛡️", value: "CVE / CWE", label: "Standards supportés" },
              { icon: "🏢", value: "Fortune 500", label: "Clients entreprises" }
            ].map((stat, idx) => (
              <div key={idx} style={{
                background: colors.bgPrimary,
                border: "1px solid #00ff9c",
                borderRadius: "10px",
                padding: "20px",
                textAlign: "center"
              }}>
                <div style={{ fontSize: "2.5rem", marginBottom: "8px" }}>{stat.icon}</div>
                <div style={{ color: colors.accent, fontSize: "1.8rem", fontWeight: "bold" }}>{stat.value}</div>
                <div style={{ color: colors.textSecondary, fontSize: "0.9rem" }}>{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Fonctionnalités */}
          <h2 style={{ color: colors.accent, fontSize: "1.8rem", marginBottom: "25px" }}>
            ⚡ Fonctionnalités principales
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px", marginBottom: "30px" }}>
            {[
              {
                icon: "🔍",
                title: "Analyse de composants",
                desc: "Identification automatique de toutes les dépendances directes et transitives avec leurs versions et licences."
              },
              {
                icon: "🚨",
                title: "Détection de CVE en temps réel",
                desc: "Corrélation avec NVD, GitHub Advisories, OSS Index. Alertes dès la publication d'une nouvelle vulnérabilité."
              },
              {
                icon: "📊",
                title: "Dashboards & Métriques",
                desc: "Visualisation du risque par projet, portefeuille et composant. Score CVSS, EPSS et exploitabilité."
              },
              {
                icon: "📜",
                title: "Audit de licences",
                desc: "Détection des licences non conformes (GPL, LGPL, etc.) pour assurer la conformité légale."
              },
              {
                icon: "🔌",
                title: "REST API complète",
                desc: "API documentée OpenAPI pour intégration dans vos outils DevSecOps, SIEM et SOAR."
              },
              {
                icon: "🏷️",
                title: "Policy Engine",
                desc: "Définissez des politiques de sécurité et recevez des violations automatiquement (sévérité, licence, CPE)."
              },
              {
                icon: "🔗",
                title: "Intégrations natives",
                desc: "Jenkins, GitLab CI, GitHub Actions, Azure DevOps, Jira, Slack, Microsoft Teams, MISP."
              },
              {
                icon: "📁",
                title: "Support multi-formats SBOM",
                desc: "CycloneDX (JSON/XML), SPDX (2.3), SWID Tags. Support de toutes les versions."
              }
            ].map((feature, idx) => (
              <div key={idx} style={{
                background: colors.bgPrimary,
                border: "1px solid #2a3f3f",
                borderRadius: "10px",
                padding: "25px",
                transition: "all 0.3s"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.border = "1px solid #00ff9c";
                e.currentTarget.style.transform = "translateY(-4px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.border = "1px solid #2a3f3f";
                e.currentTarget.style.transform = "translateY(0)";
              }}>
                <div style={{ fontSize: "2.5rem", marginBottom: "12px" }}>{feature.icon}</div>
                <h3 style={{ color: colors.accent, fontSize: "1.1rem", marginBottom: "10px" }}>{feature.title}</h3>
                <p style={{ color: colors.textSecondary, lineHeight: "1.7", margin: 0 }}>{feature.desc}</p>
              </div>
            ))}
          </div>

          {/* Cas d'usage */}
          <h2 style={{ color: colors.accent, fontSize: "1.8rem", marginBottom: "25px" }}>
            🎯 Cas d'usage concrets
          </h2>
          <div style={{ display: "grid", gap: "15px" }}>
            {[
              {
                scenario: "DevSecOps pipeline",
                desc: "Bloquez automatiquement les builds contenant des dépendances avec des CVE critiques (CVSS ≥ 9.0) avant le déploiement en production.",
                impact: "⬇️ Réduction du risque supply chain de 70%"
              },
              {
                scenario: "Audit de sécurité",
                desc: "Produisez un rapport exhaustif de toutes les vulnérabilités connues dans votre portefeuille applicatif en quelques minutes.",
                impact: "⏱️ Audit de centaines d'applications en < 1h"
              },
              {
                scenario: "Conformité réglementaire",
                desc: "Répondez aux exigences NIS 2, ISO 27001, SOC 2 et Executive Order US concernant la sécurité de la chaîne logicielle.",
                impact: "📋 SBOM attestation automatisée"
              },
              {
                scenario: "Gestion des licences open source",
                desc: "Détectez les licences copyleft (GPL, AGPL) incompatibles avec votre modèle commercial avant qu'elles ne créent des obligations légales.",
                impact: "⚖️ Risque légal maîtrisé"
              }
            ].map((use, idx) => (
              <div key={idx} style={{
                background: colors.bgPrimary,
                border: "1px solid #2a3f3f",
                borderRadius: "10px",
                padding: "20px",
                display: "flex",
                gap: "20px",
                alignItems: "flex-start"
              }}>
                <div style={{
                  background: colors.bgSecondary,
                  color: colors.accent,
                  padding: "10px 15px",
                  borderRadius: "8px",
                  fontWeight: "bold",
                  fontSize: "0.9rem",
                  minWidth: "180px",
                  textAlign: "center"
                }}>
                  {use.scenario}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ color: colors.textPrimary, lineHeight: "1.7", marginBottom: "8px" }}>{use.desc}</p>
                  <span style={{ color: colors.accent, fontWeight: "bold", fontSize: "0.9rem" }}>{use.impact}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===== TAB SBOM ===== */}
      {activeTab === "sbom" && (
        <div>
          <div style={{
            background: colors.bgPrimary,
            border: "2px solid #00ff9c",
            borderRadius: "12px",
            padding: "35px",
            marginBottom: "30px"
          }}>
            <h2 style={{ color: colors.accent, fontSize: "1.8rem", marginBottom: "20px" }}>
              📦 Software Bill of Materials (SBOM)
            </h2>
            <p style={{ color: colors.textPrimary, lineHeight: "1.9", fontSize: "1.05rem" }}>
              Un <strong style={{ color: colors.accent }}>SBOM</strong> est une liste exhaustive et formalisée de tous les composants,
              bibliothèques et dépendances qui constituent un logiciel — équivalent d'une liste d'ingrédients
              pour un médicament. Il permet d'identifier rapidement les composants vulnérables et de gérer
              proactivement les risques de la chaîne d'approvisionnement logicielle.
            </p>
          </div>

          {/* Formats */}
          <h2 style={{ color: colors.accent, fontSize: "1.8rem", marginBottom: "25px" }}>
            📋 Formats SBOM supportés
          </h2>
          <div style={{ display: "grid", gap: "25px", marginBottom: "35px" }}>
            {[
              {
                name: "CycloneDX",
                version: "v1.4 / v1.5 / v1.6",
                org: "OWASP Foundation",
                desc: "Format moderne, léger et orienté sécurité. Standard de facto pour l'écosystème DevSecOps. Supporte JSON et XML.",
                recommended: true,
                example: `{
  "bomFormat": "CycloneDX",
  "specVersion": "1.5",
  "version": 1,
  "metadata": {
    "timestamp": "2024-01-15T10:00:00Z",
    "component": {
      "name": "mon-app",
      "version": "2.1.0"
    }
  },
  "components": [
    {
      "type": "library",
      "name": "express",
      "version": "4.18.2",
      "purl": "pkg:npm/express@4.18.2",
      "licenses": [{ "license": { "id": "MIT" } }]
    }
  ]
}`
              },
              {
                name: "SPDX",
                version: "v2.3",
                org: "Linux Foundation",
                desc: "Standard ISO/IEC 5962:2021 pour la documentation des licences. Utilisé massivement dans l'écosystème open source.",
                recommended: false,
                example: `SPDXVersion: SPDX-2.3
DataLicense: CC0-1.0
SPDXID: SPDXRef-DOCUMENT
DocumentName: mon-app-2.1.0
DocumentNamespace: https://example.com/mon-app-2.1.0

PackageName: express
SPDXID: SPDXRef-express
PackageVersion: 4.18.2
PackageDownloadLocation: https://registry.npmjs.org/express
FilesAnalyzed: false
PackageLicenseConcluded: MIT
PackageLicenseDeclared: MIT`
              }
            ].map((format, idx) => (
              <div key={idx} style={{
                background: colors.bgPrimary,
                border: `2px solid ${format.recommended ? "#fbbf24" : colors.border}`,
                borderRadius: "12px",
                padding: "30px"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
                  <div>
                    <h3 style={{ color: colors.accent, fontSize: "1.5rem", margin: 0 }}>{format.name}</h3>
                    <p style={{ color: colors.textSecondary, fontSize: "0.9rem", margin: "5px 0 0 0" }}>
                      {format.org} • {format.version}
                    </p>
                  </div>
                  {format.recommended && (
                    <span style={{
                      background: "#fbbf24",
                      color: colors.bgPrimary,
                      padding: "6px 14px",
                      borderRadius: "6px",
                      fontWeight: "bold",
                      fontSize: "0.85rem"
                    }}>⭐ RECOMMANDÉ</span>
                  )}
                </div>
                <p style={{ color: colors.textPrimary, lineHeight: "1.7", marginBottom: "20px" }}>{format.desc}</p>
                <h4 style={{ color: colors.textSecondary, marginBottom: "10px" }}>Exemple de fichier :</h4>
                <CodeBlock code={format.example} id={`sbom-${idx}`} />
              </div>
            ))}
          </div>

          {/* Génération SBOM */}
          <h2 style={{ color: colors.accent, fontSize: "1.8rem", marginBottom: "25px" }}>
            🔧 Générer un SBOM par écosystème
          </h2>
          <div style={{ display: "grid", gap: "20px" }}>
            {[
              {
                eco: "Node.js / npm",
                icon: "🟩",
                cmd: "npx @cyclonedx/cyclonedx-npm --output-format JSON --output-file sbom.json"
              },
              {
                eco: "Python / pip",
                icon: "🐍",
                cmd: "pip install cyclonedx-bom\ncyclonedx-py environment --format json -o sbom.json"
              },
              {
                eco: "Java / Maven",
                icon: "☕",
                cmd: "mvn org.cyclonedx:cyclonedx-maven-plugin:makeAggregateBom"
              },
              {
                eco: "Java / Gradle",
                icon: "🐘",
                cmd: `// build.gradle\nplugins { id 'org.cyclonedx.bom' version '1.8.0' }\n\n./gradlew cyclonedxBom`
              },
              {
                eco: "Go",
                icon: "🐹",
                cmd: "go install github.com/CycloneDX/cyclonedx-gomod/cmd/cyclonedx-gomod@latest\ncyclonedx-gomod app -output sbom.json"
              },
              {
                eco: "Docker / Container",
                icon: "🐳",
                cmd: "# Avec Syft (Anchore)\nsyft mon-image:latest -o cyclonedx-json=sbom.json\n\n# Avec Trivy\ntrivy image --format cyclonedx mon-image:latest -o sbom.json"
              }
            ].map((item, idx) => (
              <div key={idx} style={{
                background: colors.bgPrimary,
                border: "1px solid #2a3f3f",
                borderRadius: "10px",
                padding: "20px"
              }}>
                <h4 style={{ color: colors.accent, marginBottom: "12px", fontSize: "1.1rem" }}>
                  {item.icon} {item.eco}
                </h4>
                <CodeBlock code={item.cmd} id={`gen-${idx}`} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===== TAB USAGE ===== */}
      {activeTab === "usage" && (
        <div>
          <h2 style={{ color: colors.accent, fontSize: "1.8rem", marginBottom: "25px" }}>
            🚀 Installation avec Docker
          </h2>

          <div style={{ display: "grid", gap: "25px" }}>
            {/* Prérequis */}
            <div style={{
              background: colors.bgPrimary,
              border: "1px solid #2a3f3f",
              borderRadius: "10px",
              padding: "25px"
            }}>
              <h3 style={{ color: colors.accent, marginBottom: "15px" }}>📋 Prérequis</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "10px" }}>
                {[
                  { label: "Docker", min: "20.10+" },
                  { label: "Docker Compose", min: "2.0+" },
                  { label: "RAM", min: "4 GB (8 GB recommandé)" },
                  { label: "Disque", min: "10 GB+" }
                ].map((req, idx) => (
                  <div key={idx} style={{ background: colors.bgSecondary, padding: "12px", borderRadius: "8px" }}>
                    <p style={{ color: colors.accent, fontWeight: "bold", margin: 0 }}>{req.label}</p>
                    <p style={{ color: colors.textSecondary, fontSize: "0.9rem", margin: "4px 0 0 0" }}>{req.min}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Docker Compose */}
            <div style={{
              background: colors.bgPrimary,
              border: "1px solid #2a3f3f",
              borderRadius: "10px",
              padding: "25px"
            }}>
              <h3 style={{ color: colors.accent, marginBottom: "15px" }}>🐳 Démarrage rapide (Docker Compose)</h3>
              <CodeBlock code={`# Télécharger le fichier docker-compose officiel
curl -LO https://dependencytrack.org/docker-compose.yml

# Lancer DependencyTrack
docker-compose up -d

# Vérifier que les containers sont lancés
docker-compose ps

# Voir les logs
docker-compose logs -f

# Accès interface web
# http://localhost:8080
# Login par défaut : admin / admin
# ⚠️ CHANGEZ LE MOT DE PASSE IMMÉDIATEMENT`} id="docker-compose" />
            </div>

            {/* Config docker-compose.yml */}
            <div style={{
              background: colors.bgPrimary,
              border: "1px solid #2a3f3f",
              borderRadius: "10px",
              padding: "25px"
            }}>
              <h3 style={{ color: colors.accent, marginBottom: "15px" }}>📄 docker-compose.yml (production)</h3>
              <CodeBlock code={`version: '3.7'

services:
  dtrack-apiserver:
    image: dependencytrack/apiserver:latest
    environment:
      - ALPINE_DATABASE_MODE=external
      - ALPINE_DATABASE_URL=jdbc:postgresql://postgres:5432/dtrack
      - ALPINE_DATABASE_DRIVER=org.postgresql.Driver
      - ALPINE_DATABASE_USERNAME=dtrack
      - ALPINE_DATABASE_PASSWORD=\${POSTGRES_PASSWORD}
    volumes:
      - dtrack-data:/data
    ports:
      - "8080:8080"
    restart: unless-stopped

  dtrack-frontend:
    image: dependencytrack/frontend:latest
    environment:
      - API_BASE_URL=http://localhost:8080
    ports:
      - "8081:8080"
    restart: unless-stopped

  postgres:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=dtrack
      - POSTGRES_USER=dtrack
      - POSTGRES_PASSWORD=\${POSTGRES_PASSWORD}
    volumes:
      - postgres-data:/var/lib/postgresql/data
    restart: unless-stopped

volumes:
  dtrack-data:
  postgres-data:`} id="compose-yml" />
            </div>

            {/* Upload SBOM via API */}
            <div style={{
              background: colors.bgPrimary,
              border: "1px solid #2a3f3f",
              borderRadius: "10px",
              padding: "25px"
            }}>
              <h3 style={{ color: colors.accent, marginBottom: "15px" }}>📤 Upload SBOM via API</h3>
              <CodeBlock code={`# 1. Obtenir un token API
curl -X POST http://localhost:8080/api/v1/user/login \\
  -H "Content-Type: application/x-www-form-urlencoded" \\
  -d "username=admin&password=admin"

# 2. Créer un projet
curl -X PUT http://localhost:8080/api/v1/project \\
  -H "X-Api-Key: VOTRE_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"name": "mon-app", "version": "2.1.0"}'

# 3. Uploader le SBOM (base64)
SBOM_B64=$(base64 -w 0 sbom.json)

curl -X PUT http://localhost:8080/api/v1/bom \\
  -H "X-Api-Key: VOTRE_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d "{
    \\"project\\": \\"UUID_DU_PROJET\\",
    \\"bom\\": \\"$SBOM_B64\\"
  }"`} id="api-upload" />
            </div>

            {/* Lien officiel */}
            <div style={{
              background: colors.bgSecondary,
              border: "1px solid #00ff9c",
              borderRadius: "10px",
              padding: "20px",
              textAlign: "center"
            }}>
              <a
                href="https://docs.dependencytrack.org"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-block",
                  background: colors.accent,
                  color: colors.bgPrimary,
                  padding: "14px 35px",
                  borderRadius: "8px",
                  textDecoration: "none",
                  fontWeight: "bold",
                  fontSize: "1.05rem",
                  transition: "all 0.3s"
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
              >
                📚 Documentation officielle
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ===== TAB CI/CD ===== */}
      {activeTab === "cicd" && (
        <div>
          <h2 style={{ color: colors.accent, fontSize: "1.8rem", marginBottom: "25px" }}>
            ⚙️ Intégration CI/CD Pipeline
          </h2>

          <div style={{ display: "grid", gap: "25px" }}>
            {/* GitHub Actions */}
            <div style={{
              background: colors.bgPrimary,
              border: "2px solid #00ff9c",
              borderRadius: "12px",
              padding: "30px"
            }}>
              <h3 style={{ color: colors.accent, fontSize: "1.4rem", marginBottom: "20px" }}>
                🐙 GitHub Actions
              </h3>
              <CodeBlock code={`name: Security - SBOM & Dependency-Track

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  sbom-analysis:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Generate SBOM (CycloneDX)
        run: |
          npx @cyclonedx/cyclonedx-npm \\
            --output-format JSON \\
            --output-file sbom.json

      - name: Upload SBOM to Dependency-Track
        uses: DependencyTrack/gh-upload-sbom@v3
        with:
          serverhostname: \${{ secrets.DT_SERVER }}
          apikey: \${{ secrets.DT_API_KEY }}
          projectname: \${{ github.repository }}
          projectversion: \${{ github.ref_name }}
          bomfilename: sbom.json
          autocreate: true

      - name: Check for critical vulnerabilities
        run: |
          # Attendre l'analyse DT (30s)
          sleep 30
          
          # Vérifier les vulnérabilités critiques
          CRITICAL=$(curl -s \\
            -H "X-Api-Key: \${{ secrets.DT_API_KEY }}" \\
            "\${{ secrets.DT_SERVER }}/api/v1/project?name=\${{ github.repository }}" \\
            | jq '.[] | .metrics.critical')
          
          if [ "$CRITICAL" -gt "0" ]; then
            echo "❌ $CRITICAL vulnérabilité(s) critique(s) détectée(s) !"
            exit 1
          fi
          
          echo "✅ Aucune vulnérabilité critique détectée"

      - name: Archive SBOM
        uses: actions/upload-artifact@v4
        with:
          name: sbom-\${{ github.sha }}
          path: sbom.json`} id="github-actions" />
            </div>

            {/* GitLab CI */}
            <div style={{
              background: colors.bgPrimary,
              border: "1px solid #2a3f3f",
              borderRadius: "12px",
              padding: "30px"
            }}>
              <h3 style={{ color: colors.accent, fontSize: "1.4rem", marginBottom: "20px" }}>
                🦊 GitLab CI/CD
              </h3>
              <CodeBlock code={`stages:
  - build
  - security
  - deploy

sbom-and-security-scan:
  stage: security
  image: node:20-alpine
  script:
    - npm ci
    - npx @cyclonedx/cyclonedx-npm --output-format JSON --output-file sbom.json
    - |
      curl -X PUT "$DT_SERVER/api/v1/bom" \\
        -H "X-Api-Key: $DT_API_KEY" \\
        -H "Content-Type: multipart/form-data" \\
        -F "projectName=$CI_PROJECT_NAME" \\
        -F "projectVersion=$CI_COMMIT_REF_NAME" \\
        -F "autoCreate=true" \\
        -F "bom=@sbom.json"
  artifacts:
    paths:
      - sbom.json
    expire_in: 30 days
  rules:
    - if: $CI_COMMIT_BRANCH == "main"
    - if: $CI_PIPELINE_SOURCE == "merge_request_event"`} id="gitlab-ci" />
            </div>

            {/* Jenkins */}
            <div style={{
              background: colors.bgPrimary,
              border: "1px solid #2a3f3f",
              borderRadius: "12px",
              padding: "30px"
            }}>
              <h3 style={{ color: colors.accent, fontSize: "1.4rem", marginBottom: "20px" }}>
                🔧 Jenkins (Jenkinsfile)
              </h3>
              <CodeBlock code={`pipeline {
    agent any
    
    stages {
        stage('Checkout') {
            steps { checkout scm }
        }
        
        stage('Generate SBOM') {
            steps {
                sh 'npm ci'
                sh '''
                    npx @cyclonedx/cyclonedx-npm \\
                        --output-format JSON \\
                        --output-file sbom.json
                '''
            }
        }
        
        stage('Upload to Dependency-Track') {
            steps {
                dependencyTrackPublisher(
                    projectName: env.JOB_NAME,
                    projectVersion: env.BUILD_NUMBER,
                    artifact: 'sbom.json',
                    artifactType: 'bom',
                    synchronous: true,
                    dependencyTrackUrl: env.DT_SERVER,
                    dependencyTrackApiKey: env.DT_API_KEY,
                    autoCreateProjects: true
                )
            }
        }
        
        stage('Security Gate') {
            steps {
                script {
                    if (currentBuild.result == 'FAILURE') {
                        error('❌ Security gate failed: critical vulnerabilities detected')
                    }
                }
            }
        }
    }
    
    post {
        always {
            archiveArtifacts artifacts: 'sbom.json'
        }
    }
}`} id="jenkins" />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

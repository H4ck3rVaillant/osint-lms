import { useState, useEffect } from "react";
import { useThemeColors } from "../context/ThemeContext";

interface Dependency {
  id: number;
  name: string;
  version: string;
  type: "direct" | "transitive";
  license: string;
  vulnerabilities: number;
  severity: "critical" | "high" | "medium" | "low" | "none";
  lastUpdate: string;
  description: string;
}

export default function DependencyTrack() {
  const colors = useThemeColors();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSeverity, setFilterSeverity] = useState<string>("all");
  const [selectedDep, setSelectedDep] = useState<Dependency | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Base de données simulée de dépendances
  const dependencies: Dependency[] = [
    {
      id: 1,
      name: "react",
      version: "18.2.0",
      type: "direct",
      license: "MIT",
      vulnerabilities: 0,
      severity: "none",
      lastUpdate: "2024-01-15",
      description: "Bibliothèque JavaScript pour construire des interfaces utilisateur"
    },
    {
      id: 2,
      name: "axios",
      version: "0.27.2",
      type: "direct",
      license: "MIT",
      vulnerabilities: 2,
      severity: "high",
      lastUpdate: "2023-11-20",
      description: "Client HTTP basé sur les promesses pour navigateur et Node.js"
    },
    {
      id: 3,
      name: "lodash",
      version: "4.17.19",
      type: "transitive",
      license: "MIT",
      vulnerabilities: 1,
      severity: "medium",
      lastUpdate: "2023-08-10",
      description: "Bibliothèque d'utilitaires JavaScript moderne"
    },
    {
      id: 4,
      name: "express",
      version: "4.18.2",
      type: "direct",
      license: "MIT",
      vulnerabilities: 0,
      severity: "none",
      lastUpdate: "2024-02-01",
      description: "Framework web minimaliste et flexible pour Node.js"
    },
    {
      id: 5,
      name: "moment",
      version: "2.29.1",
      type: "transitive",
      license: "MIT",
      vulnerabilities: 3,
      severity: "critical",
      lastUpdate: "2022-05-15",
      description: "Bibliothèque de manipulation de dates JavaScript (obsolète)"
    },
    {
      id: 6,
      name: "webpack",
      version: "5.88.2",
      type: "direct",
      license: "MIT",
      vulnerabilities: 0,
      severity: "none",
      lastUpdate: "2024-01-30",
      description: "Bundler de modules JavaScript"
    },
    {
      id: 7,
      name: "socket.io",
      version: "4.5.1",
      type: "direct",
      license: "MIT",
      vulnerabilities: 1,
      severity: "low",
      lastUpdate: "2023-12-05",
      description: "Communication temps réel bidirectionnelle basée sur événements"
    },
    {
      id: 8,
      name: "jsonwebtoken",
      version: "8.5.1",
      type: "direct",
      license: "MIT",
      vulnerabilities: 2,
      severity: "high",
      lastUpdate: "2023-09-12",
      description: "Implémentation de JSON Web Tokens"
    }
  ];

  const filteredDeps = dependencies.filter(dep => {
    const matchesSearch = dep.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         dep.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity = filterSeverity === "all" || dep.severity === filterSeverity;
    return matchesSearch && matchesSeverity;
  });

  const stats = {
    total: dependencies.length,
    vulnerable: dependencies.filter(d => d.vulnerabilities > 0).length,
    critical: dependencies.filter(d => d.severity === "critical").length,
    high: dependencies.filter(d => d.severity === "high").length,
    medium: dependencies.filter(d => d.severity === "medium").length,
    low: dependencies.filter(d => d.severity === "low").length,
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "#dc2626";
      case "high": return "#f59e0b";
      case "medium": return "#fbbf24";
      case "low": return "#3b82f6";
      default: return colors.accent;
    }
  };

  const getSeverityBg = (severity: string) => {
    switch (severity) {
      case "critical": return "#dc262620";
      case "high": return "#f59e0b20";
      case "medium": return "#fbbf2420";
      case "low": return "#3b82f620";
      default: return colors.accent + "20";
    }
  };

  return (
    <main style={{ 
      paddingTop: "80px",
      padding: "40px", 
      maxWidth: "1600px", 
      margin: "0 auto",
      minHeight: "100vh",
      background: colors.bgPrimary
    }}>
      {/* Header */}
      <div style={{ marginBottom: "40px" }}>
        <h1 style={{ color: colors.accent, fontSize: "2.5rem", marginBottom: "10px" }}>
          📦 Dependency Track
        </h1>
        <p style={{ color: colors.textSecondary, fontSize: "1.2rem", lineHeight: "1.6" }}>
          Surveillez et gérez les vulnérabilités de vos dépendances logicielles
        </p>
      </div>

      {/* Statistics Cards */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "20px",
        marginBottom: "40px"
      }}>
        <div style={{
          background: colors.bgSecondary,
          border: `2px solid ${colors.border}`,
          borderRadius: "12px",
          padding: "20px"
        }}>
          <div style={{ color: colors.textSecondary, fontSize: "0.9rem", marginBottom: "8px" }}>
            Total Dépendances
          </div>
          <div style={{ color: colors.accent, fontSize: "2.5rem", fontWeight: "700" }}>
            {stats.total}
          </div>
        </div>

        <div style={{
          background: colors.bgSecondary,
          border: `2px solid ${stats.vulnerable > 0 ? "#dc2626" : colors.border}`,
          borderRadius: "12px",
          padding: "20px"
        }}>
          <div style={{ color: colors.textSecondary, fontSize: "0.9rem", marginBottom: "8px" }}>
            Vulnérables
          </div>
          <div style={{ color: stats.vulnerable > 0 ? "#dc2626" : colors.accent, fontSize: "2.5rem", fontWeight: "700" }}>
            {stats.vulnerable}
          </div>
        </div>

        <div style={{
          background: "#dc262620",
          border: "2px solid #dc2626",
          borderRadius: "12px",
          padding: "20px"
        }}>
          <div style={{ color: colors.textSecondary, fontSize: "0.9rem", marginBottom: "8px" }}>
            🔴 Critical
          </div>
          <div style={{ color: "#dc2626", fontSize: "2.5rem", fontWeight: "700" }}>
            {stats.critical}
          </div>
        </div>

        <div style={{
          background: "#f59e0b20",
          border: "2px solid #f59e0b",
          borderRadius: "12px",
          padding: "20px"
        }}>
          <div style={{ color: colors.textSecondary, fontSize: "0.9rem", marginBottom: "8px" }}>
            🟠 High
          </div>
          <div style={{ color: "#f59e0b", fontSize: "2.5rem", fontWeight: "700" }}>
            {stats.high}
          </div>
        </div>

        <div style={{
          background: "#fbbf2420",
          border: "2px solid #fbbf24",
          borderRadius: "12px",
          padding: "20px"
        }}>
          <div style={{ color: colors.textSecondary, fontSize: "0.9rem", marginBottom: "8px" }}>
            🟡 Medium
          </div>
          <div style={{ color: "#fbbf24", fontSize: "2.5rem", fontWeight: "700" }}>
            {stats.medium}
          </div>
        </div>

        <div style={{
          background: "#3b82f620",
          border: "2px solid #3b82f6",
          borderRadius: "12px",
          padding: "20px"
        }}>
          <div style={{ color: colors.textSecondary, fontSize: "0.9rem", marginBottom: "8px" }}>
            🔵 Low
          </div>
          <div style={{ color: "#3b82f6", fontSize: "2.5rem", fontWeight: "700" }}>
            {stats.low}
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div style={{ display: "flex", gap: "15px", marginBottom: "30px", flexWrap: "wrap" }}>
        <input
          type="text"
          placeholder="🔍 Rechercher une dépendance..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            flex: 1,
            minWidth: "300px",
            padding: "15px 20px",
            background: colors.bgSecondary,
            border: `2px solid ${colors.border}`,
            borderRadius: "12px",
            color: colors.textPrimary,
            fontSize: "1rem"
          }}
        />

        <select
          value={filterSeverity}
          onChange={(e) => setFilterSeverity(e.target.value)}
          style={{
            padding: "15px 20px",
            background: colors.bgSecondary,
            border: `2px solid ${colors.border}`,
            borderRadius: "12px",
            color: colors.textPrimary,
            fontSize: "1rem",
            cursor: "pointer"
          }}
        >
          <option value="all">Tous les niveaux</option>
          <option value="critical">🔴 Critical</option>
          <option value="high">🟠 High</option>
          <option value="medium">🟡 Medium</option>
          <option value="low">🔵 Low</option>
          <option value="none">✅ Aucune vulnérabilité</option>
        </select>
      </div>

      {/* Dependencies Table */}
      <div style={{
        background: colors.bgSecondary,
        borderRadius: "12px",
        border: `1px solid ${colors.border}`,
        overflow: "hidden"
      }}>
        {/* Table Header */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 1fr",
          gap: "15px",
          padding: "20px",
          background: colors.bgPrimary,
          borderBottom: `1px solid ${colors.border}`,
          fontWeight: "600",
          color: colors.textSecondary,
          fontSize: "0.9rem"
        }}>
          <div>Package</div>
          <div>Version</div>
          <div>Type</div>
          <div>License</div>
          <div>Vulnérabilités</div>
          <div>Sévérité</div>
        </div>

        {/* Table Body */}
        {filteredDeps.length === 0 ? (
          <div style={{ padding: "40px", textAlign: "center", color: colors.textSecondary }}>
            Aucune dépendance trouvée
          </div>
        ) : (
          filteredDeps.map((dep) => (
            <div
              key={dep.id}
              onClick={() => setSelectedDep(dep)}
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 1fr",
                gap: "15px",
                padding: "20px",
                borderBottom: `1px solid ${colors.border}`,
                cursor: "pointer",
                transition: "background 0.2s",
                background: selectedDep?.id === dep.id ? colors.bgPrimary : "transparent"
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = colors.bgPrimary}
              onMouseLeave={(e) => {
                if (selectedDep?.id !== dep.id) {
                  e.currentTarget.style.background = "transparent";
                }
              }}
            >
              <div>
                <div style={{ color: colors.textPrimary, fontWeight: "600", marginBottom: "4px" }}>
                  {dep.name}
                </div>
                <div style={{ color: colors.textSecondary, fontSize: "0.85rem" }}>
                  {dep.description.substring(0, 60)}...
                </div>
              </div>
              <div style={{ color: colors.textPrimary, fontFamily: "monospace" }}>
                v{dep.version}
              </div>
              <div>
                <span style={{
                  background: dep.type === "direct" ? colors.accent + "20" : colors.bgPrimary,
                  color: dep.type === "direct" ? colors.accent : colors.textSecondary,
                  padding: "4px 10px",
                  borderRadius: "6px",
                  fontSize: "0.85rem",
                  fontWeight: "600"
                }}>
                  {dep.type === "direct" ? "Direct" : "Transitive"}
                </span>
              </div>
              <div style={{ color: colors.textSecondary, fontSize: "0.9rem" }}>
                {dep.license}
              </div>
              <div>
                <span style={{
                  background: dep.vulnerabilities > 0 ? "#dc262620" : colors.accent + "20",
                  color: dep.vulnerabilities > 0 ? "#dc2626" : colors.accent,
                  padding: "6px 12px",
                  borderRadius: "8px",
                  fontWeight: "700"
                }}>
                  {dep.vulnerabilities}
                </span>
              </div>
              <div>
                {dep.severity !== "none" ? (
                  <span style={{
                    background: getSeverityBg(dep.severity),
                    color: getSeverityColor(dep.severity),
                    padding: "6px 12px",
                    borderRadius: "8px",
                    fontWeight: "600",
                    fontSize: "0.85rem",
                    textTransform: "uppercase"
                  }}>
                    {dep.severity}
                  </span>
                ) : (
                  <span style={{ color: colors.accent, fontWeight: "600" }}>
                    ✓ Secure
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal détail dépendance */}
      {selectedDep && (
        <div
          onClick={() => setSelectedDep(null)}
          style={{
            position: "fixed" as const,
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.9)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px"
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: colors.bgPrimary,
              border: `2px solid ${getSeverityColor(selectedDep.severity)}`,
              borderRadius: "16px",
              padding: "40px",
              maxWidth: "800px",
              width: "100%",
              maxHeight: "80vh",
              overflowY: "auto"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "30px" }}>
              <div>
                <h2 style={{ color: colors.accent, fontSize: "2rem", marginBottom: "10px" }}>
                  {selectedDep.name}
                </h2>
                <p style={{ color: colors.textSecondary, fontSize: "1rem" }}>
                  Version: <span style={{ fontFamily: "monospace", color: colors.textPrimary }}>
                    {selectedDep.version}
                  </span>
                </p>
              </div>
              <button
                onClick={() => setSelectedDep(null)}
                style={{
                  background: "transparent",
                  color: colors.textSecondary,
                  border: "none",
                  fontSize: "2rem",
                  cursor: "pointer"
                }}
              >
                ×
              </button>
            </div>

            <div style={{
              background: getSeverityBg(selectedDep.severity),
              border: `2px solid ${getSeverityColor(selectedDep.severity)}`,
              borderRadius: "12px",
              padding: "20px",
              marginBottom: "30px"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "15px" }}>
                <span style={{ fontSize: "2rem" }}>
                  {selectedDep.severity === "critical" ? "🔴" :
                   selectedDep.severity === "high" ? "🟠" :
                   selectedDep.severity === "medium" ? "🟡" :
                   selectedDep.severity === "low" ? "🔵" : "✅"}
                </span>
                <div>
                  <div style={{ 
                    color: getSeverityColor(selectedDep.severity),
                    fontSize: "1.5rem",
                    fontWeight: "700",
                    textTransform: "uppercase"
                  }}>
                    {selectedDep.severity === "none" ? "Secure" : selectedDep.severity}
                  </div>
                  <div style={{ color: colors.textSecondary, fontSize: "0.9rem" }}>
                    {selectedDep.vulnerabilities} vulnérabilité(s) connue(s)
                  </div>
                </div>
              </div>
            </div>

            <div style={{ marginBottom: "25px" }}>
              <h3 style={{ color: colors.accent, fontSize: "1.3rem", marginBottom: "15px" }}>
                📋 Informations
              </h3>
              <div style={{ display: "grid", gap: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "12px", background: colors.bgSecondary, borderRadius: "8px" }}>
                  <span style={{ color: colors.textSecondary }}>Type:</span>
                  <span style={{ color: colors.textPrimary, fontWeight: "600" }}>
                    {selectedDep.type === "direct" ? "Direct" : "Transitive"}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "12px", background: colors.bgSecondary, borderRadius: "8px" }}>
                  <span style={{ color: colors.textSecondary }}>License:</span>
                  <span style={{ color: colors.textPrimary, fontWeight: "600" }}>
                    {selectedDep.license}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "12px", background: colors.bgSecondary, borderRadius: "8px" }}>
                  <span style={{ color: colors.textSecondary }}>Dernière mise à jour:</span>
                  <span style={{ color: colors.textPrimary, fontWeight: "600" }}>
                    {selectedDep.lastUpdate}
                  </span>
                </div>
              </div>
            </div>

            <div style={{ marginBottom: "25px" }}>
              <h3 style={{ color: colors.accent, fontSize: "1.3rem", marginBottom: "15px" }}>
                📝 Description
              </h3>
              <p style={{ color: colors.textSecondary, lineHeight: "1.8" }}>
                {selectedDep.description}
              </p>
            </div>

            {selectedDep.vulnerabilities > 0 && (
              <div style={{
                background: "#dc262610",
                border: "1px solid #dc2626",
                borderRadius: "12px",
                padding: "20px"
              }}>
                <h3 style={{ color: "#dc2626", fontSize: "1.2rem", marginBottom: "10px" }}>
                  ⚠️ Actions recommandées
                </h3>
                <ul style={{ color: colors.textSecondary, lineHeight: "2", paddingLeft: "20px", margin: 0 }}>
                  <li>Mettez à jour vers la dernière version sécurisée</li>
                  <li>Consultez les CVE associées sur MITRE ou NVD</li>
                  <li>Vérifiez si des patches sont disponibles</li>
                  <li>Envisagez une alternative si non maintenu</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

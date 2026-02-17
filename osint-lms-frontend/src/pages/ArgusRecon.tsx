import { useState } from "react";
import { Link } from "react-router-dom";

const modules = [
  { cat: "🌐 Réseau", items: ["DNS Enumeration", "WHOIS Lookup", "IP Geolocation", "Port Scanner", "SSL/TLS Analysis", "ASN Lookup"] },
  { cat: "🔍 Web", items: ["Subdomain Finder", "Tech Stack Detection", "Wayback Machine", "HTTP Headers", "robots.txt", "Sitemap Scanner"] },
  { cat: "🛡️ Sécurité", items: ["Data Breach Check", "Malware Scanner", "WAF Detection", "CVE Lookup", "Shodan Integration", "Censys Search"] },
  { cat: "👤 OSINT", items: ["Email OSINT", "Username Search", "Phone Lookup", "Social Media", "Google Dorking", "Pastebin Monitor"] },
  { cat: "📊 Analyse", items: ["VirusTotal", "URLScan.io", "AbuseIPDB", "ThreatFox", "MalwareBazaar", "AlienVault OTX"] },
];

export default function ArgusRecon() {
  const [activeTab, setActiveTab] = useState<"overview" | "install" | "modules">("overview");

  return (
    <main style={{ padding: "40px", maxWidth: "1200px", margin: "0 auto", minHeight: "100vh", background: "#0b0f1a" }}>
      {/* Header */}
      <div style={{ marginBottom: "40px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "20px" }}>
          <span style={{ fontSize: "3rem" }}>🔍</span>
          <div>
            <h1 style={{ color: "#00ff9c", fontSize: "2.5rem", margin: 0 }}>Argus V2.0</h1>
            <p style={{ color: "#9ca3af", margin: "5px 0 0" }}>Python OSINT Reconnaissance Toolkit — 50+ modules</p>
          </div>
          <Link to="/outils/argus/console" style={{
            marginLeft: "auto", padding: "12px 24px",
            background: "#00ff9c", color: "#000",
            borderRadius: "8px", textDecoration: "none",
            fontWeight: "bold", fontSize: "1rem"
          }}>
            🖥️ Lancer la Console
          </Link>
        </div>

        {/* Badges */}
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {["Python 3.x", "50+ Modules", "Open Source", "API Ready", "CLI Tool"].map(b => (
            <span key={b} style={{ background: "#1a1f2e", color: "#00ff9c", border: "1px solid #00ff9c", padding: "4px 12px", borderRadius: "20px", fontSize: "0.8rem" }}>{b}</span>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "30px", borderBottom: "1px solid #2a3f3f", paddingBottom: "10px" }}>
        {[["overview", "📋 Vue d'ensemble"], ["install", "⚙️ Installation"], ["modules", "🧩 Modules"]].map(([key, label]) => (
          <button key={key} onClick={() => setActiveTab(key as any)} style={{
            background: activeTab === key ? "#00ff9c" : "transparent",
            color: activeTab === key ? "#000" : "#9ca3af",
            border: `1px solid ${activeTab === key ? "#00ff9c" : "#2a3f3f"}`,
            padding: "10px 20px", borderRadius: "8px", cursor: "pointer", fontWeight: activeTab === key ? "bold" : "normal"
          }}>{label}</button>
        ))}
      </div>

      {/* Vue d'ensemble */}
      {activeTab === "overview" && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", marginBottom: "30px" }}>
            {[
              { icon: "🧩", label: "Modules", value: "50+" },
              { icon: "🐍", label: "Langage", value: "Python 3" },
              { icon: "⭐", label: "GitHub Stars", value: "1.2k+" },
              { icon: "🔄", label: "Version", value: "2.0" },
            ].map((s, i) => (
              <div key={i} style={{ background: "#1a1f2e", border: "1px solid #2a3f3f", borderRadius: "12px", padding: "20px", textAlign: "center" }}>
                <div style={{ fontSize: "2rem", marginBottom: "8px" }}>{s.icon}</div>
                <div style={{ color: "#00ff9c", fontSize: "1.8rem", fontWeight: "bold" }}>{s.value}</div>
                <div style={{ color: "#9ca3af", fontSize: "0.9rem" }}>{s.label}</div>
              </div>
            ))}
          </div>
          <div style={{ background: "#1a1f2e", border: "1px solid #2a3f3f", borderRadius: "12px", padding: "30px" }}>
            <h2 style={{ color: "#00ff9c", marginBottom: "20px" }}>À propos d'Argus V2.0</h2>
            <p style={{ color: "#9ca3af", lineHeight: "1.8", marginBottom: "15px" }}>
              Argus est un outil de reconnaissance OSINT complet écrit en Python. Il permet d'effectuer des investigations automatisées sur des domaines, IP, emails et bien plus encore.
            </p>
            <p style={{ color: "#9ca3af", lineHeight: "1.8" }}>
              Avec plus de 50 modules intégrés, Argus couvre tous les aspects de la reconnaissance : DNS, WHOIS, géolocalisation, détection de technologies, recherche de fuites de données, et intégration avec les principales APIs de cybersécurité.
            </p>
            <div style={{ marginTop: "20px" }}>
              <a href="https://github.com/jasonxtn/Argus" target="_blank" rel="noopener noreferrer"
                style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "10px 20px", background: "#0b0f1a", border: "1px solid #00ff9c", color: "#00ff9c", borderRadius: "8px", textDecoration: "none" }}>
                🔗 GitHub Repository
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Installation */}
      {activeTab === "install" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {[
            { title: "🐍 Via pip", cmd: "pip install argus-osint" },
            { title: "📦 Via Git", cmd: "git clone https://github.com/jasonxtn/Argus.git\ncd Argus\npip install -r requirements.txt\npython argus.py" },
            { title: "🐳 Via Docker", cmd: "docker pull jasonxtn/argus\ndocker run -it jasonxtn/argus" },
          ].map((m, i) => (
            <div key={i} style={{ background: "#1a1f2e", border: "1px solid #2a3f3f", borderRadius: "12px", padding: "25px" }}>
              <h3 style={{ color: "#00ff9c", marginBottom: "15px" }}>{m.title}</h3>
              <pre style={{ background: "#0b0f1a", border: "1px solid #2a3f3f", borderRadius: "8px", padding: "15px", color: "#e5e7eb", fontFamily: "monospace", overflow: "auto", margin: 0 }}>
                {m.cmd}
              </pre>
            </div>
          ))}
        </div>
      )}

      {/* Modules */}
      {activeTab === "modules" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
          {modules.map((cat, i) => (
            <div key={i} style={{ background: "#1a1f2e", border: "1px solid #2a3f3f", borderRadius: "12px", padding: "25px" }}>
              <h3 style={{ color: "#00ff9c", marginBottom: "15px" }}>{cat.cat}</h3>
              {cat.items.map(item => (
                <div key={item} style={{ padding: "8px 0", color: "#e5e7eb", borderBottom: "1px solid #2a3f3f", fontSize: "0.9rem" }}>
                  ✅ {item}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

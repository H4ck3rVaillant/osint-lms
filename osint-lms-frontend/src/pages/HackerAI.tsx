import { useState } from "react";

export default function HackerAI() {
  const [activeTab, setActiveTab] = useState<"presentation" | "acces" | "usage">("presentation");

  return (
    <main style={{ padding: "40px", maxWidth: "1400px", margin: "0 auto" }}>
      <div style={{ marginBottom: "40px" }}>
        <h1 style={{ color: "#00ff9c", fontSize: "2.5rem", marginBottom: "10px" }}>🤖 HackerAI</h1>
        <p style={{ color: "#9ca3af", fontSize: "1.2rem" }}>Intelligence Artificielle orientée cybersécurité - Hackerai.co</p>
        <a href="https://hackerai.co" target="_blank" rel="noopener noreferrer" style={{
          display: "inline-block", marginTop: "15px", background: "#00ff9c", color: "#0b0f1a",
          padding: "12px 24px", borderRadius: "8px", textDecoration: "none", fontWeight: "bold"
        }}>🚀 Accéder à HackerAI</a>
      </div>

      <div style={{ display: "flex", gap: "12px", marginBottom: "30px", flexWrap: "wrap" as const }}>
        {[
          { key: "presentation", label: "📖 Présentation" },
          { key: "acces", label: "🔑 Accès" },
          { key: "usage", label: "💡 Usage" }
        ].map((tab) => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key as any)} style={{
            padding: "12px 24px", background: activeTab === tab.key ? "#00ff9c" : "#1a1f2e",
            color: activeTab === tab.key ? "#0b0f1a" : "#9ca3af",
            border: `1px solid ${activeTab === tab.key ? "#00ff9c" : "#2a3f3f"}`,
            borderRadius: "8px", cursor: "pointer", fontWeight: "bold"
          }}>{tab.label}</button>
        ))}
      </div>

      {activeTab === "presentation" && (
        <>
          <section style={{ background: "#0b0f1a", border: "2px solid #00ff9c", borderRadius: "12px", padding: "30px", marginBottom: "30px" }}>
            <h2 style={{ color: "#00ff9c", fontSize: "1.8rem", marginBottom: "20px" }}>🎯 Qu'est-ce que HackerAI ?</h2>
            <p style={{ color: "#e5e7eb", lineHeight: "1.8", marginBottom: "20px" }}>
              <strong style={{ color: "#00ff9c" }}>HackerAI</strong> est une plateforme d'IA spécialisée en cybersécurité offensive et défensive. 
              Entraînée sur des millions de vulnérabilités, exploits, CVEs et techniques de pentest, elle assiste les professionnels 
              dans leurs missions d'audit, de Red Team et de Threat Hunting.
            </p>
            <div style={{ background: "#1a1f2e", border: "1px solid #fbbf24", borderRadius: "8px", padding: "20px" }}>
              <h3 style={{ color: "#fbbf24", marginBottom: "12px" }}>⚖️ Cadre Légal</h3>
              <ul style={{ color: "#9ca3af", lineHeight: "2", paddingLeft: "20px" }}>
                <li>Usage strictement réservé aux professionnels autorisés</li>
                <li>Tests de pénétration contractuels uniquement</li>
                <li>Recherche académique en cybersécurité</li>
                <li>Formation et certification (CEH, OSCP, etc.)</li>
              </ul>
              <p style={{ color: "#ef4444", marginTop: "15px", fontWeight: "bold" }}>
                ⚠️ Toute utilisation malveillante est illégale (art. 323-1 Code pénal)
              </p>
            </div>
          </section>

          <section style={{ marginBottom: "30px" }}>
            <h2 style={{ color: "#00ff9c", fontSize: "1.8rem", marginBottom: "25px" }}>⚡ Fonctionnalités</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "20px" }}>
              {[
                { icon: "🎯", title: "Analyse de Vulnérabilités", desc: "Détection automatique des failles dans le code, configs et infrastructures" },
                { icon: "🔍", title: "Reconnaissance OSINT", desc: "Collecte intelligente d'informations pour évaluation de surface d'attaque" },
                { icon: "🛡️", title: "Génération de Payloads", desc: "Création de charges utiles personnalisées pour tests de pénétration" },
                { icon: "📊", title: "Analyse de Malwares", desc: "Reverse engineering assisté pour identifier comportements malveillants" },
                { icon: "🔐", title: "Audit de Sécurité", desc: "Évaluation complète des politiques et recommandations de durcissement" },
                { icon: "⚡", title: "Automatisation Red Team", desc: "Scripts et workflows pour accélérer opérations offensives légitimes" }
              ].map((f, i) => (
                <div key={i} style={{ background: "#0b0f1a", border: "1px solid #2a3f3f", borderRadius: "12px", padding: "24px" }}>
                  <div style={{ fontSize: "2.5rem", marginBottom: "15px" }}>{f.icon}</div>
                  <h3 style={{ color: "#00ff9c", marginBottom: "12px" }}>{f.title}</h3>
                  <p style={{ color: "#9ca3af", lineHeight: "1.7" }}>{f.desc}</p>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {activeTab === "acces" && (
        <section style={{ background: "#0b0f1a", border: "2px solid #00ff9c", borderRadius: "12px", padding: "30px" }}>
          <h2 style={{ color: "#00ff9c", fontSize: "1.8rem", marginBottom: "25px" }}>🔑 Accès à HackerAI</h2>
          
          <div style={{ marginBottom: "30px" }}>
            <h3 style={{ color: "#00ff9c", fontSize: "1.3rem", marginBottom: "15px" }}>1️⃣ Création de Compte</h3>
            <div style={{ background: "#1a1f2e", borderRadius: "8px", padding: "20px" }}>
              <ul style={{ color: "#9ca3af", lineHeight: "2", paddingLeft: "20px" }}>
                <li>Email professionnel requis</li>
                <li>Vérification d'identité pour usage légitime</li>
                <li>Acceptation CGU éthiques</li>
                <li>Validation par email</li>
              </ul>
            </div>
          </div>

          <div style={{ marginBottom: "30px" }}>
            <h3 style={{ color: "#00ff9c", fontSize: "1.3rem", marginBottom: "15px" }}>2️⃣ Formules</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
              {[
                { name: "Free", price: "0€/mois", features: ["50 requêtes/jour", "Fonctionnalités basiques", "Historique 7j", "Support communautaire"], color: "#6b7280" },
                { name: "Pro", price: "49€/mois", features: ["500 requêtes/jour", "Toutes fonctionnalités", "Historique illimité", "Support prioritaire", "API access"], color: "#00ff9c" },
                { name: "Enterprise", price: "Sur devis", features: ["Illimité", "On-premise", "Fine-tuning", "SLA garanti", "Formation équipe"], color: "#fbbf24" }
              ].map((p, i) => (
                <div key={i} style={{ background: "#1a1f2e", border: `2px solid ${p.color}`, borderRadius: "12px", padding: "24px" }}>
                  <h4 style={{ color: p.color, fontSize: "1.5rem", marginBottom: "10px" }}>{p.name}</h4>
                  <p style={{ color: "#e5e7eb", fontSize: "1.8rem", fontWeight: "bold", marginBottom: "20px" }}>{p.price}</p>
                  <ul style={{ color: "#9ca3af", lineHeight: "2", paddingLeft: "20px" }}>
                    {p.features.map((f, j) => <li key={j}>{f}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {activeTab === "usage" && (
        <section style={{ background: "#0b0f1a", border: "2px solid #00ff9c", borderRadius: "12px", padding: "30px" }}>
          <h2 style={{ color: "#00ff9c", fontSize: "1.8rem", marginBottom: "25px" }}>💡 Guide d'Usage</h2>
          
          {[
            {
              title: "Pentest Web Application",
              steps: [
                "Reconnaissance : Identifier technologies (frameworks, CMS, libs)",
                "Énumération : Découvrir endpoints, API cachées",
                "Exploitation : Générer payloads XSS, SQLi, CSRF adaptés",
                "Post-exploitation : Analyser données et pivoter"
              ]
            },
            {
              title: "Analyse de Code Source",
              steps: [
                "Upload code ou lien GitHub",
                "Analyse statique : détection vulnérabilités connues",
                "Analyse dépendances : libs obsolètes/vulnérables",
                "Rapport : failles priorisées avec correctifs"
              ]
            }
          ].map((uc, i) => (
            <div key={i} style={{ background: "#1a1f2e", borderRadius: "12px", padding: "24px", marginBottom: "20px" }}>
              <h4 style={{ color: "#00ff9c", fontSize: "1.2rem", marginBottom: "15px" }}>{uc.title}</h4>
              <ol style={{ color: "#e5e7eb", lineHeight: "2.2", paddingLeft: "20px" }}>
                {uc.steps.map((s, j) => <li key={j}>{s}</li>)}
              </ol>
            </div>
          ))}

          <div style={{ background: "#1a1f2e", border: "1px solid #fbbf24", borderRadius: "8px", padding: "20px", marginTop: "20px" }}>
            <h3 style={{ color: "#fbbf24", marginBottom: "15px" }}>📚 Bonnes Pratiques</h3>
            <ul style={{ color: "#9ca3af", lineHeight: "2.2", paddingLeft: "20px" }}>
              <li><strong>Soyez précis</strong> : Contexte détaillé (techno, version, env)</li>
              <li><strong>Itérez</strong> : Affinez prompts selon réponses</li>
              <li><strong>Validez</strong> : Testez payloads en environnement contrôlé</li>
              <li><strong>Documentez</strong> : Conservez historique requêtes/résultats</li>
              <li><strong>Éthique</strong> : Jamais contre cibles non autorisées</li>
            </ul>
          </div>
        </section>
      )}
    </main>
  );
}

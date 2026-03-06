import { useState, useEffect } from "react";
import { useThemeColors } from "../context/ThemeContext";

export default function TheHarvesterModule() {

  const colors = useThemeColors();

  const [activeTab, setActiveTab] = useState("theory");

  const BADGE_KEY = "badge_module_theharvester";

  useEffect(() => {

    const savedBadge = localStorage.getItem(BADGE_KEY);

  }, []);

  const tabs = [
    { id: "theory", label: "📖 Théorie" },
    { id: "tools", label: "🔧 Outils" },
    { id: "exercises", label: "💡 Exercices" },
    { id: "quiz", label: "🎯 Quiz" }
  ];

  return (

    <div style={{ minHeight: "100vh", background: colors.bgPrimary, paddingTop: "80px" }}>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 20px" }}>

        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div style={{ fontSize: "4rem" }}>🌾</div>

          <h1 style={{ color: colors.textPrimary }}>
            Module theHarvester
          </h1>

          <p style={{ color: colors.textSecondary }}>
            Collecte d'informations OSINT
          </p>
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: "15px", marginBottom: "40px" }}>
          {tabs.map(tab => (

            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: "12px 24px",
                background: activeTab === tab.id ? colors.accent : colors.bgSecondary,
                border: `2px solid ${colors.border}`,
                borderRadius: "12px",
                cursor: "pointer"
              }}
            >
              {tab.label}
            </button>

          ))}
        </div>

        <div style={{ background: colors.bgSecondary, padding: "40px", borderRadius: "12px" }}>

          {activeTab === "theory" && (

            <div>

              <h2 style={{ color: colors.textPrimary }}>
                📖 theHarvester OSINT
              </h2>

              <p style={{ color: colors.textSecondary, lineHeight: "1.8" }}>
                theHarvester est un outil OSINT open-source permettant
                de collecter automatiquement des informations publiques
                sur une organisation.

                Il peut récupérer :
                emails, sous-domaines, noms d’employés,
                adresses IP et hôtes exposés sur Internet.

                Cet outil est souvent utilisé pendant la phase de
                reconnaissance d’un audit de sécurité ou d’un pentest.
              </p>

              <h3 style={{ color: colors.accent }}>Cas d’usage</h3>

              <ul style={{ color: colors.textSecondary }}>
                <li>Reconnaissance passive</li>
                <li>Collecte d'emails professionnels</li>
                <li>Découverte de sous-domaines</li>
                <li>Cartographie de surface d'attaque</li>
              </ul>

            </div>

          )}

          {activeTab === "exercises" && (

            <div>

              <h2 style={{ color: colors.textPrimary }}>💡 Exercices</h2>

              <div style={{ background: colors.bgPrimary, padding: "25px", borderRadius: "12px", marginBottom: "20px" }}>
                <h3 style={{ color: colors.accent }}>
                  Exercice 1 : Collecte d'emails
                </h3>

                <p style={{ color: colors.textSecondary }}>
                  Utilisez theHarvester pour récupérer
                  les emails publics associés à un domaine.
                </p>
              </div>

              <div style={{ background: colors.bgPrimary, padding: "25px", borderRadius: "12px", marginBottom: "20px" }}>
                <h3 style={{ color: colors.accent }}>
                  Exercice 2 : Sous-domaines
                </h3>

                <p style={{ color: colors.textSecondary }}>
                  Lancez une recherche sur plusieurs moteurs
                  afin d’identifier les sous-domaines exposés.
                </p>
              </div>

              <div style={{ background: colors.bgPrimary, padding: "25px", borderRadius: "12px" }}>
                <h3 style={{ color: colors.accent }}>
                  Exercice 3 : Analyse OSINT
                </h3>

                <p style={{ color: colors.textSecondary }}>
                  Analysez les résultats obtenus et identifiez
                  les informations sensibles.
                </p>
              </div>

            </div>

          )}

        </div>

      </div>

    </div>

  );

}
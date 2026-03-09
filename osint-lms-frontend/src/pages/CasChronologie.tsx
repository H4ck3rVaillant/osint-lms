import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useThemeColors } from "../context/ThemeContext";

export default function CasChronologie() {
  const colors = useThemeColors();
  const navigate = useNavigate();
  const [validated, setValidated] = useState(false);

  const validateCase = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    localStorage.setItem("badge_case_chrono", "true");
    setValidated(true);
  };

  return (
    <main style={{ padding: "40px", maxWidth: "900px", margin: "0 auto" }}>
      <h1 style={{ color: colors.accent, marginBottom: "20px" }}>
        🧭 Cas réel – Chronologie d'événements
      </h1>

      <section style={{ color: colors.textSecondary, lineHeight: 1.7 }}>
        <h2 style={{ color: colors.accent }}>Contexte</h2>
        <p>
          Reconstruction temporelle d'un événement à partir de sources ouvertes
          (réseaux sociaux, médias, images satellites, vidéos).
        </p>

        <h2 style={{ color: colors.accent, marginTop: "25px" }}>Méthodologie</h2>
        <ul>
          <li>Collecte des premières publications</li>
          <li>Corrélation temporelle multi-plateformes</li>
          <li>Vérification des timestamps (UTC / local)</li>
          <li>Alignement avec données satellites et météo</li>
        </ul>

        <h2 style={{ color: colors.accent, marginTop: "25px" }}>Résultat</h2>
        <p>
          Construction d'une timeline fiable permettant d'infirmer ou confirmer
          une version officielle.
        </p>

        <h2 style={{ color: colors.accent, marginTop: "25px" }}>Erreurs fréquentes</h2>
        <ul>
          <li>Fuseaux horaires ignorés</li>
          <li>Contenus repostés pris comme originaux</li>
          <li>Données météo non vérifiées</li>
        </ul>
      </section>

      <div style={{ marginTop: "50px", display: "flex", gap: "30px" }}>
        <button style={btnSecondary} onClick={() => { window.scrollTo({ top: 0, behavior: "smooth" }); navigate("/etudes-osint"); }}>
          ⬅ Retour aux cas
        </button>

        <button style={btnSecondary} onClick={() => { window.scrollTo({ top: 0, behavior: "smooth" }); navigate("/cas/final")}>
          Cas suivant ➡
        </button>

        <button style={btnPrimary} onClick={validateCase}>
          ✔ Valider le cas
        </button>
      </div>

      {validated && (
        <div style={popupStyle}>
          <h3 style={{ color: colors.accent }}>Cas validé</h3>
          <p>Badge "Chronologie d'événements" débloqué.</p>
          <button
            style={{ ...btnPrimary, marginTop: "20px" }}
            onClick={() => { window.scrollTo({ top: 0, behavior: "smooth" }); navigate("/etudes-osint"); }}
          >
            Retour aux études de cas
          </button>
        </div>
      )}
    </main>
  );
}

/* ===== STYLES TRYHACKME ===== */
const btnPrimary = {
  padding: "16px 32px",
  background: colors.accent,
  color: colors.bgPrimary,
  border: "none",
  borderRadius: "12px",
  fontSize: "16px",
  cursor: "pointer",
};

const btnSecondary = {
  padding: "14px 26px",
  background: colors.bgPrimary,
  color: colors.accent,
  border: "1px solid #00ff9c",
  borderRadius: "10px",
  cursor: "pointer",
};

const popupStyle = {
  position: "fixed" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  background: colors.bgPrimary,
  border: "2px solid #00ff9c",
  borderRadius: "14px",
  padding: "30px",
  textAlign: "center" as const,
  zIndex: 1000,
};

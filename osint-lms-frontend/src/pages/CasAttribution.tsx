import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useThemeColors } from "../context/ThemeContext";

export default function CasAttribution() {
  const colors = useThemeColors();
  const navigate = useNavigate();
  const [validated, setValidated] = useState(false);

  const validateCase = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    localStorage.setItem("badge_case_attr", "true");
    setValidated(true);
  };

  return (
    <main style={{ padding: "40px", maxWidth: "900px", margin: "0 auto" }}>
      <h1 style={{ color: colors.accent, marginBottom: "20px" }}>
        🧑‍💻 Cas réel – Attribution d'acteurs
      </h1>

      <section style={{ color: colors.textSecondary, lineHeight: 1.7 }}>
        <h2 style={{ color: colors.accent }}>Contexte</h2>
        <p>
          Une série d'actions coordonnées (désinformation, cyberattaques,
          opérations d'influence) est observée sur plusieurs plateformes.
          L'objectif est d'identifier l'acteur derrière ces opérations.
        </p>

        <h2 style={{ color: colors.accent, marginTop: "25px" }}>Hypothèses</h2>
        <ul>
          <li>Acteur étatique</li>
          <li>Groupe hacktiviste idéologique</li>
          <li>Prestataire privé ou proxy</li>
        </ul>

        <h2 style={{ color: colors.accent, marginTop: "25px" }}>
          Sources ouvertes utilisées
        </h2>
        <ul>
          <li>WHOIS, ASN, infrastructures réseau</li>
          <li>Fuseaux horaires et cycles d'activité</li>
          <li>Langue, erreurs grammaticales, idiomes</li>
          <li>Réutilisation d'outils et signatures</li>
        </ul>

        <h2 style={{ color: colors.accent, marginTop: "25px" }}>
          Méthodologie d'attribution
        </h2>
        <ol>
          <li>Collecte des artefacts techniques</li>
          <li>Analyse comportementale</li>
          <li>Corrélation temporelle</li>
          <li>Recoupement multi-sources</li>
          <li>Évaluation du niveau de confiance</li>
        </ol>

        <h2 style={{ color: colors.accent, marginTop: "25px" }}>Résultat final</h2>
        <p>
          Attribution probable à un groupe déjà documenté dans des opérations
          précédentes. Niveau de confiance : <strong>élevé</strong>.
        </p>

        <h2 style={{ color: colors.accent, marginTop: "25px" }}>
          Pièges fréquents
        </h2>
        <ul>
          <li>Biais de confirmation</li>
          <li>Sur-interprétation des indices</li>
          <li>Absence de chaîne de preuves</li>
        </ul>
      </section>

      <div style={{ marginTop: "50px", display: "flex", gap: "30px" }}>
        <button style={btnSecondary} onClick={() => { window.scrollTo({ top: 0, behavior: "smooth" }); navigate("/etudes-osint"); }}>
          ⬅ Retour aux cas
        </button>

        <button style={btnSecondary} onClick={() => { window.scrollTo({ top: 0, behavior: "smooth" }); navigate("/cas/Chronologie")}>
          Cas suivant ➡
        </button>

        <button style={btnPrimary} onClick={validateCase}>
          ✔ Valider le cas
        </button>
      </div>

      {validated && (
        <div style={popupStyle}>
          <h3 style={{ color: colors.accent }}>Cas validé</h3>
          <p>Badge "Attribution d'acteurs" débloqué.</p>
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

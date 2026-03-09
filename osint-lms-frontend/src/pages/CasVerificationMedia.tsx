import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useThemeColors } from "../context/ThemeContext";

export default function CasVerificationMedia() {
  const colors = useThemeColors();
  const navigate = useNavigate();
  const [validated, setValidated] = useState(false);

  const validateCase = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    localStorage.setItem("badge_case_media", "true");
    setValidated(true);
  };

  return (
    <main style={{ padding: "40px", maxWidth: "900px", margin: "0 auto" }}>
      <h1 style={{ color: colors.accent, marginBottom: "20px" }}>
        📸 Cas réel – Vérification d’images & vidéos
      </h1>

      <section style={{ color: colors.textSecondary, lineHeight: 1.7 }}>
        <h2 style={{ color: colors.accent }}>Contexte</h2>
        <p>
          Une vidéo virale montre une explosion supposée récente. Plusieurs médias
          la relaient sans vérification préalable. Votre mission est de déterminer
          si ce contenu est authentique.
        </p>

        <h2 style={{ color: colors.accent, marginTop: "25px" }}>Hypothèses</h2>
        <ul>
          <li>Vidéo récente filmée dans un contexte de conflit</li>
          <li>Ancienne vidéo recyclée</li>
          <li>Vidéo manipulée ou sortie de son contexte</li>
        </ul>

        <h2 style={{ color: colors.accent, marginTop: "25px" }}>
          Sources ouvertes utilisées
        </h2>
        <ul>
          <li>Google Reverse Image / Yandex</li>
          <li>InVID / WeVerify</li>
          <li>YouTube Data Viewer</li>
          <li>Archives médias ouvertes</li>
        </ul>

        <h2 style={{ color: colors.accent, marginTop: "25px" }}>
          Méthodologie pas à pas
        </h2>
        <ol>
          <li>Extraction des images clés de la vidéo</li>
          <li>Recherche inversée multi-plateformes</li>
          <li>Analyse audio et visuelle</li>
          <li>Comparaison avec archives connues</li>
        </ol>

        <h2 style={{ color: colors.accent, marginTop: "25px" }}>
          Résultat final
        </h2>
        <p>
          La vidéo correspond à un exercice militaire filmé en 2016, réutilisé
          dans un contexte trompeur.
        </p>

        <h2 style={{ color: colors.accent, marginTop: "25px" }}>
          Erreurs classiques
        </h2>
        <ul>
          <li>Se fier à une seule recherche inversée</li>
          <li>Ignorer le contexte de publication initial</li>
        </ul>
      </section>

      <div style={{ marginTop: "50px", display: "flex", gap: "30px" }}>
        <button style={btnSecondary} onClick={() => { window.scrollTo({ top: 0, behavior: "smooth" }); navigate("/etudes-osint"); }}>
          ⬅ Retour aux cas
        </button>

        <button style={btnSecondary} onClick={() => { window.scrollTo({ top: 0, behavior: "smooth" }); navigate("/cas/attribution")}>
          Cas suivant ➡
        </button>

        <button style={btnPrimary} onClick={validateCase}>
          ✔ Valider le cas
        </button>
      </div>

      {validated && (
        <div style={popupStyle}>
          <h3 style={{ color: colors.accent }}>Cas validé</h3>
          <p>Badge “Vérification médias” débloqué.</p>
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

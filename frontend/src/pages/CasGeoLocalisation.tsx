import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function CasGeoLocalisation() {
  const navigate = useNavigate();
  const [validated, setValidated] = useState(false);

  const validateCase = () => {
    localStorage.setItem("badge_case_geo", "true");
    setValidated(true);
  };

  return (
    <main style={{ padding: "40px", maxWidth: "900px", margin: "0 auto" }}>
      <h1 style={{ color: "#00ff9c", marginBottom: "20px" }}>
        🛰️ Cas réel – Géolocalisation d'image
      </h1>

      <section style={{ color: "#9ca3af", lineHeight: 1.7 }}>
        <h2 style={{ color: "#00ff9c" }}>Contexte</h2>
        <p>
          Une image publiée sur les réseaux sociaux montre un convoi militaire
          dans une zone inconnue. L'objectif est d'identifier précisément le
          lieu où la photo a été prise.
        </p>

        <h2 style={{ color: "#00ff9c", marginTop: "25px" }}>Hypothèses</h2>
        <ul>
          <li>Zone urbaine d'Europe de l'Est</li>
          <li>Présence d'infrastructures industrielles</li>
          <li>Réseau routier secondaire</li>
        </ul>

        <h2 style={{ color: "#00ff9c", marginTop: "25px" }}>
          Sources ouvertes utilisées
        </h2>
        <ul>
          <li>Google Maps / Google Earth</li>
          <li>Yandex Maps</li>
          <li>OpenStreetMap</li>
          <li>Images satellites Sentinel Hub</li>
        </ul>

        <h2 style={{ color: "#00ff9c", marginTop: "25px" }}>
          Méthodologie pas à pas
        </h2>
        <ol>
          <li>Analyse des ombres pour déterminer l'orientation</li>
          <li>Identification du mobilier urbain (lampadaires, routes)</li>
          <li>Comparaison des bâtiments avec vues satellites</li>
          <li>Validation par recoupement multi-sources</li>
        </ol>

        <h2 style={{ color: "#00ff9c", marginTop: "25px" }}>
          Résultat final
        </h2>
        <p>
          La photo a été prise dans une zone industrielle en périphérie d'une
          ville identifiée avec une précision inférieure à 50 mètres.
        </p>

        <h2 style={{ color: "#00ff9c", marginTop: "25px" }}>
          Erreurs classiques
        </h2>
        <ul>
          <li>Se fier à une seule source cartographique</li>
          <li>Ignorer la distorsion des images satellites</li>
        </ul>
      </section>

      <div style={{ marginTop: "50px", display: "flex", gap: "30px" }}>
        <button style={btnSecondary} onClick={() => navigate("/etudes-osint")}>
          ⬅ Retour aux cas
        </button>

        <button style={btnSecondary} onClick={() => navigate("/cas/verification-media")}>
          Cas suivant ➡
        </button>

        <button style={btnPrimary} onClick={validateCase}>
          ✔ Valider le cas
        </button>
      </div>

      {validated && (
        <div style={popupStyle}>
          <h3 style={{ color: "#00ff9c" }}>Cas validé</h3>
          <p>Badge "Géolocalisation" débloqué.</p>
          <button
            style={{ ...btnPrimary, marginTop: "20px" }}
            onClick={() => navigate("/etudes-osint")}
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
  background: "#00ff9c",
  color: "#020617",
  border: "none",
  borderRadius: "12px",
  fontSize: "16px",
  cursor: "pointer",
};

const btnSecondary = {
  padding: "14px 26px",
  background: "#0b0f1a",
  color: "#00ff9c",
  border: "1px solid #00ff9c",
  borderRadius: "10px",
  cursor: "pointer",
};

const popupStyle = {
  position: "fixed" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  background: "#020617",
  border: "2px solid #00ff9c",
  borderRadius: "14px",
  padding: "30px",
  textAlign: "center" as const,
  zIndex: 1000,
};

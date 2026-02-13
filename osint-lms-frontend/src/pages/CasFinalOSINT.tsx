import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function CasFinalOSINT() {
  const navigate = useNavigate();
  const [validated, setValidated] = useState(false);

  const validateFinal = () => {
    const required = [
      "badge_case_geo",
      "badge_case_media",
      "badge_case_attr",
      "badge_case_chrono",
      ];

    localStorage.setItem("Analyste OSINT – Cas réels", "true");
    localStorage.setItem("badge_cases_osint", "true");

    setValidated(true);
  };

  return (
    <main style={{ padding: "40px", maxWidth: "900px", margin: "0 auto" }}>
      <h1 style={{ color: "#00ff9c", marginBottom: "20px" }}>
        🎯 Cas final – Analyse OSINT complète
      </h1>

      <section style={{ color: "#9ca3af", lineHeight: "1.7" }}>
        <h2 style={{ color: "#00ff9c" }}>Contexte</h2>
        <p>
          Une série d'images, vidéos et messages apparaît sur plusieurs plateformes
          sociales suite à un événement militaire non revendiqué.  
          Les informations sont fragmentées, parfois contradictoires, et rapidement
          reprises par des médias internationaux.
        </p>

        <h2 style={{ color: "#00ff9c" }}>Objectif de l'enquête</h2>
        <p>
          Produire une analyse OSINT complète, structurée et vérifiable,
          similaire aux méthodologies employées par des équipes comme Bellingcat :
        </p>
        <ul>
          <li>Vérifier l'authenticité des médias</li>
          <li>Localiser précisément les événements</li>
          <li>Reconstruire une chronologie fiable</li>
          <li>Attribuer l'action à un acteur plausible</li>
        </ul>

        <h2 style={{ color: "#00ff9c" }}>Sources ouvertes utilisées</h2>
        <ul>
          <li>Réseaux sociaux (X, Telegram, TikTok, YouTube)</li>
          <li>Images satellites et cartes open source</li>
          <li>Archives médias et bases de données OSINT</li>
          <li>Historique d'opérations similaires documentées</li>
        </ul>

        <h2 style={{ color: "#00ff9c" }}>Méthodologie détaillée</h2>
        <ol>
          <li>
            <strong>Collecte :</strong> archivage des contenus avant suppression
            (hash, date, source).
          </li>
          <li>
            <strong>Vérification :</strong> recherche inversée, analyse des métadonnées,
            comparaison avec des archives.
          </li>
          <li>
            <strong>Géolocalisation :</strong> identification des reliefs, bâtiments,
            infrastructures et angles de prise de vue.
          </li>
          <li>
            <strong>Chronologie :</strong> corrélation temporelle entre médias,
            fuseaux horaires et événements connus.
          </li>
          <li>
            <strong>Attribution :</strong> analyse des signatures techniques,
            comportementales et stratégiques.
          </li>
        </ol>

        <h2 style={{ color: "#00ff9c" }}>Résultat final</h2>
        <p>
          L'ensemble des éléments converge vers une opération coordonnée
          menée par un acteur déjà impliqué dans des actions similaires.
          Le niveau de confiance est évalué comme <strong>élevé</strong>,
          bien que certaines zones d'incertitude subsistent.
        </p>

        <h2 style={{ color: "#00ff9c" }}>Ce qui aurait pu être mal interprété</h2>
        <ul>
          <li>Réutilisation d'anciennes images sorties de leur contexte</li>
          <li>Biais de confirmation lié aux narratifs dominants</li>
          <li>Confusion volontaire entre acteurs étatiques et proxy</li>
        </ul>

        <h2 style={{ color: "#00ff9c" }}>Conclusion pédagogique</h2>
        <p>
          Ce cas illustre l'importance d'une approche rigoureuse,
          documentée et transparente en OSINT.
          Chaque affirmation doit pouvoir être retracée, vérifiée
          et expliquée à un tiers.
        </p>
      </section>

      <p style={{ color: "#9ca3af", fontSize: "17px", lineHeight: 1.7, marginTop: "25px" }}>
        Ce cas final simule une enquête OSINT multi-sources inspirée des
        méthodologies Bellingcat. Vous devez corréler données visuelles,
        temporelles, techniques et humaines afin de produire une analyse
        défendable et reproductible.
      </p>

      <div style={{ marginTop: "50px", display: "flex", gap: "30px" }}>
        <button style={btnSecondary} onClick={() => navigate("/etudes-osint")}>
          ⬅ Retour aux cas
        </button>

        <button style={btnPrimary} onClick={validateFinal}>
          ✔ Valider le cas final
        </button>
      </div>

      {validated && (
        <div style={popupStyle}>
          <h3 style={{ color: "#00ff9c" }}>Cas validé</h3>
          <p>🏆 Badge « Analyste OSINT – Cas réels » débloqué !</p>
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

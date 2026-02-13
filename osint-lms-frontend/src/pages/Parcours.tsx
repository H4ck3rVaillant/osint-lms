import Header from "../components/Header";
import { Link } from "react-router-dom";

export default function Parcours() {
  return (
    <>
      <Header />

      <main className="parcours">
        <h1 className="title-green">Parcours OSINT</h1>

        <p className="parcours-intro">
          Les parcours CyberOSINT Academy sont conçus pour vous faire
          progresser étape par étape, depuis les bases de l’OSINT jusqu’aux
          techniques avancées utilisées par les professionnels.
        </p>

        <div className="parcours-cards">
          <Link to="/parcours/debutant" className="parcours-card">
            <h3>🟢 Débutant</h3>
            <p>
              Comprendre l’OSINT, les sources ouvertes, la méthodologie et
              les premiers outils.
            </p>
          </Link>

          <Link to="/parcours/intermediaire" className="parcours-card">
            <h3>🟡 Intermédiaire</h3>
            <p>
              Corrélation de données, investigation numérique,
              réseaux sociaux et géolocalisation.
            </p>
          </Link>

          <Link to="/parcours/avance" className="parcours-card">
            <h3>🔴 Avancé</h3>
            <p>
              Techniques avancées, automatisation, OSINT offensif,
              analyse approfondie.
            </p>
          </Link>
        </div>
      </main>
    </>
  );
}

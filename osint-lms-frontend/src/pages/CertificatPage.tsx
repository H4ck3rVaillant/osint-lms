import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useThemeColors } from "../context/ThemeContext";
import { useAuth } from "../auth/AuthContext";
import {
  getProgression,
  getCompletionPercentage,
  getCompletionDetails,
  isCertificatAvailable,
} from "../utils/certificateTracker";
import { generateCertificate } from "../utils/certificateGenerator";

export default function CertificatPage() {
  const colors = useThemeColors();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [progression, setProgression] = useState(getProgression());
  const [percentage, setPercentage] = useState(0);
  const [details, setDetails] = useState(getCompletionDetails());
  const [isAvailable, setIsAvailable] = useState(false);

  useEffect(() => {
    // Rafraîchir les données
    const prog = getProgression();
    const perc = getCompletionPercentage();
    const det = getCompletionDetails();
    const avail = isCertificatAvailable();

    setProgression(prog);
    setPercentage(perc);
    setDetails(det);
    setIsAvailable(avail);
  }, []);

  const handleDownload = () => {
    if (!isAvailable || !user) return;

    generateCertificate({
      username: user.username,
      dateDebut: progression.dateDebut!,
      dateFin: progression.dateFin!,
    });
  };

  const formatDate = (isoDate: string | null) => {
    if (!isoDate) return "—";
    return new Date(isoDate).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const CheckItem = ({ completed, label }: { completed: boolean; label: string }) => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "12px 15px",
        background: completed ? "#10b98110" : colors.bgSecondary,
        border: `1px solid ${completed ? "#10b981" : colors.border}`,
        borderRadius: "8px",
        transition: "all 0.3s ease",
      }}
    >
      <div
        style={{
          width: "24px",
          height: "24px",
          borderRadius: "50%",
          background: completed ? "#10b981" : "transparent",
          border: `2px solid ${completed ? "#10b981" : colors.border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          fontSize: "0.9rem",
          fontWeight: "700",
          flexShrink: 0,
        }}
      >
        {completed && "✓"}
      </div>
      <span
        style={{
          color: completed ? colors.textPrimary : colors.textSecondary,
          fontSize: "0.95rem",
          fontWeight: completed ? "600" : "400",
        }}
      >
        {label}
      </span>
    </div>
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: colors.bgPrimary,
        paddingTop: "80px",
      }}
    >
      <div
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
          padding: "40px 20px",
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "50px" }}>
          <div style={{ fontSize: "4rem", marginBottom: "15px" }}>🎓</div>
          <h1
            style={{
              fontSize: "2.5rem",
              fontWeight: "700",
              color: colors.textPrimary,
              marginBottom: "15px",
            }}
          >
            Certificat de Formation
          </h1>
          <p
            style={{
              fontSize: "1.1rem",
              color: colors.textSecondary,
              maxWidth: "700px",
              margin: "0 auto",
            }}
          >
            Complétez l'intégralité du programme pour obtenir votre certificat de complétion.
          </p>
        </div>

        {/* Barre de progression globale */}
        <div
          style={{
            background: colors.bgSecondary,
            border: `2px solid ${isAvailable ? colors.accent : colors.border}`,
            borderRadius: "16px",
            padding: "30px",
            marginBottom: "40px",
            boxShadow: isAvailable ? `0 8px 30px ${colors.accent}30` : "none",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <div>
              <h3
                style={{
                  fontSize: "1.3rem",
                  fontWeight: "600",
                  color: colors.textPrimary,
                  marginBottom: "5px",
                }}
              >
                Progression Globale
              </h3>
              <p style={{ color: colors.textSecondary, fontSize: "0.9rem" }}>
                {isAvailable
                  ? "🎉 Formation complétée ! Certificat disponible"
                  : `${percentage}% complété - Continuez votre progression`}
              </p>
            </div>
            <div
              style={{
                fontSize: "3rem",
                fontWeight: "700",
                color: isAvailable ? colors.accent : colors.textSecondary,
              }}
            >
              {percentage}%
            </div>
          </div>

          {/* Barre de progression */}
          <div
            style={{
              width: "100%",
              height: "20px",
              background: colors.bgPrimary,
              borderRadius: "10px",
              overflow: "hidden",
              position: "relative" as const,
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${percentage}%`,
                background: isAvailable
                  ? `linear-gradient(90deg, ${colors.accent}, #10b981)`
                  : colors.accent,
                transition: "width 0.5s ease",
                borderRadius: "10px",
              }}
            />
          </div>

          {/* Dates */}
          {progression.dateDebut && (
            <div
              style={{
                marginTop: "20px",
                display: "flex",
                justifyContent: "space-between",
                fontSize: "0.9rem",
                color: colors.textSecondary,
              }}
            >
              <span>📅 Début : {formatDate(progression.dateDebut)}</span>
              {progression.dateFin && (
                <span>🏁 Fin : {formatDate(progression.dateFin)}</span>
              )}
            </div>
          )}
        </div>

        {/* Grid des sections */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "25px",
            marginBottom: "40px",
          }}
        >
          {/* Parcours */}
          <div
            style={{
              background: colors.bgSecondary,
              border: `1px solid ${colors.border}`,
              borderRadius: "12px",
              padding: "25px",
            }}
          >
            <h3
              style={{
                fontSize: "1.2rem",
                fontWeight: "600",
                color: colors.textPrimary,
                marginBottom: "20px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <span style={{ fontSize: "1.5rem" }}>📚</span>
              Parcours
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <CheckItem completed={details.parcours.debutant} label="Parcours Débutant" />
              <CheckItem completed={details.parcours.intermediaire} label="Parcours Intermédiaire" />
              <CheckItem completed={details.parcours.avance} label="Parcours Avancé" />
            </div>
          </div>

          {/* Quiz */}
          <div
            style={{
              background: colors.bgSecondary,
              border: `1px solid ${colors.border}`,
              borderRadius: "12px",
              padding: "25px",
            }}
          >
            <h3
              style={{
                fontSize: "1.2rem",
                fontWeight: "600",
                color: colors.textPrimary,
                marginBottom: "20px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <span style={{ fontSize: "1.5rem" }}>🎓</span>
              Quiz (6)
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <CheckItem completed={details.quiz.osintBasics} label="OSINT - Fondamentaux" />
              <CheckItem completed={details.quiz.searchTechniques} label="Recherche Avancée" />
              <CheckItem completed={details.quiz.geolocation} label="Géolocalisation" />
              <CheckItem completed={details.quiz.socialMedia} label="Réseaux Sociaux" />
              <CheckItem completed={details.quiz.cryptoBlockchain} label="Crypto & Blockchain" />
              <CheckItem completed={details.quiz.darkweb} label="Dark Web" />
            </div>
          </div>

          {/* Pratique */}
          <div
            style={{
              background: colors.bgSecondary,
              border: `1px solid ${colors.border}`,
              borderRadius: "12px",
              padding: "25px",
            }}
          >
            <h3
              style={{
                fontSize: "1.2rem",
                fontWeight: "600",
                color: colors.textPrimary,
                marginBottom: "20px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <span style={{ fontSize: "1.5rem" }}>⚡</span>
              Pratique
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <CheckItem completed={details.exercices} label="Tous les exercices" />
              <CheckItem completed={details.etudesDeCas} label="Toutes les études de cas" />
              <CheckItem completed={details.ctfChallenge} label="CTF Challenge" />
            </div>
          </div>
        </div>

        {/* Bouton de téléchargement */}
        <div
          style={{
            background: colors.bgSecondary,
            border: `2px solid ${isAvailable ? colors.accent : colors.border}`,
            borderRadius: "16px",
            padding: "40px",
            textAlign: "center",
          }}
        >
          {isAvailable ? (
            <>
              <div style={{ fontSize: "3rem", marginBottom: "15px" }}>🎉</div>
              <h3
                style={{
                  fontSize: "1.8rem",
                  fontWeight: "700",
                  color: colors.accent,
                  marginBottom: "10px",
                }}
              >
                Félicitations !
              </h3>
              <p
                style={{
                  fontSize: "1.1rem",
                  color: colors.textSecondary,
                  marginBottom: "30px",
                }}
              >
                Vous avez complété l'intégralité du programme de formation.
                <br />
                Votre certificat est maintenant disponible au téléchargement.
              </p>
              <button
                onClick={handleDownload}
                style={{
                  background: colors.accent,
                  color: "#fff",
                  border: "none",
                  padding: "16px 40px",
                  borderRadius: "12px",
                  fontSize: "1.1rem",
                  fontWeight: "600",
                  cursor: "pointer",
                  boxShadow: `0 4px 20px ${colors.accent}40`,
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.05)";
                  e.currentTarget.style.boxShadow = `0 6px 30px ${colors.accent}60`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow = `0 4px 20px ${colors.accent}40`;
                }}
              >
                📥 Télécharger mon certificat
              </button>
            </>
          ) : (
            <>
              <div style={{ fontSize: "3rem", marginBottom: "15px" }}>🔒</div>
              <h3
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "600",
                  color: colors.textSecondary,
                  marginBottom: "10px",
                }}
              >
                Certificat non disponible
              </h3>
              <p
                style={{
                  fontSize: "1rem",
                  color: colors.textSecondary,
                  marginBottom: "30px",
                }}
              >
                Complétez toutes les sections ci-dessus pour débloquer votre certificat.
                <br />
                Progression actuelle : {percentage}%
              </p>
              <button
                disabled
                style={{
                  background: colors.bgPrimary,
                  color: colors.textSecondary,
                  border: `2px solid ${colors.border}`,
                  padding: "16px 40px",
                  borderRadius: "12px",
                  fontSize: "1.1rem",
                  fontWeight: "600",
                  cursor: "not-allowed",
                  opacity: 0.5,
                }}
              >
                📥 Télécharger mon certificat
              </button>
            </>
          )}
        </div>

        {/* Note légale */}
        <div
          style={{
            marginTop: "40px",
            padding: "20px",
            background: `${colors.accent}10`,
            border: `1px solid ${colors.accent}30`,
            borderRadius: "12px",
            textAlign: "center",
          }}
        >
          <p
            style={{
              color: colors.textSecondary,
              fontSize: "0.9rem",
              lineHeight: "1.6",
              margin: 0,
            }}
          >
            ℹ️ <strong>Note importante :</strong> Ce certificat atteste de votre complétion du programme de formation
            CyberOSINT Academy. Il s'agit d'un certificat de suivi de formation sans valeur de certification
            officielle.
          </p>
        </div>
      </div>
    </div>
  );
}

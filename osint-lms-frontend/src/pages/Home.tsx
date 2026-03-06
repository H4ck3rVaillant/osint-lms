import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Logo from "../assets/images/Logo.png";

export default function Home() {
  const [typedText, setTypedText] = useState("");
  const fullText = "Maîtrisez l'art de l'investigation numérique";

  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index <= fullText.length) {
        setTypedText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 50);
    return () => clearInterval(timer);
  }, []);

  return (
    <main style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      padding: "60px 20px",
      background: "radial-gradient(ellipse at top, #0f1419 0%, #020617 100%)",
      position: "relative" as const,
      overflow: "hidden"
    }}>

      <div style={{
        position: "absolute" as const,
        inset: 0,
        backgroundImage: `
          linear-gradient(rgba(0, 255, 156, 0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0, 255, 156, 0.03) 1px, transparent 1px)
        `,
        backgroundSize: "50px 50px",
        pointerEvents: "none" as const
      }} />

      <div style={{ maxWidth: "1200px", width: "100%", zIndex: 1, textAlign: "center" }}>

        <div style={{ marginBottom: "30px" }}>
          <img
            src={Logo}
            style={{
              width: "150px",
              filter: "drop-shadow(0 0 20px rgba(0, 255, 156, 0.5))",
              transition: "all 0.3s ease",
              animation: "float 3s ease-in-out infinite"
            }}
            alt="CyberOSINT Academy Logo"
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.05)";
              e.currentTarget.style.filter = "drop-shadow(0 0 35px rgba(0, 255, 156, 0.9))";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.filter = "drop-shadow(0 0 20px rgba(0, 255, 156, 0.5))";
            }}
          />
        </div>

        <h1 style={{
          color: "#00ff9c",
          fontSize: "3rem",
          marginBottom: "15px",
          fontWeight: "bold",
          letterSpacing: "1px",
          textShadow: "0 0 20px rgba(0, 255, 156, 0.5)",
          animation: "fadeInUp 1s ease-out 0.2s backwards"
        }}>
          CyberOSINT Academy
        </h1>

        <div style={{ minHeight: "50px", marginBottom: "25px" }}>
          <p style={{
            color: "#00ff9c",
            fontSize: "1.3rem",
            fontWeight: "500",
            fontFamily: "monospace",
            animation: "fadeIn 1s ease-out 0.4s backwards"
          }}>
            {typedText}
            <span style={{
              opacity: typedText.length < fullText.length ? 1 : 0,
              animation: "blink 1s infinite"
            }}>|</span>
          </p>
        </div>

        <p style={{
          maxWidth: "750px",
          margin: "0 auto 50px",
          color: "#9ca3af",
          fontSize: "1.1rem",
          lineHeight: "1.8",
          animation: "fadeInUp 1s ease-out 0.6s backwards"
        }}>
          Plateforme professionnelle d'apprentissage en cybersécurité et OSINT.
          Développez vos compétences à travers des parcours structurés, des défis CTF,
          des laboratoires interactifs (Kali et Parrot), un système de gamification complet
          et une bibliothèque de 22+ outils professionnels.
        </p>

        {/* FONCTIONNALITES */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "18px",
          maxWidth: "1100px",
          margin: "0 auto 50px",
          animation: "fadeInUp 1s ease-out 0.8s backwards"
        }}>
          {[
            { icon: "🎓", title: "Parcours progressifs",    desc: "3 niveaux : Débutant, Intermédiaire, Avancé" },
            { icon: "🎯", title: "6 Modules spécialisés",   desc: "Shodan, LinkedIn, Telegram, Discord, theHarvester, Maltego Basic" },
            { icon: "✏️", title: "20 Exercices pratiques",  desc: "Entraînements OSINT guidés et corrigés" },
            { icon: "🔎", title: "5 Études de cas réels",   desc: "Investigations type Bellingcat" },
            { icon: "🏅", title: "Système de badges",       desc: "Progression et récompenses déblocables" },
            { icon: "🚩", title: "Mini-CTF intégrés",       desc: "11 défis OSINT, Crypto et Web Hacking" },
            { icon: "🔥", title: "52 Challenges Hebdo",     desc: "Un nouveau challenge OSINT chaque semaine" },
            { icon: "🏆", title: "Leaderboard",             desc: "Classement mondial en temps réel" },
            { icon: "⭐", title: "Système XP et Niveaux",   desc: "Newbie vers Script Kiddie vers Elite Hacker" },
            { icon: "🔥", title: "Streak et Calendrier",    desc: "Activité quotidienne style GitHub" },
            { icon: "🐉", title: "Kali Linux Lab",          desc: "Terminal interactif avec 30+ commandes" },
            { icon: "🦜", title: "Parrot OS Lab",           desc: "Anonymat Tor, GPG, WiFi audit" },
            { icon: "🧪", title: "Labo OSINT",              desc: "Terminal web et code playground" },
            { icon: "🤖", title: "HackerAI",                desc: "Assistant IA spécialisé cybersécurité" },
            { icon: "🔍", title: "Argus V2.0",              desc: "OSINT Automation & Threat Intelligence" },
            { icon: "🔧", title: "22+ Outils référencés",   desc: "Catalogue complet d'outils OSINT" },
            { icon: "📚", title: "Référentiels",            desc: "ANSSI, RGPD, NIS2, ISO 27001" },
            { icon: "📦", title: "Dependency Track",        desc: "Supply chain security et SBOM" },
          ].map((feature, i) => (
            <div
              key={i}
              style={{
                background: "rgba(11, 15, 26, 0.85)",
                border: "1px solid rgba(0, 255, 156, 0.25)",
                borderRadius: "12px",
                padding: "22px 16px",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.border = "1px solid #00ff9c";
                e.currentTarget.style.boxShadow = "0 10px 30px rgba(0, 255, 156, 0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.border = "1px solid rgba(0, 255, 156, 0.25)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div style={{ fontSize: "2.2rem", marginBottom: "10px" }}>{feature.icon}</div>
              <h3 style={{ color: "#00ff9c", marginBottom: "6px", fontSize: "0.95rem", fontWeight: "bold" }}>
                {feature.title}
              </h3>
              <p style={{ color: "#9ca3af", fontSize: "0.82rem", margin: 0, lineHeight: "1.5" }}>
                {feature.desc}
              </p>
            </div>
          ))}
        </div>

        {/* STATS */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: "25px",
          maxWidth: "900px",
          margin: "0 auto 55px",
          padding: "30px",
          background: "rgba(11, 15, 26, 0.7)",
          border: "1px solid rgba(0, 255, 156, 0.3)",
          borderRadius: "14px",
          animation: "fadeInUp 1s ease-out 1s backwards"
        }}>
          {[
            { number: "13",  label: "Modules de formation" },
            { number: "20",  label: "Exercices pratiques" },
            { number: "5",   label: "Études de cas OSINT" },
            { number: "52",  label: "Challenges Hebdo" },
            { number: "11",  label: "Défis CTF" },
            { number: "20",  label: "Badges à débloquer" },
            { number: "22+", label: "Outils référencés" },
          ].map((stat, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{
                color: "#00ff9c",
                fontSize: "2.3rem",
                fontWeight: "bold",
                marginBottom: "6px",
                textShadow: "0 0 15px rgba(0, 255, 156, 0.5)"
              }}>
                {stat.number}
              </div>
              <div style={{ color: "#9ca3af", fontSize: "0.85rem", lineHeight: "1.4" }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* NIVEAUX XP */}
        <div style={{
          maxWidth: "900px",
          margin: "0 auto 55px",
          animation: "fadeInUp 1s ease-out 1.1s backwards"
        }}>
          <h2 style={{ color: "#00ff9c", fontSize: "1.3rem", marginBottom: "20px" }}>
            ⭐ Progressez de Newbie à Zero Day Master
          </h2>
          <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
            {[
              { icon: "🐣", name: "Newbie",          color: "#9ca3af" },
              { icon: "💻", name: "Script Kiddie",   color: "#22c55e" },
              { icon: "🔓", name: "Hacker",          color: "#3b82f6" },
              { icon: "🥷", name: "Elite Hacker",    color: "#8b5cf6" },
              { icon: "⚔️", name: "Cyber Ninja",     color: "#f59e0b" },
              { icon: "💀", name: "Zero Day Master", color: "#ef4444" },
            ].map((lvl, i, arr) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <div style={{
                  background: "rgba(11,15,26,0.8)",
                  border: `1px solid ${lvl.color}55`,
                  borderRadius: "8px",
                  padding: "8px 14px",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px"
                }}>
                  <span style={{ fontSize: "1.1rem" }}>{lvl.icon}</span>
                  <span style={{ color: lvl.color, fontSize: "0.85rem", fontWeight: "bold" }}>{lvl.name}</span>
                </div>
                {i < arr.length - 1 && (
                  <span style={{ color: "#2a3f3f", fontSize: "1rem" }}>→</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ animation: "fadeInUp 1s ease-out 1.2s backwards" }}>
          <Link
            to="/login"
            style={{
              display: "inline-block",
              background: "#00ff9c",
              color: "#020617",
              padding: "18px 55px",
              borderRadius: "10px",
              textDecoration: "none",
              fontSize: "1.2rem",
              fontWeight: "bold",
              transition: "all 0.3s ease",
              boxShadow: "0 0 30px rgba(0, 255, 156, 0.3)"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.05)";
              e.currentTarget.style.boxShadow = "0 0 50px rgba(0, 255, 156, 0.7)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "0 0 30px rgba(0, 255, 156, 0.3)";
            }}
          >
            🚀 Commencer l'aventure
          </Link>
          <p style={{ marginTop: "18px", color: "#6b7280", fontSize: "0.9rem" }}>
            Gratuit · Sans engagement · Progression sauvegardée
          </p>
        </div>

        {/* Footer */}
        <div style={{
          marginTop: "80px",
          padding: "25px 0",
          borderTop: "1px solid rgba(0, 255, 156, 0.15)",
          animation: "fadeIn 1s ease-out 1.4s backwards"
        }}>
          <p style={{ color: "#6b7280", fontSize: "0.85rem" }}>
            © 2025 CyberOSINT Academy · Plateforme d'apprentissage professionnelle en cybersécurité
          </p>
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-10px); }
        }
      `}</style>
    </main>
  );
}

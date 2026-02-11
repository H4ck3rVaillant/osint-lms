import { useState } from "react";

export default function VMAccess() {
  const [activeVM, setActiveVM] = useState<"kali" | "parrot">("kali");

  return (
    <main style={{ padding: "40px", maxWidth: "1400px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: "40px" }}>
        <h1 style={{ color: "#00ff9c", fontSize: "2.5rem", marginBottom: "10px" }}>
          💻 Accès aux Machines Virtuelles
        </h1>
        <p style={{ color: "#9ca3af", fontSize: "1.2rem", lineHeight: "1.6" }}>
          Environnements de pentesting et sécurité offensive préconfigurés
        </p>
      </div>

      {/* Sélection VM */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: "20px",
        marginBottom: "40px"
      }}>
        <div
          onClick={() => setActiveVM("kali")}
          style={{
            background: activeVM === "kali" ? "#0b0f1a" : "#1a1f2e",
            border: `2px solid ${activeVM === "kali" ? "#00ff9c" : "#2a3f3f"}`,
            borderRadius: "12px",
            padding: "30px",
            cursor: "pointer",
            transition: "all 0.3s",
            textAlign: "center"
          }}
          onMouseEnter={(e) => {
            if (activeVM !== "kali") e.currentTarget.style.borderColor = "#00ff9c";
          }}
          onMouseLeave={(e) => {
            if (activeVM !== "kali") e.currentTarget.style.borderColor = "#2a3f3f";
          }}
        >
          <div style={{ fontSize: "4rem", marginBottom: "15px" }}>🐉</div>
          <h2 style={{ color: "#00ff9c", fontSize: "1.8rem", marginBottom: "10px" }}>
            Kali Linux
          </h2>
          <p style={{ color: "#9ca3af", fontSize: "0.95rem" }}>
            Distribution de référence pour le pentesting
          </p>
        </div>

        <div
          onClick={() => setActiveVM("parrot")}
          style={{
            background: activeVM === "parrot" ? "#0b0f1a" : "#1a1f2e",
            border: `2px solid ${activeVM === "parrot" ? "#00ff9c" : "#2a3f3f"}`,
            borderRadius: "12px",
            padding: "30px",
            cursor: "pointer",
            transition: "all 0.3s",
            textAlign: "center"
          }}
          onMouseEnter={(e) => {
            if (activeVM !== "parrot") e.currentTarget.style.borderColor = "#00ff9c";
          }}
          onMouseLeave={(e) => {
            if (activeVM !== "parrot") e.currentTarget.style.borderColor = "#2a3f3f";
          }}
        >
          <div style={{ fontSize: "4rem", marginBottom: "15px" }}>🦜</div>
          <h2 style={{ color: "#00ff9c", fontSize: "1.8rem", marginBottom: "10px" }}>
            Parrot OS
          </h2>
          <p style={{ color: "#9ca3af", fontSize: "0.95rem" }}>
            Alternative axée sur la vie privée et l'anonymat
          </p>
        </div>
      </div>

      {/* Contenu Kali Linux */}
      {activeVM === "kali" && (
        <div>
          <div style={{
            background: "#0b0f1a",
            border: "2px solid #00ff9c",
            borderRadius: "12px",
            padding: "30px",
            marginBottom: "30px"
          }}>
            <h2 style={{ color: "#00ff9c", fontSize: "2rem", marginBottom: "20px" }}>
              🐉 Kali Linux - Distribution Pentesting
            </h2>
            <p style={{ color: "#e5e7eb", lineHeight: "1.8", marginBottom: "20px" }}>
              <strong>Kali Linux</strong> est une distribution Debian spécialisée dans les tests de pénétration et l'audit de sécurité. 
              Développée par Offensive Security, elle intègre plus de 600 outils de pentesting préinstallés et maintenus.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "15px", marginBottom: "25px" }}>
              {[
                { label: "Version", value: "2024.1 (Rolling)" },
                { label: "Base", value: "Debian 12 (Bookworm)" },
                { label: "Outils", value: "600+ préinstallés" },
                { label: "Éditeur", value: "Offensive Security" }
              ].map((info, idx) => (
                <div key={idx} style={{
                  background: "#1a1f2e",
                  padding: "15px",
                  borderRadius: "8px",
                  border: "1px solid #2a3f3f"
                }}>
                  <p style={{ color: "#00ff9c", fontWeight: "bold", marginBottom: "5px" }}>{info.label}</p>
                  <p style={{ color: "#e5e7eb", margin: 0 }}>{info.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Catégories d'outils */}
          <h3 style={{ color: "#00ff9c", fontSize: "1.6rem", marginBottom: "20px" }}>
            🛠️ Outils préinstallés par catégorie
          </h3>

          <div style={{ display: "grid", gap: "20px", marginBottom: "30px" }}>
            {[
              {
                title: "Information Gathering",
                icon: "🔍",
                tools: ["Nmap", "Masscan", "Recon-ng", "theHarvester", "Shodan", "Maltego"],
                desc: "Reconnaissance et collecte d'informations sur les cibles"
              },
              {
                title: "Vulnerability Analysis",
                icon: "🎯",
                tools: ["Nessus", "OpenVAS", "Nikto", "SQLmap", "WPScan", "Legion"],
                desc: "Détection et analyse des vulnérabilités"
              },
              {
                title: "Wireless Attacks",
                icon: "📡",
                tools: ["Aircrack-ng", "Wifite", "Kismet", "Reaver", "Bully", "Fern Wifi Cracker"],
                desc: "Audit et attaque des réseaux sans fil"
              },
              {
                title: "Web Applications",
                icon: "🌐",
                tools: ["Burp Suite", "OWASP ZAP", "Commix", "WPScan", "Wfuzz", "Dirb"],
                desc: "Test de sécurité des applications web"
              },
              {
                title: "Exploitation",
                icon: "💥",
                tools: ["Metasploit Framework", "SearchSploit", "BeEF", "Social Engineering Toolkit", "Armitage"],
                desc: "Frameworks d'exploitation de vulnérabilités"
              },
              {
                title: "Password Attacks",
                icon: "🔐",
                tools: ["John the Ripper", "Hashcat", "Hydra", "Medusa", "CeWL", "Crunch"],
                desc: "Cracking de mots de passe et bruteforce"
              },
              {
                title: "Sniffing & Spoofing",
                icon: "👂",
                tools: ["Wireshark", "tcpdump", "Ettercap", "Bettercap", "Responder", "MITMproxy"],
                desc: "Interception et analyse du trafic réseau"
              },
              {
                title: "Post Exploitation",
                icon: "🎪",
                tools: ["Mimikatz", "PowerSploit", "Empire", "CrackMapExec", "BloodHound", "Impacket"],
                desc: "Maintien d'accès et pivoting"
              },
              {
                title: "Forensics",
                icon: "🔬",
                tools: ["Autopsy", "Volatility", "Binwalk", "Foremost", "Bulk Extractor", "Sleuth Kit"],
                desc: "Analyse forensique et récupération de données"
              },
              {
                title: "Reverse Engineering",
                icon: "⚙️",
                tools: ["Ghidra", "Radare2", "IDA Free", "OllyDbg", "GDB", "Hopper"],
                desc: "Désassemblage et analyse de binaires"
              }
            ].map((category, idx) => (
              <div
                key={idx}
                style={{
                  background: "#0b0f1a",
                  border: "1px solid #2a3f3f",
                  borderRadius: "12px",
                  padding: "25px",
                  transition: "all 0.3s"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.border = "1px solid #00ff9c";
                  e.currentTarget.style.transform = "translateY(-3px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.border = "1px solid #2a3f3f";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <h4 style={{ color: "#00ff9c", fontSize: "1.3rem", marginBottom: "10px" }}>
                  {category.icon} {category.title}
                </h4>
                <p style={{ color: "#9ca3af", marginBottom: "15px", lineHeight: "1.6" }}>
                  {category.desc}
                </p>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {category.tools.map((tool, i) => (
                    <span
                      key={i}
                      style={{
                        background: "#1a1f2e",
                        color: "#00ff9c",
                        padding: "5px 10px",
                        borderRadius: "6px",
                        fontSize: "0.85rem",
                        border: "1px solid #2a3f3f"
                      }}
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Options d'accès */}
          <h3 style={{ color: "#00ff9c", fontSize: "1.6rem", marginBottom: "20px" }}>
            🚀 Options d'accès
          </h3>

          <div style={{ display: "grid", gap: "20px" }}>
            <div style={{
              background: "#0b0f1a",
              border: "1px solid #2a3f3f",
              borderRadius: "12px",
              padding: "25px"
            }}>
              <h4 style={{ color: "#00ff9c", fontSize: "1.2rem", marginBottom: "10px" }}>
                💾 Téléchargement VM (Recommandé)
              </h4>
              <p style={{ color: "#9ca3af", marginBottom: "15px", lineHeight: "1.6" }}>
                Téléchargez l'image ISO ou les VMs préconfigurées (VirtualBox, VMware) depuis le site officiel.
              </p>
              <a
                href="https://www.kali.org/get-kali/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-block",
                  background: "#00ff9c",
                  color: "#0b0f1a",
                  padding: "12px 25px",
                  borderRadius: "8px",
                  textDecoration: "none",
                  fontWeight: "bold",
                  transition: "all 0.3s"
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
              >
                Télécharger Kali Linux
              </a>
            </div>

            <div style={{
              background: "#0b0f1a",
              border: "1px solid #2a3f3f",
              borderRadius: "12px",
              padding: "25px"
            }}>
              <h4 style={{ color: "#00ff9c", fontSize: "1.2rem", marginBottom: "10px" }}>
                🐳 Docker Container
              </h4>
              <p style={{ color: "#9ca3af", marginBottom: "15px", lineHeight: "1.6" }}>
                Lancez Kali dans un conteneur Docker pour des tests rapides et légers.
              </p>
              <div style={{
                background: "#1a1f2e",
                padding: "15px",
                borderRadius: "8px",
                fontFamily: "monospace",
                fontSize: "0.9rem",
                color: "#00ff9c",
                overflowX: "auto"
              }}>
                docker pull kalilinux/kali-rolling<br/>
                docker run -it kalilinux/kali-rolling /bin/bash
              </div>
            </div>

            <div style={{
              background: "#0b0f1a",
              border: "1px solid #2a3f3f",
              borderRadius: "12px",
              padding: "25px"
            }}>
              <h4 style={{ color: "#00ff9c", fontSize: "1.2rem", marginBottom: "10px" }}>
                ☁️ Cloud Instance (AWS/Azure)
              </h4>
              <p style={{ color: "#9ca3af", marginBottom: "15px", lineHeight: "1.6" }}>
                Déployez Kali sur AWS Marketplace ou Azure pour un accès distant sécurisé.
              </p>
              <p style={{ color: "#9ca3af", fontSize: "0.9rem" }}>
                💡 Idéal pour les équipes distribuées et les pentests à distance.
              </p>
            </div>
          </div>

          {/* Ressources */}
          <div style={{
            marginTop: "30px",
            background: "#1a1f2e",
            border: "1px solid #00ff9c",
            borderRadius: "12px",
            padding: "25px"
          }}>
            <h4 style={{ color: "#00ff9c", fontSize: "1.2rem", marginBottom: "15px" }}>
              📚 Ressources d'apprentissage
            </h4>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "15px" }}>
              {[
                { label: "Documentation officielle", link: "https://www.kali.org/docs/" },
                { label: "Kali Training", link: "https://kali.training/" },
                { label: "Offensive Security (PWK/OSCP)", link: "https://www.offensive-security.com/" },
                { label: "Kali Tools", link: "https://www.kali.org/tools/" }
              ].map((resource, idx) => (
                <a
                  key={idx}
                  href={resource.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    background: "#0b0f1a",
                    border: "1px solid #2a3f3f",
                    borderRadius: "8px",
                    padding: "15px",
                    textDecoration: "none",
                    color: "#00ff9c",
                    textAlign: "center",
                    transition: "all 0.3s",
                    fontWeight: "bold"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#00ff9c";
                    e.currentTarget.style.transform = "translateY(-3px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#2a3f3f";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  {resource.label} →
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Contenu Parrot OS */}
      {activeVM === "parrot" && (
        <div>
          <div style={{
            background: "#0b0f1a",
            border: "2px solid #00ff9c",
            borderRadius: "12px",
            padding: "30px",
            marginBottom: "30px"
          }}>
            <h2 style={{ color: "#00ff9c", fontSize: "2rem", marginBottom: "20px" }}>
              🦜 Parrot OS - Security & Privacy
            </h2>
            <p style={{ color: "#e5e7eb", lineHeight: "1.8", marginBottom: "20px" }}>
              <strong>Parrot Security OS</strong> est une distribution GNU/Linux basée sur Debian, axée sur la sécurité, 
              la vie privée et le développement. Alternative légère à Kali Linux, elle intègre des outils de pentesting 
              et d'anonymat (Tor, I2P, AnonSurf).
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "15px", marginBottom: "25px" }}>
              {[
                { label: "Version", value: "6.0 (Lory)" },
                { label: "Base", value: "Debian 12" },
                { label: "RAM minimum", value: "512 MB (2 GB recommandé)" },
                { label: "Environnement", value: "MATE / KDE / Headless" }
              ].map((info, idx) => (
                <div key={idx} style={{
                  background: "#1a1f2e",
                  padding: "15px",
                  borderRadius: "8px",
                  border: "1px solid #2a3f3f"
                }}>
                  <p style={{ color: "#00ff9c", fontWeight: "bold", marginBottom: "5px" }}>{info.label}</p>
                  <p style={{ color: "#e5e7eb", margin: 0 }}>{info.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Avantages vs Kali */}
          <h3 style={{ color: "#00ff9c", fontSize: "1.6rem", marginBottom: "20px" }}>
            🆚 Parrot OS vs Kali Linux
          </h3>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "30px" }}>
            <div style={{
              background: "#0b0f1a",
              border: "1px solid #2a3f3f",
              borderRadius: "12px",
              padding: "25px"
            }}>
              <h4 style={{ color: "#00ff9c", fontSize: "1.2rem", marginBottom: "15px" }}>
                ✅ Avantages Parrot OS
              </h4>
              <ul style={{ color: "#9ca3af", paddingLeft: "20px", lineHeight: "2" }}>
                <li>Plus léger (512 MB RAM minimum vs 2 GB Kali)</li>
                <li>Anonymat intégré (Tor, I2P, AnonSurf)</li>
                <li>Interface MATE fluide et moderne</li>
                <li>Adapté usage quotidien (pas que pentest)</li>
                <li>Outils crypto & blockchain intégrés</li>
                <li>Sandbox Firejail par défaut</li>
              </ul>
            </div>

            <div style={{
              background: "#0b0f1a",
              border: "1px solid #2a3f3f",
              borderRadius: "12px",
              padding: "25px"
            }}>
              <h4 style={{ color: "#00ff9c", fontSize: "1.2rem", marginBottom: "15px" }}>
                ⚠️ Limitations
              </h4>
              <ul style={{ color: "#9ca3af", paddingLeft: "20px", lineHeight: "2" }}>
                <li>Moins d'outils préinstallés que Kali</li>
                <li>Communauté plus petite</li>
                <li>Moins de certifications reconnues (OSCP, etc.)</li>
                <li>Documentation moins fournie</li>
                <li>Mises à jour moins fréquentes</li>
              </ul>
            </div>
          </div>

          {/* Outils spécifiques Parrot */}
          <h3 style={{ color: "#00ff9c", fontSize: "1.6rem", marginBottom: "20px" }}>
            🛠️ Outils spécifiques Parrot OS
          </h3>

          <div style={{ display: "grid", gap: "20px", marginBottom: "30px" }}>
            {[
              {
                title: "AnonSurf",
                desc: "Routage complet du trafic système via Tor pour l'anonymat total",
                icon: "🎭"
              },
              {
                title: "Wifiphisher",
                desc: "Attaques Evil Twin et phishing WiFi automatisées",
                icon: "📡"
              },
              {
                title: "Airgeddon",
                desc: "Framework tout-en-un pour audit WiFi (WEP, WPA, WPS, Evil Twin)",
                icon: "📶"
              },
              {
                title: "Cryptography Tools",
                desc: "Suite complète : GnuPG, VeraCrypt, Keyringer, Tomb",
                icon: "🔐"
              },
              {
                title: "Docker & Podman",
                desc: "Environnements conteneurisés préinstallés",
                icon: "🐳"
              },
              {
                title: "Blockchain Tools",
                desc: "Outils d'analyse blockchain et crypto (Etherscan, etc.)",
                icon: "₿"
              }
            ].map((tool, idx) => (
              <div
                key={idx}
                style={{
                  background: "#0b0f1a",
                  border: "1px solid #2a3f3f",
                  borderRadius: "12px",
                  padding: "20px",
                  display: "flex",
                  gap: "20px",
                  alignItems: "center",
                  transition: "all 0.3s"
                }}
                onMouseEnter={(e) => e.currentTarget.style.border = "1px solid #00ff9c"}
                onMouseLeave={(e) => e.currentTarget.style.border = "1px solid #2a3f3f"}
              >
                <div style={{ fontSize: "3rem" }}>{tool.icon}</div>
                <div>
                  <h4 style={{ color: "#00ff9c", fontSize: "1.2rem", marginBottom: "8px" }}>
                    {tool.title}
                  </h4>
                  <p style={{ color: "#9ca3af", margin: 0 }}>{tool.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Téléchargement */}
          <div style={{
            background: "#0b0f1a",
            border: "2px solid #00ff9c",
            borderRadius: "12px",
            padding: "30px",
            textAlign: "center"
          }}>
            <h3 style={{ color: "#00ff9c", fontSize: "1.6rem", marginBottom: "15px" }}>
              💾 Télécharger Parrot OS
            </h3>
            <p style={{ color: "#9ca3af", marginBottom: "25px", lineHeight: "1.6" }}>
              Choisissez l'édition adaptée à vos besoins : Security (pentest), Home (usage quotidien), ou Architect (minimaliste).
            </p>
            <a
              href="https://parrotsec.org/download/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-block",
                background: "#00ff9c",
                color: "#0b0f1a",
                padding: "15px 40px",
                borderRadius: "10px",
                textDecoration: "none",
                fontWeight: "bold",
                fontSize: "1.1rem",
                transition: "all 0.3s"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
                e.currentTarget.style.boxShadow = "0 0 25px rgba(0, 255, 156, 0.5)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              Télécharger Parrot OS
            </a>
          </div>
        </div>
      )}
    </main>
  );
}

import { useState, useRef, useEffect } from "react";

export default function LabOSINT() {
  const [activeTab, setActiveTab] = useState<"terminal" | "challenges" | "playground" | "tools">("terminal");
  const [terminalOutput, setTerminalOutput] = useState<string[]>([
    "Welcome to OSINT Lab Terminal v1.0",
    "Type 'help' for available commands",
    ""
  ]);
  const [terminalInput, setTerminalInput] = useState("");
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [completedChallenges, setCompletedChallenges] = useState<Set<number>>(new Set());
  const [code, setCode] = useState("# Votre code Python ici\nprint('Hello OSINT!')");
  const [codeOutput, setCodeOutput] = useState("");
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Challenges OSINT
  const challenges = [
    {
      id: 1,
      title: "Analyse WHOIS",
      difficulty: "Débutant",
      description: "Utilisez la commande 'whois' pour trouver le registrant du domaine tryhackme.com",
      hint: "Tapez : whois tryhackme.com",
      solution: "tryhackme",
      points: 10
    },
    {
      id: 2,
      title: "Reconnaissance DNS",
      difficulty: "Débutant",
      description: "Trouvez l'adresse IP du serveur web de google.com avec 'nslookup'",
      hint: "Tapez : nslookup google.com",
      solution: "142.250",
      points: 15
    },
    {
      id: 3,
      title: "Scan de ports",
      difficulty: "Intermédiaire",
      description: "Identifiez le service qui tourne sur le port 443 avec 'nmap'",
      hint: "Tapez : nmap -p 443 example.com",
      solution: "https",
      points: 20
    },
    {
      id: 4,
      title: "Metadata EXIF",
      difficulty: "Intermédiaire",
      description: "Extrayez les coordonnées GPS d'une image avec 'exiftool'",
      hint: "Tapez : exiftool photo.jpg | grep GPS",
      solution: "48.8566, 2.3522",
      points: 25
    },
    {
      id: 5,
      title: "Google Dorking",
      difficulty: "Avancé",
      description: "Trouvez des fichiers PDF exposés sur un domaine avec Google Dorks",
      hint: "Utilisez : site:example.com filetype:pdf",
      solution: "site:example.com filetype:pdf",
      points: 30
    }
  ];

  // Commandes terminal simulées
  const executeCommand = (cmd: string) => {
    const parts = cmd.trim().split(" ");
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    let output = "";

    switch (command) {
      case "help":
        output = `Commandes disponibles:
  help          - Affiche cette aide
  whois <domain> - Informations WHOIS d'un domaine
  nslookup <domain> - Résolution DNS
  nmap -p <port> <target> - Scan de port (simulé)
  exiftool <file> - Analyse metadata d'image
  clear         - Efface le terminal
  ls            - Liste les fichiers
  pwd           - Affiche le répertoire courant
  whoami        - Affiche l'utilisateur actuel`;
        break;

      case "whois":
        if (args.length === 0) {
          output = "Usage: whois <domain>";
        } else {
          output = `WHOIS pour ${args[0]}:
Registrant: TryHackMe Ltd
Creation Date: 2018-09-01
Registrar: GoDaddy.com
Name Server: ns1.tryhackme.com
Status: clientTransferProhibited`;
        }
        break;

      case "nslookup":
        if (args.length === 0) {
          output = "Usage: nslookup <domain>";
        } else {
          output = `Server: 8.8.8.8
Address: 8.8.8.8#53

Non-authoritative answer:
Name:    ${args[0]}
Address: 142.250.185.78`;
        }
        break;

      case "nmap":
        if (args.includes("-p") && args.length >= 3) {
          const port = args[args.indexOf("-p") + 1];
          const target = args[args.length - 1];
          output = `Starting Nmap scan on ${target}...

PORT     STATE SERVICE
${port}/tcp  open  ${port === "443" ? "https" : port === "80" ? "http" : port === "22" ? "ssh" : "unknown"}

Nmap done: 1 IP address (1 host up)`;
        } else {
          output = "Usage: nmap -p <port> <target>";
        }
        break;

      case "exiftool":
        if (args.length === 0) {
          output = "Usage: exiftool <filename>";
        } else {
          output = `ExifTool Version Number: 12.40
File Name: ${args[0]}
File Size: 2.4 MB
Camera Model Name: iPhone 13 Pro
Date/Time Original: 2024:01:15 14:32:18
GPS Latitude: 48.8566° N
GPS Longitude: 2.3522° E
GPS Position: 48°51'23.76"N, 2°21'7.92"E (Paris, France)`;
        }
        break;

      case "ls":
        output = `total 8
-rw-r--r-- 1 user user 1024 Jan 15 14:32 photo.jpg
-rw-r--r-- 1 user user  512 Jan 15 14:30 document.pdf
-rw-r--r-- 1 user user 2048 Jan 15 14:28 report.txt
drwxr-xr-x 2 user user 4096 Jan 15 14:25 tools/`;
        break;

      case "pwd":
        output = "/home/osint/lab";
        break;

      case "whoami":
        output = "osint-analyst";
        break;

      case "clear":
        setTerminalOutput([]);
        return;

      default:
        output = `bash: ${command}: command not found`;
    }

    setTerminalOutput([...terminalOutput, `$ ${cmd}`, output, ""]);
  };

  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (terminalInput.trim()) {
      executeCommand(terminalInput);
      setTerminalInput("");
    }
  };

  // Validation des challenges
  const validateChallenge = (answer: string) => {
    const challenge = challenges[currentChallenge];
    if (answer.toLowerCase().includes(challenge.solution.toLowerCase())) {
      const newCompleted = new Set(completedChallenges);
      newCompleted.add(challenge.id);
      setCompletedChallenges(newCompleted);
      localStorage.setItem("lab_challenges", JSON.stringify(Array.from(newCompleted)));
      alert(`✅ Challenge complété ! +${challenge.points} points`);
    } else {
      alert("❌ Réponse incorrecte. Essayez encore !");
    }
  };

  // Exécution du code (simulé)
  const runCode = () => {
    setCodeOutput("Exécution...");
    setTimeout(() => {
      try {
        // Simulation simple - en prod, utiliser Pyodide ou un backend
        if (code.includes("print")) {
          const match = code.match(/print\(['"](.+)['"]\)/);
          if (match) {
            setCodeOutput(`>>> ${match[1]}\n\nExécution réussie ✓`);
          } else {
            setCodeOutput(">>> Hello OSINT!\n\nExécution réussie ✓");
          }
        } else {
          setCodeOutput("Code exécuté avec succès ✓");
        }
      } catch (err) {
        setCodeOutput(`Erreur: ${err}`);
      }
    }, 500);
  };

  // Charger les challenges complétés
  useEffect(() => {
    const saved = localStorage.getItem("lab_challenges");
    if (saved) {
      setCompletedChallenges(new Set(JSON.parse(saved)));
    }
  }, []);

  // Auto-scroll terminal
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [terminalOutput]);

  return (
    <main style={{ padding: "40px", maxWidth: "1600px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: "40px" }}>
        <h1 style={{ color: "#00ff9c", fontSize: "2.5rem", marginBottom: "10px" }}>
          🧪 Labo Interactif OSINT
        </h1>
        <p style={{ color: "#9ca3af", fontSize: "1.2rem", lineHeight: "1.6" }}>
          Pratiquez l'OSINT avec des outils interactifs et des challenges
        </p>
      </div>

      {/* Stats */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "20px",
        marginBottom: "30px"
      }}>
        {[
          { label: "Challenges complétés", value: `${completedChallenges.size}/${challenges.length}`, icon: "🎯" },
          { label: "Points totaux", value: Array.from(completedChallenges).reduce((sum, id) => sum + (challenges.find(c => c.id === id)?.points || 0), 0), icon: "⭐" },
          { label: "Niveau", value: completedChallenges.size >= 4 ? "Expert" : completedChallenges.size >= 2 ? "Intermédiaire" : "Débutant", icon: "🏆" }
        ].map((stat, idx) => (
          <div
            key={idx}
            style={{
              background: "#0b0f1a",
              border: "1px solid #00ff9c",
              borderRadius: "12px",
              padding: "20px",
              textAlign: "center"
            }}
          >
            <div style={{ fontSize: "2rem", marginBottom: "10px" }}>{stat.icon}</div>
            <p style={{ color: "#9ca3af", fontSize: "0.9rem", marginBottom: "5px" }}>{stat.label}</p>
            <p style={{ color: "#00ff9c", fontSize: "1.8rem", fontWeight: "bold", margin: 0 }}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{
        display: "flex",
        gap: "10px",
        marginBottom: "30px",
        borderBottom: "2px solid #2a3f3f",
        paddingBottom: "10px",
        flexWrap: "wrap" as const
      }}>
        {[
          { key: "terminal", label: "🖥️ Terminal", desc: "Ligne de commande interactive" },
          { key: "challenges", label: "🎯 Challenges", desc: "CTF OSINT" },
          { key: "playground", label: "💻 Code", desc: "Python/Bash" },
          { key: "tools", label: "🔍 Outils", desc: "WHOIS, DNS, etc." }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            style={{
              background: activeTab === tab.key ? "#00ff9c" : "transparent",
              color: activeTab === tab.key ? "#0b0f1a" : "#00ff9c",
              border: activeTab === tab.key ? "none" : "1px solid #2a3f3f",
              padding: "12px 24px",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "1rem",
              transition: "all 0.3s",
              textAlign: "left"
            }}
          >
            <div>{tab.label}</div>
            <div style={{ fontSize: "0.75rem", opacity: 0.8, marginTop: "4px" }}>{tab.desc}</div>
          </button>
        ))}
      </div>

      {/* Terminal Tab */}
      {activeTab === "terminal" && (
        <div style={{
          background: "#0b0f1a",
          border: "2px solid #00ff9c",
          borderRadius: "12px",
          padding: "20px",
          minHeight: "500px"
        }}>
          <div style={{
            background: "#1a1f2e",
            borderRadius: "8px",
            padding: "20px",
            fontFamily: "monospace",
            fontSize: "0.95rem",
            height: "400px",
            overflowY: "auto",
            marginBottom: "15px"
          }}>
            {terminalOutput.map((line, idx) => (
              <div key={idx} style={{
                color: line.startsWith("$") ? "#00ff9c" : line.startsWith("bash:") ? "#ef4444" : "#e5e7eb",
                marginBottom: "5px",
                whiteSpace: "pre-wrap"
              }}>
                {line}
              </div>
            ))}
            <div ref={terminalEndRef} />
          </div>

          <form onSubmit={handleTerminalSubmit} style={{ display: "flex", gap: "10px" }}>
            <span style={{ color: "#00ff9c", fontFamily: "monospace", fontSize: "1rem" }}>$</span>
            <input
              type="text"
              value={terminalInput}
              onChange={(e) => setTerminalInput(e.target.value)}
              placeholder="Tapez une commande..."
              style={{
                flex: 1,
                background: "#1a1f2e",
                border: "1px solid #2a3f3f",
                borderRadius: "6px",
                padding: "10px",
                color: "#e5e7eb",
                fontFamily: "monospace",
                fontSize: "1rem"
              }}
              autoFocus
            />
            <button
              type="submit"
              style={{
                background: "#00ff9c",
                color: "#0b0f1a",
                border: "none",
                padding: "10px 20px",
                borderRadius: "6px",
                fontWeight: "bold",
                cursor: "pointer"
              }}
            >
              Exécuter
            </button>
          </form>

          <div style={{
            marginTop: "20px",
            padding: "15px",
            background: "#1a1f2e",
            borderRadius: "8px",
            border: "1px solid #2a3f3f"
          }}>
            <p style={{ color: "#9ca3af", fontSize: "0.9rem", margin: 0 }}>
              💡 <strong style={{ color: "#00ff9c" }}>Astuce :</strong> Tapez 'help' pour voir toutes les commandes disponibles.
              Les commandes simulent un environnement Kali Linux pour l'apprentissage.
            </p>
          </div>
        </div>
      )}

      {/* Challenges Tab */}
      {activeTab === "challenges" && (
        <div>
          <div style={{
            display: "grid",
            gridTemplateColumns: "300px 1fr",
            gap: "20px"
          }}>
            {/* Liste des challenges */}
            <div style={{
              background: "#0b0f1a",
              border: "1px solid #2a3f3f",
              borderRadius: "12px",
              padding: "20px"
            }}>
              <h3 style={{ color: "#00ff9c", marginBottom: "20px" }}>Challenges</h3>
              {challenges.map((challenge, idx) => (
                <div
                  key={challenge.id}
                  onClick={() => setCurrentChallenge(idx)}
                  style={{
                    padding: "15px",
                    marginBottom: "10px",
                    background: currentChallenge === idx ? "#1a1f2e" : "transparent",
                    border: `1px solid ${completedChallenges.has(challenge.id) ? "#00ff9c" : "#2a3f3f"}`,
                    borderRadius: "8px",
                    cursor: "pointer",
                    transition: "all 0.3s"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "5px" }}>
                    <span style={{ color: completedChallenges.has(challenge.id) ? "#00ff9c" : "#e5e7eb", fontWeight: "bold" }}>
                      {completedChallenges.has(challenge.id) ? "✓" : idx + 1}. {challenge.title}
                    </span>
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "#9ca3af" }}>
                    {challenge.difficulty} • {challenge.points} pts
                  </div>
                </div>
              ))}
            </div>

            {/* Challenge actuel */}
            <div style={{
              background: "#0b0f1a",
              border: "2px solid #00ff9c",
              borderRadius: "12px",
              padding: "30px"
            }}>
              <div style={{ marginBottom: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                  <h2 style={{ color: "#00ff9c", margin: 0, fontSize: "1.8rem" }}>
                    {challenges[currentChallenge].title}
                  </h2>
                  <span style={{
                    background: "#1a1f2e",
                    color: "#00ff9c",
                    padding: "6px 12px",
                    borderRadius: "6px",
                    fontSize: "0.9rem"
                  }}>
                    {challenges[currentChallenge].points} points
                  </span>
                </div>
                <span style={{
                  background: challenges[currentChallenge].difficulty === "Débutant" ? "#22c55e" :
                             challenges[currentChallenge].difficulty === "Intermédiaire" ? "#fbbf24" : "#ef4444",
                  color: "#0b0f1a",
                  padding: "4px 12px",
                  borderRadius: "6px",
                  fontSize: "0.85rem",
                  fontWeight: "bold"
                }}>
                  {challenges[currentChallenge].difficulty}
                </span>
              </div>

              <div style={{
                background: "#1a1f2e",
                padding: "20px",
                borderRadius: "8px",
                marginBottom: "20px",
                borderLeft: "4px solid #00ff9c"
              }}>
                <p style={{ color: "#e5e7eb", fontSize: "1.1rem", lineHeight: "1.8", margin: 0 }}>
                  {challenges[currentChallenge].description}
                </p>
              </div>

              {!completedChallenges.has(challenges[currentChallenge].id) && (
                <>
                  <div style={{
                    background: "#1a1f2e",
                    padding: "15px",
                    borderRadius: "8px",
                    marginBottom: "20px",
                    border: "1px solid #fbbf24"
                  }}>
                    <p style={{ color: "#fbbf24", fontWeight: "bold", marginBottom: "8px" }}>
                      💡 Indice
                    </p>
                    <p style={{ color: "#9ca3af", margin: 0 }}>
                      {challenges[currentChallenge].hint}
                    </p>
                  </div>

                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const answer = (e.target as any).answer.value;
                    validateChallenge(answer);
                  }}>
                    <input
                      name="answer"
                      type="text"
                      placeholder="Votre réponse..."
                      style={{
                        width: "100%",
                        padding: "15px",
                        background: "#1a1f2e",
                        border: "1px solid #2a3f3f",
                        borderRadius: "8px",
                        color: "#e5e7eb",
                        fontSize: "1rem",
                        marginBottom: "15px"
                      }}
                    />
                    <button
                      type="submit"
                      style={{
                        background: "#00ff9c",
                        color: "#0b0f1a",
                        border: "none",
                        padding: "15px 30px",
                        borderRadius: "8px",
                        fontWeight: "bold",
                        fontSize: "1rem",
                        cursor: "pointer",
                        width: "100%"
                      }}
                    >
                      Valider ma réponse
                    </button>
                  </form>
                </>
              )}

              {completedChallenges.has(challenges[currentChallenge].id) && (
                <div style={{
                  background: "#1a1f2e",
                  border: "2px solid #00ff9c",
                  borderRadius: "8px",
                  padding: "20px",
                  textAlign: "center"
                }}>
                  <div style={{ fontSize: "3rem", marginBottom: "10px" }}>✓</div>
                  <p style={{ color: "#00ff9c", fontSize: "1.3rem", fontWeight: "bold", margin: 0 }}>
                    Challenge complété !
                  </p>
                  <p style={{ color: "#9ca3af", marginTop: "10px" }}>
                    +{challenges[currentChallenge].points} points ajoutés
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Playground Tab */}
      {activeTab === "playground" && (
        <div style={{
          background: "#0b0f1a",
          border: "2px solid #00ff9c",
          borderRadius: "12px",
          padding: "20px"
        }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            {/* Éditeur */}
            <div>
              <h3 style={{ color: "#00ff9c", marginBottom: "15px" }}>Éditeur Python</h3>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                style={{
                  width: "100%",
                  height: "400px",
                  background: "#1a1f2e",
                  border: "1px solid #2a3f3f",
                  borderRadius: "8px",
                  padding: "15px",
                  color: "#e5e7eb",
                  fontFamily: "monospace",
                  fontSize: "0.95rem",
                  resize: "none"
                }}
              />
              <button
                onClick={runCode}
                style={{
                  background: "#00ff9c",
                  color: "#0b0f1a",
                  border: "none",
                  padding: "12px 24px",
                  borderRadius: "8px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  marginTop: "15px",
                  width: "100%"
                }}
              >
                ▶ Exécuter le code
              </button>
            </div>

            {/* Output */}
            <div>
              <h3 style={{ color: "#00ff9c", marginBottom: "15px" }}>Console de sortie</h3>
              <div style={{
                width: "100%",
                height: "400px",
                background: "#1a1f2e",
                border: "1px solid #2a3f3f",
                borderRadius: "8px",
                padding: "15px",
                color: "#e5e7eb",
                fontFamily: "monospace",
                fontSize: "0.95rem",
                overflowY: "auto",
                whiteSpace: "pre-wrap"
              }}>
                {codeOutput || "Aucune sortie pour le moment..."}
              </div>

              <div style={{
                marginTop: "15px",
                padding: "15px",
                background: "#1a1f2e",
                borderRadius: "8px",
                border: "1px solid #fbbf24"
              }}>
                <p style={{ color: "#fbbf24", fontWeight: "bold", marginBottom: "8px" }}>
                  ⚠️ Note
                </p>
                <p style={{ color: "#9ca3af", fontSize: "0.9rem", margin: 0 }}>
                  L'exécution est simulée côté client. Pour un environnement complet, utilisez la connexion VM Kali.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tools Tab */}
      {activeTab === "tools" && (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "20px"
        }}>
          {[
            { icon: "🌐", title: "WHOIS Lookup", desc: "Informations sur un nom de domaine", link: "https://who.is" },
            { icon: "🔍", title: "DNS Lookup", desc: "Résolution DNS et enregistrements", link: "https://dnschecker.org" },
            { icon: "📡", title: "IP Geolocation", desc: "Localisation géographique d'une IP", link: "https://iplocation.net" },
            { icon: "🔐", title: "SSL Checker", desc: "Vérification de certificats SSL/TLS", link: "https://www.sslshopper.com/ssl-checker.html" },
            { icon: "📧", title: "Email Verifier", desc: "Validation d'adresses email", link: "https://hunter.io/email-verifier" },
            { icon: "🖼️", title: "Reverse Image", desc: "Recherche d'image inversée", link: "https://tineye.com" }
          ].map((tool, idx) => (
            <a
              key={idx}
              href={tool.link}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: "#0b0f1a",
                border: "1px solid #2a3f3f",
                borderRadius: "12px",
                padding: "30px",
                textDecoration: "none",
                transition: "all 0.3s",
                display: "block"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.border = "1px solid #00ff9c";
                e.currentTarget.style.transform = "translateY(-5px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.border = "1px solid #2a3f3f";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div style={{ fontSize: "3rem", marginBottom: "15px" }}>{tool.icon}</div>
              <h3 style={{ color: "#00ff9c", fontSize: "1.3rem", marginBottom: "10px" }}>
                {tool.title}
              </h3>
              <p style={{ color: "#9ca3af", lineHeight: "1.6", margin: 0 }}>
                {tool.desc}
              </p>
            </a>
          ))}
        </div>
      )}
    </main>
  );
}

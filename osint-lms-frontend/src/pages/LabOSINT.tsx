import { useState, useEffect, useRef } from "react";
import { useThemeColors } from "../context/ThemeContext";

interface Exercise {
  id: number;
  title: string;
  description: string;
  hint: string;
  command: string;
  completed: boolean;
}

export default function LabOSINT() {
  const colors = useThemeColors();
  const terminalRef = useRef<HTMLDivElement>(null);
  
  const [exercises] = useState<Exercise[]>([
    {
      id: 1,
      title: "WHOIS Lookup",
      description: "Utilisez la commande 'whois' pour trouver le registrant du domaine cyberosint-academy.com",
      hint: "Tapez : whois cyberosint-academy.com",
      command: "whois cyberosint-academy.com",
      completed: false
    },
    {
      id: 2,
      title: "DNS Resolution",
      description: "Trouvez l'adresse IP du serveur web de cyberosint-academy.com avec 'nslookup'",
      hint: "Tapez : nslookup cyberosint-academy.com",
      command: "nslookup cyberosint-academy.com",
      completed: false
    },
    {
      id: 3,
      title: "Port Scanning",
      description: "Scannez les ports ouverts sur le serveur avec 'nmap'",
      hint: "Tapez : nmap -p 80,443 cyberosint-academy.com",
      command: "nmap -p 80,443 cyberosint-academy.com",
      completed: false
    }
  ]);

  const [currentInput, setCurrentInput] = useState("");
  const [history, setHistory] = useState<string[]>([
    "🔒 CyberOSINT Academy - Terminal Virtuel",
    "Tapez 'help' pour voir les commandes disponibles",
    ""
  ]);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  const executeCommand = (input: string) => {
    const trimmed = input.trim();
    if (!trimmed) return;

    setHistory(prev => [...prev, `$ ${trimmed}`, ""]);

    const parts = trimmed.split(" ");
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    let output = "";

    switch (command) {
      case "help":
        output = `Commandes disponibles:
  help - Affiche cette aide
  clear - Efface l'écran
  ls - Liste les fichiers
  cat <file> - Affiche le contenu d'un fichier
  whois <domain> - Informations WHOIS d'un domaine
  nslookup <domain> - Résolution DNS
  dig <domain> - Requête DNS détaillée
  nmap <options> <target> - Scanner de ports
  curl <url> - Effectue une requête HTTP
  ping <host> - Teste la connectivité
  traceroute <host> - Trace le chemin réseau`;
        break;

      case "whois":
        if (args.length === 0) {
          output = "Usage: whois <domain>";
        } else {
          if (args[0].includes("cyberosint-academy.com")) {
            output = `WHOIS pour ${args[0]}:

Registrant: [PROTECTED - Privacy Enabled]
Registrant Organization: Domains By Proxy, LLC
Creation Date: 2024-02-15
Updated Date: 2025-02-27
Expiration Date: 2026-02-15
Registrar: GoDaddy.com, LLC
Registrar WHOIS Server: whois.godaddy.com
Registrar URL: https://www.godaddy.com
Name Server: vercel-dns-017.com
DNSSEC: unsigned
Status: clientTransferProhibited https://icann.org/epp#clientTransferProhibited
Status: clientDeleteProhibited https://icann.org/epp#clientDeleteProhibited

Registry Registrant ID: [REDACTED FOR PRIVACY]
Registrant Country: FR
Registrant Email: [PROTECTED]
Admin Email: [PROTECTED]
Tech Email: [PROTECTED]`;
          } else {
            output = `WHOIS pour ${args[0]}:
Registrant: Example Organization
Creation Date: 2018-09-01
Registrar: GoDaddy.com
Name Server: ns1.example.com
Status: clientTransferProhibited`;
          }
        }
        break;

      case "nslookup":
        if (args.length === 0) {
          output = "Usage: nslookup <domain>";
        } else {
          if (args[0].includes("cyberosint-academy.com")) {
            output = `Server: 192.168.1.1
Address: 192.168.1.1#53

Non-authoritative answer:
Name:    ${args[0]}
Addresses: 216.198.79.65
          64.29.17.65

Authoritative answers can be found from:
${args[0]}
  nameserver = vercel-dns-017.com.`;
          } else {
            output = `Server: 8.8.8.8
Address: 8.8.8.8#53

Non-authoritative answer:
Name:    ${args[0]}
Address: 142.250.185.78`;
          }
        }
        break;

      case "dig":
        if (args.length === 0) {
          output = "Usage: dig <domain>";
        } else {
          if (args[0].includes("cyberosint-academy.com")) {
            output = `; <<>> DiG 9.18.24 <<>> ${args[0]}
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 12345
;; flags: qr rd ra; QUERY: 1, ANSWER: 2, AUTHORITY: 0, ADDITIONAL: 1

;; OPT PSEUDOSECTION:
; EDNS: version: 0, flags:; udp: 1232
;; QUESTION SECTION:
;${args[0]}.          IN      A

;; ANSWER SECTION:
${args[0]}. 300 IN  A       216.198.79.65
${args[0]}. 300 IN  A       64.29.17.65

;; Query time: 45 msec
;; SERVER: 192.168.1.1#53(192.168.1.1)
;; WHEN: Fri Feb 28 14:30:00 CET 2025
;; MSG SIZE  rcvd: 78`;
          } else {
            output = `; <<>> DiG 9.18.24 <<>> ${args[0]}
;; ->>HEADER<<- opcode: QUERY, status: NOERROR
;; ANSWER SECTION:
${args[0]}. 300 IN  A       93.184.216.34

;; Query time: 28 msec`;
          }
        }
        break;

      case "nmap":
        if (args.includes("-p") && args.length >= 3) {
          const port = args[args.indexOf("-p") + 1];
          const target = args[args.length - 1];
          output = `Starting Nmap scan on ${target}...

PORT     STATE SERVICE
${port.split(",").map(p => `${p}/tcp  open  ${p === "80" ? "http" : p === "443" ? "https" : "unknown"}`).join("\n")}

Nmap scan completed: 1 IP address scanned`;
        } else {
          output = "Usage: nmap -p <ports> <target>\nExample: nmap -p 80,443 example.com";
        }
        break;

      case "curl":
        if (args.length === 0) {
          output = "Usage: curl <url>";
        } else {
          output = `HTTP/1.1 200 OK
Server: nginx
Content-Type: text/html; charset=utf-8
Connection: keep-alive

<!DOCTYPE html>
<html>
<head><title>CyberOSINT Academy</title></head>
<body>
  <h1>Welcome to CyberOSINT Academy</h1>
</body>
</html>`;
        }
        break;

      case "ping":
        if (args.length === 0) {
          output = "Usage: ping <host>";
        } else {
          output = `PING ${args[0]} (216.198.79.65): 56 data bytes
64 bytes from 216.198.79.65: icmp_seq=0 ttl=54 time=12.3 ms
64 bytes from 216.198.79.65: icmp_seq=1 ttl=54 time=11.8 ms
64 bytes from 216.198.79.65: icmp_seq=2 ttl=54 time=12.1 ms

--- ${args[0]} ping statistics ---
3 packets transmitted, 3 packets received, 0.0% packet loss
round-trip min/avg/max/stddev = 11.8/12.1/12.3/0.2 ms`;
        }
        break;

      case "traceroute":
        if (args.length === 0) {
          output = "Usage: traceroute <host>";
        } else {
          output = `traceroute to ${args[0]} (216.198.79.65), 30 hops max
 1  192.168.1.1 (192.168.1.1)  1.234 ms
 2  10.0.0.1 (10.0.0.1)  8.456 ms
 3  * * *
 4  216.198.79.65 (216.198.79.65)  12.789 ms`;
        }
        break;

      case "ls":
        output = `total 8
-rw-r--r-- 1 user user  245 Feb 27 10:30 readme.txt
-rw-r--r-- 1 user user  512 Feb 27 10:31 data.json
drwxr-xr-x 2 user user 4096 Feb 27 10:29 logs`;
        break;

      case "cat":
        if (args.length === 0) {
          output = "Usage: cat <file>";
        } else if (args[0] === "readme.txt") {
          output = `CyberOSINT Academy - Lab Terminal
================================

Bienvenue dans le terminal virtuel !

Ce terminal simule des commandes OSINT courantes.
Utilisez 'help' pour voir les commandes disponibles.

🎯 Objectif : Compléter les exercices listés à droite.`;
        } else if (args[0] === "data.json") {
          output = `{
  "target": "cyberosint-academy.com",
  "last_scan": "2025-02-27T14:30:00Z",
  "status": "active",
  "technologies": ["React", "TypeScript", "Vercel"]
}`;
        } else {
          output = `cat: ${args[0]}: No such file or directory`;
        }
        break;

      case "clear":
        setHistory([]);
        setCurrentInput("");
        return;

      default:
        output = `Command not found: ${command}\nType 'help' for available commands`;
    }

    setHistory(prev => [...prev, output, ""]);
    setCurrentInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      executeCommand(currentInput);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: colors.bgPrimary,
      paddingTop: "80px",
    }}>
      <div style={{
        maxWidth: "1600px",
        margin: "0 auto",
        padding: "40px 20px",
      }}>
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div style={{ fontSize: "4rem", marginBottom: "15px" }}>🖥️</div>
          <h1 style={{
            fontSize: "2.5rem",
            fontWeight: "700",
            color: colors.textPrimary,
            marginBottom: "15px",
          }}>
            Laboratoire OSINT
          </h1>
          <p style={{
            fontSize: "1.1rem",
            color: colors.textSecondary,
            maxWidth: "700px",
            margin: "0 auto",
          }}>
            Pratiquez les commandes OSINT dans un environnement sécurisé
          </p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 400px",
          gap: "30px",
        }}>
          {/* Terminal */}
          <div style={{
            background: "#0a0e1a",
            border: `1px solid ${colors.border}`,
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow: "0 10px 40px rgba(0, 0, 0, 0.3)",
          }}>
            <div style={{
              background: "#1a1f2e",
              padding: "12px 20px",
              borderBottom: `1px solid ${colors.border}`,
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}>
              <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#ef4444" }} />
              <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#fbbf24" }} />
              <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#10b981" }} />
              <span style={{ marginLeft: "15px", color: colors.textSecondary, fontSize: "0.9rem" }}>
                osint@cyberacademy:~$
              </span>
            </div>

            <div
              ref={terminalRef}
              style={{
                padding: "20px",
                height: "600px",
                overflowY: "auto",
                fontFamily: "monospace",
                fontSize: "0.95rem",
                color: "#00ff9c",
              }}
            >
              {history.map((line, i) => (
                <div key={i} style={{ whiteSpace: "pre-wrap", marginBottom: "4px" }}>
                  {line}
                </div>
              ))}

              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <span style={{ color: colors.accent }}>$</span>
                <input
                  type="text"
                  value={currentInput}
                  onChange={(e) => setCurrentInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  autoFocus
                  style={{
                    flex: 1,
                    background: "transparent",
                    border: "none",
                    outline: "none",
                    color: "#00ff9c",
                    fontFamily: "monospace",
                    fontSize: "0.95rem",
                  }}
                />
              </div>
            </div>
          </div>

          {/* Exercices */}
          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}>
            <div style={{
              background: colors.bgSecondary,
              border: `1px solid ${colors.border}`,
              borderRadius: "12px",
              padding: "25px",
            }}>
              <h2 style={{
                fontSize: "1.5rem",
                fontWeight: "700",
                color: colors.textPrimary,
                marginBottom: "20px",
              }}>
                🎯 Exercices
              </h2>

              {exercises.map((ex) => (
                <div
                  key={ex.id}
                  style={{
                    background: colors.bgPrimary,
                    border: `1px solid ${colors.border}`,
                    borderRadius: "8px",
                    padding: "15px",
                    marginBottom: "15px",
                  }}
                >
                  <h3 style={{
                    fontSize: "1.1rem",
                    fontWeight: "600",
                    color: colors.textPrimary,
                    marginBottom: "8px",
                  }}>
                    {ex.id}. {ex.title}
                  </h3>
                  <p style={{
                    fontSize: "0.9rem",
                    color: colors.textSecondary,
                    marginBottom: "10px",
                  }}>
                    {ex.description}
                  </p>
                  <details>
                    <summary style={{
                      fontSize: "0.85rem",
                      color: colors.accent,
                      cursor: "pointer",
                      fontWeight: "500",
                    }}>
                      💡 Indice
                    </summary>
                    <p style={{
                      fontSize: "0.85rem",
                      color: colors.textSecondary,
                      marginTop: "8px",
                      fontFamily: "monospace",
                    }}>
                      {ex.hint}
                    </p>
                  </details>
                </div>
              ))}
            </div>

            <div style={{
              background: `${colors.accent}10`,
              border: `1px solid ${colors.accent}30`,
              borderRadius: "12px",
              padding: "20px",
            }}>
              <p style={{
                fontSize: "0.9rem",
                color: colors.textSecondary,
                lineHeight: "1.6",
                margin: 0,
              }}>
                💡 <strong>Astuce :</strong> Tapez 'help' pour voir toutes les commandes disponibles.
                Les résultats sont simulés mais basés sur les vraies données de cyberosint-academy.com !
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

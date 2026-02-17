import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";

const HELP_TEXT = `
╔═══════════════════════════════════════════╗
║           ARGUS V2.0 - OSINT TOOLKIT      ║
║         Python Reconnaissance Suite       ║
╚═══════════════════════════════════════════╝

Commandes disponibles:
  help                    - Afficher cette aide
  scan <target>           - Reconnaissance complète
  dns <domain>            - Enumération DNS
  whois <domain>          - Lookup WHOIS
  subdomain <domain>      - Découverte sous-domaines
  ports <target>          - Scan de ports
  tech <url>              - Détection technologie
  ssl <domain>            - Analyse certificat SSL
  leaks <email>           - Vérification fuites données
  wayback <url>           - Archives Wayback Machine
  ip <address>            - Géolocalisation IP
  modules                 - Liste des modules
  config                  - Configuration API
  clear                   - Effacer la console
`.trim();

const MODULES_TEXT = `
[*] Modules disponibles (50+):

RÉSEAU:
  [+] dns          - Enumération DNS complète
  [+] whois        - Recherche WHOIS
  [+] ip-geo       - Géolocalisation IP
  [+] port-scan    - Scan de ports TCP/UDP
  [+] ssl-check    - Analyse SSL/TLS
  [+] asn          - Lookup ASN

WEB APPLICATION:
  [+] subdomain    - Découverte sous-domaines
  [+] tech-detect  - Détection technologies
  [+] wayback      - Recherche archives web
  [+] http-headers - Analyse en-têtes HTTP
  [+] robots       - Analyse robots.txt
  [+] sitemap      - Scanner sitemap

SÉCURITÉ:
  [+] breach-check - Vérification fuites
  [+] malware-scan - Scan malware
  [+] waf-detect   - Détection WAF
  [+] cve-search   - Recherche CVE
  [+] shodan       - Intégration Shodan
  [+] censys       - Intégration Censys
`.trim();

function simulate(cmd: string): { lines: string[]; delay: number } {
  const parts = cmd.trim().split(/\s+/);
  const base = parts[0].toLowerCase();
  const target = parts[1] || "";

  const ts = () => new Date().toISOString();

  if (base === "help") return { lines: HELP_TEXT.split("\n"), delay: 0 };
  if (base === "modules") return { lines: MODULES_TEXT.split("\n"), delay: 0 };
  if (base === "clear") return { lines: ["__CLEAR__"], delay: 0 };
  if (base === "config") return { lines: [
    "[*] Configuration API Argus V2.0",
    "  VirusTotal API  : ● Non configuré",
    "  Shodan API      : ● Non configuré",
    "  Censys API      : ● Non configuré",
    "  Google API      : ● Non configuré",
    "  HIBP API        : ● Non configuré",
    "",
    "[!] Configurez vos clés API dans config.yaml",
  ], delay: 0 };

  if (!target) return { lines: [`[!] Erreur: ${base} nécessite une cible. Ex: ${base} example.com`], delay: 0 };

  const results: Record<string, string[]> = {
    dns: [
      `[*] Démarrage énumération DNS pour: ${target}`,
      `[+] A       → 93.184.216.34`,
      `[+] AAAA    → 2606:2800:220:1:248:1893:25c8:1946`,
      `[+] MX      → mail.${target} (priority: 10)`,
      `[+] NS      → ns1.${target}`,
      `[+] NS      → ns2.${target}`,
      `[+] TXT     → "v=spf1 include:_spf.${target} ~all"`,
      `[✓] DNS énumération terminée`,
    ],
    whois: [
      `[*] Requête WHOIS pour: ${target}`,
      `[+] Registrar     : GoDaddy LLC`,
      `[+] Created       : 2010-01-15`,
      `[+] Expires       : 2026-01-15`,
      `[+] Name Servers  : ns1.${target}, ns2.${target}`,
      `[+] Status        : clientTransferProhibited`,
      `[✓] WHOIS terminé`,
    ],
    subdomain: [
      `[*] Découverte sous-domaines pour: ${target}`,
      `[+] www.${target}`,
      `[+] mail.${target}`,
      `[+] api.${target}`,
      `[+] admin.${target}`,
      `[+] dev.${target}`,
      `[+] staging.${target}`,
      `[✓] 6 sous-domaines trouvés`,
    ],
    ports: [
      `[*] Scan ports pour: ${target}`,
      `[+] 22/tcp   OPEN  ssh`,
      `[+] 80/tcp   OPEN  http`,
      `[+] 443/tcp  OPEN  https`,
      `[+] 8080/tcp OPEN  http-proxy`,
      `[✓] Scan terminé - 4 ports ouverts`,
    ],
    ssl: [
      `[*] Analyse SSL/TLS pour: ${target}`,
      `[+] Version        : TLS 1.3`,
      `[+] Cipher         : TLS_AES_256_GCM_SHA384`,
      `[+] Valid From     : 2025-01-01`,
      `[+] Valid Until    : 2026-01-01`,
      `[+] Issuer         : Let's Encrypt`,
      `[+] Subject Alt    : ${target}, www.${target}`,
      `[✓] Certificat valide`,
    ],
    tech: [
      `[*] Détection technologies pour: ${target}`,
      `[+] Framework      : React 18.x`,
      `[+] Server         : Nginx 1.24`,
      `[+] CDN            : Cloudflare`,
      `[+] Analytics      : Google Analytics`,
      `[+] CMS            : Non détecté`,
      `[✓] Détection terminée`,
    ],
    leaks: [
      `[*] Vérification fuites données pour: ${target}`,
      `[!] 2 fuites détectées`,
      `[+] Adobe (2013) - Email, Password hash`,
      `[+] LinkedIn (2016) - Email, Password hash`,
      `[✓] Vérification terminée`,
    ],
    wayback: [
      `[*] Recherche archives Wayback Machine pour: ${target}`,
      `[+] 2020-03-15: https://web.archive.org/web/20200315/${target}`,
      `[+] 2021-07-22: https://web.archive.org/web/20210722/${target}`,
      `[+] 2023-11-10: https://web.archive.org/web/20231110/${target}`,
      `[✓] 3 snapshots trouvés`,
    ],
    ip: [
      `[*] Géolocalisation IP: ${target}`,
      `[+] Country   : France`,
      `[+] City      : Paris`,
      `[+] ISP       : Orange S.A.`,
      `[+] Org       : AS3215 Orange`,
      `[+] Latitude  : 48.8566`,
      `[+] Longitude : 2.3522`,
      `[✓] Géolocalisation terminée`,
    ],
    scan: [
      `[*] Reconnaissance complète pour: ${target}`,
      `[*] Lancement de tous les modules...`,
      `[+] DNS         : ✓ Complété`,
      `[+] WHOIS       : ✓ Complété`,
      `[+] Subdomains  : ✓ 6 trouvés`,
      `[+] Ports       : ✓ 4 ouverts`,
      `[+] SSL         : ✓ Valide`,
      `[+] Tech        : ✓ Détecté`,
      `[+] Leaks       : ✓ 2 trouvés`,
      `[+] Wayback     : ✓ 3 snapshots`,
      `[✓] Reconnaissance complète terminée`,
    ],
  };

  return {
    lines: results[base] || [`[!] Commande inconnue: ${base}. Tapez 'help' pour la liste des commandes.`],
    delay: 800,
  };
}

export default function ArgusConsole() {
  const [history, setHistory] = useState<{ type: "input" | "output" | "error" | "system"; text: string }[]>([
    { type: "system", text: "╔═══════════════════════════════════════════╗" },
    { type: "system", text: "║      ARGUS V2.0 - OSINT RECON TOOLKIT     ║" },
    { type: "system", text: "║   Python Reconnaissance Suite v2.0.0      ║" },
    { type: "system", text: "╚═══════════════════════════════════════════╝" },
    { type: "system", text: "" },
    { type: "system", text: "Tapez 'help' pour voir les commandes disponibles." },
    { type: "system", text: "" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [history]);

  const run = () => {
    if (!input.trim() || loading) return;
    const cmd = input.trim();
    setInput("");
    setHistIdx(-1);
    setCmdHistory(prev => [cmd, ...prev]);
    setHistory(prev => [...prev, { type: "input", text: `argus@recon:~$ ${cmd}` }]);
    setLoading(true);

    const { lines, delay } = simulate(cmd);

    setTimeout(() => {
      if (lines[0] === "__CLEAR__") {
        setHistory([{ type: "system", text: "Console effacée. Tapez 'help' pour l'aide." }]);
      } else {
        setHistory(prev => [...prev, ...lines.map(l => ({
          type: (l.startsWith("[!]") ? "error" : "output") as "output" | "error",
          text: l
        }))]);
      }
      setLoading(false);
    }, delay || 100);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") { run(); return; }
    if (e.key === "ArrowUp") {
      const idx = Math.min(histIdx + 1, cmdHistory.length - 1);
      setHistIdx(idx);
      setInput(cmdHistory[idx] || "");
    }
    if (e.key === "ArrowDown") {
      const idx = Math.max(histIdx - 1, -1);
      setHistIdx(idx);
      setInput(idx === -1 ? "" : cmdHistory[idx]);
    }
  };

  const getColor = (type: string) => {
    if (type === "input") return "#fbbf24";
    if (type === "error") return "#ef4444";
    if (type === "system") return "#6b7280";
    return "#00ff9c";
  };

  return (
    <>
      <Header />
      <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 60px)", background: "#0b0f1a", fontFamily: "'Courier New', monospace" }}>

        {/* Barre titre console */}
        <div style={{ background: "#1a1f2e", borderBottom: "1px solid #00ff9c", padding: "10px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ color: "#ef4444", fontSize: "0.7rem" }}>●</span>
            <span style={{ color: "#fbbf24", fontSize: "0.7rem" }}>●</span>
            <span style={{ color: "#00ff9c", fontSize: "0.7rem" }}>●</span>
            <span style={{ color: "#9ca3af", fontSize: "0.85rem", marginLeft: "10px" }}>argus@recon:~</span>
          </div>
          <Link to="/outils/argus" style={{ color: "#9ca3af", textDecoration: "none", fontSize: "0.8rem" }}>
            ← Retour Argus V2.0
          </Link>
        </div>

        {/* Terminal output */}
        <div onClick={() => inputRef.current?.focus()}
          style={{ flex: 1, overflowY: "auto", padding: "20px", cursor: "text" }}>
          {history.map((line, i) => (
            <div key={i} style={{ color: getColor(line.type), fontSize: "0.9rem", lineHeight: "1.6", whiteSpace: "pre-wrap", minHeight: "1.4em" }}>
              {line.text || "\u00A0"}
            </div>
          ))}
          {loading && (
            <div style={{ color: "#9ca3af", fontSize: "0.9rem" }}>
              <span style={{ animation: "blink 1s infinite" }}>█</span> Traitement en cours...
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div style={{ padding: "15px 20px", background: "#1a1f2e", borderTop: "1px solid #2a3f3f", display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ color: "#00ff9c", fontFamily: "monospace", whiteSpace: "nowrap" }}>argus@recon:~$</span>
          <input ref={inputRef} value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKey}
            placeholder="Entrez une commande... (help pour l'aide)"
            autoFocus disabled={loading}
            style={{ flex: 1, background: "transparent", border: "none", color: "#fbbf24", fontFamily: "monospace", fontSize: "0.9rem", outline: "none" }} />
        </div>

        <style>{`@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }`}</style>
      </div>
    </>
  );
}

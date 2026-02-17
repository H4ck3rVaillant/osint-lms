import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";

const API_BASE = "https://argus-api-aqr6.onrender.com";

const HELP_TEXT = `
╔═══════════════════════════════════════════╗
║           ARGUS V2.0 - OSINT TOOLKIT      ║
║         Python Reconnaissance Suite       ║
╚═══════════════════════════════════════════╝

Commandes disponibles:
  help                    - Afficher cette aide
  modules                 - Liste des modules
  dns <domain>            - Enumération DNS
  whois <domain>          - Lookup WHOIS
  ip <address>            - Géolocalisation IP
  ports <target>          - Scan de ports
  subdomain <domain>      - Découverte sous-domaines
  ssl <domain>            - Analyse certificat SSL
  headers <domain>        - Inspection en-têtes HTTP
  tech <url>              - Détection technologies
  wayback <domain>        - Archives Wayback Machine
  scan <target>           - Reconnaissance complète
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
  [+] headers      - Analyse en-têtes HTTP
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

// Formate la réponse JSON de l'API en lignes lisibles pour la console
function formatApiResponse(cmd: string, data: Record<string, unknown>): string[] {
  const lines: string[] = [];

  if (cmd === "dns") {
    lines.push(`[*] Enumération DNS pour: ${data.domain}`);
    const records = data.records as Record<string, unknown>;
    if (records) {
      for (const [type, values] of Object.entries(records)) {
        if (Array.isArray(values)) {
          values.forEach((v: string) => lines.push(`[+] ${type.padEnd(8)} → ${v}`));
        }
      }
    }
    lines.push(`[✓] DNS énumération terminée`);
  }

  else if (cmd === "whois") {
    lines.push(`[*] Requête WHOIS pour: ${data.domain}`);
    const w = data.whois as Record<string, unknown>;
    if (w) {
      if (w.registrar) lines.push(`[+] Registrar     : ${w.registrar}`);
      if (w.creation_date) lines.push(`[+] Created       : ${w.creation_date}`);
      if (w.expiration_date) lines.push(`[+] Expires       : ${w.expiration_date}`);
      if (w.updated_date) lines.push(`[+] Updated       : ${w.updated_date}`);
      if (w.status) {
        const statuses = Array.isArray(w.status) ? w.status : [w.status];
        statuses.slice(0, 3).forEach((s: string) => lines.push(`[+] Status        : ${s}`));
      }
      if (Array.isArray(w.name_servers)) {
        w.name_servers.slice(0, 4).forEach((ns: string) => lines.push(`[+] Name Server   : ${ns}`));
      }
    }
    lines.push(`[✓] WHOIS terminé`);
  }

  else if (cmd === "ip") {
    lines.push(`[*] Géolocalisation IP: ${data.ip}`);
    if (data.country) lines.push(`[+] Country   : ${data.country}`);
    if (data.regionName) lines.push(`[+] Region    : ${data.regionName}`);
    if (data.city) lines.push(`[+] City      : ${data.city}`);
    if (data.isp) lines.push(`[+] ISP       : ${data.isp}`);
    if (data.org) lines.push(`[+] Org       : ${data.org}`);
    if (data.lat) lines.push(`[+] Latitude  : ${data.lat}`);
    if (data.lon) lines.push(`[+] Longitude : ${data.lon}`);
    if (data.timezone) lines.push(`[+] Timezone  : ${data.timezone}`);
    lines.push(`[✓] Géolocalisation terminée`);
  }

  else if (cmd === "ports") {
    lines.push(`[*] Scan de ports pour: ${data.target}`);
    const open = data.open_ports as Array<Record<string, unknown>>;
    const closed = data.closed_ports as number;
    if (open && open.length > 0) {
      open.forEach((p) => lines.push(`[+] ${String(p.port).padEnd(5)}/tcp  OPEN   ${p.service}`));
    } else {
      lines.push(`[-] Aucun port ouvert détecté`);
    }
    if (closed !== undefined) lines.push(`[-] ${closed} ports fermés`);
    lines.push(`[✓] Scan terminé - ${open?.length || 0} port(s) ouvert(s)`);
  }

  else if (cmd === "subdomain") {
    lines.push(`[*] Découverte sous-domaines pour: ${data.domain}`);
    const found = data.found as string[];
    const checked = data.checked as number;
    if (found && found.length > 0) {
      found.forEach((s: string) => lines.push(`[+] ${s}`));
    } else {
      lines.push(`[-] Aucun sous-domaine résolu`);
    }
    lines.push(`[✓] ${found?.length || 0} sous-domaine(s) trouvé(s) sur ${checked} testés`);
  }

  else if (cmd === "ssl") {
    lines.push(`[*] Analyse SSL/TLS pour: ${data.domain}`);
    const cert = data.certificate as Record<string, unknown>;
    if (cert) {
      if (cert.version) lines.push(`[+] Version        : ${cert.version}`);
      if (cert.issuer) lines.push(`[+] Issuer         : ${JSON.stringify(cert.issuer)}`);
      if (cert.subject) lines.push(`[+] Subject        : ${JSON.stringify(cert.subject)}`);
      if (cert.not_before) lines.push(`[+] Valid From     : ${cert.not_before}`);
      if (cert.not_after) lines.push(`[+] Valid Until    : ${cert.not_after}`);
      if (Array.isArray(cert.san)) {
        lines.push(`[+] SAN            : ${cert.san.join(", ")}`);
      }
    }
    const valid = data.valid;
    lines.push(valid ? `[✓] Certificat valide` : `[!] Certificat invalide ou expiré`);
  }

  else if (cmd === "headers") {
    lines.push(`[*] Inspection en-têtes HTTP pour: ${data.url}`);
    lines.push(`[+] Status         : ${data.status_code}`);
    const hdrs = data.headers as Record<string, string>;
    if (hdrs) {
      Object.entries(hdrs).forEach(([k, v]) => {
        lines.push(`[+] ${k.padEnd(25)}: ${v}`);
      });
    }
    const sec = data.security_headers as Record<string, unknown>;
    if (sec) {
      lines.push(``);
      lines.push(`[*] En-têtes de sécurité:`);
      Object.entries(sec).forEach(([k, v]) => {
        const icon = v ? "[+]" : "[!]";
        lines.push(`${icon} ${k.padEnd(35)}: ${v ? "Présent" : "Absent"}`);
      });
    }
    lines.push(`[✓] Inspection terminée`);
  }

  else if (cmd === "tech") {
    lines.push(`[*] Détection technologies pour: ${data.url}`);
    const techs = data.technologies as string[];
    if (techs && techs.length > 0) {
      techs.forEach((t: string) => lines.push(`[+] ${t}`));
    } else {
      lines.push(`[-] Aucune technologie détectée`);
    }
    const server = data.server as string;
    if (server) lines.push(`[+] Server         : ${server}`);
    lines.push(`[✓] Détection terminée`);
  }

  else if (cmd === "wayback") {
    lines.push(`[*] Archives Wayback Machine pour: ${data.domain}`);
    const snapshots = data.snapshots as Array<Record<string, unknown>>;
    if (snapshots && snapshots.length > 0) {
      snapshots.slice(0, 8).forEach((s) => {
        lines.push(`[+] ${s.timestamp} → ${s.url}`);
      });
      if (snapshots.length > 8) lines.push(`[+] ... et ${snapshots.length - 8} autres snapshots`);
    } else {
      lines.push(`[-] Aucun snapshot trouvé`);
    }
    lines.push(`[✓] ${snapshots?.length || 0} snapshot(s) trouvé(s)`);
  }

  else if (cmd === "scan") {
    lines.push(`[*] Reconnaissance complète pour: ${data.target}`);
    lines.push(`[*] Exécutez les modules individuellement:`);
    lines.push(``);
    lines.push(`  dns ${data.target}`);
    lines.push(`  whois ${data.target}`);
    lines.push(`  subdomain ${data.target}`);
    lines.push(`  ports ${data.target}`);
    lines.push(`  ssl ${data.target}`);
    lines.push(`  headers ${data.target}`);
    lines.push(`  tech ${data.target}`);
    lines.push(`  wayback ${data.target}`);
    lines.push(``);
    lines.push(`[✓] Utilisez les commandes ci-dessus pour un scan complet`);
  }

  return lines;
}

export default function ArgusConsole() {
  const [history, setHistory] = useState<{ type: "input" | "output" | "error" | "system"; text: string }[]>([
    { type: "system", text: "╔═══════════════════════════════════════════╗" },
    { type: "system", text: "║      ARGUS V2.0 - OSINT RECON TOOLKIT     ║" },
    { type: "system", text: "║   Python Reconnaissance Suite v2.0.0      ║" },
    { type: "system", text: "╚═══════════════════════════════════════════╝" },
    { type: "system", text: "" },
    { type: "system", text: "[*] Backend: https://argus-api-aqr6.onrender.com" },
    { type: "system", text: "[✓] Connexion API établie" },
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

  const addLines = (lines: string[], type: "output" | "error" = "output") => {
    setHistory(prev => [...prev, ...lines.map(l => ({
      type: (l.startsWith("[!]") ? "error" : type) as "output" | "error",
      text: l,
    }))]);
  };

  const run = async () => {
    if (!input.trim() || loading) return;
    const cmd = input.trim();
    setInput("");
    setHistIdx(-1);
    setCmdHistory(prev => [cmd, ...prev]);
    setHistory(prev => [...prev, { type: "input", text: `argus@recon:~$ ${cmd}` }]);

    const parts = cmd.trim().split(/\s+/);
    const base = parts[0].toLowerCase();
    const target = parts[1] || "";

    // Commandes locales (sans API)
    if (base === "clear") {
      setHistory([{ type: "system", text: "Console effacée. Tapez 'help' pour l'aide." }]);
      return;
    }
    if (base === "help") { addLines(HELP_TEXT.split("\n")); return; }
    if (base === "modules") { addLines(MODULES_TEXT.split("\n")); return; }
    if (base === "config") {
      addLines([
        "[*] Configuration API Argus V2.0",
        `[+] Backend URL   : ${API_BASE}`,
        "  VirusTotal API  : ● Non configuré",
        "  Shodan API      : ● Non configuré",
        "  Censys API      : ● Non configuré",
        "  Google API      : ● Non configuré",
        "  HIBP API        : ● Non configuré",
        "",
        "[!] Configurez vos clés API dans config.yaml",
      ]);
      return;
    }

    // Commandes nécessitant une cible
    const apiCmds = ["dns", "whois", "ip", "ports", "subdomain", "ssl", "headers", "tech", "wayback", "scan"];
    if (apiCmds.includes(base)) {
      if (!target) {
        addLines([`[!] Erreur: '${base}' nécessite une cible. Ex: ${base} example.com`], "error");
        return;
      }

      setLoading(true);
      addLines([`[*] Connexion à l'API Argus... (${base} ${target})`]);

      // Map commande → endpoint
      const endpointMap: Record<string, string> = {
        dns: `/api/dns/${target}`,
        whois: `/api/whois/${target}`,
        ip: `/api/ip/${target}`,
        ports: `/api/ports/${target}`,
        subdomain: `/api/subdomain/${target}`,
        ssl: `/api/ssl/${target}`,
        headers: `/api/headers/${target}`,
        tech: `/api/tech/${target}`,
        wayback: `/api/wayback/${target}`,
        scan: `/api/scan/${target}`,
      };

      try {
        const res = await fetch(`${API_BASE}${endpointMap[base]}`, {
          signal: AbortSignal.timeout(30000),
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({ detail: res.statusText }));
          addLines([`[!] Erreur API ${res.status}: ${err.detail || err.error || res.statusText}`], "error");
          setLoading(false);
          return;
        }

        const data = await res.json();
        const lines = formatApiResponse(base, data);
        addLines(lines);
      } catch (e: unknown) {
        if (e instanceof Error && (e.name === "TimeoutError" || e.name === "AbortError")) {
          addLines([`[!] Timeout: le serveur n'a pas répondu en 30s. Réessayez.`], "error");
        } else {
          addLines([
            `[!] Erreur de connexion à l'API`,
            `[!] Note: Le serveur Render peut être en veille (~30s au 1er appel)`,
            `[!] Réessayez dans quelques secondes.`,
          ], "error");
        }
      } finally {
        setLoading(false);
      }
      return;
    }

    // Commande inconnue
    addLines([`[!] Commande inconnue: '${base}'. Tapez 'help' pour la liste des commandes.`], "error");
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") { run(); return; }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      const idx = Math.min(histIdx + 1, cmdHistory.length - 1);
      setHistIdx(idx);
      setInput(cmdHistory[idx] || "");
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
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
            <span style={{ color: "#4ade80", fontSize: "0.75rem", marginLeft: "10px" }}>● LIVE API</span>
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
              <span style={{ animation: "blink 1s infinite" }}>█</span> Requête API en cours... (peut prendre jusqu'à 30s si le serveur est en veille)
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
            style={{ flex: 1, background: "transparent", border: "none", color: "#fbbf24", fontFamily: "monospace", fontSize: "0.9rem", outline: "none", opacity: loading ? 0.5 : 1 }} />
        </div>

        <style>{`@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }`}</style>
      </div>
    </>
  );
}

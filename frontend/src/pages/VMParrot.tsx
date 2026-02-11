import { useState, useRef, useEffect, useCallback } from "react";

interface TerminalLine {
  type: "input" | "output" | "error" | "success" | "info" | "banner";
  content: string;
}

interface Session {
  id: string;
  user: string;
  hostname: string;
  cwd: string;
  startTime: Date;
  commandCount: number;
}

/* =====================================================
   COMMANDES SPÉCIFIQUES PARROT OS
===================================================== */
const PARROT_COMMANDS: Record<string, (args: string[], session: Session) => string> = {
  help: () => `
┌─────────────────────────────────────────────────────┐
│           PARROT OS - COMMANDES DISPONIBLES          │
└─────────────────────────────────────────────────────┘

[🎭 ANONYMAT & PRIVACY]
  anonsurf start/stop/status   Routage via Tor
  anonsurf myip                Votre IP anonymisée
  torify <command>             Exécuter via Tor
  macchanger -r <iface>        Changer adresse MAC
  i2prouter start              Démarrer réseau I2P
  proxychains <command>        Chaîner des proxies

[🔍 OSINT & RECON]
  maltego                      Visualisation de liens
  recon-ng                     Framework de reconnaissance
  theHarvester -d <domain>     Collecte d'informations
  osint-framework              Accès OSINT Framework
  spiderfoot -l 0.0.0.0:5001   SpiderFoot OSINT tool
  sherlock <username>           Recherche de profils

[🔐 CRYPTOGRAPHIE]
  gpg --gen-key                Générer clé GPG
  gpg --encrypt -r <email>     Chiffrer un fichier
  gpg --decrypt <file>         Déchiffrer
  openssl genrsa 4096          Générer clé RSA 4096
  veracrypt                    Chiffrement de volume (GUI)
  tomb create <name>           Créer coffre chiffré

[📡 RÉSEAU & WIFI]
  wifiphisher                  Evil Twin / Phishing WiFi
  airgeddon                    Suite audit WiFi complète
  aircrack-ng <cap>            Cracking WEP/WPA
  bettercap -iface eth0        MITM Framework
  nmap -sV <target>            Scan de services
  tcpdump                      Capture trafic

[🔬 FORENSIQUE]
  autopsy                      Forensique disque (GUI)
  foremost -i <disk>           Récupération de fichiers
  volatility3 -f <dump>        Analyse mémoire
  binwalk <firmware>           Analyse de firmware
  strings <binary>             Extraction de chaînes

[⚙️ SYSTÈME]
  ls / ls -la                  Lister fichiers
  cat <file>                   Afficher fichier
  whoami / id                  Utilisateur courant
  uname -a                     Info système
  firejail <app>               Sandbox application
  clear                        Effacer terminal
`,

  whoami: (_, s) => s.user,
  pwd: (_, s) => s.cwd,
  hostname: (_, s) => s.hostname,

  uname: (args) => {
    if (args.includes("-a")) {
      return "Linux parrot 6.5.0-13parrot1-amd64 #1 SMP PREEMPT_DYNAMIC Parrot 6.5.0-1parrot1 (2024-01-10) x86_64 GNU/Linux";
    }
    return "Linux";
  },

  id: (_, s) => `uid=1000(${s.user}) gid=1000(${s.user}) groups=1000(${s.user}),4(adm),24(cdrom),27(sudo),46(plugdev)`,

  anonsurf: (args) => {
    const sub = args[0] || "status";
    if (sub === "start") {
      return `[i] Starting AnonSurf...
[✓] Stopping NetworkManager
[✓] Flushing iptables rules
[✓] Starting Tor service
[✓] Redirecting all traffic through Tor
[✓] DNS leak protection enabled
[✓] IPv6 disabled

[✓] AnonSurf is now running
[i] All traffic is now routed through Tor
[i] Your real IP is hidden`;
    }
    if (sub === "stop") {
      return `[i] Stopping AnonSurf...
[✓] Flushing iptables rules
[✓] Stopping Tor service
[✓] Restoring NetworkManager
[✓] DNS restored to system default

[✓] AnonSurf stopped — back to clearnet`;
    }
    if (sub === "myip") {
      return `[i] Checking your IP address via Tor...

[✓] Current exit node IP: 185.220.101.42
[i] Location: Germany, Frankfurt
[i] ISP: Tor Exit Node
[i] Your real IP is protected

[!] To verify, visit: https://check.torproject.org`;
    }
    return `[i] AnonSurf Status:
    Tor: [✓ RUNNING]
    PID: 1337
    Exit IP: 185.220.101.42 (DE)
    DNS: Tor DNS resolver
    Uptime: 00:14:23
    [✓] You are anonymous`;
  },

  torify: (args) => {
    const cmd = args.join(" ") || "curl ifconfig.me";
    return `[i] Routing through Tor: ${cmd}
185.220.101.42
[✓] Command executed via Tor exit node`;
  },

  macchanger: (args) => {
    const iface = args[args.length - 1] || "eth0";
    if (args.includes("-r")) {
      return `Current MAC: 08:00:27:4e:66:a1 (VirtualBox)
Permanent MAC: 08:00:27:4e:66:a1 (VirtualBox)
New MAC: ${["aa","bb","cc","dd","ee","ff"].map(() => Math.floor(Math.random()*256).toString(16).padStart(2,"0")).join(":")} (Unknown)
[✓] MAC address changed successfully on ${iface}`;
    }
    return `Current MAC: 08:00:27:4e:66:a1 (VirtualBox)\nUsage: macchanger -r <interface>`;
  },

  proxychains: (args) => {
    const cmd = args.join(" ") || "nmap target";
    return `ProxyChains-3.1 (http://proxychains.sf.net)
[i] Using SOCKS5 proxy chain:
    → 127.0.0.1:9050 (Tor) → 10.10.1.5:1080 → 192.168.1.100:3128

[✓] Tunneling ${cmd} through proxy chain
[i] DNS leak protection active`;
  },

  wifiphisher: () => `
  ______ ______ ______ ______ ______ ______ ______ ______ ______
 |______||______||______||______||______||______||______||______||______|

 Wifiphisher 1.4GIT | HTTPS Enabled | Connected Clients: 0
 ESSID: Victim_WiFi | Channel: 6 | BSSID: AA:BB:CC:DD:EE:FF

 [*] Launching Evil Twin attack...
 [+] Deauth frames sent: 127
 [+] Client disconnected: 192.168.1.105
 [+] Client connected to rogue AP: 192.168.1.105

 [*] Waiting for credentials...
 [+] Credentials captured!
     Username: admin
     Password: wifi_password_123

 [✓] Attack successful`,

  airgeddon: () => `
     .~.
    /V V\\
   /| o |\\
  /_|   |_\\
     | | | |   airgeddon v11.0
     |_|_|_|   Multi-use bash script for wifi networks auditing
  
[*] Checking requirements...
[✓] aircrack-ng installed
[✓] airmon-ng installed
[✓] aireplay-ng installed

Available options:
1. Enable monitor mode
2. Capture handshake (WPA/WPA2)
3. Evil Twin attack
4. WPS attacks (Pixie Dust, PIN brute force)
5. Enterprise attacks (MGT/PEAP)`,

  "aircrack-ng": (args) => {
    const cap = args[0] || "capture.cap";
    return `Opening ${cap}
Read 12847 packets.

   #  BSSID              ESSID           Encryption
   1  AA:BB:CC:DD:EE:FF  Victim_Network  WPA (1 handshake)

Choosing first network as target.

                              Aircrack-ng 1.7

                   [00:01:23] 98472 keys tested (1307.23 k/s)

                           KEY FOUND! [ wifi1234 ]

      Master Key     : CD D7 9A 5A CF B0 70 C7 E9 D1 02 3B 87 02 85 D6
      Transient Key  : 06 F8 BB F3 B1 55 AE EE 1F 66 15 0B D8 A3 1B 33`;
  },

  gpg: (args) => {
    if (args.includes("--gen-key") || args.includes("--generate-key")) {
      return `gpg (GnuPG) 2.2.40; Copyright (C) 2022 g10 Code GmbH

Note: Use "gpg --full-generate-key" for a full featured key generation dialog.

GnuPG needs to construct a user ID to identify your key.

Real name: User OSINT
Email address: user@cyberosint.academy
You selected this USER-ID:
    "User OSINT <user@cyberosint.academy>"

[+] Key generated successfully!
pub   rsa4096 2024-01-15 [SC]
      A1B2C3D4E5F6A1B2C3D4E5F6A1B2C3D4E5F6A1B2
uid   [ultimate] User OSINT <user@cyberosint.academy>`;
    }
    if (args.includes("--encrypt")) {
      return `[✓] File encrypted with GPG
Output: secret.txt.gpg
Algorithm: AES256`;
    }
    if (args.includes("--decrypt")) {
      return `gpg: encrypted with 4096-bit RSA key
[✓] Decryption successful
Output: secret.txt`;
    }
    return `gpg (GnuPG) 2.2.40\nUsage: gpg [--gen-key|--encrypt|--decrypt] [options]`;
  },

  openssl: (args) => {
    if (args.includes("genrsa")) {
      const bits = args.find(a => !isNaN(Number(a))) || "2048";
      return `Generating RSA private key, ${bits} bit long modulus (2 primes)
...+++++++++++++++++++++++++++
...+++++++++++++++++++++++++++
e is 65537 (0x010001)
-----BEGIN RSA PRIVATE KEY-----
MIIEowIBAAKCAQEA2a2rwplBQLF29amygykEMmYz0+Kcj3bKBp29ZNngPqXF
... (${Math.floor(Number(bits)/8)} bytes) ...
-----END RSA PRIVATE KEY-----
[✓] RSA key generated`;
    }
    if (args.includes("x509")) {
      return `Certificate:
    Data:
        Version: 3 (0x2)
        Serial Number: 1337
        Signature Algorithm: sha256WithRSAEncryption
        Issuer: CN=CyberOSINT Academy CA
        Validity
            Not Before: Jan 15 00:00:00 2024
            Not After : Jan 15 00:00:00 2025
        Subject: CN=user.cyberosint.academy`;
    }
    return `OpenSSL 3.2.0\nUsage: openssl [genrsa|x509|enc|dgst] [options]`;
  },

  tomb: (args) => {
    const sub = args[0] || "";
    const name = args[1] || "secrets";
    if (sub === "create") {
      return `[i] Creating tomb: ${name}.tomb
[i] Generating random key...
[+] Enter passphrase: ****
[+] Confirm passphrase: ****
[✓] Tomb created: ${name}.tomb (100MB)
[✓] Key created: ${name}.tomb.key
[i] Use 'tomb open ${name}.tomb' to mount`;
    }
    if (sub === "open") {
      return `[i] Opening tomb: ${name}.tomb
[+] Enter passphrase: ****
[✓] Tomb opened at /media/${name}
[i] Mounted with LUKS AES-256`;
    }
    if (sub === "close") {
      return `[✓] Tomb ${name} closed and unmounted\n[i] All data securely encrypted`;
    }
    return `Tomb 2.9 - Crypto undertaker\nUsage: tomb [create|open|close] <name>`;
  },

  firejail: (args) => {
    const app = args[0] || "firefox";
    return `Reading profile /etc/firejail/${app}.profile
Parent pid ${Math.floor(Math.random() * 9000) + 1000}, child pid ${Math.floor(Math.random() * 9000) + 1000}
Child process initialized in ${Math.floor(Math.random() * 100) + 50}ms
[✓] ${app} launched in sandboxed environment
    Network: isolated namespace
    Filesystem: read-only mounts
    Capabilities: dropped`;
  },

  spiderfoot: (args) => {
    return `
  _________      _     __          ____          __
 /   _____/___  (_)___/ /__  _____/ __/___  ____/ /_
 \_____  \/ _ \/ / __  / _ \/ ___/ /_/ __ \/ __  __/
 /        /  __/ / /_/ /  __/ /  / __/ /_/ / /_/ /_
/_______  /\___/_/\__,_/\___/_/  /_/  \____/\__/\__/
        \/

SpiderFoot 4.0 OSINT Automation Tool
Starting web server on http://127.0.0.1:5001
[✓] SpiderFoot started — open browser to continue`;
  },

  "recon-ng": () => `
                                          .
                                         /|\\
    recon-ng 5.1.2                      / | \\
    +----------------------------------'  |  '---+
    |  [recon/contacts-credentials]       |      |
    +--------------------------------------+------+

[recon-ng][default] > help
Commands:
  workspaces   Manage workspaces
  modules      Show/load modules
  marketplace  Browse module marketplace
  options      Manage options
  run          Execute loaded module

[recon-ng][default] > `,

  bettercap: (args) => {
    return `bettercap v2.32.0 (built for linux/amd64 with go1.21)
[10:23:14] [sys.log] loading modules...
[10:23:14] [sys.log] starting network sniffer
[10:23:14] [net.probe] probing 256 targets
[10:23:15] [net.recon] new host: 192.168.1.1 (router) 
[10:23:15] [net.recon] new host: 192.168.1.105 (target)
[10:23:16] [arp.spoof] poisoning 192.168.1.105...

bettercap > `;
  },

  nmap: (args) => {
    const target = args.find(a => !a.startsWith("-")) || "192.168.1.1";
    return `Starting Nmap 7.94 ( https://nmap.org )
Nmap scan report for ${target}
Host is up (0.025s latency).
PORT     STATE SERVICE    VERSION
22/tcp   open  ssh        OpenSSH 8.9p1
80/tcp   open  http       Apache 2.4.57
443/tcp  open  https      nginx 1.24.0
Nmap done: 1 IP address (1 host up) scanned in 3.21 seconds`;
  },

  foremost: (args) => {
    const file = args.find(a => !a.startsWith("-")) || "disk.img";
    return `Processing: ${file}
|${"|".repeat(50)}
Num     Name (bs=512)     Size     File Offset     Comment
0:      00000000.jpg      49152    0               
1:      00001024.pdf      131072   524288          
2:      00003084.docx     65536    1579008         
3:      00005120.png      32768    2621440         

Finish: Tue Jan 15 10:23:45 2024
4 files recovered`;
  },

  strings: (args) => {
    const file = args[0] || "binary";
    return `/lib/x86_64-linux-gnu/libc.so.6
${file}
/lib64/ld-linux-x86-64.so.2
GCC: (Debian 12.2.0) 12.2.0
password: admin123
SECRET_KEY=abc123xyz
database_url=postgresql://user:pass@localhost/mydb
flag{th1s_1s_a_s3cr3t_flag_f0r_tr41n1ng}`;
  },

  ls: (args, s) => {
    if (args.includes("-la") || args.includes("-l")) {
      return `total 56
drwxr-xr-x  9 ${s.user} ${s.user} 4096 Jan 15 10:23 .
drwxr-xr-x 20 root   root   4096 Jan 15 09:00 ..
-rw-------  1 ${s.user} ${s.user}  892 Jan 15 10:23 .bash_history
-rw-r--r--  1 ${s.user} ${s.user}  220 Jan 15 09:00 .bashrc
drwxr-xr-x  2 ${s.user} ${s.user} 4096 Jan 15 09:00 Desktop
drwxr-xr-x  2 ${s.user} ${s.user} 4096 Jan 15 10:10 Documents
drwxr-xr-x  2 ${s.user} ${s.user} 4096 Jan 15 10:20 captures
-rw-r--r--  1 ${s.user} ${s.user} 2048 Jan 15 10:18 recon.txt
-rw-------  1 ${s.user} ${s.user} 1024 Jan 15 10:15 secrets.tomb.key
-rwxr-xr-x  1 ${s.user} ${s.user} 4096 Jan 15 10:22 anon_scan.sh`;
    }
    return `Desktop  Documents  captures  recon.txt  secrets.tomb.key  anon_scan.sh`;
  },

  cat: (args) => {
    const file = args[0] || "";
    if (file === "recon.txt") {
      return `=== Rapport de Reconnaissance ===
Date: ${new Date().toLocaleDateString()}
Cible: target.lab
IP: 10.0.0.50

[+] Ports ouverts: 22, 80, 443, 8080
[+] OS détecté: Ubuntu 22.04
[+] Services: SSH, Apache, nginx
[+] CMS: WordPress 6.4.2

[!] Vulnérabilités potentielles:
  - CVE-2023-5692 (WordPress)
  - Config SSH par défaut`;
    }
    return `cat: ${file}: No such file or directory`;
  },

  whoami: (_, s) => s.user,
  clear: () => "\x1B[2J",
  cls: () => "\x1B[2J",
  date: () => new Date().toString(),
  history: (_, s) => `Session: ${s.id} | Commandes: ${s.commandCount}`
};

/* =====================================================
   COMPOSANT PRINCIPAL
===================================================== */
export default function VMParrot() {
  const [session] = useState<Session>({
    id: Math.random().toString(36).substr(2, 8).toUpperCase(),
    user: "parrot",
    hostname: "parrot-lab",
    cwd: "/home/parrot",
    startTime: new Date(),
    commandCount: 0
  });

  const [lines, setLines] = useState<TerminalLine[]>([
    { type: "banner", content: `
╔══════════════════════════════════════════════════════════════════╗
║                                                                    ║
║  ██████╗  █████╗ ██████╗ ██████╗  ██████╗ ████████╗              ║
║  ██╔══██╗██╔══██╗██╔══██╗██╔══██╗██╔═══██╗╚══██╔══╝              ║
║  ██████╔╝███████║██████╔╝██████╔╝██║   ██║   ██║                  ║
║  ██╔═══╝ ██╔══██║██╔══██╗██╔══██╗██║   ██║   ██║                  ║
║  ██║     ██║  ██║██║  ██║██║  ██║╚██████╔╝   ██║                  ║
║  ╚═╝     ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝    ╚═╝                  ║
║                                                                    ║
║  CyberOSINT Academy — Parrot Security OS v6.0                     ║
║  Session : ${Math.random().toString(36).substr(2, 8).toUpperCase()} | Privacy-focused | Tor ready              ║
╚══════════════════════════════════════════════════════════════════╝` },
    { type: "info", content: "🦜 Parrot OS prêt. Tapez 'help' pour voir les commandes." },
    { type: "output", content: "" }
  ]);

  const [input, setInput] = useState("");
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const [commandCount, setCommandCount] = useState(0);
  const [elapsedTime, setElapsedTime] = useState("00:00");
  const [anonActive, setAnonActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const sessionRef = useRef(session);

  useEffect(() => {
    const timer = setInterval(() => {
      const elapsed = Math.floor((Date.now() - session.startTime.getTime()) / 1000);
      const m = Math.floor(elapsed / 60).toString().padStart(2, "0");
      const s = (elapsed % 60).toString().padStart(2, "0");
      setElapsedTime(`${m}:${s}`);
    }, 1000);
    return () => clearInterval(timer);
  }, [session.startTime]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines]);

  const executeCommand = useCallback((cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    const parts = trimmed.split(/\s+/);
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    setCommandCount(c => c + 1);
    sessionRef.current.commandCount++;

    const newLines: TerminalLine[] = [
      { type: "input", content: `${session.user}@${session.hostname}:${session.cwd}$ ${trimmed}` }
    ];

    if (command === "clear" || command === "cls") {
      setLines([{ type: "info", content: "🦜 Terminal effacé. Tapez 'help' pour l'aide." }]);
      return;
    }

    // Détecter activation AnonSurf
    if (command === "anonsurf" && args[0] === "start") setAnonActive(true);
    if (command === "anonsurf" && args[0] === "stop") setAnonActive(false);

    const handler = PARROT_COMMANDS[command];
    if (handler) {
      const output = handler(args, sessionRef.current);
      newLines.push({ type: "output", content: output });
    } else {
      newLines.push({
        type: "error",
        content: `bash: ${command}: command not found\nTapez 'help' pour voir les commandes`
      });
    }

    setLines(prev => [...prev, ...newLines]);
    setCmdHistory(prev => [trimmed, ...prev.slice(0, 49)]);
    setHistoryIdx(-1);
  }, [session]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      executeCommand(input);
      setInput("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const newIdx = Math.min(historyIdx + 1, cmdHistory.length - 1);
      setHistoryIdx(newIdx);
      if (cmdHistory[newIdx]) setInput(cmdHistory[newIdx]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const newIdx = Math.max(historyIdx - 1, -1);
      setHistoryIdx(newIdx);
      setInput(newIdx === -1 ? "" : cmdHistory[newIdx]);
    } else if (e.key === "Tab") {
      e.preventDefault();
      const cmds = Object.keys(PARROT_COMMANDS);
      const match = cmds.find(c => c.startsWith(input));
      if (match) setInput(match);
    }
  }, [input, cmdHistory, historyIdx, executeCommand]);

  const getLineColor = (type: TerminalLine["type"]) => {
    switch (type) {
      case "input": return "#3b82f6";
      case "error": return "#ef4444";
      case "success": return "#22c55e";
      case "info": return "#a78bfa";
      case "banner": return "#3b82f6";
      default: return "#e5e7eb";
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "1400px", margin: "0 auto" }}>

      {/* Header */}
      <div style={{ marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "15px" }}>
        <div>
          <h1 style={{ color: "#3b82f6", fontSize: "2rem", margin: 0 }}>
            🦜 Parrot OS Lab
          </h1>
          <p style={{ color: "#9ca3af", margin: "5px 0 0 0" }}>
            Privacy & Security — Session isolée
          </p>
        </div>

        <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
          {/* Indicateur Tor */}
          <div style={{
            background: anonActive ? "#0f2d0f" : "#1a1f2e",
            border: `1px solid ${anonActive ? "#22c55e" : "#2a3f3f"}`,
            borderRadius: "8px",
            padding: "10px 15px",
            textAlign: "center"
          }}>
            <div style={{ fontSize: "1.2rem" }}>{anonActive ? "🟢" : "🔴"}</div>
            <div style={{ color: anonActive ? "#22c55e" : "#ef4444", fontWeight: "bold", fontSize: "0.9rem" }}>
              {anonActive ? "TOR ON" : "TOR OFF"}
            </div>
          </div>

          {[
            { label: "Session", value: session.id, icon: "🔑" },
            { label: "Durée", value: elapsedTime, icon: "⏱️" },
            { label: "Commandes", value: commandCount.toString(), icon: "💻" }
          ].map((stat, i) => (
            <div key={i} style={{
              background: "#0b0f1a",
              border: "1px solid #2a3f3f",
              borderRadius: "8px",
              padding: "10px 15px",
              textAlign: "center"
            }}>
              <div style={{ fontSize: "1.2rem" }}>{stat.icon}</div>
              <div style={{ color: "#3b82f6", fontWeight: "bold", fontSize: "0.9rem" }}>{stat.value}</div>
              <div style={{ color: "#9ca3af", fontSize: "0.75rem" }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Barre de titre terminal (style Parrot - bleu) */}
      <div style={{
        background: "#1a2a4a",
        borderRadius: "12px 12px 0 0",
        padding: "10px 20px",
        display: "flex",
        alignItems: "center",
        gap: "10px"
      }}>
        <div style={{ display: "flex", gap: "8px" }}>
          <div style={{ width: "14px", height: "14px", borderRadius: "50%", background: "#ef4444" }} />
          <div style={{ width: "14px", height: "14px", borderRadius: "50%", background: "#fbbf24" }} />
          <div style={{ width: "14px", height: "14px", borderRadius: "50%", background: "#22c55e" }} />
        </div>
        <span style={{ color: "#9ca3af", fontSize: "0.9rem", marginLeft: "10px" }}>
          {session.user}@{session.hostname}: {session.cwd} {anonActive ? "— 🔒 Routing via Tor" : ""}
        </span>
      </div>

      {/* Terminal */}
      <div
        onClick={() => inputRef.current?.focus()}
        style={{
          background: "#050b1a",
          border: "1px solid #1a2a4a",
          borderRadius: "0 0 12px 12px",
          padding: "20px",
          minHeight: "500px",
          maxHeight: "600px",
          overflowY: "auto",
          fontFamily: "'Courier New', Courier, monospace",
          fontSize: "0.9rem",
          cursor: "text"
        }}
      >
        {lines.map((line, i) => (
          <div key={i} style={{
            color: getLineColor(line.type),
            whiteSpace: "pre-wrap",
            lineHeight: "1.6",
            marginBottom: line.type === "banner" ? "10px" : "2px"
          }}>
            {line.content}
          </div>
        ))}

        <div style={{ display: "flex", alignItems: "center", marginTop: "8px" }}>
          <span style={{ color: "#3b82f6", marginRight: "8px", whiteSpace: "nowrap" }}>
            {session.user}@{session.hostname}:{session.cwd}$
          </span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            style={{
              background: "transparent",
              border: "none",
              color: "#3b82f6",
              fontFamily: "'Courier New', Courier, monospace",
              fontSize: "0.9rem",
              outline: "none",
              flex: 1,
              caretColor: "#3b82f6"
            }}
            spellCheck={false}
            autoComplete="off"
          />
        </div>
        <div ref={bottomRef} />
      </div>

      {/* Commandes rapides Parrot */}
      <div style={{
        marginTop: "20px",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: "15px"
      }}>
        {[
          { title: "🎭 Anonymat Tor", cmds: ["anonsurf start", "anonsurf myip", "macchanger -r eth0"] },
          { title: "🔐 Cryptographie", cmds: ["gpg --gen-key", "openssl genrsa 4096", "tomb create secrets"] },
          { title: "📡 WiFi Audit", cmds: ["anonsurf start", "wifiphisher", "airgeddon"] }
        ].map((card, i) => (
          <div key={i} style={{
            background: "#050b1a",
            border: "1px solid #1a2a4a",
            borderRadius: "10px",
            padding: "15px"
          }}>
            <p style={{ color: "#3b82f6", fontWeight: "bold", marginBottom: "10px" }}>{card.title}</p>
            {card.cmds.map((cmd, j) => (
              <button
                key={j}
                onClick={() => { setInput(cmd); inputRef.current?.focus(); }}
                style={{
                  display: "block",
                  width: "100%",
                  background: "#0b1530",
                  border: "1px solid #1a2a4a",
                  color: "#9ca3af",
                  padding: "6px 10px",
                  borderRadius: "6px",
                  marginBottom: "6px",
                  textAlign: "left",
                  fontFamily: "monospace",
                  fontSize: "0.8rem",
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#3b82f6";
                  e.currentTarget.style.color = "#3b82f6";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#1a2a4a";
                  e.currentTarget.style.color = "#9ca3af";
                }}
              >
                $ {cmd}
              </button>
            ))}
          </div>
        ))}
      </div>

      {/* Disclaimer */}
      <div style={{
        marginTop: "20px",
        background: "#0b0b1a",
        border: "1px solid #3b82f6",
        borderRadius: "8px",
        padding: "12px 20px",
        display: "flex",
        alignItems: "center",
        gap: "10px"
      }}>
        <span style={{ fontSize: "1.2rem" }}>🦜</span>
        <p style={{ color: "#9ca3af", fontSize: "0.85rem", margin: 0 }}>
          <strong style={{ color: "#3b82f6" }}>Environnement éducatif isolé.</strong> Les commandes sont simulées à des fins pédagogiques.
          Les techniques d'anonymat présentées ne doivent être utilisées qu'à des fins légales.
        </p>
      </div>
    </div>
  );
}

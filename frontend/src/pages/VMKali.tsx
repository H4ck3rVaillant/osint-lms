import { useState, useRef, useEffect, useCallback } from "react";

/* =====================================================
   TYPES
===================================================== */
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
   RÉPONSES SIMULÉES - BASE DE DONNÉES KALI
===================================================== */
const KALI_COMMANDS: Record<string, (args: string[], session: Session) => string> = {
  help: () => `
┌─────────────────────────────────────────────────────┐
│              KALI LINUX - COMMANDES DISPONIBLES      │
└─────────────────────────────────────────────────────┘

[RÉSEAU & RECONNAISSANCE]
  nmap <target>           Scan de ports et services
  whois <domain>          Informations WHOIS
  dig <domain>            Requêtes DNS avancées
  nslookup <domain>       Résolution DNS
  netcat / nc             Connexions TCP/UDP
  traceroute <host>       Traçage de route réseau
  curl <url>              Requêtes HTTP

[OSINT]
  theHarvester -d <domain>  Collecte d'emails/sous-domaines
  sherlock <username>       Recherche de profils réseaux sociaux
  maltego                   Visualisation de liens (GUI)
  recon-ng                  Framework de reconnaissance

[EXPLOITATION]
  metasploit / msfconsole   Framework d'exploitation
  searchsploit <term>       Recherche d'exploits (ExploitDB)
  sqlmap -u <url>           Injection SQL automatisée
  hydra -l <user> <target>  Brute-force services

[ANALYSE]
  wireshark                 Analyse de paquets (GUI)
  tcpdump                   Capture trafic réseau
  volatility                Forensique mémoire
  binwalk <file>            Analyse de firmware

[MOTS DE PASSE]
  hashcat -a 0 <hash>      Cracking de hash (GPU)
  john <hashfile>           John the Ripper
  hydra                     Brute-force

[SYSTÈME]
  ls / ls -la              Lister fichiers
  cat <file>               Afficher fichier
  pwd                      Répertoire courant
  whoami                   Utilisateur courant
  uname -a                 Info système
  ps aux                   Processus actifs
  ifconfig / ip a          Interfaces réseau
  clear                    Effacer terminal
`,

  whoami: (_, s) => `${s.user}`,

  pwd: (_, s) => s.cwd,

  uname: (args) => {
    if (args.includes("-a")) {
      return "Linux kali 6.6.9-amd64 #1 SMP PREEMPT_DYNAMIC Kali 6.6.9-1kali1 (2024-01-08) x86_64 GNU/Linux";
    }
    return "Linux";
  },

  hostname: (_, s) => s.hostname,

  id: (_, s) => `uid=0(${s.user}) gid=0(${s.user}) groups=0(${s.user})`,

  "ifconfig": () => `eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 10.0.2.15  netmask 255.255.255.0  broadcast 10.0.2.255
        inet6 fe80::a00:27ff:fe4e:66a1  prefixlen 64  scopeid 0x20<link>
        ether 08:00:27:4e:66:a1  txqueuelen 1000  (Ethernet)
        RX packets 1337  bytes 2048712 (2.0 MiB)
        TX packets 892  bytes 125432 (122.4 KiB)

lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536
        inet 127.0.0.1  netmask 255.0.0.0
        inet6 ::1  prefixlen 128  scopeid 0x10<host>
        loop  txqueuelen 1000  (Local Loopback)`,

  "ip": (args) => {
    if (args.includes("a") || args.includes("addr")) {
      return `1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc fq_codel state UP
    link/ether 08:00:27:4e:66:a1 brd ff:ff:ff:ff:ff:ff
    inet 10.0.2.15/24 brd 10.0.2.255 scope global eth0`;
    }
    return "Usage: ip [addr|route|link]";
  },

  nmap: (args) => {
    const target = args.find(a => !a.startsWith("-")) || "localhost";
    if (args.includes("-sV") || args.includes("-A")) {
      return `Starting Nmap 7.94 ( https://nmap.org )
Nmap scan report for ${target}
Host is up (0.032s latency).
Not shown: 993 closed tcp ports (reset)
PORT     STATE SERVICE    VERSION
22/tcp   open  ssh        OpenSSH 9.3p1 Debian (protocol 2.0)
80/tcp   open  http       Apache httpd 2.4.57
443/tcp  open  ssl/https  nginx 1.24.0
3306/tcp open  mysql      MySQL 8.0.35
8080/tcp open  http-proxy Squid http proxy 6.3
8443/tcp open  ssl/https  Jetty 9.4.51

Service detection performed. Please report any incorrect results.
Nmap done: 1 IP address (1 host up) scanned in 12.34 seconds`;
    }
    if (args.includes("-p")) {
      const portIdx = args.indexOf("-p") + 1;
      const port = args[portIdx] || "80";
      return `Starting Nmap 7.94
Nmap scan report for ${target}
Host is up (0.015s latency).

PORT    STATE SERVICE
${port}/tcp open  ${port === "22" ? "ssh" : port === "80" ? "http" : port === "443" ? "https" : port === "3306" ? "mysql" : "unknown"}

Nmap done: 1 IP address (1 host up) scanned in 0.22 seconds`;
    }
    return `Starting Nmap 7.94
Nmap scan report for ${target}
Host is up (0.018s latency).
Not shown: 997 closed tcp ports
PORT    STATE SERVICE
22/tcp  open  ssh
80/tcp  open  http
443/tcp open  https

Nmap done: 1 IP address (1 host up) scanned in 4.21 seconds`;
  },

  whois: (args) => {
    const domain = args[0] || "example.com";
    return `Domain Name: ${domain.toUpperCase()}
Registry Domain ID: 2336799_DOMAIN_COM-VRSN
Registrar WHOIS Server: whois.registrar.com
Registrar URL: http://www.registrar.com
Updated Date: 2023-08-14T07:01:17Z
Creation Date: 1995-08-13T04:00:00Z
Registry Expiry Date: 2024-08-13T04:00:00Z
Registrar: Example Registrar, LLC
Registrant Organization: ${domain.split(".")[0].toUpperCase()} Inc.
Registrant State/Province: California
Registrant Country: US
Name Server: NS1.${domain.toUpperCase()}
Name Server: NS2.${domain.toUpperCase()}
DNSSEC: unsigned`;
  },

  dig: (args) => {
    const domain = args.find(a => !a.startsWith("+") && !a.startsWith("@")) || "example.com";
    const type = args[1]?.toUpperCase() === "MX" ? "MX" : args[1]?.toUpperCase() === "NS" ? "NS" : "A";
    return `; <<>> DiG 9.19.19 <<>> ${domain} ${type !== "A" ? type : ""}
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: ${Math.floor(Math.random() * 65535)}
;; flags: qr rd ra; QUERY: 1, ANSWER: ${type === "MX" ? 2 : 1}, AUTHORITY: 0

;; ANSWER SECTION:
${type === "A" ? `${domain}.   3600  IN  A     93.184.216.34` :
  type === "MX" ? `${domain}.   3600  IN  MX  10  mail1.${domain}.\n${domain}.   3600  IN  MX  20  mail2.${domain}.` :
  `${domain}.   3600  IN  NS    ns1.${domain}.\n${domain}.   3600  IN  NS    ns2.${domain}.`}

;; Query time: 42 msec
;; SERVER: 8.8.8.8#53(8.8.8.8) (UDP)
;; WHEN: ${new Date().toUTCString()}`;
  },

  nslookup: (args) => {
    const domain = args[0] || "example.com";
    return `Server:		8.8.8.8
Address:	8.8.8.8#53

Non-authoritative answer:
Name:	${domain}
Address: 93.184.216.34
Name:	${domain}
Address: 2606:2800:220:1:248:1893:25c8:1946`;
  },

  "theHarvester": (args) => {
    const domainIdx = args.indexOf("-d");
    const domain = domainIdx >= 0 ? args[domainIdx + 1] : "target.com";
    return `*******************************************************************
*  _   _                                            _             *
* | |_| |__   ___ _   _  __ _ _ ____   _____  ___| |_ ___ _ __  *
* | __| '_ \\ / _ \\ | | |/ _\` | '__\\ \\ / / _ \\/ __| __/ _ \\ '__| *
* | |_| | | |  __/ |_| | (_| | |   \\ V /  __/\\__ \\ ||  __/ |    *
*  \\__|_| |_|\\___|\\__,_|\\__,_|_|    \\_/ \\___||___/\\__\\___|_|    *
*                                                                 *
* theHarvester 4.4.3                                              *
*******************************************************************

[*] Target: ${domain}
[*] Searching Bing...
[*] Searching Google...
[*] Searching LinkedIn...

[*] Emails found: 4
------------------
admin@${domain}
contact@${domain}
security@${domain}
info@${domain}

[*] Hosts found: 6
-------------------
mail.${domain}: 10.10.1.5
www.${domain}: 93.184.216.34
api.${domain}: 10.10.1.8
vpn.${domain}: 10.10.1.12
dev.${domain}: 10.10.1.15
staging.${domain}: 10.10.1.20`;
  },

  sherlock: (args) => {
    const username = args[0] || "target_user";
    return `[*] Sherlock: Find Usernames Across Social Networks
[*] Checking username ${username} on:

[+] GitHub: https://github.com/${username}
[+] Twitter/X: https://twitter.com/${username}
[+] Instagram: https://instagram.com/${username}
[+] LinkedIn: https://linkedin.com/in/${username}
[+] Reddit: https://reddit.com/u/${username}
[+] TikTok: https://tiktok.com/@${username}
[+] Pinterest: https://pinterest.com/${username}
[-] Snapchat: Not found
[-] Telegram: Not found
[+] HackerNews: https://news.ycombinator.com/user?id=${username}

[*] 7 accounts found for username '${username}'`;
  },

  sqlmap: (args) => {
    const urlIdx = args.indexOf("-u");
    const url = urlIdx >= 0 ? args[urlIdx + 1] : "http://target.com/page?id=1";
    return `        ___
       __H__
 ___ ___[']_____ ___ ___
|_ -| . ["]     | .'| . |
|___|_  [.]_|_|_|__,|  _|
      |_|V...       |_|   https://sqlmap.org

[*] Starting @ ${new Date().toLocaleTimeString()}
[*] testing URL '${url}'
[*] testing connection to the target URL
[*] checking if the target is protected by some kind of WAF/IPS
[*] testing if the target URL content is stable
[*] heuristic (basic) test to check if POST parameter 'id' is dynamic
[!] heuristic (XSS) test shows that POST parameter 'id' might be vulnerable to XSS attacks

[*] testing for SQL injection on POST parameter 'id'
[!] testing 'MySQL UNION query (NULL) - 1 to 20 columns'
[+] POST parameter 'id' is 'MySQL UNION query' injectable (20 columns)

sqlmap identified the following injection point(s):
---
Parameter: id (POST)
    Type: UNION query
    Title: MySQL UNION query (NULL)
    Payload: id=1 UNION ALL SELECT NULL,NULL,@@version--

[*] the back-end DBMS is MySQL
web server OS: Linux Ubuntu
back-end DBMS: MySQL >= 8.0.0
[*] fetching database names...
available databases: ['information_schema', 'myapp', 'users']`;
  },

  searchsploit: (args) => {
    const query = args.join(" ") || "apache";
    return `----------------------------------------------- ---------------------------------
 Exploit Title                                 |  Path
----------------------------------------------- ---------------------------------
${query.charAt(0).toUpperCase() + query.slice(1)} 2.4.49 - Path Traversal  | multiple/webapps/50383.py
${query.charAt(0).toUpperCase() + query.slice(1)} 2.4.50 - RCE             | multiple/webapps/50512.py
${query.charAt(0).toUpperCase() + query.slice(1)} mod_cgi - RCE             | linux/remote/34900.py
----------------------------------------------- ---------------------------------
Shellcodes: No Results`;
  },

  hashcat: (args) => {
    const hash = args[args.length - 1] || "5d41402abc4b2a76b9719d911017c592";
    return `hashcat (v6.2.6) starting...

OpenCL API (OpenCL 3.0 PoCL 3.1) - Platform #1 [The pocl project]
Device #1: pthread-Intel Core i7, 2048/4096 MB (512 MB allocatable), 8MCU

Hashes: 1 digests; 1 unique digests, 1 unique salts
Bitmaps: 16 bits, 65536 entries

[s]tatus [p]ause [b]ypass [c]heckpoint [f]inish [q]uit => 

${hash}:hello

Session..........: hashcat
Status...........: Cracked
Hash.Mode........: 0 (MD5)
Hash.Target......: ${hash}
Time.Started.....: ${new Date().toLocaleTimeString()}
Speed.#1.........: 892.4 MH/s

Started: ${new Date().toLocaleTimeString()}
Stopped: ${new Date().toLocaleTimeString()}`;
  },

  john: (args) => {
    const file = args[0] || "hashes.txt";
    return `Using default input encoding: UTF-8
Loaded 3 password hashes with no different salts
Remaining 3 password hashes with no different salts
Will run 8 OpenMP threads
Press 'q' or Ctrl-C to abort, almost any other key for status
password123     (user1)
admin2024!      (user2)
letmein         (user3)

3g 0:00:00:02 100% 1.515g/s 18492p/s 18492c/s 18492C/s
Use the "--show" option to display all of the cracked passwords reliably
Session completed.`;
  },

  hydra: (args) => {
    const target = args[args.length - 1] || "192.168.1.1";
    return `Hydra v9.5 (c) 2023 by van Hauser/THC & David Maciejak

Hydra (https://github.com/vanhauser-thc/thc-hydra) starting at ${new Date().toLocaleTimeString()}
[WARNING] Many SSH configurations limit the number of parallel tasks
[DATA] max 16 tasks per 1 server, overall 16 tasks
[DATA] attacking ssh://${target}:22/
[22][ssh] host: ${target}   login: admin   password: admin123
[22][ssh] host: ${target}   login: root    password: toor
1 of 1 target successfully completed, 2 valid passwords found

Hydra (https://github.com/vanhauser-thc/thc-hydra) finished at ${new Date().toLocaleTimeString()}`;
  },

  msfconsole: () => `
                                                  
     ,           ,
    /             \\
   ((__---,,,---__))
      (_) O O (_)_________
         \\ _ /            |\\
          o_o \\   M S F   | \\
               \\   _____  |  *
                |||   WW|||
                |||     |||

       =[ metasploit v6.3.44-dev                          ]
+ -- --=[ 2376 exploits - 1232 auxiliary - 416 post       ]
+ -- --=[ 1391 payloads - 46 encoders - 11 nops           ]
+ -- --=[ 9 evasion                                        ]

msf6 > `,

  ls: (args, s) => {
    if (args.includes("-la") || args.includes("-l")) {
      return `total 48
drwxr-xr-x  8 ${s.user} ${s.user} 4096 Jan 15 10:23 .
drwxr-xr-x 18 root root  4096 Jan 15 09:00 ..
-rw-------  1 ${s.user} ${s.user}  890 Jan 15 10:23 .bash_history
-rw-r--r--  1 ${s.user} ${s.user}  220 Jan 15 09:00 .bash_logout
-rw-r--r--  1 ${s.user} ${s.user} 3526 Jan 15 09:00 .bashrc
drwxr-xr-x  2 ${s.user} ${s.user} 4096 Jan 15 09:00 Desktop
drwxr-xr-x  2 ${s.user} ${s.user} 4096 Jan 15 10:10 Documents
drwxr-xr-x  2 ${s.user} ${s.user} 4096 Jan 15 10:15 Downloads
-rw-r--r--  1 ${s.user} ${s.user} 1337 Jan 15 10:20 targets.txt
-rwxr-xr-x  1 ${s.user} ${s.user} 2048 Jan 15 10:22 recon.sh`;
    }
    return `Desktop  Documents  Downloads  targets.txt  recon.sh`;
  },

  cat: (args) => {
    const file = args[0] || "";
    if (file === "targets.txt") {
      return `# Targets for pentest engagement
# Authorized by: SecCorp Ltd (Contract #2024-089)
192.168.1.0/24
10.0.0.1-50
target.sectest.lab`;
    }
    if (file === "recon.sh") {
      return `#!/bin/bash
# Auto-recon script
TARGET=$1
echo "[*] Starting recon on $TARGET"
nmap -sV -A $TARGET -oN nmap_$TARGET.txt
theHarvester -d $TARGET -b google,bing
echo "[+] Recon complete"`;
    }
    if (file === "/etc/passwd") {
      return `root:x:0:0:root:/root:/bin/bash
kali:x:1000:1000:Kali,,,:/home/kali:/bin/bash
postgres:x:113:117:PostgreSQL administrator,,,:/var/lib/postgresql:/bin/bash`;
    }
    return `cat: ${file}: No such file or directory`;
  },

  "ps": (args) => {
    if (args.includes("aux")) {
      return `USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
root         1  0.0  0.1  38528  4012 ?        Ss   Jan15   0:01 /sbin/init
root       423  0.0  0.2  53912  8234 ?        Ss   Jan15   0:00 /usr/sbin/sshd
kali      1337  0.0  0.5 124512 20480 pts/0    Ss   10:00   0:00 bash
kali      1420  0.0  0.3  85632 12288 pts/0    S    10:05   0:00 nmap -sV target.lab
kali      1422  0.0  0.1  36864  4096 pts/0    R+   10:23   0:00 ps aux`;
    }
    return `  PID TTY          TIME CMD
 1337 pts/0    00:00:00 bash
 1423 pts/0    00:00:00 ps`;
  },

  clear: () => "\x1B[2J",
  cls: () => "\x1B[2J",

  history: (_, s) => `Session #${s.id}\nCommandes exécutées : ${s.commandCount}\nDurée : ${Math.floor((Date.now() - s.startTime.getTime()) / 60000)} minutes`,

  date: () => new Date().toString(),

  netstat: () => `Active Internet connections (w/o servers)
Proto Recv-Q Send-Q Local Address           Foreign Address         State
tcp        0      0 10.0.2.15:ssh           10.0.2.2:51234          ESTABLISHED
tcp        0      0 10.0.2.15:45678         8.8.8.8:53              TIME_WAIT`,

  curl: (args) => {
    const url = args.find(a => a.startsWith("http")) || "http://example.com";
    if (args.includes("-I") || args.includes("--head")) {
      return `HTTP/2 200
content-type: text/html; charset=UTF-8
server: nginx/1.24.0
x-powered-by: PHP/8.2.0
x-frame-options: SAMEORIGIN
x-content-type-options: nosniff
date: ${new Date().toUTCString()}`;
    }
    return `<!DOCTYPE html>\n<html>\n<head><title>Example Domain</title></head>\n<body>\n<h1>Example Domain</h1>\n</body>\n</html>`;
  },

  tcpdump: (args) => {
    return `tcpdump: verbose output suppressed, use -v or -vv for full protocol decode
listening on eth0, link-type EN10MB (Ethernet), snapshot length 262144 bytes
${new Date().toLocaleTimeString()} IP 10.0.2.15.45231 > 8.8.8.8.53: 12345+ A? google.com. (28)
${new Date().toLocaleTimeString()} IP 8.8.8.8.53 > 10.0.2.15.45231: 12345 1/0/0 A 142.250.185.46 (44)
${new Date().toLocaleTimeString()} IP 10.0.2.15.56789 > 93.184.216.34.80: Flags [S], seq 1337
${new Date().toLocaleTimeString()} IP 93.184.216.34.80 > 10.0.2.15.56789: Flags [S.], ack 1338
^C
4 packets captured
4 packets received by filter`;
  },

  binwalk: (args) => {
    const file = args[0] || "firmware.bin";
    return `DECIMAL       HEXADECIMAL     DESCRIPTION
--------------------------------------------------------------------------------
0             0x0             POSIX tar archive (GNU)
1048576       0x100000        Linux kernel ARM boot executable zImage (little-endian)
2097152       0x200000        Squashfs filesystem, little endian, version 4.0
3145728       0x300000        JFFS2 filesystem, little endian
4194304       0x400000        Certificate in DER format (x509 v3)`;
  },

  volatility: (args) => {
    const plugin = args.find(a => !a.startsWith("-")) || "imageinfo";
    return `Volatility Foundation Volatility Framework 3.0
Progress: 100.00 PDB scanning finished

${plugin === "imageinfo" ? `
INFO     volatility3.framework.automagic.linux: 
Suggested Profile: Win10x64_19041
AS Layer1 : PagedMemoryLayer32 (Kernel AS)
Image date and time : 2024-01-15 10:30:00 UTC
Image local date and time : 2024-01-15 11:30:00 +0100` :
plugin === "pslist" ? `
PID    PPID   Name            Offset    Threads  Handles
4      0      System          0x82341ab8  85      482
272    4       smss.exe        0x89aeb020   3       19
372    364     csrss.exe       0x89b2b020   9       363
408    364     wininit.exe     0x89b4b020   3       77
1337   408     lsass.exe       0x89b6b020  10      631` : "Plugin output..."}`;
  }
};

/* =====================================================
   COMPOSANT PRINCIPAL
===================================================== */
export default function VMKali() {
  const [session] = useState<Session>({
    id: Math.random().toString(36).substr(2, 8).toUpperCase(),
    user: "kali",
    hostname: "kali-lab",
    cwd: "/home/kali",
    startTime: new Date(),
    commandCount: 0
  });

  const [lines, setLines] = useState<TerminalLine[]>([
    { type: "banner", content: `
┌─────────────────────────────────────────────────────────────────┐
│                                                                   │
│   ██╗  ██╗ █████╗ ██╗     ██╗    ██╗     ██╗███╗   ██╗██╗   ██╗ │
│   ██║ ██╔╝██╔══██╗██║     ██║    ██║     ██║████╗  ██║██║   ██║ │
│   █████╔╝ ███████║██║     ██║    ██║     ██║██╔██╗ ██║██║   ██║ │
│   ██╔═██╗ ██╔══██║██║     ██║    ██║     ██║██║╚██╗██║██║   ██║ │
│   ██║  ██╗██║  ██║███████╗██║    ███████╗██║██║ ╚████║╚██████╔╝ │
│   ╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝╚═╝    ╚══════╝╚═╝╚═╝  ╚═══╝ ╚═════╝  │
│                                                                   │
│   CyberOSINT Academy - Kali Linux Lab v2024.1                    │
│   Session : ${Math.random().toString(36).substr(2, 8).toUpperCase()} | Environnement isolé | ⚠️ Usage éthique uniquement │
└─────────────────────────────────────────────────────────────────┘` },
    { type: "info", content: "Tapez 'help' pour voir les commandes disponibles" },
    { type: "output", content: "" }
  ]);

  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const [commandCount, setCommandCount] = useState(0);
  const [elapsedTime, setElapsedTime] = useState("00:00");
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const sessionRef = useRef(session);

  // Chronomètre
  useEffect(() => {
    const timer = setInterval(() => {
      const elapsed = Math.floor((Date.now() - session.startTime.getTime()) / 1000);
      const m = Math.floor(elapsed / 60).toString().padStart(2, "0");
      const s = (elapsed % 60).toString().padStart(2, "0");
      setElapsedTime(`${m}:${s}`);
    }, 1000);
    return () => clearInterval(timer);
  }, [session.startTime]);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines]);

  // Focus input on click
  const focusInput = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  const executeCommand = useCallback((cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    const parts = trimmed.split(/\s+/);
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    setCommandCount(c => c + 1);
    sessionRef.current.commandCount++;

    // Ajouter la ligne de commande
    const newLines: TerminalLine[] = [
      { type: "input", content: `${session.user}@${session.hostname}:${session.cwd}$ ${trimmed}` }
    ];

    if (command === "clear" || command === "cls") {
      setLines([{ type: "info", content: "Terminal effacé. Tapez 'help' pour l'aide." }]);
      return;
    }

    if (command === "exit" || command === "logout") {
      newLines.push({ type: "success", content: "Déconnexion... Session terminée." });
      setLines(prev => [...prev, ...newLines]);
      return;
    }

    const handler = KALI_COMMANDS[command] || KALI_COMMANDS[parts[0]];
    if (handler) {
      const output = handler(args, sessionRef.current);
      newLines.push({ type: "output", content: output });
    } else {
      newLines.push({
        type: "error",
        content: `bash: ${command}: command not found\nTapez 'help' pour voir les commandes disponibles`
      });
    }

    setLines(prev => [...prev, ...newLines]);
    setHistory(prev => [trimmed, ...prev.slice(0, 49)]);
    setHistoryIdx(-1);
  }, [session]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      executeCommand(input);
      setInput("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const newIdx = Math.min(historyIdx + 1, history.length - 1);
      setHistoryIdx(newIdx);
      if (history[newIdx]) setInput(history[newIdx]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const newIdx = Math.max(historyIdx - 1, -1);
      setHistoryIdx(newIdx);
      setInput(newIdx === -1 ? "" : history[newIdx]);
    } else if (e.key === "Tab") {
      e.preventDefault();
      const cmds = Object.keys(KALI_COMMANDS);
      const match = cmds.find(c => c.startsWith(input));
      if (match) setInput(match);
    } else if (e.key === "c" && e.ctrlKey) {
      setLines(prev => [...prev,
        { type: "input", content: `${session.user}@${session.hostname}:${session.cwd}$ ${input}^C` }
      ]);
      setInput("");
    }
  }, [input, history, historyIdx, executeCommand, session]);

  const getLineColor = (type: TerminalLine["type"]) => {
    switch (type) {
      case "input": return "#00ff9c";
      case "error": return "#ef4444";
      case "success": return "#22c55e";
      case "info": return "#fbbf24";
      case "banner": return "#00ff9c";
      default: return "#e5e7eb";
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "1400px", margin: "0 auto" }}>

      {/* Header */}
      <div style={{ marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "15px" }}>
        <div>
          <h1 style={{ color: "#00ff9c", fontSize: "2rem", margin: 0 }}>
            🐉 Kali Linux Lab
          </h1>
          <p style={{ color: "#9ca3af", margin: "5px 0 0 0" }}>
            Terminal interactif — Session isolée
          </p>
        </div>

        {/* Stats session */}
        <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
          {[
            { label: "Session ID", value: session.id, icon: "🔑" },
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
              <div style={{ color: "#00ff9c", fontWeight: "bold", fontSize: "0.9rem" }}>{stat.value}</div>
              <div style={{ color: "#9ca3af", fontSize: "0.75rem" }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Barre de titre terminal */}
      <div style={{
        background: "#2a2a2a",
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
          {session.user}@{session.hostname}: {session.cwd}
        </span>
      </div>

      {/* Terminal */}
      <div
        onClick={focusInput}
        style={{
          background: "#0b0f1a",
          border: "1px solid #2a3f3f",
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

        {/* Ligne de saisie */}
        <div style={{ display: "flex", alignItems: "center", marginTop: "8px" }}>
          <span style={{ color: "#00ff9c", marginRight: "8px", whiteSpace: "nowrap" }}>
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
              color: "#00ff9c",
              fontFamily: "'Courier New', Courier, monospace",
              fontSize: "0.9rem",
              outline: "none",
              flex: 1,
              caretColor: "#00ff9c"
            }}
            spellCheck={false}
            autoComplete="off"
          />
        </div>
        <div ref={bottomRef} />
      </div>

      {/* Aide rapide */}
      <div style={{
        marginTop: "20px",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: "15px"
      }}>
        {[
          { title: "🔍 Recon rapide", cmds: ["nmap -sV target.lab", "theHarvester -d target.com -b google", "whois google.com"] },
          { title: "💥 Exploitation", cmds: ["searchsploit apache 2.4", "sqlmap -u 'http://target/?id=1'", "hydra -l admin ssh://10.0.0.1"] },
          { title: "🔐 Password Attacks", cmds: ["hashcat -a 0 hash.txt rockyou.txt", "john --wordlist=rockyou.txt hashes", "sherlock username123"] }
        ].map((card, i) => (
          <div key={i} style={{
            background: "#0b0f1a",
            border: "1px solid #2a3f3f",
            borderRadius: "10px",
            padding: "15px"
          }}>
            <p style={{ color: "#00ff9c", fontWeight: "bold", marginBottom: "10px" }}>{card.title}</p>
            {card.cmds.map((cmd, j) => (
              <button
                key={j}
                onClick={() => { setInput(cmd); inputRef.current?.focus(); }}
                style={{
                  display: "block",
                  width: "100%",
                  background: "#1a1f2e",
                  border: "1px solid #2a3f3f",
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
                  e.currentTarget.style.borderColor = "#00ff9c";
                  e.currentTarget.style.color = "#00ff9c";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#2a3f3f";
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
        background: "#1a0f0f",
        border: "1px solid #ef4444",
        borderRadius: "8px",
        padding: "12px 20px",
        display: "flex",
        alignItems: "center",
        gap: "10px"
      }}>
        <span style={{ fontSize: "1.2rem" }}>⚠️</span>
        <p style={{ color: "#9ca3af", fontSize: "0.85rem", margin: 0 }}>
          <strong style={{ color: "#ef4444" }}>Usage éthique uniquement.</strong> Cet environnement est à des fins éducatives.
          Toute utilisation offensive sur des systèmes sans autorisation est illégale (Art. 323-1 CP).
        </p>
      </div>
    </div>
  );
}

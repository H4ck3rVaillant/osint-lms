import { useState } from "react";
import { useThemeColors } from "../context/ThemeContext";

export default function OutilsCyber() {
  const colors = useThemeColors();
  const [activeCategory, setActiveCategory] = useState<"osint" | "analyse" | "defense" | "network">("osint");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTool, setSelectedTool] = useState<any>(null);

  // Base de données complète des outils
  const tools = {
    osint: [
      {
        id: 1,
        name: "Flowsint",
        icon: "🌊",
        category: "OSINT",
        type: "Automatisation",
        description: "Plateforme d'automatisation OSINT no-code pour créer des workflows de collecte d'informations complexes",
        longDesc: "Flowsint révolutionne l'OSINT en permettant aux analystes de créer visuellement des pipelines de collecte et d'analyse de données sans écrire une ligne de code. Connectez des sources multiples, automatisez vos recherches récurrentes et exportez vos résultats dans des formats exploitables.",
        features: [
          "Interface drag & drop pour créer des workflows OSINT",
          "150+ connecteurs (réseaux sociaux, WHOIS, DNS, API publiques)",
          "Exécution planifiée et déclencheurs automatiques",
          "Export multi-formats (JSON, CSV, PDF, MISP)",
          "Collaboration en équipe temps réel",
          "Tableau de bord de visualisation de données"
        ],
        useCases: [
          "Automatiser la surveillance de domaines et IPs",
          "Créer des profils enrichis à partir de multiples sources",
          "Surveiller des comptes sur plusieurs plateformes sociales",
          "Générer des rapports d'investigation automatiquement"
        ],
        pricing: "Freemium (10 workflows gratuits/mois, puis à partir de 29€/mois)",
        website: "https://flowsint.io",
        tags: ["No-code", "Automation", "Workflow", "Multi-sources"],
        difficulty: "Débutant",
        premium: true
      },
      {
        id: 2,
        name: "Maltego",
        icon: "🕸️",
        category: "OSINT",
        type: "Graph Analysis",
        description: "Outil de visualisation et d'analyse de liens pour l'investigation OSINT avancée",
        longDesc: "Maltego est la référence mondiale pour l'analyse de relations complexes entre entités. Grâce à ses transforms, il interroge automatiquement des centaines de sources pour cartographier des infrastructures, des organisations ou des individus.",
        features: [
          "Visualisation graphique des relations entre entités",
          "Bibliothèque de 100+ transforms (DNS, WHOIS, réseaux sociaux)",
          "Intégration API personnalisées",
          "Collaboration multi-utilisateurs",
          "Export haute résolution pour rapports"
        ],
        useCases: [
          "Cartographier l'infrastructure d'une organisation",
          "Tracer les connexions entre individus (SNA)",
          "Identifier des patterns dans des campagnes de phishing"
        ],
        pricing: "Community (gratuit), Classic (999€/an), XL (1999€/an)",
        website: "https://www.maltego.com",
        tags: ["Graph", "Transforms", "Enterprise"],
        difficulty: "Intermédiaire"
      },
      {
        id: 3,
        name: "Sherlock",
        icon: "🔍",
        category: "OSINT",
        type: "Username Search",
        description: "Recherche de pseudonymes sur 300+ plateformes sociales simultanément",
        longDesc: "Sherlock automatise la recherche de noms d'utilisateurs à travers des centaines de sites web. Parfait pour l'attribution d'acteurs malveillants ou la recherche de profils liés.",
        features: [
          "Scan de 300+ sites (Twitter, GitHub, Reddit, etc.)",
          "Résultats en quelques secondes",
          "Export JSON/CSV",
          "Open source et gratuit"
        ],
        useCases: [
          "Retrouver tous les profils d'un pseudonyme",
          "Attribution dans une enquête cyber",
          "Vérification de disponibilité de username"
        ],
        pricing: "Gratuit (Open Source)",
        website: "https://github.com/sherlock-project/sherlock",
        tags: ["CLI", "Open Source", "Username", "Social Media"],
        difficulty: "Débutant"
      },
      {
        id: 4,
        name: "SpiderFoot",
        icon: "🕷️",
        category: "OSINT",
        type: "Reconnaissance",
        description: "Scanner OSINT automatisé pour reconnaissance de cibles (domaines, IPs, emails)",
        longDesc: "SpiderFoot collecte automatiquement des informations à partir de 200+ sources de données. Il pivote intelligemment entre les découvertes pour construire une image complète de votre cible.",
        features: [
          "200+ modules de collecte (DNS, WHOIS, leaks, dark web)",
          "Interface web intuitive",
          "Graphes de corrélation automatiques",
          "Alertes en temps réel sur nouvelles découvertes"
        ],
        useCases: [
          "Reconnaissance pré-pentest",
          "Surveillance de surface d'attaque",
          "Recherche de fuites de données"
        ],
        pricing: "HX (gratuit), Pro (à partir de 69$/mois)",
        website: "https://www.spiderfoot.net",
        tags: ["Automation", "Web UI", "Multi-source"],
        difficulty: "Intermédiaire"
      },
      {
        id: 5,
        name: "theHarvester",
        icon: "🌾",
        category: "OSINT",
        type: "Email/Subdomain",
        description: "Collecte d'emails, sous-domaines et hosts depuis des sources publiques",
        longDesc: "TheHarvester est un outil CLI essentiel pour la phase de reconnaissance. Il interroge les moteurs de recherche, PGP key servers et Shodan pour découvrir l'empreinte numérique d'une organisation.",
        features: [
          "Collecte d'emails et noms associés",
          "Énumération de sous-domaines",
          "Support de 20+ sources (Google, Bing, Shodan, etc.)",
          "Export XML/HTML"
        ],
        useCases: [
          "Énumération de cibles pour phishing simulation",
          "Découverte de sous-domaines oubliés",
          "Cartographie d'une organisation"
        ],
        pricing: "Gratuit (Open Source)",
        website: "https://github.com/laramies/theHarvester",
        tags: ["CLI", "Enumeration", "Recon"],
        difficulty: "Débutant"
      },
      {
        id: 6,
        name: "OSINT Framework",
        icon: "🗂️",
        category: "OSINT",
        type: "Directory",
        description: "Répertoire interactif de 500+ outils et ressources OSINT classés par catégorie",
        longDesc: "OSINT Framework est LA ressource de référence listant tous les outils OSINT disponibles. Chaque outil est catégorisé et accompagné d'un lien direct.",
        features: [
          "Arborescence interactive de ressources",
          "500+ outils référencés",
          "Classification par type de collecte",
          "Mise à jour communautaire régulière"
        ],
        useCases: [
          "Découvrir de nouveaux outils OSINT",
          "Trouver l'outil adapté à un besoin spécifique",
          "Référence pour formations OSINT"
        ],
        pricing: "Gratuit",
        website: "https://osintframework.com",
        tags: ["Directory", "Reference", "Learning"],
        difficulty: "Tous niveaux"
      }
    ],
    analyse: [
      {
        id: 7,
        name: "Wireshark",
        icon: "🦈",
        category: "Analyse",
        type: "Network Protocol",
        description: "Analyseur de protocoles réseau leader mondial pour capture et inspection de paquets",
        longDesc: "Wireshark est l'outil de référence pour l'analyse réseau. Il capture le trafic en temps réel et permet une inspection détaillée de chaque paquet avec décodage automatique de centaines de protocoles.",
        features: [
          "Capture live ou analyse de PCAP",
          "Décodage de 2000+ protocoles",
          "Filtres d'affichage puissants (BPF)",
          "Statistiques et graphes de trafic",
          "Export dans multiples formats"
        ],
        useCases: [
          "Débuggage réseau et troubleshooting",
          "Analyse forensique post-incident",
          "Détection d'intrusions et malwares",
          "Reverse engineering de protocoles"
        ],
        pricing: "Gratuit (Open Source)",
        website: "https://www.wireshark.org",
        tags: ["PCAP", "Protocol", "Network", "Forensics"],
        difficulty: "Intermédiaire"
      },
      {
        id: 8,
        name: "Ghidra",
        icon: "🔬",
        category: "Analyse",
        type: "Reverse Engineering",
        description: "Suite de reverse engineering développée par la NSA pour analyse de binaires",
        longDesc: "Ghidra est un framework complet de désassemblage et décompilation. Il supporte de nombreuses architectures et offre des capacités de scripting avancées pour automatiser l'analyse.",
        features: [
          "Décompilateur multi-architectures (x86, ARM, MIPS...)",
          "Interface graphique intuitive",
          "Collaboration multi-utilisateurs",
          "Scripting Python/Java",
          "Plugin ecosystem"
        ],
        useCases: [
          "Analyse de malwares",
          "Recherche de vulnérabilités dans des binaires",
          "Compréhension de firmware embarqué",
          "Challenge CTF reverse"
        ],
        pricing: "Gratuit (Open Source - NSA)",
        website: "https://ghidra-sre.org",
        tags: ["Reverse", "Malware", "NSA", "Decompiler"],
        difficulty: "Avancé"
      },
      {
        id: 9,
        name: "Volatility",
        icon: "🧠",
        category: "Analyse",
        type: "Memory Forensics",
        description: "Framework d'analyse forensique de mémoire RAM pour investigation post-compromission",
        longDesc: "Volatility extrait des artefacts numériques depuis des dumps de mémoire vive. Indispensable pour analyser des systèmes compromis et découvrir des malwares résidents en mémoire.",
        features: [
          "Support Windows, Linux, macOS, Android",
          "Extraction de processus, DLLs, registry, network connections",
          "Détection de rootkits et code injection",
          "Timeline reconstruction",
          "Plugin architecture extensible"
        ],
        useCases: [
          "Analyse post-mortem d'incidents",
          "Détection de malwares fileless",
          "Forensique de ransomware",
          "Challenge CTF forensics"
        ],
        pricing: "Gratuit (Open Source)",
        website: "https://www.volatilityfoundation.org",
        tags: ["Memory", "Forensics", "Malware", "Incident Response"],
        difficulty: "Avancé"
      },
      {
        id: 10,
        name: "Burp Suite",
        icon: "🕵️",
        category: "Analyse",
        type: "Web Security",
        description: "Plateforme complète pour tester la sécurité des applications web",
        longDesc: "Burp Suite est l'outil de référence pour les pentests web. Il agit comme un proxy intercepteur permettant de modifier les requêtes HTTP/HTTPS à la volée et d'automatiser la recherche de vulnérabilités.",
        features: [
          "Proxy intercepteur HTTP/HTTPS",
          "Scanner automatique de vulnérabilités (XSS, SQLi, CSRF...)",
          "Intruder pour fuzzing et bruteforce",
          "Repeater pour tests manuels",
          "Extensions (BApp Store)"
        ],
        useCases: [
          "Pentesting d'applications web",
          "Bug bounty hunting",
          "Audit de sécurité API REST",
          "Formation sécurité applicative"
        ],
        pricing: "Community (gratuit), Pro (449€/an), Enterprise (sur devis)",
        website: "https://portswigger.net/burp",
        tags: ["Web", "Pentest", "Proxy", "Scanner"],
        difficulty: "Intermédiaire"
      },
      {
        id: 11,
        name: "Splunk",
        icon: "📊",
        category: "Analyse",
        type: "SIEM / Log Analysis",
        description: "Plateforme d'analyse de logs et SIEM pour corrélation d'événements de sécurité",
        longDesc: "Splunk ingère et indexe des volumes massifs de logs pour offrir une recherche rapide et des dashboards de corrélation. Essentiel pour les SOC et la détection de menaces.",
        features: [
          "Ingestion de logs multi-sources",
          "SPL (Search Processing Language) puissant",
          "Machine learning pour détection d'anomalies",
          "Dashboards et alertes temps réel",
          "Marketplace d'apps (add-ons)"
        ],
        useCases: [
          "Corrélation d'incidents de sécurité",
          "Threat hunting dans les logs",
          "Conformité réglementaire (PCI DSS, ISO 27001)",
          "Monitoring d'infrastructure"
        ],
        pricing: "Free (500MB/jour), Enterprise (sur devis)",
        website: "https://www.splunk.com",
        tags: ["SIEM", "Logs", "SOC", "ML"],
        difficulty: "Intermédiaire"
      }
    ],
    defense: [
      {
        id: 12,
        name: "Wazuh",
        icon: "🛡️",
        category: "Défense",
        type: "XDR / SIEM",
        description: "Plateforme XDR open source pour détection de menaces, réponse aux incidents et conformité",
        longDesc: "Wazuh unifie la surveillance de sécurité à travers vos endpoints, cloud et containers. Il combine EDR, FIM, détection de vulnérabilités et réponse automatisée dans une solution cohérente.",
        features: [
          "Détection d'intrusions (HIDS/NIDS)",
          "File Integrity Monitoring (FIM)",
          "Vulnerability detection",
          "Cloud security (AWS, Azure, GCP)",
          "Compliance (PCI DSS, GDPR, HIPAA)",
          "Réponse active automatisée"
        ],
        useCases: [
          "Protection d'endpoints Windows/Linux",
          "Surveillance d'infrastructure cloud",
          "Conformité réglementaire",
          "Threat hunting et incident response"
        ],
        pricing: "Gratuit (Open Source)",
        website: "https://wazuh.com",
        tags: ["XDR", "EDR", "Open Source", "Cloud"],
        difficulty: "Intermédiaire"
      },
      {
        id: 13,
        name: "Suricata",
        icon: "🦈",
        category: "Défense",
        type: "IDS/IPS",
        description: "Moteur IDS/IPS/NSM haute performance avec support multi-threading",
        longDesc: "Suricata est un IDS/IPS de nouvelle génération capable d'analyser le trafic réseau à 100Gbps+. Il détecte les menaces via des signatures (règles Snort compatibles) et des analyses comportementales.",
        features: [
          "Détection par signatures et anomalies",
          "Multi-threading natif (hautes performances)",
          "Extraction automatique de fichiers",
          "Support TLS/SSL inspection",
          "Logs JSON structurés (intégration SIEM)",
          "Rulesets communautaires (Emerging Threats)"
        ],
        useCases: [
          "Détection d'intrusions réseau",
          "Monitoring de trafic chiffré",
          "NSM (Network Security Monitoring)",
          "Compliance et forensique réseau"
        ],
        pricing: "Gratuit (Open Source)",
        website: "https://suricata.io",
        tags: ["IDS", "IPS", "NSM", "High Performance"],
        difficulty: "Avancé"
      },
      {
        id: 14,
        name: "CrowdSec",
        icon: "👥",
        category: "Défense",
        type: "Collaborative Security",
        description: "Système de défense collaboratif basé sur le crowd-sourcing de CTI",
        longDesc: "CrowdSec applique le concept de crowdsourcing à la cybersécurité. Chaque instance partage anonymement les IPs malveillantes détectées, créant une intelligence collective mondiale.",
        features: [
          "Détection comportementale de menaces",
          "CTI collaborative (IP reputation)",
          "Bouncers pour bloquer en temps réel (firewall, WAF)",
          "Support multi-services (SSH, HTTP, etc.)",
          "Console centralisée multi-instances"
        ],
        useCases: [
          "Bloquer les bruteforce SSH/RDP",
          "Protéger applications web (WAF)",
          "Partager la CTI entre infrastructures",
          "Réduire les faux positifs grâce à la communauté"
        ],
        pricing: "Gratuit (Open Source), Premium CTI (sur devis)",
        website: "https://www.crowdsec.net",
        tags: ["Collaborative", "CTI", "WAF", "Community"],
        difficulty: "Débutant"
      },
      {
        id: 15,
        name: "Fail2Ban",
        icon: "🚫",
        category: "Défense",
        type: "Intrusion Prevention",
        description: "Bannissement automatique d'IPs après détection de tentatives malveillantes",
        longDesc: "Fail2Ban surveille vos logs système et banni automatiquement (via iptables/firewalld) les IPs exhibant des comportements malveillants comme des bruteforce.",
        features: [
          "Surveillance de logs en temps réel",
          "Filtres regex personnalisables",
          "Actions automatiques (ban IP via firewall)",
          "Support multi-services (SSH, Apache, Nginx, etc.)",
          "Notifications par email"
        ],
        useCases: [
          "Bloquer bruteforce SSH/FTP",
          "Protéger serveurs web contre scans",
          "Limiter les tentatives de login",
          "Réduire le bruit dans les logs"
        ],
        pricing: "Gratuit (Open Source)",
        website: "https://www.fail2ban.org",
        tags: ["IPS", "Logs", "Firewall", "Bruteforce"],
        difficulty: "Débutant"
      },
      {
        id: 16,
        name: "OSSEC",
        icon: "🔐",
        category: "Défense",
        type: "HIDS",
        description: "Host-based Intrusion Detection System pour surveillance d'intégrité et détection d'anomalies",
        longDesc: "OSSEC est un HIDS multiplateforme qui surveille l'intégrité des fichiers, analyse les logs et détecte les rootkits. Il alerte en temps réel sur les activités suspectes.",
        features: [
          "File Integrity Monitoring (FIM)",
          "Log analysis et corrélation",
          "Rootkit detection",
          "Active response (blocage automatique)",
          "Architecture agent/serveur",
          "Compliance (PCI DSS)"
        ],
        useCases: [
          "Surveillance d'intégrité de serveurs critiques",
          "Détection de modifications non autorisées",
          "Alerting sur événements de sécurité",
          "Conformité réglementaire"
        ],
        pricing: "Gratuit (Open Source)",
        website: "https://www.ossec.net",
        tags: ["HIDS", "FIM", "Compliance", "Rootkit"],
        difficulty: "Intermédiaire"
      }
    ],
    network: [
      {
        id: 17,
        name: "Nmap",
        icon: "🗺️",
        category: "Network",
        type: "Port Scanner",
        description: "Scanner de ports et découverte réseau le plus utilisé au monde",
        longDesc: "Nmap (Network Mapper) est l'outil de référence pour la découverte réseau et l'audit de sécurité. Il scanne les ports, détecte les services et OS, et possède un moteur de scripts NSE ultra-puissant.",
        features: [
          "Scan de ports TCP/UDP (SYN, ACK, FIN, Xmas...)",
          "Détection d'OS et de versions de services",
          "650+ scripts NSE (vulnérabilités, bruteforce, etc.)",
          "Output XML/JSON pour automatisation",
          "IPv6 support complet"
        ],
        useCases: [
          "Découverte d'hôtes sur un réseau",
          "Cartographie d'infrastructure",
          "Détection de services vulnérables",
          "Audit de configuration firewall"
        ],
        pricing: "Gratuit (Open Source)",
        website: "https://nmap.org",
        tags: ["Scanner", "NSE", "Recon", "Essential"],
        difficulty: "Débutant"
      },
      {
        id: 18,
        name: "Masscan",
        icon: "⚡",
        category: "Network",
        type: "Fast Port Scanner",
        description: "Scanner de ports ultra-rapide capable de scanner Internet en 6 minutes",
        longDesc: "Masscan est le scanner de ports le plus rapide au monde. Il peut scanner l'intégralité d'Internet (4 milliards d'IPs) sur un port en moins de 6 minutes grâce à son architecture asynchrone.",
        features: [
          "10 millions de paquets/seconde",
          "Scan de plages IP massives",
          "Output compatible Nmap",
          "Bannergrabbing intégré",
          "Randomisation pour éviter détection"
        ],
        useCases: [
          "Reconnaissance de large scope",
          "Bug bounty (découverte d'assets)",
          "Cartographie Internet (research)",
          "Red team reconnaissance rapide"
        ],
        pricing: "Gratuit (Open Source)",
        website: "https://github.com/robertdavidgraham/masscan",
        tags: ["Fast", "Internet-scale", "Recon"],
        difficulty: "Intermédiaire"
      },
      {
        id: 19,
        name: "Shodan",
        icon: "🌐",
        category: "Network",
        type: "IoT Search Engine",
        description: "Moteur de recherche pour appareils connectés et services exposés sur Internet",
        longDesc: "Shodan scanne continuellement Internet et indexe les bannières de services (HTTP, SSH, FTP, etc.). Il révèle des milliers d'appareils IoT, caméras, ICS/SCADA et serveurs mal configurés.",
        features: [
          "Base de données de milliards d'appareils",
          "Recherche par pays, organisation, produit",
          "Filtres avancés (port, SSL, vulnérabilité)",
          "API pour automatisation",
          "Alertes sur nouveaux résultats",
          "Exploits database intégrée"
        ],
        useCases: [
          "Découverte de surface d'attaque d'une org",
          "Recherche d'appareils IoT vulnérables",
          "Threat intelligence sur infrastructures",
          "Bug bounty reconnaissance"
        ],
        pricing: "Freelance (59$/mois), Corporate (899$/mois)",
        website: "https://www.shodan.io",
        tags: ["IoT", "Search Engine", "CTI", "API"],
        difficulty: "Débutant"
      },
      {
        id: 20,
        name: "Netcat",
        icon: "🐱",
        category: "Network",
        type: "Network Swiss Army Knife",
        description: "Outil réseau polyvalent pour lecture/écriture TCP/UDP",
        longDesc: "Netcat (nc) est surnommé le 'couteau suisse TCP/IP'. Il permet d'ouvrir des connexions TCP/UDP, écouter sur des ports, transférer des fichiers et même créer des shells reverses.",
        features: [
          "Client/serveur TCP et UDP",
          "Port scanning basique",
          "Transfert de fichiers",
          "Reverse/bind shells",
          "Port forwarding",
          "Banner grabbing"
        ],
        useCases: [
          "Tester connectivité réseau",
          "Débugger services réseau",
          "Exfiltration de données",
          "Backdoor/reverse shell (pentest)",
          "Relai de connexions"
        ],
        pricing: "Gratuit (Intégré Unix/Linux)",
        website: "http://netcat.sourceforge.net",
        tags: ["CLI", "Essential", "Versatile"],
        difficulty: "Débutant"
      },
      {
        id: 21,
        name: "Responder",
        icon: "🎣",
        category: "Network",
        type: "LLMNR/NBT-NS Poisoner",
        description: "Outil d'empoisonnement réseau pour capturer des credentials Windows",
        longDesc: "Responder exploite les protocoles LLMNR, NBT-NS et MDNS pour se faire passer pour des ressources réseau légitimes et capturer des hashes NTLMv1/v2.",
        features: [
          "Poisoning LLMNR/NBT-NS/MDNS",
          "Serveurs SMB, HTTP, LDAP, etc.",
          "Capture de hashes NTLMv1/v2",
          "Relay attacks",
          "Intégration avec John/Hashcat"
        ],
        useCases: [
          "Pentest Active Directory",
          "Capture de credentials réseau",
          "Mouvements latéraux post-compromission",
          "Red team initial access"
        ],
        pricing: "Gratuit (Open Source)",
        website: "https://github.com/lgandx/Responder",
        tags: ["Windows", "AD", "Pentest", "Credential Harvesting"],
        difficulty: "Avancé"
      },
      {
        id: 22,
        name: "Tcpdump",
        icon: "📦",
        category: "Network",
        type: "Packet Capture",
        description: "Outil CLI de capture de paquets réseau ultra-performant",
        longDesc: "Tcpdump est l'outil historique de capture réseau en ligne de commande. Léger et rapide, il est parfait pour du troubleshooting ou de la capture forensique sur serveurs sans GUI.",
        features: [
          "Capture live ou fichier PCAP",
          "Filtres BPF (Berkeley Packet Filter)",
          "Minimal overhead (idéal production)",
          "Output ASCII ou hex",
          "Support de tous les protocoles"
        ],
        useCases: [
          "Débuggage réseau sur serveurs",
          "Capture forensique rapide",
          "Troubleshooting applicatif",
          "Génération de PCAP pour Wireshark"
        ],
        pricing: "Gratuit (Intégré Unix/Linux)",
        website: "https://www.tcpdump.org",
        tags: ["CLI", "PCAP", "Essential", "Lightweight"],
        difficulty: "Intermédiaire"
      }
    ]
  };

  // Fonction de recherche
  const filteredTools = searchQuery
    ? Object.values(tools[activeCategory]).filter(tool =>
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : tools[activeCategory];

  const categoryStats = {
    osint: tools.osint.length,
    analyse: tools.analyse.length,
    defense: tools.defense.length,
    network: tools.network.length
  };

  return (
    <main style={{ padding: "40px", maxWidth: "1600px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: "40px" }}>
        <h1 style={{ color: colors.accent, fontSize: "2.5rem", marginBottom: "10px" }}>
          🔧 Outils Cyber
        </h1>
        <p style={{ color: colors.textSecondary, fontSize: "1.2rem", lineHeight: "1.6" }}>
          Catalogue complet des meilleurs outils de cybersécurité organisés par catégorie
        </p>
      </div>

      {/* Search Bar */}
      <div style={{ marginBottom: "30px" }}>
        <input
          type="text"
          placeholder="🔍 Rechercher un outil, une fonctionnalité ou un tag..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: "100%",
            padding: "15px 20px",
            background: colors.bgPrimary,
            border: "2px solid #00ff9c",
            borderRadius: "12px",
            color: colors.textPrimary,
            fontSize: "1rem"
          }}
        />
      </div>

      {/* Category Tabs */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "15px",
        marginBottom: "40px"
      }}>
        {[
          { key: "osint", label: "🔍 OSINT", count: categoryStats.osint },
          { key: "analyse", label: "🔬 Cyber Analyse", count: categoryStats.analyse },
          { key: "defense", label: "🛡️ Cyber Défense", count: categoryStats.defense },
          { key: "network", label: "💻 Machine & Réseaux", count: categoryStats.network }
        ].map((cat) => (
          <button
            key={cat.key}
            onClick={() => {
              setActiveCategory(cat.key as any);
              setSearchQuery("");
            }}
            style={{
              background: activeCategory === cat.key ? colors.accent : colors.bgPrimary,
              color: activeCategory === cat.key ? colors.bgPrimary : colors.textPrimary,
              border: `2px solid ${activeCategory === cat.key ? colors.accent : colors.bgTertiary}`,
              padding: "20px",
              borderRadius: "12px",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "1.1rem",
              transition: "all 0.3s",
              textAlign: "center"
            }}
          >
            <div>{cat.label}</div>
            <div style={{ fontSize: "0.9rem", marginTop: "8px", opacity: 0.8 }}>
              {cat.count} outils
            </div>
          </button>
        ))}
      </div>

      {/* Tools Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
        gap: "25px"
      }}>
        {filteredTools.map((tool) => (
          <div
            key={tool.id}
            onClick={() => setSelectedTool(tool)}
            style={{
              background: colors.bgPrimary,
              border: tool.premium ? "2px solid #fbbf24" : "1px solid #2a3f3f",
              borderRadius: "12px",
              padding: "25px",
              cursor: "pointer",
              transition: "all 0.3s",
              position: "relative" as const
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.border = tool.premium ? "2px solid #fbbf24" : "1px solid #00ff9c";
              e.currentTarget.style.transform = "translateY(-5px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.border = tool.premium ? "2px solid #fbbf24" : "1px solid #2a3f3f";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            {tool.premium && (
              <div style={{
                position: "absolute" as const,
                top: "15px",
                right: "15px",
                background: "#fbbf24",
                color: colors.bgPrimary,
                padding: "4px 10px",
                borderRadius: "6px",
                fontSize: "0.75rem",
                fontWeight: "bold"
              }}>
                ⭐ PREMIUM
              </div>
            )}

            <div style={{ fontSize: "3rem", marginBottom: "15px" }}>{tool.icon}</div>

            <h3 style={{ color: colors.accent, fontSize: "1.4rem", marginBottom: "8px" }}>
              {tool.name}
            </h3>

            <div style={{ marginBottom: "12px" }}>
              <span style={{
                background: colors.bgSecondary,
                color: colors.textSecondary,
                padding: "4px 10px",
                borderRadius: "6px",
                fontSize: "0.8rem",
                marginRight: "8px"
              }}>
                {tool.type}
              </span>
              <span style={{
                background: tool.difficulty === "Débutant" ? "#22c55e" :
                           tool.difficulty === "Intermédiaire" ? "#fbbf24" : "#ef4444",
                color: colors.bgPrimary,
                padding: "4px 10px",
                borderRadius: "6px",
                fontSize: "0.8rem",
                fontWeight: "bold"
              }}>
                {tool.difficulty}
              </span>
            </div>

            <p style={{ color: colors.textSecondary, lineHeight: "1.7", marginBottom: "15px", minHeight: "60px" }}>
              {tool.description}
            </p>

            <div style={{ display: "flex", flexWrap: "wrap" as const, gap: "6px", marginBottom: "15px" }}>
              {tool.tags.slice(0, 3).map((tag, idx) => (
                <span
                  key={idx}
                  style={{
                    background: colors.bgSecondary,
                    color: colors.accent,
                    padding: "3px 8px",
                    borderRadius: "4px",
                    fontSize: "0.75rem"
                  }}
                >
                  #{tag}
                </span>
              ))}
            </div>

            <div style={{
              paddingTop: "15px",
              borderTop: "1px solid #2a3f3f",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <span style={{ color: colors.textSecondary, fontSize: "0.85rem" }}>
                {tool.pricing.split("(")[0]}
              </span>
              <span style={{ color: colors.accent, fontWeight: "bold", fontSize: "0.9rem" }}>
                En savoir plus →
              </span>
            </div>
          </div>
        ))}
      </div>

      {filteredTools.length === 0 && (
        <div style={{
          textAlign: "center",
          padding: "60px",
          background: colors.bgPrimary,
          border: "1px solid #2a3f3f",
          borderRadius: "12px"
        }}>
          <p style={{ color: colors.textSecondary, fontSize: "1.2rem" }}>
            Aucun outil trouvé pour "{searchQuery}"
          </p>
        </div>
      )}

      {/* Modal détail outil */}
      {selectedTool && (
        <div
          onClick={() => setSelectedTool(null)}
          style={{
            position: "fixed" as const,
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.9)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            overflowY: "auto"
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: colors.bgPrimary,
              border: "2px solid #00ff9c",
              borderRadius: "12px",
              padding: "40px",
              maxWidth: "900px",
              width: "100%",
              maxHeight: "90vh",
              overflowY: "auto"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                <span style={{ fontSize: "4rem" }}>{selectedTool.icon}</span>
                <div>
                  <h2 style={{ color: colors.accent, fontSize: "2rem", marginBottom: "8px" }}>
                    {selectedTool.name}
                  </h2>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <span style={{
                      background: colors.bgSecondary,
                      color: colors.textSecondary,
                      padding: "6px 12px",
                      borderRadius: "6px",
                      fontSize: "0.9rem"
                    }}>
                      {selectedTool.type}
                    </span>
                    <span style={{
                      background: selectedTool.difficulty === "Débutant" ? "#22c55e" :
                                 selectedTool.difficulty === "Intermédiaire" ? "#fbbf24" : "#ef4444",
                      color: colors.bgPrimary,
                      padding: "6px 12px",
                      borderRadius: "6px",
                      fontSize: "0.9rem",
                      fontWeight: "bold"
                    }}>
                      {selectedTool.difficulty}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedTool(null)}
                style={{
                  background: "transparent",
                  color: colors.textSecondary,
                  border: "none",
                  fontSize: "2rem",
                  cursor: "pointer",
                  padding: "0 10px"
                }}
              >
                ×
              </button>
            </div>

            <p style={{ color: colors.textPrimary, fontSize: "1.1rem", lineHeight: "1.8", marginBottom: "25px" }}>
              {selectedTool.longDesc}
            </p>

            {selectedTool.features && (
              <div style={{ marginBottom: "25px" }}>
                <h3 style={{ color: colors.accent, marginBottom: "15px", fontSize: "1.3rem" }}>
                  ⚡ Fonctionnalités principales
                </h3>
                <ul style={{ color: colors.textSecondary, lineHeight: "2", paddingLeft: "20px" }}>
                  {selectedTool.features.map((feature: string, idx: number) => (
                    <li key={idx}>{feature}</li>
                  ))}
                </ul>
              </div>
            )}

            {selectedTool.useCases && (
              <div style={{ marginBottom: "25px" }}>
                <h3 style={{ color: colors.accent, marginBottom: "15px", fontSize: "1.3rem" }}>
                  🎯 Cas d'usage
                </h3>
                <ul style={{ color: colors.textSecondary, lineHeight: "2", paddingLeft: "20px" }}>
                  {selectedTool.useCases.map((useCase: string, idx: number) => (
                    <li key={idx}>{useCase}</li>
                  ))}
                </ul>
              </div>
            )}

            <div style={{
              background: colors.bgSecondary,
              padding: "20px",
              borderRadius: "8px",
              marginBottom: "25px"
            }}>
              <h3 style={{ color: colors.accent, marginBottom: "10px" }}>💰 Tarification</h3>
              <p style={{ color: colors.textPrimary, margin: 0 }}>{selectedTool.pricing}</p>
            </div>

            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" as const, marginBottom: "25px" }}>
              {selectedTool.tags.map((tag: string, idx: number) => (
                <span
                  key={idx}
                  style={{
                    background: colors.bgSecondary,
                    color: colors.accent,
                    padding: "6px 14px",
                    borderRadius: "6px",
                    fontSize: "0.85rem"
                  }}
                >
                  #{tag}
                </span>
              ))}
            </div>

            <a
              href={selectedTool.website}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: colors.accent,
                color: colors.bgPrimary,
                padding: "15px 30px",
                borderRadius: "8px",
                textDecoration: "none",
                fontWeight: "bold",
                fontSize: "1.1rem",
                display: "inline-block",
                transition: "all 0.3s"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
                e.currentTarget.style.boxShadow = "0 0 20px rgba(0, 255, 156, 0.5)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              🌐 Visiter le site officiel
            </a>
          </div>
        </div>
      )}
    </main>
  );
}

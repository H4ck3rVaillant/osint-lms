import { useState, useEffect } from "react";
import { useThemeColors } from "../context/ThemeContext";
import { useGame } from "../context/GameContext";

interface Challenge {
  id: number;
  title: string;
  difficulty: "facile" | "moyen" | "difficile";
  category: string;
  description: string;
  question: string;
  answers: string[];
  hint: string;
  solution: string;
  points: number;
}

// 52 CHALLENGES UNIQUES (1 PAR SEMAINE PENDANT 1 AN)
const CHALLENGES: Challenge[] = [
  // SEMAINE 1
  {
    id: 1,
    title: "La Tour Mystère",
    difficulty: "facile",
    category: "Géolocalisation",
    description: "Coordonnées GPS : 48.8584° N, 2.2945° E",
    question: "Quel monument célèbre se trouve à ces coordonnées ?",
    answers: ["tour eiffel", "eiffel tower", "la tour eiffel"],
    hint: "Monument iconique de Paris construit en 1889",
    solution: "La Tour Eiffel à Paris. Les coordonnées peuvent être vérifiées sur Google Maps.",
    points: 10
  },
  
  // SEMAINE 2
  {
    id: 2,
    title: "Username Hunter",
    difficulty: "facile",
    category: "SOCMINT",
    description: "Vous devez traquer le pseudo 'CyberGhost2024' sur plusieurs plateformes.",
    question: "Quel outil Python recherche un username sur 300+ sites ?",
    answers: ["sherlock", "sherlock project"],
    hint: "Célèbre détective britannique de fiction",
    solution: "Sherlock (github.com/sherlock-project/sherlock) scanne automatiquement des centaines de plateformes.",
    points: 10
  },

  // SEMAINE 3
  {
    id: 3,
    title: "Breach Check",
    difficulty: "facile",
    category: "Data Breach",
    description: "L'email 'contact@example.com' a-t-il été compromis ?",
    question: "Quel site gratuit vérifie si un email apparaît dans des fuites ?",
    answers: ["have i been pwned", "haveibeenpwned", "hibp"],
    hint: "Créé par Troy Hunt, acronyme HIBP",
    solution: "Have I Been Pwned (haveibeenpwned.com) recense plus de 12 milliards de comptes compromis.",
    points: 10
  },

  // SEMAINE 4
  {
    id: 4,
    title: "WHOIS Investigation",
    difficulty: "facile",
    category: "Infrastructure",
    description: "Le domaine 'suspicious-site.com' a été enregistré récemment.",
    question: "Quelle commande Unix interroge les informations d'enregistrement d'un domaine ?",
    answers: ["whois"],
    hint: "5 lettres, commande standard UNIX/Linux",
    solution: "La commande 'whois' interroge les bases de données publiques pour obtenir propriétaire, date de création, registrar.",
    points: 10
  },

  // SEMAINE 5
  {
    id: 5,
    title: "Google Dorking",
    difficulty: "moyen",
    category: "Search Engines",
    description: "Vous cherchez des fichiers PDF contenant le mot 'confidentiel' sur un site gouvernemental.",
    question: "Quel opérateur Google Dork utilisez-vous ? (format: operator:value)",
    answers: ["filetype:pdf", "filetype: pdf"],
    hint: "Opérateur pour filtrer par type de fichier",
    solution: "La requête complète serait : site:gouv.fr filetype:pdf confidentiel",
    points: 25
  },

  // SEMAINE 6
  {
    id: 6,
    title: "EXIF Metadata",
    difficulty: "moyen",
    category: "Métadonnées",
    description: "Une photo contient des métadonnées GPS cachées.",
    question: "Quel outil en ligne extrait les données EXIF d'une image ?",
    answers: ["exiftool", "exif viewer", "exifdata", "jimpl"],
    hint: "Plusieurs outils existent, le plus connu commence par 'EXIF'",
    solution: "ExifTool (exiftool.org) ou des viewers en ligne comme exifdata.com peuvent extraire toutes les métadonnées.",
    points: 25
  },

  // SEMAINE 7
  {
    id: 7,
    title: "IP Geolocation",
    difficulty: "moyen",
    category: "Infrastructure",
    description: "Une adresse IP suspecte : 8.8.8.8",
    question: "À quelle organisation appartient cette IP publique ?",
    answers: ["google", "google llc", "google dns"],
    hint: "Service DNS public très populaire",
    solution: "8.8.8.8 est le DNS public de Google, vérifiable via WHOIS ou des services de géolocalisation IP.",
    points: 25
  },

  // SEMAINE 8
  {
    id: 8,
    title: "Archive Machine",
    difficulty: "moyen",
    category: "Web Archives",
    description: "Un site web malveillant a été supprimé, mais vous devez retrouver son contenu.",
    question: "Quel service archive automatiquement les pages web depuis 1996 ?",
    answers: ["wayback machine", "internet archive", "archive.org"],
    hint: "Archive.org, nom évoque le 'retour en arrière'",
    solution: "La Wayback Machine (web.archive.org) archive plus de 735 milliards de pages web.",
    points: 25
  },

  // SEMAINE 9
  {
    id: 9,
    title: "Reverse Image Search",
    difficulty: "facile",
    category: "Images",
    description: "Vous avez une photo et voulez trouver sa source originale.",
    question: "Quel moteur de recherche russe est réputé pour la recherche d'images inversée ?",
    answers: ["yandex", "yandex images"],
    hint: "Concurrent russe de Google, commence par Y",
    solution: "Yandex Images offre souvent de meilleurs résultats que Google Images pour la recherche inversée.",
    points: 10
  },

  // SEMAINE 10
  {
    id: 10,
    title: "Bitcoin Tracking",
    difficulty: "difficile",
    category: "Crypto",
    description: "Une transaction Bitcoin suspecte doit être tracée.",
    question: "Quel explorateur blockchain permet d'analyser les transactions Bitcoin ?",
    answers: ["blockchain.com", "blockchair", "blockchain explorer"],
    hint: "Le nom contient le mot 'blockchain'",
    solution: "Blockchain.com ou Blockchair.com permettent de tracer les transactions Bitcoin publiquement.",
    points: 50
  },

  // SEMAINE 11
  {
    id: 11,
    title: "Phone Number OSINT",
    difficulty: "moyen",
    category: "Téléphonie",
    description: "Un numéro de téléphone international commence par +33.",
    question: "Quel pays utilise l'indicatif téléphonique +33 ?",
    answers: ["france", "la france"],
    hint: "Pays européen, capitale Paris",
    solution: "+33 est l'indicatif international de la France.",
    points: 25
  },

  // SEMAINE 12
  {
    id: 12,
    title: "LinkedIn Recon",
    difficulty: "moyen",
    category: "SOCMINT",
    description: "Vous devez identifier les employés d'une entreprise 'CyberCorp'.",
    question: "Quel opérateur Google permet de chercher uniquement sur LinkedIn ?",
    answers: ["site:linkedin.com"],
    hint: "Opérateur 'site:' suivi du domaine",
    solution: "Requête Google : site:linkedin.com 'CyberCorp' employee",
    points: 25
  },

  // SEMAINE 13
  {
    id: 13,
    title: "Shodan Hunter",
    difficulty: "difficile",
    category: "IoT",
    description: "Vous cherchez des caméras IP non sécurisées exposées sur Internet.",
    question: "Quel moteur de recherche indexe les devices IoT connectés ?",
    answers: ["shodan", "shodan.io"],
    hint: "Surnommé 'le moteur de recherche pour hackers'",
    solution: "Shodan.io indexe des millions d'appareils IoT, serveurs, caméras exposés sur Internet.",
    points: 50
  },

  // SEMAINE 14
  {
    id: 14,
    title: "Flight Tracking",
    difficulty: "moyen",
    category: "Aviation",
    description: "Un avion privé avec l'immatriculation N12345 est en vol.",
    question: "Quel site web permet de tracker les vols en temps réel ?",
    answers: ["flightradar24", "flightradar", "fr24"],
    hint: "Nom contient 'flight' et 'radar'",
    solution: "FlightRadar24.com suit les vols civils en temps réel via ADS-B.",
    points: 25
  },

  // SEMAINE 15
  {
    id: 15,
    title: "Vessel Tracking",
    difficulty: "moyen",
    category: "Maritime",
    description: "Un cargo 'MAERSK ATLANTIC' doit être localisé en mer.",
    question: "Quel système de tracking maritime utilise les signaux AIS ?",
    answers: ["marinetraffic", "marine traffic", "vesselfinder"],
    hint: "Nom contient 'marine' ou 'vessel'",
    solution: "MarineTraffic.com ou VesselFinder.com utilisent le système AIS (Automatic Identification System).",
    points: 25
  },

  // SEMAINE 16
  {
    id: 16,
    title: "Dark Web Access",
    difficulty: "difficile",
    category: "Dark Web",
    description: "Vous devez accéder à un site .onion sur le Dark Web.",
    question: "Quel navigateur permet d'accéder au réseau TOR ?",
    answers: ["tor browser", "tor"],
    hint: "Navigateur basé sur Firefox, même nom que le réseau",
    solution: "Le Tor Browser route le trafic via plusieurs relais pour accéder aux sites .onion anonymement.",
    points: 50
  },

  // SEMAINE 17
  {
    id: 17,
    title: "Email Header Analysis",
    difficulty: "difficile",
    category: "Email Forensics",
    description: "Un email de phishing doit être analysé pour identifier l'origine.",
    question: "Quel champ dans l'en-tête d'email révèle l'IP de l'expéditeur réel ?",
    answers: ["received", "x-originating-ip"],
    hint: "Champ qui montre le chemin du serveur, commence par R ou X",
    solution: "Les champs 'Received' ou 'X-Originating-IP' dans les headers révèlent l'IP source et le chemin SMTP.",
    points: 50
  },

  // SEMAINE 18
  {
    id: 18,
    title: "GitHub Recon",
    difficulty: "moyen",
    category: "Code Source",
    description: "Un développeur a accidentellement commit un mot de passe dans un repo public.",
    question: "Quel outil scanne les repos GitHub pour trouver des secrets exposés ?",
    answers: ["trufflehog", "gitleaks", "gitrob"],
    hint: "Plusieurs outils existent : TruffleHog, GitLeaks, Gitrob",
    solution: "TruffleHog ou GitLeaks scannent l'historique Git pour détecter clés API, mots de passe, tokens.",
    points: 25
  },

  // SEMAINE 19
  {
    id: 19,
    title: "Subdomain Enumeration",
    difficulty: "difficile",
    category: "Infrastructure",
    description: "Vous devez découvrir tous les sous-domaines de 'target.com'.",
    question: "Quel outil automatise la découverte de sous-domaines via brute-force ?",
    answers: ["sublist3r", "amass", "subfinder"],
    hint: "Plusieurs options : Sublist3r, Amass, Subfinder",
    solution: "Sublist3r, Amass ou Subfinder utilisent plusieurs sources (DNS, certificats SSL, APIs) pour énumérer les sous-domaines.",
    points: 50
  },

  // SEMAINE 20
  {
    id: 20,
    title: "Social Media Archive",
    difficulty: "moyen",
    category: "SOCMINT",
    description: "Un tweet supprimé doit être retrouvé.",
    question: "Quel service archive automatiquement les tweets et posts supprimés ?",
    answers: ["wayback machine", "archive.today", "archive.is"],
    hint: "Services d'archivage web, dont celui de archive.org",
    solution: "Wayback Machine ou Archive.today peuvent avoir sauvegardé le tweet avant suppression.",
    points: 25
  },

  // SEMAINE 21
  {
    id: 21,
    title: "Facial Recognition",
    difficulty: "difficile",
    category: "Biométrie",
    description: "Une photo d'une personne inconnue doit être identifiée.",
    question: "Quel moteur de recherche russe offre la reconnaissance faciale ?",
    answers: ["yandex", "findclone", "pimeyes"],
    hint: "Yandex ou PimEyes",
    solution: "Yandex (pour la Russie) ou PimEyes offrent la recherche par reconnaissance faciale.",
    points: 50
  },

  // SEMAINE 22
  {
    id: 22,
    title: "WiFi Geolocation",
    difficulty: "difficile",
    category: "Géolocalisation",
    description: "Un BSSID WiFi (MAC address) : 00:1A:2B:3C:4D:5E",
    question: "Quel service Google cartographie les points d'accès WiFi mondiaux ?",
    answers: ["wigle", "wigle.net", "google location services"],
    hint: "Base de données communautaire, nom en 5 lettres",
    solution: "WiGLE.net (Wireless Geographic Logging Engine) cartographie des millions de points WiFi géolocalisés.",
    points: 50
  },

  // SEMAINE 23
  {
    id: 23,
    title: "Document Metadata",
    difficulty: "moyen",
    category: "Métadonnées",
    description: "Un document PDF contient des métadonnées révélant l'auteur.",
    question: "Quel outil extrait les métadonnées des documents PDF, DOCX, etc. ?",
    answers: ["exiftool", "foca", "metagoofil"],
    hint: "ExifTool, FOCA ou Metagoofil",
    solution: "ExifTool peut lire les métadonnées de tous types de fichiers (PDF, Office, images).",
    points: 25
  },

  // SEMAINE 24
  {
    id: 24,
    title: "Pastebin Monitoring",
    difficulty: "moyen",
    category: "Data Leaks",
    description: "Des credentials ont été leak sur Pastebin.",
    question: "Quel service surveille automatiquement les pastes pour détecter des fuites ?",
    answers: ["pastebin", "paste hunter", "dumpmon"],
    hint: "Plusieurs outils : PasteHunter, Dumpmon",
    solution: "PasteHunter ou Dumpmon surveillent Pastebin, Ghostbin et autres pour détecter des données sensibles.",
    points: 25
  },

  // SEMAINE 25
  {
    id: 25,
    title: "License Plate Recognition",
    difficulty: "difficile",
    category: "Transport",
    description: "Une plaque d'immatriculation française : AB-123-CD",
    question: "Quel format de plaque est utilisé en France depuis 2009 ?",
    answers: ["siv", "systeme immatriculation vehicules", "aa-123-aa"],
    hint: "Système SIV, format AA-123-AA",
    solution: "Le Système d'Immatriculation des Véhicules (SIV) depuis 2009 : 2 lettres, 3 chiffres, 2 lettres.",
    points: 50
  },

  // SEMAINE 26
  {
    id: 26,
    title: "Chronolocation Shadow",
    difficulty: "difficile",
    category: "Géolocalisation Avancée",
    description: "Une photo montre une ombre de 45° vers le nord-est, prise le 21 juin à midi.",
    question: "Dans quel hémisphère cette photo a-t-elle été prise ?",
    answers: ["nord", "hemisphere nord", "northern hemisphere"],
    hint: "Le 21 juin est le solstice d'été dans l'hémisphère...",
    solution: "Hémisphère Nord. Au solstice d'été (21 juin), le soleil est au zénith dans l'hémisphère Nord.",
    points: 50
  },

  // SEMAINE 27
  {
    id: 27,
    title: "Telegram OSINT",
    difficulty: "moyen",
    category: "SOCMINT",
    description: "Un groupe Telegram suspect doit être surveillé.",
    question: "Peut-on voir les membres d'un groupe Telegram public sans y adhérer ? (oui/non)",
    answers: ["non"],
    hint: "Telegram protège la liste des membres",
    solution: "Non, même pour les groupes publics, la liste des membres n'est visible qu'après avoir rejoint.",
    points: 25
  },

  // SEMAINE 28
  {
    id: 28,
    title: "TikTok Investigation",
    difficulty: "moyen",
    category: "SOCMINT",
    description: "Un compte TikTok @suspect123 poste du contenu illégal.",
    question: "Quel paramètre d'URL TikTok permet de télécharger une vidéo sans watermark ?",
    answers: ["tiktokdownloader", "snaptik", "musicallydown"],
    hint: "Services tiers comme SnapTik, TikTokDownloader",
    solution: "Des services comme SnapTik.app ou TikTokDownloader.com permettent de télécharger sans watermark.",
    points: 25
  },

  // SEMAINE 29
  {
    id: 29,
    title: "Discord Server Recon",
    difficulty: "moyen",
    category: "SOCMINT",
    description: "Un serveur Discord privé doit être investigué.",
    question: "Quel site indexe les serveurs Discord publics ?",
    answers: ["disboard", "discord.me", "top.gg"],
    hint: "Disboard, Discord.me ou Top.gg",
    solution: "Disboard.org, Discord.me ou Top.gg référencent des milliers de serveurs Discord publics.",
    points: 25
  },

  // SEMAINE 30
  {
    id: 30,
    title: "Cryptocurrency Mixer",
    difficulty: "difficile",
    category: "Crypto",
    description: "Des bitcoins ont été blanchis via un service de mixing.",
    question: "Quel service (maintenant fermé) mixait des BTC pour anonymiser les transactions ?",
    answers: ["tornado cash", "tornadocash", "bitcoin fog"],
    hint: "Tornado Cash (Ethereum) ou Bitcoin Fog (fermé par le FBI)",
    solution: "Tornado Cash (Ethereum) ou Bitcoin Fog permettaient de mélanger des cryptos pour brouiller les pistes.",
    points: 50
  },

  // SEMAINE 31
  {
    id: 31,
    title: "Breach Monitoring",
    difficulty: "moyen",
    category: "Data Breach",
    description: "Une entreprise veut surveiller si ses domaines apparaissent dans des leaks.",
    question: "Quel moteur de recherche indexe des databases de breaches ? (2 lettres)",
    answers: ["intelx", "intelligence x", "dehashed"],
    hint: "IntelX ou DeHashed",
    solution: "Intelligence X (intelx.io) ou DeHashed.com indexent des milliards de credentials leakés.",
    points: 25
  },

  // SEMAINE 32
  {
    id: 32,
    title: "Maltego Transform",
    difficulty: "difficile",
    category: "Outils",
    description: "Vous devez mapper les relations entre entités (personnes, domaines, IPs).",
    question: "Quel logiciel de data mining visualise les relations OSINT sous forme de graphes ?",
    answers: ["maltego"],
    hint: "Outil de visualisation graphique très populaire en OSINT",
    solution: "Maltego utilise des 'transforms' pour automatiser la collecte et visualiser les relations entre données.",
    points: 50
  },

  // SEMAINE 33
  {
    id: 33,
    title: "Google Maps Timeline",
    difficulty: "moyen",
    category: "Géolocalisation",
    description: "Une personne a activé la Timeline Google Maps sur son téléphone.",
    question: "Où Google stocke-t-il l'historique de localisation ? (nom du service)",
    answers: ["timeline", "google timeline", "location history"],
    hint: "Nom du service : Timeline (historique de localisation)",
    solution: "Google Timeline (anciennement Location History) enregistre tous les déplacements si activé.",
    points: 25
  },

  // SEMAINE 34
  {
    id: 34,
    title: "Satellite Imagery",
    difficulty: "moyen",
    category: "Géolocalisation",
    description: "Vous devez voir une image satellite haute résolution d'un bâtiment.",
    question: "Quelle plateforme offre des images satellite historiques gratuites ?",
    answers: ["google earth", "google earth pro"],
    hint: "Version desktop de Google Earth",
    solution: "Google Earth Pro (gratuit) permet de voir l'historique des images satellite depuis 1984.",
    points: 25
  },

  // SEMAINE 35
  {
    id: 35,
    title: "Reddit Investigation",
    difficulty: "moyen",
    category: "SOCMINT",
    description: "Un utilisateur Reddit a supprimé ses posts compromettants.",
    question: "Quel service permet de voir les posts/comments Reddit supprimés ?",
    answers: ["reveddit", "unddit", "removeddit"],
    hint: "Reveddit, Unddit ou Removeddit",
    solution: "Reveddit.com ou Unddit.com récupèrent les posts/comments Reddit supprimés via des archives.",
    points: 25
  },

  // SEMAINE 36
  {
    id: 36,
    title: "Instagram Location Leak",
    difficulty: "moyen",
    category: "SOCMINT",
    description: "Une photo Instagram ne montre pas de géotag, mais contient des indices visuels.",
    question: "Quelle technique OSINT utilise les éléments visuels pour géolocaliser ?",
    answers: ["geolocalisation visuelle", "visual geolocation", "landmark recognition"],
    hint: "Identification de landmarks, architecture, panneaux, végétation",
    solution: "La géolocalisation visuelle analyse landmarks, panneaux routiers, architecture, végétation, ombres.",
    points: 25
  },

  // SEMAINE 37
  {
    id: 37,
    title: "DNS History",
    difficulty: "difficile",
    category: "Infrastructure",
    description: "Un domaine malveillant a changé d'IP plusieurs fois.",
    question: "Quel service archive l'historique DNS des domaines ?",
    answers: ["securitytrails", "security trails", "dnshistory"],
    hint: "SecurityTrails ou DNSHistory",
    solution: "SecurityTrails.com garde l'historique des enregistrements DNS (A, MX, NS) sur plusieurs années.",
    points: 50
  },

  // SEMAINE 38
  {
    id: 38,
    title: "Onion Site Search",
    difficulty: "difficile",
    category: "Dark Web",
    description: "Vous cherchez un site .onion spécifique sur le Dark Web.",
    question: "Quel moteur de recherche indexe les sites .onion du réseau Tor ?",
    answers: ["ahmia", "torch", "not evil"],
    hint: "Ahmia, Torch ou NotEvil",
    solution: "Ahmia.fi, Torch ou NotEvil indexent les sites .onion accessibles via Tor Browser.",
    points: 50
  },

  // SEMAINE 39
  {
    id: 39,
    title: "Facebook Graph Search",
    difficulty: "difficile",
    category: "SOCMINT",
    description: "Vous devez trouver tous les posts Facebook mentionnant 'CyberCorp' à Paris.",
    question: "Quelle technique Facebook permet des recherches avancées via l'URL ?",
    answers: ["graph search", "facebook graph search", "url parameters"],
    hint: "Manipulation des paramètres d'URL Facebook",
    solution: "Facebook Graph Search (via URL parameters) permet des requêtes avancées malgré la suppression de l'interface.",
    points: 50
  },

  // SEMAINE 40
  {
    id: 40,
    title: "Warrant Canary",
    difficulty: "difficile",
    category: "Privacy",
    description: "Un service VPN ne publie plus son 'Warrant Canary' mensuel.",
    question: "Que signifie l'absence de Warrant Canary ?",
    answers: ["subpoena", "assignation justice", "demande gouvernementale"],
    hint: "Signal indirect qu'une demande légale a été reçue",
    solution: "L'absence de Warrant Canary signale indirectement qu'une assignation ou demande gouvernementale a été reçue.",
    points: 50
  },

  // SEMAINE 41
  {
    id: 41,
    title: "QR Code Analysis",
    difficulty: "moyen",
    category: "Sécurité",
    description: "Un QR code suspect redirige vers un site de phishing.",
    question: "Quel outil en ligne décode un QR code sans le scanner ?",
    answers: ["zxing", "qr code decoder", "online qr decoder"],
    hint: "ZXing Decoder ou services en ligne",
    solution: "ZXing.org ou des décodeurs en ligne permettent d'analyser un QR code sans risque de redirection.",
    points: 25
  },

  // SEMAINE 42
  {
    id: 42,
    title: "SSL Certificate",
    difficulty: "moyen",
    category: "Infrastructure",
    description: "Un certificat SSL révèle d'autres domaines du même propriétaire.",
    question: "Quel service liste tous les domaines partageant un certificat SSL ?",
    answers: ["crt.sh", "censys", "certificate transparency"],
    hint: "crt.sh ou Censys.io",
    solution: "crt.sh interroge les logs Certificate Transparency pour trouver tous les domaines d'un même certificat.",
    points: 25
  },

  // SEMAINE 43
  {
    id: 43,
    title: "Twitch Stream Analysis",
    difficulty: "moyen",
    category: "SOCMINT",
    description: "Un streamer Twitch leak accidentellement son adresse via son stream.",
    question: "Quelle info visible dans un stream peut révéler la localisation ?",
    answers: ["reflet", "fenetre", "fond ecran", "adresse ip", "geolocalisation"],
    hint: "Reflets dans les vitres, fond d'écran, colis, factures",
    solution: "Reflets de fenêtres, fond d'écran (paysage local), colis/factures, ou leaks d'IP peuvent révéler la localisation.",
    points: 25
  },

  // SEMAINE 44
  {
    id: 44,
    title: "Fake Account Detection",
    difficulty: "difficile",
    category: "SOCMINT",
    description: "Un profil social utilise une photo volée.",
    question: "Quelle technique permet de vérifier si une photo de profil est volée ?",
    answers: ["reverse image search", "recherche image inversee", "tineye"],
    hint: "Recherche d'image inversée via Google, Yandex, TinEye",
    solution: "La recherche d'image inversée (Google Images, Yandex, TinEye) trouve les utilisations antérieures d'une photo.",
    points: 50
  },

  // SEMAINE 45
  {
    id: 45,
    title: "Metadata Removal",
    difficulty: "moyen",
    category: "Métadonnées",
    description: "Avant de publier une photo, vous voulez supprimer toutes les métadonnées.",
    question: "Quel outil supprime les métadonnées EXIF d'une image ?",
    answers: ["exiftool", "mat2", "metadata anonymization toolkit"],
    hint: "ExifTool ou MAT2 (Metadata Anonymization Toolkit)",
    solution: "ExifTool (avec flag -all=) ou MAT2 suppriment toutes les métadonnées des fichiers.",
    points: 25
  },

  // SEMAINE 46
  {
    id: 46,
    title: "Sock Puppet Account",
    difficulty: "difficile",
    category: "SOCMINT",
    description: "Vous créez un compte fictif pour une investigation encou verte.",
    question: "Comment appelle-t-on un faux compte utilisé pour l'OSINT ?",
    answers: ["sock puppet", "sockpuppet", "persona"],
    hint: "Terme anglais : 'marionnette chaussette'",
    solution: "Un 'Sock Puppet' est un faux compte/persona crédible utilisé pour mener des investigations discrètes.",
    points: 50
  },

  // SEMAINE 47
  {
    id: 47,
    title: "Company Intelligence",
    difficulty: "moyen",
    category: "Corporate OSINT",
    description: "Vous devez trouver les noms des dirigeants d'une entreprise française.",
    question: "Quel registre public français liste les informations des sociétés ?",
    answers: ["infogreffe", "kbis", "societe.com"],
    hint: "Infogreffe, Societe.com ou extrait Kbis",
    solution: "Infogreffe.fr donne accès aux Kbis des sociétés françaises (dirigeants, capital, activité).",
    points: 25
  },

  // SEMAINE 48
  {
    id: 48,
    title: "Job Posting Analysis",
    difficulty: "moyen",
    category: "Corporate OSINT",
    description: "Une entreprise poste une offre pour un 'Pentester AWS Expert'.",
    question: "Que révèle cette offre d'emploi sur l'infrastructure de l'entreprise ?",
    answers: ["aws", "amazon web services", "cloud aws"],
    hint: "L'offre révèle que l'entreprise utilise...",
    solution: "L'offre révèle que l'entreprise utilise Amazon Web Services (AWS) comme infrastructure cloud.",
    points: 25
  },

  // SEMAINE 49
  {
    id: 49,
    title: "Dumpster Diving Digital",
    difficulty: "difficile",
    category: "Data Leaks",
    description: "Des documents confidentiels ont été jetés dans une poubelle numérique.",
    question: "Quel terme OSINT désigne la recherche dans les données abandonnées ?",
    answers: ["dumpster diving", "trashing", "poubelle plongee"],
    hint: "Terme anglais : 'plongée dans les poubelles'",
    solution: "Le 'Dumpster Diving' (physique ou digital) consiste à fouiller les données/documents abandonnés.",
    points: 50
  },

  // SEMAINE 50
  {
    id: 50,
    title: "VPN Detection",
    difficulty: "difficile",
    category: "Infrastructure",
    description: "Un utilisateur suspect se connecte via un VPN pour masquer son IP.",
    question: "Quel service détecte si une IP appartient à un VPN/Proxy ?",
    answers: ["ipqualityscore", "iphub", "ip2proxy"],
    hint: "IPQualityScore, IPHub ou IP2Proxy",
    solution: "IPQualityScore.com, IPHub.info ou IP2Proxy détectent les VPN/Proxy/Tor via leurs bases de données d'IPs.",
    points: 50
  },

  // SEMAINE 51
  {
    id: 51,
    title: "IoT Camera Hack",
    difficulty: "difficile",
    category: "IoT",
    description: "Des caméras IP Hikvision sont exposées avec les credentials par défaut.",
    question: "Quels sont les credentials par défaut les plus courants sur IoT ? (format: user/pass)",
    answers: ["admin/admin", "admin/12345", "admin/password"],
    hint: "Combinaison admin/admin ou admin/12345",
    solution: "Les credentials par défaut les plus courants : admin/admin, admin/12345, admin/password, root/root.",
    points: 50
  },

  // SEMAINE 52
  {
    id: 52,
    title: "OSINT Framework Final",
    difficulty: "difficile",
    category: "Méthodologie",
    description: "Vous terminez votre année de challenges OSINT !",
    question: "Quel site web liste des centaines d'outils OSINT classés par catégorie ?",
    answers: ["osint framework", "osintframework.com"],
    hint: "Site web référence : OSINT Framework",
    solution: "OSINTFramework.com est LA ressource ultime listant des centaines d'outils OSINT par catégorie. Félicitations pour cette année ! 🎉",
    points: 50
  },
];

export default function ChallengesPage() {
  const colors = useThemeColors();
  const { unlockBadge, addXP } = useGame();
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState<{ type: "success" | "error" | ""; message: string }>({ type: "", message: "" });
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  
  // Calculer le challenge actuel basé sur la semaine
  const getWeekNumber = () => {
    const startDate = new Date("2026-02-23"); // Date de début (lundi)
    const now = new Date();
    const diff = now.getTime() - startDate.getTime();
    const weeksPassed = Math.floor(diff / (7 * 24 * 60 * 60 * 1000));
    
    // S'assurer que le numéro est toujours valide (0-51)
    if (weeksPassed < 0) return 0; // Avant le début
    return weeksPassed % CHALLENGES.length;
  };

  const [currentWeek, setCurrentWeek] = useState(getWeekNumber());
  const currentChallenge = CHALLENGES[currentWeek];

  // Sécurité : si currentChallenge est undefined, utiliser le premier
  if (!currentChallenge) {
    console.error("Challenge undefined, using first challenge");
    return <div style={{ minHeight: "100vh", background: colors.bgPrimary, paddingTop: "80px" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "40px 20px", textAlign: "center" }}>
        <h1 style={{ color: colors.textPrimary }}>Erreur de chargement</h1>
        <p style={{ color: colors.textSecondary }}>Le challenge n'a pas pu être chargé. Réessayez.</p>
      </div>
    </div>;
  }

  // Compte à rebours jusqu'au prochain lundi
  const getTimeUntilNextMonday = () => {
    const now = new Date();
    const nextMonday = new Date(now);
    nextMonday.setDate(now.getDate() + ((1 + 7 - now.getDay()) % 7 || 7));
    nextMonday.setHours(0, 0, 0, 0);
    
    const diff = nextMonday.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    return { days, hours };
  };

  const [timeLeft, setTimeLeft] = useState(getTimeUntilNextMonday());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeUntilNextMonday());
      setCurrentWeek(getWeekNumber());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  // Gestion localStorage
  const getSolvedChallenges = (): number[] => {
    const solved = localStorage.getItem("challenges_solved");
    return solved ? JSON.parse(solved) : [];
  };

  const [solvedChallenges, setSolvedChallenges] = useState(getSolvedChallenges());
  const isSolved = solvedChallenges.includes(currentChallenge.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSolved) {
      setFeedback({ type: "error", message: "Vous avez déjà résolu ce challenge !" });
      return;
    }

    const normalized = userAnswer.toLowerCase().trim();
    const isCorrect = currentChallenge.answers.some(answer => 
      normalized === answer.toLowerCase() || normalized.includes(answer.toLowerCase())
    );

    if (isCorrect) {
      const newSolved = [...solvedChallenges, currentChallenge.id];
      localStorage.setItem("challenges_solved", JSON.stringify(newSolved));
      setSolvedChallenges(newSolved);
      
      addXP(currentChallenge.points, `Challenge ${currentChallenge.title}`);
      setFeedback({ 
        type: "success", 
        message: `🎉 Correct ! +${currentChallenge.points} XP` 
      });
      setShowSolution(true);

      // Badge si 10 challenges résolus
      if (newSolved.length === 10) {
        unlockBadge("challenge_master", "Challenge Master - 10 challenges résolus");
      }
    } else {
      setFeedback({ 
        type: "error", 
        message: "❌ Réponse incorrecte. Essayez encore !" 
      });
    }
  };

  const difficultyColors = {
    facile: "#10b981",
    moyen: "#f59e0b",
    difficile: "#ef4444"
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: colors.bgPrimary,
      paddingTop: "80px",
    }}>
      <div style={{
        maxWidth: "900px",
        margin: "0 auto",
        padding: "40px 20px",
      }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div style={{ fontSize: "4rem", marginBottom: "15px" }}>🔥</div>
          <h1 style={{
            fontSize: "2.5rem",
            fontWeight: "700",
            color: colors.textPrimary,
            marginBottom: "15px",
          }}>
            Challenge Hebdomadaire
          </h1>
          <p style={{
            fontSize: "1.1rem",
            color: colors.textSecondary,
          }}>
            Semaine {currentWeek + 1}/52 • Nouveau challenge dans {timeLeft.days}j {timeLeft.hours}h
          </p>
        </div>

        {/* Challenge Card */}
        <div style={{
          background: colors.bgSecondary,
          border: `2px solid ${difficultyColors[currentChallenge.difficulty]}`,
          borderRadius: "16px",
          padding: "40px",
          marginBottom: "30px",
          boxShadow: `0 8px 30px ${colors.shadow}`,
        }}>
          {/* Badge difficulté */}
          <div style={{
            display: "inline-block",
            padding: "8px 16px",
            background: difficultyColors[currentChallenge.difficulty],
            color: "#fff",
            borderRadius: "20px",
            fontSize: "0.9rem",
            fontWeight: "600",
            marginBottom: "20px",
          }}>
            {currentChallenge.difficulty.toUpperCase()} • {currentChallenge.points} pts
          </div>

          <h2 style={{
            fontSize: "2rem",
            fontWeight: "700",
            color: colors.textPrimary,
            marginBottom: "10px",
          }}>
            {currentChallenge.title}
          </h2>

          <p style={{
            fontSize: "0.95rem",
            color: colors.accent,
            marginBottom: "20px",
            fontWeight: "500",
          }}>
            📂 {currentChallenge.category}
          </p>

          <p style={{
            fontSize: "1.1rem",
            color: colors.textSecondary,
            lineHeight: "1.7",
            marginBottom: "25px",
          }}>
            {currentChallenge.description}
          </p>

          <div style={{
            background: `${colors.accent}10`,
            border: `1px solid ${colors.accent}30`,
            borderRadius: "12px",
            padding: "20px",
            marginBottom: "25px",
          }}>
            <p style={{
              fontSize: "1.2rem",
              fontWeight: "600",
              color: colors.textPrimary,
              marginBottom: "0",
            }}>
              ❓ {currentChallenge.question}
            </p>
          </div>

          {/* Formulaire de réponse */}
          {!isSolved ? (
            <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
              <input
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Votre réponse..."
                style={{
                  width: "100%",
                  padding: "15px",
                  background: colors.bgPrimary,
                  border: `2px solid ${colors.border}`,
                  borderRadius: "10px",
                  color: colors.textPrimary,
                  fontSize: "1rem",
                  marginBottom: "15px",
                }}
              />
              <button
                type="submit"
                style={{
                  width: "100%",
                  padding: "15px",
                  background: colors.accent,
                  color: "#fff",
                  border: "none",
                  borderRadius: "10px",
                  fontSize: "1.1rem",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                Valider ma réponse
              </button>
            </form>
          ) : (
            <div style={{
              padding: "20px",
              background: "#10b98120",
              border: "2px solid #10b981",
              borderRadius: "12px",
              textAlign: "center",
              marginBottom: "20px",
            }}>
              <p style={{
                fontSize: "1.2rem",
                fontWeight: "600",
                color: "#10b981",
                margin: 0,
              }}>
                ✅ Challenge résolu ! +{currentChallenge.points} XP
              </p>
            </div>
          )}

          {/* Feedback */}
          {feedback.message && (
            <div style={{
              padding: "15px",
              background: feedback.type === "success" ? "#10b98120" : "#ef444420",
              border: `2px solid ${feedback.type === "success" ? "#10b981" : "#ef4444"}`,
              borderRadius: "10px",
              marginBottom: "20px",
            }}>
              <p style={{
                color: feedback.type === "success" ? "#10b981" : "#ef4444",
                fontWeight: "600",
                margin: 0,
              }}>
                {feedback.message}
              </p>
            </div>
          )}

          {/* Hint */}
          <button
            onClick={() => setShowHint(!showHint)}
            style={{
              padding: "12px 20px",
              background: "transparent",
              border: `2px solid ${colors.accent}`,
              borderRadius: "8px",
              color: colors.accent,
              fontWeight: "600",
              cursor: "pointer",
              marginRight: "10px",
            }}
          >
            💡 {showHint ? "Masquer" : "Afficher"} l'indice
          </button>

          {showHint && (
            <div style={{
              marginTop: "15px",
              padding: "15px",
              background: `${colors.accent}10`,
              borderRadius: "8px",
            }}>
              <p style={{ color: colors.textSecondary, margin: 0 }}>
                💡 {currentChallenge.hint}
              </p>
            </div>
          )}

          {/* Solution (visible après résolution) */}
          {(isSolved || showSolution) && (
            <div style={{
              marginTop: "20px",
              padding: "20px",
              background: `${colors.accent}10`,
              border: `1px solid ${colors.accent}30`,
              borderRadius: "12px",
            }}>
              <h3 style={{
                fontSize: "1.2rem",
                fontWeight: "600",
                color: colors.accent,
                marginBottom: "10px",
              }}>
                📖 Solution
              </h3>
              <p style={{
                color: colors.textSecondary,
                lineHeight: "1.6",
                margin: 0,
              }}>
                {currentChallenge.solution}
              </p>
            </div>
          )}
        </div>

        {/* Stats */}
        <div style={{
          background: colors.bgSecondary,
          border: `1px solid ${colors.border}`,
          borderRadius: "12px",
          padding: "25px",
          textAlign: "center",
        }}>
          <h3 style={{
            fontSize: "1.3rem",
            fontWeight: "600",
            color: colors.textPrimary,
            marginBottom: "15px",
          }}>
            📊 Vos Statistiques
          </h3>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            gap: "20px",
          }}>
            <div>
              <p style={{ fontSize: "2rem", fontWeight: "700", color: colors.accent, margin: 0 }}>
                {solvedChallenges.length}
              </p>
              <p style={{ color: colors.textSecondary, fontSize: "0.9rem", margin: 0 }}>
                Challenges résolus
              </p>
            </div>
            <div>
              <p style={{ fontSize: "2rem", fontWeight: "700", color: colors.accent, margin: 0 }}>
                {Math.round((solvedChallenges.length / 52) * 100)}%
              </p>
              <p style={{ color: colors.textSecondary, fontSize: "0.9rem", margin: 0 }}>
                Complétion annuelle
              </p>
            </div>
            <div>
              <p style={{ fontSize: "2rem", fontWeight: "700", color: colors.accent, margin: 0 }}>
                {solvedChallenges.length * 25}
              </p>
              <p style={{ color: colors.textSecondary, fontSize: "0.9rem", margin: 0 }}>
                XP gagnés (environ)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

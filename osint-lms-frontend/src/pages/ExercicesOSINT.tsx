import { useState, useEffect } from "react";

type Exercise = {
  id: number;
  title: string;
  category: string;
  description: string;
  question: string;
  solution: string;
  difficulty: string;
  tips: string[];
};

const exercises: Exercise[] = [
  // ==================== DÃBUTANT (1-5) ====================
  {
    id: 1,
    title: "Recherche d'exposition numÃ©rique",
    category: "Reconnaissance",
    description: "Identifier les informations publiques accessibles sur une entreprise via ses canaux officiels et les profils de ses employÃ©s.",
    question: "Quels types d'informations peut-on lÃ©galement collecter via un site corporate et LinkedIn pour Ã©valuer la surface d'attaque d'une organisation ?",
    solution: "On peut identifier : les noms et fonctions des employÃ©s (notamment IT/sÃ©curitÃ©), les technologies utilisÃ©es (mentionnÃ©es dans les offres d'emploi), les partenaires technologiques, la structure organisationnelle, les localisations gÃ©ographiques, les projets en cours, et les adresses emails au format standard. Ces informations permettent de cartographier l'infrastructure et les points d'entrÃ©e potentiels.",
    difficulty: "DÃ©butant",
    tips: [
      "Consultez la page 'CarriÃ¨res' pour identifier les technologies recherchÃ©es",
      "Analysez les profils LinkedIn des employÃ©s IT pour repÃ©rer les outils utilisÃ©s",
      "VÃ©rifiez les communiquÃ©s de presse pour les partenariats technologiques"
    ]
  },
  {
    id: 2,
    title: "Google Dorks basiques",
    category: "Outils de recherche",
    description: "Utiliser les opÃ©rateurs de recherche Google pour affiner vos rÃ©sultats et dÃ©couvrir des informations ciblÃ©es.",
    question: "Quels opÃ©rateurs Google Dorks permettent de rechercher un type de fichier spÃ©cifique sur un domaine particulier, et donnez un exemple pratique ?",
    solution: "Les opÃ©rateurs clÃ©s sont : 'filetype:' pour le type de fichier et 'site:' pour le domaine. Exemple complet : 'filetype:pdf site:gouv.fr budget 2024' trouve tous les PDF contenant 'budget 2024' sur les sites gouvernementaux franÃ§ais. Autres opÃ©rateurs utiles : 'intitle:' (dans le titre), 'inurl:' (dans l'URL), 'intext:' (dans le texte), et les guillemets \"\" pour une recherche exacte.",
    difficulty: "DÃ©butant",
    tips: [
      "Combinez plusieurs opÃ©rateurs pour des recherches trÃ¨s prÃ©cises",
      "Les guillemets forcent Google Ã  chercher l'expression exacte",
      "Utilisez le tiret '-' pour exclure des termes (ex: -site:exemple.fr)"
    ]
  },
  {
    id: 3,
    title: "WHOIS et informations de domaine",
    category: "Infrastructure",
    description: "Extraire des informations sur les propriÃ©taires de domaines et leur infrastructure DNS.",
    question: "Quelles informations principales peut-on obtenir via une requÃªte WHOIS d'un nom de domaine, et quelles limitations existent depuis le RGPD ?",
    solution: "Un WHOIS rÃ©vÃ¨le : le registrant (propriÃ©taire), les dates de crÃ©ation/expiration/mise Ã  jour du domaine, les serveurs DNS (nameservers), le registrar (bureau d'enregistrement), et parfois des contacts (email, tÃ©lÃ©phone, adresse). Depuis le RGPD (2018), beaucoup de donnÃ©es personnelles sont masquÃ©es par des services de confidentialitÃ© (Privacy Protection). Les informations d'entreprises restent souvent visibles. Les nameservers peuvent rÃ©vÃ©ler l'hÃ©bergeur DNS.",
    difficulty: "DÃ©butant",
    tips: [
      "Les dates de crÃ©ation rÃ©vÃ¨lent l'anciennetÃ© et la lÃ©gitimitÃ© d'un site",
      "Les services de confidentialitÃ© masquent les donnÃ©es mais peuvent Ãªtre contournÃ©s via d'autres sources",
      "Utilisez whois.domaintools.com ou who.is pour des interfaces conviviales"
    ]
  },
  {
    id: 4,
    title: "Recherche d'images inversÃ©e",
    category: "VÃ©rification",
    description: "VÃ©rifier l'authenticitÃ© et tracer l'origine d'une image en utilisant la recherche inversÃ©e.",
    question: "Quels sont les trois principaux moteurs de recherche d'images inversÃ©e et dans quels cas utiliser chacun d'eux ?",
    solution: "1) Google Images : le plus utilisÃ©, bon pour les images populaires et les lieux. 2) TinEye : excellent pour l'historique (montre les apparitions chronologiques), idÃ©al pour dÃ©tecter les manipulations. 3) Yandex Images : supÃ©rieur pour la reconnaissance de visages et d'objets, trÃ¨s efficace pour les photos de profil. Cas d'usage : vÃ©rifier si une photo de profil est volÃ©e, tracer l'origine d'une image virale, trouver des versions haute rÃ©solution, dÃ©tecter des fake news visuelles.",
    difficulty: "DÃ©butant",
    tips: [
      "Utilisez les trois moteurs pour maximiser vos rÃ©sultats",
      "Yandex est souvent plus efficace que Google pour les visages",
      "TinEye garde un historique plus long que les autres"
    ]
  },
  {
    id: 5,
    title: "MÃ©tadonnÃ©es EXIF d'images",
    category: "Forensics",
    description: "Comprendre et extraire les mÃ©tadonnÃ©es des fichiers images pour obtenir des informations contextuelles.",
    question: "Quelles informations critiques peuvent Ãªtre extraites des mÃ©tadonnÃ©es EXIF d'une photo et comment les consulter ?",
    solution: "Les mÃ©tadonnÃ©es EXIF contiennent : date et heure de prise, modÃ¨le d'appareil photo/smartphone, paramÃ¨tres (ISO, ouverture, vitesse), parfois coordonnÃ©es GPS (si activÃ©es), logiciel d'Ã©dition utilisÃ©, orientation. Outils d'extraction : ExifTool (ligne de commande, le plus complet), Jeffrey's Image Metadata Viewer (en ligne), ou propriÃ©tÃ©s du fichier (Windows/Mac). ATTENTION : les rÃ©seaux sociaux suppriment gÃ©nÃ©ralement les EXIF lors de l'upload. Les coordonnÃ©es GPS peuvent rÃ©vÃ©ler le lieu exact de prise de vue.",
    difficulty: "DÃ©butant",
    tips: [
      "ExifTool est l'outil de rÃ©fÃ©rence : 'exiftool image.jpg'",
      "Les mÃ©tadonnÃ©es peuvent Ãªtre facilement supprimÃ©es ou falsifiÃ©es",
      "CorrÃ©llez toujours avec d'autres Ã©lÃ©ments visuels de la photo"
    ]
  },

  // ==================== INTERMÃDIAIRE (6-10) ====================
  {
    id: 6,
    title: "Analyse de profil social avancÃ©e",
    category: "RÃ©seaux Sociaux",
    description: "DÃ©tecter les faux comptes, bots et comportements automatisÃ©s sur les rÃ©seaux sociaux.",
    question: "Quels indicateurs techniques et comportementaux permettent de distinguer un compte authentique d'un bot ou d'un faux profil ?",
    solution: "Indicateurs techniques : date de crÃ©ation rÃ©cente, photo de profil gÃ©nÃ©rÃ©e par IA ou stock photo (vÃ©rifiable par recherche inversÃ©e), peu ou pas de photos personnelles, ratio followers/following anormal (trÃ¨s Ã©levÃ© ou 1:1 suspect). Indicateurs comportementaux : publications Ã  intervalles rÃ©guliers parfaits (automatisation), peu d'interactions authentiques, contenus rÃ©pÃ©titifs ou copiÃ©s-collÃ©s, langue incohÃ©rente avec la localisation prÃ©tendue, activitÃ© 24/7 impossible pour un humain, soutien unilatÃ©ral d'un narratif spÃ©cifique. Analysez sur plusieurs mois pour dÃ©tecter les patterns.",
    difficulty: "IntermÃ©diaire",
    tips: [
      "VÃ©rifiez la photo de profil via TinEye ou Google Images",
      "Analysez l'historique complet : les bots ont souvent des pÃ©riodes d'inactivitÃ© puis d'hyperactivitÃ©",
      "Les interactions (rÃ©ponses aux commentaires) sont plus rÃ©vÃ©latrices que les posts"
    ]
  },
  {
    id: 7,
    title: "GÃ©olocalisation par analyse d'ombres",
    category: "GÃ©olocalisation",
    description: "Utiliser les ombres dans une photo pour dÃ©terminer l'orientation gÃ©ographique et l'heure approximative.",
    question: "Comment utiliser les ombres visibles dans une photo pour calculer l'orientation cardinale et estimer l'heure de prise de vue ?",
    solution: "L'ombre pointe vers le nord (hÃ©misphÃ¨re nord) Ã  midi solaire. MÃ©thodologie : 1) Mesurer la longueur et l'angle de l'ombre par rapport Ã  des objets verticaux, 2) Utiliser SunCalc.org pour visualiser la position du soleil Ã  diffÃ©rentes heures pour un lieu donnÃ©, 3) Comparer avec la photo pour trouver la correspondance. La longueur de l'ombre varie : courte Ã  midi, longue le matin/soir. PrÃ©cision : Â±30-60 minutes pour l'heure, Â±100km pour la localisation. NÃ©cessite de connaÃ®tre la date approximative.",
    difficulty: "IntermÃ©diaire",
    tips: [
      "Plusieurs ombres de longueurs diffÃ©rentes augmentent la prÃ©cision",
      "Combinez avec d'autres Ã©lÃ©ments (vÃ©gÃ©tation, architecture) pour affiner",
      "ShadowCalculator.eu offre des outils de calcul spÃ©cialisÃ©s"
    ]
  },
  {
    id: 8,
    title: "Maltego pour cartographie de relations",
    category: "Outils avancÃ©s",
    description: "Utiliser Maltego pour visualiser et analyser les connexions entre diffÃ©rentes entitÃ©s.",
    question: "Comment utiliser Maltego pour crÃ©er un graphe de relations Ã  partir d'un domaine web et quelles informations peut-on dÃ©couvrir ?",
    solution: "Workflow Maltego : 1) CrÃ©er un nouveau graphe, 2) Ajouter une entitÃ© 'Domain' avec le domaine cible, 3) ExÃ©cuter des transforms : DNS lookups (trouve IPs, nameservers), WHOIS (trouve registrant), Email addresses (trouve contacts), 4) Pivoter sur les nouvelles entitÃ©s dÃ©couvertes (ex: chercher d'autres domaines avec le mÃªme registrant), 5) Analyser le graphe visuel. Maltego rÃ©vÃ¨le : sous-domaines, adresses email, serveurs associÃ©s, domaines liÃ©s, structure rÃ©seau. La version CE (Community Edition) est gratuite mais limitÃ©e.",
    difficulty: "IntermÃ©diaire",
    tips: [
      "Commencez par une seule entitÃ© pour ne pas surcharger le graphe",
      "Les transforms peuvent prendre plusieurs minutes sur de gros ensembles",
      "Exportez votre graphe rÃ©guliÃ¨rement (File > Export Graph)"
    ]
  },
  {
    id: 9,
    title: "Certificate Transparency Logs",
    category: "Infrastructure",
    description: "Utiliser les logs de certificats SSL/TLS pour dÃ©couvrir des sous-domaines et l'infrastructure web.",
    question: "Comment utiliser crt.sh et les Certificate Transparency logs pour dÃ©couvrir tous les sous-domaines d'un domaine cible ?",
    solution: "Les Certificate Transparency logs enregistrent publiquement tous les certificats SSL Ã©mis. Sur crt.sh : 1) Rechercher '%.example.com' (le % agit comme wildcard), 2) Le site retourne tous les certificats contenant ce pattern, rÃ©vÃ©lant les sous-domaines, 3) Analyser les rÃ©sultats : dates d'Ã©mission, autoritÃ©s de certification, certificats actifs vs expirÃ©s. RÃ©vÃ¨le : sous-domaines cachÃ©s (dev, staging, admin), environnements internes exposÃ©s, services oubliÃ©s. Alternative : censys.io, Entrust CT Search. C'est une technique de reconnaissance 100% passive (non dÃ©tectable).",
    difficulty: "IntermÃ©diaire",
    tips: [
      "Les certificats expirÃ©s rÃ©vÃ¨lent aussi des sous-domaines historiques",
      "Recherchez les certificats wildcard (*.example.com) qui couvrent tous les sous-domaines",
      "Combinez avec d'autres techniques (DNS bruteforce) pour une couverture complÃ¨te"
    ]
  },
  {
    id: 10,
    title: "CorrÃ©lation multi-sources",
    category: "Analyse",
    description: "Croiser plusieurs sources d'information pour valider et enrichir vos dÃ©couvertes.",
    question: "Quelle mÃ©thodologie appliquer pour corrÃ©ler efficacement des informations provenant de sources diverses (rÃ©seaux sociaux, WHOIS, archives) ?",
    solution: "MÃ©thodologie de corrÃ©lation : 1) Identifier les points communs : noms, dates, lieux, identifiants uniques, 2) VÃ©rifier la cohÃ©rence temporelle (les dates concordent-elles ?), 3) Chercher des sources indÃ©pendantes (Ã©viter l'echo chamber oÃ¹ les sources se citent mutuellement), 4) Ãvaluer la crÃ©dibilitÃ© de chaque source avec le modÃ¨le Admiralty, 5) Appliquer la triangulation (minimum 3 sources), 6) Noter les contradictions pour investigation supplÃ©mentaire, 7) Documenter le niveau de confiance final. La corrÃ©lation renforce la confiance mais ne garantit pas la vÃ©ritÃ© absolue (mÃ©fiance du biais de confirmation).",
    difficulty: "IntermÃ©diaire",
    tips: [
      "Une information rÃ©pÃ©tÃ©e par 10 sources qui se citent = 1 seule source",
      "Cherchez activement des informations qui contredisent votre hypothÃ¨se",
      "Utilisez des tableurs pour tracker les correspondances entre sources"
    ]
  },

  // ==================== AVANCÃ (11-15) ====================
  {
    id: 11,
    title: "Analysis of Competing Hypotheses (ACH)",
    category: "MÃ©thodologie",
    description: "Technique analytique structurÃ©e pour Ã©valuer plusieurs hypothÃ¨ses concurrentes et Ã©viter les biais cognitifs.",
    question: "Comment appliquer la mÃ©thode ACH pour analyser un incident de sÃ©curitÃ© avec plusieurs explications possibles ?",
    solution: "MÃ©thodologie ACH : 1) Lister toutes les hypothÃ¨ses plausibles (ex: attaque APT, insider threat, erreur de configuration, coÃ¯ncidence), mÃªme les improbables, 2) Identifier toutes les preuves/informations collectÃ©es, 3) CrÃ©er une matrice : hypothÃ¨ses en colonnes, preuves en lignes, 4) Pour chaque cellule, Ã©valuer si la preuve est CohÃ©rente (C), IncohÃ©rente (I) ou Neutre (N) avec l'hypothÃ¨se, 5) L'hypothÃ¨se avec le moins d'incohÃ©rences est la plus probable, 6) Documenter le raisonnement et le niveau de confiance. ACH combat le biais de confirmation en forÃ§ant Ã  considÃ©rer toutes les alternatives systÃ©matiquement.",
    difficulty: "AvancÃ©",
    tips: [
      "Listez au moins 4-5 hypothÃ¨ses pour Ã©viter le biais binaire (vrai/faux)",
      "Les preuves qui rÃ©futent sont plus informatives que celles qui confirment",
      "Mettez Ã  jour la matrice quand de nouvelles informations arrivent"
    ]
  },
  {
    id: 12,
    title: "Python pour automatisation OSINT",
    category: "Automatisation",
    description: "Scripter en Python pour automatiser la collecte et l'analyse de donnÃ©es OSINT Ã  grande Ã©chelle.",
    question: "CrÃ©ez un workflow Python pour automatiser la collecte d'informations sur une liste de domaines (WHOIS, DNS, sous-domaines). Quelles bibliothÃ¨ques utiliser ?",
    solution: "BibliothÃ¨ques essentielles : requests (requÃªtes HTTP), python-whois (donnÃ©es WHOIS), dnspython (requÃªtes DNS), pandas (manipulation donnÃ©es), json (parsing), time (dÃ©lais). Workflow exemple : 1) Lire une liste de domaines depuis un fichier CSV, 2) Pour chaque domaine : faire un WHOIS (python-whois), rÃ©soudre DNS A/MX (dnspython), requÃªter crt.sh pour sous-domaines (requests), 3) AggrÃ©ger tous les rÃ©sultats dans un DataFrame pandas, 4) Exporter en CSV/Excel. Ajoutez des dÃ©lais (time.sleep(2)) entre requÃªtes pour Ã©viter le blocage. GÃ©rez les exceptions (try/except) pour la robustesse.",
    difficulty: "AvancÃ©",
    tips: [
      "Utilisez des environnements virtuels (venv) pour isoler vos dÃ©pendances",
      "Loggez toutes les opÃ©rations (module logging) pour dÃ©bugger",
      "Stockez les clÃ©s API dans des variables d'environnement, jamais en dur"
    ]
  },
  {
    id: 13,
    title: "Threat Intelligence via OSINT",
    category: "CybersÃ©curitÃ©",
    description: "Collecter et analyser du renseignement sur les menaces cyber en utilisant des sources ouvertes.",
    question: "Comment construire un profil de menace (threat profile) d'un groupe APT en utilisant uniquement des sources OSINT ?",
    solution: "MÃ©thodologie de profiling APT : 1) Collecter les IOCs (Indicators of Compromise) : IPs, domaines, hashes de malware depuis des rapports publics (Mandiant, CrowdStrike, rapports gouvernementaux), 2) Pivoter sur ces IOCs : WHOIS historique, passive DNS (SecurityTrails), VirusTotal relations, 3) Identifier les TTPs (Tactics, Techniques, Procedures) via MITRE ATT&CK, 4) Analyser l'infrastructure : patterns de rÃ©utilisation, fournisseurs prÃ©fÃ©rÃ©s, 5) Chercher sur forums underground et pastebin, 6) CorrÃ©ler avec le contexte gÃ©opolitique (qui ciblent-ils ? pourquoi ?), 7) Documenter dans un format structurÃ© (STIX/TAXII). Le profil produit des IOCs actionnables pour la dÃ©tection.",
    difficulty: "AvancÃ©",
    tips: [
      "Les rapports de sociÃ©tÃ©s de sÃ©curitÃ© sont des mines d'or d'IOCs",
      "Cherchez les patterns de rÃ©utilisation (mÃªme registrant, mÃªme ASN)",
      "Utilisez AlienVault OTX et ThreatCrowd pour enrichir les IOCs"
    ]
  },
  {
    id: 14,
    title: "Analyse de mÃ©tadonnÃ©es Office avancÃ©e",
    category: "Forensics",
    description: "Extraire des informations sensibles des documents Microsoft Office (Word, Excel, PowerPoint).",
    question: "Quelles mÃ©tadonnÃ©es sensibles se cachent dans les documents Office et comment peuvent-elles rÃ©vÃ©ler l'organisation interne d'une entreprise ?",
    solution: "MÃ©tadonnÃ©es Office critiques : nom de l'auteur (souvent le nom d'utilisateur Windows complet), organisation (nom de l'entreprise), liste des personnes ayant modifiÃ© le document, temps d'Ã©dition total, chemin complet du fichier original (ex: C:\\Users\\jdupont\\Documents\\Confidentiel\\rapport.docx), version exacte du logiciel, dates de crÃ©ation/modification, commentaires cachÃ©s, tracked changes non acceptÃ©s, notes de prÃ©sentateur (PowerPoint). Extraction : exiftool -a document.docx (le plus complet), strings document.docx | grep (Linux), ou olevba pour les macros VBA. Ces donnÃ©es rÃ©vÃ¨lent : structure de rÃ©pertoires internes, conventions de nommage, employÃ©s clÃ©s, logiciels utilisÃ©s (potentiellement obsolÃ¨tes = vulnÃ©rabilitÃ©s).",
    difficulty: "AvancÃ©",
    tips: [
      "Les documents gouvernementaux publiÃ©s sont souvent trÃ¨s riches en mÃ©tadonnÃ©es",
      "Comparez les mÃ©tadonnÃ©es de plusieurs documents d'une mÃªme organisation",
      "Les macros VBA peuvent contenir du code malveillant (analysez avec olevba)"
    ]
  },
  {
    id: 15,
    title: "OSINT sur infrastructures critiques",
    category: "GÃ©opolitique",
    description: "Ãvaluer la surface d'attaque d'infrastructures critiques (Ã©nergie, eau, transport) via OSINT sans scan actif.",
    question: "Comment cartographier l'exposition d'une infrastructure critique (ex: rÃ©seau Ã©lectrique) en utilisant uniquement des sources passives ?",
    solution: "MÃ©thodologie passive : 1) Identifier les systÃ¨mes SCADA/ICS exposÃ©s via Shodan (recherche : 'SCADA country:FR', 'Modbus', 'ICS'), 2) Rechercher la documentation technique fuites (appels d'offres publics, manuels d'utilisation), 3) Cartographier le rÃ©seau via BGP/ASN lookup (identifier les plages IP de l'organisation), 4) Analyser la chaÃ®ne d'approvisionnement (quels fournisseurs ? leurs propres vulnÃ©rabilitÃ©s ?), 5) Rechercher les employÃ©s sur LinkedIn (qui travaille sur ces systÃ¨mes ? quelles compÃ©tences ?), 6) Chercher les vulnÃ©rabilitÃ©s connues (CVE databases) pour les technologies identifiÃ©es, 7) Produire un rapport d'exposition sans jamais scanner activement. CRITIQUE : alertez les autoritÃ©s compÃ©tentes si vous dÃ©couvrez des vulnÃ©rabilitÃ©s graves.",
    difficulty: "AvancÃ©",
    tips: [
      "Les infrastructures critiques sont des cibles ultra-sensibles (lÃ©galitÃ© ++)",
      "Ne scannez JAMAIS activement, utilisez UNIQUEMENT des donnÃ©es dÃ©jÃ  indexÃ©es",
      "Coordonnez avec des CERT/CSIRT nationaux pour un disclosure responsable"
    ]
  },

  // ==================== EXPERT (16-20) ====================
  {
    id: 16,
    title: "Attribution d'acteurs APT",
    category: "Threat Intelligence",
    description: "MÃ©thodologie rigoureuse pour attribuer une cyberattaque Ã  un groupe APT spÃ©cifique avec un niveau de confiance documentÃ©.",
    question: "Quels Ã©lÃ©ments OSINT permettent d'attribuer une cyberattaque Ã  un groupe APT et quel niveau de confiance peut-on atteindre ?",
    solution: "ÃlÃ©ments d'attribution multi-niveaux : 1) Infrastructure (IPs, domaines, certificats SSL, patterns de rÃ©utilisation), 2) TTPs (Tactics, Techniques, Procedures selon MITRE ATT&CK - sont-ils signature du groupe ?), 3) Malware (similitudes de code via VirusTotal, hashes connus, strings uniques), 4) Timestamps (fuseaux horaires d'activitÃ©, jours ouvrables vs weekend), 5) Langue (erreurs grammaticales dans le code, keyboards layouts), 6) Motivations (qui bÃ©nÃ©ficierait ? alignement avec intÃ©rÃªts gÃ©opolitiques), 7) CapacitÃ©s techniques (sophistication du toolkit). MÃ©thodologie : comparer systÃ©matiquement avec la base de connaissance APT (MITRE ATT&CK Groups, Mandiant APT reports), chercher des overlaps, scorer la confiance (Low/Medium/High). ATTENTION : les acteurs sophistiquÃ©s font du false flag (attribution trompeuse intentionnelle). L'attribution certaine Ã  100% est quasi-impossible en OSINT seul.",
    difficulty: "Expert",
    tips: [
      "Cherchez des 'unique artifacts' : Ã©lÃ©ments qui n'apparaissent que chez ce groupe",
      "Les false flags sont dÃ©tectables par des incohÃ©rences (niveau de sophistication, erreurs)",
      "CorrÃ©llez avec le contexte gÃ©opolitique : cui bono ? (Ã  qui profite le crime)"
    ]
  },
  {
    id: 17,
    title: "OSINT et cycle de renseignement",
    category: "MÃ©thodologie",
    description: "IntÃ©grer l'OSINT dans un cycle de renseignement structurÃ© (Intelligence Cycle) de niveau professionnel.",
    question: "Comment intÃ©grer l'OSINT dans les 5 phases du cycle de renseignement et comment interagit-il avec les autres disciplines (HUMINT, SIGINT) ?",
    solution: "Les 5 phases du cycle : 1) Direction (Planning) : dÃ©finir les RFIs (Requirements for Information) - 'Que veut-on savoir ?', 2) Collection : utiliser l'OSINT pour collecter (70% du travail ici), combiner avec HUMINT/SIGINT si disponibles, 3) Processing : normaliser les donnÃ©es OSINT (formats, enrichissement via APIs), 4) Analysis & Production : appliquer ACH, modÃ¨le Admiralty, crÃ©er des rapports, 5) Dissemination : diffuser aux stakeholders avec le bon niveau de classification, 6) Feedback : Ã©valuer l'utilitÃ©, gÃ©nÃ©rer de nouveaux RFIs. L'OSINT s'intÃ¨gre Ã  toutes les Ã©tapes : validation de HUMINT (fact-checking), contextualisation de SIGINT (qui parle Ã  qui ?), enrichissement mutuel. Frameworks avancÃ©s : F3EAD (Find, Fix, Finish, Exploit, Analyze, Disseminate) utilisÃ© en opÃ©rations militaires.",
    difficulty: "Expert",
    tips: [
      "Les RFIs doivent Ãªtre SMART : Specific, Measurable, Achievable, Relevant, Time-bound",
      "L'OSINT seul est rarement suffisant pour des dÃ©cisions stratÃ©giques critiques",
      "Documentez la provenance de chaque information (chain of custody)"
    ]
  },
  {
    id: 18,
    title: "DÃ©tection de campagnes de dÃ©sinformation",
    category: "Influence",
    description: "Identifier et analyser des opÃ©rations de dÃ©sinformation coordonnÃ©es Ã  grande Ã©chelle.",
    question: "Quels indicateurs permettent de dÃ©tecter une campagne de dÃ©sinformation coordonnÃ©e par un acteur Ã©tatique et comment la documenter ?",
    solution: "Indicateurs de coordination : 1) Volume anormal de posts similaires sur courte pÃ©riode (amplification artificielle), 2) Comptes crÃ©Ã©s simultanÃ©ment ou rÃ©cemment, 3) Patterns de publication identiques (mÃªmes heures, rythme robotique), 4) RÃ©utilisation exacte de contenus (copy-paste, mÃªme images), 5) RÃ©seau de comptes qui se suivent et s'amplifient mutuellement, 6) Narratifs alignÃ©s avec intÃ©rÃªts gÃ©opolitiques spÃ©cifiques. MÃ©thodologie de documentation : 1) Identifier les 'seed accounts' (premiers Ã  poster, amplifiÃ©s ensuite), 2) Cartographier le rÃ©seau (qui RT/like qui ?), 3) Analyser la timeline (moments de pic d'activitÃ©), 4) Techniques : network analysis (Gephi), bot detection (Botometer), propagation tracking (Hoaxy), 5) CorrÃ©ler avec Ã©vÃ©nements gÃ©opolitiques. Cas d'Ã©tudes : opÃ©rations russes (Internet Research Agency), chinoises (50 Cent Army), iraniennes. Documentation rigoureuse essentielle (preuve lÃ©gale potentielle).",
    difficulty: "Expert",
    tips: [
      "Les campagnes sophistiquÃ©es utilisent des comptes 'vieillis' (achetÃ©s, dormants longtemps)",
      "Cherchez les incohÃ©rences : langues mÃ©langÃ©es, fuseaux horaires suspects",
      "Utilisez TweetDeck ou outils similaires pour monitorer en temps rÃ©el"
    ]
  },
  {
    id: 19,
    title: "OSINT sur supply chain",
    category: "Risques",
    description: "Analyser les risques cybersÃ©curitÃ© de toute la chaÃ®ne d'approvisionnement d'une organisation cible.",
    question: "Comment Ã©valuer les risques cyber d'une supply chain complexe via OSINT et identifier les maillons faibles ?",
    solution: "MÃ©thodologie supply chain OSINT : 1) Cartographie complÃ¨te : identifier tous les fournisseurs (sites web, rapports annuels, LinkedIn des employÃ©s, appels d'offres publics), 2) Pour chaque fournisseur, Ã©valuer leur cybersÃ©curitÃ© : a) Shodan (systÃ¨mes exposÃ©s), b) Recherche de breaches historiques (HaveIBeenPwned, mÃ©dias), c) Certificats SSL (Ã¢ge, autoritÃ©), d) Job postings (recrutent-ils un CISO ? = immaturitÃ©), e) Certifications (ISO 27001, SOC2), 3) Cartographier les dÃ©pendances (qui dÃ©pend de qui ? graphe de relations), 4) Identifier les SPOFs (Single Points of Failure), 5) Ãvaluer les fournisseurs de niveau 2 et 3 (supply chain profonde), 6) Scorer le risque (1-5) par fournisseur, 7) Produire une heatmap des risques. Les supply chain attacks (ex: SolarWinds 2020) sont critiques car ils permettent d'atteindre des centaines de cibles via un seul point d'entrÃ©e.",
    difficulty: "Expert",
    tips: [
      "Les petits fournisseurs (PME) sont souvent le maillon faible (moins de ressources cyber)",
      "Cherchez les dÃ©pendances cachÃ©es (sous-traitants des sous-traitants)",
      "Utilisez le framework NIST Cybersecurity Supply Chain Risk Management"
    ]
  },
  {
    id: 20,
    title: "Rapport OSINT de niveau stratÃ©gique",
    category: "Reporting",
    description: "Structurer et rÃ©diger un rapport OSINT professionnel pour des dÃ©cideurs de haut niveau (C-suite, gouvernement).",
    question: "Quelle structure et quels principes appliquer pour produire un rapport OSINT actionnable pour la direction exÃ©cutive ou des dÃ©cideurs gouvernementaux ?",
    solution: "Structure professionnelle : 1) Executive Summary (1 page max) : synthÃ¨se pour dÃ©cideurs non-techniques, conclusion principale, recommandations clÃ©s, niveau de confiance global, 2) MÃ©thodologie (1-2 pages) : sources consultÃ©es (citÃ©es prÃ©cisÃ©ment), outils utilisÃ©s, pÃ©riode de collecte, limitations et biais potentiels, 3) Findings (corps principal) : dÃ©couvertes organisÃ©es par thÃ¨me ou chronologiquement, chaque finding avec cotation Admiralty (ex: B2), visualisations (graphes, timelines, cartes), 4) Analysis (interprÃ©tation) : qu'est-ce que cela signifie ?, hypothÃ¨ses avec niveaux de confiance (ACH), implications stratÃ©giques, 5) Recommendations (actionnables) : actions suggÃ©rÃ©es priorisÃ©es (court/moyen/long terme), risques et bÃ©nÃ©fices, 6) Annexes : screenshots horodatÃ©s (preuves), donnÃ©es brutes, glossaire si termes techniques. Principes : clartÃ© (pas de jargon inutile), traÃ§abilitÃ© complÃ¨te (toutes sources citÃ©es), horodatage systÃ©matique, versioning du document, watermark 'CONFIDENTIAL' si nÃ©cessaire. Format : PDF professionnel, sommaire cliquable, page de garde avec date/auteur/classification.",
    difficulty: "Expert",
    tips: [
      "L'executive summary doit pouvoir Ãªtre lu en 2 minutes et contenir l'essentiel",
      "Distinguez clairement les faits (prouvÃ©s) des hypothÃ¨ses (probable/possible)",
      "Incluez des visualisations : les dÃ©cideurs retiennent mieux l'information visuelle"
    ]
  }
];

export default function ExercicesOSINT() {
  const [current, setCurrent] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const [showTips, setShowTips] = useState(false);
  const [showResetPopup, setShowResetPopup] = useState(false);
  const [filterDifficulty, setFilterDifficulty] = useState<string>("Tous");
  const [completedExercises, setCompletedExercises] = useState<Set<number>>(new Set());

  // Charger les exercices complÃ©tÃ©s au montage du composant
  useEffect(() => {
    const saved = localStorage.getItem("completed_exercises");
    if (saved) {
      try {
        setCompletedExercises(new Set(JSON.parse(saved)));
      } catch (e) {
        console.error("Erreur chargement exercices", e);
      }
    }
  }, []);

  // Marquer un exercice comme complÃ©tÃ©
  const markAsCompleted = (exerciseId: number) => {
    const newCompleted = new Set(completedExercises);
    newCompleted.add(exerciseId);
    setCompletedExercises(newCompleted);
    
    // Sauvegarder
    localStorage.setItem("completed_exercises", JSON.stringify(Array.from(newCompleted)));
    localStorage.setItem("exercices_completed", newCompleted.size.toString());
    
    // Mettre Ã  jour les badges
    const arr = Array.from(newCompleted);
    const deb = arr.filter(id => id >= 1 && id <= 5).length;
    const int = arr.filter(id => id >= 6 && id <= 10).length;
    const adv = arr.filter(id => id >= 11 && id <= 15).length;
    const exp = arr.filter(id => id >= 16 && id <= 20).length;
    
    if (deb === 5) localStorage.setItem("badge_exo_debutant", "true");
    if (int === 5) localStorage.setItem("badge_exo_intermediaire", "true");
    if (adv === 5) localStorage.setItem("badge_exo_avance", "true");
    if (exp === 5) localStorage.setItem("badge_exo_expert", "true");
    if (newCompleted.size === 20) localStorage.setItem("badge_exo_master", "true");
  };

  const filteredExercises = filterDifficulty === "Tous" 
    ? exercises 
    : exercises.filter(ex => ex.difficulty === filterDifficulty);

  const exercise = filteredExercises[current];
  const progressPercentage = ((current + 1) / filteredExercises.length) * 100;

  const difficultyColor = (difficulty: string) => {
    switch(difficulty) {
      case "DÃ©butant": return "#22c55e";
      case "IntermÃ©diaire": return "#fbbf24";
      case "AvancÃ©": return "#f97316";
      case "Expert": return "#ef4444";
      default: return "#00ff9c";
    }
  };

  const difficultyStats = {
    "DÃ©butant": exercises.filter(e => e.difficulty === "DÃ©butant").length,
    "IntermÃ©diaire": exercises.filter(e => e.difficulty === "IntermÃ©diaire").length,
    "AvancÃ©": exercises.filter(e => e.difficulty === "AvancÃ©").length,
    "Expert": exercises.filter(e => e.difficulty === "Expert").length
  };

  return (
    <main style={{ padding: "40px", maxWidth: "1000px", margin: "0 auto" }}>
      <h1 style={{ color: "#00ff9c", fontSize: "2rem", marginBottom: "10px" }}>
        Exercices OSINT Pratiques
      </h1>
      <p style={{ color: "#9ca3af", marginBottom: "30px", fontSize: "1.1rem" }}>
        20 exercices progressifs couvrant tous les niveaux de compÃ©tence OSINT
      </p>

      {/* Filtres par difficultÃ© */}
      <div style={{
        background: "#0b0f1a",
        border: "1px solid #00ff9c",
        borderRadius: "8px",
        padding: "20px",
        marginBottom: "20px"
      }}>
        <h3 style={{ color: "#00ff9c", marginBottom: "15px", fontSize: "1.1rem" }}>
          Filtrer par niveau
        </h3>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" as const }}>
          {["Tous", "DÃ©butant", "IntermÃ©diaire", "AvancÃ©", "Expert"].map(level => (
            <button
              key={level}
              onClick={() => {
                setFilterDifficulty(level);
                setCurrent(0);
                setShowSolution(false);
                setShowTips(false);
              }}
              style={{
                background: filterDifficulty === level ? "#00ff9c" : "#1a1f2e",
                color: filterDifficulty === level ? "#0b0f1a" : "#00ff9c",
                border: `1px solid ${filterDifficulty === level ? "#00ff9c" : "#2a3f3f"}`,
                padding: "8px 16px",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: "0.9rem",
                transition: "all 0.3s ease"
              }}
            >
              {level}
              {level !== "Tous" && ` (${difficultyStats[level as keyof typeof difficultyStats]})`}
            </button>
          ))}
        </div>
      </div>

      {/* Barre de progression */}
      <div style={{ 
        background: "#0b0f1a", 
        border: "1px solid #00ff9c", 
        borderRadius: "8px", 
        padding: "24px",
        marginBottom: "30px"
      }}>
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          marginBottom: "12px"
        }}>
          <h3 style={{ color: "#00ff9c", margin: 0, fontSize: "1.1rem" }}>
            Progression
          </h3>
          <span style={{ 
            color: "#00ff9c", 
            fontWeight: "bold",
            fontSize: "1.1rem"
          }}>
            Exercice {current + 1}/{filteredExercises.length}
          </span>
        </div>
        
        <div style={{
          width: "100%",
          height: "24px",
          background: "#1a1f2e",
          borderRadius: "12px",
          overflow: "hidden",
          border: "1px solid #2a3f3f"
        }}>
          <div style={{
            width: `${progressPercentage}%`,
            height: "100%",
            background: "linear-gradient(90deg, #00ff9c 0%, #00d484 100%)",
            transition: "width 0.5s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#0b0f1a",
            fontWeight: "bold",
            fontSize: "0.875rem"
          }}>
            {Math.round(progressPercentage)}%
          </div>
        </div>
      </div>

      {/* Carte de l'exercice */}
      <section style={{
        background: "#0b0f1a",
        border: "1px solid #00ff9c",
        borderRadius: "12px",
        padding: "30px",
        marginBottom: "24px"
      }}>
        <div style={{ marginBottom: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "15px", flexWrap: "wrap" as const }}>
            <h2 style={{ color: "#00ff9c", margin: 0, fontSize: "1.5rem" }}>
              {exercise.title}
            </h2>
            <span style={{
              background: "#1a1f2e",
              color: difficultyColor(exercise.difficulty),
              padding: "4px 12px",
              borderRadius: "6px",
              fontSize: "0.85rem",
              fontWeight: "bold",
              border: `1px solid ${difficultyColor(exercise.difficulty)}30`
            }}>
              {exercise.difficulty}
            </span>
            <span style={{
              background: "#1a1f2e",
              color: "#00ff9c",
              padding: "4px 12px",
              borderRadius: "6px",
              fontSize: "0.85rem",
              fontWeight: "bold",
              border: "1px solid #00ff9c30"
            }}>
              {exercise.category}
            </span>
          </div>

          <p style={{ color: "#9ca3af", lineHeight: "1.7", marginBottom: "20px" }}>
            {exercise.description}
          </p>
        </div>

        {/* Question */}
        <div style={{
          background: "#1a1f2e",
          padding: "20px",
          borderLeft: "4px solid #00ff9c",
          borderRadius: "6px",
          marginBottom: "20px"
        }}>
          <h3 style={{ color: "#00ff9c", marginBottom: "10px", fontSize: "1.1rem" }}>
            â Question
          </h3>
          <p style={{ color: "#e5e7eb", lineHeight: "1.7", margin: 0 }}>
            {exercise.question}
          </p>
        </div>

        {/* Conseils */}
        {showTips && (
          <div style={{
            background: "#1a1f2e",
            padding: "20px",
            borderLeft: "4px solid #fbbf24",
            borderRadius: "6px",
            marginBottom: "20px"
          }}>
            <h3 style={{ color: "#fbbf24", marginBottom: "10px", fontSize: "1.1rem" }}>
              ð¡ Conseils
            </h3>
            <ul style={{ color: "#9ca3af", lineHeight: "1.8", paddingLeft: "20px", margin: 0 }}>
              {exercise.tips.map((tip, index) => (
                <li key={index}>{tip}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Solution */}
        {showSolution && (
          <div style={{
            background: "#1a1f2e",
            padding: "20px",
            borderLeft: "4px solid #22c55e",
            borderRadius: "6px",
            marginBottom: "20px"
          }}>
            <h3 style={{ color: "#22c55e", marginBottom: "10px", fontSize: "1.1rem" }}>
              â Solution dÃ©taillÃ©e
            </h3>
            <p style={{ color: "#e5e7eb", lineHeight: "1.8", margin: 0 }}>
              {exercise.solution}
            </p>
          </div>
        )}

        {/* Boutons d'action */}
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" as const }}>
          <button
            style={{
              background: showTips ? "#1a1f2e" : "#fbbf24",
              color: showTips ? "#fbbf24" : "#0b0f1a",
              border: showTips ? "1px solid #fbbf24" : "none",
              padding: "12px 24px",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "0.95rem",
              transition: "all 0.3s ease"
            }}
            onClick={() => setShowTips(!showTips)}
          >
            {showTips ? "Masquer les conseils" : "ð¡ Afficher des conseils"}
          </button>

          <button
            style={{
              background: showSolution ? "#1a1f2e" : "#00ff9c",
              color: showSolution ? "#00ff9c" : "#0b0f1a",
              border: showSolution ? "1px solid #00ff9c" : "none",
              padding: "12px 24px",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "0.95rem",
              transition: "all 0.3s ease"
            }}
            onClick={() => {
              if (!showSolution) markAsCompleted(exercise.id);
              setShowSolution(!showSolution);
            }}
          >
            {showSolution ? "Masquer la solution" : completedExercises.has(exercise.id) ? "â Revoir la solution" : "â Afficher la solution"}
          </button>
        </div>
      </section>

      {/* Navigation */}
      <div style={{ display: "flex", gap: "12px", justifyContent: "space-between", flexWrap: "wrap" as const }}>
        <button
          style={{
            background: current === 0 ? "#1a1f2e" : "#0b0f1a",
            color: "#00ff9c",
            border: "1px solid #00ff9c",
            padding: "12px 24px",
            borderRadius: "8px",
            cursor: current === 0 ? "not-allowed" : "pointer",
            fontWeight: "bold",
            fontSize: "0.95rem",
            opacity: current === 0 ? 0.4 : 1,
          }}
          disabled={current === 0}
          onClick={() => {
            setShowSolution(false);
            setShowTips(false);
            setCurrent(current - 1);
          }}
        >
          â Exercice prÃ©cÃ©dent
        </button>

        <button
          style={{
            background: current === filteredExercises.length - 1 ? "#1a1f2e" : "#00ff9c",
            color: current === filteredExercises.length - 1 ? "#00ff9c" : "#0b0f1a",
            border: current === filteredExercises.length - 1 ? "1px solid #00ff9c" : "none",
            padding: "12px 24px",
            borderRadius: "8px",
            cursor: current === filteredExercises.length - 1 ? "not-allowed" : "pointer",
            fontWeight: "bold",
            fontSize: "0.95rem",
            opacity: current === filteredExercises.length - 1 ? 0.4 : 1,
          }}
          disabled={current === filteredExercises.length - 1}
          onClick={() => {
            setShowSolution(false);
            setShowTips(false);
            setCurrent(current + 1);
          }}
        >
          Exercice suivant â
        </button>
      </div>

      {/* Liste des exercices */}
      <section style={{
        background: "#0b0f1a",
        border: "1px solid #2a3f3f",
        borderRadius: "12px",
        padding: "24px",
        marginTop: "30px"
      }}>
        <h2 style={{ color: "#00ff9c", marginBottom: "20px", fontSize: "1.3rem" }}>
          ð Liste des exercices {filterDifficulty !== "Tous" && `(${filterDifficulty})`}
        </h2>
        <div style={{ display: "grid", gap: "10px" }}>
          {filteredExercises.map((ex, index) => (
            <div
              key={ex.id}
              onClick={() => {
                setCurrent(index);
                setShowSolution(false);
                setShowTips(false);
              }}
              style={{
                background: index === current ? "#1a1f2e" : "transparent",
                border: `1px solid ${index === current ? "#00ff9c" : "#2a3f3f"}`,
                borderRadius: "8px",
                padding: "12px 16px",
                cursor: "pointer",
                transition: "all 0.3s ease",
                display: "flex",
                alignItems: "center",
                gap: "12px"
              }}
            >
              <span style={{ 
                color: completedExercises.has(ex.id) ? "#00ff9c" : index === current ? "#00ff9c" : "#6b7280",
                fontSize: "1.2rem"
              }}>
                {completedExercises.has(ex.id) ? "â" : index === current ? "â¶" : "â"}
              </span>
              <div style={{ flex: 1 }}>
                <p style={{ 
                  color: completedExercises.has(ex.id) ? "#00ff9c" : index === current ? "#00ff9c" : "#9ca3af",
                  fontWeight: index === current ? "bold" : "normal",
                  margin: 0
                }}>
                  {ex.title}
                </p>
                <p style={{ 
                  color: "#6b7280",
                  fontSize: "0.85rem",
                  margin: "4px 0 0 0"
                }}>
                  {ex.category} â¢ {ex.difficulty}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bouton de rÃ©initialisation */}
      <div style={{ marginTop: "30px", textAlign: "center" }}>
        <button
          onClick={() => setShowResetPopup(true)}
          style={{
            background: "#0b0f1a",
            color: "#00ff9c",
            border: "1px solid #00ff9c",
            padding: "14px 32px",
            borderRadius: "8px",
            fontSize: "1rem",
            fontWeight: "bold",
            cursor: "pointer",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#00ff9c";
            e.currentTarget.style.color = "#0b0f1a";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#0b0f1a";
            e.currentTarget.style.color = "#00ff9c";
          }}
        >
          ð Recommencer depuis le dÃ©but
        </button>
      </div>

      {/* Pop-up de confirmation */}
      {showResetPopup && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0, 0, 0, 0.85)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
        }}>
          <div style={{
            background: "#0b0f1a",
            border: "2px solid #00ff9c",
            borderRadius: "12px",
            padding: "40px",
            maxWidth: "500px",
            textAlign: "center",
            boxShadow: "0 0 50px rgba(0, 255, 156, 0.3)",
          }}>
            <h3 style={{ color: "#00ff9c", marginBottom: "15px", fontSize: "1.5rem" }}>
              Recommencer les exercices ?
            </h3>
            <p style={{ color: "#9ca3af", marginBottom: "30px", lineHeight: "1.6" }}>
              Vous allez revenir au premier exercice et rÃ©initialiser les filtres. 
              Vous pourrez toujours revenir Ã  n'importe quel exercice via la liste.
            </p>

            <div style={{ display: "flex", gap: "20px", justifyContent: "center" }}>
              <button
                onClick={() => {
                  setCurrent(0);
                  setFilterDifficulty("Tous");
                  setShowSolution(false);
                  setShowTips(false);
                  setShowResetPopup(false);
                  setCompletedExercises(new Set());
                  localStorage.removeItem("completed_exercises");
                  localStorage.setItem("exercices_completed", "0");
                  localStorage.removeItem("badge_exo_debutant");
                  localStorage.removeItem("badge_exo_intermediaire");
                  localStorage.removeItem("badge_exo_avance");
                  localStorage.removeItem("badge_exo_expert");
                  localStorage.removeItem("badge_exo_master");
                  localStorage.removeItem("cyberosint_game_state");
                  localStorage.removeItem("cyberosint_challenges");
                }}
                style={{
                  padding: "12px 28px",
                  background: "#00ff9c",
                  color: "#0b0f1a",
                  borderRadius: "8px",
                  cursor: "pointer",
                  border: "none",
                  fontWeight: "bold",
                  fontSize: "1rem",
                }}
              >
                â Confirmer
              </button>
              <button
                onClick={() => setShowResetPopup(false)}
                style={{
                  padding: "12px 28px",
                  background: "transparent",
                  color: "#00ff9c",
                  border: "1px solid #00ff9c",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  fontSize: "1rem",
                }}
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

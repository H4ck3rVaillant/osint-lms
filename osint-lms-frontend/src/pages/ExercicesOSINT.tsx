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
  // ==================== DÉBUTANT (1-5) ====================
  {
    id: 1,
    title: "Recherche d'exposition numérique",
    category: "Reconnaissance",
    description: "Identifier les informations publiques accessibles sur une entreprise via ses canaux officiels et les profils de ses employés.",
    question: "Quels types d'informations peut-on légalement collecter via un site corporate et LinkedIn pour évaluer la surface d'attaque d'une organisation ?",
    solution: "On peut identifier : les noms et fonctions des employés (notamment IT/sécurité), les technologies utilisées (mentionnées dans les offres d'emploi), les partenaires technologiques, la structure organisationnelle, les localisations géographiques, les projets en cours, et les adresses emails au format standard. Ces informations permettent de cartographier l'infrastructure et les points d'entrée potentiels.",
    difficulty: "Débutant",
    tips: [
      "Consultez la page 'Carrières' pour identifier les technologies recherchées",
      "Analysez les profils LinkedIn des employés IT pour repérer les outils utilisés",
      "Vérifiez les communiqués de presse pour les partenariats technologiques"
    ]
  },
  {
    id: 2,
    title: "Google Dorks basiques",
    category: "Outils de recherche",
    description: "Utiliser les opérateurs de recherche Google pour affiner vos résultats et découvrir des informations ciblées.",
    question: "Quels opérateurs Google Dorks permettent de rechercher un type de fichier spécifique sur un domaine particulier, et donnez un exemple pratique ?",
    solution: "Les opérateurs clés sont : 'filetype:' pour le type de fichier et 'site:' pour le domaine. Exemple complet : 'filetype:pdf site:gouv.fr budget 2024' trouve tous les PDF contenant 'budget 2024' sur les sites gouvernementaux français. Autres opérateurs utiles : 'intitle:' (dans le titre), 'inurl:' (dans l'URL), 'intext:' (dans le texte), et les guillemets \"\" pour une recherche exacte.",
    difficulty: "Débutant",
    tips: [
      "Combinez plusieurs opérateurs pour des recherches très précises",
      "Les guillemets forcent Google à chercher l'expression exacte",
      "Utilisez le tiret '-' pour exclure des termes (ex: -site:exemple.fr)"
    ]
  },
  {
    id: 3,
    title: "WHOIS et informations de domaine",
    category: "Infrastructure",
    description: "Extraire des informations sur les propriétaires de domaines et leur infrastructure DNS.",
    question: "Quelles informations principales peut-on obtenir via une requête WHOIS d'un nom de domaine, et quelles limitations existent depuis le RGPD ?",
    solution: "Un WHOIS révèle : le registrant (propriétaire), les dates de création/expiration/mise à jour du domaine, les serveurs DNS (nameservers), le registrar (bureau d'enregistrement), et parfois des contacts (email, téléphone, adresse). Depuis le RGPD (2018), beaucoup de données personnelles sont masquées par des services de confidentialité (Privacy Protection). Les informations d'entreprises restent souvent visibles. Les nameservers peuvent révéler l'hébergeur DNS.",
    difficulty: "Débutant",
    tips: [
      "Les dates de création révèlent l'ancienneté et la légitimité d'un site",
      "Les services de confidentialité masquent les données mais peuvent être contournés via d'autres sources",
      "Utilisez whois.domaintools.com ou who.is pour des interfaces conviviales"
    ]
  },
  {
    id: 4,
    title: "Recherche d'images inversée",
    category: "Vérification",
    description: "Vérifier l'authenticité et tracer l'origine d'une image en utilisant la recherche inversée.",
    question: "Quels sont les trois principaux moteurs de recherche d'images inversée et dans quels cas utiliser chacun d'eux ?",
    solution: "1) Google Images : le plus utilisé, bon pour les images populaires et les lieux. 2) TinEye : excellent pour l'historique (montre les apparitions chronologiques), idéal pour détecter les manipulations. 3) Yandex Images : supérieur pour la reconnaissance de visages et d'objets, très efficace pour les photos de profil. Cas d'usage : vérifier si une photo de profil est volée, tracer l'origine d'une image virale, trouver des versions haute résolution, détecter des fake news visuelles.",
    difficulty: "Débutant",
    tips: [
      "Utilisez les trois moteurs pour maximiser vos résultats",
      "Yandex est souvent plus efficace que Google pour les visages",
      "TinEye garde un historique plus long que les autres"
    ]
  },
  {
    id: 5,
    title: "Métadonnées EXIF d'images",
    category: "Forensics",
    description: "Comprendre et extraire les métadonnées des fichiers images pour obtenir des informations contextuelles.",
    question: "Quelles informations critiques peuvent être extraites des métadonnées EXIF d'une photo et comment les consulter ?",
    solution: "Les métadonnées EXIF contiennent : date et heure de prise, modèle d'appareil photo/smartphone, paramètres (ISO, ouverture, vitesse), parfois coordonnées GPS (si activées), logiciel d'édition utilisé, orientation. Outils d'extraction : ExifTool (ligne de commande, le plus complet), Jeffrey's Image Metadata Viewer (en ligne), ou propriétés du fichier (Windows/Mac). ATTENTION : les réseaux sociaux suppriment généralement les EXIF lors de l'upload. Les coordonnées GPS peuvent révéler le lieu exact de prise de vue.",
    difficulty: "Débutant",
    tips: [
      "ExifTool est l'outil de référence : 'exiftool image.jpg'",
      "Les métadonnées peuvent être facilement supprimées ou falsifiées",
      "Corréllez toujours avec d'autres éléments visuels de la photo"
    ]
  },

  // ==================== INTERMÉDIAIRE (6-10) ====================
  {
    id: 6,
    title: "Analyse de profil social avancée",
    category: "Réseaux Sociaux",
    description: "Détecter les faux comptes, bots et comportements automatisés sur les réseaux sociaux.",
    question: "Quels indicateurs techniques et comportementaux permettent de distinguer un compte authentique d'un bot ou d'un faux profil ?",
    solution: "Indicateurs techniques : date de création récente, photo de profil générée par IA ou stock photo (vérifiable par recherche inversée), peu ou pas de photos personnelles, ratio followers/following anormal (très élevé ou 1:1 suspect). Indicateurs comportementaux : publications à intervalles réguliers parfaits (automatisation), peu d'interactions authentiques, contenus répétitifs ou copiés-collés, langue incohérente avec la localisation prétendue, activité 24/7 impossible pour un humain, soutien unilatéral d'un narratif spécifique. Analysez sur plusieurs mois pour détecter les patterns.",
    difficulty: "Intermédiaire",
    tips: [
      "Vérifiez la photo de profil via TinEye ou Google Images",
      "Analysez l'historique complet : les bots ont souvent des périodes d'inactivité puis d'hyperactivité",
      "Les interactions (réponses aux commentaires) sont plus révélatrices que les posts"
    ]
  },
  {
    id: 7,
    title: "Géolocalisation par analyse d'ombres",
    category: "Géolocalisation",
    description: "Utiliser les ombres dans une photo pour déterminer l'orientation géographique et l'heure approximative.",
    question: "Comment utiliser les ombres visibles dans une photo pour calculer l'orientation cardinale et estimer l'heure de prise de vue ?",
    solution: "L'ombre pointe vers le nord (hémisphère nord) à midi solaire. Méthodologie : 1) Mesurer la longueur et l'angle de l'ombre par rapport à des objets verticaux, 2) Utiliser SunCalc.org pour visualiser la position du soleil à différentes heures pour un lieu donné, 3) Comparer avec la photo pour trouver la correspondance. La longueur de l'ombre varie : courte à midi, longue le matin/soir. Précision : ±30-60 minutes pour l'heure, ±100km pour la localisation. Nécessite de connaître la date approximative.",
    difficulty: "Intermédiaire",
    tips: [
      "Plusieurs ombres de longueurs différentes augmentent la précision",
      "Combinez avec d'autres éléments (végétation, architecture) pour affiner",
      "ShadowCalculator.eu offre des outils de calcul spécialisés"
    ]
  },
  {
    id: 8,
    title: "Maltego pour cartographie de relations",
    category: "Outils avancés",
    description: "Utiliser Maltego pour visualiser et analyser les connexions entre différentes entités.",
    question: "Comment utiliser Maltego pour créer un graphe de relations à partir d'un domaine web et quelles informations peut-on découvrir ?",
    solution: "Workflow Maltego : 1) Créer un nouveau graphe, 2) Ajouter une entité 'Domain' avec le domaine cible, 3) Exécuter des transforms : DNS lookups (trouve IPs, nameservers), WHOIS (trouve registrant), Email addresses (trouve contacts), 4) Pivoter sur les nouvelles entités découvertes (ex: chercher d'autres domaines avec le même registrant), 5) Analyser le graphe visuel. Maltego révèle : sous-domaines, adresses email, serveurs associés, domaines liés, structure réseau. La version CE (Community Edition) est gratuite mais limitée.",
    difficulty: "Intermédiaire",
    tips: [
      "Commencez par une seule entité pour ne pas surcharger le graphe",
      "Les transforms peuvent prendre plusieurs minutes sur de gros ensembles",
      "Exportez votre graphe régulièrement (File > Export Graph)"
    ]
  },
  {
    id: 9,
    title: "Certificate Transparency Logs",
    category: "Infrastructure",
    description: "Utiliser les logs de certificats SSL/TLS pour découvrir des sous-domaines et l'infrastructure web.",
    question: "Comment utiliser crt.sh et les Certificate Transparency logs pour découvrir tous les sous-domaines d'un domaine cible ?",
    solution: "Les Certificate Transparency logs enregistrent publiquement tous les certificats SSL émis. Sur crt.sh : 1) Rechercher '%.example.com' (le % agit comme wildcard), 2) Le site retourne tous les certificats contenant ce pattern, révélant les sous-domaines, 3) Analyser les résultats : dates d'émission, autorités de certification, certificats actifs vs expirés. Révèle : sous-domaines cachés (dev, staging, admin), environnements internes exposés, services oubliés. Alternative : censys.io, Entrust CT Search. C'est une technique de reconnaissance 100% passive (non détectable).",
    difficulty: "Intermédiaire",
    tips: [
      "Les certificats expirés révèlent aussi des sous-domaines historiques",
      "Recherchez les certificats wildcard (*.example.com) qui couvrent tous les sous-domaines",
      "Combinez avec d'autres techniques (DNS bruteforce) pour une couverture complète"
    ]
  },
  {
    id: 10,
    title: "Corrélation multi-sources",
    category: "Analyse",
    description: "Croiser plusieurs sources d'information pour valider et enrichir vos découvertes.",
    question: "Quelle méthodologie appliquer pour corréler efficacement des informations provenant de sources diverses (réseaux sociaux, WHOIS, archives) ?",
    solution: "Méthodologie de corrélation : 1) Identifier les points communs : noms, dates, lieux, identifiants uniques, 2) Vérifier la cohérence temporelle (les dates concordent-elles ?), 3) Chercher des sources indépendantes (éviter l'echo chamber où les sources se citent mutuellement), 4) Évaluer la crédibilité de chaque source avec le modèle Admiralty, 5) Appliquer la triangulation (minimum 3 sources), 6) Noter les contradictions pour investigation supplémentaire, 7) Documenter le niveau de confiance final. La corrélation renforce la confiance mais ne garantit pas la vérité absolue (méfiance du biais de confirmation).",
    difficulty: "Intermédiaire",
    tips: [
      "Une information répétée par 10 sources qui se citent = 1 seule source",
      "Cherchez activement des informations qui contredisent votre hypothèse",
      "Utilisez des tableurs pour tracker les correspondances entre sources"
    ]
  },

  // ==================== AVANCÉ (11-15) ====================
  {
    id: 11,
    title: "Analysis of Competing Hypotheses (ACH)",
    category: "Méthodologie",
    description: "Technique analytique structurée pour évaluer plusieurs hypothèses concurrentes et éviter les biais cognitifs.",
    question: "Comment appliquer la méthode ACH pour analyser un incident de sécurité avec plusieurs explications possibles ?",
    solution: "Méthodologie ACH : 1) Lister toutes les hypothèses plausibles (ex: attaque APT, insider threat, erreur de configuration, coïncidence), même les improbables, 2) Identifier toutes les preuves/informations collectées, 3) Créer une matrice : hypothèses en colonnes, preuves en lignes, 4) Pour chaque cellule, évaluer si la preuve est Cohérente (C), Incohérente (I) ou Neutre (N) avec l'hypothèse, 5) L'hypothèse avec le moins d'incohérences est la plus probable, 6) Documenter le raisonnement et le niveau de confiance. ACH combat le biais de confirmation en forçant à considérer toutes les alternatives systématiquement.",
    difficulty: "Avancé",
    tips: [
      "Listez au moins 4-5 hypothèses pour éviter le biais binaire (vrai/faux)",
      "Les preuves qui réfutent sont plus informatives que celles qui confirment",
      "Mettez à jour la matrice quand de nouvelles informations arrivent"
    ]
  },
  {
    id: 12,
    title: "Python pour automatisation OSINT",
    category: "Automatisation",
    description: "Scripter en Python pour automatiser la collecte et l'analyse de données OSINT à grande échelle.",
    question: "Créez un workflow Python pour automatiser la collecte d'informations sur une liste de domaines (WHOIS, DNS, sous-domaines). Quelles bibliothèques utiliser ?",
    solution: "Bibliothèques essentielles : requests (requêtes HTTP), python-whois (données WHOIS), dnspython (requêtes DNS), pandas (manipulation données), json (parsing), time (délais). Workflow exemple : 1) Lire une liste de domaines depuis un fichier CSV, 2) Pour chaque domaine : faire un WHOIS (python-whois), résoudre DNS A/MX (dnspython), requêter crt.sh pour sous-domaines (requests), 3) Aggréger tous les résultats dans un DataFrame pandas, 4) Exporter en CSV/Excel. Ajoutez des délais (time.sleep(2)) entre requêtes pour éviter le blocage. Gérez les exceptions (try/except) pour la robustesse.",
    difficulty: "Avancé",
    tips: [
      "Utilisez des environnements virtuels (venv) pour isoler vos dépendances",
      "Loggez toutes les opérations (module logging) pour débugger",
      "Stockez les clés API dans des variables d'environnement, jamais en dur"
    ]
  },
  {
    id: 13,
    title: "Threat Intelligence via OSINT",
    category: "Cybersécurité",
    description: "Collecter et analyser du renseignement sur les menaces cyber en utilisant des sources ouvertes.",
    question: "Comment construire un profil de menace (threat profile) d'un groupe APT en utilisant uniquement des sources OSINT ?",
    solution: "Méthodologie de profiling APT : 1) Collecter les IOCs (Indicators of Compromise) : IPs, domaines, hashes de malware depuis des rapports publics (Mandiant, CrowdStrike, rapports gouvernementaux), 2) Pivoter sur ces IOCs : WHOIS historique, passive DNS (SecurityTrails), VirusTotal relations, 3) Identifier les TTPs (Tactics, Techniques, Procedures) via MITRE ATT&CK, 4) Analyser l'infrastructure : patterns de réutilisation, fournisseurs préférés, 5) Chercher sur forums underground et pastebin, 6) Corréler avec le contexte géopolitique (qui ciblent-ils ? pourquoi ?), 7) Documenter dans un format structuré (STIX/TAXII). Le profil produit des IOCs actionnables pour la détection.",
    difficulty: "Avancé",
    tips: [
      "Les rapports de sociétés de sécurité sont des mines d'or d'IOCs",
      "Cherchez les patterns de réutilisation (même registrant, même ASN)",
      "Utilisez AlienVault OTX et ThreatCrowd pour enrichir les IOCs"
    ]
  },
  {
    id: 14,
    title: "Analyse de métadonnées Office avancée",
    category: "Forensics",
    description: "Extraire des informations sensibles des documents Microsoft Office (Word, Excel, PowerPoint).",
    question: "Quelles métadonnées sensibles se cachent dans les documents Office et comment peuvent-elles révéler l'organisation interne d'une entreprise ?",
    solution: "Métadonnées Office critiques : nom de l'auteur (souvent le nom d'utilisateur Windows complet), organisation (nom de l'entreprise), liste des personnes ayant modifié le document, temps d'édition total, chemin complet du fichier original (ex: C:\\Users\\jdupont\\Documents\\Confidentiel\\rapport.docx), version exacte du logiciel, dates de création/modification, commentaires cachés, tracked changes non acceptés, notes de présentateur (PowerPoint). Extraction : exiftool -a document.docx (le plus complet), strings document.docx | grep (Linux), ou olevba pour les macros VBA. Ces données révèlent : structure de répertoires internes, conventions de nommage, employés clés, logiciels utilisés (potentiellement obsolètes = vulnérabilités).",
    difficulty: "Avancé",
    tips: [
      "Les documents gouvernementaux publiés sont souvent très riches en métadonnées",
      "Comparez les métadonnées de plusieurs documents d'une même organisation",
      "Les macros VBA peuvent contenir du code malveillant (analysez avec olevba)"
    ]
  },
  {
    id: 15,
    title: "OSINT sur infrastructures critiques",
    category: "Géopolitique",
    description: "Évaluer la surface d'attaque d'infrastructures critiques (énergie, eau, transport) via OSINT sans scan actif.",
    question: "Comment cartographier l'exposition d'une infrastructure critique (ex: réseau électrique) en utilisant uniquement des sources passives ?",
    solution: "Méthodologie passive : 1) Identifier les systèmes SCADA/ICS exposés via Shodan (recherche : 'SCADA country:FR', 'Modbus', 'ICS'), 2) Rechercher la documentation technique fuites (appels d'offres publics, manuels d'utilisation), 3) Cartographier le réseau via BGP/ASN lookup (identifier les plages IP de l'organisation), 4) Analyser la chaîne d'approvisionnement (quels fournisseurs ? leurs propres vulnérabilités ?), 5) Rechercher les employés sur LinkedIn (qui travaille sur ces systèmes ? quelles compétences ?), 6) Chercher les vulnérabilités connues (CVE databases) pour les technologies identifiées, 7) Produire un rapport d'exposition sans jamais scanner activement. CRITIQUE : alertez les autorités compétentes si vous découvrez des vulnérabilités graves.",
    difficulty: "Avancé",
    tips: [
      "Les infrastructures critiques sont des cibles ultra-sensibles (légalité ++)",
      "Ne scannez JAMAIS activement, utilisez UNIQUEMENT des données déjà indexées",
      "Coordonnez avec des CERT/CSIRT nationaux pour un disclosure responsable"
    ]
  },

  // ==================== EXPERT (16-20) ====================
  {
    id: 16,
    title: "Attribution d'acteurs APT",
    category: "Threat Intelligence",
    description: "Méthodologie rigoureuse pour attribuer une cyberattaque à un groupe APT spécifique avec un niveau de confiance documenté.",
    question: "Quels éléments OSINT permettent d'attribuer une cyberattaque à un groupe APT et quel niveau de confiance peut-on atteindre ?",
    solution: "Éléments d'attribution multi-niveaux : 1) Infrastructure (IPs, domaines, certificats SSL, patterns de réutilisation), 2) TTPs (Tactics, Techniques, Procedures selon MITRE ATT&CK - sont-ils signature du groupe ?), 3) Malware (similitudes de code via VirusTotal, hashes connus, strings uniques), 4) Timestamps (fuseaux horaires d'activité, jours ouvrables vs weekend), 5) Langue (erreurs grammaticales dans le code, keyboards layouts), 6) Motivations (qui bénéficierait ? alignement avec intérêts géopolitiques), 7) Capacités techniques (sophistication du toolkit). Méthodologie : comparer systématiquement avec la base de connaissance APT (MITRE ATT&CK Groups, Mandiant APT reports), chercher des overlaps, scorer la confiance (Low/Medium/High). ATTENTION : les acteurs sophistiqués font du false flag (attribution trompeuse intentionnelle). L'attribution certaine à 100% est quasi-impossible en OSINT seul.",
    difficulty: "Expert",
    tips: [
      "Cherchez des 'unique artifacts' : éléments qui n'apparaissent que chez ce groupe",
      "Les false flags sont détectables par des incohérences (niveau de sophistication, erreurs)",
      "Corréllez avec le contexte géopolitique : cui bono ? (à qui profite le crime)"
    ]
  },
  {
    id: 17,
    title: "OSINT et cycle de renseignement",
    category: "Méthodologie",
    description: "Intégrer l'OSINT dans un cycle de renseignement structuré (Intelligence Cycle) de niveau professionnel.",
    question: "Comment intégrer l'OSINT dans les 5 phases du cycle de renseignement et comment interagit-il avec les autres disciplines (HUMINT, SIGINT) ?",
    solution: "Les 5 phases du cycle : 1) Direction (Planning) : définir les RFIs (Requirements for Information) - 'Que veut-on savoir ?', 2) Collection : utiliser l'OSINT pour collecter (70% du travail ici), combiner avec HUMINT/SIGINT si disponibles, 3) Processing : normaliser les données OSINT (formats, enrichissement via APIs), 4) Analysis & Production : appliquer ACH, modèle Admiralty, créer des rapports, 5) Dissemination : diffuser aux stakeholders avec le bon niveau de classification, 6) Feedback : évaluer l'utilité, générer de nouveaux RFIs. L'OSINT s'intègre à toutes les étapes : validation de HUMINT (fact-checking), contextualisation de SIGINT (qui parle à qui ?), enrichissement mutuel. Frameworks avancés : F3EAD (Find, Fix, Finish, Exploit, Analyze, Disseminate) utilisé en opérations militaires.",
    difficulty: "Expert",
    tips: [
      "Les RFIs doivent être SMART : Specific, Measurable, Achievable, Relevant, Time-bound",
      "L'OSINT seul est rarement suffisant pour des décisions stratégiques critiques",
      "Documentez la provenance de chaque information (chain of custody)"
    ]
  },
  {
    id: 18,
    title: "Détection de campagnes de désinformation",
    category: "Influence",
    description: "Identifier et analyser des opérations de désinformation coordonnées à grande échelle.",
    question: "Quels indicateurs permettent de détecter une campagne de désinformation coordonnée par un acteur étatique et comment la documenter ?",
    solution: "Indicateurs de coordination : 1) Volume anormal de posts similaires sur courte période (amplification artificielle), 2) Comptes créés simultanément ou récemment, 3) Patterns de publication identiques (mêmes heures, rythme robotique), 4) Réutilisation exacte de contenus (copy-paste, même images), 5) Réseau de comptes qui se suivent et s'amplifient mutuellement, 6) Narratifs alignés avec intérêts géopolitiques spécifiques. Méthodologie de documentation : 1) Identifier les 'seed accounts' (premiers à poster, amplifiés ensuite), 2) Cartographier le réseau (qui RT/like qui ?), 3) Analyser la timeline (moments de pic d'activité), 4) Techniques : network analysis (Gephi), bot detection (Botometer), propagation tracking (Hoaxy), 5) Corréler avec événements géopolitiques. Cas d'études : opérations russes (Internet Research Agency), chinoises (50 Cent Army), iraniennes. Documentation rigoureuse essentielle (preuve légale potentielle).",
    difficulty: "Expert",
    tips: [
      "Les campagnes sophistiquées utilisent des comptes 'vieillis' (achetés, dormants longtemps)",
      "Cherchez les incohérences : langues mélangées, fuseaux horaires suspects",
      "Utilisez TweetDeck ou outils similaires pour monitorer en temps réel"
    ]
  },
  {
    id: 19,
    title: "OSINT sur supply chain",
    category: "Risques",
    description: "Analyser les risques cybersécurité de toute la chaîne d'approvisionnement d'une organisation cible.",
    question: "Comment évaluer les risques cyber d'une supply chain complexe via OSINT et identifier les maillons faibles ?",
    solution: "Méthodologie supply chain OSINT : 1) Cartographie complète : identifier tous les fournisseurs (sites web, rapports annuels, LinkedIn des employés, appels d'offres publics), 2) Pour chaque fournisseur, évaluer leur cybersécurité : a) Shodan (systèmes exposés), b) Recherche de breaches historiques (HaveIBeenPwned, médias), c) Certificats SSL (âge, autorité), d) Job postings (recrutent-ils un CISO ? = immaturité), e) Certifications (ISO 27001, SOC2), 3) Cartographier les dépendances (qui dépend de qui ? graphe de relations), 4) Identifier les SPOFs (Single Points of Failure), 5) Évaluer les fournisseurs de niveau 2 et 3 (supply chain profonde), 6) Scorer le risque (1-5) par fournisseur, 7) Produire une heatmap des risques. Les supply chain attacks (ex: SolarWinds 2020) sont critiques car ils permettent d'atteindre des centaines de cibles via un seul point d'entrée.",
    difficulty: "Expert",
    tips: [
      "Les petits fournisseurs (PME) sont souvent le maillon faible (moins de ressources cyber)",
      "Cherchez les dépendances cachées (sous-traitants des sous-traitants)",
      "Utilisez le framework NIST Cybersecurity Supply Chain Risk Management"
    ]
  },
  {
    id: 20,
    title: "Rapport OSINT de niveau stratégique",
    category: "Reporting",
    description: "Structurer et rédiger un rapport OSINT professionnel pour des décideurs de haut niveau (C-suite, gouvernement).",
    question: "Quelle structure et quels principes appliquer pour produire un rapport OSINT actionnable pour la direction exécutive ou des décideurs gouvernementaux ?",
    solution: "Structure professionnelle : 1) Executive Summary (1 page max) : synthèse pour décideurs non-techniques, conclusion principale, recommandations clés, niveau de confiance global, 2) Méthodologie (1-2 pages) : sources consultées (citées précisément), outils utilisés, période de collecte, limitations et biais potentiels, 3) Findings (corps principal) : découvertes organisées par thème ou chronologiquement, chaque finding avec cotation Admiralty (ex: B2), visualisations (graphes, timelines, cartes), 4) Analysis (interprétation) : qu'est-ce que cela signifie ?, hypothèses avec niveaux de confiance (ACH), implications stratégiques, 5) Recommendations (actionnables) : actions suggérées priorisées (court/moyen/long terme), risques et bénéfices, 6) Annexes : screenshots horodatés (preuves), données brutes, glossaire si termes techniques. Principes : clarté (pas de jargon inutile), traçabilité complète (toutes sources citées), horodatage systématique, versioning du document, watermark 'CONFIDENTIAL' si nécessaire. Format : PDF professionnel, sommaire cliquable, page de garde avec date/auteur/classification.",
    difficulty: "Expert",
    tips: [
      "L'executive summary doit pouvoir être lu en 2 minutes et contenir l'essentiel",
      "Distinguez clairement les faits (prouvés) des hypothèses (probable/possible)",
      "Incluez des visualisations : les décideurs retiennent mieux l'information visuelle"
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

  // Charger les exercices complétés au montage du composant
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

  // Marquer un exercice comme complété
  const markAsCompleted = (exerciseId: number) => {
    const newCompleted = new Set(completedExercises);
    newCompleted.add(exerciseId);
    setCompletedExercises(newCompleted);
    
    // Sauvegarder
    localStorage.setItem("completed_exercises", JSON.stringify(Array.from(newCompleted)));
    localStorage.setItem("exercices_completed", newCompleted.size.toString());
    
    // Mettre à jour les badges
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
      case "Débutant": return "#22c55e";
      case "Intermédiaire": return "#fbbf24";
      case "Avancé": return "#f97316";
      case "Expert": return "#ef4444";
      default: return "#00ff9c";
    }
  };

  const difficultyStats = {
    "Débutant": exercises.filter(e => e.difficulty === "Débutant").length,
    "Intermédiaire": exercises.filter(e => e.difficulty === "Intermédiaire").length,
    "Avancé": exercises.filter(e => e.difficulty === "Avancé").length,
    "Expert": exercises.filter(e => e.difficulty === "Expert").length
  };

  return (
    <main style={{ padding: "40px", maxWidth: "1000px", margin: "0 auto" }}>
      <h1 style={{ color: "#00ff9c", fontSize: "2rem", marginBottom: "10px" }}>
        Exercices OSINT Pratiques
      </h1>
      <p style={{ color: "#9ca3af", marginBottom: "30px", fontSize: "1.1rem" }}>
        20 exercices progressifs couvrant tous les niveaux de compétence OSINT
      </p>

      {/* Filtres par difficulté */}
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
          {["Tous", "Débutant", "Intermédiaire", "Avancé", "Expert"].map(level => (
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
            ❓ Question
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
              💡 Conseils
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
              ✓ Solution détaillée
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
            {showTips ? "Masquer les conseils" : "💡 Afficher des conseils"}
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
            {showSolution ? "Masquer la solution" : completedExercises.has(exercise.id) ? "✓ Revoir la solution" : "✓ Afficher la solution"}
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
          ← Exercice précédent
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
          Exercice suivant →
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
          📋 Liste des exercices {filterDifficulty !== "Tous" && `(${filterDifficulty})`}
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
                {completedExercises.has(ex.id) ? "✓" : index === current ? "▶" : "○"}
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
                  {ex.category} • {ex.difficulty}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bouton de réinitialisation */}
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
          🔄 Recommencer depuis le début
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
              Vous allez revenir au premier exercice et réinitialiser les filtres. 
              Vous pourrez toujours revenir à n'importe quel exercice via la liste.
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
                ✓ Confirmer
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

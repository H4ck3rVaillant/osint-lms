import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useThemeColors } from "../context/ThemeContext";
import { useGame } from "../context/GameContext";
import { markQuizComplete } from "../utils/certificateTracker";

interface Question {
  id: number;
  type: "qcm" | "boolean";
  question: string;
  options?: string[];
  correctAnswer: number; // Index de la bonne réponse (0, 1, 2, 3 pour QCM, 0=Vrai 1=Faux pour boolean)
  explanation: string;
}

// Base de données des questions par thème
const quizDatabase: Record<string, Question[]> = {
  "osint-basics": [
    { id: 1, type: "qcm", question: "Que signifie OSINT ?", options: ["Open Source Intelligence", "Operational Security Intelligence", "Online Security Information", "Open System Intelligence"], correctAnswer: 0, explanation: "OSINT = Open Source Intelligence, renseignement à partir de sources ouvertes." },
    { id: 2, type: "boolean", question: "L'OSINT consiste uniquement à utiliser Google pour chercher des informations.", correctAnswer: 1, explanation: "Faux. L'OSINT utilise de multiples sources : réseaux sociaux, bases de données publiques, registres, etc." },
    { id: 3, type: "qcm", question: "Quelle est la première étape d'une investigation OSINT ?", options: ["Collecte de données", "Définition des objectifs", "Analyse des résultats", "Rapport final"], correctAnswer: 1, explanation: "Définir clairement les objectifs permet de cibler la recherche et éviter la surcharge d'informations." },
    { id: 4, type: "boolean", question: "Il est légal d'utiliser l'OSINT pour collecter des informations publiques.", correctAnswer: 0, explanation: "Vrai. L'OSINT se base sur des sources publiques et ouvertes, ce qui est légal." },
    { id: 5, type: "qcm", question: "Quel outil permet de rechercher des archives web ?", options: ["Shodan", "Wayback Machine", "Maltego", "TheHarvester"], correctAnswer: 1, explanation: "Wayback Machine archive les anciennes versions des sites web." },
    { id: 6, type: "boolean", question: "Les métadonnées EXIF peuvent révéler la géolocalisation d'une photo.", correctAnswer: 0, explanation: "Vrai. Les métadonnées EXIF contiennent souvent les coordonnées GPS si activées sur l'appareil." },
    { id: 7, type: "qcm", question: "Quel opérateur Google permet de rechercher sur un site spécifique ?", options: ["site:", "domain:", "url:", "web:"], correctAnswer: 0, explanation: "L'opérateur 'site:' limite la recherche à un domaine précis (ex: site:example.com)." },
    { id: 8, type: "boolean", question: "Shodan est un moteur de recherche pour trouver des appareils IoT exposés.", correctAnswer: 0, explanation: "Vrai. Shodan indexe les appareils connectés à Internet (caméras, routeurs, serveurs, etc.)." },
    { id: 9, type: "qcm", question: "Quelle technique permet de trouver des sous-domaines ?", options: ["Port scanning", "DNS enumeration", "SQL injection", "XSS"], correctAnswer: 1, explanation: "L'énumération DNS révèle les sous-domaines d'un domaine principal." },
    { id: 10, type: "boolean", question: "L'OSINT peut être utilisé pour des enquêtes de cybersécurité.", correctAnswer: 0, explanation: "Vrai. L'OSINT est essentiel en cybersécurité pour la threat intelligence et l'analyse d'attaquants." },
    { id: 11, type: "qcm", question: "Quel format de fichier peut contenir des métadonnées exploitables ?", options: ["TXT", "PDF", "HTML", "CSV"], correctAnswer: 1, explanation: "Les PDF contiennent des métadonnées (auteur, logiciel, dates) très utiles en OSINT." },
    { id: 12, type: "boolean", question: "La recherche inversée d'image permet de trouver l'origine d'une photo.", correctAnswer: 0, explanation: "Vrai. Google Images, TinEye, Yandex permettent la recherche inversée." },
    { id: 13, type: "qcm", question: "Quel réseau social est le plus utilisé pour l'OSINT professionnel ?", options: ["Instagram", "LinkedIn", "TikTok", "Snapchat"], correctAnswer: 1, explanation: "LinkedIn regorge d'informations professionnelles : postes, entreprises, compétences, connections." },
    { id: 14, type: "boolean", question: "Il faut toujours créer un faux profil pour faire de l'OSINT sur les réseaux sociaux.", correctAnswer: 1, explanation: "Faux. Créer un faux profil peut être illégal et contraire aux CGU. L'OSINT passif est préférable." },
    { id: 15, type: "qcm", question: "Quel outil automatise la collecte d'informations OSINT ?", options: ["Nmap", "Maltego", "Burp Suite", "Metasploit"], correctAnswer: 1, explanation: "Maltego permet de visualiser et automatiser la collecte de données OSINT sous forme de graphes." },
    { id: 16, type: "boolean", question: "Les informations WHOIS d'un domaine sont toujours publiques.", correctAnswer: 1, explanation: "Faux. Depuis le RGPD, de nombreux domaines utilisent WHOIS privacy pour masquer les informations." },
    { id: 17, type: "qcm", question: "Que permet l'opérateur Google 'filetype:' ?", options: ["Chercher un type de fichier spécifique", "Filtrer par date", "Rechercher dans le titre", "Exclure des mots"], correctAnswer: 0, explanation: "filetype: permet de chercher des fichiers spécifiques (PDF, DOCX, XLS, etc.)." },
    { id: 18, type: "boolean", question: "Tor Browser permet de masquer son identité lors de recherches OSINT.", correctAnswer: 0, explanation: "Vrai. Tor anonymise la connexion en faisant passer le trafic par plusieurs nœuds." },
    { id: 19, type: "qcm", question: "Quelle base de données recense les fuites de données ?", options: ["Shodan", "Have I Been Pwned", "Censys", "VirusTotal"], correctAnswer: 1, explanation: "Have I Been Pwned répertorie les emails compromis dans des fuites de données." },
    { id: 20, type: "qcm", question: "Quel est le principe fondamental de l'OSINT ?", options: ["Pirater des systèmes", "Utiliser des sources publiques", "Créer des faux profils", "Intercepter des communications"], correctAnswer: 1, explanation: "L'OSINT repose exclusivement sur l'exploitation de sources ouvertes et légales." },
  ],
  "search-techniques": [
    { id: 1, type: "qcm", question: "Que signifie 'Google Dorking' ?", options: ["Utiliser Google normalement", "Utiliser des opérateurs avancés pour trouver des infos cachées", "Pirater Google", "Créer un bot Google"], correctAnswer: 1, explanation: "Google Dorking utilise des opérateurs de recherche avancés pour découvrir des informations non indexées normalement." },
    { id: 2, type: "boolean", question: "L'opérateur 'intitle:' recherche dans le titre des pages.", correctAnswer: 0, explanation: "Vrai. intitle: limite la recherche aux mots présents dans le titre de la page." },
    { id: 3, type: "qcm", question: "Quel opérateur exclut un mot de la recherche ?", options: ["+", "-", "!", "NOT"], correctAnswer: 1, explanation: "Le signe moins (-) exclut un terme de la recherche (ex: pizza -pineapple)." },
    { id: 4, type: "boolean", question: "L'opérateur 'cache:' affiche la version mise en cache par Google.", correctAnswer: 0, explanation: "Vrai. cache:example.com affiche la dernière version sauvegardée par Google." },
    { id: 5, type: "qcm", question: "Comment rechercher une expression exacte ?", options: ["(expression)", "[expression]", "\"expression\"", "'expression'"], correctAnswer: 2, explanation: "Les guillemets \"\" permettent de chercher une expression exacte sans variations." },
    { id: 6, type: "boolean", question: "L'opérateur 'inurl:' cherche dans l'URL des pages.", correctAnswer: 0, explanation: "Vrai. inurl:admin trouve les pages avec 'admin' dans l'URL." },
    { id: 7, type: "qcm", question: "Quel opérateur trouve des pages liées à un site ?", options: ["link:", "related:", "similar:", "connected:"], correctAnswer: 1, explanation: "related:example.com trouve des sites similaires ou liés." },
    { id: 8, type: "boolean", question: "On peut combiner plusieurs opérateurs dans une même recherche.", correctAnswer: 0, explanation: "Vrai. Ex: site:gov filetype:pdf budget 2024 combine 3 opérateurs." },
    { id: 9, type: "qcm", question: "Quel opérateur cherche dans le texte du corps de la page ?", options: ["intext:", "inbody:", "incontent:", "inpage:"], correctAnswer: 0, explanation: "intext: limite la recherche au contenu textuel de la page." },
    { id: 10, type: "boolean", question: "Google indexe automatiquement toutes les pages web existantes.", correctAnswer: 1, explanation: "Faux. Certaines pages sont bloquées (robots.txt), privées, ou dans le deep web." },
    { id: 11, type: "qcm", question: "Comment chercher un fichier Excel spécifique ?", options: ["ext:xls", "filetype:xlsx", "type:excel", "format:xls"], correctAnswer: 1, explanation: "filetype:xlsx ou filetype:xls trouve des fichiers Excel." },
    { id: 12, type: "boolean", question: "L'opérateur 'OR' doit être en majuscules dans Google.", correctAnswer: 0, explanation: "Vrai. 'pizza OR burger' fonctionne, mais 'pizza or burger' ne fonctionne pas." },
    { id: 13, type: "qcm", question: "Quel outil permet la recherche inversée d'images ?", options: ["Google Lens", "Bing Vision", "Yahoo Pics", "DuckDuck Images"], correctAnswer: 0, explanation: "Google Lens (et Google Images) permettent la recherche inversée d'images." },
    { id: 14, type: "boolean", question: "Yandex est souvent plus efficace que Google pour la recherche inversée d'images.", correctAnswer: 0, explanation: "Vrai. Yandex excelle dans la reconnaissance faciale et la recherche inversée." },
    { id: 15, type: "qcm", question: "Comment chercher dans une plage de nombres ?", options: ["1-100", "1..100", "1TO100", "1:100"], correctAnswer: 1, explanation: "Les deux points (..) créent une plage (ex: prix 100..500)." },
    { id: 16, type: "boolean", question: "L'opérateur '*' sert de wildcard dans Google.", correctAnswer: 0, explanation: "Vrai. 'best * pizza' trouve 'best italian pizza', 'best chicago pizza', etc." },
    { id: 17, type: "qcm", question: "Quel moteur de recherche ne track pas les utilisateurs ?", options: ["Google", "Bing", "DuckDuckGo", "Yahoo"], correctAnswer: 2, explanation: "DuckDuckGo ne track pas et ne personnalise pas les résultats." },
    { id: 18, type: "boolean", question: "Les guillemets anglais \"\" et français «» ont le même effet.", correctAnswer: 1, explanation: "Faux. Seuls les guillemets droits \"\" fonctionnent comme opérateur." },
    { id: 19, type: "qcm", question: "Comment trouver des caméras IP non sécurisées ?", options: ["Via Shodan avec des dorks spécifiques", "Via Google Images", "Via LinkedIn", "Via Twitter"], correctAnswer: 0, explanation: "Shodan indexe les appareils IoT exposés, dont les caméras IP." },
    { id: 20, type: "qcm", question: "Quel opérateur combine 'intitle' pour tous les mots ?", options: ["intitle:", "allintitle:", "titleall:", "fulltitle:"], correctAnswer: 1, explanation: "allintitle:mot1 mot2 cherche les deux mots dans le titre." },
  ],
  "geolocation": [
    { id: 1, type: "qcm", question: "Que signifie EXIF ?", options: ["Exchangeable Image File Format", "Extended Image Format", "Export Image File", "External Info Format"], correctAnswer: 0, explanation: "EXIF = Exchangeable Image File Format, métadonnées des images." },
    { id: 2, type: "boolean", question: "Les photos prises avec un smartphone contiennent souvent des coordonnées GPS.", correctAnswer: 0, explanation: "Vrai. Si la géolocalisation est activée, les coordonnées GPS sont dans les EXIF." },
    { id: 3, type: "qcm", question: "Quel outil extrait les métadonnées EXIF ?", options: ["ExifTool", "PhotoShop", "GIMP", "Paint"], correctAnswer: 0, explanation: "ExifTool est l'outil référence pour lire/modifier les métadonnées EXIF." },
    { id: 4, type: "boolean", question: "Les réseaux sociaux suppriment automatiquement les données EXIF lors de l'upload.", correctAnswer: 0, explanation: "Vrai. Facebook, Twitter, Instagram suppriment les EXIF pour protéger la vie privée." },
    { id: 5, type: "qcm", question: "Quelle plateforme Google permet de visualiser des lieux en 3D ?", options: ["Google Maps", "Google Earth", "Google Street View", "Google Satellite"], correctAnswer: 1, explanation: "Google Earth offre une vue 3D des terrains et bâtiments." },
    { id: 6, type: "boolean", question: "Google Street View affiche uniquement les routes principales.", correctAnswer: 1, explanation: "Faux. Street View couvre aussi des sentiers, parcs, intérieurs de bâtiments, etc." },
    { id: 7, type: "qcm", question: "Comment s'appelle la technique de localisation par croisement de plusieurs sources ?", options: ["Géofencing", "Triangulation", "Géotagging", "Géocaching"], correctAnswer: 1, explanation: "La triangulation croise plusieurs indices (ombres, bâtiments, panneaux) pour localiser." },
    { id: 8, type: "boolean", question: "L'angle des ombres peut aider à déterminer l'heure et la latitude d'une photo.", correctAnswer: 0, explanation: "Vrai. SunCalc et d'autres outils calculent la position du soleil selon les ombres." },
    { id: 9, type: "qcm", question: "Quel site archive les images satellites historiques ?", options: ["Google Earth Pro", "NASA Worldview", "Sentinel Hub", "Toutes ces réponses"], correctAnswer: 3, explanation: "Ces trois services offrent des archives satellites historiques." },
    { id: 10, type: "boolean", question: "On peut géolocaliser une photo en identifiant les plaques d'immatriculation.", correctAnswer: 0, explanation: "Vrai. Les formats de plaques varient par pays/région et donnent des indices." },
    { id: 11, type: "qcm", question: "Quelle résolution satellite est accessible gratuitement au public ?", options: ["10 cm", "30 cm", "10 mètres", "100 mètres"], correctAnswer: 2, explanation: "Sentinel-2 offre 10m de résolution gratuitement. Google Earth ~15cm mais payant en haute résolution." },
    { id: 12, type: "boolean", question: "Les panneaux de signalisation et de rue sont des indices géographiques importants.", correctAnswer: 0, explanation: "Vrai. Ils révèlent la langue, le pays, la région, parfois la ville exacte." },
    { id: 13, type: "qcm", question: "Quel outil permet de chercher des lieux par coordonnées GPS ?", options: ["Google Maps", "What3Words", "GeoGuessr", "Toutes ces réponses"], correctAnswer: 3, explanation: "Ces trois outils acceptent des coordonnées GPS en entrée." },
    { id: 14, type: "boolean", question: "La végétation et le climat peuvent aider à identifier une région.", correctAnswer: 0, explanation: "Vrai. Palmiers = climat tropical, sapins = climat froid, etc." },
    { id: 15, type: "qcm", question: "Comment s'appelle le jeu de géolocalisation basé sur Street View ?", options: ["GeoQuiz", "GeoGuessr", "GeoFinder", "GeoHunt"], correctAnswer: 1, explanation: "GeoGuessr challenge les joueurs à deviner des lieux via Street View." },
    { id: 16, type: "boolean", question: "Les tours de télécommunication sont référencées dans des bases publiques.", correctAnswer: 0, explanation: "Vrai. Des sites comme CellMapper ou OpenCellID recensent les antennes." },
    { id: 17, type: "qcm", question: "Quel format de coordonnées utilise des mots au lieu de chiffres ?", options: ["GPS", "UTM", "What3Words", "MGRS"], correctAnswer: 2, explanation: "What3Words divise le monde en carrés 3×3m identifiés par 3 mots." },
    { id: 18, type: "boolean", question: "Les montagnes et reliefs sont visibles sur Google Earth en 3D.", correctAnswer: 0, explanation: "Vrai. Google Earth utilise des données d'élévation pour le relief 3D." },
    { id: 19, type: "qcm", question: "Quelle architecture ou monument peut servir de point de repère ?", options: ["Églises", "Ponts", "Bâtiments historiques", "Toutes ces réponses"], correctAnswer: 3, explanation: "Tout élément distinctif (église, pont, statue) aide à la géolocalisation." },
    { id: 20, type: "qcm", question: "Quel indice NE révèle PAS la localisation géographique ?", options: ["Type de prise électrique", "Langue des panneaux", "Marque de voiture", "Couleur du ciel"], correctAnswer: 3, explanation: "La couleur du ciel ne donne pas d'info géographique fiable." },
  ],
  "social-media": [
    { id: 1, type: "qcm", question: "Quel réseau social permet la recherche avancée par opérateurs ?", options: ["Instagram", "Twitter/X", "TikTok", "Snapchat"], correctAnswer: 1, explanation: "Twitter/X supporte des opérateurs comme 'from:', 'to:', 'since:', 'until:'." },
    { id: 2, type: "boolean", question: "LinkedIn affiche publiquement toutes les connexions d'un utilisateur.", correctAnswer: 1, explanation: "Faux. L'utilisateur peut masquer ses connexions dans les paramètres de confidentialité." },
    { id: 3, type: "qcm", question: "Comment trouver tous les tweets d'un utilisateur contenant un mot ?", options: ["from:user mot", "@user mot", "user: mot", "by:user mot"], correctAnswer: 0, explanation: "from:username mot cherche les tweets de cet utilisateur contenant 'mot'." },
    { id: 4, type: "boolean", question: "Instagram permet de voir qui a visité votre profil.", correctAnswer: 1, explanation: "Faux. Instagram ne propose pas cette fonctionnalité (sauf pour les stories)." },
    { id: 5, type: "qcm", question: "Quel outil archive les profils et posts supprimés ?", options: ["Archive.org", "Social Searcher", "Wayback Machine", "Google Cache"], correctAnswer: 2, explanation: "Wayback Machine archive parfois les profils publics avant suppression." },
    { id: 6, type: "boolean", question: "TikTok affiche la localisation précise des vidéos uploadées.", correctAnswer: 1, explanation: "Faux. TikTok peut afficher une ville/région générale mais pas de coordonnées GPS exactes." },
    { id: 7, type: "qcm", question: "Comment chercher des posts Facebook d'une personne ?", options: ["Via Google avec site:facebook.com nom", "Via Facebook Graph Search (désactivé)", "Via des outils OSINT tiers", "Toutes ces réponses"], correctAnswer: 3, explanation: "Plusieurs méthodes existent selon la confidentialité du profil." },
    { id: 8, type: "boolean", question: "Telegram révèle le numéro de téléphone des utilisateurs par défaut.", correctAnswer: 1, explanation: "Faux. Le numéro est masqué sauf si l'utilisateur l'autorise." },
    { id: 9, type: "qcm", question: "Quel réseau social est le plus utilisé pour l'OSINT géopolitique ?", options: ["Pinterest", "Twitter/X", "LinkedIn", "Snapchat"], correctAnswer: 1, explanation: "Twitter/X est une source majeure pour suivre les événements en temps réel." },
    { id: 10, type: "boolean", question: "On peut identifier l'appareil photo utilisé via les métadonnées Instagram.", correctAnswer: 1, explanation: "Faux. Instagram supprime les EXIF lors de l'upload." },
    { id: 11, type: "qcm", question: "Comment trouver des tweets par localisation ?", options: ["near:ville", "geocode:lat,long,radius", "location:ville", "place:ville"], correctAnswer: 1, explanation: "geocode:48.8566,2.3522,10km trouve les tweets dans un rayon de 10km autour de Paris." },
    { id: 12, type: "boolean", question: "Reddit permet de chercher des posts supprimés via des sites tiers.", correctAnswer: 0, explanation: "Vrai. Des sites comme Reveddit ou Unddit montrent les posts/commentaires supprimés." },
    { id: 13, type: "qcm", question: "Quel outil permet de télécharger des profils Instagram complets ?", options: ["InstaLoader", "IGDownloader", "InstaSave", "IGExport"], correctAnswer: 0, explanation: "InstaLoader télécharge posts, stories, highlights, followers d'un profil public." },
    { id: 14, type: "boolean", question: "Discord affiche l'adresse IP des utilisateurs dans les messages.", correctAnswer: 1, explanation: "Faux. Discord ne révèle jamais les IPs dans l'interface standard." },
    { id: 15, type: "qcm", question: "Comment identifier les faux comptes sur LinkedIn ?", options: ["Photo de profil générique", "Peu de connexions", "Poste vague ou générique", "Toutes ces réponses"], correctAnswer: 3, explanation: "Les faux profils combinent souvent ces signes suspects." },
    { id: 16, type: "boolean", question: "WhatsApp Web révèle le statut en ligne même si l'utilisateur l'a masqué.", correctAnswer: 1, explanation: "Faux. Si le statut est masqué, il n'est visible nulle part." },
    { id: 17, type: "qcm", question: "Quel réseau professionnel chinois est équivalent à LinkedIn ?", options: ["WeChat", "Maimai", "Weibo", "Douyin"], correctAnswer: 1, explanation: "Maimai (脉脉) est le LinkedIn chinois pour les professionnels." },
    { id: 18, type: "boolean", question: "YouTube affiche publiquement la liste des vidéos 'likées' par défaut.", correctAnswer: 1, explanation: "Faux. La liste des likes est privée par défaut depuis plusieurs années." },
    { id: 19, type: "qcm", question: "Comment chercher des posts Twitter par date ?", options: ["since:2024-01-01 until:2024-12-31", "date:2024", "time:2024-01-01", "from:2024"], correctAnswer: 0, explanation: "since: et until: permettent de définir une période de recherche." },
    { id: 20, type: "qcm", question: "Quel outil surveille les mentions d'une marque sur les réseaux ?", options: ["Brandwatch", "Mention", "Hootsuite", "Toutes ces réponses"], correctAnswer: 3, explanation: "Ces trois outils offrent du monitoring social media." },
  ],
  "crypto-blockchain": [
    { id: 1, type: "qcm", question: "Qu'est-ce qu'une adresse Bitcoin ?", options: ["Un identifiant unique pour recevoir des BTC", "Le nom d'un portefeuille", "Un mot de passe", "Un code de transaction"], correctAnswer: 0, explanation: "Une adresse Bitcoin (ex: 1A1zP1...) est un identifiant public pour recevoir des fonds." },
    { id: 2, type: "boolean", question: "Toutes les transactions Bitcoin sont publiques et traçables.", correctAnswer: 0, explanation: "Vrai. La blockchain Bitcoin est publique et transparente." },
    { id: 3, type: "qcm", question: "Quel site permet d'explorer la blockchain Bitcoin ?", options: ["Blockchain.com", "Etherscan", "BscScan", "Solscan"], correctAnswer: 0, explanation: "Blockchain.com (ou Blockchair) permet d'explorer les transactions Bitcoin." },
    { id: 4, type: "boolean", question: "Les transactions Bitcoin sont totalement anonymes.", correctAnswer: 1, explanation: "Faux. Bitcoin est pseudonyme, pas anonyme. Les adresses peuvent être liées à des identités." },
    { id: 5, type: "qcm", question: "Qu'est-ce que Etherscan ?", options: ["Un explorateur Ethereum", "Un wallet", "Un exchange", "Un mining pool"], correctAnswer: 0, explanation: "Etherscan est l'explorateur de blockchain Ethereum le plus populaire." },
    { id: 6, type: "boolean", question: "Monero offre une meilleure confidentialité que Bitcoin.", correctAnswer: 0, explanation: "Vrai. Monero utilise des ring signatures et stealth addresses pour l'anonymat." },
    { id: 7, type: "qcm", question: "Comment s'appelle l'unité la plus petite de Bitcoin ?", options: ["Wei", "Satoshi", "Gwei", "Finney"], correctAnswer: 1, explanation: "1 Satoshi = 0.00000001 BTC, la plus petite unité." },
    { id: 8, type: "boolean", question: "On peut remonter de l'adresse au propriétaire via la blockchain seule.", correctAnswer: 1, explanation: "Faux. Il faut croiser avec des données externes (KYC exchange, IP, etc.)." },
    { id: 9, type: "qcm", question: "Quel outil analyse les flux de cryptomonnaies ?", options: ["Chainalysis", "Elliptic", "CipherTrace", "Toutes ces réponses"], correctAnswer: 3, explanation: "Ces trois entreprises font de l'analyse blockchain pour les autorités." },
    { id: 10, type: "boolean", question: "Les smart contracts Ethereum sont visibles et auditables.", correctAnswer: 0, explanation: "Vrai. Le code des smart contracts est public sur Etherscan." },
    { id: 11, type: "qcm", question: "Qu'est-ce qu'un mixer/tumbler crypto ?", options: ["Un service qui brouille l'origine des fonds", "Un exchange", "Un wallet matériel", "Un mineur"], correctAnswer: 0, explanation: "Les mixers (ex: Tornado Cash) mélangent des transactions pour masquer la provenance." },
    { id: 12, type: "boolean", question: "Le FBI a déjà saisi des Bitcoins sur la blockchain.", correctAnswer: 0, explanation: "Vrai. Le FBI a saisi des milliards en BTC (ex: Colonial Pipeline, Silk Road)." },
    { id: 13, type: "qcm", question: "Combien de confirmations faut-il généralement pour une transaction BTC sécurisée ?", options: ["1", "3", "6", "12"], correctAnswer: 2, explanation: "6 confirmations (~1h) sont considérées comme sûres pour Bitcoin." },
    { id: 14, type: "boolean", question: "NFT signifie Non-Fungible Token (jeton non fongible).", correctAnswer: 0, explanation: "Vrai. Un NFT est unique et non interchangeable, contrairement aux cryptos." },
    { id: 15, type: "qcm", question: "Sur quelle blockchain fonctionne Tether (USDT) principalement ?", options: ["Bitcoin", "Ethereum", "Tron", "Ethereum et Tron"], correctAnswer: 3, explanation: "USDT existe sur plusieurs blockchains, surtout Ethereum (ERC-20) et Tron (TRC-20)." },
    { id: 16, type: "boolean", question: "Un portefeuille crypto peut être identifié s'il interagit avec un exchange régulé.", correctAnswer: 0, explanation: "Vrai. Les exchanges KYC peuvent révéler l'identité derrière une adresse." },
    { id: 17, type: "qcm", question: "Qu'est-ce qu'un rug pull dans les cryptos ?", options: ["Une arnaque où les créateurs disparaissent avec les fonds", "Un bug du smart contract", "Une baisse de prix normale", "Un fork de blockchain"], correctAnswer: 0, explanation: "Un rug pull est une exit scam où les devs vident la liquidité et disparaissent." },
    { id: 18, type: "boolean", question: "La blockchain peut être modifiée a posteriori pour corriger des erreurs.", correctAnswer: 1, explanation: "Faux. La blockchain est immuable (sauf hard fork consensuel exceptionnel)." },
    { id: 19, type: "qcm", question: "Quel est le symbole de la cryptomonnaie Ethereum ?", options: ["BTC", "ETH", "LTC", "XRP"], correctAnswer: 1, explanation: "ETH est le symbole d'Ethereum." },
    { id: 20, type: "qcm", question: "Comment appelle-t-on une adresse qui n'a jamais effectué de transaction sortante ?", options: ["Cold wallet", "Whale", "HODL address", "Dead address"], correctAnswer: 0, explanation: "Un cold wallet ne dépense jamais ses fonds (stockage long terme)." },
  ],
  "darkweb": [
    { id: 1, type: "qcm", question: "Que signifie l'acronyme TOR ?", options: ["Total Online Resources", "The Onion Router", "Trusted Origin Relay", "Trackless Open Routing"], correctAnswer: 1, explanation: "TOR = The Onion Router, réseau d'anonymisation en couches comme un oignon." },
    { id: 2, type: "boolean", question: "Tor Browser permet d'accéder aux sites en .onion.", correctAnswer: 0, explanation: "Vrai. Les sites .onion ne sont accessibles que via le réseau Tor." },
    { id: 3, type: "qcm", question: "Quel est l'autre grand réseau anonyme alternatif à Tor ?", options: ["VPN", "I2P", "Proxy", "SSH"], correctAnswer: 1, explanation: "I2P (Invisible Internet Project) est un réseau anonyme décentralisé comme Tor." },
    { id: 4, type: "boolean", question: "Utiliser Tor est illégal dans tous les pays.", correctAnswer: 1, explanation: "Faux. Tor est légal dans la plupart des pays (mais bloqué en Chine, Iran, etc.)." },
    { id: 5, type: "qcm", question: "Qu'est-ce qu'un Hidden Service sur Tor ?", options: ["Un site .onion hébergé anonymement", "Un VPN", "Un proxy", "Un serveur DNS"], correctAnswer: 0, explanation: "Un Hidden Service est un site accessible uniquement via Tor avec une adresse .onion." },
    { id: 6, type: "boolean", question: "Le FBI ne peut pas tracer les utilisateurs de Tor.", correctAnswer: 1, explanation: "Faux. Avec des exploits, des erreurs utilisateurs, ou des nœuds compromis, le FBI a déjà arrêté des utilisateurs Tor." },
    { id: 7, type: "qcm", question: "Combien de nœuds Tor traversent les connexions par défaut ?", options: ["1", "2", "3", "5"], correctAnswer: 2, explanation: "Tor utilise 3 relais : Guard → Middle → Exit node." },
    { id: 8, type: "boolean", question: "Les sites .onion peuvent être indexés par Google.", correctAnswer: 1, explanation: "Faux. Les sites .onion ne sont pas accessibles hors Tor, donc non indexables." },
    { id: 9, type: "qcm", question: "Quel navigateur est basé sur Tor ?", options: ["Brave", "Tor Browser", "Firefox", "Waterfox"], correctAnswer: 1, explanation: "Tor Browser est une version modifiée de Firefox optimisée pour Tor." },
    { id: 10, type: "boolean", question: "Tails est un système d'exploitation orienté anonymat.", correctAnswer: 0, explanation: "Vrai. Tails (The Amnesic Incognito Live System) route tout via Tor." },
    { id: 11, type: "qcm", question: "Quel marketplace du darknet a été fermé par le FBI en 2013 ?", options: ["AlphaBay", "Silk Road", "Dream Market", "Wall Street Market"], correctAnswer: 1, explanation: "Silk Road a été fermé en 2013, son fondateur Ross Ulbricht condamné à perpétuité." },
    { id: 12, type: "boolean", question: "I2P est plus rapide que Tor pour naviguer.", correctAnswer: 1, explanation: "Faux. I2P est généralement plus lent que Tor mais mieux pour le P2P." },
    { id: 13, type: "qcm", question: "Comment appelle-t-on le dernier nœud Tor visible par le site visité ?", options: ["Guard node", "Entry node", "Exit node", "Relay node"], correctAnswer: 2, explanation: "L'Exit node est le dernier relai qui se connecte au site de destination." },
    { id: 14, type: "boolean", question: "Les transactions sur les marketplaces darknet se font principalement en Monero.", correctAnswer: 0, explanation: "Vrai. Monero (XMR) a remplacé Bitcoin pour plus de confidentialité." },
    { id: 15, type: "qcm", question: "Qu'est-ce que Dread sur le darknet ?", options: ["Un forum type Reddit", "Un marketplace", "Un moteur de recherche", "Un wallet crypto"], correctAnswer: 0, explanation: "Dread est un forum darknet similaire à Reddit, populaire pour discuter des markets." },
    { id: 16, type: "boolean", question: "Activer JavaScript dans Tor Browser augmente l'anonymat.", correctAnswer: 1, explanation: "Faux. JavaScript peut être exploité pour désanonymiser, il est désactivé par défaut en mode sûr." },
    { id: 17, type: "qcm", question: "Quel moteur de recherche darknet indexe les sites .onion ?", options: ["Google", "DuckDuckGo (version .onion)", "Ahmia", "Torch"], correctAnswer: 2, explanation: "Ahmia.fi est un moteur de recherche spécialisé dans les sites .onion légitimes." },
    { id: 18, type: "boolean", question: "Les autorités infiltrent régulièrement les marketplaces darknet.", correctAnswer: 0, explanation: "Vrai. Le FBI, Europol infiltrent ou reprennent des markets pour arrêter vendeurs/acheteurs." },
    { id: 19, type: "qcm", question: "Qu'est-ce qu'un 'canary' dans le contexte Tor ?", options: ["Un oiseau Tor", "Un warrant canary (avis de sécurité)", "Un type de nœud", "Un malware"], correctAnswer: 1, explanation: "Un warrant canary est un message qui disparaît si l'opérateur est sous contrainte légale." },
    { id: 20, type: "qcm", question: "Quel système d'exploitation ne doit jamais être utilisé pour Tor ?", options: ["Windows sans VPN", "macOS", "Linux", "Aucune restriction"], correctAnswer: 3, explanation: "Tor fonctionne sur tous les OS, mais Tails/Linux sont recommandés pour plus de sécurité." },
  ],
};

export default function QuizSession() {
  const { themeId } = useParams<{ themeId: string }>();
  const navigate = useNavigate();
  const colors = useThemeColors();
  const { addXP, unlockBadge } = useGame();

  const questions = quizDatabase[themeId || ""] || [];
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState<boolean[]>(new Array(questions.length).fill(false));
  
  // Timers
  const [globalTime, setGlobalTime] = useState(15 * 60); // 15 minutes en secondes
  const [questionTime, setQuestionTime] = useState(30); // 30 secondes par question
  const [isFinished, setIsFinished] = useState(false);

  // Timer global
  useEffect(() => {
    if (isFinished || questions.length === 0) return;

    const interval = setInterval(() => {
      setGlobalTime((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleFinishQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isFinished, questions.length]);

  // Timer par question
  useEffect(() => {
    if (isFinished || showExplanation || questions.length === 0) return;

    const interval = setInterval(() => {
      setQuestionTime((prev) => {
        if (prev <= 1) {
          // Temps écoulé, passer à la question suivante automatiquement
          handleNextQuestion();
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentQuestion, isFinished, showExplanation, questions.length]);

  const handleAnswerSelect = (answerIndex: number) => {
    if (showExplanation || answeredQuestions[currentQuestion]) return;
    
    setSelectedAnswer(answerIndex);
    setShowExplanation(true);
    
    const isCorrect = answerIndex === questions[currentQuestion].correctAnswer;
    if (isCorrect) {
      setScore(score + 1);
    }
    
    const newAnswered = [...answeredQuestions];
    newAnswered[currentQuestion] = true;
    setAnsweredQuestions(newAnswered);
  };

  const handleNextQuestion = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setQuestionTime(30);
    } else {
      handleFinishQuiz();
    }
  }, [currentQuestion, questions.length]);

  const handleFinishQuiz = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setIsFinished(true);
    
    const percentage = (score / questions.length) * 100;
    let badge = "";
    let xpGain = 0;

    if (percentage >= 95) {
      badge = `quiz_${themeId}_gold`;
      xpGain = 500;
    } else if (percentage >= 80) {
      badge = `quiz_${themeId}_silver`;
      xpGain = 300;
    } else if (percentage >= 60) {
      badge = `quiz_${themeId}_bronze`;
      xpGain = 150;
    }

    if (badge) {
      unlockBadge(badge, `Quiz ${themeId} - ${percentage >= 95 ? "Or" : percentage >= 80 ? "Argent" : "Bronze"}`);
    }
    
    if (xpGain > 0) {
      addXP(xpGain, `Terminé quiz ${themeId}`);
    }

    // ✅ Tracker le quiz pour le certificat si score ≥60%
    if (percentage >= 60 && themeId) {
      markQuizComplete(themeId);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getScorePercentage = () => ((score / questions.length) * 100).toFixed(0);

  const getBadgeForScore = (percentage: number) => {
    if (percentage >= 95) return { emoji: "🥇", name: "Or", color: "#ffd700" };
    if (percentage >= 80) return { emoji: "🥈", name: "Argent", color: "#c0c0c0" };
    if (percentage >= 60) return { emoji: "🥉", name: "Bronze", color: "#cd7f32" };
    return { emoji: "❌", name: "Aucun", color: "#ef4444" };
  };

  const handleResetQuiz = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowExplanation(false);
    setAnsweredQuestions(new Array(questions.length).fill(false));
    setGlobalTime(15 * 60);
    setQuestionTime(30);
    setIsFinished(false);
  };

  if (questions.length === 0) {
    return (
      <div style={{ 
        minHeight: "100vh", 
        background: colors.bgPrimary,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        paddingTop: "80px"
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "4rem", marginBottom: "20px" }}>🚧</div>
          <h2 style={{ color: colors.textPrimary, fontSize: "1.8rem", marginBottom: "15px" }}>
            Quiz en construction
          </h2>
          <p style={{ color: colors.textSecondary, marginBottom: "30px" }}>
            Les questions pour ce thème seront bientôt disponibles !
          </p>
          <button
            onClick={() => navigate("/quiz")}
            style={{
              background: colors.accent,
              color: "#fff",
              border: "none",
              padding: "12px 30px",
              borderRadius: "8px",
              fontSize: "1rem",
              fontWeight: "600",
              cursor: "pointer"
            }}
          >
            ← Retour aux quiz
          </button>
        </div>
      </div>
    );
  }

  // Écran de résultats
  if (isFinished) {
    const percentage = parseFloat(getScorePercentage());
    const badge = getBadgeForScore(percentage);

    return (
      <div style={{ 
        minHeight: "100vh", 
        background: colors.bgPrimary,
        paddingTop: "80px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <div style={{
          maxWidth: "600px",
          width: "90%",
          background: colors.bgSecondary,
          borderRadius: "20px",
          padding: "50px",
          textAlign: "center",
          border: `2px solid ${badge.color}`
        }}>
          <div style={{ fontSize: "5rem", marginBottom: "20px" }}>{badge.emoji}</div>
          
          <h2 style={{ 
            color: colors.textPrimary, 
            fontSize: "2rem", 
            fontWeight: "700",
            marginBottom: "10px"
          }}>
            Quiz terminé !
          </h2>

          <div style={{
            fontSize: "3rem",
            fontWeight: "700",
            color: badge.color,
            marginBottom: "20px"
          }}>
            {score}/{questions.length}
          </div>

          <div style={{
            background: `${badge.color}20`,
            borderRadius: "12px",
            padding: "20px",
            marginBottom: "30px"
          }}>
            <div style={{ 
              color: colors.textSecondary, 
              fontSize: "0.9rem",
              marginBottom: "8px"
            }}>
              Score
            </div>
            <div style={{ 
              fontSize: "2.5rem", 
              fontWeight: "700",
              color: badge.color
            }}>
              {percentage}%
            </div>
            <div style={{
              marginTop: "15px",
              padding: "12px",
              background: colors.bgPrimary,
              borderRadius: "8px",
              color: colors.textPrimary,
              fontWeight: "600"
            }}>
              Badge {badge.name} {badge.emoji}
            </div>
          </div>

          <div style={{
            display: "flex",
            gap: "15px",
            justifyContent: "center"
          }}>
            <button
              onClick={handleResetQuiz}
              style={{
                background: "transparent",
                color: colors.accent,
                border: `2px solid ${colors.accent}`,
                padding: "12px 25px",
                borderRadius: "10px",
                fontSize: "1rem",
                fontWeight: "600",
                cursor: "pointer"
              }}
            >
              🔄 Refaire
            </button>
            <button
              onClick={() => navigate("/quiz")}
              style={{
                background: colors.accent,
                color: "#fff",
                border: "none",
                padding: "12px 25px",
                borderRadius: "10px",
                fontSize: "1rem",
                fontWeight: "600",
                cursor: "pointer"
              }}
            >
              📚 Autres quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div style={{ 
      minHeight: "100vh", 
      background: colors.bgPrimary,
      paddingTop: "80px"
    }}>
      <div style={{ 
        maxWidth: "900px", 
        margin: "0 auto", 
        padding: "40px 20px" 
      }}>
        
        {/* Top Bar - Timers & Progress */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
          flexWrap: "wrap",
          gap: "15px"
        }}>
          {/* Timer global */}
          <div style={{
            background: globalTime < 60 ? "#ef444420" : `${colors.accent}15`,
            border: `2px solid ${globalTime < 60 ? "#ef4444" : colors.accent}`,
            borderRadius: "12px",
            padding: "12px 20px",
            display: "flex",
            alignItems: "center",
            gap: "10px"
          }}>
            <span style={{ fontSize: "1.3rem" }}>⏱️</span>
            <div>
              <div style={{ 
                fontSize: "0.75rem", 
                color: colors.textSecondary,
                marginBottom: "2px"
              }}>
                Temps total
              </div>
              <div style={{ 
                fontSize: "1.2rem", 
                fontWeight: "700",
                color: globalTime < 60 ? "#ef4444" : colors.textPrimary,
                fontFamily: "monospace"
              }}>
                {formatTime(globalTime)}
              </div>
            </div>
          </div>

          {/* Progress */}
          <div style={{
            background: colors.bgSecondary,
            border: `1px solid ${colors.border}`,
            borderRadius: "12px",
            padding: "12px 20px",
            flex: 1,
            minWidth: "200px"
          }}>
            <div style={{
              fontSize: "0.75rem",
              color: colors.textSecondary,
              marginBottom: "8px"
            }}>
              Question {currentQuestion + 1} / {questions.length}
            </div>
            <div style={{
              background: colors.bgPrimary,
              borderRadius: "10px",
              height: "8px",
              overflow: "hidden"
            }}>
              <div style={{
                background: colors.accent,
                height: "100%",
                width: `${((currentQuestion + 1) / questions.length) * 100}%`,
                transition: "width 0.3s ease"
              }} />
            </div>
          </div>

          {/* Score actuel */}
          <div style={{
            background: colors.bgSecondary,
            border: `1px solid ${colors.border}`,
            borderRadius: "12px",
            padding: "12px 20px",
            textAlign: "center"
          }}>
            <div style={{ 
              fontSize: "0.75rem", 
              color: colors.textSecondary,
              marginBottom: "2px"
            }}>
              Score
            </div>
            <div style={{ 
              fontSize: "1.2rem", 
              fontWeight: "700",
              color: colors.accent
            }}>
              {score}/{currentQuestion + (answeredQuestions[currentQuestion] ? 1 : 0)}
            </div>
          </div>
        </div>

        {/* Question Card */}
        <div style={{
          background: colors.bgSecondary,
          borderRadius: "20px",
          padding: "40px",
          border: `2px solid ${colors.border}`,
          marginBottom: "30px"
        }}>
          {/* Timer question */}
          <div style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "30px"
          }}>
            <div style={{
              background: questionTime < 10 ? "#ef444420" : `${colors.accent}10`,
              border: `2px solid ${questionTime < 10 ? "#ef4444" : colors.accent}`,
              borderRadius: "50%",
              width: "80px",
              height: "80px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.8rem",
              fontWeight: "700",
              color: questionTime < 10 ? "#ef4444" : colors.accent,
              fontFamily: "monospace"
            }}>
              {questionTime}s
            </div>
          </div>

          {/* Type de question */}
          <div style={{
            display: "inline-block",
            background: question.type === "qcm" ? "#3b82f620" : "#f59e0b20",
            color: question.type === "qcm" ? "#3b82f6" : "#f59e0b",
            padding: "6px 14px",
            borderRadius: "20px",
            fontSize: "0.75rem",
            fontWeight: "600",
            marginBottom: "20px"
          }}>
            {question.type === "qcm" ? "QCM" : "Vrai/Faux"}
          </div>

          {/* Question text */}
          <h3 style={{
            fontSize: "1.5rem",
            fontWeight: "600",
            color: colors.textPrimary,
            lineHeight: "1.6",
            marginBottom: "35px"
          }}>
            {question.question}
          </h3>

          {/* Options */}
          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            {question.type === "qcm" ? (
              question.options?.map((option, index) => {
                const isSelected = selectedAnswer === index;
                const isCorrect = index === question.correctAnswer;
                const showResult = showExplanation;

                return (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={showExplanation}
                    style={{
                      background: showResult 
                        ? isCorrect 
                          ? "#10b98120" 
                          : isSelected 
                            ? "#ef444420" 
                            : colors.bgPrimary
                        : isSelected
                          ? `${colors.accent}20`
                          : colors.bgPrimary,
                      border: `2px solid ${
                        showResult
                          ? isCorrect
                            ? "#10b981"
                            : isSelected
                              ? "#ef4444"
                              : colors.border
                          : isSelected
                            ? colors.accent
                            : colors.border
                      }`,
                      borderRadius: "12px",
                      padding: "18px 24px",
                      fontSize: "1.05rem",
                      color: colors.textPrimary,
                      cursor: showExplanation ? "default" : "pointer",
                      textAlign: "left",
                      transition: "all 0.3s ease",
                      display: "flex",
                      alignItems: "center",
                      gap: "15px"
                    }}
                  >
                    <div style={{
                      width: "30px",
                      height: "30px",
                      borderRadius: "50%",
                      background: showResult
                        ? isCorrect
                          ? "#10b981"
                          : isSelected
                            ? "#ef4444"
                            : "transparent"
                        : isSelected
                          ? colors.accent
                          : "transparent",
                      border: `2px solid ${
                        showResult
                          ? isCorrect
                            ? "#10b981"
                            : isSelected
                              ? "#ef4444"
                              : colors.border
                          : isSelected
                            ? colors.accent
                            : colors.border
                      }`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.9rem",
                      fontWeight: "700",
                      color: showResult && (isCorrect || isSelected) ? "#fff" : colors.textSecondary,
                      flexShrink: 0
                    }}>
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span style={{ flex: 1 }}>{option}</span>
                    {showResult && isCorrect && <span>✓</span>}
                    {showResult && isSelected && !isCorrect && <span>✗</span>}
                  </button>
                );
              })
            ) : (
              <>
                {["Vrai", "Faux"].map((option, index) => {
                  const isSelected = selectedAnswer === index;
                  const isCorrect = index === question.correctAnswer;
                  const showResult = showExplanation;

                  return (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(index)}
                      disabled={showExplanation}
                      style={{
                        background: showResult 
                          ? isCorrect 
                            ? "#10b98120" 
                            : isSelected 
                              ? "#ef444420" 
                              : colors.bgPrimary
                          : isSelected
                            ? `${colors.accent}20`
                            : colors.bgPrimary,
                        border: `2px solid ${
                          showResult
                            ? isCorrect
                              ? "#10b981"
                              : isSelected
                                ? "#ef4444"
                                : colors.border
                            : isSelected
                              ? colors.accent
                              : colors.border
                        }`,
                        borderRadius: "12px",
                        padding: "20px 30px",
                        fontSize: "1.2rem",
                        fontWeight: "600",
                        color: colors.textPrimary,
                        cursor: showExplanation ? "default" : "pointer",
                        textAlign: "center",
                        transition: "all 0.3s ease"
                      }}
                    >
                      {option} {showResult && isCorrect && "✓"} {showResult && isSelected && !isCorrect && "✗"}
                    </button>
                  );
                })}
              </>
            )}
          </div>

          {/* Explanation */}
          {showExplanation && (
            <div style={{
              marginTop: "30px",
              padding: "20px",
              background: selectedAnswer === question.correctAnswer 
                ? "#10b98110" 
                : "#ef444410",
              border: `2px solid ${selectedAnswer === question.correctAnswer ? "#10b981" : "#ef4444"}`,
              borderRadius: "12px"
            }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "10px"
              }}>
                <span style={{ fontSize: "1.5rem" }}>
                  {selectedAnswer === question.correctAnswer ? "✅" : "❌"}
                </span>
                <strong style={{ 
                  color: selectedAnswer === question.correctAnswer ? "#10b981" : "#ef4444",
                  fontSize: "1.1rem"
                }}>
                  {selectedAnswer === question.correctAnswer ? "Bonne réponse !" : "Mauvaise réponse"}
                </strong>
              </div>
              <p style={{
                color: colors.textSecondary,
                lineHeight: "1.6",
                margin: 0
              }}>
                {question.explanation}
              </p>
            </div>
          )}
        </div>

        {/* Next button */}
        {showExplanation && (
          <div style={{ textAlign: "center" }}>
            <button
              onClick={handleNextQuestion}
              style={{
                background: colors.accent,
                color: "#fff",
                border: "none",
                padding: "16px 50px",
                borderRadius: "12px",
                fontSize: "1.1rem",
                fontWeight: "600",
                cursor: "pointer",
                boxShadow: `0 4px 15px ${colors.accent}40`
              }}
            >
              {currentQuestion < questions.length - 1 ? "Question suivante →" : "Voir les résultats 🎯"}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

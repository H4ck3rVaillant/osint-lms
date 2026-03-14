import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "../auth/AuthContext";

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
  flag: string;
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
  activityCalendar: Record<string, number>;
  badges: Badge[];
  solvedChallenges: string[];
  totalAttempts: number;
  rank: number;
}

/* =====================================================
   CONFIGURATION API
===================================================== */
const API_URL = "https://osint-lms-backend.onrender.com";
const AUTO_SAVE_INTERVAL = 30000; // 30 secondes

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
const CTF_CHALLENGES: CTFChallenge[] = [
  // OSINT (5)
  { id: "osint_1", title: "Digital Footprint", category: "osint", difficulty: "easy", points: 50, description: "Trouvez les réseaux sociaux de l'utilisateur @cyb3rgh0st", hint: "Cherchez sur plusieurs plateformes", flag: "FLAG{social_media_everywhere}", solved: false, attempts: 0 },
  { id: "osint_2", title: "Geolocation Master", category: "osint", difficulty: "medium", points: 100, description: "Localisez l'endroit exact de cette photo", hint: "Regardez les panneaux et l'architecture", flag: "FLAG{paris_eiffel_tower}", solved: false, attempts: 0 },
  { id: "osint_3", title: "Metadata Hunter", category: "osint", difficulty: "medium", points: 100, description: "Extrayez les coordonnées GPS de cette image", hint: "Utilisez exiftool ou un outil similaire", flag: "FLAG{48.8584_2.2945}", solved: false, attempts: 0 },
  { id: "osint_4", title: "Email Tracer", category: "osint", difficulty: "hard", points: 150, description: "Trouvez l'email professionnel du CEO de CyberCorp", hint: "LinkedIn et WHOIS peuvent aider", flag: "FLAG{ceo@cybercorp.com}", solved: false, attempts: 0 },
  { id: "osint_5", title: "Deep Web Search", category: "osint", difficulty: "hard", points: 150, description: "Trouvez le forum caché mentionné dans ce message", hint: "Cherchez dans les archives et les liens morts", flag: "FLAG{hidden_forum_2024}", solved: false, attempts: 0 },
  
  // Cryptographie (3)
  { id: "crypto_1", title: "Caesar Shift", category: "crypto", difficulty: "easy", points: 50, description: "Décodez : FDHVDU FLSKHU", hint: "Essayez un décalage de 3", flag: "FLAG{caesar_cipher}", solved: false, attempts: 0 },
  { id: "crypto_2", title: "Base64 Layers", category: "crypto", difficulty: "medium", points: 100, description: "Décodez : VkZGSGUxcG9SazVWYlZaMFdWVlNURlV5ZUV0Vw==", hint: "Plusieurs couches de Base64", flag: "FLAG{base64_recursion}", solved: false, attempts: 0 },
  { id: "crypto_3", title: "RSA Cracker", category: "crypto", difficulty: "hard", points: 150, description: "Cassez cette clé RSA faible (n=143, e=7)", hint: "Factorisez n pour trouver p et q", flag: "FLAG{rsa_weak_key}", solved: false, attempts: 0 },
  
  // Web Hacking (3)
  { id: "web_1", title: "Hidden Admin", category: "web", difficulty: "easy", points: 50, description: "Trouvez la page d'administration cachée", hint: "Essayez /admin, /dashboard, robots.txt", flag: "FLAG{admin_panel_found}", solved: false, attempts: 0 },
  { id: "web_2", title: "SQL Injection", category: "web", difficulty: "medium", points: 100, description: "Exploitez la vulnérabilité SQL pour vous connecter", hint: "' OR '1'='1' --", flag: "FLAG{sql_injection_success}", solved: false, attempts: 0 },
  { id: "web_3", title: "XSS Master", category: "web", difficulty: "hard", points: 150, description: "Volez le cookie d'admin via XSS", hint: "<script>alert(document.cookie)</script>", flag: "FLAG{xss_cookie_theft}", solved: false, attempts: 0 },
];

/* =====================================================
   LEADERBOARD PLAYERS (données statiques)
===================================================== */
export interface LeaderboardPlayer {
  rank: number;
  username: string;
  xp: number;
  solved: number;
  streak: number;
  level: string;
  country: string;
  lastActivityDate: Date;
  joinDate: Date;
}

export const LEADERBOARD_PLAYERS: LeaderboardPlayer[] = [
  // Actifs cette semaine (< 7 jours)
  { rank: 1,  username: "n3t_ninja",      xp: 2840, solved: 11, streak: 45, level: "Zero Day Master", country: "🇫🇷", lastActivityDate: new Date("2026-03-10"), joinDate: new Date("2025-10-15") },
  { rank: 2,  username: "0xd34db33f",     xp: 2210, solved: 11, streak: 30, level: "Zero Day Master", country: "🇩🇪", lastActivityDate: new Date("2026-03-09"), joinDate: new Date("2025-11-01") },
  { rank: 3,  username: "ghost_shell",    xp: 1750, solved: 10, streak: 22, level: "Cyber Ninja",     country: "🇺🇸", lastActivityDate: new Date("2026-03-08"), joinDate: new Date("2025-12-05") },
  
  // Actifs ce mois (7-30 jours)
  { rank: 4,  username: "cyb3r_witch",    xp: 1420, solved: 9,  streak: 15, level: "Cyber Ninja",     country: "🇧🇷", lastActivityDate: new Date("2026-03-01"), joinDate: new Date("2025-11-20") },
  { rank: 5,  username: "root_access",    xp: 1180, solved: 8,  streak: 12, level: "Cyber Ninja",     country: "🇬🇧", lastActivityDate: new Date("2026-02-28"), joinDate: new Date("2025-12-10") },
  { rank: 6,  username: "ph4nt0m",        xp: 980,  solved: 7,  streak: 8,  level: "Elite Hacker",   country: "🇯🇵", lastActivityDate: new Date("2026-02-25"), joinDate: new Date("2026-01-05") },
  
  // Inactifs (> 30 jours)
  { rank: 7,  username: "void_walker",    xp: 820,  solved: 6,  streak: 6,  level: "Elite Hacker",   country: "🇳🇱", lastActivityDate: new Date("2026-02-01"), joinDate: new Date("2025-11-15") },
  { rank: 8,  username: "b1t_crusher",    xp: 650,  solved: 5,  streak: 5,  level: "Elite Hacker",   country: "🇨🇦", lastActivityDate: new Date("2026-01-20"), joinDate: new Date("2025-12-01") },
  { rank: 9,  username: "xpl0it3r",       xp: 490,  solved: 4,  streak: 4,  level: "Hacker",         country: "🇪🇸", lastActivityDate: new Date("2026-01-10"), joinDate: new Date("2025-11-25") },
  { rank: 10, username: "anon_8472",      xp: 320,  solved: 3,  streak: 3,  level: "Hacker",         country: "🇸🇪", lastActivityDate: new Date("2025-12-25"), joinDate: new Date("2025-10-20") },
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
  const { user, token } = useAuth();
  const [gameState, setGameState] = useState<GameState>(() =>
    loadFromStorage(STORAGE_KEY, DEFAULT_GAME_STATE)
  );
  const [challenges, setChallenges] = useState<CTFChallenge[]>(() =>
    loadFromStorage(CHALLENGES_KEY, CTF_CHALLENGES)
  );
  const [recentNotification, setRecentNotification] = useState<
    { message: string; type: "success" | "badge" | "level" } | null
  >(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isLoadedFromAPI, setIsLoadedFromAPI] = useState(false); // 🔥 NOUVEAU FLAG

  // ✨ NOUVELLE FONCTION : Sauvegarder dans l'API
  const saveToAPI = async (state: GameState) => {
    if (!user || !token || !isLoadedFromAPI) return; // 🔥 Ne sauvegarde PAS avant le chargement initial
    
    try {
      const response = await fetch(`${API_URL}/game/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          xp: state.xp,
          level: state.level,
          streak: state.streak,
          longestStreak: state.longestStreak,
          lastActivity: state.lastActivity,
          solvedChallenges: state.solvedChallenges
        })
      });

      if (!response.ok) {
        console.error("Erreur sauvegarde API:", response.status);
      } else {
        console.log("✅ Progression sauvegardée dans l'API");
      }
    } catch (error) {
      console.error("Erreur réseau sauvegarde API:", error);
    }
  };

  // ✨ NOUVELLE FONCTION : Charger depuis l'API
  const loadFromAPI = async () => {
    if (!user || !token) return;
    
    setIsSyncing(true);
    try {
      const response = await fetch(`${API_URL}/game/load`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.ok) {
        const { success, data } = await response.json();
        
        if (success && data.progress) {
          const apiState: GameState = {
            xp: data.progress.xp || 0,
            level: data.progress.level || 0,
            levelName: getLevelInfo(data.progress.xp || 0).name,
            streak: data.progress.streak || 0,
            longestStreak: data.progress.longest_streak || 0,
            lastActivity: data.progress.last_activity,
            activityCalendar: gameState.activityCalendar,
            badges: gameState.badges,
            solvedChallenges: data.solvedChallenges || [],
            totalAttempts: gameState.totalAttempts,
            rank: gameState.rank
          };

          setGameState(apiState);
          saveToStorage(STORAGE_KEY, apiState);
          setIsLoadedFromAPI(true); // 🔥 ACTIVER la sauvegarde API maintenant
          
          // 🔥 NOUVEAU : Charger l'avatar depuis l'API
          if (data.preferences && data.preferences.avatar && user) {
            const avatarData = data.preferences.avatar;
            if (avatarData.startsWith('image:')) {
              // Image custom
              const imageBase64 = avatarData.replace('image:', '');
              localStorage.setItem(`avatar_type_${user.username}`, "image");
              localStorage.setItem(`avatar_image_${user.username}`, imageBase64);
              localStorage.setItem(`avatar_${user.username}`, "custom");
            } else {
              // Emoji
              localStorage.setItem(`avatar_type_${user.username}`, "emoji");
              localStorage.setItem(`avatar_${user.username}`, avatarData);
              localStorage.removeItem(`avatar_image_${user.username}`);
            }
            console.log("✅ Avatar chargé depuis l'API");
          }
          
          console.log("✅ Progression chargée depuis l'API");
        } else {
          // Pas de données dans l'API → nouveau compte
          setIsLoadedFromAPI(true); // 🔥 Activer quand même pour pouvoir sauvegarder
          console.log("ℹ️ Aucune progression dans l'API, nouvel utilisateur");
        }
      }
    } catch (error) {
      console.error("Erreur chargement API:", error);
    } finally {
      setIsSyncing(false);
    }
  };

  // Charger depuis l'API au login
  useEffect(() => {
    if (user && token) {
      loadFromAPI();
    }
  }, [user, token]);

  // Auto-save vers l'API toutes les 30 secondes
  useEffect(() => {
    if (!user || !token) return;

    const interval = setInterval(() => {
      if (!isSyncing) {
        saveToAPI(gameState);
      }
    }, AUTO_SAVE_INTERVAL);

    return () => clearInterval(interval);
  }, [user, token, gameState, isSyncing]);

  // Sauvegarder dans localStorage à chaque changement
  useEffect(() => { saveToStorage(STORAGE_KEY, gameState); }, [gameState]);
  useEffect(() => { saveToStorage(CHALLENGES_KEY, challenges); }, [challenges]);

  const showNotification = (message: string, type: "success" | "badge" | "level") => {
    setRecentNotification({ message, type });
    setTimeout(() => setRecentNotification(null), 4000);
  };

  const clearNotification = () => setRecentNotification(null);

  // Vérifier et débloquer les badges
  const checkBadges = (state: GameState, updatedChallenges: CTFChallenge[]) => {
    let newBadges = [...state.badges];
    let xpGained = 0;

    const osintSolved = updatedChallenges.filter(c => c.category === "osint" && c.solved).length;
    const cryptoSolved = updatedChallenges.filter(c => c.category === "crypto" && c.solved).length;
    const webSolved = updatedChallenges.filter(c => c.category === "web" && c.solved).length;
    const totalSolved = state.solvedChallenges.length;

    // Badges à vérifier
    const badgeChecks = [
      { id: "first_blood", condition: totalSolved >= 1 },
      { id: "osint_rookie", condition: osintSolved >= 1 },
      { id: "crypto_rookie", condition: cryptoSolved >= 1 },
      { id: "web_rookie", condition: webSolved >= 1 },
      { id: "streak_3", condition: state.streak >= 3 },
      { id: "osint_adept", condition: osintSolved >= 3 },
      { id: "crypto_adept", condition: cryptoSolved >= 3 },
      { id: "web_adept", condition: webSolved >= 3 },
      { id: "streak_7", condition: state.streak >= 7 },
      { id: "solver_5", condition: totalSolved >= 5 },
      { id: "all_osint", condition: osintSolved === 5 },
      { id: "all_crypto", condition: cryptoSolved === 3 },
      { id: "all_web", condition: webSolved === 3 },
      { id: "streak_30", condition: state.streak >= 30 },
      { id: "solver_10", condition: totalSolved >= 10 },
      { id: "all_ctf", condition: totalSolved === 11 },
      { id: "elite_level", condition: state.xp >= 600 },
      { id: "zero_day", condition: state.xp >= 2000 },
    ];

    badgeChecks.forEach(({ id, condition }) => {
      const badgeIndex = newBadges.findIndex(b => b.id === id);
      if (badgeIndex !== -1 && !newBadges[badgeIndex].unlocked && condition) {
        newBadges[badgeIndex] = {
          ...newBadges[badgeIndex],
          unlocked: true,
          unlockedAt: new Date().toISOString()
        };
        xpGained += newBadges[badgeIndex].xpReward;
        showNotification(
          `🎖️ Badge débloqué : ${newBadges[badgeIndex].name} (+${newBadges[badgeIndex].xpReward} XP)`,
          "badge"
        );
      }
    });

    return { newBadges, xpGained };
  };

  const submitFlag = (challengeId: string, flag: string) => {
    const challenge = challenges.find(c => c.id === challengeId);
    if (!challenge) return { success: false, message: "Défi introuvable" };

    if (challenge.solved) {
      return { success: false, message: "Défi déjà résolu" };
    }

    const updatedChallenges = challenges.map(c =>
      c.id === challengeId ? { ...c, attempts: c.attempts + 1 } : c
    );
    setChallenges(updatedChallenges);

    if (flag.trim() === challenge.flag) {
      const solvedChallenge = {
        ...challenge,
        solved: true,
        solvedAt: new Date().toISOString()
      };

      const newChallenges = challenges.map(c =>
        c.id === challengeId ? solvedChallenge : c
      );
      setChallenges(newChallenges);

      const newState = {
        ...gameState,
        xp: gameState.xp + challenge.points,
        solvedChallenges: [...gameState.solvedChallenges, challengeId],
        totalAttempts: gameState.totalAttempts + 1
      };

      const { newBadges, xpGained } = checkBadges(newState, newChallenges);
      const finalXP = newState.xp + xpGained;
      const oldLevel = getLevelInfo(gameState.xp);
      const newLevel = getLevelInfo(finalXP);

      const finalState = {
        ...newState,
        xp: finalXP,
        level: LEVELS.indexOf(newLevel),
        levelName: newLevel.name,
        badges: newBadges
      };

      setGameState(finalState);

      // ✨ Sauvegarder immédiatement dans l'API
      saveToAPI(finalState);

      if (newLevel.min > oldLevel.min) {
        showNotification(`🎉 Level Up ! Vous êtes maintenant ${newLevel.name}`, "level");
      }

      showNotification(`✅ Flag correct ! +${challenge.points + xpGained} XP`, "success");

      return {
        success: true,
        message: "Flag correct !",
        xpGained: challenge.points + xpGained
      };
    }

    showNotification("❌ Flag incorrect", "success");
    return { success: false, message: "Flag incorrect" };
  };

  const useHint = (challengeId: string) => {
    const newState = {
      ...gameState,
      xp: Math.max(0, gameState.xp - 5)
    };
    setGameState(newState);
    showNotification("💡 Indice débloqué (-5 XP)", "success");
  };

  const addXP = (amount: number, reason: string) => {
    const newXP = gameState.xp + amount;
    const oldLevel = getLevelInfo(gameState.xp);
    const newLevel = getLevelInfo(newXP);

    const newState = {
      ...gameState,
      xp: newXP,
      level: LEVELS.indexOf(newLevel),
      levelName: newLevel.name
    };

    setGameState(newState);

    // ✨ Sauvegarder dans l'API
    saveToAPI(newState);

    if (newLevel.min > oldLevel.min) {
      showNotification(`🎉 Level Up ! Vous êtes maintenant ${newLevel.name}`, "level");
    }

    showNotification(`⭐ +${amount} XP : ${reason}`, "success");
  };

  const checkAndUpdateStreak = () => {
    const today = new Date().toISOString().split("T")[0];
    const lastActivity = gameState.lastActivity;

    if (!lastActivity) {
      const newState = {
        ...gameState,
        streak: 1,
        longestStreak: Math.max(1, gameState.longestStreak),
        lastActivity: today,
        activityCalendar: { ...gameState.activityCalendar, [today]: 1 }
      };
      setGameState(newState);
      saveToAPI(newState);
      return;
    }

    const lastDate = new Date(lastActivity);
    const todayDate = new Date(today);
    const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return;
    } else if (diffDays === 1) {
      const newStreak = gameState.streak + 1;
      const newState = {
        ...gameState,
        streak: newStreak,
        longestStreak: Math.max(newStreak, gameState.longestStreak),
        lastActivity: today,
        activityCalendar: { ...gameState.activityCalendar, [today]: 1 }
      };
      setGameState(newState);
      saveToAPI(newState);
    } else {
      const newState = {
        ...gameState,
        streak: 1,
        lastActivity: today,
        activityCalendar: { ...gameState.activityCalendar, [today]: 1 }
      };
      setGameState(newState);
      saveToAPI(newState);
    }
  };

  return (
    <GameContext.Provider
      value={{
        gameState,
        challenges,
        submitFlag,
        useHint,
        addXP,
        checkAndUpdateStreak,
        recentNotification,
        clearNotification
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within GameProvider");
  }
  return context;
}

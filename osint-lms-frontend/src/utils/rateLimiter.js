// Rate Limiter PERSISTANT avec localStorage
// Survit au refresh de la page

const STORAGE_KEY = 'rate_limit_store';
const MAX_ATTEMPTS = 3;
const BLOCK_DURATION = 15 * 60 * 1000; // 15 minutes
const ATTEMPT_WINDOW = 5 * 60 * 1000;  // 5 minutes

// Charger depuis localStorage
function loadStore() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return new Map();
    
    const data = JSON.parse(stored);
    return new Map(Object.entries(data));
  } catch {
    return new Map();
  }
}

// Sauvegarder dans localStorage
function saveStore(store) {
  try {
    const data = Object.fromEntries(store);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save rate limit store:', error);
  }
}

/**
 * Vérifie si une IP/identifiant peut faire une tentative de login
 */
export function checkRateLimit(identifier) {
  const now = Date.now();
  const store = loadStore();
  const entry = store.get(identifier);

  // Première tentative
  if (!entry) {
    store.set(identifier, {
      attempts: 1,
      lastAttempt: now,
      blockedUntil: null,
    });
    saveStore(store);
    return { allowed: true, remainingAttempts: MAX_ATTEMPTS - 1 };
  }

  // Vérifie si l'utilisateur est bloqué
  if (entry.blockedUntil && now < entry.blockedUntil) {
    const minutesLeft = Math.ceil((entry.blockedUntil - now) / 60000);
    const secondsLeft = Math.ceil((entry.blockedUntil - now) / 1000);
    return {
      allowed: false,
      blockedUntil: entry.blockedUntil,
      minutesLeft,
      secondsLeft,
      message: `Trop de tentatives échouées. Réessayez dans ${minutesLeft} minute${minutesLeft > 1 ? 's' : ''}.`,
    };
  }

  // Si blocage expiré, reset
  if (entry.blockedUntil && now >= entry.blockedUntil) {
    store.set(identifier, {
      attempts: 1,
      lastAttempt: now,
      blockedUntil: null,
    });
    saveStore(store);
    return { allowed: true, remainingAttempts: MAX_ATTEMPTS - 1 };
  }

  // Si la dernière tentative est hors de la fenêtre, reset
  if (now - entry.lastAttempt > ATTEMPT_WINDOW) {
    store.set(identifier, {
      attempts: 1,
      lastAttempt: now,
      blockedUntil: null,
    });
    saveStore(store);
    return { allowed: true, remainingAttempts: MAX_ATTEMPTS - 1 };
  }

  // Incrémente les tentatives
  entry.attempts += 1;
  entry.lastAttempt = now;

  // Si max atteint, bloquer
  if (entry.attempts >= MAX_ATTEMPTS) {
    entry.blockedUntil = now + BLOCK_DURATION;
    store.set(identifier, entry);
    saveStore(store);
    
    const minutesLeft = Math.ceil(BLOCK_DURATION / 60000);
    return {
      allowed: false,
      blockedUntil: entry.blockedUntil,
      minutesLeft,
      secondsLeft: Math.ceil(BLOCK_DURATION / 1000),
      message: `Trop de tentatives échouées (${MAX_ATTEMPTS}). Compte bloqué pendant ${minutesLeft} minutes.`,
    };
  }

  // Encore des tentatives disponibles
  const remaining = MAX_ATTEMPTS - entry.attempts;
  store.set(identifier, entry);
  saveStore(store);
  
  return {
    allowed: true,
    remainingAttempts: remaining,
    showWarning: remaining === 1,
    message: remaining === 1 ? `Attention : ${remaining} tentative restante avant blocage de 15 minutes.` : undefined,
  };
}

/**
 * Reset le rate limit après un login réussi
 */
export function resetRateLimit(identifier) {
  const store = loadStore();
  store.delete(identifier);
  saveStore(store);
}

/**
 * Nettoie les entrées expirées
 */
export function cleanupExpiredEntries() {
  const now = Date.now();
  const store = loadStore();
  let modified = false;
  
  for (const [key, entry] of store.entries()) {
    if (entry.blockedUntil && now > entry.blockedUntil + ATTEMPT_WINDOW) {
      store.delete(key);
      modified = true;
    }
    if (now - entry.lastAttempt > 60 * 60 * 1000) {
      store.delete(key);
      modified = true;
    }
  }
  
  if (modified) {
    saveStore(store);
  }
}

// Nettoyer au chargement
if (typeof window !== 'undefined') {
  cleanupExpiredEntries();
  setInterval(cleanupExpiredEntries, 10 * 60 * 1000);
}

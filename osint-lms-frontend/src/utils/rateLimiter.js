// Rate Limiter pour empêcher les attaques brute force
// Version JavaScript (compatible avec React)

const rateLimitStore = new Map();

// Configuration
const MAX_ATTEMPTS = 3;               // 3 tentatives max
const BLOCK_DURATION = 15 * 60 * 1000; // 15 minutes de blocage
const ATTEMPT_WINDOW = 5 * 60 * 1000;  // Fenêtre de 5 minutes

/**
 * Vérifie si une IP/identifiant peut faire une tentative de login
 */
export function checkRateLimit(identifier) {
  const now = Date.now();
  const entry = rateLimitStore.get(identifier);

  // Première tentative
  if (!entry) {
    rateLimitStore.set(identifier, {
      attempts: 1,
      lastAttempt: now,
      blockedUntil: null,
    });
    return { allowed: true, remainingAttempts: MAX_ATTEMPTS - 1 };
  }

  // Vérifie si l'utilisateur est bloqué
  if (entry.blockedUntil && now < entry.blockedUntil) {
    const blockedUntil = new Date(entry.blockedUntil);
    const minutesLeft = Math.ceil((entry.blockedUntil - now) / 60000);
    return {
      allowed: false,
      blockedUntil,
      message: `⛔ Trop de tentatives échouées. Réessayez dans ${minutesLeft} minute${minutesLeft > 1 ? 's' : ''}.`,
    };
  }

  // Si blocage expiré, reset
  if (entry.blockedUntil && now >= entry.blockedUntil) {
    rateLimitStore.set(identifier, {
      attempts: 1,
      lastAttempt: now,
      blockedUntil: null,
    });
    return { allowed: true, remainingAttempts: MAX_ATTEMPTS - 1 };
  }

  // Si la dernière tentative est hors de la fenêtre, reset
  if (now - entry.lastAttempt > ATTEMPT_WINDOW) {
    rateLimitStore.set(identifier, {
      attempts: 1,
      lastAttempt: now,
      blockedUntil: null,
    });
    return { allowed: true, remainingAttempts: MAX_ATTEMPTS - 1 };
  }

  // Incrémente les tentatives
  entry.attempts += 1;
  entry.lastAttempt = now;

  // Si max atteint, bloquer
  if (entry.attempts >= MAX_ATTEMPTS) {
    entry.blockedUntil = now + BLOCK_DURATION;
    rateLimitStore.set(identifier, entry);
    return {
      allowed: false,
      blockedUntil: new Date(entry.blockedUntil),
      message: `⛔ Trop de tentatives échouées (${MAX_ATTEMPTS}). Compte bloqué pendant 15 minutes.`,
    };
  }

  // Encore des tentatives disponibles
  const remaining = MAX_ATTEMPTS - entry.attempts;
  rateLimitStore.set(identifier, entry);
  return {
    allowed: true,
    remainingAttempts: remaining,
    message: remaining <= 1 ? `⚠️ Attention : ${remaining} tentative restante avant blocage.` : undefined,
  };
}

/**
 * Reset le rate limit après un login réussi
 */
export function resetRateLimit(identifier) {
  rateLimitStore.delete(identifier);
}

/**
 * Nettoie les entrées expirées
 */
export function cleanupExpiredEntries() {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.blockedUntil && now > entry.blockedUntil + ATTEMPT_WINDOW) {
      rateLimitStore.delete(key);
    }
    if (now - entry.lastAttempt > 60 * 60 * 1000) {
      rateLimitStore.delete(key);
    }
  }
}

// Nettoyer toutes les 10 minutes
if (typeof window !== 'undefined') {
  setInterval(cleanupExpiredEntries, 10 * 60 * 1000);
}

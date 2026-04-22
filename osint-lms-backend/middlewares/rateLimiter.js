// middlewares/rateLimiter.js - VERSION SÉCURISÉE
// ✅ Les audit logs sont optionnels

const db = require("../services/neonDatabase");

// ✅ IMPORT SÉCURISÉ
let logAction = null;
let ACTION_TYPES = null;

try {
  const auditLogger = require("../services/auditLogger");
  logAction = auditLogger.logAction;
  ACTION_TYPES = auditLogger.ACTION_TYPES;
} catch (error) {
  console.log("⚠️ Audit logger non disponible dans rateLimiter (optionnel)");
}

// Helper pour logger de manière sécurisée
async function safeLog(username, action, req, details = null) {
  try {
    if (logAction && ACTION_TYPES) {
      await logAction(username, action, req, details);
    }
  } catch (error) {
    console.error("❌ Erreur audit log (non bloquant):", error.message);
  }
}

const ADMIN_EMAIL = "h4ck3r.vaillant@proton.me";
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION_HOURS = 24;

/**
 * Vérifier si un compte est bloqué
 */
async function checkAccountLocked(username, attemptType) {
  try {
    const result = await db.query(
      `SELECT attempts, blocked_until FROM login_attempts
       WHERE username = $1 AND attempt_type = $2`,
      [username, attemptType]
    );

    if (result.rows.length === 0) {
      return { isLocked: false, remainingAttempts: MAX_ATTEMPTS };
    }

    const record = result.rows[0];

    if (record.blocked_until && new Date(record.blocked_until) > new Date()) {
      const unlockTime = new Date(record.blocked_until);
      const hoursRemaining = Math.ceil((unlockTime - new Date()) / (1000 * 60 * 60));

      return {
        isLocked: true,
        unlockTime: unlockTime,
        hoursRemaining: hoursRemaining,
        message: `Compte bloqué. Déblocage dans ${hoursRemaining}h.`
      };
    }

    if (record.blocked_until && new Date(record.blocked_until) <= new Date()) {
      await resetAttempts(username, attemptType);
      return { isLocked: false, remainingAttempts: MAX_ATTEMPTS };
    }

    const remainingAttempts = MAX_ATTEMPTS - record.attempts;
    return { isLocked: false, remainingAttempts: remainingAttempts };

  } catch (error) {
    console.error("Erreur checkAccountLocked:", error);
    return { isLocked: false, remainingAttempts: MAX_ATTEMPTS };
  }
}

/**
 * Enregistrer une tentative échouée
 */
async function recordFailedAttempt(username, attemptType, req = null) {
  try {
    const existing = await db.query(
      `SELECT attempts FROM login_attempts
       WHERE username = $1 AND attempt_type = $2`,
      [username, attemptType]
    );

    let failedCount = 1;

    if (existing.rows.length > 0) {
      failedCount = existing.rows[0].attempts + 1;

      await db.query(
        `UPDATE login_attempts
         SET attempts = $1, last_attempt = NOW()
         WHERE username = $2 AND attempt_type = $3`,
        [failedCount, username, attemptType]
      );
    } else {
      await db.query(
        `INSERT INTO login_attempts (username, attempt_type, attempts, last_attempt)
         VALUES ($1, $2, $3, NOW())`,
        [username, attemptType, failedCount]
      );
    }

    if (failedCount >= MAX_ATTEMPTS) {
      const lockUntil = new Date();
      lockUntil.setHours(lockUntil.getHours() + LOCKOUT_DURATION_HOURS);

      await db.query(
        `UPDATE login_attempts
         SET blocked_until = $1
         WHERE username = $2 AND attempt_type = $3`,
        [lockUntil, username, attemptType]
      );

      // ✅ AUDIT LOG SÉCURISÉ
      if (req) {
        await safeLog(
          username, 
          ACTION_TYPES?.ACCOUNT_BLOCKED, 
          req, 
          `Blocked after ${failedCount} failed ${attemptType} attempts`
        );
      }

      await notifyAdmin(username, attemptType, failedCount);

      return {
        isLocked: true,
        message: `Compte bloqué pour 24h après ${MAX_ATTEMPTS} tentatives échouées.`
      };
    }

    const remainingAttempts = MAX_ATTEMPTS - failedCount;
    return {
      isLocked: false,
      remainingAttempts: remainingAttempts,
      message: `Tentative échouée. ${remainingAttempts} tentatives restantes.`
    };

  } catch (error) {
    console.error("Erreur recordFailedAttempt:", error);
    return { isLocked: false, remainingAttempts: MAX_ATTEMPTS };
  }
}

/**
 * Réinitialiser les tentatives
 */
async function resetAttempts(username, attemptType) {
  try {
    await db.query(
      `DELETE FROM login_attempts
       WHERE username = $1 AND attempt_type = $2`,
      [username, attemptType]
    );
    console.log(`✅ Tentatives réinitialisées pour ${username} (${attemptType})`);
  } catch (error) {
    console.error("Erreur resetAttempts:", error);
  }
}

/**
 * Notifier l'admin
 */
async function notifyAdmin(username, attemptType, failedCount) {
  try {
    console.log(`🚨 ALERTE: Compte ${username} bloqué après ${failedCount} tentatives (${attemptType})`);
    // Web3Forms optionnel (nécessite node-fetch)
  } catch (error) {
    console.error("❌ Erreur notifyAdmin:", error);
  }
}

module.exports = {
  checkAccountLocked,
  recordFailedAttempt,
  resetAttempts
};

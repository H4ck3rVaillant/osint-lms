// middlewares/rateLimiter.js
const db = require("../services/neonDatabase");

// Configuration email (Cyber_Admin)
const ADMIN_EMAIL = "h4ck3r.vaillant@proton.me"; // À MODIFIER
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
    
    // Vérifier si le compte est actuellement bloqué
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

    // Si le délai de blocage est passé, réinitialiser
    if (record.blocked_until && new Date(record.blocked_until) <= new Date()) {
      await resetAttempts(username, attemptType);
      return { isLocked: false, remainingAttempts: MAX_ATTEMPTS };
    }

    // Compte pas bloqué mais a des tentatives échouées
    const remainingAttempts = MAX_ATTEMPTS - record.attempts;
    return { isLocked: false, remainingAttempts: remainingAttempts };

  } catch (error) {
    console.error("Erreur checkAccountLocked:", error);
    // En cas d'erreur, on laisse passer (fail-open)
    return { isLocked: false, remainingAttempts: MAX_ATTEMPTS };
  }
}

/**
 * Enregistrer une tentative échouée
 */
async function recordFailedAttempt(username, attemptType) {
  try {
    // Vérifier si un enregistrement existe
    const existing = await db.query(
      `SELECT attempts FROM login_attempts 
       WHERE username = $1 AND attempt_type = $2`,
      [username, attemptType]
    );

    let failedCount = 1;

    if (existing.rows.length > 0) {
      // Incrémenter le compteur
      failedCount = existing.rows[0].attempts + 1;
      
      await db.query(
        `UPDATE login_attempts 
         SET attempts = $1, last_attempt = NOW() 
         WHERE username = $2 AND attempt_type = $3`,
        [failedCount, username, attemptType]
      );
    } else {
      // Créer un nouvel enregistrement
      await db.query(
        `INSERT INTO login_attempts (username, attempt_type, attempts, last_attempt) 
         VALUES ($1, $2, $3, NOW())`,
        [username, attemptType, failedCount]
      );
    }

    // Si on atteint MAX_ATTEMPTS, bloquer le compte
    if (failedCount >= MAX_ATTEMPTS) {
      const lockUntil = new Date();
      lockUntil.setHours(lockUntil.getHours() + LOCKOUT_DURATION_HOURS);

      await db.query(
        `UPDATE login_attempts 
         SET blocked_until = $1 
         WHERE username = $2 AND attempt_type = $3`,
        [lockUntil, username, attemptType]
      );

      // Notifier l'admin
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
 * Réinitialiser les tentatives (après succès ou déblocage)
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
 * Notifier l'admin par email
 */
async function notifyAdmin(username, attemptType, failedCount) {
  try {
    console.log(`🚨 ALERTE: Compte ${username} bloqué après ${failedCount} tentatives (${attemptType})`);

    // TODO: Configurer Nodemailer ou Web3Forms
    // Option 1: Nodemailer (si SMTP configuré)
    /*
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: "h4ck3r.vaillant@proton.me",
      to: ADMIN_EMAIL,
      subject: `🚨 Alerte Sécurité: Compte bloqué`,
      text: `Le compte "${username}" a été bloqué après ${failedCount} tentatives échouées de ${attemptType}.
      
Détails:
- Username: ${username}
- Type: ${attemptType}
- Tentatives: ${failedCount}
- Bloqué jusqu'à: ${new Date(Date.now() + LOCKOUT_DURATION_HOURS * 60 * 60 * 1000).toLocaleString()}

Action requise: Vérifier l'activité suspecte.`
    });
    */

    // Option 2: Web3Forms (simple)
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        access_key: process.env.WEB3FORMS_KEY || "YOUR_WEB3FORMS_KEY",
        subject: "🚨 Alerte Sécurité: Compte bloqué",
        from_name: "CyberOSINT Security",
        email: ADMIN_EMAIL,
        message: `Le compte "${username}" a été bloqué après ${failedCount} tentatives échouées de ${attemptType}.`
      })
    });

    if (response.ok) {
      console.log("✅ Notification envoyée à l'admin");
    }

  } catch (error) {
    console.error("Erreur notifyAdmin:", error);
    // Ne pas bloquer le processus si la notification échoue
  }
}

module.exports = {
  checkAccountLocked,
  recordFailedAttempt,
  resetAttempts
};

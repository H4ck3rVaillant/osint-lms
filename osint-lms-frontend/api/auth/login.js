const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { getUserByUsername, updateLastLogin } = require("../_lib/database");
const { Pool } = require("pg");

// Pool PostgreSQL pour login_attempts
let pool;
function getPool() {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    });
  }
  return pool;
}

const MAX_ATTEMPTS = 3;
const BLOCK_DURATION = 15 * 60 * 1000; // 15 minutes en ms

module.exports = async (req, res) => {
  // CORS
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  res.setHeader("Access-Control-Allow-Headers", "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization");
  
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ message: "Champs manquants" });
  }
  
  try {
    const dbPool = getPool();
    const now = new Date();

    // ✅ VÉRIFIER LES TENTATIVES DANS NEON
    const attemptsResult = await dbPool.query(
      'SELECT attempts, blocked_until FROM login_attempts WHERE username = $1',
      [username]
    );

    let attempts = 0;
    let blockedUntil = null;

    if (attemptsResult.rows.length > 0) {
      attempts = attemptsResult.rows[0].attempts;
      blockedUntil = attemptsResult.rows[0].blocked_until;
    }

    // ✅ SI BLOQUÉ, VÉRIFIER SI LE BLOCAGE EST ENCORE ACTIF
    if (blockedUntil && new Date(blockedUntil) > now) {
      const secondsLeft = Math.ceil((new Date(blockedUntil) - now) / 1000);
      const minutesLeft = Math.ceil(secondsLeft / 60);
      
      return res.status(429).json({
        message: `Trop de tentatives échouées. Réessayez dans ${minutesLeft} minute${minutesLeft > 1 ? 's' : ''}.`,
        blocked: true,
        secondsLeft,
        minutesLeft
      });
    }

    // ✅ SI BLOCAGE EXPIRÉ, RESET
    if (blockedUntil && new Date(blockedUntil) <= now) {
      await dbPool.query(
        'UPDATE login_attempts SET attempts = 0, blocked_until = NULL WHERE username = $1',
        [username]
      );
      attempts = 0;
    }

    // ✅ VÉRIFIER L'UTILISATEUR
    const user = await getUserByUsername(username);
    
    if (!user) {
      // Incrémenter tentatives
      await incrementAttempts(dbPool, username, attempts);
      return res.status(401).json({ 
        message: "Identifiants invalides",
        remainingAttempts: Math.max(0, MAX_ATTEMPTS - attempts - 1)
      });
    }

    // ✅ VÉRIFIER SI BLOQUÉ (colonne users.blocked)
    if (user.blocked) {
      return res.status(403).json({ message: "Compte bloqué. Contactez l'administrateur." });
    }
    
    // ✅ VÉRIFIER LE MOT DE PASSE
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      // Incrémenter tentatives
      const newAttempts = await incrementAttempts(dbPool, username, attempts);
      const remaining = Math.max(0, MAX_ATTEMPTS - newAttempts);
      
      return res.status(401).json({ 
        message: "Identifiants invalides",
        remainingAttempts: remaining,
        showWarning: remaining === 1
      });
    }

    // ✅ LOGIN RÉUSSI - RESET LES TENTATIVES
    await dbPool.query(
      'DELETE FROM login_attempts WHERE username = $1',
      [username]
    );

    // Mettre à jour last_login
    try {
      await updateLastLogin(user.id);
    } catch (updateError) {
      console.warn('Failed to update last_login:', updateError);
    }
    
    // Token temporaire pour 2FA
    const tempToken = jwt.sign(
      { id: user.id, username: user.username, step: "awaiting_2fa" },
      process.env.JWT_SECRET,
      { expiresIn: "5m" }
    );
    
    res.json({
      message: "Mot de passe correct. Veuillez entrer votre code 2FA.",
      tempToken,
      requires2FA: true
    });
    
  } catch (error) {
    console.error("Erreur lors du login:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Fonction pour incrémenter les tentatives
async function incrementAttempts(dbPool, username, currentAttempts) {
  const newAttempts = currentAttempts + 1;
  const now = new Date();
  
  if (newAttempts >= MAX_ATTEMPTS) {
    // Bloquer pour 15 minutes
    const blockedUntil = new Date(now.getTime() + BLOCK_DURATION);
    
    await dbPool.query(`
      INSERT INTO login_attempts (username, attempts, last_attempt, blocked_until)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (username) 
      DO UPDATE SET attempts = $2, last_attempt = $3, blocked_until = $4
    `, [username, newAttempts, now, blockedUntil]);
  } else {
    await dbPool.query(`
      INSERT INTO login_attempts (username, attempts, last_attempt)
      VALUES ($1, $2, $3)
      ON CONFLICT (username) 
      DO UPDATE SET attempts = $2, last_attempt = $3
    `, [username, newAttempts, now]);
  }
  
  return newAttempts;
}

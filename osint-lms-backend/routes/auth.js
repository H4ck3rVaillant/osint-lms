// routes/auth.js - VERSION SÉCURISÉE
// ✅ Les audit logs sont optionnels - si erreur, la route fonctionne quand même

const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const speakeasy = require("speakeasy");
const QRCode = require("qrcode");
const db = require("../services/neonDatabase");
const { checkAccountLocked, recordFailedAttempt, resetAttempts } = require("../middlewares/rateLimiter");

const router = express.Router();

// ✅ IMPORT SÉCURISÉ : Ne crash pas si auditLogger absent
let logAction = null;
let ACTION_TYPES = null;

try {
  const auditLogger = require("../services/auditLogger");
  logAction = auditLogger.logAction;
  ACTION_TYPES = auditLogger.ACTION_TYPES;
} catch (error) {
  console.log("⚠️ Audit logger non disponible (optionnel)");
}

// Helper pour logger de manière sécurisée
async function safeLog(username, action, req, details = null) {
  try {
    if (logAction && ACTION_TYPES) {
      await logAction(username, action, req, details);
    }
  } catch (error) {
    // Ne pas bloquer si le logging échoue
    console.error("❌ Erreur audit log (non bloquant):", error.message);
  }
}

/* ====================================
   POST /auth/register
==================================== */
router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const role = "user";

  if (!username || !password) {
    return res.status(400).json({ error: "Username et password requis" });
  }

  try {
    const existingUser = await db.query(
      "SELECT * FROM utilisateurs WHERE username = $1",
      [username]
    );

    if (existingUser.rows.length > 0) {
      await safeLog(null, ACTION_TYPES?.REGISTER, req, `Failed: Username ${username} already exists`);
      return res.status(400).json({ error: "Nom d'utilisateur déjà pris" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      "INSERT INTO utilisateurs (username, password, role) VALUES ($1, $2, $3)",
      [username, hashedPassword, role]
    );

    await safeLog(username, ACTION_TYPES?.REGISTER, req, "Account created successfully");

    res.status(201).json({ 
      success: true,
      message: "Utilisateur créé avec succès" 
    });

  } catch (error) {
    console.error("Erreur lors de l'inscription:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

/* ====================================
   POST /auth/login
==================================== */
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username et password requis" });
  }

  try {
    const lockStatus = await checkAccountLocked(username, "password");
    
    if (lockStatus.isLocked) {
      await safeLog(username, ACTION_TYPES?.LOGIN_FAILED, req, `Account locked until ${lockStatus.unlockTime}`);
      
      return res.status(429).json({
        error: "Trop de tentatives échouées",
        message: lockStatus.message,
        unlockTime: lockStatus.unlockTime
      });
    }

    const result = await db.query(
      "SELECT * FROM utilisateurs WHERE username = $1",
      [username]
    );

    if (result.rows.length === 0) {
      await recordFailedAttempt(username, "password");
      await safeLog(username, ACTION_TYPES?.LOGIN_FAILED, req, "User not found");
      
      return res.status(401).json({ error: "Identifiants invalides" });
    }

    const user = result.rows[0];

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      await recordFailedAttempt(username, "password");
      await safeLog(username, ACTION_TYPES?.LOGIN_FAILED, req, "Invalid password");
      
      return res.status(401).json({ error: "Identifiants invalides" });
    }

    await resetAttempts(username, "password");

    await db.query(
      "UPDATE utilisateurs SET last_login = NOW() WHERE id = $1",
      [user.id]
    );

    if (user.totp_secret) {
      await safeLog(username, "LOGIN_PARTIAL", req, "Waiting for 2FA verification");
      
      const response = {
        success: true,
        requires2FA: true,
        tempToken: username,  // ✅ AJOUT du tempToken
        userId: user.id,
        username: user.username
      };
      
      console.log("🔵 RESPONSE (2FA required):", JSON.stringify(response));
      return res.json(response);
    }

    const token = jwt.sign(
      { userId: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    await safeLog(username, ACTION_TYPES?.LOGIN_SUCCESS, req, null);

    const response = {
      success: true,
      token: token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    };
    
    console.log("🔵 RESPONSE (login complete):", JSON.stringify(response));
    res.json(response);

  } catch (error) {
    console.error("Erreur lors de la connexion:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

/* ====================================
   POST /auth/verify-2fa
==================================== */
router.post("/verify-2fa", async (req, res) => {
  const { username, token } = req.body;

  if (!username || !token) {
    return res.status(400).json({ error: "Username et token requis" });
  }

  try {
    const lockStatus = await checkAccountLocked(username, "2fa");
    
    if (lockStatus.isLocked) {
      await safeLog(username, ACTION_TYPES?.VERIFY_2FA_FAILED, req, `Account locked until ${lockStatus.unlockTime}`);
      
      return res.status(429).json({
        error: "Trop de tentatives échouées",
        message: lockStatus.message,
        unlockTime: lockStatus.unlockTime
      });
    }

    const result = await db.query(
      "SELECT * FROM utilisateurs WHERE username = $1",
      [username]
    );

    if (result.rows.length === 0) {
      await safeLog(username, ACTION_TYPES?.VERIFY_2FA_FAILED, req, "User not found");
      return res.status(401).json({ error: "Utilisateur non trouvé" });
    }

    const user = result.rows[0];

    if (!user.totp_secret) {
      return res.status(400).json({ error: "2FA non activé pour cet utilisateur" });
    }

    const isValid = speakeasy.totp.verify({
      secret: user.totp_secret,
      encoding: "base32",
      token: token,
      window: 2
    });

    if (!isValid) {
      await recordFailedAttempt(username, "2fa");
      await safeLog(username, ACTION_TYPES?.VERIFY_2FA_FAILED, req, "Invalid 2FA code");
      
      return res.status(401).json({ error: "Code 2FA invalide" });
    }

    await resetAttempts(username, "2fa");

    const jwtToken = jwt.sign(
      { userId: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    await safeLog(username, ACTION_TYPES?.VERIFY_2FA_SUCCESS, req, null);

    res.json({
      success: true,
      token: jwtToken,
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    });

  } catch (error) {
    console.error("Erreur lors de la vérification 2FA:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

/* ====================================
   POST /auth/setup-2fa
==================================== */
router.post("/setup-2fa", async (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ error: "Username requis" });
  }

  try {
    const result = await db.query(
      "SELECT * FROM utilisateurs WHERE username = $1",
      [username]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    const user = result.rows[0];

    const secret = speakeasy.generateSecret({
      name: `CyberOSINT (${username})`,
    });

    await db.query(
      "UPDATE utilisateurs SET totp_secret = $1 WHERE id = $2",
      [secret.base32, user.id]
    );

    const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url);

    await safeLog(username, ACTION_TYPES?.ENABLE_2FA, req, null);

    res.json({
      success: true,
      secret: secret.base32,
      qrCode: qrCodeUrl,
    });
  } catch (error) {
    console.error("Erreur lors de la configuration 2FA:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

/* ====================================
   POST /auth/disable-2fa
==================================== */
router.post("/disable-2fa", async (req, res) => {
  const { username, token } = req.body;

  if (!username || !token) {
    return res.status(400).json({ error: "Username et token requis" });
  }

  try {
    const result = await db.query(
      "SELECT * FROM utilisateurs WHERE username = $1",
      [username]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    const user = result.rows[0];

    if (!user.totp_secret) {
      return res.status(400).json({ error: "2FA non activé" });
    }

    const isValid = speakeasy.totp.verify({
      secret: user.totp_secret,
      encoding: "base32",
      token: token,
      window: 2,
    });

    if (!isValid) {
      return res.status(401).json({ error: "Code 2FA invalide" });
    }

    await db.query(
      "UPDATE utilisateurs SET totp_secret = NULL WHERE id = $1",
      [user.id]
    );

    await safeLog(username, ACTION_TYPES?.DISABLE_2FA, req, null);

    res.json({
      success: true,
      message: "2FA désactivé avec succès",
    });
  } catch (error) {
    console.error("Erreur lors de la désactivation 2FA:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

module.exports = router;

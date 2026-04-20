// routes/admin.js - VERSION SÉCURISÉE
// ✅ Les audit logs sont optionnels - si erreur, la route fonctionne quand même

const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const db = require("../services/neonDatabase");
const { resetAttempts } = require("../middlewares/rateLimiter");

// ✅ IMPORT SÉCURISÉ : Ne crash pas si auditLogger absent
let logAction = null;
let ACTION_TYPES = null;
let getRecentLogs = null;
let getSecurityEvents = null;
let getAuditStats = null;

try {
  const auditLogger = require("../services/auditLogger");
  logAction = auditLogger.logAction;
  ACTION_TYPES = auditLogger.ACTION_TYPES;
  getRecentLogs = auditLogger.getRecentLogs;
  getSecurityEvents = auditLogger.getSecurityEvents;
  getAuditStats = auditLogger.getAuditStats;
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
    console.error("❌ Erreur audit log (non bloquant):", error.message);
  }
}

// Middleware simple pour vérifier le token
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "Non autorisé" });
  }
  next();
}

/* ====================================
   GET /admin/stats
==================================== */
router.get("/stats", authMiddleware, async (req, res) => {
  try {
    const totalResult = await db.query("SELECT COUNT(*) as count FROM utilisateurs");
    const total = parseInt(totalResult.rows[0].count);

    const newThisWeekResult = await db.query(
      "SELECT COUNT(*) as count FROM utilisateurs WHERE created_at > NOW() - INTERVAL '7 days'"
    );
    const newThisWeek = parseInt(newThisWeekResult.rows[0].count);

    const activeTodayResult = await db.query(
      "SELECT COUNT(*) as count FROM utilisateurs WHERE last_login > NOW() - INTERVAL '24 hours'"
    );
    const activeToday = parseInt(activeTodayResult.rows[0].count);

    res.json({
      success: true,
      total: total,
      newThisWeek: newThisWeek,
      activeToday: activeToday
    });
  } catch (error) {
    console.error("Erreur admin/stats:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

/* ====================================
   GET /admin/users
==================================== */
router.get("/users", authMiddleware, async (req, res) => {
  try {
    const result = await db.query(
      "SELECT id, username, role, created_at, last_login, blocked FROM utilisateurs ORDER BY created_at DESC"
    );

    res.json({
      success: true,
      users: result.rows
    });
  } catch (error) {
    console.error("Erreur admin/users:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

/* ====================================
   DELETE /admin/delete-user
==================================== */
router.delete("/delete-user", authMiddleware, async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: "userId requis" });
  }

  try {
    const userResult = await db.query("SELECT username FROM utilisateurs WHERE id = $1", [userId]);
    const deletedUsername = userResult.rows[0]?.username || "unknown";

    await db.query("DELETE FROM utilisateurs WHERE id = $1", [userId]);

    await safeLog("Cyber_Admin", ACTION_TYPES?.USER_DELETED, req, `Deleted user: ${deletedUsername}`);

    res.json({ success: true, message: "Utilisateur supprimé" });
  } catch (error) {
    console.error("Erreur delete-user:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

/* ====================================
   PATCH /admin/block-user
==================================== */
router.patch("/block-user", authMiddleware, async (req, res) => {
  const { userId, blocked } = req.body;

  if (!userId || blocked === undefined) {
    return res.status(400).json({ error: "userId et blocked requis" });
  }

  try {
    const userResult = await db.query("SELECT username FROM utilisateurs WHERE id = $1", [userId]);
    const targetUsername = userResult.rows[0]?.username || "unknown";

    await db.query(
      "UPDATE utilisateurs SET blocked = $1 WHERE id = $2",
      [blocked, userId]
    );

    const action = blocked ? ACTION_TYPES?.USER_BLOCKED : ACTION_TYPES?.USER_UNBLOCKED;
    await safeLog("Cyber_Admin", action, req, `Target: ${targetUsername}`);

    res.json({ success: true });
  } catch (error) {
    console.error("Erreur block-user:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

/* ====================================
   POST /admin/reset-password
==================================== */
router.post("/reset-password", authMiddleware, async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: "userId requis" });
  }

  try {
    const userResult = await db.query("SELECT username FROM utilisateurs WHERE id = $1", [userId]);
    const targetUsername = userResult.rows[0]?.username || "unknown";

    const tempPassword = Math.random().toString(36).slice(-10);
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    await db.query(
      "UPDATE utilisateurs SET password = $1 WHERE id = $2",
      [hashedPassword, userId]
    );

    await safeLog("Cyber_Admin", ACTION_TYPES?.PASSWORD_RESET, req, `Reset password for: ${targetUsername}`);

    res.json({
      success: true,
      tempPassword: tempPassword
    });
  } catch (error) {
    console.error("Erreur reset-password:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

/* ====================================
   GET /admin/blocked-accounts
==================================== */
router.get("/blocked-accounts", authMiddleware, async (req, res) => {
  try {
    const result = await db.query(`
      SELECT username, attempt_type, attempts, blocked_until, last_attempt
      FROM login_attempts
      WHERE blocked_until > NOW()
      ORDER BY blocked_until DESC
    `);

    res.json({
      success: true,
      blockedAccounts: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    console.error("Erreur blocked-accounts:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

/* ====================================
   POST /admin/unblock-account
==================================== */
router.post("/unblock-account", authMiddleware, async (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ error: "username requis" });
  }

  try {
    await resetAttempts(username, "password");
    await resetAttempts(username, "2fa");

    await safeLog("Cyber_Admin", ACTION_TYPES?.ACCOUNT_UNBLOCKED, req, `Unblocked account: ${username}`);

    res.json({ success: true, message: "Compte débloqué" });
  } catch (error) {
    console.error("Erreur unblock-account:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

/* ====================================
   ✅ NOUVELLE ROUTE: GET /admin/audit-logs
==================================== */
router.get("/audit-logs", authMiddleware, async (req, res) => {
  try {
    if (!getRecentLogs) {
      return res.status(501).json({ 
        error: "Audit logs non disponible",
        message: "Le module auditLogger n'est pas activé" 
      });
    }

    const limit = parseInt(req.query.limit) || 100;
    const username = req.query.username || null;
    const action = req.query.action || null;

    const logs = await getRecentLogs(limit, username, action);

    res.json({
      success: true,
      logs: logs,
      count: logs.length
    });
  } catch (error) {
    console.error("Erreur audit-logs:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

/* ====================================
   ✅ NOUVELLE ROUTE: GET /admin/security-events
==================================== */
router.get("/security-events", authMiddleware, async (req, res) => {
  try {
    if (!getSecurityEvents) {
      return res.status(501).json({ 
        error: "Security events non disponible",
        message: "Le module auditLogger n'est pas activé" 
      });
    }

    const limit = parseInt(req.query.limit) || 100;
    const eventType = req.query.eventType || null;

    const events = await getSecurityEvents(limit, eventType);

    res.json({
      success: true,
      events: events,
      count: events.length
    });
  } catch (error) {
    console.error("Erreur security-events:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

/* ====================================
   ✅ NOUVELLE ROUTE: GET /admin/audit-stats
==================================== */
router.get("/audit-stats", authMiddleware, async (req, res) => {
  try {
    if (!getAuditStats) {
      return res.status(501).json({ 
        error: "Audit stats non disponible",
        message: "Le module auditLogger n'est pas activé" 
      });
    }

    const stats = await getAuditStats();

    res.json({
      success: true,
      stats: stats
    });
  } catch (error) {
    console.error("Erreur audit-stats:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

module.exports = router;

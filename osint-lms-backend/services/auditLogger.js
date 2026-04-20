// services/auditLogger.js
// Service de logging des actions utilisateurs
// Date : 14 avril 2026

const db = require("./neonDatabase");

/**
 * Types d'actions trackées
 */
const ACTION_TYPES = {
  // Authentification
  LOGIN_SUCCESS: "LOGIN_SUCCESS",
  LOGIN_FAILED: "LOGIN_FAILED",
  LOGOUT: "LOGOUT",
  REGISTER: "REGISTER",
  
  // 2FA
  VERIFY_2FA_SUCCESS: "VERIFY_2FA_SUCCESS",
  VERIFY_2FA_FAILED: "VERIFY_2FA_FAILED",
  ENABLE_2FA: "ENABLE_2FA",
  DISABLE_2FA: "DISABLE_2FA",
  
  // Sécurité
  ACCOUNT_BLOCKED: "ACCOUNT_BLOCKED",
  ACCOUNT_UNBLOCKED: "ACCOUNT_UNBLOCKED",
  PASSWORD_RESET: "PASSWORD_RESET",
  
  // Administration
  USER_DELETED: "USER_DELETED",
  USER_BLOCKED: "USER_BLOCKED",
  USER_UNBLOCKED: "USER_UNBLOCKED",
  
  // Cours
  COURSE_COMPLETED: "COURSE_COMPLETED",
  MODULE_COMPLETED: "MODULE_COMPLETED",
  PROGRESS_SAVED: "PROGRESS_SAVED"
};

/**
 * Logger une action utilisateur
 * @param {string} username - Nom d'utilisateur (null si non authentifié)
 * @param {string} action - Type d'action (utiliser ACTION_TYPES)
 * @param {object} req - Request Express
 * @param {string} details - Détails supplémentaires (optionnel)
 */
async function logAction(username, action, req, details = null) {
  try {
    const ipAddress = req ? (req.ip || req.connection?.remoteAddress || "unknown") : "unknown";
    const userAgent = req ? (req.get('User-Agent') || "unknown") : "unknown";
    
    await db.query(
      `INSERT INTO audit_logs (username, action, details, ip_address, user_agent, timestamp)
       VALUES ($1, $2, $3, $4, $5, NOW())`,
      [username, action, details, ipAddress, userAgent]
    );
    
    console.log(`📝 AUDIT: ${action} by ${username || 'anonymous'} from ${ipAddress}`);
    
  } catch (error) {
    // Ne pas bloquer l'exécution si le logging échoue
    console.error("❌ Erreur audit log:", error);
  }
}

/**
 * Logger un événement de sécurité (honeypot, rate limit, etc.)
 * @param {string} eventType - Type d'événement (HONEYPOT, RATE_LIMIT, etc.)
 * @param {object} req - Request Express
 * @param {string} details - Détails supplémentaires
 */
async function logSecurityEvent(eventType, req, details = null) {
  try {
    const ipAddress = req.ip || req.connection.remoteAddress || "unknown";
    const userAgent = req.get('User-Agent') || "unknown";
    const path = req.path || req.originalUrl || "unknown";
    
    await db.query(
      `INSERT INTO security_events (event_type, ip_address, path, user_agent, details, timestamp)
       VALUES ($1, $2, $3, $4, $5, NOW())`,
      [eventType, ipAddress, path, userAgent, details]
    );
    
    console.log(`🚨 SECURITY EVENT: ${eventType} from ${ipAddress} → ${path}`);
    
  } catch (error) {
    console.error("❌ Erreur security event:", error);
  }
}

/**
 * Récupérer les logs récents (pour admin panel)
 * @param {number} limit - Nombre de logs à récupérer (défaut: 100)
 * @param {string} username - Filtrer par username (optionnel)
 * @param {string} action - Filtrer par action (optionnel)
 */
async function getRecentLogs(limit = 100, username = null, action = null) {
  try {
    let query = "SELECT * FROM audit_logs WHERE 1=1";
    const params = [];
    let paramCount = 1;
    
    if (username) {
      query += ` AND username = $${paramCount}`;
      params.push(username);
      paramCount++;
    }
    
    if (action) {
      query += ` AND action = $${paramCount}`;
      params.push(action);
      paramCount++;
    }
    
    query += ` ORDER BY timestamp DESC LIMIT $${paramCount}`;
    params.push(limit);
    
    const result = await db.query(query, params);
    return result.rows;
    
  } catch (error) {
    console.error("❌ Erreur getRecentLogs:", error);
    return [];
  }
}

/**
 * Récupérer les événements de sécurité récents
 * @param {number} limit - Nombre d'événements à récupérer
 * @param {string} eventType - Filtrer par type (optionnel)
 */
async function getSecurityEvents(limit = 100, eventType = null) {
  try {
    let query = "SELECT * FROM security_events WHERE 1=1";
    const params = [];
    let paramCount = 1;
    
    if (eventType) {
      query += ` AND event_type = $${paramCount}`;
      params.push(eventType);
      paramCount++;
    }
    
    query += ` ORDER BY timestamp DESC LIMIT $${paramCount}`;
    params.push(limit);
    
    const result = await db.query(query, params);
    return result.rows;
    
  } catch (error) {
    console.error("❌ Erreur getSecurityEvents:", error);
    return [];
  }
}

/**
 * Obtenir les statistiques d'audit
 */
async function getAuditStats() {
  try {
    // Total logs 24h
    const totalLogs = await db.query(
      "SELECT COUNT(*) as count FROM audit_logs WHERE timestamp > NOW() - INTERVAL '24 hours'"
    );
    
    // Logins réussis 24h
    const successLogins = await db.query(
      "SELECT COUNT(*) as count FROM audit_logs WHERE action = 'LOGIN_SUCCESS' AND timestamp > NOW() - INTERVAL '24 hours'"
    );
    
    // Échecs de connexion 24h
    const failedLogins = await db.query(
      "SELECT COUNT(*) as count FROM audit_logs WHERE action = 'LOGIN_FAILED' AND timestamp > NOW() - INTERVAL '24 hours'"
    );
    
    // Comptes bloqués 24h
    const blockedAccounts = await db.query(
      "SELECT COUNT(*) as count FROM audit_logs WHERE action = 'ACCOUNT_BLOCKED' AND timestamp > NOW() - INTERVAL '24 hours'"
    );
    
    // Événements honeypot 24h
    const honeypotEvents = await db.query(
      "SELECT COUNT(*) as count FROM security_events WHERE event_type = 'HONEYPOT' AND timestamp > NOW() - INTERVAL '24 hours'"
    );
    
    return {
      totalLogs: parseInt(totalLogs.rows[0].count),
      successLogins: parseInt(successLogins.rows[0].count),
      failedLogins: parseInt(failedLogins.rows[0].count),
      blockedAccounts: parseInt(blockedAccounts.rows[0].count),
      honeypotEvents: parseInt(honeypotEvents.rows[0].count)
    };
    
  } catch (error) {
    console.error("❌ Erreur getAuditStats:", error);
    return {
      totalLogs: 0,
      successLogins: 0,
      failedLogins: 0,
      blockedAccounts: 0,
      honeypotEvents: 0
    };
  }
}

module.exports = {
  ACTION_TYPES,
  logAction,
  logSecurityEvent,
  getRecentLogs,
  getSecurityEvents,
  getAuditStats
};

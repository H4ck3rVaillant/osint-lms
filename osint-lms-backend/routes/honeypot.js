// routes/honeypot.js
// Routes pièges pour détecter les scanners automatiques
// Date : 14 avril 2026

const express = require("express");
const router = express.Router();

// ✅ IMPORT SÉCURISÉ : Ne crash pas si auditLogger absent
let logSecurityEvent = null;
try {
  logSecurityEvent = require("../services/auditLogger").logSecurityEvent;
} catch (error) {
  console.log("⚠️ Audit logger non disponible dans honeypot (optionnel)");
}

// Helper pour logger de manière sécurisée
async function safeLog(eventType, req, details) {
  try {
    if (logSecurityEvent) {
      await logSecurityEvent(eventType, req, details);
    }
  } catch (error) {
    console.error("❌ Erreur honeypot log (non bloquant):", error.message);
  }
}

/**
 * Liste des chemins honeypot
 * Ces URLs sont couramment ciblées par les scanners automatiques
 */
const HONEYPOT_PATHS = [
  // Panels d'administration communs
  "/admin",
  "/administrator",
  "/admin.php",
  "/wp-admin",
  "/wp-login.php",
  
  // Bases de données
  "/phpmyadmin",
  "/pma",
  "/mysql",
  "/database",
  "/db",
  
  // Fichiers de configuration
  "/.env",
  "/config.php",
  "/configuration.php",
  "/settings.php",
  "/.git/config",
  
  // Backups
  "/backup",
  "/backup.sql",
  "/dump.sql",
  "/database.sql",
  
  // Scripts de test
  "/test.php",
  "/info.php",
  "/phpinfo.php",
  "/test",
  
  // Autres cibles communes
  "/shell.php",
  "/c99.php",
  "/r57.php",
  "/xmlrpc.php",
  "/readme.html",
  "/license.txt"
];

/**
 * Créer des routes honeypot pour tous les chemins
 */
HONEYPOT_PATHS.forEach(path => {
  // Capturer toutes les méthodes HTTP (GET, POST, PUT, DELETE, etc.)
  router.all(path, async (req, res) => {
    const ipAddress = req.ip || req.connection.remoteAddress || "unknown";
    const userAgent = req.get('User-Agent') || "unknown";
    const method = req.method;
    
    // Logger l'événement
    console.log(`🍯 HONEYPOT TRIGGERED: ${ipAddress} → ${method} ${path}`);
    console.log(`   User-Agent: ${userAgent}`);
    
    await safeLog(
      "HONEYPOT",
      req,
      JSON.stringify({
        method: method,
        path: path,
        query: req.query,
        body: req.body
      })
    );
    
    // Réponse générique pour ne pas révéler que c'est un honeypot
    // On fait semblant que la ressource n'existe simplement pas
    res.status(404).json({
      error: "Not Found",
      message: "The requested resource does not exist"
    });
  });
});

/**
 * Route honeypot générique pour tout ce qui n'est pas défini
 * Capturer les tentatives d'accès à des extensions suspectes
 */
router.all("*.php", async (req, res) => {
  console.log(`🍯 HONEYPOT: Tentative d'accès PHP depuis ${req.ip} → ${req.path}`);
  
  await safeLog("HONEYPOT", req, `PHP file access attempt: ${req.path}`);
  
  res.status(404).json({ error: "Not Found" });
});

/**
 * Statistiques honeypot (pour admin)
 */
router.get("/honeypot/stats", async (req, res) => {
  try {
    const db = require("../services/neonDatabase");
    
    // Top IPs suspectes
    const topIPs = await db.query(`
      SELECT ip_address, COUNT(*) as trigger_count, MAX(timestamp) as last_seen
      FROM security_events
      WHERE event_type = 'HONEYPOT'
      GROUP BY ip_address
      ORDER BY trigger_count DESC
      LIMIT 10
    `);
    
    // Top chemins accédés
    const topPaths = await db.query(`
      SELECT path, COUNT(*) as access_count
      FROM security_events
      WHERE event_type = 'HONEYPOT'
      GROUP BY path
      ORDER BY access_count DESC
      LIMIT 10
    `);
    
    // Événements récents
    const recentEvents = await db.query(`
      SELECT ip_address, path, user_agent, timestamp
      FROM security_events
      WHERE event_type = 'HONEYPOT'
      ORDER BY timestamp DESC
      LIMIT 20
    `);
    
    res.json({
      success: true,
      stats: {
        topIPs: topIPs.rows,
        topPaths: topPaths.rows,
        recentEvents: recentEvents.rows
      }
    });
    
  } catch (error) {
    console.error("Erreur honeypot stats:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

console.log(`🍯 Honeypot activé avec ${HONEYPOT_PATHS.length} chemins pièges`);

module.exports = router;

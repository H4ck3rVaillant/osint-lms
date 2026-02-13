const fs = require("fs");
const path = require("path");
const { blacklistIP } = require("../middlewares/ipBlacklist");

const FAILED_LOGINS = {};
const ALERT_THRESHOLD = 5;
const WINDOW_MS = 2 * 60 * 1000;

const auditPath = path.join(__dirname, "../data/audit.log");

function raiseAlert(ip) {
  const alert = {
    timestamp: new Date().toISOString(),
    type: "SECURITY_ALERT",
    level: "HIGH",
    reason: "MULTIPLE_FAILED_LOGINS",
    ip
  };

  fs.appendFileSync(auditPath, JSON.stringify(alert) + "\n");

  // 🔥 AUTO BLACKLIST
  blacklistIP(ip);
}

function registerFailedLogin(ip) {
  const now = Date.now();

  if (!FAILED_LOGINS[ip]) FAILED_LOGINS[ip] = [];
  FAILED_LOGINS[ip].push(now);

  FAILED_LOGINS[ip] = FAILED_LOGINS[ip].filter(t => now - t < WINDOW_MS);

  if (FAILED_LOGINS[ip].length >= ALERT_THRESHOLD) {
    raiseAlert(ip);
    FAILED_LOGINS[ip] = [];
  }
}

module.exports = { registerFailedLogin };

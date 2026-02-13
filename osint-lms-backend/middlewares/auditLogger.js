const fs = require("fs");
const path = require("path");

const auditPath = path.join(__dirname, "../data/audit.log");

module.exports = function audit(type, userId, ip) {
  const entry = {
    timestamp: new Date().toISOString(),
    type,
    userId,
    ip
  };

  fs.appendFileSync(auditPath, JSON.stringify(entry) + "\n");
};

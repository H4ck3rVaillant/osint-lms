const fs = require('fs');
const path = require('path');

const logFile = path.join(__dirname, '../data/audit.log');

module.exports = function auditLog(entry) {
  const log = {
    date: new Date().toISOString(),
    ...entry
  };

  fs.appendFileSync(logFile, JSON.stringify(log) + '\n');
};

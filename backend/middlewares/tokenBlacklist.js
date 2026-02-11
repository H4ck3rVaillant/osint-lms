const fs = require('fs');
const path = require('path');

const blacklistFile = path.join(__dirname, '../data/blacklist.json');

/* ============================
   INIT BLACKLIST FILE
============================ */
function loadBlacklist() {
  try {
    if (!fs.existsSync(blacklistFile)) {
      fs.writeFileSync(blacklistFile, JSON.stringify([]));
      return [];
    }

    const content = fs.readFileSync(blacklistFile, 'utf-8').trim();

    if (!content) {
      return [];
    }

    return JSON.parse(content);
  } catch (err) {
    console.error('❌ Erreur blacklist.json corrompu — reset');
    fs.writeFileSync(blacklistFile, JSON.stringify([]));
    return [];
  }
}

function saveBlacklist(list) {
  fs.writeFileSync(blacklistFile, JSON.stringify(list, null, 2));
}

/* ============================
   API
============================ */
module.exports = {
  isBlacklisted(token) {
    const blacklist = loadBlacklist();
    return blacklist.includes(token);
  },

  add(token) {
    const blacklist = loadBlacklist();
    if (!blacklist.includes(token)) {
      blacklist.push(token);
      saveBlacklist(blacklist);
    }
  }
};

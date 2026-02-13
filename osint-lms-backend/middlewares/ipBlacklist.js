const fs = require("fs");
const path = require("path");

const BLACKLIST_PATH = path.join(__dirname, "../data/ip-blacklist.json");
const COOLDOWN_MS = 10 * 60 * 1000; // 10 minutes

function load() {
  if (!fs.existsSync(BLACKLIST_PATH)) {
    fs.writeFileSync(BLACKLIST_PATH, JSON.stringify({}));
  }
  return JSON.parse(fs.readFileSync(BLACKLIST_PATH, "utf8") || "{}");
}

function save(data) {
  fs.writeFileSync(BLACKLIST_PATH, JSON.stringify(data, null, 2));
}

function blacklistIP(ip) {
  const data = load();
  data[ip] = Date.now() + COOLDOWN_MS;
  save(data);
}

function isBlacklisted(ip) {
  const data = load();
  if (!data[ip]) return false;

  if (Date.now() > data[ip]) {
    delete data[ip];
    save(data);
    return false;
  }
  return true;
}

module.exports = { blacklistIP, isBlacklisted };

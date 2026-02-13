const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Connexion à la base de données SQLite
const dbPath = path.join(__dirname, '../db/users.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Erreur de connexion à la base de données:', err);
  } else {
    console.log('✅ Connecté à la base de données SQLite');
  }
});

// Initialisation de la table users
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'user',
      totp_secret TEXT,
      must_change_password INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      last_login DATETIME
    )
  `, (err) => {
    if (err) {
      console.error('❌ Erreur création table users:', err);
    } else {
      console.log('✅ Table users initialisée');
    }
  });
});

/* ====================================
   MÉTHODES DE LA BASE DE DONNÉES
==================================== */

/**
 * Récupérer un utilisateur par son username
 */
function getUserByUsername(username) {
  return new Promise((resolve, reject) => {
    db.get(
      'SELECT * FROM users WHERE username = ?',
      [username],
      (err, row) => {
        if (err) reject(err);
        else resolve(row);
      }
    );
  });
}

/**
 * Récupérer un utilisateur par son ID
 */
function getUserById(id) {
  return new Promise((resolve, reject) => {
    db.get(
      'SELECT * FROM users WHERE id = ?',
      [id],
      (err, row) => {
        if (err) reject(err);
        else resolve(row);
      }
    );
  });
}

/**
 * Créer un nouvel utilisateur
 */
function createUser(userData) {
  return new Promise((resolve, reject) => {
    const { username, password, role, totp_secret, must_change_password } = userData;
    
    db.run(
      `INSERT INTO users (username, password, role, totp_secret, must_change_password)
       VALUES (?, ?, ?, ?, ?)`,
      [username, password, role || 'user', totp_secret, must_change_password || 0],
      function(err) {
        if (err) reject(err);
        else resolve(this.lastID); // Retourne l'ID du nouvel utilisateur
      }
    );
  });
}

/**
 * Mettre à jour la date de dernière connexion
 */
function updateLastLogin(userId) {
  return new Promise((resolve, reject) => {
    db.run(
      'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?',
      [userId],
      (err) => {
        if (err) reject(err);
        else resolve();
      }
    );
  });
}

/**
 * Mettre à jour le mot de passe d'un utilisateur
 */
function updatePassword(userId, newPasswordHash) {
  return new Promise((resolve, reject) => {
    db.run(
      'UPDATE users SET password = ?, must_change_password = 0 WHERE id = ?',
      [newPasswordHash, userId],
      (err) => {
        if (err) reject(err);
        else resolve();
      }
    );
  });
}

/**
 * Mettre à jour le secret TOTP
 */
function updateTotpSecret(userId, newSecret) {
  return new Promise((resolve, reject) => {
    db.run(
      'UPDATE users SET totp_secret = ? WHERE id = ?',
      [newSecret, userId],
      (err) => {
        if (err) reject(err);
        else resolve();
      }
    );
  });
}

/**
 * Récupérer tous les utilisateurs (admin only)
 */
function getAllUsers() {
  return new Promise((resolve, reject) => {
    db.all(
      'SELECT id, username, role, created_at, last_login FROM users',
      [],
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      }
    );
  });
}

/**
 * Supprimer un utilisateur
 */
function deleteUser(userId) {
  return new Promise((resolve, reject) => {
    db.run(
      'DELETE FROM users WHERE id = ?',
      [userId],
      (err) => {
        if (err) reject(err);
        else resolve();
      }
    );
  });
}

// Export des méthodes
module.exports = {
  db,
  getUserByUsername,
  getUserById,
  createUser,
  updateLastLogin,
  updatePassword,
  updateTotpSecret,
  getAllUsers,
  deleteUser
};

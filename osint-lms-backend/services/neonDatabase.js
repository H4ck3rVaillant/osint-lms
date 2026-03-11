const { Pool } = require("pg");

// Configuration de la connexion PostgreSQL Neon
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Test de connexion au démarrage
pool.connect((err, client, release) => {
  if (err) {
    console.error("❌ Erreur de connexion à Neon PostgreSQL:", err.stack);
  } else {
    console.log("✅ Connecté à la base de données Neon PostgreSQL");
    release();
  }
});

/* ====================================
   MÉTHODES DE LA BASE DE DONNÉES
==================================== */

/**
 * Exécuter une requête SQL
 */
async function query(text, params) {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('Query error:', error);
    throw error;
  }
}

/**
 * Récupérer un utilisateur par son username
 */
async function getUserByUsername(username) {
  const result = await query(
    "SELECT * FROM utilisateurs WHERE username = $1",
    [username]
  );
  return result.rows[0];
}

/**
 * Récupérer un utilisateur par son ID
 */
async function getUserById(id) {
  const result = await query(
    "SELECT * FROM utilisateurs WHERE id = $1",
    [id]
  );
  return result.rows[0];
}

/**
 * Créer un nouvel utilisateur
 */
async function createUser(userData) {
  const { username, password, role, totp_secret, must_change_password } = userData;
  
  const result = await query(
    `INSERT INTO utilisateurs (username, password, role, totp_secret, must_change_password)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id`,
    [username, password, role || 'user', totp_secret, must_change_password || 0]
  );
  
  return result.rows[0].id;
}

/**
 * Mettre à jour la date de dernière connexion
 */
async function updateLastLogin(userId) {
  await query(
    "UPDATE utilisateurs SET last_login = NOW() WHERE id = $1",
    [userId]
  );
}

/**
 * Mettre à jour le mot de passe d'un utilisateur
 */
async function updatePassword(userId, newPasswordHash) {
  await query(
    "UPDATE utilisateurs SET password = $1, must_change_password = 0 WHERE id = $2",
    [newPasswordHash, userId]
  );
}

/**
 * Mettre à jour le secret TOTP
 */
async function updateTotpSecret(userId, newSecret) {
  await query(
    "UPDATE utilisateurs SET totp_secret = $1 WHERE id = $2",
    [newSecret, userId]
  );
}

/**
 * Récupérer tous les utilisateurs (admin only)
 */
async function getAllUsers() {
  const result = await query(
    "SELECT id, username, role, created_at, last_login FROM utilisateurs"
  );
  return result.rows;
}

/**
 * Supprimer un utilisateur
 */
async function deleteUser(userId) {
  await query(
    "DELETE FROM utilisateurs WHERE id = $1",
    [userId]
  );
}

/**
 * Initialiser les tables si elles n'existent pas
 */
async function initTables() {
  try {
    // Table utilisateurs
    await query(`
      CREATE TABLE IF NOT EXISTS utilisateurs (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'user',
        totp_secret VARCHAR(255),
        must_change_password INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW(),
        last_login TIMESTAMP
      )
    `);
    console.log("✅ Table users prête (PostgreSQL)");

    // Table game_progress
    await query(`
      CREATE TABLE IF NOT EXISTS game_progress (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES utilisateurs(id) ON DELETE CASCADE,
        xp INTEGER DEFAULT 0,
        level INTEGER DEFAULT 0,
        streak INTEGER DEFAULT 0,
        longest_streak INTEGER DEFAULT 0,
        last_activity TIMESTAMP,
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Table user_badges
    await query(`
      CREATE TABLE IF NOT EXISTS user_badges (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES utilisateurs(id) ON DELETE CASCADE,
        badge_id VARCHAR(50),
        unlocked_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(user_id, badge_id)
      )
    `);

    // Table solved_challenges
    await query(`
      CREATE TABLE IF NOT EXISTS solved_challenges (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES utilisateurs(id) ON DELETE CASCADE,
        challenge_id VARCHAR(50),
        solved_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(user_id, challenge_id)
      )
    `);

    // Table user_preferences
    await query(`
      CREATE TABLE IF NOT EXISTS user_preferences (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES utilisateurs(id) ON DELETE CASCADE UNIQUE,
        avatar VARCHAR(50),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

  } catch (error) {
    console.error("❌ Erreur lors de l'initialisation des tables:", error);
  }
}

// Initialiser les tables au démarrage
initTables();

// Export des méthodes
module.exports = {
  pool,
  query, // ✨ IMPORTANT : Exporter la fonction query
  getUserByUsername,
  getUserById,
  createUser,
  updateLastLogin,
  updatePassword,
  updateTotpSecret,
  getAllUsers,
  deleteUser
};

const { Pool } = require("pg");

/* =====================================================
   CONNEXION POSTGRESQL
   En prod  : utilise DATABASE_URL (Render l'injecte)
   En dev   : utilise les variables individuelles ou
              une DB locale
===================================================== */
const pool = new Pool(
  process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }, // obligatoire sur Render
      }
    : {
        host:     process.env.DB_HOST     || "localhost",
        port:     parseInt(process.env.DB_PORT || "5432"),
        database: process.env.DB_NAME     || "osint_lms",
        user:     process.env.DB_USER     || "postgres",
        password: process.env.DB_PASSWORD || "postgres",
      }
);

/* =====================================================
   INITIALISATION DE LA TABLE
===================================================== */
async function initDatabase() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id               SERIAL PRIMARY KEY,
        username         TEXT UNIQUE NOT NULL,
        password         TEXT NOT NULL,
        role             TEXT DEFAULT 'user',
        totp_secret      TEXT,
        must_change_password INTEGER DEFAULT 0,
        created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_login       TIMESTAMP
      )
    `);
    console.log("✅ Table users prête (PostgreSQL)");
  } catch (err) {
    console.error("❌ Erreur init table:", err.message);
    throw err;
  } finally {
    client.release();
  }
}

/* =====================================================
   MÉTHODES
===================================================== */

function getUserByUsername(username) {
  return pool
    .query("SELECT * FROM users WHERE username = $1", [username])
    .then((r) => r.rows[0] || null);
}

function getUserById(id) {
  return pool
    .query("SELECT * FROM users WHERE id = $1", [id])
    .then((r) => r.rows[0] || null);
}

function createUser({ username, password, role, totp_secret, must_change_password }) {
  return pool
    .query(
      `INSERT INTO users (username, password, role, totp_secret, must_change_password)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id`,
      [username, password, role || "user", totp_secret, must_change_password || 0]
    )
    .then((r) => r.rows[0].id);
}

function updateLastLogin(userId) {
  return pool.query(
    "UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1",
    [userId]
  );
}

function updatePassword(userId, newPasswordHash) {
  return pool.query(
    "UPDATE users SET password = $1, must_change_password = 0 WHERE id = $2",
    [newPasswordHash, userId]
  );
}

function updateTotpSecret(userId, newSecret) {
  return pool.query(
    "UPDATE users SET totp_secret = $1 WHERE id = $2",
    [newSecret, userId]
  );
}

function getAllUsers() {
  return pool
    .query("SELECT id, username, role, created_at, last_login FROM users ORDER BY created_at DESC")
    .then((r) => r.rows);
}

function deleteUser(userId) {
  return pool.query("DELETE FROM users WHERE id = $1", [userId]);
}

module.exports = {
  pool,
  initDatabase,
  getUserByUsername,
  getUserById,
  createUser,
  updateLastLogin,
  updatePassword,
  updateTotpSecret,
  getAllUsers,
  deleteUser,
};

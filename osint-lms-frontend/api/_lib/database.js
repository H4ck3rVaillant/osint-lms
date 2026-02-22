const { Pool } = require("pg");

// Pool PostgreSQL (réutilisé entre invocations)
let pool;

function getPool() {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL, // ✅ CHANGÉ DE POSTGRES_URL EN DATABASE_URL
      ssl: { rejectUnauthorized: false }
    });
  }
  return pool;
}

/* =====================================================
   MÉTHODES
===================================================== */

async function getUserByUsername(username) {
  const pool = getPool();
  const result = await pool.query(
    "SELECT * FROM users WHERE username = $1",
    [username]
  );
  return result.rows[0] || null;
}

async function getUserById(id) {
  const pool = getPool();
  const result = await pool.query(
    "SELECT * FROM users WHERE id = $1",
    [id]
  );
  return result.rows[0] || null;
}

async function createUser({ username, password, role, totp_secret, must_change_password }) {
  const pool = getPool();
  const result = await pool.query(
    `INSERT INTO users (username, password, role, totp_secret, must_change_password)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id`,
    [username, password, role || "user", totp_secret, must_change_password || 0]
  );
  return result.rows[0].id;
}

async function updateLastLogin(userId) {
  const pool = getPool();
  await pool.query(
    "UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1",
    [userId]
  );
}

async function updatePassword(userId, newPasswordHash) {
  const pool = getPool();
  await pool.query(
    "UPDATE users SET password = $1, must_change_password = 0 WHERE id = $2",
    [newPasswordHash, userId]
  );
}

async function updateTotpSecret(userId, newSecret) {
  const pool = getPool();
  await pool.query(
    "UPDATE users SET totp_secret = $1 WHERE id = $2",
    [newSecret, userId]
  );
}

async function getAllUsers() {
  const pool = getPool();
  const result = await pool.query(
    "SELECT id, username, role, created_at, last_login FROM users ORDER BY created_at DESC"
  );
  return result.rows;
}

async function deleteUser(userId) {
  const pool = getPool();
  await pool.query(
    "DELETE FROM users WHERE id = $1",
    [userId]
  );
}

module.exports = {
  getUserByUsername,
  getUserById,
  createUser,
  updateLastLogin,
  updatePassword,
  updateTotpSecret,
  getAllUsers,
  deleteUser
};

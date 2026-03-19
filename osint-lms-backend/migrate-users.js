require('dotenv').config();
const sqlite3 = require('sqlite3').verbose();
const { Pool } = require('pg');
const path = require('path');

// Connexion SQLite (ancienne DB)
const dbPath = path.join(__dirname, 'db/users.db');
const sqliteDb = new sqlite3.Database(dbPath);

// Connexion PostgreSQL Neon (nouvelle DB)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function migrateUsers() {
  console.log('🔄 Début de la migration SQLite → Neon PostgreSQL...\n');

  // 1. Récupérer tous les users de SQLite
  sqliteDb.all('SELECT * FROM users', async (err, users) => {
    if (err) {
      console.error('❌ Erreur lecture SQLite:', err);
      pool.end();
      sqliteDb.close();
      return;
    }

    console.log(`📊 ${users.length} utilisateurs trouvés dans SQLite\n`);

    // 2. Insérer dans Neon
    for (const user of users) {
      try {
        await pool.query(
          `INSERT INTO utilisateurs (username, password, role, totp_secret, must_change_password, created_at, last_login)
           VALUES ($1, $2, $3, $4, $5, $6, $7)
           ON CONFLICT (username) DO NOTHING`,
          [
            user.username,
            user.password,
            user.role || 'user',
            user.totp_secret,
            user.must_change_password || 0,
            user.created_at,
            user.last_login
          ]
        );
        console.log(`✅ ${user.username} migré (role: ${user.role || 'user'})`);
      } catch (error) {
        console.error(`❌ Erreur migration ${user.username}:`, error.message);
      }
    }

    console.log('\n🎉 Migration terminée !');
    await pool.end();
    sqliteDb.close();
  });
}

migrateUsers();

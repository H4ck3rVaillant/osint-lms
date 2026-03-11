const { Pool } = require('pg');

// Connexion à Neon PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

pool.on('connect', () => {
  console.log('✅ Connecté à Neon PostgreSQL');
});

pool.on('error', (err) => {
  console.error('❌ Erreur de connexion Neon:', err);
});

/* ====================================
   GAME PROGRESS
==================================== */

/**
 * Sauvegarder la progression du jeu
 */
async function saveGameProgress(userId, gameState) {
  const {
    xp,
    level,
    level_name,
    streak,
    longest_streak,
    last_activity,
    activity_calendar
  } = gameState;

  const query = `
    INSERT INTO game_progress (
      user_id, xp, level, level_name, streak, longest_streak, 
      last_activity, activity_calendar, updated_at
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
    ON CONFLICT (user_id)
    DO UPDATE SET
      xp = EXCLUDED.xp,
      level = EXCLUDED.level,
      level_name = EXCLUDED.level_name,
      streak = EXCLUDED.streak,
      longest_streak = EXCLUDED.longest_streak,
      last_activity = EXCLUDED.last_activity,
      activity_calendar = EXCLUDED.activity_calendar,
      updated_at = NOW()
    RETURNING *
  `;

  const values = [
    userId,
    xp,
    level,
    level_name,
    streak,
    longest_streak,
    last_activity,
    JSON.stringify(activity_calendar)
  ];

  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error('Erreur saveGameProgress:', error);
    throw error;
  }
}

/**
 * Charger la progression du jeu
 */
async function loadGameProgress(userId) {
  const query = 'SELECT * FROM game_progress WHERE user_id = $1';
  
  try {
    const result = await pool.query(query, [userId]);
    if (result.rows.length === 0) return null;
    
    const progress = result.rows[0];
    // Parser le JSON activity_calendar
    if (progress.activity_calendar) {
      progress.activity_calendar = JSON.parse(progress.activity_calendar);
    }
    return progress;
  } catch (error) {
    console.error('Erreur loadGameProgress:', error);
    throw error;
  }
}

/* ====================================
   USER BADGES
==================================== */

/**
 * Débloquer un badge
 */
async function unlockBadge(userId, badgeId) {
  const query = `
    INSERT INTO user_badges (user_id, badge_id, unlocked_at)
    VALUES ($1, $2, NOW())
    ON CONFLICT (user_id, badge_id) DO NOTHING
    RETURNING *
  `;

  try {
    const result = await pool.query(query, [userId, badgeId]);
    return result.rows[0];
  } catch (error) {
    console.error('Erreur unlockBadge:', error);
    throw error;
  }
}

/**
 * Récupérer tous les badges d'un utilisateur
 */
async function getUserBadges(userId) {
  const query = 'SELECT * FROM user_badges WHERE user_id = $1 ORDER BY unlocked_at DESC';
  
  try {
    const result = await pool.query(query, [userId]);
    return result.rows;
  } catch (error) {
    console.error('Erreur getUserBadges:', error);
    throw error;
  }
}

/* ====================================
   SOLVED CHALLENGES
==================================== */

/**
 * Marquer un challenge comme résolu
 */
async function solveChallenge(userId, challengeId) {
  const query = `
    INSERT INTO solve_challenges (user_id, challenge_id, solved_at)
    VALUES ($1, $2, NOW())
    ON CONFLICT (user_id, challenge_id) DO NOTHING
    RETURNING *
  `;

  try {
    const result = await pool.query(query, [userId, challengeId]);
    return result.rows[0];
  } catch (error) {
    console.error('Erreur solveChallenge:', error);
    throw error;
  }
}

/**
 * Récupérer tous les challenges résolus par un utilisateur
 */
async function getSolvedChallenges(userId) {
  const query = 'SELECT * FROM solve_challenges WHERE user_id = $1 ORDER BY solved_at DESC';
  
  try {
    const result = await pool.query(query, [userId]);
    return result.rows;
  } catch (error) {
    console.error('Erreur getSolvedChallenges:', error);
    throw error;
  }
}

/* ====================================
   USER PREFERENCES
==================================== */

/**
 * Sauvegarder les préférences utilisateur (avatar, etc.)
 */
async function saveUserPreferences(userId, preferences) {
  const { avatar } = preferences;

  const query = `
    INSERT INTO user_preferences (user_id, avatar, updated_at)
    VALUES ($1, $2, NOW())
    ON CONFLICT (user_id)
    DO UPDATE SET
      avatar = EXCLUDED.avatar,
      updated_at = NOW()
    RETURNING *
  `;

  try {
    const result = await pool.query(query, [userId, avatar]);
    return result.rows[0];
  } catch (error) {
    console.error('Erreur saveUserPreferences:', error);
    throw error;
  }
}

/**
 * Charger les préférences utilisateur
 */
async function loadUserPreferences(userId) {
  const query = 'SELECT * FROM user_preferences WHERE user_id = $1';
  
  try {
    const result = await pool.query(query, [userId]);
    return result.rows[0] || null;
  } catch (error) {
    console.error('Erreur loadUserPreferences:', error);
    throw error;
  }
}

// Export
module.exports = {
  pool,
  saveGameProgress,
  loadGameProgress,
  unlockBadge,
  getUserBadges,
  solveChallenge,
  getSolvedChallenges,
  saveUserPreferences,
  loadUserPreferences
};

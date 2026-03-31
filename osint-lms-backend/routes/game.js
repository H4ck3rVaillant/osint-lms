const express = require("express");
const router = express.Router();
const db = require("../services/neonDatabase");
const authMiddleware = require("../middlewares/authMiddleware");

/* ====================================
   GET /game/health (PUBLIC)
   Vérifier la connexion à la base de données
==================================== */
router.get("/health", async (req, res) => {
  try {
    // Test simple de connexion
    await db.query("SELECT 1");
    res.json({ 
      status: "ok", 
      database: "connected",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Health check error:", error);
    res.status(500).json({ 
      status: "error", 
      database: "disconnected",
      error: error.message 
    });
  }
});

/* ====================================
   POST /game/save
   Sauvegarder la progression du joueur
==================================== */
router.post("/save", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { xp, level, streak, longestStreak, lastActivity, solvedChallenges } = req.body;

    // Vérifier si l'utilisateur a déjà une progression
    const existing = await db.query(
      "SELECT * FROM game_progress WHERE user_id = $1",
      [userId]
    );

    if (existing.rows.length > 0) {
      // Mettre à jour
      await db.query(
        `UPDATE game_progress 
         SET xp = $1, level = $2, streak = $3, longest_streak = $4, 
             last_activity = $5, updated_at = NOW()
         WHERE user_id = $6`,
        [xp, level, streak, longestStreak, lastActivity, userId]
      );
    } else {
      // Créer
      await db.query(
        `INSERT INTO game_progress (user_id, xp, level, streak, longest_streak, last_activity)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [userId, xp, level, streak, longestStreak, lastActivity]
      );
    }

    // Sauvegarder les challenges résolus
    if (solvedChallenges && solvedChallenges.length > 0) {
      for (const challengeId of solvedChallenges) {
        // Vérifier si déjà résolu
        const solved = await db.query(
          "SELECT * FROM solved_challenges WHERE user_id = $1 AND challenge_id = $2",
          [userId, challengeId]
        );

        if (solved.rows.length === 0) {
          await db.query(
            "INSERT INTO solved_challenges (user_id, challenge_id) VALUES ($1, $2)",
            [userId, challengeId]
          );
        }
      }
    }

    res.json({ success: true, message: "Progression sauvegardée" });
  } catch (error) {
    console.error("Erreur sauvegarde progression:", error);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
});

/* ====================================
   GET /game/load
   Charger la progression du joueur
==================================== */
router.get("/load", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    // Charger la progression
    const progress = await db.query(
      "SELECT * FROM game_progress WHERE user_id = $1",
      [userId]
    );

    // Charger les challenges résolus
    const challenges = await db.query(
      "SELECT challenge_id FROM solved_challenges WHERE user_id = $1",
      [userId]
    );

    // Charger les badges
    const badges = await db.query(
      "SELECT badge_id, unlocked_at FROM user_badges WHERE user_id = $1",
      [userId]
    );

    // Charger les préférences
    const prefs = await db.query(
      "SELECT avatar FROM user_preferences WHERE user_id = $1",
      [userId]
    );

    res.json({
      success: true,
      data: {
        progress: progress.rows[0] || null,
        solvedChallenges: challenges.rows.map(r => r.challenge_id),
        badges: badges.rows.map(r => ({ id: r.badge_id, unlockedAt: r.unlocked_at })),
        preferences: prefs.rows[0] || null
      }
    });
  } catch (error) {
    console.error("Erreur chargement progression:", error);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
});

/* ====================================
   POST /game/preferences
   Sauvegarder les préférences (avatar, etc.)
==================================== */
router.post("/preferences", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { avatar } = req.body;

    // Vérifier si existe
    const existing = await db.query(
      "SELECT * FROM user_preferences WHERE user_id = $1",
      [userId]
    );

    if (existing.rows.length > 0) {
      await db.query(
        "UPDATE user_preferences SET avatar = $1, updated_at = NOW() WHERE user_id = $2",
        [avatar, userId]
      );
    } else {
      await db.query(
        "INSERT INTO user_preferences (user_id, avatar) VALUES ($1, $2)",
        [userId, avatar]
      );
    }

    res.json({ success: true, message: "Préférences sauvegardées" });
  } catch (error) {
    console.error("Erreur sauvegarde préférences:", error);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
});

/* ====================================
   POST /game/save-full
   Sauvegarder TOUTE la progression (localStorage complet)
==================================== */
router.post("/save-full", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { data } = req.body;

    if (!data || typeof data !== 'object') {
      return res.status(400).json({ success: false, message: "Données invalides" });
    }

    // Vérifier si l'utilisateur a déjà une progression
    const existing = await db.query(
      "SELECT * FROM user_progression WHERE user_id = $1",
      [userId]
    );

    if (existing.rows.length > 0) {
      // Mettre à jour
      await db.query(
        "UPDATE user_progression SET data = $1, updated_at = NOW() WHERE user_id = $2",
        [JSON.stringify(data), userId]
      );
    } else {
      // Créer
      await db.query(
        "INSERT INTO user_progression (user_id, data) VALUES ($1, $2)",
        [userId, JSON.stringify(data)]
      );
    }

    res.json({ success: true, message: "Progression complète sauvegardée" });
  } catch (error) {
    console.error("Erreur sauvegarde progression complète:", error);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
});

/* ====================================
   GET /game/load-full
   Charger TOUTE la progression (localStorage complet)
==================================== */
router.get("/load-full", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await db.query(
      "SELECT data FROM user_progression WHERE user_id = $1",
      [userId]
    );

    if (result.rows.length > 0) {
      res.json({ success: true, data: result.rows[0].data });
    } else {
      // Pas de données sauvegardées, renvoyer un objet vide
      res.json({ success: true, data: {} });
    }
  } catch (error) {
    console.error("Erreur chargement progression complète:", error);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
});

module.exports = router;

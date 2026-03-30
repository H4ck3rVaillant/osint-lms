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
    const { xp, level, streak, longestStreak, lastActivity, solvedChallenges, badges } = req.body;

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

    // Sauvegarder les badges débloqués
    if (badges && badges.length > 0) {
      for (const badge of badges) {
        if (badge.unlocked) {
          // Vérifier si le badge est déjà enregistré
          const existingBadge = await db.query(
            "SELECT * FROM user_badges WHERE user_id = $1 AND badge_id = $2",
            [userId, badge.id]
          );

          if (existingBadge.rows.length === 0) {
            await db.query(
              "INSERT INTO user_badges (user_id, badge_id, unlocked_at) VALUES ($1, $2, $3)",
              [userId, badge.id, badge.unlockedAt || new Date().toISOString()]
            );
          }
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
   POST /game/save-full
   Sauvegarder TOUTE la progression (Quiz, Exercices, Badges, etc.)
==================================== */
router.post("/save-full", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { data } = req.body;

    // Sauvegarder ou mettre à jour
    const existing = await db.query(
      "SELECT * FROM user_progression WHERE user_id = $1",
      [userId]
    );

    if (existing.rows.length > 0) {
      await db.query(
        "UPDATE user_progression SET data = $1, updated_at = NOW() WHERE user_id = $2",
        [JSON.stringify(data), userId]
      );
    } else {
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
   Charger TOUTE la progression
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
      res.json({ success: true, data: null });
    }
  } catch (error) {
    console.error("Erreur chargement progression complète:", error);
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

    // ✅ CALCULER LE STREAK BASÉ SUR last_login
    const userInfo = await db.query(
      "SELECT last_login FROM utilisateurs WHERE id = $1",
      [userId]
    );

    // Charger la progression
    const progress = await db.query(
      "SELECT * FROM game_progress WHERE user_id = $1",
      [userId]
    );

    // Si l'utilisateur a une progression, calculer le streak
    if (progress.rows.length > 0 && userInfo.rows.length > 0) {
      const lastLogin = userInfo.rows[0].last_login;
      const currentProgress = progress.rows[0];
      
      if (lastLogin) {
        const today = new Date().toISOString().split('T')[0];
        const loginDate = new Date(lastLogin).toISOString().split('T')[0];
        const lastActivityDate = currentProgress.last_activity ? new Date(currentProgress.last_activity).toISOString().split('T')[0] : null;
        
        // Calculer le streak
        let newStreak = currentProgress.streak || 0;
        let newLongestStreak = currentProgress.longest_streak || 0;
        
        // Si connexion aujourd'hui et dernière activité n'était pas aujourd'hui
        if (loginDate === today && lastActivityDate !== today) {
          // Vérifier si c'était hier
          const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
          if (lastActivityDate === yesterday) {
            newStreak = (currentProgress.streak || 0) + 1;
          } else if (lastActivityDate === null || lastActivityDate < yesterday) {
            newStreak = 1; // Reset si interruption
          }
          
          newLongestStreak = Math.max(newLongestStreak, newStreak);
          
          // Mettre à jour le streak dans la DB
          await db.query(
            "UPDATE game_progress SET streak = $1, longest_streak = $2, last_activity = $3 WHERE user_id = $4",
            [newStreak, newLongestStreak, today, userId]
          );
          
          console.log(`✅ Streak mis à jour pour user ${userId}: ${newStreak} jours`);
          
          // Recharger la progression avec les nouvelles valeurs
          const updatedProgress = await db.query(
            "SELECT * FROM game_progress WHERE user_id = $1",
            [userId]
          );
          progress.rows[0] = updatedProgress.rows[0];
        }
      }
    }

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
   GET /game/leaderboard
   Récupérer le classement global
==================================== */
router.get("/leaderboard", authMiddleware, async (req, res) => {
  try {
    // Récupérer TOUS les utilisateurs avec leur progression (sans filtre de rôle)
    const leaderboard = await db.query(`
      SELECT 
        u.id,
        u.username,
        COALESCE(gp.xp, 0) as xp,
        COALESCE(gp.level, 0) as level,
        COALESCE(gp.streak, 0) as streak,
        COALESCE(gp.longest_streak, 0) as longest_streak,
        COALESCE(up.avatar, 'default') as avatar,
        COUNT(DISTINCT sc.challenge_id) as solved_challenges
      FROM utilisateurs u
      LEFT JOIN game_progress gp ON u.id = gp.user_id
      LEFT JOIN user_preferences up ON u.id = up.user_id
      LEFT JOIN solved_challenges sc ON u.id = sc.user_id
      GROUP BY u.id, u.username, gp.xp, gp.level, gp.streak, gp.longest_streak, up.avatar
      ORDER BY COALESCE(gp.xp, 0) DESC, u.username ASC
    `);

    // Ajouter le rang
    const rankedLeaderboard = leaderboard.rows.map((user, index) => ({
      rank: index + 1,
      username: user.username,
      xp: user.xp,
      level: user.level,
      streak: user.streak,
      longestStreak: user.longest_streak,
      avatar: user.avatar,
      solvedChallenges: parseInt(user.solved_challenges)
    }));

    res.json({
      success: true,
      data: rankedLeaderboard
    });
  } catch (error) {
    console.error("Erreur récupération leaderboard:", error);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
});

/* ====================================
   DELETE /game/reset-all-challenges
   Réinitialiser tous les challenges CTF
==================================== */
router.delete("/reset-all-challenges", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    // Supprimer tous les challenges résolus
    await db.query(
      "DELETE FROM solved_challenges WHERE user_id = $1",
      [userId]
    );

    // Réinitialiser la progression à 0
    await db.query(
      "UPDATE game_progress SET xp = 0, level = 0 WHERE user_id = $1",
      [userId]
    );

    console.log(`✅ Challenges réinitialisés pour user ${userId}`);
    res.json({ success: true, message: "Tous les challenges ont été réinitialisés" });
  } catch (error) {
    console.error("Erreur réinitialisation challenges:", error);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
});

module.exports = router;

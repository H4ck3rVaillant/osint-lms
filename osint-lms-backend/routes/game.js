const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const db = require('../services/neonDatabase');

const router = express.Router();

// Toutes les routes nécessitent une authentification
router.use(authMiddleware);

/* ====================================
   POST /game/save
   Sauvegarder la progression complète
==================================== */
router.post('/save', async (req, res) => {
  try {
    const userId = req.user.id;
    const { gameState, badges, solvedChallenges } = req.body;

    // 1. Sauvegarder la progression du jeu
    if (gameState) {
      await db.saveGameProgress(userId, {
        xp: gameState.xp || 0,
        level: gameState.level || 0,
        level_name: gameState.levelName || 'Newbie',
        streak: gameState.streak || 0,
        longest_streak: gameState.longestStreak || 0,
        last_activity: gameState.lastActivity || new Date().toISOString(),
        activity_calendar: gameState.activityCalendar || {}
      });
    }

    // 2. Sauvegarder les badges débloqués
    if (badges && Array.isArray(badges)) {
      for (const badge of badges) {
        if (badge.unlocked) {
          await db.unlockBadge(userId, badge.id);
        }
      }
    }

    // 3. Sauvegarder les challenges résolus
    if (solvedChallenges && Array.isArray(solvedChallenges)) {
      for (const challengeId of solvedChallenges) {
        await db.solveChallenge(userId, challengeId);
      }
    }

    res.json({ message: 'Progression sauvegardée avec succès' });
  } catch (error) {
    console.error('Erreur /game/save:', error);
    res.status(500).json({ message: 'Erreur lors de la sauvegarde' });
  }
});

/* ====================================
   GET /game/load
   Charger la progression complète
==================================== */
router.get('/load', async (req, res) => {
  try {
    const userId = req.user.id;

    // 1. Charger la progression du jeu
    const gameProgress = await db.loadGameProgress(userId);

    // 2. Charger les badges
    const badges = await db.getUserBadges(userId);

    // 3. Charger les challenges résolus
    const solvedChallenges = await db.getSolvedChallenges(userId);

    res.json({
      gameState: gameProgress ? {
        xp: gameProgress.xp,
        level: gameProgress.level,
        levelName: gameProgress.level_name,
        streak: gameProgress.streak,
        longestStreak: gameProgress.longest_streak,
        lastActivity: gameProgress.last_activity,
        activityCalendar: gameProgress.activity_calendar || {},
        rank: 999 // Calculé côté client ou via une autre query
      } : null,
      badges: badges.map(b => b.badge_id),
      solvedChallenges: solvedChallenges.map(c => c.challenge_id)
    });
  } catch (error) {
    console.error('Erreur /game/load:', error);
    res.status(500).json({ message: 'Erreur lors du chargement' });
  }
});

/* ====================================
   POST /game/unlock-badge
   Débloquer un badge
==================================== */
router.post('/unlock-badge', async (req, res) => {
  try {
    const userId = req.user.id;
    const { badgeId } = req.body;

    if (!badgeId) {
      return res.status(400).json({ message: 'badgeId requis' });
    }

    const badge = await db.unlockBadge(userId, badgeId);
    
    res.json({ 
      message: 'Badge débloqué',
      badge 
    });
  } catch (error) {
    console.error('Erreur /game/unlock-badge:', error);
    res.status(500).json({ message: 'Erreur lors du déblocage du badge' });
  }
});

/* ====================================
   POST /game/solve-challenge
   Marquer un challenge comme résolu
==================================== */
router.post('/solve-challenge', async (req, res) => {
  try {
    const userId = req.user.id;
    const { challengeId } = req.body;

    if (!challengeId) {
      return res.status(400).json({ message: 'challengeId requis' });
    }

    const challenge = await db.solveChallenge(userId, challengeId);
    
    res.json({ 
      message: 'Challenge résolu',
      challenge 
    });
  } catch (error) {
    console.error('Erreur /game/solve-challenge:', error);
    res.status(500).json({ message: 'Erreur lors de la résolution du challenge' });
  }
});

/* ====================================
   POST /game/preferences/save
   Sauvegarder les préférences (avatar)
==================================== */
router.post('/preferences/save', async (req, res) => {
  try {
    const userId = req.user.id;
    const { avatar } = req.body;

    const preferences = await db.saveUserPreferences(userId, { avatar });
    
    res.json({ 
      message: 'Préférences sauvegardées',
      preferences 
    });
  } catch (error) {
    console.error('Erreur /game/preferences/save:', error);
    res.status(500).json({ message: 'Erreur lors de la sauvegarde des préférences' });
  }
});

/* ====================================
   GET /game/preferences/load
   Charger les préférences (avatar)
==================================== */
router.get('/preferences/load', async (req, res) => {
  try {
    const userId = req.user.id;

    const preferences = await db.loadUserPreferences(userId);
    
    res.json({ 
      preferences: preferences || { avatar: 'hacker' }
    });
  } catch (error) {
    console.error('Erreur /game/preferences/load:', error);
    res.status(500).json({ message: 'Erreur lors du chargement des préférences' });
  }
});

module.exports = router;

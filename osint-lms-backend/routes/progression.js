// Routes backend COMPLETES pour tous les modules OSINT 2026
const express = require("express");
const router = express.Router();
const db = require("../services/neonDatabase");
const authMiddleware = require("../middlewares/authMiddleware");

// ========== INSTAGRAM OSINT ==========
router.get("/instagram-osint", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await db.query(
      "SELECT progress FROM module_progress WHERE user_id = $1 AND module_name = $2",
      [userId, "instagram-osint"]
    );
    if (result.rows.length > 0) {
      res.json({ progress: result.rows[0].progress });
    } else {
      res.json({ progress: null });
    }
  } catch (error) {
    console.error("Error loading Instagram OSINT progress:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

router.post("/instagram-osint", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { progress } = req.body;
    await db.query(
      `INSERT INTO module_progress (user_id, module_name, progress, updated_at)
       VALUES ($1, $2, $3, NOW())
       ON CONFLICT (user_id, module_name)
       DO UPDATE SET progress = $3, updated_at = NOW()`,
      [userId, "instagram-osint", progress]
    );
    res.json({ success: true });
  } catch (error) {
    console.error("Error saving Instagram OSINT progress:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// ========== FACEBOOK OSINT ==========
router.get("/facebook-osint", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await db.query(
      "SELECT progress FROM module_progress WHERE user_id = $1 AND module_name = $2",
      [userId, "facebook-osint"]
    );
    if (result.rows.length > 0) {
      res.json({ progress: result.rows[0].progress });
    } else {
      res.json({ progress: null });
    }
  } catch (error) {
    console.error("Error loading Facebook OSINT progress:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

router.post("/facebook-osint", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { progress } = req.body;
    await db.query(
      `INSERT INTO module_progress (user_id, module_name, progress, updated_at)
       VALUES ($1, $2, $3, NOW())
       ON CONFLICT (user_id, module_name)
       DO UPDATE SET progress = $3, updated_at = NOW()`,
      [userId, "facebook-osint", progress]
    );
    res.json({ success: true });
  } catch (error) {
    console.error("Error saving Facebook OSINT progress:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// ========== TIKTOK OSINT ==========
router.get("/tiktok-osint", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await db.query(
      "SELECT progress FROM module_progress WHERE user_id = $1 AND module_name = $2",
      [userId, "tiktok-osint"]
    );
    if (result.rows.length > 0) {
      res.json({ progress: result.rows[0].progress });
    } else {
      res.json({ progress: null });
    }
  } catch (error) {
    console.error("Error loading TikTok OSINT progress:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

router.post("/tiktok-osint", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { progress } = req.body;
    await db.query(
      `INSERT INTO module_progress (user_id, module_name, progress, updated_at)
       VALUES ($1, $2, $3, NOW())
       ON CONFLICT (user_id, module_name)
       DO UPDATE SET progress = $3, updated_at = NOW()`,
      [userId, "tiktok-osint", progress]
    );
    res.json({ success: true });
  } catch (error) {
    console.error("Error saving TikTok OSINT progress:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// ========== GOOGLE MAPS OSINT ==========
router.get("/googlemaps-osint", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await db.query(
      "SELECT progress FROM module_progress WHERE user_id = $1 AND module_name = $2",
      [userId, "googlemaps-osint"]
    );
    if (result.rows.length > 0) {
      res.json({ progress: result.rows[0].progress });
    } else {
      res.json({ progress: null });
    }
  } catch (error) {
    console.error("Error loading Google Maps OSINT progress:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

router.post("/googlemaps-osint", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { progress } = req.body;
    await db.query(
      `INSERT INTO module_progress (user_id, module_name, progress, updated_at)
       VALUES ($1, $2, $3, NOW())
       ON CONFLICT (user_id, module_name)
       DO UPDATE SET progress = $3, updated_at = NOW()`,
      [userId, "googlemaps-osint", progress]
    );
    res.json({ success: true });
  } catch (error) {
    console.error("Error saving Google Maps OSINT progress:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();
const db = require("../services/neonDatabase");
const authMiddleware = require("../middlewares/authMiddleware");

/* ====================================
   GET /admin/users
   Récupérer tous les utilisateurs (admin uniquement)
==================================== */
router.get("/users", authMiddleware, async (req, res) => {
  try {
    // Vérifier que c'est un admin
    if (req.user.role !== "admin" && req.user.username !== "Cyber_Admin") {
      return res.status(403).json({ success: false, message: "Accès refusé" });
    }

    // Récupérer tous les utilisateurs
    const result = await db.query(`
      SELECT 
        id, 
        username, 
        role, 
        created_at, 
        last_login, 
        blocked
      FROM utilisateurs 
      ORDER BY created_at DESC
    `);

    res.json({ success: true, users: result.rows });
  } catch (error) {
    console.error("❌ Erreur récupération utilisateurs:", error);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
});

/* ====================================
   GET /admin/stats
   Statistiques du panel admin
==================================== */
router.get("/stats", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin" && req.user.username !== "Cyber_Admin") {
      return res.status(403).json({ success: false, message: "Accès refusé" });
    }

    // Total utilisateurs
    const totalResult = await db.query("SELECT COUNT(*) as count FROM utilisateurs");
    const total = parseInt(totalResult.rows[0].count);

    // Nouveaux (7 jours)
    const newResult = await db.query(`
      SELECT COUNT(*) as count FROM utilisateurs 
      WHERE created_at >= NOW() - INTERVAL '7 days'
    `);
    const newThisWeek = parseInt(newResult.rows[0].count);

    // Actifs (24h)
    const activeResult = await db.query(`
      SELECT COUNT(*) as count FROM utilisateurs 
      WHERE last_login >= NOW() - INTERVAL '24 hours'
    `);
    const activeToday = parseInt(activeResult.rows[0].count);

    res.json({ 
      success: true,
      total,
      newThisWeek,
      activeToday
    });
  } catch (error) {
    console.error("❌ Erreur récupération stats:", error);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
});

/* ====================================
   PATCH /admin/block-user
   Bloquer/débloquer un utilisateur
==================================== */
router.patch("/block-user", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin" && req.user.username !== "Cyber_Admin") {
      return res.status(403).json({ success: false, message: "Accès refusé" });
    }

    const { userId, blocked } = req.body;

    await db.query(
      "UPDATE utilisateurs SET blocked = $1 WHERE id = $2",
      [blocked, userId]
    );

    res.json({ success: true });
  } catch (error) {
    console.error("❌ Erreur blocage utilisateur:", error);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
});

/* ====================================
   DELETE /admin/delete-user
   Supprimer un utilisateur
==================================== */
router.delete("/delete-user", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin" && req.user.username !== "Cyber_Admin") {
      return res.status(403).json({ success: false, message: "Accès refusé" });
    }

    const { userId } = req.body;

    // Empêcher la suppression de Cyber_Admin
    const userCheck = await db.query("SELECT username FROM utilisateurs WHERE id = $1", [userId]);
    if (userCheck.rows[0]?.username === "Cyber_Admin") {
      return res.status(403).json({ success: false, error: "Impossible de supprimer Cyber_Admin" });
    }

    await db.query("DELETE FROM utilisateurs WHERE id = $1", [userId]);

    res.json({ success: true });
  } catch (error) {
    console.error("❌ Erreur suppression utilisateur:", error);
    res.status(500).json({ success: false, error: "Erreur serveur" });
  }
});

/* ====================================
   POST /admin/reset-password
   Réinitialiser le mot de passe d'un utilisateur
==================================== */
router.post("/reset-password", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin" && req.user.username !== "Cyber_Admin") {
      return res.status(403).json({ success: false, message: "Accès refusé" });
    }

    const { userId } = req.body;

    // Générer un mot de passe temporaire
    const tempPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
    
    // Hasher le mot de passe
    const bcrypt = require("bcrypt");
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    // Mettre à jour
    await db.query(
      "UPDATE utilisateurs SET password = $1, must_change_password = 1 WHERE id = $2",
      [hashedPassword, userId]
    );

    res.json({ success: true, tempPassword });
  } catch (error) {
    console.error("❌ Erreur reset password:", error);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
});

module.exports = router;

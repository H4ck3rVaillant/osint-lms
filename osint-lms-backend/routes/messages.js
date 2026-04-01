const express = require("express");
const router = express.Router();
const db = require("../services/neonDatabase");
const authMiddleware = require("../middlewares/authMiddleware");

/* ====================================
   GET /messages/users
   Liste des utilisateurs pour la messagerie
==================================== */
router.get("/users", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    // Récupérer tous les utilisateurs sauf l'utilisateur connecté
    const result = await db.query(
      "SELECT id, username, created_at FROM utilisateurs WHERE id != $1 ORDER BY username ASC",
      [userId]
    );

    res.json({ 
      success: true, 
      users: result.rows 
    });
  } catch (error) {
    console.error("Erreur chargement utilisateurs:", error);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
});

/* ====================================
   GET /messages
   Liste des messages de l'utilisateur
==================================== */
router.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    // Récupérer les messages envoyés et reçus
    const result = await db.query(`
      SELECT 
        m.id,
        m.from_user_id,
        m.to_user_id,
        m.message,
        m.created_at,
        m.read,
        sender.username as from_username,
        receiver.username as to_username
      FROM messages m
      LEFT JOIN utilisateurs sender ON m.from_user_id = sender.id
      LEFT JOIN utilisateurs receiver ON m.to_user_id = receiver.id
      WHERE m.from_user_id = $1 OR m.to_user_id = $1
      ORDER BY m.created_at DESC
    `, [userId]);

    // Séparer received et sent
    const received = result.rows.filter(m => m.to_user_id === userId);
    const sent = result.rows.filter(m => m.from_user_id === userId);

    res.json({ 
      success: true, 
      received,
      sent
    });
  } catch (error) {
    console.error("Erreur chargement messages:", error);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
});

/* ====================================
   POST /messages/send
   Envoyer un message
==================================== */
router.post("/send", authMiddleware, async (req, res) => {
  try {
    const from_user_id = req.user.id;
    const { toUsername, message } = req.body;

    if (!toUsername || !message) {
      return res.status(400).json({ success: false, message: "Données manquantes" });
    }

    // Trouver l'ID de l'utilisateur destinataire
    const userResult = await db.query(
      "SELECT id FROM utilisateurs WHERE username = $1",
      [toUsername]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Utilisateur introuvable" });
    }

    const to_user_id = userResult.rows[0].id;

    const result = await db.query(
      "INSERT INTO messages (from_user_id, to_user_id, message) VALUES ($1, $2, $3) RETURNING *",
      [from_user_id, to_user_id, message]
    );

    res.json({ 
      success: true, 
      message: "Message envoyé",
      data: result.rows[0]
    });
  } catch (error) {
    console.error("Erreur envoi message:", error);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
});

/* ====================================
   POST /messages
   Envoyer un message (ancienne route)
==================================== */
router.post("/", authMiddleware, async (req, res) => {
  try {
    const from_user_id = req.user.id;
    const { to_user_id, message } = req.body;

    if (!to_user_id || !message) {
      return res.status(400).json({ success: false, message: "Données manquantes" });
    }

    const result = await db.query(
      "INSERT INTO messages (from_user_id, to_user_id, message) VALUES ($1, $2, $3) RETURNING *",
      [from_user_id, to_user_id, message]
    );

    res.json({ 
      success: true, 
      message: "Message envoyé",
      data: result.rows[0]
    });
  } catch (error) {
    console.error("Erreur envoi message:", error);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
});

/* ====================================
   PUT /messages/:id/read
   Marquer un message comme lu
==================================== */
router.put("/:id/read", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const messageId = req.params.id;

    await db.query(
      "UPDATE messages SET read = true WHERE id = $1 AND to_user_id = $2",
      [messageId, userId]
    );

    res.json({ success: true, message: "Message marqué comme lu" });
  } catch (error) {
    console.error("Erreur marquage message:", error);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
});

module.exports = router;

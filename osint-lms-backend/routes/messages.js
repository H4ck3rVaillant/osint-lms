const express = require("express");
const router = express.Router();
const db = require("../services/neonDatabase");
const authMiddleware = require("../middlewares/authMiddleware");

/* ====================================
   GET /messages
   Récupérer tous les messages de l'utilisateur
==================================== */
router.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    // Messages reçus
    const received = await db.query(
      `SELECT m.*, u.username as from_username 
       FROM messages m 
       JOIN utilisateurs u ON m.from_user_id = u.id 
       WHERE m.to_user_id = $1 
       ORDER BY m.created_at DESC`,
      [userId]
    );

    // Messages envoyés
    const sent = await db.query(
      `SELECT m.*, u.username as to_username 
       FROM messages m 
       JOIN utilisateurs u ON m.to_user_id = u.id 
       WHERE m.from_user_id = $1 
       ORDER BY m.created_at DESC`,
      [userId]
    );

    res.json({
      success: true,
      received: received.rows,
      sent: sent.rows
    });
  } catch (error) {
    console.error("❌ Erreur récupération messages:", error);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
});

/* ====================================
   POST /messages/send
   Envoyer un message
==================================== */
router.post("/send", authMiddleware, async (req, res) => {
  try {
    const fromUserId = req.user.id;
    const { toUsername, message } = req.body;

    if (!toUsername || !message) {
      return res.status(400).json({ success: false, message: "Username et message requis" });
    }

    // Trouver l'utilisateur destinataire
    const toUser = await db.query(
      "SELECT id FROM utilisateurs WHERE username = $1",
      [toUsername]
    );

    if (toUser.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Utilisateur introuvable" });
    }

    const toUserId = toUser.rows[0].id;

    // Insérer le message
    await db.query(
      "INSERT INTO messages (from_user_id, to_user_id, message) VALUES ($1, $2, $3)",
      [fromUserId, toUserId, message]
    );

    console.log(`✅ Message envoyé de ${req.user.username} à ${toUsername}`);

    res.json({ success: true, message: "Message envoyé" });
  } catch (error) {
    console.error("❌ Erreur envoi message:", error);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
});

/* ====================================
   PUT /messages/:id/read
   Marquer un message comme lu
==================================== */
router.put("/:id/read", authMiddleware, async (req, res) => {
  try {
    const messageId = req.params.id;
    const userId = req.user.id;

    await db.query(
      "UPDATE messages SET read = TRUE WHERE id = $1 AND to_user_id = $2",
      [messageId, userId]
    );

    res.json({ success: true });
  } catch (error) {
    console.error("❌ Erreur marquage lu:", error);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
});

/* ====================================
   GET /messages/users
   Récupérer la liste des utilisateurs (pour admin)
==================================== */
router.get("/users", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Accès interdit" });
    }

    const users = await db.query(
      "SELECT id, username, role, created_at FROM utilisateurs ORDER BY created_at DESC"
    );

    res.json({ success: true, users: users.rows });
  } catch (error) {
    console.error("❌ Erreur récupération utilisateurs:", error);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
});

module.exports = router;

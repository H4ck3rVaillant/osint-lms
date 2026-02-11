const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const blacklist = require('../middlewares/tokenBlacklist');
const audit = require('../middlewares/auditLogger');

router.post('/', auth, (req, res) => {
  const token = req.headers.authorization.split(' ')[1];

  blacklist.add(token);
  audit.logLogout(req.user.id, req.ip);
  audit.logTokenBlacklisted(req.user.id);

  res.json({ message: 'Déconnexion réussie' });
});

module.exports = router;

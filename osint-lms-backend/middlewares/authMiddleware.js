const jwt = require('jsonwebtoken');

/**
 * Middleware pour vérifier le token JWT
 * Ajoute req.user avec les infos de l'utilisateur si le token est valide
 */
function authMiddleware(req, res, next) {
  // Récupérer le token depuis le header Authorization
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'Token manquant' });
  }

  // Format attendu : "Bearer TOKEN"
  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Format de token invalide' });
  }

  try {
    // Vérifier et décoder le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret');

    // Vérifier que ce n'est pas un token temporaire (2FA non complété)
    if (decoded.step === 'awaiting_2fa') {
      return res.status(401).json({ message: 'Authentification 2FA requise' });
    }

    // Ajouter les infos utilisateur à la requête
    req.user = {
      id: decoded.id,
      username: decoded.username,
      role: decoded.role
    };

    next(); // Passer au middleware/route suivant
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expiré' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Token invalide' });
    }
    return res.status(500).json({ message: 'Erreur serveur' });
  }
}

module.exports = authMiddleware;

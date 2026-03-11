const jwt = require('jsonwebtoken');

/**
 * Middleware pour vérifier le token JWT
 * Ajoute req.user avec { id, username, role } si le token est valide
 */
function authMiddleware(req, res, next) {
  // Récupérer le token depuis le header Authorization
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token manquant ou invalide' });
  }

  const token = authHeader.split(' ')[1]; // Extraire le token après "Bearer "

  try {
    // Vérifier et décoder le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret');

    // Ajouter les infos utilisateur à la requête
    req.user = {
      id: decoded.id,
      username: decoded.username,
      role: decoded.role
    };

    next(); // Passer au middleware/route suivant
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Token invalide' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expiré' });
    }
    return res.status(500).json({ message: 'Erreur serveur lors de la vérification du token' });
  }
}

module.exports = authMiddleware;

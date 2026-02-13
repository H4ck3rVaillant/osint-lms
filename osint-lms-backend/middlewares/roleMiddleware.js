/**
 * Middleware pour vérifier le rôle de l'utilisateur
 * À utiliser APRÈS authMiddleware
 */
function roleMiddleware(requiredRole) {
  return (req, res, next) => {
    // req.user est défini par authMiddleware
    if (!req.user) {
      return res.status(401).json({ message: 'Non authentifié' });
    }

    if (req.user.role !== requiredRole) {
      return res.status(403).json({ 
        message: `Accès refusé. Rôle requis: ${requiredRole}` 
      });
    }

    next();
  };
}

module.exports = roleMiddleware;

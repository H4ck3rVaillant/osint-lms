const auditLog = require('../services/auditLogger');

module.exports = function auditMiddleware(req, res, next) {
  res.on('finish', () => {
    auditLog({
      userId: req.user?.id || 'anonymous',
      action: `${req.method} ${req.originalUrl}`,
      ip: req.ip,
      status: res.statusCode
    });
  });

  next();
};

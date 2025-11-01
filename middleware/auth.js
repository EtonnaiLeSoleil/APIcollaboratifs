const { verifyToken } = require('../utils/jwt');

exports.auth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ message: 'Token manquant' });
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return res.status(401).json({ message: 'Format Authorization invalide' });
  const token = parts[1];
  try {
    const payload = verifyToken(token);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token invalide ou expiré' });
  }
};

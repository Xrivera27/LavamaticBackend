// src/middleware/auth.js
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET no está definido en variables de entorno');
}

const authMiddleware = (roles = []) => {
  return (req, res, next) => {
    try {
      const token = req.headers.authorization?.split(' ')[1];

      if (!token) {
        return res.status(401).json({ error: 'Token requerido' });
      }

      const decoded = jwt.verify(token, JWT_SECRET);

      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({ error: 'No autorizado' });
      }

      req.user = decoded;
      next();
    } catch (error) {
      res.status(401).json({ error: 'Token inválido' });
    }
  };
};

module.exports = authMiddleware;
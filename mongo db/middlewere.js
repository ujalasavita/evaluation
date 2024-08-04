const jwt = require('jsonwebtoken');
const { BlacklistedToken } = require('./models');
const { jwtSecret } = require('./config');

module.exports = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  try {
    const blacklistedToken = await BlacklistedToken.findOne({ token });
    if (blacklistedToken) return res.status(401).json({ error: 'Token is blacklisted' });

    jwt.verify(token, jwtSecret, (err, decoded) => {
      if (err) return res.status(403).json({ error: 'Invalid token' });
      req.userId = decoded.id;
      next();
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

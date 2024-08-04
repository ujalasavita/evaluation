const jwt = require('jsonwebtoken');
const { User, BlacklistedToken } = require('./models');
const { jwtSecret, jwtExpire, jwtRefreshExpire } = require('./config');

// Generate JWT token
const generateToken = (userId, expiresIn) => {
  return jwt.sign({ id: userId }, jwtSecret, { expiresIn });
};

// Register
exports.register = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = new User({ email, password });
    await user.save();
    res.status(201).json({ message: 'User registered' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    const accessToken = generateToken(user._id, jwtExpire);
    const refreshToken = generateToken(user._id, jwtRefreshExpire);
    res.json({ accessToken, refreshToken });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Logout
exports.logout = async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(400).json({ error: 'No token provided' });

  try {
    const blacklistedToken = new BlacklistedToken({ token });
    await blacklistedToken.save();
    res.json({ message: 'Logged out' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Refresh Token
exports.refreshToken = async (req, res) => {
  const { refreshToken } = req.body;
  try {
    const blacklistedToken = await BlacklistedToken.findOne({ token: refreshToken });
    if (blacklistedToken) return res.status(401).json({ error: 'Refresh token is blacklisted' });

    jwt.verify(refreshToken, jwtSecret, (err, decoded) => {
      if (err) return res.status(403).json({ error: 'Invalid refresh token' });

      const newAccessToken = generateToken(decoded.id, jwtExpire);
      res.json({ accessToken: newAccessToken });
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

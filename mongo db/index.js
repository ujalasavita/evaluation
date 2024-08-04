require('dotenv').config();

module.exports = {
  mongoURI: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpire: process.env.JWT_EXPIRE,
  jwtRefreshExpire: process.env.JWT_REFRESH_EXPIRE,
  jwtBlacklistExpire: process.env.JWT_BLACKLIST_EXPIRE
};

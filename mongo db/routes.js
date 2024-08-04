const express = require('express');
const { register, login, logout, refreshToken } = require('./controllers');
const authMiddleware = require('./middleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', authMiddleware, logout);
router.post('/refresh-token', refreshToken);

module.exports = router;

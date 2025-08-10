const express = require('express');
const router = express.Router();
const { jwtAuthMiddleware} = require('../middleware/jwt.middlewares');
const { registerUser, loginUser, profileUser, changePassword } = require('../controller/user.controller');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', jwtAuthMiddleware, profileUser);
router.put('/profile/change-password', jwtAuthMiddleware, changePassword);

module.exports = router;
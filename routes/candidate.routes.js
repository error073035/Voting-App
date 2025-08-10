const express = require('express');
const router = express.Router();
const { jwtAuthMiddleware } = require('../middleware/jwt.middlewares');
const { createCandidate, updateCandidate, deleteCandidate } = require('../controller/candidate.controller');

router.post('/', jwtAuthMiddleware, createCandidate);
router.put('/:id', jwtAuthMiddleware, updateCandidate);
router.delete('/:id', jwtAuthMiddleware, deleteCandidate);

module.exports = router;
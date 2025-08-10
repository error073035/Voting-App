const express = require('express');
const router = express.Router();
const { jwtAuthMiddleware } = require('../middleware/jwt.middlewares');
const { createCandidate, updateCandidate, deleteCandidate, voteCandidate, voteCount } = require('../controller/candidate.controller');

router.post('/', jwtAuthMiddleware, createCandidate);
router.put('/:id', jwtAuthMiddleware, updateCandidate);
router.delete('/:id', jwtAuthMiddleware, deleteCandidate);
router.post('/vote/:id', jwtAuthMiddleware, voteCandidate);
router.get('/votes', voteCount);

module.exports = router;
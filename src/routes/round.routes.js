const express = require('express');
const router = express.Router();

const validate = require('../middleware/validate.errors');
const authMiddleware = require('../middleware/auth');
const roleMiddleware = require('../middleware/role');
const RoundController = require('../controllers/round.controller');

router.post('/group/:groupId/next-round', authMiddleware, roleMiddleware('Particulier'), validate, (req, res) => RoundController.createNextRound(req, res))

module.exports = router;
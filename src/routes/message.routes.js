const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/auth');
const roleMiddleware = require('../middleware/role');
const validate = require('../middleware/validate.errors');
const upload = require('../middleware/upload');
const MessageController = require('../controllers/message.controller');

// Send a message to a group
router.post('/group/:groupId/message', authMiddleware, roleMiddleware('Particulier'), upload.none(), validate, (req, res) => MessageController.sendToGroup(req, res));

// List messages in a group
router.get('/group/:groupId/messages', authMiddleware, roleMiddleware('Particulier'), (req, res) => MessageController.listGroupMessages(req, res));

module.exports = router;



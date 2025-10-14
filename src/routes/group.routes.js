const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');

const groupValidation = require('../middleware/group.validation');
const validate = require('../middleware/validate.errors');
const authMiddleware = require('../middleware/auth');
const roleMiddleware = require('../middleware/role');
const GroupController = require('../controllers/group.controller');

router.post('/group/store', authMiddleware, roleMiddleware('Particulier'), upload.none(), groupValidation(), validate, (req, res) => GroupController.store(req, res));
router.post('/group/:id/join', authMiddleware, roleMiddleware('Particulier'), upload.none(), validate, (req, res) => GroupController.joinGroup(req, res));
router.delete('/group/:id/leave', authMiddleware, roleMiddleware('Particulier'), upload.none(), validate, (req, res) => GroupController.leaveGroup(req, res));
router.patch('/group/:id/rules', authMiddleware, roleMiddleware('Particulier'), upload.none(), validate, (req, res) => GroupController.updateRules(req, res));

module.exports = router;


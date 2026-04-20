const express = require('express');
const router = express.Router();
const progressionController = require('../controllers/progressionController');
const { protect } = require('../middleware/auth');

router.get('/story', protect, progressionController.getProgressionStory);

module.exports = router;

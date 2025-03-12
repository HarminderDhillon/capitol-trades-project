const express = require('express');
const router = express.Router();
const configController = require('../controllers/config.controller');

// Get current configuration
router.get('/', configController.getConfig);

// Update configuration
router.put('/', configController.updateConfig);

// Clear cache
router.post('/clear-cache', configController.clearCache);

module.exports = router; 
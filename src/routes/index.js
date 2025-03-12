const express = require('express');
const router = express.Router();
const tradeRoutes = require('./trade.routes');
const configRoutes = require('./config.routes');
const cache = require('../middleware/cache');

// API information endpoint
router.get('/', (req, res) => {
  res.json({
    name: 'Capitol Trades API',
    version: '1.0.0',
    endpoints: {
      '/': 'API information',
      '/health': 'Health check',
      '/trades': 'Get all trades with optional filtering',
      '/trades/size/:tradeSize': 'Get trades for a specific trade size',
      '/trades/by-politician/:politicianId': 'Get trades by politician',
      '/trades/official/:officialId': 'Alias for by-politician endpoint',
      '/trades/by-ticker/:ticker': 'Get trades by ticker symbol',
      '/trades/ticker/:ticker': 'Alias for by-ticker endpoint',
      '/config': 'View current configuration',
      '/config/clear-cache': 'Clear the API cache'
    }
  });
});

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    status: 'UP',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Apply routes
router.use('/trades', tradeRoutes);
router.use('/config', configRoutes);

// 404 handler
router.use('*', (req, res) => {
  res.status(404).json({
    error: {
      message: 'Resource not found',
      status: 404
    }
  });
});

module.exports = router; 
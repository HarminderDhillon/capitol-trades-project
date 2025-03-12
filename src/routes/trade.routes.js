const express = require('express');
const router = express.Router();
const tradeController = require('../controllers/trade.controller');
const { cache } = require('../middleware/cache');

// Get all trades with optional filtering
router.get('/', cache(), tradeController.getAllTrades);

// Get trades for a specific trade size
router.get('/size/:tradeSize', cache(), tradeController.getTradesBySize);

// Get trades by politician
router.get('/by-politician/:politicianId', cache(), tradeController.getTradesByPolitician);

// Alias for by-politician endpoint
router.get('/official/:officialId', cache(), tradeController.getTradesByPolitician);

// Get trades by ticker symbol
router.get('/by-ticker/:ticker', cache(), tradeController.getTradesByTicker);

// Alias for by-ticker endpoint
router.get('/ticker/:ticker', cache(), tradeController.getTradesByTicker);

module.exports = router; 
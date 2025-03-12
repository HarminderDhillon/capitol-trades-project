const logger = require('../utils/logger');
const scraper = require('../services/scraper.service');
const Joi = require('joi');

// Query parameter validation schema
const querySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(parseInt(process.env.DEFAULT_PAGE_SIZE) || 25),
  sortBy: Joi.string().valid('date', 'size', 'politician', 'ticker').default('date'),
  order: Joi.string().valid('asc', 'desc').default('desc'),
  startDate: Joi.date().iso(),
  endDate: Joi.date().iso().min(Joi.ref('startDate'))
});

/**
 * Get all trades with optional filtering
 */
exports.getAllTrades = async (req, res, next) => {
  try {
    // Validate query parameters
    const { error, value } = querySchema.validate(req.query);
    if (error) {
      return res.status(400).json({
        error: {
          message: error.message,
          status: 400
        }
      });
    }

    const trades = await scraper.getAllTrades(value);
    res.json(trades);
  } catch (err) {
    next(err);
  }
};

/**
 * Get trades by size
 */
exports.getTradesBySize = async (req, res, next) => {
  try {
    const { tradeSize } = req.params;
    const { error, value } = querySchema.validate(req.query);
    if (error) {
      return res.status(400).json({
        error: {
          message: error.message,
          status: 400
        }
      });
    }

    const trades = await scraper.getTradesBySize(tradeSize, value);
    res.json(trades);
  } catch (err) {
    next(err);
  }
};

/**
 * Get trades by politician
 */
exports.getTradesByPolitician = async (req, res, next) => {
  try {
    const politicianId = req.params.politicianId || req.params.officialId;
    const { error, value } = querySchema.validate(req.query);
    if (error) {
      return res.status(400).json({
        error: {
          message: error.message,
          status: 400
        }
      });
    }

    const trades = await scraper.getTradesByPolitician(politicianId, value);
    res.json(trades);
  } catch (err) {
    next(err);
  }
};

/**
 * Get trades by ticker
 */
exports.getTradesByTicker = async (req, res, next) => {
  try {
    const { ticker } = req.params;
    const { error, value } = querySchema.validate(req.query);
    if (error) {
      return res.status(400).json({
        error: {
          message: error.message,
          status: 400
        }
      });
    }

    const trades = await scraper.getTradesByTicker(ticker.toUpperCase(), value);
    res.json(trades);
  } catch (err) {
    next(err);
  }
}; 
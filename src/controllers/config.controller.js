const { clearCache, getCacheStats } = require('../middleware/cache');
const logger = require('../utils/logger');
const Joi = require('joi');

// Configuration schema for validation
const configSchema = Joi.object({
  DEFAULT_PAGE_SIZE: Joi.number().integer().min(1).max(100),
  DEFAULT_TRADE_SIZES: Joi.string(),
  DEFAULT_ASSET_TYPE: Joi.string(),
  CACHE_ENABLED: Joi.boolean().truthy('true').falsy('false'),
  CACHE_TTL: Joi.number().integer().min(1),
  RATE_LIMIT_WINDOW_MS: Joi.number().integer().min(1000),
  RATE_LIMIT_MAX_REQUESTS: Joi.number().integer().min(1),
  MAX_RETRIES: Joi.number().integer().min(0),
  RETRY_DELAY_MS: Joi.number().integer().min(100),
  LOG_LEVEL: Joi.string().valid('error', 'warn', 'info', 'debug')
});

/**
 * Get current configuration
 */
exports.getConfig = (req, res) => {
  // Return safe configuration parameters (not sensitive ones)
  const config = {
    DEFAULT_PAGE_SIZE: process.env.DEFAULT_PAGE_SIZE,
    DEFAULT_TRADE_SIZES: process.env.DEFAULT_TRADE_SIZES,
    DEFAULT_ASSET_TYPE: process.env.DEFAULT_ASSET_TYPE,
    CACHE_ENABLED: process.env.CACHE_ENABLED === 'true',
    CACHE_TTL: parseInt(process.env.CACHE_TTL) || 3600,
    RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 60000,
    RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
    MAX_RETRIES: parseInt(process.env.MAX_RETRIES) || 3,
    RETRY_DELAY_MS: parseInt(process.env.RETRY_DELAY_MS) || 1000,
    LOG_LEVEL: process.env.LOG_LEVEL || 'info'
  };

  // If in development mode, include cache stats
  if (process.env.NODE_ENV === 'development') {
    config.cacheStats = getCacheStats();
  }

  res.json(config);
};

/**
 * Update configuration (only in development mode)
 */
exports.updateConfig = (req, res) => {
  // Only allow updating configuration in development mode
  if (process.env.NODE_ENV !== 'development') {
    return res.status(403).json({
      error: {
        message: 'Configuration updates are only allowed in development mode',
        status: 403
      }
    });
  }

  // Validate the configuration
  const { error, value } = configSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      error: {
        message: error.message,
        status: 400
      }
    });
  }

  // Update environment variables
  Object.keys(value).forEach(key => {
    process.env[key] = value[key].toString();
  });

  logger.info(`Configuration updated: ${JSON.stringify(value)}`);
  
  res.json({
    success: true,
    message: 'Configuration updated',
    config: value
  });
};

/**
 * Clear the cache
 */
exports.clearCache = (req, res) => {
  const result = clearCache();
  logger.info('Cache cleared');
  res.json(result);
}; 
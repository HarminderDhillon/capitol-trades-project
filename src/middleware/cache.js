const cache = require('memory-cache');
const logger = require('../utils/logger');

// Default cache TTL in seconds
const DEFAULT_CACHE_TTL = parseInt(process.env.CACHE_TTL) || 3600;

/**
 * Cache middleware factory function
 * @param {number} ttl - Time to live in seconds
 * @returns {Function} Express middleware function
 */
function cacheMiddleware(ttl = DEFAULT_CACHE_TTL) {
  return (req, res, next) => {
    // Skip cache if disabled or in development with cache skip flag
    if (
      process.env.CACHE_ENABLED === 'false' ||
      (req.query.skipCache === 'true' && process.env.NODE_ENV === 'development')
    ) {
      logger.debug('Cache skipped');
      return next();
    }

    // Generate a unique cache key based on the request path and query params
    const key = `__cache__${req.originalUrl || req.url}`;
    const cachedResponse = cache.get(key);

    if (cachedResponse) {
      logger.debug(`Cache hit for ${key}`);
      return res.send(cachedResponse);
    }

    // Store the original send function
    const originalSend = res.send;

    // Override the send function to cache the response
    res.send = function(body) {
      // Only cache successful responses
      if (res.statusCode >= 200 && res.statusCode < 300) {
        logger.debug(`Caching response for ${key} with TTL ${ttl}s`);
        cache.put(key, body, ttl * 1000);
      }
      
      // Call the original send function
      originalSend.call(this, body);
    };

    next();
  };
}

/**
 * Clear the entire cache
 */
function clearCache() {
  logger.info('Clearing entire cache');
  cache.clear();
  return { success: true, message: 'Cache cleared successfully' };
}

/**
 * Get cache stats
 */
function getCacheStats() {
  const keys = cache.keys();
  return {
    count: keys.length,
    keys: keys,
    size: JSON.stringify(cache.exportJson()).length
  };
}

module.exports = {
  cache: cacheMiddleware,
  clearCache,
  getCacheStats
}; 
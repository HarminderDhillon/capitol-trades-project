require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const { rateLimit } = require('express-rate-limit');
const routes = require('./routes');
const logger = require('./utils/logger');

// Validate that PORT is 3001
const PORT = process.env.PORT || 3001;
if (PORT !== '3001') {
  logger.error('ERROR: PORT must be 3001');
  process.exit(1);
}

const app = express();

// Apply security middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Apply rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 60000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests, please try again later.'
});
app.use(limiter);

// Apply routes
app.use('/', routes);

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(`Error: ${err.message}`);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal server error',
      status: err.status || 500
    }
  });
});

// Start the server
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV}`);
}); 
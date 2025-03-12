# Capitol Trades Scraper Project

## Project Overview

This project requires creating a Node.js application that scrapes politician stock trading data from Capitol Trades (https://www.capitoltrades.com/trades) and exposes it through a RESTful API. The application must be containerized with Docker, support hot reloading for development, and strictly operate on port 3001.

## Technology Stack

- **Backend**: Node.js with Express
- **Scraping**: Puppeteer (required technology)
- **Containerization**: Docker with hot reload support
- **Caching**: In-memory caching for performance
- **API Security**: Rate limiting, Helmet for headers

## Project Structure

Set up a Node.js project with the following structure:

```
/
├── src/                  # Main source code directory
│   ├── controllers/      # API route controllers
│   ├── middleware/       # Express middleware (rate limiting, caching, etc.)
│   ├── services/         # Business logic and scraping functionality
│   ├── utils/            # Utility functions
│   ├── config/           # Configuration management
│   └── routes/           # API route definitions
├── docker/               # Docker-related files
├── .env                  # Environment variables
├── .env.example          # Example environment variables
├── Dockerfile            # Docker configuration
└── docker-compose.yml    # Docker Compose configuration
```

## Core Dependencies

Include these key dependencies:

- Express for the API server
- Puppeteer for web scraping
- node-cache or memory-cache for caching
- express-rate-limit for rate limiting
- winston for logging
- dotenv for configuration
- nodemon for hot reloading
- cors for CORS support
- helmet for security headers
- joi for validation

## Core Functionality

### Web Scraper

Implement a web scraper using Puppeteer that can:

- Navigate to https://www.capitoltrades.com/trades
- Scrape trade data including politician name, ticker, trade type, size, date
- Handle pagination to get multiple pages of trades
- Parse the data into a structured format
- Implement retry logic for resilience against network issues or site changes

### API Endpoints

Create an API with the following endpoints:

- `GET /` - API information and available endpoints
- `GET /health` - Health check endpoint
- `GET /trades` - Get all trades with optional filtering
- `GET /trades/size/:tradeSize` - Get trades for a specific trade size
- `GET /trades/by-politician/:politicianId` - Get trades by politician
- `GET /trades/official/:officialId` - Alias for by-politician endpoint
- `GET /trades/by-ticker/:ticker` - Get trades by ticker symbol
- `GET /trades/ticker/:ticker` - Alias for by-ticker endpoint
- `GET /config` - View current configuration
- `PUT /config` - Update configuration
- `POST /config/clear-cache` - Clear the API cache

### Caching Implementation

Implement caching to reduce load on Capitol Trades:

- Cache API responses based on query parameters
- Support force refresh with query parameter
- Configurable cache TTL

### Rate Limiting

Add rate limiting to prevent abuse:

- Limit requests per IP address
- Configurable window and max requests

### Error Handling and Logging

Implement error handling and logging:

- Graceful error handling for scraping failures
- Retry mechanism for failed requests
- Comprehensive logging with different levels
- Request ID tracking

## Critical Configuration Requirements

### Port Configuration

- The application MUST run on port 3001
- This port binding must be explicitly set in environment variables, Docker Compose, and server initialization
- Under no circumstances should this port be changed

### Environment Variables

The application should be configurable through environment variables:

- `NODE_ENV` - Environment (development, production)
- `PORT` - Port to run the server on (must be 3001)
- `DEFAULT_PAGE_SIZE` - Default number of trades per page
- `DEFAULT_TRADE_SIZES` - Default trade sizes to filter by
- `DEFAULT_ASSET_TYPE` - Default asset type to filter by
- `CACHE_ENABLED` - Enable/disable caching (default: true)
- `CACHE_TTL` - Cache time-to-live in seconds (default: 3600)
- `RATE_LIMIT_WINDOW_MS` - Rate limit window in milliseconds (default: 60000)
- `RATE_LIMIT_MAX_REQUESTS` - Maximum requests per window (default: 100)
- `MAX_RETRIES` - Maximum retries for failed requests (default: 3)
- `RETRY_DELAY_MS` - Delay between retries in milliseconds (default: 1000)
- `LOG_LEVEL` - Logging level (default: info)

## Docker Setup

### Dockerfile

Create a Dockerfile that:

- Uses Node.js Alpine as base image
- Installs Puppeteer dependencies
- Sets up the application
- Exposes port 3001
- Runs the application

### Docker Compose

Create a docker-compose.yml that:

- Builds the application from the Dockerfile
- Maps port 3001 to the host machine
- Sets up volumes for hot reloading
- Configures environment variables
- Implements health checks
- Configures restart policy

## Puppeteer Implementation

Configure Puppeteer with:

- Recommended performance settings
- Proper error handling and retries
- User agent rotation for reliability
- Resource optimization by intercepting unnecessary requests

## Development Features

### Hot Reloading

Set up hot reloading for development:

- Configure nodemon for development
- Watch for file changes
- Restart the server automatically

### Development Scripts

Include development scripts in package.json:

- `dev`: Start with nodemon for hot reloading
- `start`: Start production server
- `lint`: Run linting
- `test`: Run tests

## Architectural Principles

- **Separation of Concerns**: Keep routes, utilities, and configuration in separate modules
- **DRY Principle**: Use utility functions to avoid repetition
- **Stateless Design**: The API should be stateless except for caching
- **Error Resilience**: Implement retries and comprehensive error handling
- **Performance First**: Use caching and optimization techniques

## Security Considerations

- Implement proper security headers using Helmet
- Configure CORS appropriately
- Validate and sanitize inputs
- Use rate limiting to prevent abuse
- Implement appropriate error handling

## Testing Guidelines

- Verify the application starts correctly
- Confirm scraping works as expected
- Validate all API endpoints
- Ensure port 3001 is properly bound
- Test hot reloading during development

## Launch Instructions

To run the project:

1. Clone the repository
2. Build the Docker container
3. Start the application with Docker Compose
4. Access the API at http://localhost:3001

# Capitol Trades Scraper API

A Node.js application that scrapes politician stock trading data from Capitol Trades and exposes it through a RESTful API.

## Features

- Scrapes real-time trading data from Capitol Trades
- RESTful API endpoints for accessing trade data
- Filtering by politician, ticker, and trade size
- Caching for improved performance
- Rate limiting for API protection
- Docker containerization with hot reload
- Comprehensive error handling and logging

## Prerequisites

- Docker
- Docker Compose

## Quick Start

1. Clone the repository:
```bash
git clone <repository-url>
cd capitol-trades-project
```

2. Create a `.env` file (or copy from `.env.example`):
```bash
cp .env.example .env
```

3. Start the application:
```bash
docker-compose up
```

The API will be available at `http://localhost:3001`.

## API Endpoints

### Base URL: `http://localhost:3001`

- `GET /` - API information and available endpoints
- `GET /health` - Health check endpoint
- `GET /trades` - Get all trades with optional filtering
- `GET /trades/size/:tradeSize` - Get trades for a specific trade size
- `GET /trades/by-politician/:politicianId` - Get trades by politician
- `GET /trades/official/:officialId` - Alias for by-politician endpoint
- `GET /trades/by-ticker/:ticker` - Get trades by ticker symbol
- `GET /trades/ticker/:ticker` - Alias for by-ticker endpoint
- `GET /config` - View current configuration
- `PUT /config` - Update configuration (development only)
- `POST /config/clear-cache` - Clear the API cache

### Query Parameters

All trade endpoints support the following query parameters:

- `page` (integer, default: 1) - Page number
- `limit` (integer, default: 25, max: 100) - Results per page
- `sortBy` (string) - Sort field (date, size, politician, ticker)
- `order` (string) - Sort order (asc, desc)
- `startDate` (ISO date) - Filter by start date
- `endDate` (ISO date) - Filter by end date
- `skipCache` (boolean) - Skip cache (development only)

## Configuration

Configuration is managed through environment variables:

- `NODE_ENV` - Environment (development, production)
- `PORT` - Server port (must be 3001)
- `DEFAULT_PAGE_SIZE` - Default number of trades per page
- `DEFAULT_TRADE_SIZES` - Default trade sizes to filter by
- `DEFAULT_ASSET_TYPE` - Default asset type to filter by
- `CACHE_ENABLED` - Enable/disable caching
- `CACHE_TTL` - Cache time-to-live in seconds
- `RATE_LIMIT_WINDOW_MS` - Rate limit window in milliseconds
- `RATE_LIMIT_MAX_REQUESTS` - Maximum requests per window
- `MAX_RETRIES` - Maximum retries for failed requests
- `RETRY_DELAY_MS` - Delay between retries in milliseconds
- `LOG_LEVEL` - Logging level (error, warn, info, debug)

## Development

The application uses Docker with hot reload for development. Any changes to the source code will automatically restart the server.

### Logs

Logs are stored in the `logs` directory:
- `logs/error.log` - Error logs only
- `logs/combined.log` - All logs

### Cache Management

- Cache can be disabled by setting `CACHE_ENABLED=false`
- Cache can be bypassed per request using `?skipCache=true` (development only)
- Cache can be cleared using the `/config/clear-cache` endpoint

## Error Handling

The API uses standard HTTP status codes:
- 200: Success
- 400: Bad Request (invalid parameters)
- 403: Forbidden (e.g., configuration updates in production)
- 404: Not Found
- 429: Too Many Requests (rate limit exceeded)
- 500: Internal Server Error

## Security

- CORS enabled
- Helmet.js for security headers
- Rate limiting per IP
- Input validation using Joi
- Production security measures in Docker

## License

MIT 
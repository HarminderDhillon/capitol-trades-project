# Capitol Trades Project

A project to scrape and analyze congressional trading data using Node.js, Express, and n8n for workflow automation.

## Features

- Express API for data access and management
- n8n workflow integration for automated data processing
- Docker containerization for easy deployment
- PostgreSQL database for data storage

## Setup

1. Clone the repository
2. Copy `.env.example` to `.env` and configure environment variables
3. Run `docker-compose up -d` to start all services
4. Access n8n at `http://localhost:5678`
5. Access the API at `http://localhost:3001`
6. Import the n8n workflow from `n8n-workflows/capitol-trades-workflow.json`

## Architecture

The project consists of three main components:
- Express API server for data management
- n8n instance for workflow automation
- PostgreSQL database for data storage

All components are containerized using Docker and can be deployed together using docker-compose.

## n8n Workflows

The project includes automated workflows built with n8n:

### Capitol Trades Scraper Workflow
Located in `n8n-workflows/capitol-trades-workflow.json`

This workflow:
- Makes HTTP requests to the Capitol Trades API
- Processes and transforms the trade data
- Stores the results in the PostgreSQL database
- Runs on a scheduled basis

To import the workflow:
1. Access n8n at http://localhost:5678
2. Click "Workflows" in the sidebar
3. Click the "Import from File" button
4. Select the workflow JSON file from the n8n-workflows directory
5. Configure any necessary credentials or settings

## Development

To start development:

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

## Environment Variables

Required environment variables:
- `NODE_ENV`: Environment (development/production)
- `PORT`: API server port
- `DB_HOST`: Database host
- `DB_PORT`: Database port
- `DB_NAME`: Database name
- `DB_USER`: Database user
- `DB_PASSWORD`: Database password

See `.env.example` for all available options. 
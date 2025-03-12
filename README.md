# Capitol Trades Project

A comprehensive system for tracking and monitoring congressional trading activities using Node.js, Express, Puppeteer, and n8n for workflow automation.

## 🚀 Features

- **Automated Trade Data Collection**: Hourly collection of congressional trading data
- **Health Monitoring**: System health checks every 15 minutes
- **API Integration**: RESTful API endpoints for data access and management
- **Workflow Automation**: n8n workflows for orchestration and monitoring

## 🏗️ Architecture

The project consists of several components:

1. **API Server**: Node.js/Express backend service
2. **Database**: PostgreSQL for data persistence
3. **Workflow Automation**: n8n for scheduling and monitoring
4. **Docker**: Containerization for all services

## 🛠️ Tech Stack

- Node.js & Express
- PostgreSQL
- n8n for workflow automation
- Docker & Docker Compose
- Puppeteer for web scraping

## 📦 Project Structure

```
.
├── app/                    # Main application code
├── docker/                 # Docker configuration files
├── n8n-workflows/         # n8n workflow definitions
├── scripts/               # Utility scripts
└── docker-compose.yml     # Docker services configuration
```

## 🚀 Getting Started

### Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local development)
- Git

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/capitol-trades-project.git
   cd capitol-trades-project
   ```

2. Start the services:
   ```bash
   docker-compose up -d
   ```

3. Access the services:
   - n8n: http://localhost:5678
   - API: http://localhost:3001

## 🔄 Workflows

### 1. Capitol Trades API Test
- Manual trigger for API connectivity testing
- Basic health check of the API endpoint
- Error reporting and status monitoring

### 2. Scheduled Trade Data Collection
- Runs every hour
- Fetches latest trade data
- Includes error handling and success reporting
- Tracks number of trades collected

### 3. Health Monitor
- Runs every 15 minutes
- Monitors system health
- Timestamps all health checks
- Error reporting for system issues

## 🛡️ Environment Variables

Required environment variables:

```env
NODE_ENV=development
DB_HOST=db
DB_PORT=5432
DB_NAME=capitol_trades
DB_USER=postgres
DB_PASSWORD=your_password
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 
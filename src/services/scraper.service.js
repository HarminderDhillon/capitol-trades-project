const puppeteer = require('puppeteer');
const logger = require('../utils/logger');

// Base URL for Capitol Trades
const BASE_URL = 'https://www.capitoltrades.com/trades';

// Puppeteer browser instance
let browser = null;

/**
 * Initialize browser instance
 */
async function initBrowser() {
  if (!browser) {
    logger.info('Initializing Puppeteer browser');
    browser = await puppeteer.launch({
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
        '--window-size=1920x1080'
      ],
      headless: 'new'
    });
  }
  return browser;
}

/**
 * Get a new page with default configuration
 */
async function getPage() {
  const browser = await initBrowser();
  const page = await browser.newPage();
  
  // Set viewport and user agent
  await page.setViewport({ width: 1920, height: 1080 });
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
  
  // Block unnecessary resources
  await page.setRequestInterception(true);
  page.on('request', (req) => {
    if (['image', 'stylesheet', 'font'].includes(req.resourceType())) {
      req.abort();
    } else {
      req.continue();
    }
  });

  return page;
}

/**
 * Retry mechanism for failed requests
 */
async function withRetry(fn, maxRetries = parseInt(process.env.MAX_RETRIES) || 3) {
  let lastError;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      logger.warn(`Attempt ${i + 1}/${maxRetries} failed: ${error.message}`);
      await new Promise(resolve => setTimeout(resolve, parseInt(process.env.RETRY_DELAY_MS) || 1000));
    }
  }
  
  throw lastError;
}

/**
 * Extract trade data from the page
 */
async function extractTradeData(page) {
  return await page.evaluate(() => {
    const trades = [];
    const rows = document.querySelectorAll('table tbody tr');
    
    rows.forEach(row => {
      const trade = {
        politician: row.querySelector('[data-th="Politician"]')?.textContent?.trim(),
        ticker: row.querySelector('[data-th="Ticker"]')?.textContent?.trim(),
        company: row.querySelector('[data-th="Company"]')?.textContent?.trim(),
        tradeType: row.querySelector('[data-th="Trade Type"]')?.textContent?.trim(),
        tradeSize: row.querySelector('[data-th="Trade Size"]')?.textContent?.trim(),
        traded: row.querySelector('[data-th="Traded"]')?.textContent?.trim(),
        disclosed: row.querySelector('[data-th="Disclosed"]')?.textContent?.trim()
      };
      trades.push(trade);
    });

    return trades;
  });
}

/**
 * Build URL with filters
 */
function buildUrl(baseUrl, filters = {}) {
  const url = new URL(baseUrl);
  Object.entries(filters).forEach(([key, value]) => {
    if (value) url.searchParams.append(key, value);
  });
  return url.toString();
}

/**
 * Get all trades with optional filtering
 */
exports.getAllTrades = async (filters) => {
  return await withRetry(async () => {
    const page = await getPage();
    try {
      const url = buildUrl(BASE_URL, filters);
      logger.info(`Fetching trades from ${url}`);
      
      await page.goto(url, { waitUntil: 'networkidle0' });
      await page.waitForSelector('table tbody tr');
      
      const trades = await extractTradeData(page);
      return {
        page: filters.page,
        limit: filters.limit,
        trades
      };
    } finally {
      await page.close();
    }
  });
};

/**
 * Get trades by size
 */
exports.getTradesBySize = async (tradeSize, filters) => {
  filters.size = tradeSize;
  return await exports.getAllTrades(filters);
};

/**
 * Get trades by politician
 */
exports.getTradesByPolitician = async (politicianId, filters) => {
  filters.politician = politicianId;
  return await exports.getAllTrades(filters);
};

/**
 * Get trades by ticker
 */
exports.getTradesByTicker = async (ticker, filters) => {
  filters.ticker = ticker;
  return await exports.getAllTrades(filters);
};

// Cleanup on process exit
process.on('exit', async () => {
  if (browser) {
    await browser.close();
  }
}); 
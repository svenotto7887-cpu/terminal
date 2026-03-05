const express = require('express');

// Factory function that creates router with injected marketDataService
function createMarketRouter(marketDataService) {
  const router = express.Router();

  // GET /api/market/search?q=BTC
  router.get('/search', async (req, res) => {
    try {
      const { q } = req.query;
      if (!q || q.length < 1) {
        return res.status(400).json({ error: 'Query parameter required' });
      }

      const results = await marketDataService.searchTicker(q);
      res.json(results);
    } catch (error) {
      console.error('Search error:', error);
      res.status(500).json({ error: 'Search failed' });
    }
  });

  // GET /api/market/ticker/:symbol
  router.get('/ticker/:symbol', async (req, res) => {
    try {
      const { symbol } = req.params;
      const { type } = req.query; // Optional: 'crypto', 'stock', 'forex'

      const ticker = await marketDataService.getTicker(symbol, type);
      if (!ticker) {
        return res.status(404).json({ error: 'Ticker not found' });
      }

      res.json(ticker);
    } catch (error) {
      console.error('Ticker error:', error);
      res.status(500).json({ error: 'Failed to fetch ticker' });
    }
  });

  // GET /api/market/price/:symbol
  router.get('/price/:symbol', async (req, res) => {
    try {
      const { symbol } = req.params;
      const { type } = req.query;

      const price = await marketDataService.getPrice(symbol, type);
      res.json({ symbol, price });
    } catch (error) {
      console.error('Price error:', error);
      res.status(500).json({ error: 'Failed to fetch price' });
    }
  });

  // GET /api/market/candles/:symbol?interval=1d&limit=200
  router.get('/candles/:symbol', async (req, res) => {
    try {
      const { symbol } = req.params;
      const { interval = '1d', limit = '200', type } = req.query;

      const candles = await marketDataService.getCandles(
        symbol,
        interval,
        parseInt(limit),
        type
      );

      if (candles.length === 0) {
        return res.status(404).json({ 
          error: `No data available for ${symbol}. Currently only supporting CoinGecko crypto data (BTC, ETH, SOL, etc.). To add stock data, configure Finnhub API key or Polygon.io API key.`
        });
      }

      res.json({
        symbol,
        interval,
        candles,
        count: candles.length
      });
    } catch (error) {
      console.error('Candles error:', error);
      res.status(500).json({ error: 'Failed to fetch candles' });
    }
  });

  // GET /api/market/providers
  router.get('/providers', (_req, res) => {
    try {
      const providers = marketDataService.getAvailableProviders();
      res.json(providers);
    } catch (error) {
      console.error('Providers error:', error);
      res.status(500).json({ error: 'Failed to fetch providers' });
    }
  });

  return router;
}

module.exports = { createMarketRouter };

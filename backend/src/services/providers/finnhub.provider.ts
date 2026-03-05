const axios = require('axios');

const FINNHUB_API = 'https://finnhub.io/api/v1';

class FinnhubProvider {
  constructor(apiKey) {
    this.name = 'Finnhub';
    this.supportedTypes = ['stock', 'forex'];
    this.apiKey = apiKey; // Required for Finnhub
    this.cache = new Map();
    this.cacheExpiry = 60000; // 1 minute
  }

  isConfigured() {
    return !!this.apiKey;
  }

  async searchTicker(query) {
    if (!this.isConfigured()) {
      console.warn('Finnhub not configured - set FINNHUB_API_KEY environment variable');
      return [];
    }

    try {
      const res = await axios.get(`${FINNHUB_API}/search`, {
        params: {
          q: query,
          token: this.apiKey
        },
        timeout: 5000
      });

      return res.data.result?.slice(0, 10).map(item => ({
        symbol: item.symbol,
        name: item.description,
        type: item.type === 'forex' ? 'forex' : 'stock',
        lastPrice: 0
      })) || [];
    } catch (error) {
      console.error('Finnhub search error:', error.message);
      return [];
    }
  }

  async getPrice(symbol) {
    if (!this.isConfigured()) return 0;

    try {
      const cacheKey = `price-${symbol}`;
      
      if (this.cache.has(cacheKey)) {
        const cached = this.cache.get(cacheKey);
        if (Date.now() - cached.timestamp < this.cacheExpiry) {
          return cached.price;
        }
      }

      const res = await axios.get(`${FINNHUB_API}/quote`, {
        params: { symbol, token: this.apiKey },
        timeout: 5000
      });

      const price = res.data.c || 0; // current price
      this.cache.set(cacheKey, { price, timestamp: Date.now() });
      return price;
    } catch (error) {
      console.error('Finnhub price error:', error.message);
      return 0;
    }
  }

  async getCandles(symbol, interval, limit = 200) {
    if (!this.isConfigured()) return [];

    try {
      // Map intervals to Finnhub resolution
      const resolutionMap = {
        '1m': '1',
        '5m': '5',
        '15m': '15',
        '1h': '60',
        '4h': '240',
        '1d': 'D'
      };

      const resolution = resolutionMap[interval] || 'D';
      
      // Calculate from/to timestamps (last 100 days)
      const to = Math.floor(Date.now() / 1000);
      const from = to - (100 * 24 * 3600);

      const res = await axios.get(`${FINNHUB_API}/stock/candle`, {
        params: {
          symbol,
          resolution,
          from,
          to,
          token: this.apiKey
        },
        timeout: 5000
      });

      if (!res.data.o) return [];

      return res.data.o.map((open, i) => ({
        timestamp: res.data.t[i] * 1000, // Convert to ms
        open,
        high: res.data.h[i],
        low: res.data.l[i],
        close: res.data.c[i],
        volume: res.data.v[i] || 0
      })).slice(0, limit);
    } catch (error) {
      console.error('Finnhub candles error:', error.message);
      return [];
    }
  }

  async getTicker(symbol) {
    if (!this.isConfigured()) return null;

    try {
      const res = await axios.get(`${FINNHUB_API}/quote`, {
        params: { symbol, token: this.apiKey },
        timeout: 5000
      });

      return {
        symbol,
        name: symbol,
        type: 'stock',
        lastPrice: res.data.c || 0,
        change24h: (res.data.c - res.data.o) || 0,
        changePercent24h: ((res.data.c - res.data.pc) / res.data.pc * 100) || 0,
        volume24h: res.data.v || 0
      };
    } catch (error) {
      console.error('Finnhub ticker error:', error.message);
      return null;
    }
  }
}

module.exports = { FinnhubProvider };

const axios = require('axios');
const type = require('./types');

const COINGECKO_API = 'https://api.coingecko.com/api/v3';

// Map of CoinGecko IDs to common symbols
const SYMBOL_TO_COINGECKO_ID = {
  'BTC': 'bitcoin',
  'ETH': 'ethereum',
  'SEI': 'sei',
  'ATOM': 'cosmos',
  'SOL': 'solana',
  'AVAX': 'avalanche-2',
  'MATIC': 'matic-network',
  'USDC': 'usd-coin',
  'USDT': 'tether',
};

class CoinGeckoProvider {
  constructor() {
    this.name = 'CoinGecko';
    this.supportedTypes = ['crypto'];
    this.cache = new Map();
    this.cacheExpiry = 60000; // 1 minute
  }

  async searchTicker(query) {
    try {
      const res = await axios.get(`${COINGECKO_API}/search`, {
        params: { query },
        timeout: 5000
      });

      return res.data.coins.slice(0, 10).map(coin => ({
        symbol: coin.symbol.toUpperCase(),
        name: coin.name,
        type: 'crypto',
        lastPrice: 0, // Will be fetched separately
        id: coin.id
      }));
    } catch (error) {
      console.error('CoinGecko search error:', error.message);
      return [];
    }
  }

  async getPrice(symbol) {
    try {
      const id = SYMBOL_TO_COINGECKO_ID[symbol.toUpperCase()] || symbol.toLowerCase();
      const cacheKey = `price-${id}`;
      
      if (this.cache.has(cacheKey)) {
        const cached = this.cache.get(cacheKey);
        if (Date.now() - cached.timestamp < this.cacheExpiry) {
          return cached.price;
        }
      }

      const res = await axios.get(`${COINGECKO_API}/simple/price`, {
        params: { ids: id, vs_currencies: 'usd' },
        timeout: 5000
      });

      const price = res.data[id]?.usd || 0;
      this.cache.set(cacheKey, { price, timestamp: Date.now() });
      return price;
    } catch (error) {
      console.error('CoinGecko price error:', error.message);
      return 0;
    }
  }

  async getCandles(symbol, interval, limit = 200) {
    try {
      const id = SYMBOL_TO_COINGECKO_ID[symbol.toUpperCase()] || symbol.toLowerCase();
      const cacheKey = `candles-${id}-${interval}-${limit}`;
      
      // Check cache first - use 5 minute TTL for candles
      if (this.cache.has(cacheKey)) {
        const cached = this.cache.get(cacheKey);
        if (Date.now() - cached.timestamp < 300000) { // 5 minutes
          console.log(`✅ Cache hit for ${symbol} ${interval}`);
          return cached.data;
        }
      }
      
      // CoinGecko offers: 1h (7d), 1d (180d), 1 (max)
      let days = 7;
      if (interval === '1d') days = 180;
      else if (interval.includes('m')) days = 1; // For minute intervals, use 1d data

      console.log(`📥 Fetching ${symbol} candles from CoinGecko (days=${days})`);
      const res = await axios.get(
        `${COINGECKO_API}/coins/${id}/ohlc`,
        {
          params: { vs_currency: 'usd', days },
          timeout: 5000
        }
      );

      const candles = res.data.slice(0, limit).map(candle => ({
        timestamp: candle[0],
        open: candle[1],
        high: candle[2],
        low: candle[3],
        close: candle[4],
        volume: 0 // CoinGecko OHLC doesn't include volume
      }));
      
      // Cache the result
      this.cache.set(cacheKey, { data: candles, timestamp: Date.now() });
      console.log(`💾 Cached ${symbol} candles (${candles.length} items)`);
      
      return candles;
    } catch (error) {
      console.error('CoinGecko candles error:', error.message);
      return [];
    }
  }

  async getTicker(symbol) {
    try {
      const id = SYMBOL_TO_COINGECKO_ID[symbol.toUpperCase()] || symbol.toLowerCase();
      
      const res = await axios.get(
        `${COINGECKO_API}/coins/${id}`,
        {
          params: { localization: false },
          timeout: 5000
        }
      );

      const data = res.data;
      return {
        symbol: symbol.toUpperCase(),
        name: data.name,
        type: 'crypto',
        lastPrice: data.market_data?.current_price?.usd || 0,
        change24h: data.market_data?.price_change_24h || 0,
        changePercent24h: data.market_data?.price_change_percentage_24h || 0,
        marketCap: data.market_data?.market_cap?.usd || 0,
        volume24h: data.market_data?.total_volume?.usd || 0
      };
    } catch (error) {
      console.error('CoinGecko ticker error:', error.message);
      return null;
    }
  }
}

module.exports = { CoinGeckoProvider };

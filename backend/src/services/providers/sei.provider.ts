/**
 * Sei Token Market Data Provider
 * Provides real-time SEI/USD price data and historical candles
 * 
 * Leverages Sei's high-performance features:
 * - Sub-second finality for real-time updates
 * - 12,500+ TPS for high-frequency price feeds
 * - Optimistic updates supported
 */

const axios = require('axios');
const type = require('./types');

class SeiProvider {
  constructor() {
    this.name = 'Sei Network';
    this.supportedTypes = ['crypto', 'blockchain'];
    this.cache = new Map();
    this.cacheExpiry = 30000; // 30 seconds - Sei updates frequently
  }

  /**
   * Search for Sei-related assets
   * Returns SEI token and Sei network info
   */
  async searchTicker(query) {
    const q = query.toLowerCase();
    
    if (q.includes('sei') || q.includes('blockchain')) {
      return [
        {
          symbol: 'SEI',
          name: 'Sei Token',
          type: 'crypto',
          exchange: 'Sei Network',
          description: 'Native token of the Sei blockchain'
        },
        {
          symbol: 'SEI-CHAIN',
          name: 'Sei Blockchain',
          type: 'blockchain',
          exchange: 'Sei Network',
          description: 'High-performance EVM with 400ms finality'
        }
      ];
    }
    
    return [];
  }

  /**
   * Get real-time SEI token price
   * Uses CoinGecko as reliable price source
   */
  async getPrice(symbol) {
    if (symbol.toUpperCase() !== 'SEI') {
      return 0;
    }

    try {
      const cacheKey = `sei-price`;
      
      if (this.cache.has(cacheKey)) {
        const cached = this.cache.get(cacheKey);
        if (Date.now() - cached.timestamp < 30000) {
          return cached.price;
        }
      }

      // Use CoinGecko for reliable pricing
      const res = await axios.get(
        'https://api.coingecko.com/api/v3/simple/price',
        {
          params: { ids: 'sei', vs_currencies: 'usd' },
          timeout: 5000
        }
      );

      const price = res.data.sei?.usd || 0;
      this.cache.set(cacheKey, { price, timestamp: Date.now() });
      
      console.log(`💰 SEI Price: $${price.toFixed(4)}`);
      return price;
    } catch (error) {
      console.error('❌ Sei price fetch error:', error.message);
      return 0;
    }
  }

  /**
   * Get historical SEI candles
   * Supports 1m, 5m, 15m, 1h, 4h, 1d intervals
   */
  async getCandles(symbol, interval = '1d', limit = 200) {
    if (symbol.toUpperCase() !== 'SEI') {
      return [];
    }

    try {
      const cacheKey = `sei-candles-${interval}-${limit}`;
      
      if (this.cache.has(cacheKey)) {
        const cached = this.cache.get(cacheKey);
        if (Date.now() - cached.timestamp < 300000) { // 5 min cache
          console.log(`✅ Cache hit: SEI ${interval} candles`);
          return cached.data;
        }
      }

      // CoinGecko OHLC endpoint
      let days = 7;
      if (interval === '1d') days = 180;
      else if (interval.includes('m')) days = 1;

      console.log(`📥 Fetching SEI ${interval} candles (${days} days)`);
      
      const res = await axios.get(
        'https://api.coingecko.com/api/v3/coins/sei/ohlc',
        {
          params: { vs_currency: 'usd', days },
          timeout: 5000
        }
      );

      const candles = res.data.slice(0, limit).map((candle: any[]) => ({
        timestamp: candle[0],
        open: candle[1],
        high: candle[2],
        low: candle[3],
        close: candle[4],
        volume: 0
      }));

      this.cache.set(cacheKey, { data: candles, timestamp: Date.now() });
      console.log(`💾 Cached ${candles.length} SEI candles`);
      
      return candles;
    } catch (error) {
      console.error('❌ Sei candles error:', error.message);
      return [];
    }
  }

  /**
   * Get detailed Sei token and network information
   */
  async getTicker(symbol) {
    if (symbol.toUpperCase() !== 'SEI') {
      return null;
    }

    try {
      const cacheKey = 'sei-ticker';
      
      if (this.cache.has(cacheKey)) {
        const cached = this.cache.get(cacheKey);
        if (Date.now() - cached.timestamp < 60000) { // 1 min cache
          return cached.data;
        }
      }

      const res = await axios.get(
        'https://api.coingecko.com/api/v3/coins/sei',
        {
          params: { localization: false },
          timeout: 5000
        }
      );

      const data = res.data;
      const ticker = {
        symbol: 'SEI',
        name: data.name,
        type: 'crypto',
        lastPrice: data.market_data?.current_price?.usd || 0,
        change24h: data.market_data?.price_change_24h || 0,
        changePercent24h: data.market_data?.price_change_percentage_24h || 0,
        marketCap: data.market_data?.market_cap?.usd || 0,
        volume24h: data.market_data?.total_volume?.usd || 0,
        website: data.links?.homepage?.[0],
        explorer: 'https://seitrace.com',
        networkInfo: {
          finality: '~400ms',
          maxTPS: 12500,
          consensus: 'Twin Turbo (Parallel Execution)',
          evm: true
        }
      };

      this.cache.set(cacheKey, { data: ticker, timestamp: Date.now() });
      return ticker;
    } catch (error) {
      console.error('❌ Sei ticker error:', error.message);
      return null;
    }
  }

  /**
   * Get Sei network stats (optional extended data)
   */
  async getNetworkStats() {
    return {
      name: 'Sei',
      chainId: 1329,
      rpc: 'https://evm-rpc.sei-apis.com',
      ws: 'wss://evm-ws.sei-apis.com',
      blockTime: '~400ms',
      finality: '~400ms',
      maxTPS: 12500,
      consensus: 'Twin Turbo (Parallel Execution)',
      evm: true,
      features: [
        'Sub-second finality',
        'Parallel transaction execution',
        'High-frequency trading optimized',
        '100% EVM compatible',
        'Significantly cheaper than Ethereum'
      ]
    };
  }
}

module.exports = { SeiProvider };

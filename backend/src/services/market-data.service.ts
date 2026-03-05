const { CoinGeckoProvider } = require('./providers/coingecko.provider');
const { FinnhubProvider } = require('./providers/finnhub.provider');
const { BinanceProvider } = require('./providers/binance.provider');
const { PolygonProvider } = require('./providers/polygon.provider');

class MarketDataService {
  constructor(io = null) {
    this.providers = new Map();
    this.io = io; // Socket.io for broadcasting
    
    // Initialize CoinGecko (always available, REST API for search/historical)
    this.providers.set('coingecko', new CoinGeckoProvider());
    
    // Initialize Binance (WebSocket only, real-time crypto streaming)
    // Note: Binance is NOT in providers Map since it doesn't support REST methods
    this.binanceProvider = new BinanceProvider();
    this._setupBinanceListeners();
    
    // Initialize Polygon if API key is provided (real-time stocks/forex)
    // Note: Polygon is added to providers only if configured, otherwise use REST fallback
    const polygonKey = process.env.POLYGON_API_KEY;
    if (polygonKey) {
      this.polygonProvider = new PolygonProvider(polygonKey);
      this.providers.set('polygon', this.polygonProvider);
      this._setupPolygonListeners();
    }
    
    // Initialize Finnhub if API key is provided (REST API for stocks/forex)
    const finnhubKey = process.env.FINNHUB_API_KEY;
    if (finnhubKey) {
      this.providers.set('finnhub', new FinnhubProvider(finnhubKey));
    }
    
    this.defaultProvider = 'coingecko'; // Default to free provider
  }

  _setupBinanceListeners() {
    if (!this.binanceProvider) return;
    
    this.binanceProvider.on('price', (data) => {
      if (this.io) {
        this.io.emit('price_update', {
          provider: 'binance',
          symbol: data.symbol,
          price: data.price,
          high24h: data.high24h,
          low24h: data.low24h,
          volume24h: data.volume24h,
          timestamp: Date.now()
        });
      }
    });
    
    this.binanceProvider.on('candle', (data) => {
      if (this.io) {
        this.io.emit('candle_update', {
          provider: 'binance',
          symbol: data.symbol,
          candle: data,
          timestamp: Date.now()
        });
      }
    });
  }

  _setupPolygonListeners() {
    if (!this.polygonProvider) return;
    
    this.polygonProvider.on('price', (data) => {
      if (this.io) {
        this.io.emit('price_update', {
          provider: 'polygon',
          symbol: data.symbol,
          price: data.price,
          bid: data.bid,
          ask: data.ask,
          volume: data.volume,
          timestamp: Date.now()
        });
      }
    });
  }

  async connectRealTimeProviders() {
    try {
      // Connect Binance (crypto)
      await this.binanceProvider.connect();
      console.log('✅ Binance WebSocket connected');
    } catch (error) {
      console.warn('⚠️ Binance WebSocket connection failed:', error.message);
    }
    
    try {
      // Connect Polygon (stocks/forex/commodities)
      if (this.polygonProvider) {
        await this.polygonProvider.connect();
        console.log('✅ Polygon.io WebSocket connected');
      }
    } catch (error) {
      console.warn('⚠️ Polygon.io WebSocket connection failed:', error.message);
    }
  }

  // Detect ticker type and route to appropriate provider
  async detectTickerType(symbol) {
    // Try CoinGecko first (crypto)
    const cryptoTicker = await this.providers.get('coingecko').searchTicker(symbol);
    if (cryptoTicker.length > 0) return 'crypto';
    
    // Try Polygon (stocks/forex/commodities)
    if (this.polygonProvider) {
      // For now assume stock; could enhance with symbol analysis
      return 'stock';
    }
    
    // Try Finnhub (stock/forex fallback)
    if (this.providers.has('finnhub')) {
      const stockTicker = await this.providers.get('finnhub').searchTicker(symbol);
      if (stockTicker.length > 0) return stockTicker[0].type;
    }
    
    return 'crypto'; // Default
  }

  // Get the best provider for a ticker type
  getProviderForType(type) {
    if (type === 'crypto') {
      // Use CoinGecko for historical crypto data (Binance WebSocket is for real-time only)
      return this.providers.get('coingecko');
    }
    if (type === 'stock' || type === 'forex' || type === 'commodity') {
      // Use Polygon for real-time stocks/forex/commodities
      if (this.polygonProvider) return this.polygonProvider;
      const finnhub = this.providers.get('finnhub');
      return finnhub?.isConfigured() ? finnhub : this.providers.get('coingecko');
    }
    return this.providers.get(this.defaultProvider);
  }

  async searchTicker(query) {
    const results = [];

    // Search across all available providers
    for (const [name, provider] of this.providers) {
      const tickers = await provider.searchTicker(query);
      results.push(...tickers);
    }

    // Deduplicate by symbol
    const unique = new Map();
    for (const ticker of results) {
      if (!unique.has(ticker.symbol)) {
        unique.set(ticker.symbol, ticker);
      }
    }

    return Array.from(unique.values());
  }

  async getPrice(symbol, tickerType = null) {
    let type = tickerType;
    if (!type) {
      type = await this.detectTickerType(symbol);
    }

    const provider = this.getProviderForType(type);
    return provider.getPrice(symbol);
  }

  async getCandles(symbol, interval = '1d', limit = 200, tickerType = null) {
    let type = tickerType;
    if (!type) {
      type = await this.detectTickerType(symbol);
    }

    const provider = this.getProviderForType(type);
    return provider.getCandles(symbol, interval, limit);
  }

  async getTicker(symbol, tickerType = null) {
    let type = tickerType;
    if (!type) {
      type = await this.detectTickerType(symbol);
    }

    const provider = this.getProviderForType(type);
    return provider.getTicker(symbol);
  }

  getAvailableProviders() {
    const available = [];
    for (const [name, provider] of this.providers) {
      available.push({
        name: provider.name,
        types: provider.supportedTypes,
        configured: provider.isConfigured?.() ?? true
      });
    }
    return available;
  }
}

module.exports = { MarketDataService };

const axios = require('axios');
const WebSocket = require('ws');
const EventEmitter = require('events');

const POLYGON_REST = 'https://api.polygon.io';
const POLYGON_WS = 'wss://socket.polygon.io/stocks';

class PolygonProvider extends EventEmitter {
  constructor(apiKey) {
    super();
    this.name = 'Polygon.io';
    this.supportedTypes = ['stock', 'forex', 'commodity', 'crypto'];
    this.apiKey = apiKey;
    this.ws = null;
    this.restClient = axios.create({
      baseURL: POLYGON_REST,
      timeout: 5000,
      params: { apiKey }
    });
    this.prices = new Map();
    this.subscriptions = new Set();
  }

  isConfigured() {
    return !!this.apiKey;
  }

  connect() {
    if (!this.isConfigured()) {
      console.warn('Polygon.io not configured - set POLYGON_API_KEY');
      return Promise.reject(new Error('Polygon API key required'));
    }

    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(POLYGON_WS);

        this.ws.on('open', () => {
          console.log('✅ Polygon.io WebSocket connected');
          // Authenticate
          this.ws.send(JSON.stringify({
            action: 'auth',
            params: this.apiKey
          }));
          resolve();
        });

        this.ws.on('message', (data) => {
          try {
            const messages = JSON.parse(data);
            if (Array.isArray(messages)) {
              messages.forEach(msg => this._handleMessage(msg));
            } else {
              this._handleMessage(messages);
            }
          } catch (error) {
            console.error('Polygon parse error:', error);
          }
        });

        this.ws.on('error', (error) => {
          console.error('❌ Polygon.io WebSocket error:', error.message);
          reject(error);
        });

        this.ws.on('close', () => {
          console.log('🔌 Polygon.io WebSocket disconnected');
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  _handleMessage(message) {
    if (!message.ev) return;

    // XQ = Last Quote (stocks)
    if (message.ev === 'XQ') {
      this.prices.set(message.symbol, parseFloat(message.p));
      this.emit('price', {
        symbol: message.symbol,
        price: parseFloat(message.p),
        bid: parseFloat(message.bp),
        ask: parseFloat(message.ap),
        volume: message.s,
        timestamp: message.t
      });
    }

    // XT = Last Trade (stocks)
    if (message.ev === 'XT') {
      this.prices.set(message.symbol, parseFloat(message.p));
      this.emit('price', {
        symbol: message.symbol,
        price: parseFloat(message.p),
        volume: message.s,
        timestamp: message.t
      });
    }

    // C = Crypto trades
    if (message.ev === 'C') {
      this.prices.set(message.pair, parseFloat(message.p));
      this.emit('price', {
        symbol: message.pair,
        price: parseFloat(message.p),
        volume: message.size,
        timestamp: message.t
      });
    }

    // FX = Forex
    if (message.ev === 'FX') {
      this.prices.set(message.pair, parseFloat(message.b));
      this.emit('price', {
        symbol: message.pair,
        price: parseFloat(message.b),
        bid: parseFloat(message.b),
        ask: parseFloat(message.a),
        timestamp: message.t
      });
    }
  }

  subscribe(symbol, type = 'stock') {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.warn('Polygon WebSocket not ready');
      return;
    }

    const subscriptionMap = {
      stock: `T.${symbol}`, // Last trade
      forex: `C.${symbol}`, // Crypto
      crypto: `C.${symbol}`, // Crypto
      commodity: `C.${symbol}` // Treat as crypto for now
    };

    const subscription = subscriptionMap[type] || `T.${symbol}`;

    if (!this.subscriptions.has(subscription)) {
      this.ws.send(JSON.stringify({
        action: 'subscribe',
        params: subscription
      }));
      this.subscriptions.add(subscription);
      console.log(`📡 Subscribed to ${symbol} (${type})`);
    }
  }

  unsubscribe(symbol, type = 'stock') {
    if (!this.ws) return;

    const subscriptionMap = {
      stock: `T.${symbol}`,
      forex: `C.${symbol}`,
      crypto: `C.${symbol}`,
      commodity: `C.${symbol}`
    };

    const subscription = subscriptionMap[type] || `T.${symbol}`;

    this.ws.send(JSON.stringify({
      action: 'unsubscribe',
      params: subscription
    }));
    this.subscriptions.delete(subscription);
  }

  async getPrice(symbol, type = 'stock') {
    try {
      const cached = this.prices.get(symbol);
      if (cached) return cached;

      // Query endpoints by type
      let endpoint;
      if (type === 'crypto') {
        endpoint = `/v1/last/crypto/${symbol}/USD`;
      } else if (type === 'forex') {
        endpoint = `/v1/last/fx/${symbol}`;
      } else {
        endpoint = `/v2/snapshot/locale/us/markets/stocks/tickers/${symbol}`;
      }

      const response = await this.restClient.get(endpoint);
      
      if (response.data.last?.price) {
        return response.data.last.price;
      }
      if (response.data.result?.lastPrice) {
        return response.data.result.lastPrice;
      }

      return 0;
    } catch (error) {
      console.error(`Polygon price error for ${symbol}:`, error.message);
      return 0;
    }
  }

  async getCandles(symbol, interval = '1d', limit = 200, type = 'stock') {
    try {
      const multiplier = this._parseInterval(interval);
      
      let endpoint;
      if (type === 'crypto') {
        endpoint = `/v1/open-close/${symbol}/2024-01-01`;
      } else if (type === 'forex') {
        endpoint = `/v1/open-close/${symbol}/2024-01-01`;
      } else {
        endpoint = `/v2/aggs/ticker/${symbol}/range/${multiplier.unit}/${multiplier.value}/2024-01-01/2024-12-31`;
      }

      const response = await this.restClient.get(endpoint, {
        params: { sort: 'asc', limit }
      });

      if (!response.data.results) return [];

      return response.data.results.slice(0, limit).map(bar => ({
        timestamp: bar.t || bar.timestamp,
        open: bar.o || bar.open || 0,
        high: bar.h || bar.high || 0,
        low: bar.l || bar.low || 0,
        close: bar.c || bar.close || 0,
        volume: bar.v || bar.volume || 0
      }));
    } catch (error) {
      console.error(`Polygon candles error for ${symbol}:`, error.message);
      return [];
    }
  }

  async getTicker(symbol, type = 'stock') {
    try {
      const price = await this.getPrice(symbol, type);
      
      return {
        symbol,
        name: symbol,
        type,
        lastPrice: price,
        change24h: 0, // Would need historical data
        changePercent24h: 0,
        volume24h: 0
      };
    } catch (error) {
      console.error('Polygon ticker error:', error);
      return null;
    }
  }

  _parseInterval(interval) {
    const map = {
      '1m': { value: 1, unit: 'minute' },
      '5m': { value: 5, unit: 'minute' },
      '15m': { value: 15, unit: 'minute' },
      '1h': { value: 1, unit: 'hour' },
      '4h': { value: 4, unit: 'hour' },
      '1d': { value: 1, unit: 'day' }
    };
    return map[interval] || map['1d'];
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

module.exports = { PolygonProvider };

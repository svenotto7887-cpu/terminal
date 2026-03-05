const WebSocket = require('ws');
const EventEmitter = require('events');

const BINANCE_WS = 'wss://stream.binance.com:9443/ws';

class BinanceProvider extends EventEmitter {
  constructor() {
    super();
    this.name = 'Binance';
    this.supportedTypes = ['crypto'];
    this.ws = null;
    this.subscriptions = new Set();
    this.prices = new Map();
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 10;
  }

  connect() {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(BINANCE_WS);

        this.ws.on('open', () => {
          console.log('✅ Binance WebSocket connected');
          this.reconnectAttempts = 0;
          resolve();
        });

        this.ws.on('message', (data) => {
          try {
            const message = JSON.parse(data);
            this._handleMessage(message);
          } catch (error) {
            console.error('Binance parse error:', error);
          }
        });

        this.ws.on('error', (error) => {
          console.error('❌ Binance WebSocket error:', error.message);
          reject(error);
        });

        this.ws.on('close', () => {
          console.log('🔌 Binance WebSocket disconnected');
          this._attemptReconnect();
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  _attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
      console.log(`⏳ Reconnecting to Binance in ${delay}ms (attempt ${this.reconnectAttempts})`);
      
      setTimeout(() => {
        this.connect().catch((error) => {
          console.error('Reconnect failed:', error.message);
        });
      }, delay);
    }
  }

  _handleMessage(message) {
    // Handle subscribe confirmations
    if (message.result === null && message.id) {
      return;
    }

    // Handle ticker updates (@ticker events)
    if (message.data && message.data.c) {
      const { s, c, h, l, v } = message.data;
      const symbol = s.replace('USDT', '').replace('BUSD', '').replace('USDC', '');
      
      this.prices.set(symbol, parseFloat(c));
      
      this.emit('price', {
        symbol,
        price: parseFloat(c),
        high24h: parseFloat(h),
        low24h: parseFloat(l),
        volume24h: parseFloat(v),
        timestamp: Date.now()
      });
    }

    // Handle kline (candle) updates
    if (message.k) {
      const { s, k } = message.data || message;
      if (k) {
        const symbol = s.replace('USDT', '').replace('BUSD', '').replace('USDC', '');
        this.emit('candle', {
          symbol,
          timestamp: k.t,
          open: parseFloat(k.o),
          high: parseFloat(k.h),
          low: parseFloat(k.l),
          close: parseFloat(k.c),
          volume: parseFloat(k.v),
          isClosed: k.x
        });
      }
    }
  }

  subscribe(symbol, interval = '1m') {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.warn('WebSocket not ready, queuing subscription');
      return;
    }

    const pair = `${symbol.toLowerCase()}usdt`;
    
    // Subscribe to ticker stream (@ticker = 1s updates)
    const tickerStream = `${pair}@ticker`;
    const candleStream = `${pair}@kline_${interval}`;

    if (!this.subscriptions.has(tickerStream)) {
      this.ws.send(JSON.stringify({
        method: 'SUBSCRIBE',
        params: [tickerStream, candleStream],
        id: Date.now()
      }));
      
      this.subscriptions.add(tickerStream);
      this.subscriptions.add(candleStream);
      console.log(`📡 Subscribed to ${symbol} (${interval})`);
    }
  }

  unsubscribe(symbol) {
    if (!this.ws) return;

    const pair = `${symbol.toLowerCase()}usdt`;
    const tickerStream = `${pair}@ticker`;
    const candleStream = `${pair}@kline_1m`;

    this.ws.send(JSON.stringify({
      method: 'UNSUBSCRIBE',
      params: [tickerStream, candleStream],
      id: Date.now()
    }));

    this.subscriptions.delete(tickerStream);
    this.subscriptions.delete(candleStream);
  }

  getPrice(symbol) {
    return this.prices.get(symbol) || 0;
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

module.exports = { BinanceProvider };

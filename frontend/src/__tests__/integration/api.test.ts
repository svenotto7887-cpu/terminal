import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  mockTradingPairs,
  mockOrders,
  mockPortfolio,
  mockUser,
} from '../fixtures/mockData';

/**
 * Integration Tests
 * Testing feature flows and interactions
 */

// Mock API Service
class APIService {
  private isAuthenticated = false;
  private token: string | null = null;
  
  authenticate(user: typeof mockUser) {
    this.isAuthenticated = true;
    this.token = 'mock-jwt-token';
    return { authenticated: true, token: this.token };
  }
  
  logout() {
    this.isAuthenticated = false;
    this.token = null;
  }
  
  fetchTradingPairs() {
    if (!this.isAuthenticated) throw new Error('Unauthorized');
    return mockTradingPairs;
  }
  
  fetchOrders() {
    if (!this.isAuthenticated) throw new Error('Unauthorized');
    return mockOrders;
  }
  
  fetchPortfolio() {
    if (!this.isAuthenticated) throw new Error('Unauthorized');
    return mockPortfolio;
  }
  
  createOrder(order: any) {
    if (!this.isAuthenticated) throw new Error('Unauthorized');
    if (!order.quantity || !order.price) throw new Error('Invalid order');
    return { id: 'new-order-id', ...order, status: 'pending' };
  }
}

// Mock WebSocket Service
class WebSocketService {
  private connected = false;
  private subscriptions: Set<string> = new Set();
  private listeners: Map<string, Function[]> = new Map();
  
  connect() {
    this.connected = true;
    return { connected: true };
  }
  
  disconnect() {
    this.connected = false;
    this.subscriptions.clear();
  }
  
  subscribe(channel: string) {
    if (!this.connected) throw new Error('Not connected');
    this.subscriptions.add(channel);
  }
  
  unsubscribe(channel: string) {
    this.subscriptions.delete(channel);
  }
  
  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)?.push(callback);
  }
  
  emit(event: string, data: any) {
    const callbacks = this.listeners.get(event) || [];
    callbacks.forEach((cb) => cb(data));
  }
  
  isConnected() {
    return this.connected;
  }
}

// Mock Trading Engine
class TradingEngine {
  private orders: typeof mockOrders = [];
  private portfolio = { ...mockPortfolio };
  
  placeOrder(order: any) {
    if (!order.quantity || order.quantity <= 0) {
      throw new Error('Invalid quantity');
    }
    if (!order.price || order.price <= 0) {
      throw new Error('Invalid price');
    }
    
    const newOrder = {
      id: `order-${Date.now()}`,
      ...order,
      status: 'pending',
      filledQuantity: 0,
      createdAt: new Date(),
    };
    
    this.orders.push(newOrder);
    return newOrder;
  }
  
  fillOrder(orderId: string, filledQuantity: number) {
    const order = this.orders.find((o) => o.id === orderId);
    if (!order) throw new Error('Order not found');
    
    order.filledQuantity = filledQuantity;
    order.status = filledQuantity === order.quantity ? 'filled' : 'partially_filled';
    return order;
  }
  
  getOrders() {
    return this.orders;
  }
}

describe('API Service Integration Tests', () => {
  let api: APIService;
  
  beforeEach(() => {
    api = new APIService();
  });
  
  it('should authenticate user', () => {
    const result = api.authenticate(mockUser);
    
    expect(result.authenticated).toBe(true);
    expect(result.token).toBeDefined();
  });
  
  it('should fetch trading pairs when authenticated', () => {
    api.authenticate(mockUser);
    const pairs = api.fetchTradingPairs();
    
    expect(pairs).toHaveLength(3);
    expect(pairs[0].symbol).toBe('SEI/USDC');
  });
  
  it('should throw error when fetching without authentication', () => {
    expect(() => api.fetchTradingPairs()).toThrow('Unauthorized');
  });
  
  it('should fetch orders when authenticated', () => {
    api.authenticate(mockUser);
    const orders = api.fetchOrders();
    
    expect(orders).toHaveLength(3);
  });
  
  it('should fetch portfolio when authenticated', () => {
    api.authenticate(mockUser);
    const portfolio = api.fetchPortfolio();
    
    expect(portfolio.totalUSD).toBe(10427);
    expect(portfolio.assets).toHaveLength(3);
  });
  
  it('should create order with valid parameters', () => {
    api.authenticate(mockUser);
    
    const newOrder = api.createOrder({
      pairId: 'SEI_USDC',
      type: 'limit',
      side: 'buy',
      quantity: 100,
      price: 0.244,
    });
    
    expect(newOrder.status).toBe('pending');
    expect(newOrder.quantity).toBe(100);
  });
  
  it('should reject order with missing parameters', () => {
    api.authenticate(mockUser);
    
    expect(() => api.createOrder({ quantity: 100 })).toThrow('Invalid order');
  });
  
  it('should logout', () => {
    api.authenticate(mockUser);
    api.logout();
    
    expect(() => api.fetchTradingPairs()).toThrow('Unauthorized');
  });
});

describe('WebSocket Service Integration Tests', () => {
  let ws: WebSocketService;
  
  beforeEach(() => {
    ws = new WebSocketService();
  });
  
  it('should connect to websocket', () => {
    const result = ws.connect();
    
    expect(result.connected).toBe(true);
    expect(ws.isConnected()).toBe(true);
  });
  
  it('should subscribe to channels when connected', () => {
    ws.connect();
    
    expect(() => ws.subscribe('SEI_USDC')).not.toThrow();
  });
  
  it('should throw error when subscribing without connection', () => {
    expect(() => ws.subscribe('SEI_USDC')).toThrow('Not connected');
  });
  
  it('should emit price updates', () => {
    ws.connect();
    
    const prices: any[] = [];
    ws.on('price_update', (data) => prices.push(data));
    
    ws.emit('price_update', { pair: 'SEI_USDC', price: 0.250 });
    
    expect(prices).toHaveLength(1);
    expect(prices[0].price).toBe(0.250);
  });
  
  it('should handle multiple subscribers', () => {
    ws.connect();
    
    const updates1: any[] = [];
    const updates2: any[] = [];
    
    ws.on('price_update', (data) => updates1.push(data));
    ws.on('price_update', (data) => updates2.push(data));
    
    ws.emit('price_update', { price: 0.250 });
    
    expect(updates1).toHaveLength(1);
    expect(updates2).toHaveLength(1);
  });
  
  it('should disconnect and clear subscriptions', () => {
    ws.connect();
    ws.subscribe('SEI_USDC');
    
    ws.disconnect();
    
    expect(ws.isConnected()).toBe(false);
  });
});

describe('Trading Engine Integration Tests', () => {
  let engine: TradingEngine;
  
  beforeEach(() => {
    engine = new TradingEngine();
  });
  
  it('should place a new order', () => {
    const order = engine.placeOrder({
      pairId: 'SEI_USDC',
      type: 'limit',
      side: 'buy',
      quantity: 100,
      price: 0.244,
    });
    
    expect(order.id).toBeDefined();
    expect(order.status).toBe('pending');
    expect(order.filledQuantity).toBe(0);
  });
  
  it('should reject order with invalid quantity', () => {
    expect(() =>
      engine.placeOrder({
        quantity: -10,
        price: 0.244,
      })
    ).toThrow('Invalid quantity');
  });
  
  it('should reject order with invalid price', () => {
    expect(() =>
      engine.placeOrder({
        quantity: 100,
        price: 0,
      })
    ).toThrow('Invalid price');
  });
  
  it('should fill order completely', () => {
    const order = engine.placeOrder({
      pairId: 'SEI_USDC',
      quantity: 100,
      price: 0.244,
    });
    
    const filled = engine.fillOrder(order.id, 100);
    
    expect(filled.status).toBe('filled');
    expect(filled.filledQuantity).toBe(100);
  });
  
  it('should partially fill order', () => {
    const order = engine.placeOrder({
      pairId: 'SEI_USDC',
      quantity: 100,
      price: 0.244,
    });
    
    const filled = engine.fillOrder(order.id, 50);
    
    expect(filled.status).toBe('partially_filled');
    expect(filled.filledQuantity).toBe(50);
  });
  
  it('should throw error filling non-existent order', () => {
    expect(() => engine.fillOrder('non-existent', 100)).toThrow(
      'Order not found'
    );
  });
  
  it('should get all orders', () => {
    engine.placeOrder({ quantity: 100, price: 0.244 });
    engine.placeOrder({ quantity: 50, price: 0.250 });
    
    const orders = engine.getOrders();
    
    expect(orders).toHaveLength(2);
  });
});

describe('Full Trading Flow Tests', () => {
  it('should complete full trading workflow', () => {
    const api = new APIService();
    const ws = new WebSocketService();
    const engine = new TradingEngine();
    
    // Authenticate
    api.authenticate(mockUser);
    expect(() => api.fetchTradingPairs()).not.toThrow();
    
    // Connect to websocket
    ws.connect();
    ws.subscribe('SEI_USDC');
    
    // Place order
    const order = engine.placeOrder({
      pairId: 'SEI_USDC',
      type: 'limit',
      side: 'buy',
      quantity: 100,
      price: 0.244,
    });
    
    expect(order.status).toBe('pending');
    
    // Simulate price update via websocket
    const priceUpdates: any[] = [];
    ws.on('price_update', (data) => priceUpdates.push(data));
    ws.emit('price_update', { pair: 'SEI_USDC', price: 0.245 });
    
    expect(priceUpdates).toHaveLength(1);
    
    // Fill order
    const filled = engine.fillOrder(order.id, 100);
    expect(filled.status).toBe('filled');
  });
});

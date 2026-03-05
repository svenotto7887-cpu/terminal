import { describe, it, expect, vi } from 'vitest';
import { mockTradingPairs, mockPortfolio, mockOrders } from '../fixtures/mockData';

/**
 * Mock Component Tests
 * Testing component logic and behavior
 */

// Mock Chart Component
class ChartComponent {
  constructor(public pair: typeof mockTradingPairs[0]) {}
  
  render() {
    return {
      title: `${this.pair.symbol} Chart`,
      data: this.pair,
    };
  }
  
  updatePrice(newPrice: number) {
    this.pair.lastPrice = newPrice;
  }
}

// Mock OrderBook Component
class OrderBookComponent {
  bids: Array<[number, number]> = [];
  asks: Array<[number, number]> = [];
  
  updateOrderBook(bids: Array<[number, number]>, asks: Array<[number, number]>) {
    this.bids = bids;
    this.asks = asks;
  }
  
  getSpread(): number {
    if (this.asks.length === 0 || this.bids.length === 0) return 0;
    return this.asks[0][0] - this.bids[0][0];
  }
}

// Mock Portfolio Component
class PortfolioComponent {
  constructor(public portfolio: typeof mockPortfolio) {}
  
  getTotalValue(): number {
    return this.portfolio.totalUSD;
  }
  
  getAssetAllocation(symbol: string): number {
    const asset = this.portfolio.assets.find((a) => a.symbol === symbol);
    return asset ? (asset.usdValue / this.portfolio.totalUSD) * 100 : 0;
  }
  
  isPositive(): boolean {
    return this.portfolio.assets.some((a) => a.unrealizedPnL > 0);
  }
}

// Mock Order Component
class OrderComponent {
  orders = mockOrders;
  selectedOrder: (typeof mockOrders)[0] | null = null;
  
  selectOrder(orderId: string) {
    this.selectedOrder = this.orders.find((o) => o.id === orderId) || null;
  }
  
  getOrdersByStatus(status: string) {
    return this.orders.filter((o) => o.status === status);
  }
  
  getOrderCount(): number {
    return this.orders.length;
  }
}

describe('Chart Component Tests', () => {
  it('should render chart with correct pair', () => {
    const chart = new ChartComponent(mockTradingPairs[0]);
    const render = chart.render();
    
    expect(render.title).toBe('SEI/USDC Chart');
    expect(render.data.symbol).toBe('SEI/USDC');
  });
  
  it('should update price', () => {
    const chart = new ChartComponent(mockTradingPairs[0]);
    const initialPrice = chart.pair.lastPrice;
    
    chart.updatePrice(0.260);
    
    expect(chart.pair.lastPrice).toBe(0.260);
    expect(chart.pair.lastPrice).not.toBe(initialPrice);
  });
  
  it('should have multiple pairs available', () => {
    const pairs = mockTradingPairs.map((p) => new ChartComponent(p));
    
    expect(pairs).toHaveLength(3);
    expect(pairs[0].pair.symbol).toBe('SEI/USDC');
    expect(pairs[1].pair.symbol).toBe('SEI/USDT');
    expect(pairs[2].pair.symbol).toBe('ATOM/USDC');
  });
});

describe('OrderBook Component Tests', () => {
  it('should initialize empty orderbook', () => {
    const orderbook = new OrderBookComponent();
    
    expect(orderbook.bids).toHaveLength(0);
    expect(orderbook.asks).toHaveLength(0);
  });
  
  it('should update orderbook data', () => {
    const orderbook = new OrderBookComponent();
    const bids = [[0.244, 1000], [0.243, 2000]];
    const asks = [[0.246, 1000], [0.247, 2000]];
    
    orderbook.updateOrderBook(bids, asks);
    
    expect(orderbook.bids).toEqual(bids);
    expect(orderbook.asks).toEqual(asks);
  });
  
  it('should calculate spread correctly', () => {
    const orderbook = new OrderBookComponent();
    const bids = [[0.244, 1000]];
    const asks = [[0.246, 1000]];
    
    orderbook.updateOrderBook(bids, asks);
    
    const spread = orderbook.getSpread();
    expect(spread).toBeCloseTo(0.002, 3);
  });
  
  it('should handle empty orderbook spread', () => {
    const orderbook = new OrderBookComponent();
    
    expect(orderbook.getSpread()).toBe(0);
  });
});

describe('Portfolio Component Tests', () => {
  it('should render portfolio with correct total', () => {
    const portfolio = new PortfolioComponent(mockPortfolio);
    
    expect(portfolio.getTotalValue()).toBe(10427);
  });
  
  it('should calculate asset allocation correctly', () => {
    const portfolio = new PortfolioComponent(mockPortfolio);
    
    const seiAllocation = portfolio.getAssetAllocation('SEI');
    expect(seiAllocation).toBeCloseTo(2.35, 1);
    
    const usdcAllocation = portfolio.getAssetAllocation('USDC');
    expect(usdcAllocation).toBeCloseTo(93.56, 1);
  });
  
  it('should detect if portfolio is in profit', () => {
    const portfolio = new PortfolioComponent(mockPortfolio);
    
    expect(portfolio.isPositive()).toBe(true);
  });
  
  it('should handle non-existent assets', () => {
    const portfolio = new PortfolioComponent(mockPortfolio);
    
    const allocation = portfolio.getAssetAllocation('NONEXISTENT');
    expect(allocation).toBe(0);
  });
});

describe('Order Component Tests', () => {
  it('should initialize with orders', () => {
    const orders = new OrderComponent();
    
    expect(orders.getOrderCount()).toBe(3);
  });
  
  it('should select order', () => {
    const orders = new OrderComponent();
    
    orders.selectOrder('order-001');
    
    expect(orders.selectedOrder).not.toBeNull();
    expect(orders.selectedOrder?.id).toBe('order-001');
  });
  
  it('should filter orders by status', () => {
    const orders = new OrderComponent();
    
    const filledOrders = orders.getOrdersByStatus('filled');
    
    expect(filledOrders).toHaveLength(2);
    filledOrders.forEach((o) => {
      expect(o.status).toBe('filled');
    });
  });
  
  it('should handle non-existent order selection', () => {
    const orders = new OrderComponent();
    
    orders.selectOrder('non-existent');
    
    expect(orders.selectedOrder).toBeNull();
  });
  
  it('should get pending orders', () => {
    const orders = new OrderComponent();
    
    const pending = orders.getOrdersByStatus('pending');
    
    expect(pending).toHaveLength(1);
    expect(pending[0].id).toBe('order-001');
  });
});

describe('Component Integration Tests', () => {
  it('should work with multiple components together', () => {
    const chart = new ChartComponent(mockTradingPairs[0]);
    const portfolio = new PortfolioComponent(mockPortfolio);
    const orders = new OrderComponent();
    
    expect(chart.pair.symbol).toBe('SEI/USDC');
    expect(portfolio.getTotalValue()).toBe(10427);
    expect(orders.getOrderCount()).toBe(3);
  });
  
  it('should update chart when order is filled', () => {
    const chart = new ChartComponent(mockTradingPairs[0]);
    const initialPrice = chart.pair.lastPrice;
    
    // Simulate new price from filled order
    chart.updatePrice(0.250);
    
    expect(chart.pair.lastPrice).not.toBe(initialPrice);
  });
});

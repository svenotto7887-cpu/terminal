import { describe, it, expect } from 'vitest';
import {
  mockTradingPairs,
  mockPortfolio,
  mockOrders,
  mockPerformanceMetrics,
} from '../fixtures/mockData';

describe('Trading Pair Tests', () => {
  it('should contain valid trading pairs', () => {
    expect(mockTradingPairs).toHaveLength(3);
    expect(mockTradingPairs[0].symbol).toBe('SEI/USDC');
  });

  it('should calculate price change correctly', () => {
    const pair = mockTradingPairs[0];
    expect(pair.priceChange24h).toBeGreaterThan(0);
    expect(pair.lastPrice).toBeCloseTo(0.245, 3);
  });

  it('should have valid bid-ask spread', () => {
    mockTradingPairs.forEach((pair) => {
      expect(pair.bid).toBeLessThan(pair.ask);
      expect(pair.bid).toBeLessThan(pair.lastPrice);
      expect(pair.ask).toBeGreaterThan(pair.lastPrice);
    });
  });

  it('should have high >= low for 24h prices', () => {
    mockTradingPairs.forEach((pair) => {
      expect(pair.high24h).toBeGreaterThanOrEqual(pair.low24h);
      expect(pair.lastPrice).toBeLessThanOrEqual(pair.high24h);
      expect(pair.lastPrice).toBeGreaterThanOrEqual(pair.low24h);
    });
  });

  it('should have positive volume', () => {
    mockTradingPairs.forEach((pair) => {
      expect(pair.volume24h).toBeGreaterThan(0);
    });
  });
});

describe('Portfolio Tests', () => {
  it('should have valid portfolio structure', () => {
    expect(mockPortfolio).toHaveProperty('totalUSD');
    expect(mockPortfolio).toHaveProperty('assets');
    expect(Array.isArray(mockPortfolio.assets)).toBe(true);
  });

  it('should calculate total asset value correctly', () => {
    const totalAssetValue = mockPortfolio.assets.reduce(
      (sum, asset) => sum + asset.usdValue,
      0
    );
    expect(totalAssetValue).toBeCloseTo(mockPortfolio.totalUSD, 0);
  });

  it('should have unrealized P&L calculations', () => {
    mockPortfolio.assets.forEach((asset) => {
      if (asset.averageCost === 1.0) {
        // Stablecoin
        expect(asset.unrealizedPnL).toBe(0);
      } else {
        const expectedPnL = (asset.usdValue / asset.quantity - asset.averageCost) * asset.quantity;
        expect(asset.unrealizedPnL).toBeCloseTo(expectedPnL, 1);
      }
    });
  });

  it('should have valid quantities', () => {
    mockPortfolio.assets.forEach((asset) => {
      expect(asset.quantity).toBeGreaterThan(0);
      expect(asset.usdValue).toBeGreaterThan(0);
    });
  });
});

describe('Order Tests', () => {
  it('should contain valid orders', () => {
    expect(mockOrders.length).toBeGreaterThan(0);
  });

  it('should have valid order statuses', () => {
    mockOrders.forEach((order) => {
      expect(['pending', 'filled', 'partially_filled', 'canceled']).toContain(
        order.status
      );
    });
  });

  it('should have filled quantity <= quantity', () => {
    mockOrders.forEach((order) => {
      expect(order.filledQuantity).toBeLessThanOrEqual(order.quantity);
    });
  });

  it('should have valid order types', () => {
    mockOrders.forEach((order) => {
      expect(['limit', 'market', 'stop']).toContain(order.type);
    });
  });

  it('should have valid sides', () => {
    mockOrders.forEach((order) => {
      expect(['buy', 'sell']).toContain(order.side);
    });
  });
});

describe('Performance Metrics Tests', () => {
  it('should have valid performance metrics', () => {
    expect(mockPerformanceMetrics).toHaveProperty('totalReturn');
    expect(mockPerformanceMetrics).toHaveProperty('totalReturnPercent');
    expect(mockPerformanceMetrics).toHaveProperty('winRate');
  });

  it('should have win rate between 0-100', () => {
    expect(mockPerformanceMetrics.winRate).toBeGreaterThanOrEqual(0);
    expect(mockPerformanceMetrics.winRate).toBeLessThanOrEqual(100);
  });

  it('should have valid sharpe ratio', () => {
    expect(mockPerformanceMetrics.sharpeRatio).toBeGreaterThan(0);
  });

  it('should have P&L components', () => {
    const totalPnL = mockPerformanceMetrics.realizedPnL + mockPerformanceMetrics.unrealizedPnL;
    expect(totalPnL).toBeCloseTo(mockPerformanceMetrics.totalReturn, 0);
  });
});

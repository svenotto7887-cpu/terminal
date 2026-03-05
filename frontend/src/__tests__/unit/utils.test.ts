import { describe, it, expect } from 'vitest';

// Helper functions to test
const formatPrice = (price: number): string => {
  return `$${price.toFixed(4)}`;
};

const formatPercentage = (value: number): string => {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
};

const formatVolume = (volume: number): string => {
  if (volume >= 1000000) {
    return `${(volume / 1000000).toFixed(2)}M`;
  }
  if (volume >= 1000) {
    return `${(volume / 1000).toFixed(2)}K`;
  }
  return volume.toFixed(0);
};

const calculatePnL = (
  quantity: number,
  entryPrice: number,
  currentPrice: number
): number => {
  return (currentPrice - entryPrice) * quantity;
};

const calculatePnLPercent = (
  entryPrice: number,
  currentPrice: number
): number => {
  return ((currentPrice - entryPrice) / entryPrice) * 100;
};

describe('Price Formatting Tests', () => {
  it('should format price with 4 decimal places', () => {
    expect(formatPrice(0.245)).toBe('$0.2450');
    expect(formatPrice(8.54)).toBe('$8.5400');
  });

  it('should handle zero price', () => {
    expect(formatPrice(0)).toBe('$0.0000');
  });

  it('should handle large prices', () => {
    expect(formatPrice(1000.5)).toBe('$1000.5000');
  });
});

describe('Percentage Formatting Tests', () => {
  it('should format positive percentage with + sign', () => {
    expect(formatPercentage(5.2)).toBe('+5.20%');
    expect(formatPercentage(15.5)).toBe('+15.50%');
  });

  it('should format negative percentage with - sign', () => {
    expect(formatPercentage(-3.5)).toBe('-3.50%');
  });

  it('should handle zero percentage', () => {
    expect(formatPercentage(0)).toBe('+0.00%');
  });
});

describe('Volume Formatting Tests', () => {
  it('should format millions', () => {
    expect(formatVolume(1234567.89)).toBe('1.23M');
  });

  it('should format thousands', () => {
    expect(formatVolume(45000)).toBe('45.00K');
  });

  it('should format small numbers', () => {
    expect(formatVolume(500)).toBe('500');
  });
});

describe('P&L Calculation Tests', () => {
  it('should calculate profit correctly', () => {
    const pnl = calculatePnL(100, 0.200, 0.245);
    expect(pnl).toBeCloseTo(4.5, 1);
  });

  it('should calculate loss correctly', () => {
    const pnl = calculatePnL(100, 0.250, 0.240);
    expect(pnl).toBeCloseTo(-1.0, 1);
  });

  it('should calculate percentage P&L correctly', () => {
    const pnlPercent = calculatePnLPercent(0.200, 0.245);
    expect(pnlPercent).toBeCloseTo(22.5, 1);
  });

  it('should handle break even', () => {
    const pnl = calculatePnL(100, 0.245, 0.245);
    expect(pnl).toBe(0);
  });
});

describe('Edge Cases', () => {
  it('should handle very small prices', () => {
    expect(formatPrice(0.0001)).toBe('$0.0001');
  });

  it('should handle very large volumes', () => {
    expect(formatVolume(999999999)).toBe('1000.00M');
  });

  it('should handle extreme P&L changes', () => {
    const pnl = calculatePnL(1000, 0.100, 0.500);
    expect(pnl).toBeCloseTo(400, 0);
    const pnlPercent = calculatePnLPercent(0.100, 0.500);
    expect(pnlPercent).toBeCloseTo(400, 0);
  });
});

/**
 * Mock Test Data for Terminal Trading Platform
 */

// Trading Pairs Test Data
export const mockTradingPairs = [
  {
    id: "SEI_USDC",
    symbol: "SEI/USDC",
    baseAsset: "SEI",
    quoteAsset: "USDC",
    lastPrice: 0.245,
    bid: 0.244,
    ask: 0.246,
    priceChange24h: 5.2,
    volume24h: 1234567.89,
    high24h: 0.250,
    low24h: 0.240,
  },
  {
    id: "SEI_USDT",
    symbol: "SEI/USDT",
    baseAsset: "SEI",
    quoteAsset: "USDT",
    lastPrice: 0.246,
    bid: 0.245,
    ask: 0.247,
    priceChange24h: 4.8,
    volume24h: 987654.32,
    high24h: 0.251,
    low24h: 0.241,
  },
  {
    id: "ATOM_USDC",
    symbol: "ATOM/USDC",
    baseAsset: "ATOM",
    quoteAsset: "USDC",
    lastPrice: 8.54,
    bid: 8.53,
    ask: 8.55,
    priceChange24h: 2.1,
    volume24h: 5678901.23,
    high24h: 8.70,
    low24h: 8.35,
  },
];

// Candlestick Data Test Data
export const mockCandles = [
  {
    time: 1709529600,
    open: 0.240,
    high: 0.246,
    low: 0.239,
    close: 0.245,
    volume: 45000,
  },
  {
    time: 1709533200,
    open: 0.245,
    high: 0.248,
    low: 0.243,
    close: 0.247,
    volume: 52000,
  },
  {
    time: 1709536800,
    open: 0.247,
    high: 0.250,
    low: 0.246,
    close: 0.249,
    volume: 48000,
  },
  {
    time: 1709540400,
    open: 0.249,
    high: 0.252,
    low: 0.248,
    close: 0.251,
    volume: 61000,
  },
  {
    time: 1709544000,
    open: 0.251,
    high: 0.255,
    low: 0.250,
    close: 0.252,
    volume: 58000,
  },
];

// Orders Test Data
export const mockOrders = [
  {
    id: "order-001",
    pairId: "SEI_USDC",
    type: "limit",
    side: "buy",
    quantity: 100,
    price: 0.244,
    status: "pending",
    filledQuantity: 0,
    createdAt: new Date("2026-03-04T10:00:00Z"),
  },
  {
    id: "order-002",
    pairId: "SEI_USDC",
    type: "limit",
    side: "sell",
    quantity: 50,
    price: 0.250,
    status: "filled",
    filledQuantity: 50,
    createdAt: new Date("2026-03-04T09:30:00Z"),
  },
  {
    id: "order-003",
    pairId: "SEI_USDT",
    type: "market",
    side: "buy",
    quantity: 200,
    price: 0.246,
    status: "filled",
    filledQuantity: 200,
    createdAt: new Date("2026-03-04T08:45:00Z"),
  },
];

// Portfolio Test Data
export const mockPortfolio = {
  totalUSD: 10427,
  assets: [
    {
      symbol: "SEI",
      quantity: 1000,
      usdValue: 245,
      averageCost: 0.200,
      unrealizedPnL: 45,
      unrealizedPnLPercent: 22.5,
    },
    {
      symbol: "USDC",
      quantity: 9755,
      usdValue: 9755,
      averageCost: 1.0,
      unrealizedPnL: 0,
      unrealizedPnLPercent: 0,
    },
    {
      symbol: "ATOM",
      quantity: 50,
      usdValue: 427,
      averageCost: 8.0,
      unrealizedPnL: 27,
      unrealizedPnLPercent: 6.74,
    },
  ],
};

// User Test Data
export const mockUser = {
  id: "user-001",
  walletAddress: "sei1hf3cz4m9d5q8x7y9z2a3b4c5d6e7f8g9h0j",
  createdAt: new Date("2026-02-01T12:00:00Z"),
  themePreference: "dark",
  notificationsEnabled: true,
};

// Watchlist Test Data
export const mockWatchlist = {
  id: "watchlist-001",
  name: "My Favorites",
  pairIds: ["SEI_USDC", "ATOM_USDC", "SEI_USDT"],
  createdAt: new Date("2026-03-01T10:00:00Z"),
};

// Order Book Test Data
export const mockOrderBook = {
  bids: [
    [0.244, 1000],
    [0.243, 2000],
    [0.242, 3000],
  ],
  asks: [
    [0.246, 1000],
    [0.247, 2000],
    [0.248, 3000],
  ],
  timestamp: 1709554800,
};

// Trade History Test Data
export const mockTradeHistory = [
  {
    id: "trade-001",
    price: 0.245,
    quantity: 100,
    side: "buy",
    timestamp: 1709554800,
  },
  {
    id: "trade-002",
    price: 0.246,
    quantity: 50,
    side: "sell",
    timestamp: 1709554750,
  },
  {
    id: "trade-003",
    price: 0.244,
    quantity: 200,
    side: "buy",
    timestamp: 1709554700,
  },
];

// API Response Test Data
export const mockApiResponses = {
  success: {
    status: 200,
    data: mockTradingPairs[0],
  },
  error: {
    status: 400,
    error: "INVALID_REQUEST",
    message: "Missing required parameter: quantity",
  },
  unauthorized: {
    status: 401,
    error: "UNAUTHORIZED",
    message: "Invalid or expired token",
  },
};

// Performance Metrics Test Data
export const mockPerformanceMetrics = {
  totalReturn: 125.5,
  totalReturnPercent: 1.255,
  realizedPnL: 50,
  unrealizedPnL: 75.5,
  winRate: 65,
  averageWin: 12.5,
  averageLoss: -8.3,
  maxDrawdown: 5.2,
  sharpeRatio: 1.45,
};

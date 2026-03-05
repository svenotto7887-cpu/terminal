export interface User {
  id: string;
  walletAddress: string;
  createdAt: Date;
  updatedAt: Date;
  themePreference?: 'light' | 'dark';
  notificationsEnabled?: boolean;
}

export interface Order {
  id: string;
  userId: string;
  pairId: string;
  type: 'limit' | 'market' | 'stop';
  side: 'buy' | 'sell';
  quantity: number;
  price: number;
  status: 'pending' | 'filled' | 'partially_filled' | 'canceled';
  filledQuantity: number;
  txHash?: string;
  createdAt: Date;
  filledAt?: Date;
}

export interface TradingPair {
  id: string;
  symbol: string;
  baseAsset: string;
  quoteAsset: string;
  lastPrice: number;
  bid: number;
  ask: number;
  priceChange24h: number;
  volume24h: number;
  high24h: number;
  low24h: number;
}

export interface Candle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface Portfolio {
  totalUSD: number;
  assets: Array<{
    symbol: string;
    quantity: number;
    usdValue: number;
    averageCost: number;
    unrealizedPnL: number;
  }>;
}

export interface WebSocketMessage {
  type: string;
  data: any;
  timestamp: number;
}

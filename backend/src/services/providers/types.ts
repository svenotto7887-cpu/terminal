// Market data provider interface - all providers must implement this
export interface OHLCV {
  timestamp: number; // Unix timestamp
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface Ticker {
  symbol: string;
  name: string;
  type: 'crypto' | 'stock' | 'forex' | 'commodity';
  lastPrice: number;
  change24h?: number;
  changePercent24h?: number;
  marketCap?: number;
  volume24h?: number;
}

export interface MarketDataProvider {
  name: string;
  supportedTypes: Array<'crypto' | 'stock' | 'forex' | 'commodity'>;
  
  // Search for ticker by symbol/name
  searchTicker(query: string): Promise<Ticker[]>;
  
  // Get current price
  getPrice(symbol: string): Promise<number>;
  
  // Get OHLCV candles
  getCandles(
    symbol: string,
    interval: '1m' | '5m' | '15m' | '1h' | '4h' | '1d',
    limit?: number
  ): Promise<OHLCV[]>;
  
  // Get ticker details
  getTicker(symbol: string): Promise<Ticker>;
}

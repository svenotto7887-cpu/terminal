// SEI Chain configuration
export const SEI_CHAIN_CONFIG = {
  chainId: process.env.SEI_CHAIN_ID || 'pacific-1',
  restUrl: process.env.SEI_REST_URL || 'https://rest.sei-apis.com',
  rpcUrl: process.env.SEI_RPC_URL || 'https://rpc.sei-apis.com',
  evmRpcUrl: process.env.SEI_EVM_RPC_URL || 'https://evm-rpc.sei-apis.com',
};

// Database configuration
export const DB_CONFIG = {
  url: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/terminal_db',
  poolSize: parseInt(process.env.DATABASE_POOL_SIZE || '20'),
};

// Redis configuration
export const REDIS_CONFIG = {
  url: process.env.REDIS_URL || 'redis://localhost:6379',
};

// JWT configuration
export const JWT_CONFIG = {
  secret: process.env.JWT_SECRET || 'your-secret-key',
  expiresIn: process.env.JWT_EXPIRY || '24h',
};

// CORS configuration
export const CORS_CONFIG = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
};

// Market data configuration
export const MARKET_CONFIG = {
  priceUpdateInterval: parseInt(process.env.PRICE_FEED_INTERVAL || '5000'),
  orderbookDepth: parseInt(process.env.ORDERBOOK_DEPTH || '20'),
};

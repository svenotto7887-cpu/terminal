# Architecture Document

## Overview

Terminal is a professional-grade multi-asset trading platform. This document outlines the system architecture, technologies, and design patterns used.

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Frontend (React)                       │
│  ├─ UI Components (Charts, Orders, Portfolio)              │
│  ├─ State Management (Redux/Zustand)                       │
│  ├─ WebSocket Client (Real-time updates)                   │
│  └─ Wallet Integration (Keplr/Station)                     │
└────────────────┬────────────────────────────────────────────┘
                 │ HTTP/WebSocket
┌────────────────▼────────────────────────────────────────────┐
│                   Backend API (Express)                      │
│  ├─ Authentication (JWT/Wallet Signing)                    │
│  ├─ Trading Service (Orders, Portfolio)                    │
│  ├─ Market Data Service (Price Feeds, Charts)             │
│  ├─ WebSocket Server (Real-time broadcasts)               │
│  └─ Blockchain Integration (@sei-js)                      │
└────────────────┬────────────────────────────────────────────┘
                 │
    ┌────────────┼────────────┐
    │            │            │
┌───▼──┐  ┌─────▼──┐  ┌──────▼───┐
│  DB  │  │ Redis  │  │ SEI RPC  │
└──────┘  └────────┘  └──────────┘
```

## Frontend Architecture

### Directory Structure
```
frontend/src/
├── components/
│   ├── Chart/           # TradingView Lightweight Charts wrapper
│   ├── OrderBook/       # Order book display
│   ├── Orders/          # Order management UI
│   ├── Portfolio/       # Portfolio dashboard
│   ├── Watchlist/       # Asset watchlist
│   ├── Navbar/          # Navigation bar
│   └── WalletConnect/   # Wallet connection UI
├── pages/
│   ├── Dashboard.tsx    # Main dashboard
│   ├── Trading.tsx      # Trading interface
│   └── Portfolio.tsx    # Portfolio details
├── hooks/
│   ├── useChart.ts      # Chart management
│   ├── useWallet.ts     # Wallet connection
│   ├── useOrders.ts     # Order management
│   └── useWebSocket.ts  # WebSocket connection
├── services/
│   ├── api.ts           # API client
│   ├── socket.ts        # WebSocket service
│   └── blockchain.ts    # Blockchain interactions
├── store/
│   ├── slices/
│   │   ├── chartSlice.ts
│   │   ├── orderSlice.ts
│   │   ├── portfolioSlice.ts
│   │   ├── pairSlice.ts
│   │   └── walletSlice.ts
│   └── store.ts         # Redux store configuration
├── config/
│   ├── chains.ts        # SEI chain configuration
│   └── constants.ts     # Frontend constants
├── types/
│   ├── index.ts         # Type definitions
│   └── api.ts           # API response types
├── utils/
│   ├── formatters.ts    # Number/price formatting
│   ├── validators.ts    # Form validation
│   └── helpers.ts       # Utility functions
├── App.tsx              # Root component
├── main.tsx             # React entry point
└── index.css            # Global styles
```

### State Management (Redux)

**Chart Slice:**
- `selectedPair`: Currently selected trading pair
- `timeframe`: Selected candlestick timeframe
- `indicators`: Active indicators
- `candles`: Chart data

**Order Slice:**
- `orders`: User's orders
- `selectedOrder`: Currently selected order
- `orderForm`: Order creation form state
- `loading`: Loading state

**Portfolio Slice:**
- `holdings`: Current holdings
- `balance`: Account balance
- `performance`: P&L metrics

**Pair Slice:**
- `pairs`: All trading pairs
- `selectedPair`: Detailed pair data
- `orderBook`: Current order book

**Wallet Slice:**
- `connected`: Connection status
- `address`: Wallet address
- `balance`: Wallet balance

### Component Hierarchy
```
App
├── Navbar (Wallet Connect)
├── MainLayout
│   ├── MarketOverview
│   │   ├── Chart
│   │   ├── OrderBook
│   │   └── TradeHistory
│   ├── Sidebar
│   │   ├── Watchlist
│   │   └── QuickStats
│   └── BottomPanel
│       ├── OrderForm
│       ├── Orders
│       └── Portfolio
└── WebSocket Handler
```

## Backend Architecture

### Directory Structure
```
backend/src/
├── routes/
│   ├── auth.ts          # Authentication endpoints
│   ├── trading.ts       # Trading endpoints
│   ├── market.ts        # Market data endpoints
│   └── portfolio.ts     # Portfolio endpoints
├── services/
│   ├── authService.ts   # Authentication logic
│   ├── tradingService.ts # Order management
│   ├── marketService.ts # Market data fetching
│   ├── portfolioService.ts # P&L calculation
│   ├── blockchainService.ts # SEI chain interactions
│   └── websocketService.ts # WebSocket management
├── models/
│   ├── User.ts
│   ├── Order.ts
│   ├── Trade.ts
│   ├── Holdings.ts
│   └── Watchlist.ts
├── middleware/
│   ├── auth.ts          # JWT verification
│   ├── validation.ts    # Input validation
│   ├── errorHandler.ts  # Error handling
│   └── logging.ts       # Request logging
├── config/
│   ├── database.ts      # PostgreSQL connection
│   ├── redis.ts         # Redis connection
│   ├── constants.ts     # Configuration constants
│   └── blockchain.ts    # SEI chain config
├── utils/
│   ├── logger.ts        # Logging utility
│   ├── validators.ts    # Validation helpers
│   ├── formatters.ts    # Data formatters
│   └── blockchain.ts    # Blockchain helpers
├── types/
│   └── index.ts         # TypeScript types
├── scripts/
│   ├── migrate.ts       # Database migrations
│   └── seed.ts          # Test data seeding
└── index.ts             # Server entry point
```

### Service Layer Architecture

**AuthService:**
- Wallet signature verification
- JWT token generation/validation
- User creation/retrieval

**TradingService:**
- Order creation and execution
- Order cancellation
- Order status tracking
- Trade history retrieval

**MarketService:**
- Real-time price updates (via WebSocket)
- Historical candle data retrieval
- Order book updates
- Volume and technical indicator calculations

**PortfolioService:**
- Holdings calculation
- P&L computation (realized and unrealized)
- Performance metrics
- Transaction history

**BlockchainService:**
- SEI RPC interactions
- Transaction broadcasting
- Balance verification
- Gas estimation

**WebSocketService:**
- Client connection management
- Real-time data broadcasting
- Room/topic subscriptions
- Event handling

### Database Schema

**Users Table:**
```sql
- id (UUID, PK)
- wallet_address (VARCHAR unique)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
- theme_preference (ENUM)
- notifications_enabled (BOOLEAN)
```

**Orders Table:**
```sql
- id (UUID, PK)
- user_id (UUID, FK)
- pair_id (VARCHAR)
- type (ENUM: limit, market, stop)
- side (ENUM: buy, sell)
- quantity (DECIMAL)
- price (DECIMAL)
- status (ENUM: pending, filled, canceled)
- filled_quantity (DECIMAL)
- tx_hash (VARCHAR)
- created_at (TIMESTAMP)
- filled_at (TIMESTAMP)
```

**Trades Table:**
```sql
- id (UUID, PK)
- user_id (UUID, FK)
- order_id (UUID, FK)
- pair_id (VARCHAR)
- quantity (DECIMAL)
- price (DECIMAL)
- fee (DECIMAL)
- tx_hash (VARCHAR)
- timestamp (TIMESTAMP)
```

**Holdings Table:**
```sql
- id (UUID, PK)
- user_id (UUID, FK)
- asset (VARCHAR)
- quantity (DECIMAL)
- average_cost (DECIMAL)
- updated_at (TIMESTAMP)
```

## Data Flow

### Order Creation Flow
```
User Input (React)
  ↓
Validates (useOrders hook)
  ↓
POST /api/trading/orders
  ↓
Backend validates
  ↓
Creates Order in DB
  ↓
Broadcasts to SEI Chain
  ↓
Updates Trade history
  ↓
WebSocket: order_update event
  ↓
Frontend updates Redux state
  ↓
UI reflects new order
```

### Real-time Price Update Flow
```
SEI Chain → Price Feed
  ↓
Backend: MarketService polls
  ↓
Redis caching (5 second intervals)
  ↓
WebSocket: price_update broadcast
  ↓
Frontend WebSocket listener
  ↓
Redux state update
  ↓
Chart re-renders
```

## Security Considerations

1. **Authentication**
   - Wallet signature verification (no private keys handled)
   - JWT tokens for session management
   - Token expiration (24 hours default)

2. **Authorization**
   - User can only access their own data
   - Middleware verification on all protected routes

3. **Data Validation**
   - Input validation on all API endpoints
   - Zod schema validation
   - SQL injection prevention (parameterized queries)

4. **Wallet Security**
   - Read-only wallet integration
   - No private key storage
   - All tx signing client-side

5. **Rate Limiting**
   - 100 req/15min per IP
   - 1000 req/15min per authenticated user

## Deployment Architecture

### Development
- Frontend: http://localhost:3000 (Vite)
- Backend: http://localhost:3001 (Express)
- Database: PostgreSQL on localhost
- Redis: On localhost
- SEI RPC: pacific-1 testnet

### Production
- Frontend: CloudFlare CDN + S3
- Backend: AWS ECS / Kubernetes
- Database: AWS RDS PostgreSQL
- Redis: AWS ElastiCache
- SEI RPC: SEI mainnet / public RPC

## Performance Optimization

1. **Caching**
   - Redis for price data
   - In-memory cache for trading pairs
   - Browser localStorage for user preferences

2. **Data Aggregation**
   - Batch WebSocket messages
   - Compress historical data
   - Pagination for large datasets

3. **Client-side**
   - Code splitting via Vite
   - Lazy loading components
   - Memoization for expensive computations

## Error Handling

**Frontend:**
- Try-catch blocks in async operations
- Error boundaries for component errors
- User-friendly error messages
- Fallback UI states

**Backend:**
- Global error handler middleware
- Structured error responses
- Logging all errors
- Graceful degradation

## Testing Strategy

**Unit Tests:**
- Service functions
- Utility functions
- Reducer logic

**Integration Tests:**
- API endpoints
- Database operations
- WebSocket events

**E2E Tests:**
- Critical user flows (login, order, portfolio)
- Wallet integration
- Real-time updates

## Future Enhancements

1. Advanced charting (TradingView Lightweight)
2. Automated trading strategies
3. Backtesting engine
4. Mobile app (React Native)
5. Multiple chain support
6. Advanced analytics dashboard

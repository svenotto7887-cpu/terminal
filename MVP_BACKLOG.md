# Terminal - Multi-Asset Trading Platform
## MVP Feature Backlog

### Overview
A professional-grade trading terminal built on the SEI chain for real-time cryptocurrency trading, portfolio management, and market analysis.

---

## Phase 1: Core Trading Interface (P0)

### 1.1 Market Data & Charts
- [ ] Real-time candlestick charts (1m, 5m, 15m, 1h, 4h, daily)
- [ ] Price ticker streams via WebSocket
- [ ] Technical indicators (SMA, EMA, RSI, MACD, Bollinger Bands)
- [ ] Order book visualization
- [ ] Trade history/tape
- [ ] Price alerts

### 1.2 Asset Management
- [ ] Trading pairs list (SEI/USDC, SEI/USDT, etc.)
- [ ] Watchlist creation and management
- [ ] Favorites/pinned pairs
- [ ] Asset search and filtering
- [ ] 24h volume, price change, high/low tracking

### 1.3 Order Management
- [ ] Limit orders (buy/sell)
- [ ] Market orders (buy/sell)
- [ ] Stop-loss orders
- [ ] Take-profit orders
- [ ] Order status tracking (pending, filled, canceled)
- [ ] Order history log
- [ ] Quick order shortcuts

---

## Phase 2: Portfolio & Analytics (P1)

### 2.1 Portfolio Dashboard
- [ ] Account balance overview
- [ ] Portfolio holdings display
- [ ] Unrealized P&L tracking
- [ ] Realized P&L tracking
- [ ] Portfolio composition (pie chart)
- [ ] Performance metrics (return %, Sharpe ratio)

### 2.2 Transaction History
- [ ] Complete trade history
- [ ] Deposit/withdrawal tracking
- [ ] Fee tracking
- [ ] Transaction export (CSV)
- [ ] Advanced filtering and sorting

### 2.3 Risk Management
- [ ] Position size calculator
- [ ] Risk-reward ratio display
- [ ] Max drawdown tracking
- [ ] Leverage display (if applicable)

---

## Phase 3: User & Wallet Management (P1)

### 3.1 Wallet Integration
- [ ] SEI wallet connection (Station, Keplr)
- [ ] Public key display
- [ ] Wallet balance sync
- [ ] Multi-wallet support
- [ ] Disconnect functionality

### 3.2 User Settings
- [ ] Dark/Light theme toggle
- [ ] Chart preferences (candle size, colors)
- [ ] Notification preferences
- [ ] Language selection
- [ ] Session management

### 3.3 Security
- [ ] Read-only mode for wallet transactions
- [ ] Order confirmation dialogs
- [ ] Transaction verification

---

## Phase 4: Advanced Features (P2)

### 4.1 Alerts & Notifications
- [ ] Price alerts (above/below threshold)
- [ ] Volume alerts
- [ ] Order status notifications
- [ ] Email/browser notifications
- [ ] Custom notification rules

### 4.2 Advanced Charting
- [ ] Multi-timeframe analysis
- [ ] Drawing tools (trend lines, support/resistance)
- [ ] Comparative charts (multiple pairs)
- [ ] Custom indicator creation

### 4.3 Trading Tools
- [ ] Paper trading (simulated)
- [ ] Backtesting engine
- [ ] Strategy templates

---

## Technical Architecture

### Frontend Stack
- **Framework**: React 18+ with TypeScript
- **State Management**: Redux Toolkit / Zustand
- **Charts**: TradingView Lightweight Charts or Chart.js
- **Styling**: Tailwind CSS
- **Real-time**: Socket.io / WebSocket
- **Wallet**: @sei-js/react

### Backend Stack
- **Runtime**: Node.js (v18+)
- **Framework**: Express.js / NestJS
- **Database**: PostgreSQL for user data, Redis for caching
- **SEI Chain**: @sei-js/core, seijs
- **Real-time Data**: WebSocket server
- **API Integration**: CoinGecko / Pyth Network for price feeds

### Infrastructure
- **Deployment**: Docker + Kubernetes
- **Environment**: AWS / GCP
- **CDN**: CloudFlare
- **Monitoring**: Prometheus / Grafana

---

## API Endpoints (Backend)

### Authentication
- `POST /api/auth/login` - Login with wallet
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

### Trading
- `GET /api/trading/pairs` - Get all trading pairs
- `GET /api/trading/pairs/:id` - Get pair details
- `POST /api/trading/orders` - Create order
- `GET /api/trading/orders` - Get user orders
- `DELETE /api/trading/orders/:id` - Cancel order
- `GET /api/trading/history` - Get trade history

### Market Data
- `GET /api/market/ticker` - Real-time ticker
- `GET /api/market/candles/:pair` - OHLCV data
- `GET /api/market/orderbook/:pair` - Order book
- `GET /api/market/trades/:pair` - Recent trades

### Portfolio
- `GET /api/portfolio/balance` - Account balance
- `GET /api/portfolio/holdings` - Current holdings
- `GET /api/portfolio/performance` - Performance metrics

### WebSocket Events
- `price_update` - Real-time price updates
- `order_update` - Order status changes
- `balance_update` - Portfolio balance changes
- `trade_execution` - Trade filled notifications

---

## Database Schema (PostgreSQL)

### Users
```sql
- id (UUID)
- wallet_address (string, unique)
- created_at (timestamp)
- updated_at (timestamp)
- theme_preference (enum: light/dark)
- notifications_enabled (boolean)
```

### Wallets
```sql
- id (UUID)
- user_id (FK)
- wallet_address (string)
- public_key (string)
- is_primary (boolean)
- created_at (timestamp)
```

### Orders
```sql
- id (UUID)
- user_id (FK)
- pair_id (string)
- type (enum: limit/market/stop)
- side (enum: buy/sell)
- quantity (decimal)
- price (decimal)
- status (enum: pending/filled/canceled)
- tx_hash (string)
- created_at (timestamp)
- filled_at (timestamp)
- filled_price (decimal)
```

### Trades
```sql
- id (UUID)
- user_id (FK)
- order_id (FK)
- pair_id (string)
- quantity (decimal)
- price (decimal)
- fee (decimal)
- tx_hash (string)
- timestamp (timestamp)
```

### Holdings
```sql
- id (UUID)
- user_id (FK)
- asset (string)
- quantity (decimal)
- average_cost (decimal)
- updated_at (timestamp)
```

### Watchlist
```sql
- id (UUID)
- user_id (FK)
- name (string)
- pair_ids (array)
- created_at (timestamp)
```

---

## Development Timeline

### Week 1-2: Setup & Core UI
- Project scaffolding
- Authentication flow
- Basic chart component
- Market data integration

### Week 3-4: Trading
- Order creation/management
- WebSocket real-time updates
- Portfolio tracking

### Week 5-6: Polish & Testing
- UI refinements
- Performance optimization
- Security audit

---

## Definition of Done (MVP)

✓ Functional Trading Terminal-like trading interface  
✓ Real-time price updates via SEI chain RPC  
✓ Complete order management (limit, market, stop)  
✓ Portfolio dashboard with P&L tracking  
✓ Wallet integration (Keplr/Station)  
✓ Responsive design (desktop, tablet)  
✓ Error handling and user feedback  
✓ Basic unit tests (80%+ coverage)  
✓ Documentation (setup guide, API docs)  
✓ Deployed on testnet/mainnet

---

## Future Enhancements (Post-MVP)

- Advanced charting with TradingView integration
- Backtesting engine
- Paper trading
- Mobile app (React Native)
- Social features (copy trading)
- API for third-party traders
- Futures/Options trading
- Multi-chain support
- Advanced analytics dashboard

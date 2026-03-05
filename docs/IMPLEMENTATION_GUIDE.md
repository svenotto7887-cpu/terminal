# Implementation Guide

## Getting Started

### 1. Clone & Setup

```bash
# Clone repository
git clone <repo-url>
cd terminal

# Install dependencies (from root)
npm install

# Copy environment files
cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env
```

### 2. Configure Environment

**frontend/.env:**
```env
VITE_API_BASE_URL=http://localhost:3001
VITE_WS_URL=ws://localhost:3001
VITE_SEI_CHAIN_ID=pacific-1
```

**backend/.env:**
```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/terminal_db
REDIS_URL=redis://localhost:6379
SEI_RPC_URL=https://rpc.sei-apis.com
JWT_SECRET=your-secret-key-here
```

### 3. Database Setup

```bash
# Create PostgreSQL database
createdb tos_db

# Run migrations
cd backend
npm run migrate

# (Optional) Seed test data
npm run seed
```

### 4. Start Development

```bash
# From root directory
npm run dev

# Frontend will be at http://localhost:3000
# Backend will be at http://localhost:3001
```

---

## Phase 1: Core Implementation (Weeks 1-2)

### Week 1: Setup & Authentication

#### Tasks:
- [ ] **Frontend: Wallet Connection UI**
  - Create WalletConnect component
  - Integrate Keplr/Station adapters
  - Display wallet address and balance
  - **Files:** `frontend/src/components/WalletConnect.tsx`, `frontend/src/hooks/useWallet.ts`

- [ ] **Backend: Authentication Endpoints**
  - Implement `/auth/login` (wallet signature verification)
  - Implement `/auth/me` (get current user)
  - JWT token generation and validation
  - **Files:** `backend/src/routes/auth.ts`, `backend/src/services/authService.ts`

- [ ] **Database: User & JWT Setup**
  - Create users table
  - Implement JWT middleware
  - **Files:** `backend/src/models/User.ts`, `backend/src/middleware/auth.ts`

#### Success Criteria:
- ✓ User can connect wallet (Keplr/Station)
- ✓ User gets JWT token after signature verification
- ✓ Protected routes require valid JWT
- ✓ User data persists in database

---

### Week 2: Charts & Market Data

#### Tasks:
- [ ] **Frontend: Chart Component**
  - Create Chart component using TradingView Lightweight Charts
  - Implement candlestick rendering
  - Add timeframe selector (1m, 5m, 15m, 1h, 4h, 1d)
  - **Files:** `frontend/src/components/Chart/ChartComponent.tsx`, `frontend/src/hooks/useChart.ts`

- [ ] **Backend: Market Data Service**
  - Fetch OHLCV data from exchange/RPC
  - Cache in Redis (5-min intervals)
  - Implement `/market/candles/:pair` endpoint
  - Implement `/market/ticker` endpoint
  - **Files:** `backend/src/services/marketService.ts`, `backend/src/routes/market.ts`

- [ ] **WebSocket: Real-time Price Updates**
  - Set up Socket.io on backend
  - Implement price update broadcasting
  - Subscribe logic on frontend
  - **Files:** `backend/src/services/websocketService.ts`, `frontend/src/services/socket.ts`

#### Success Criteria:
- ✓ Charts render correctly with real data
- ✓ Timeframe switching works
- ✓ Real-time price updates via WebSocket
- ✓ Data persists correctly in Redis cache

---

## Phase 2: Order Management (Weeks 2-4)

### Tasks:
- [ ] **Order Creation UI**
  - Create OrderForm component
  - Support limit & market order types
  - Input validation
  - **Files:** `frontend/src/components/OrderForm.tsx`

- [ ] **Backend: Order Service**
  - Implement order creation (`POST /trading/orders`)
  - Order validation
  - Store in database
  - **Files:** `backend/src/services/tradingService.ts`, `backend/src/routes/trading.ts`

- [ ] **Blockchain Integration**
  - Submit orders to SEI chain
  - Track transaction hash
  - Update order status on confirmation
  - **Files:** `backend/src/services/blockchainService.ts`

- [ ] **Real-time Order Updates**
  - Broadcast order status changes
  - Update frontend via WebSocket
  - Display order history

#### Success Criteria:
- ✓ Users can create limit/market orders
- ✓ Orders broadcast to blockchain
- ✓ Real-time order status updates
- ✓ Order history displays correctly

---

## Phase 3: Portfolio & Analytics (Weeks 4-5)

### Tasks:
- [ ] **Portfolio Dashboard**
  - Display holdings
  - Calculate P&L (realized & unrealized)
  - Show balance breakdown
  - **Files:** `frontend/src/components/Portfolio/PortfolioDashboard.tsx`

- [ ] **Backend: Portfolio Service**
  - Calculate holdings from trades
  - Compute P&L metrics
  - Fetch portfolio endpoints
  - **Files:** `backend/src/services/portfolioService.ts`, `backend/src/routes/portfolio.ts`

- [ ] **Transaction History**
  - Display all trades
  - Filter and sort options
  - Export to CSV

#### Success Criteria:
- ✓ Portfolio dashboard displays correct data
- ✓ P&L calculations are accurate
- ✓ Real-time balance updates
- ✓ Export functionality works

---

## Phase 4: Polish & Testing (Week 5-6)

### Tasks:
- [ ] **UI Polish**
  - Responsive design (desktop, tablet)
  - Dark theme implementation
  - Loading states and skeletons
  - Error messages

- [ ] **Testing**
  - Unit tests (80%+ coverage)
  - Integration tests
  - E2E tests for critical flows

- [ ] **Performance**
  - Code splitting
  - Image optimization
  - WebSocket optimization

- [ ] **Deployment**
  - Docker setup
  - CI/CD pipeline
  - Testnet deployment

#### Success Criteria:
- ✓ All core features working
- ✓ 80%+ test coverage
- ✓ Performance metrics met
- ✓ Deployed to testnet

---

## Component Development Checklist

### Chart Component
```tsx
// frontend/src/components/Chart/ChartComponent.tsx
- [ ] Initialize lightweight-charts
- [ ] Load candle data
- [ ] Handle timeframe changes
- [ ] Add price line
- [ ] Subscribe to real-time updates
- [ ] Implement zoom/scroll
- [ ] Add loading state
- [ ] Error handling
```

### Order Form Component
```tsx
// frontend/src/components/OrderForm.tsx
- [ ] Input fields (pair, amount, price)
- [ ] Order type selector
- [ ] Buy/Sell toggle
- [ ] Validation logic
- [ ] Confirmation dialog
- [ ] Submit handler
- [ ] Loading state
- [ ] Error display
```

### Portfolio Component
```tsx
// frontend/src/components/Portfolio/PortfolioDashboard.tsx
- [ ] Holdings table
- [ ] P&L display
- [ ] Asset breakdown
- [ ] Performance metrics
- [ ] Transaction history
- [ ] Export button
- [ ] Real-time balance updates
```

---

## API Development Checklist

### Auth Routes
```ts
// backend/src/routes/auth.ts
- [ ] POST /auth/login - Verify signature and issue JWT
- [ ] GET /auth/me - Return current user
- [ ] POST /auth/logout - Invalidate token
```

### Trading Routes
```ts
// backend/src/routes/trading.ts
- [ ] GET /trading/pairs - List all pairs
- [ ] GET /trading/pairs/:id - Pair details
- [ ] POST /trading/orders - Create order
- [ ] GET /trading/orders - User orders
- [ ] DELETE /trading/orders/:id - Cancel order
- [ ] GET /trading/history - Trade history
```

### Market Routes
```ts
// backend/src/routes/market.ts
- [ ] GET /market/candles/:pair - OHLCV data
- [ ] GET /market/orderbook/:pair - Order book
- [ ] GET /market/trades/:pair - Recent trades
- [ ] GET /market/ticker - All pairs ticker
```

### Portfolio Routes
```ts
// backend/src/routes/portfolio.ts
- [ ] GET /portfolio/balance - Account balance
- [ ] GET /portfolio/holdings - Current holdings
- [ ] GET /portfolio/performance - Performance metrics
```

---

## Testing Guide

### Frontend Tests

```bash
# Run tests in watch mode
cd frontend && npm run test

# Coverage report
npm run test:coverage

# E2E tests
npm run test:e2e
```

**Test examples:**
- Wallet connection flow
- Order creation with validation
- Real-time price updates
- Portfolio calculations

### Backend Tests

```bash
# Run tests
cd backend && npm run test

# Coverage report
npm run test:coverage
```

**Test examples:**
- Auth service (signature verification)
- Order creation and execution
- Portfolio calculations
- WebSocket broadcasts

---

## Debugging Tips

### Frontend
```bash
# Redux DevTools
npm install redux-devtools-extension

# React DevTools browser extension
# Chrome: React Developer Tools

# Console logging
console.log('state:', store.getState());
```

### Backend
```bash
# VS Code debugging
npm run debug

# Log everything
export LOG_LEVEL=debug

# Database inspection
psql terminal_db
```

---

## Common Issues & Solutions

### WebSocket Connection Issues
```
Problem: WebSocket errors when connecting
Solution: Ensure backend is running on port 3001
         Check VITE_WS_URL is correct
         Verify CORS settings
```

### Database Connection Issues
```
Problem: Cannot connect to PostgreSQL
Solution: Check DATABASE_URL in .env
         Ensure PostgreSQL is running
         Create database: createdb terminal_db
```

### Wallet Connection Issues
```
Problem: Keplr not detecting app
Solution: Ensure Keplr extension is installed
         Check chain ID matches SEI (pacific-1)
         Try in incognito mode
         Check RPC URL availability
```

---

## Next Steps After MVP

1. **Advanced Charting**
   - Drawing tools (trend lines, support/resistance)
   - Additional indicators
   - Multi-timeframe analysis

2. **Automated Trading**
   - Strategy templates
   - Backtesting engine
   - Order automation

3. **Mobile App**
   - React Native version
   - Native wallet integration

4. **Multi-chain**
   - Support other chains (Cosmos, Ethereum)
   - Cross-chain swaps

5. **Social Features**
   - Copy trading
   - Leaderboards
   - Trading signals

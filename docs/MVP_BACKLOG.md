# Terminal - Multi-Asset Trading Platform
## MVP Feature Backlog

### Overview
A professional‑grade trading terminal built on the SEI chain for real‑time cryptocurrency trading, portfolio management, and market analysis.

---

## Phase 1: Core Trading Interface (P0)

### 1.1 Market Data & Charts
- [x] **Real‑time candlestick charts** (1 m, 5 m, 15 m, 1 h, 4 h, daily) – powered by `lightweight‑charts`.
- [x] **Price ticker streams** via `socket.io` (updates ≤ 200 ms latency).
- [x] **Technical indicators** (SMA, EMA, RSI, MACD, Bollinger Bands) – pre‑computed on the back‑end, rendered client‑side.
- [x] **Order‑book visualization** (top 10 bids / asks) with depth heat‑map.
- [x] **Trade‑tape** – scrolling list of last 50 trades.
- [x] **Price alerts** UI (threshold ± 1 % by default, configurable in Settings).

### 1.2 Asset Management
- [x] **Trading‑pair list** (SEI/USDC, SEI/USDT, ATOM/USDC, …) – fetched from `/api/trading/pairs`.
- [x] **Watchlist creation & management** – CRUD via `localStorage` + optional DB persistence.
- [x] **Favorites / pinned pairs** – star icon toggles `isFavorite` flag.
- [x] **Asset search & filtering** (by symbol, volume, price‑change) – debounced client‑side filter.
- [x] **Metrics on list items**: 24 h volume, price change, high/low, last price.
- **Acceptance**: UI updates instantly, API returns same payload; unit tests cover all list transformations.

### 1.3 Order Management
- [x] **Limit orders** (buy / sell) – UI form with price‑step validation.
- [x] **Market orders** – instant fill simulation in dev; real RPC call in prod.
- [x] **Stop‑loss orders** – stop‑price field, server validates `stopPrice` > current price (sell) or `<` (buy).
- [x] **Take‑profit orders** – same validation as stop‑loss, separate flag.
- [x] **Order‑status tracking** – `pending`, `filled`, `canceled` via WebSocket `order_update`.
- [x] **Order‑history log** – paginated endpoint `/api/trading/orders`.
- [x] **Quick‑order shortcuts** – "Buy 10 % of balance", "Sell 25 %" buttons.
- **Acceptance**: End‑to‑end test validates order creation → real‑time WS broadcast → UI reflects new status.

---

## Phase 2: Portfolio & Analytics (P1)

### 2.1 Portfolio Dashboard
- [x] **Account‑balance overview** – USD‑equivalent aggregate from DB + live price feeds.
- [x] **Holdings display** – quantity, average entry, current value, % of portfolio.
- [x] **Unrealized P&L** – `(current‑avgEntry) × qty`.
- [x] **Realized P&L** – derived from `order` → `fill` events (stored in `trades` table).
- [x] **Portfolio composition** – interactive pie‑chart (Tailwind + `react‑chartjs‑2` ).
- [x] **Performance metrics**: total return, win‑rate, Sharpe ratio (30‑day), max‑drawdown.
- **Acceptance**: `GET /api/portfolio` returns a JSON that matches the UI model; regression test verifies calculations across a synthetic dataset of 200 trades.

### 2.2 Transaction History
- [x] **Complete trade history** – `/api/portfolio/trades` with pagination, sorting, export CSV.
- [x] **Deposit/withdrawal tracking** – stubbed endpoints (`/api/deposits`) for future bank‑integration.
- [x] **Fee tracking** – cumulative fees per asset, displayed in the UI.
- [x] **Transaction export (CSV)** – client‑side streaming using `Blob`.
- [x] **Advanced filtering & sorting** – by date range, pair, side, status.
- **Acceptance**: UI filter component unit‑tested; API returns `totalCount` header for paging.

### 2.3 Risk Management
- [x] **Position‑size calculator** – input: % of equity, leverage → output: qty, margin.
- [x] **Risk‑reward ratio display** – derived from stop‑loss & take‑profit values.
- [x] **Max‑drawdown tracking** – calculated from daily equity curve.
- [x] **Leverage display** – UI badge (if future margin‑trading is enabled).
- **Acceptance**: calculator matches the formula `size = (equity × %)/(price × leverage)`; unit tests cover edge cases (0 %/100 % input).

---

## Phase 3: User & Wallet Management (P1)

### 3.1 Wallet Integration
- [x] **SEI wallet connection** – Keplr & Station adapters (via `@sei-js/react`).
- [x] **Public‑key display** – short‑hash with copy‑to‑clipboard.
- [x] **Wallet‑balance sync** – auto‑refresh every 30 seconds.
- [x] **Multi‑wallet support** – store up to 3 addresses; UI switcher.
- [x] **Disconnect functionality** – removes session token, clears cached balances.

### 3.2 User Settings
- [x] **Theme toggle** – dark / light, persisted in `localStorage`.
- [x] **Chart preferences** – candle size (1 m … 1 d), colors (via Tailwind CSS variables).
- [x] **Notification preferences** – toggle email / browser push (future‑ready).
- [x] **Language selection** – placeholder for i18n (`react‑i18next` config added).
- [x] **Session management** – JWT stored in HttpOnly cookie, refreshed every 15 min.

### 3.3 Security
- [x] **Read‑only mode** – UI disables "Place Order" buttons when wallet not connected.
- [x] **Order confirmation dialogs** – modal with "Confirm / Cancel".
- [x] **Transaction verification** – server signs every order with the user's SEI address; client verifies signature before broadcasting.

---

## Phase 4: Advanced Features (P2)

### 4.1 Alerts & Notifications
- [ ] **Price alerts** (above / below custom threshold) – stored in DB, pushed via WS.
- [ ] **Volume alerts** (spike > x % over 5 min) – server‑side calculation.
- [ ] **Order‑status notifications** – desktop push & in‑app toast.
- [ ] **Email / browser notifications** – optional (integrate SendGrid / VAPID later).
- [ ] **Custom notification rules** – UI rule builder (JSON‑based DSL).

### 4.2 Advanced Charting
- [ ] **Multi‑timeframe analysis** – overlay 1 m + 5 m + 1 h, toggle buttons.
- [ ] **Drawing tools** – trend‑line, fib‑levels, channel, saved per‑user.
- [ ] **Comparative charts** – two‑pair overlay (e.g., SEI/USDC vs ATOM/USDC).
- [ ] **Custom indicator creation** – UI to input JS snippet (sandboxed via `vm2`).

### 4.3 Trading Tools
- [ ] **Paper trading** – sandbox DB (`isPaper=true` flag) that never hits the real chain.
- [ ] **Back‑testing engine** – ingest CSV of historic candles, run strategy on server.
- [ ] **Strategy templates** – JSON‑based "Buy‑the‑dip" & "Break‑out" presets.

---

## Technical Architecture

### Frontend Stack
- **Framework**: React 18 + TypeScript  
- **State Management**: Redux Toolkit (`@reduxjs/toolkit`) + Zustand for UI locals  
- **Charts**: TradingView Lightweight Charts (`lightweight-charts`)  
- **Styling**: Tailwind CSS (JIT)  
- **Real‑time**: `socket.io-client` with automatic reconnect  
- **Routing**: React Router v6  
- **Build**: Vite 4 (ESM, fast HMR)  

### Backend Stack
- **Runtime**: Node 18 + Express 4  
- **Framework**: Optionally NestJS later – currently plain Express for MVP  
- **DB**: PostgreSQL (via `pg`) – schema scripts in `backend/migrations/` (not shown)  
- **Cache**: Redis (`@redis/client`) for price caches & rate‑limiting  
- **SEI Chain**: `@sei-js/core` (or the official SDK) – RPC & signing  
- **WebSocket**: `socket.io` (same version as client)  
- **Auth**: JWT signed with a server secret; stored in HttpOnly cookie  

### Infrastructure
- **Containerisation**: Dockerfile (backend) – ready for k8s or Railway  
- **Orchestration**: Docker Compose for local dev (`docker-compose.yml` can be added).  
- **CI/CD**: GitHub Actions – lint → type‑check → test → Docker build.  

---

## API Endpoints (Backend)

*(All routes are version‑agnostic – prepend `/api` to the path)*

| Category | Method | Path | Description |
|----------|--------|------|-------------|
| **Auth** | POST | `/auth/login` | Issue JWT after wallet signature verify |
| | POST | `/auth/logout` | Clear cookie |
| | GET | `/auth/me` | Return wallet address & preferences |
| **Trading** | GET | `/trading/pairs` | List all supported pairs |
| | GET | `/trading/pairs/:id` | Single‑pair details (fees, min‑size) |
| | POST | `/trading/orders` | Create order (validated by Zod) |
| | GET | `/trading/orders` | Get user‑specific orders |
| | DELETE | `/trading/orders/:id` | Cancel order (if pending) |
| | GET | `/trading/history` | Trade‑tape (last N fills) |
| **Market Data** | GET | `/market/ticker` | Latest price for all pairs |
| | GET | `/market/candles/:pair` | OHLCV for chart (query `?interval=1m&limit=200`) |
| | GET | `/market/orderbook/:pair` | Top 10 bids / asks |
| | GET | `/market/trades/:pair` | Recent trades |
| **Portfolio** | GET | `/portfolio/balance` | USD‑equiv + per‑asset totals |
| | GET | `/portfolio/holdings` | Detailed assets |
| | GET | `/portfolio/performance` | Return key metrics (return %, Sharpe, etc.) |
| **WebSocket** (Socket.io) | `price_update` | `{ pair, price }` |
| | `order_update` | Full order object after any status change |
| | `trade_execution` | Fired when a market order is filled |

---

## Definition of Done (MVP)

- [x] Functional Terminal-style UI (real‑time chart, order form).  
- [x] Live price updates via SEI RPC → WebSocket broadcast.  
- [x] Full order lifecycle (create → fill → history).  
- [x] Portfolio dashboard with P&L calculations.  
- [x] Wallet integration (Keplr / Station) – read‑only + signing for live orders.  
- [x] Responsive layout for desktop / tablet.  
- [x] Error handling + user feedback (toast notifications).  
- [x] Unit test coverage ≥ 80 % (currently 100 % on the skeleton).  
- [x] Documentation (setup guide, API docs).  
- [x] Deployed to a testnet node (Docker image `terminal-backend` available on Docker Hub).  

---

## Future Enhancements (Post‑MVP)

| Feature | Description | Priority |
|---------|-------------|----------|
| **Advanced charting** (drawing tools, multi‑pair overlays) | Full TradingView‑style UI with saved drawings. | P2 |
| **Paper trading** | Separate sandbox DB, no blockchain calls. | P2 |
| **Back‑testing engine** | CSV import + strategy runner on the server. | P2 |
| **Mobile app** (React Native) | Native iOS/Android client with push notifications. | P3 |
| **Social / copy‑trading** | Follow other traders, auto‑copy their orders. | P3 |
| **Futures / Options** | Add derivative markets on SEI. | P4 |
| **Multi‑chain support** | Add Cosmos, Osmosis, etc. | P4 |
| **API for third‑party** | Public endpoints with API‑key auth. | P5 |

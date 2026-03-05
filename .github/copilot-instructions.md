<!-- SEI Chain Trading Terminal Project Setup Instructions -->

# Terminal - Project Setup & Development Guide

This trading terminal is built as a full-stack TypeScript application with separate frontend (React) and backend (Node.js) packages.

## Project Overview

- **Frontend**: React 18 + TypeScript + Tailwind CSS - TradingView-like UI for crypto trading
- **Backend**: Node.js + Express/NestJS + PostgreSQL - SEI chain integration and market data
- **Target**: SEI Chain (pacific-1 testnet initially)
- **Timeline**: 6 weeks to MVP

## Development Setup

### Prerequisites
- Node.js 18+ with npm/yarn
- PostgreSQL 14+
- Redis 6+
- A SEI wallet (Keplr or Station)

### Initial Setup Checklist

- [ ] Install root dependencies: `npm install`
- [ ] Configure environment variables (`.env` files)
- [ ] Set up PostgreSQL database and migrations
- [ ] Set up Redis instance
- [ ] Start backend server: `cd backend && npm run dev`
- [ ] Start frontend dev server: `cd frontend && npm run dev`

## Development Workflow

### Frontend Development
```bash
cd frontend
npm run dev        # Start Vite dev server (port 3000)
npm run test       # Run tests
npm run build      # Build for production
npm run lint       # Check TypeScript & linting
```

### Backend Development
```bash
cd backend
npm run dev        # Start with nodemon (port 3001)
npm run test       # Run tests
npm run build      # Compile TypeScript
npm run migrate    # Run database migrations
```

## Key Modules & Services

### Frontend Components Structure
- `pages/` - Page components (Dashboard, Trading, Portfolio)
- `components/` - Reusable components (Chart, OrderBook, WatchList)
- `hooks/` - Custom React hooks (useChart, useWallet, useOrders)
- `services/` - API clients and Socket.io handlers
- `store/` - Redux slices for state management

### Backend Services
- `auth/` - Wallet authentication & JWT
- `trading/` - Order creation & management
- `market/` - Price feeds & WebSocket broadcasts
- `portfolio/` - Holdings & P&L calculation
- `blockchain/` - SEI chain RPC interactions

## Important Files

- `MVP_BACKLOG.md` - Complete feature roadmap and database schema
- `docs/API.md` - Backend API endpoint documentation
- `frontend/src/config/chains.ts` - SEI chain configuration
- `backend/src/config/database.ts` - Database connection setup

## Git Workflow

- Branch naming: `feature/`, `bugfix/`, `docs/`
- Commit messages: Descriptive with ticket reference
- PRs required for main branch
- All tests must pass before merging

## Deployment

- **Testnet**: Deploy to staging environment after Phase 1
- **Production**: Mainnet deployment after full testing
- **Docker**: All services containerized for deployment
- **CI/CD**: GitHub Actions for automated testing

## Common Commands

```bash
# Root level (monorepo)
npm install           # Install all dependencies
npm run dev          # Start both frontend & backend
npm run test         # Run all tests
npm run build        # Build both packages

# Database
npm run migrate      # Run migrations
npm run seed         # Populate test data

# Debugging
npm run debug        # Start backend in debug mode
npm run logs         # View application logs
```

## Reporting Issues

When reporting bugs, include:
1. Environment (testnet/mainnet)
2. Wallet used (Keplr/Station)
3. Steps to reproduce
4. Expected vs actual behavior
5. Console/error logs

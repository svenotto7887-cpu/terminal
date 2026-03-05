# Terminal - Multi-Asset Trading Platform

A professional crypto trading terminal built on the SEI blockchain. Trade with real-time charts, advanced order management, and portfolio analytics.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- A SEI wallet (Keplr or Station)

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd terminal

# Install dependencies
npm install

# Start the development server
npm run dev
```

The application will open at `http://localhost:3000`

## ⚡ Sei Blockchain Integration

Terminal now includes native support for the **Sei blockchain** - the fastest EVM-compatible network with ~400ms finality and 12,500+ TPS.

**Key Features:**
- 🔗 Wallet connection (MetaMask, WalletConnect)
- 💰 SEI token trading with real-time market data
- ⛽ Sub-second transaction finality
- 📊 Optimistic UI for instant feedback
- 🎯 Order book patterns optimized for parallel execution

**Quick Links:**
- [Sei Integration Guide](./docs/SEI_INTEGRATION.md) - Complete setup and usage
- [Optimization Patterns](./docs/SEI_OPTIMIZATION_PATTERNS.md) - Smart contract best practices
- [Sei Docs](https://docs.sei.io) - Official documentation
- [SKILL Guide](https://www.sei.io/SKILL.md) - End-to-end Sei development

**Testnet Setup:**
```bash
# Configure Sei testnet in .env
VITE_SEI_NETWORK=testnet
VITE_SEI_RPC_URL=https://evm-rpc-testnet.sei-apis.com

# Get testnet SEI from faucet
# https://atlantic-2.app.sei.io/faucet
```

## 📋 Project Structure

```
root/
├── frontend/          # React TypeScript UI
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   └── services/
│   ├── package.json
│   └── tsconfig.json
├── backend/          # Node.js API server
│   ├── src/
│   │   ├── routes/
│   │   ├── services/
│   │   └── models/
│   ├── package.json
│   └── .env.example
├── docs/             # Documentation
├── MVP_BACKLOG.md    # Feature roadmap
├── package.json      # Root package config
└── README.md         # This file
```

## 🎯 MVP Features

### ✅ Core Trading
- Real-time candlestick charts with multiple timeframes
- Live price ticker and order book
- Limit & market orders
- Stop-loss and take-profit orders

### ✅ Portfolio Management
- Real-time balance tracking
- P&L calculation (realized & unrealized)
- Holdings overview
- Transaction history

### ✅ Wallet Integration
- Keplr wallet support
- Station wallet support
- Multi-wallet capability
- Secure transaction signing

### ✅ Market Data
- Real-time updates via WebSocket
- Technical indicators (SMA, EMA, RSI, MACD, BB)
- 24h volume & price change tracking

## 🛠️ Tech Stack

### Frontend
- **React 18** + TypeScript
- **Tailwind CSS** for styling
- **TradingView Lightweight Charts** for charting
- **Redux Toolkit** for state management
- **Socket.io** for real-time updates

### Backend
- **Express.js** / NestJS
- **PostgreSQL** for persistence
- **Redis** for caching
- **@sei-js** for blockchain integration
- **WebSocket** for real-time data

### Blockchain
- **SEI Chain** RPC integration
- **Keplr/Station** wallet adapters
- **Pyth Network** for price feeds

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root:

```env
# Frontend
VITE_API_BASE_URL=http://localhost:3001
VITE_WS_URL=ws://localhost:3001

# Backend
DATABASE_URL=postgresql://user:password@localhost:5432/terminal_db
REDIS_URL=redis://localhost:6379
SEI_RPC_URL=https://evm-rpc.sei-apis.com
SEI_CHAIN_ID=pacific-1
NODE_ENV=development
```

## 📚 API Documentation

See [docs/API.md](docs/API.md) for complete API reference.

## 🧪 Testing

```bash
# Run tests
npm run test

# Run with coverage
npm run test:coverage

# E2E tests
npm run test:e2e
```

## 📦 Building

```bash
# Build frontend
cd frontend && npm run build

# Build backend
cd backend && npm run build

# Production deployment
npm run deploy
```

## 🐛 Known Issues

- Currently supports testnet only
- Mobile responsiveness needs improvement
- Advanced charting features (drawing tools) coming in Phase 2

## 🤝 Contributing

See [CONTRIBUTING.md](docs/CONTRIBUTING.md) for guidelines.

## 📄 License

MIT License - See LICENSE file

## 📞 Support

For issues and questions, please open a GitHub issue or contact the team.

---

**Status**: MVP Development  
**Last Updated**: March 2026  
**Maintained by**: Terminal Team

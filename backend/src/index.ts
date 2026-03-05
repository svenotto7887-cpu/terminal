require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const http = require('http');
const { Server: SocketIOServer } = require('socket.io');
const tradingRouter = require('./routes/trading');
const { createMarketRouter } = require('./routes/market');
const { MarketDataService } = require('./services/market-data.service');

const app = express();
app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_ORIGIN || '*' }));
app.use(express.json());

// ---- WebSocket ----
const io = new SocketIOServer({
  path: '/socket.io',
  cors: { origin: process.env.FRONTEND_ORIGIN || '*', credentials: true }
});

// Initialize market data service with Socket.io for broadcasting
const marketDataService = new MarketDataService(io);

app.use('/api/trading', tradingRouter);
app.use('/api/market', createMarketRouter(marketDataService));

io.on('connection', (socket) => {
  console.log('🔗 client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('🔌 client disconnected:', socket.id);
  });
});

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API info
app.get('/api', (_req, res) => {
  res.json({
    name: 'Terminal Trading Platform API',
    version: '0.1.0',
    status: 'running'
  });
});

// Error handling middleware
app.use((err, _req, res, _next) => {
  console.error('[ERROR] Unhandled error:', err);
  res.status(500).json({
    error: 'INTERNAL_SERVER_ERROR',
    message: process.env.NODE_ENV === 'development' ? err.message : 'An error occurred'
  });
});

const PORT = Number(process.env.PORT) || 4000;
const httpServer = http.createServer(app);
io.attach(httpServer);

httpServer.listen(PORT, async () => {
  console.log(`🚀 Backend server listening on http://localhost:${PORT}`);
  
  // Connect to real-time data providers
  await marketDataService.connectRealTimeProviders();
});

module.exports = { app, io, marketDataService };

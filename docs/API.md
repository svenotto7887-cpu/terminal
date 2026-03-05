# API Documentation

## Base URL
```
http://localhost:3001/api
```

## Authentication
All requests (except login) require a Bearer token:
```
Authorization: Bearer <JWT_TOKEN>
```

---

## Endpoints

### Authentication

#### Login with Wallet
```http
POST /auth/login
Content-Type: application/json

{
  "walletAddress": "sei1...",
  "signature": "0x...",
  "message": "Sign this message to login"
}

Response: 200 OK
{
  "token": "eyJhbGc...",
  "user": {
    "id": "uuid",
    "walletAddress": "sei1...",
    "createdAt": "2026-03-04T10:00:00Z"
  }
}
```

#### Get Current User
```http
GET /auth/me
Authorization: Bearer <token>

Response: 200 OK
{
  "id": "uuid",
  "walletAddress": "sei1...",
  "theme": "dark",
  "createdAt": "2026-03-04T10:00:00Z"
}
```

---

### Trading Pairs

#### List All Pairs
```http
GET /trading/pairs

Response: 200 OK
[
  {
    "id": "SEI_USDC",
    "symbol": "SEI/USDC",
    "baseAsset": "SEI",
    "quoteAsset": "USDC",
    "lastPrice": 0.245,
    "priceChange24h": 5.2,
    "volume24h": 1234567.89,
    "high24h": 0.250,
    "low24h": 0.240
  }
]
```

#### Get Pair Details
```http
GET /trading/pairs/:pairId

Response: 200 OK
{
  "id": "SEI_USDC",
  "symbol": "SEI/USDC",
  "baseAsset": "SEI",
  "quoteAsset": "USDC",
  "lastPrice": 0.245,
  "bid": 0.244,
  "ask": 0.246,
  "priceChange24h": 5.2,
  "volume24h": 1234567.89,
  "high24h": 0.250,
  "low24h": 0.240,
  "orderBook": {
    "bids": [[0.244, 1000], [0.243, 2000]],
    "asks": [[0.246, 1000], [0.247, 2000]]
  }
}
```

---

### Orders

#### Create Order
```http
POST /trading/orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "pairId": "SEI_USDC",
  "type": "limit",
  "side": "buy",
  "quantity": 100,
  "price": 0.245
}

Response: 201 Created
{
  "id": "order-uuid",
  "pairId": "SEI_USDC",
  "type": "limit",
  "side": "buy",
  "quantity": 100,
  "price": 0.245,
  "status": "pending",
  "createdAt": "2026-03-04T10:00:00Z"
}
```

#### Get User Orders
```http
GET /trading/orders?status=pending&limit=20
Authorization: Bearer <token>

Response: 200 OK
[
  {
    "id": "order-uuid",
    "pairId": "SEI_USDC",
    "type": "limit",
    "side": "buy",
    "quantity": 100,
    "price": 0.245,
    "filledQuantity": 50,
    "status": "partially_filled",
    "createdAt": "2026-03-04T10:00:00Z"
  }
]
```

#### Cancel Order
```http
DELETE /trading/orders/:orderId
Authorization: Bearer <token>

Response: 200 OK
{
  "id": "order-uuid",
  "status": "canceled",
  "canceledAt": "2026-03-04T10:01:00Z"
}
```

---

### Market Data

#### Get Candlestick Data
```http
GET /market/candles/:pairId?interval=1m&limit=100

Response: 200 OK
[
  {
    "time": 1709554800,
    "open": 0.245,
    "high": 0.246,
    "low": 0.244,
    "close": 0.245,
    "volume": 50000
  }
]
```

#### Get Order Book
```http
GET /market/orderbook/:pairId?depth=20

Response: 200 OK
{
  "bids": [[0.244, 1000], [0.243, 2000]],
  "asks": [[0.246, 1000], [0.247, 2000]],
  "timestamp": 1709554800
}
```

#### Get Recent Trades
```http
GET /market/trades/:pairId?limit=50

Response: 200 OK
[
  {
    "id": "trade-uuid",
    "price": 0.245,
    "quantity": 100,
    "side": "buy",
    "timestamp": 1709554800
  }
]
```

---

### Portfolio

#### Get Account Balance
```http
GET /portfolio/balance
Authorization: Bearer <token>

Response: 200 OK
{
  "totalUSD": 10000,
  "assets": [
    {
      "symbol": "SEI",
      "quantity": 1000,
      "usdValue": 245
    },
    {
      "symbol": "USDC",
      "quantity": 9755,
      "usdValue": 9755
    }
  ]
}
```

#### Get Holdings
```http
GET /portfolio/holdings
Authorization: Bearer <token>

Response: 200 OK
[
  {
    "id": "holding-uuid",
    "asset": "SEI",
    "quantity": 1000,
    "averageCost": 0.200,
    "currentPrice": 0.245,
    "unrealizedPnL": 45,
    "unrealizedPnLPercent": 22.5,
    "updatedAt": "2026-03-04T10:00:00Z"
  }
]
```

#### Get Performance
```http
GET /portfolio/performance
Authorization: Bearer <token>

Response: 200 OK
{
  "totalReturn": 125.50,
  "totalReturnPercent": 1.25,
  "realizedPnL": 50,
  "unrealizedPnL": 75.50,
  "winRate": 65,
  "averageWin": 12.5,
  "averageLoss": -8.3
}
```

---

## WebSocket Events

Connect to `ws://localhost:3001/socket.io` with Socket.io client.

### Subscribe to Price Updates
```javascript
socket.emit('subscribe', { pairId: 'SEI_USDC' });

socket.on('price_update', (data) => {
  console.log({
    pairId: 'SEI_USDC',
    price: 0.245,
    bid: 0.244,
    ask: 0.246,
    timestamp: 1709554800
  });
});
```

### Order Status Updates
```javascript
socket.on('order_update', (data) => {
  console.log({
    orderId: 'order-uuid',
    status: 'filled',
    filledQuantity: 100,
    filledPrice: 0.245,
    timestamp: 1709554800
  });
});
```

### Balance Updates
```javascript
socket.on('balance_update', (data) => {
  console.log({
    totalUSD: 10000,
    assets: [...]
  });
});
```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "INVALID_REQUEST",
  "message": "Missing required field: quantity"
}
```

### 401 Unauthorized
```json
{
  "error": "UNAUTHORIZED",
  "message": "Invalid or expired token"
}
```

### 404 Not Found
```json
{
  "error": "NOT_FOUND",
  "message": "Order not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "INTERNAL_SERVER_ERROR",
  "message": "An unexpected error occurred"
}
```

---

## Rate Limiting
- **Default**: 100 requests per 15 minutes per IP
- **Authenticated**: 1000 requests per 15 minutes per user
- Headers: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

---

## Pagination
Endpoints supporting pagination use:
- `limit`: Number of results (default: 20, max: 100)
- `offset`: Starting position (default: 0)

Response includes:
```json
{
  "data": [...],
  "pagination": {
    "limit": 20,
    "offset": 0,
    "total": 500
  }
}
```

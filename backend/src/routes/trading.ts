const express = require('express');
const { z } = require('zod');
const { placeOrder, getOrders } = require('../services/trading.service');

const router = express.Router();

/* ---------- Validation Schemas ---------- */
const orderSchema = z.object({
  pair: z.string().regex(/^([A-Z]+)\/([A-Z]+)$/i),
  side: z.enum(['buy', 'sell']),
  type: z.enum(['limit', 'market', 'stop']),
  quantity: z.number().positive(),
  price: z.number().positive().optional()
});

/* ---------- Endpoints ---------- */
// GET /api/trading/pairs
router.get('/pairs', (_req, res) => {
  // TODO: live from SEI RPC or static fixture
  res.json([
    { id: 'sei/usdc', base: 'SEI', quote: 'USDC' },
    { id: 'sei/usdt', base: 'SEI', quote: 'USDT' },
    { id: 'atom/usdc', base: 'ATOM', quote: 'USDC' }
  ]);
});

// POST /api/trading/orders
router.post('/orders', (req, res) => {
  const parsed = orderSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.format() });
  }
  const order = placeOrder(parsed.data);
  // broadcast to all sockets (io passed at module load)
  res.status(201).json(order);
});

// GET /api/trading/orders
router.get('/orders', (_req, res) => {
  const orders = getOrders();
  res.json(orders);
});

module.exports = router;

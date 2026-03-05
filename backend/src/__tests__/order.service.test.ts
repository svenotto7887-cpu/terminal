import { expect, test } from 'vitest';
import { placeOrder, getOrders } from '../services/trading.service';

test('place a market order → should be filled immediately', () => {
  const order = placeOrder({
    pair: 'SEI/USDC',
    side: 'buy',
    type: 'market',
    quantity: 10
  });

  expect(order.status).toBe('filled');
  expect(order.filledAt).toBeTypeOf('string');
  expect(Number(order.filledPrice!)).toBeGreaterThan(0);
});

test('order list returns the created order', () => {
  const orders = getOrders();
  expect(orders.length).toBeGreaterThan(0);
});

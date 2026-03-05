const { v4: uuid } = require('uuid');

const mockOrders = [];

// Very naive in-memory order store – replace with DB later
const placeOrder = (payload) => {
  const order = {
    id: uuid(),
    status: 'pending',
    createdAt: new Date().toISOString(),
    ...payload
  };
  mockOrders.push(order);
  // Simulate immediate fill for market orders
  if (order.type === 'market') {
    order.status = 'filled';
    order.filledAt = new Date().toISOString();
    order.filledPrice = (Math.random() * 0.02 + 0.9).toFixed(6);
  }
  return order;
};

const getOrders = () => mockOrders;

module.exports = { placeOrder, getOrders };

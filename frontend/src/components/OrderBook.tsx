import React from 'react';

interface OrderBookProps {
  pair: string;
}

export default function OrderBook({ pair }: OrderBookProps) {
  const mockBids = [
    { price: 0.242, quantity: 1000 },
    { price: 0.241, quantity: 500 },
    { price: 0.240, quantity: 300 }
  ];

  const mockAsks = [
    { price: 0.246, quantity: 300 },
    { price: 0.247, quantity: 500 },
    { price: 0.248, quantity: 1000 }
  ];

  return (
    <div className="h-full">
      <h2 className="text-xl font-semibold mb-4">{pair} Order Book</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="text-sm font-semibold text-red-400 mb-2">Asks (Sell)</h3>
          <div className="space-y-1">
            {mockAsks.map((ask, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-red-400">${ask.price.toFixed(4)}</span>
                <span className="text-slate-400">{ask.quantity}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-green-400 mb-2">Bids (Buy)</h3>
          <div className="space-y-1">
            {mockBids.map((bid, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-green-400">${bid.price.toFixed(4)}</span>
                <span className="text-slate-400">{bid.quantity}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

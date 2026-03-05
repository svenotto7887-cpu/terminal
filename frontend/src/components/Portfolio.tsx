import React from 'react';

export default function Portfolio() {
  const mockPortfolio = [
    { symbol: 'SEI', quantity: 1000, value: 245, percentage: 2.35 },
    { symbol: 'USDC', quantity: 10182, value: 10182, percentage: 97.65 }
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Portfolio</h2>
      <div className="space-y-3">
        {mockPortfolio.map((asset) => (
          <div key={asset.symbol} className="bg-slate-900 p-3 rounded">
            <div className="flex justify-between mb-1">
              <span className="font-semibold">{asset.symbol}</span>
              <span className="text-slate-400">${asset.value.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-slate-400">
              <span>{asset.quantity.toFixed(2)} units</span>
              <span>{asset.percentage.toFixed(2)}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 mt-2">
              <div
                className="bg-green-600 h-2 rounded-full"
                style={{ width: `${asset.percentage}%` }}
              ></div>
            </div>
          </div>
        ))}
        <div className="border-t border-slate-700 pt-3 mt-3">
          <div className="flex justify-between">
            <span className="font-semibold">Total Value</span>
            <span className="text-green-400 font-semibold">$10,427.00</span>
          </div>
        </div>
      </div>
    </div>
  );
}

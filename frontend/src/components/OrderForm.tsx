import React, { useState } from 'react';
import { placeOrder } from '../services/api';

interface OrderFormProps {
  defaultPair?: string;
}

export default function OrderForm({ defaultPair = 'BTC/USDC' }: OrderFormProps) {
  const [side, setSide] = useState<'buy' | 'sell'>('buy');
  const [type, setType] = useState<'market' | 'limit' | 'stop'>('market');
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(0.245);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      setLoading(true);
      await placeOrder({
        pair: defaultPair,
        side,
        type,
        quantity,
        price: type !== 'market' ? price : undefined
      });
      // Reset form
      setQuantity(1);
      setPrice(0.245);
    } catch (error) {
      console.error('Order failed:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Place Order</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-2">Pair</label>
          <input
            type="text"
            value={defaultPair}
            disabled
            className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-slate-400 cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-sm mb-2">Side</label>
          <select
            value={side}
            onChange={(e) => setSide(e.target.value as 'buy' | 'sell')}
            className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-white"
          >
            <option value="buy">Buy</option>
            <option value="sell">Sell</option>
          </select>
        </div>

        <div>
          <label className="block text-sm mb-2">Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as 'market' | 'limit' | 'stop')}
            className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-white"
          >
            <option value="market">Market</option>
            <option value="limit">Limit</option>
            <option value="stop">Stop</option>
          </select>
        </div>

        {type !== 'market' && (
          <div>
            <label className="block text-sm mb-2">Price</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(parseFloat(e.target.value))}
              className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-white"
            />
          </div>
        )}

        <div>
          <label className="block text-sm mb-2">Quantity</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(parseFloat(e.target.value))}
            className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-white"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded font-semibold ${
            side === 'buy'
              ? 'bg-green-600 hover:bg-green-700'
              : 'bg-red-600 hover:bg-red-700'
          } disabled:opacity-50`}
        >
          {loading ? 'Processing...' : `${side.toUpperCase()} ${quantity} ${defaultPair.split('/')[0]}`}
        </button>
      </form>
    </div>
  );
}

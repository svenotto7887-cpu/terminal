import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import DynamicChart from '../components/DynamicChart';
import TestChart from '../components/TestChart';
import TickerSearch from '../components/TickerSearch';
import ProviderSelector from '../components/ProviderSelector';
import OrderBook from '../components/OrderBook';
import OrderForm from '../components/OrderForm';
import Portfolio from '../components/Portfolio';

interface Ticker {
  symbol: string;
  name: string;
  type: string;
}

export default function Dashboard() {
  const [selectedTicker, setSelectedTicker] = useState<Ticker>({
    symbol: 'BTC',
    name: 'Bitcoin',
    type: 'crypto'
  });
  const [interval, setInterval] = useState<'1m' | '5m' | '15m' | '1h' | '4h' | '1d'>('1d');
  const [selectedProvider, setSelectedProvider] = useState('coingecko');

  const handleTickerSelect = (ticker: Ticker) => {
    setSelectedTicker(ticker);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <header className="border-b border-slate-700 px-6 py-4">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold">Terminal - Multi-Asset Trading</h1>
            <p className="text-slate-400 mt-1">Multi-Asset Trading Platform</p>
          </div>
          <div className="flex gap-4 items-center">
            <ProviderSelector onProviderChange={setSelectedProvider} />
            <Link to="/diagnostic" className="text-sm px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded">
              🔧 Diagnostic
            </Link>
          </div>
        </div>
        
        <div className="max-w-md">
          <TickerSearch onSelect={handleTickerSelect} />
        </div>
      </header>

      <main className="p-6">
        {/* Test Chart Section */}
        <div className="mb-6">
          <TestChart />
        </div>

        {/* Chart Section */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 mb-6">
          <DynamicChart 
            symbol={selectedTicker.symbol}
            interval={interval}
            onIntervalChange={setInterval}
          />
        </div>

        {/* Trading Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* OrderBook */}
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <OrderBook pair={selectedTicker.symbol} />
          </div>

          {/* Order Form */}
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <OrderForm defaultPair={selectedTicker.symbol} />
          </div>

          {/* Portfolio */}
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <Portfolio />
          </div>
        </div>
      </main>
    </div>
  );
}

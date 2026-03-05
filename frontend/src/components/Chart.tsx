import React, { useEffect, useRef } from 'react';

interface ChartProps {
  pair: string;
}

export default function Chart({ pair }: ChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // TradingView Lightweight Charts will be initialized here
    // For now, just a placeholder div with data-testid for testing
  }, [pair]);

  return (
    <div data-testid="chart-canvas" ref={containerRef} className="w-full h-96 bg-slate-900 rounded">
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">{pair}</h2>
          <p className="text-slate-400">Chart placeholder</p>
          <p className="text-slate-500 text-sm mt-2">TradingView Lightweight Charts</p>
        </div>
      </div>
    </div>
  );
}

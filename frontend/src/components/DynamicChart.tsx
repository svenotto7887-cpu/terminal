import React, { useEffect, useRef, useState } from 'react';
import { createChart, ColorType } from 'lightweight-charts';
import { api } from '../services/api';

interface ChartProps {
  symbol: string;
  interval?: '1m' | '5m' | '15m' | '1h' | '4h' | '1d';
  onIntervalChange?: (interval: string) => void;
}

export default function DynamicChart({ symbol, interval = '1d', onIntervalChange }: ChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);
  const seriesRef = useRef<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  console.log('🎨 DynamicChart render:', { symbol, interval, hasChart: !!chartRef.current, error });

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log(`📥 API Request: GET /market/candles/${symbol}?interval=${interval}&limit=50`);
        
        const response = await api.get(`/market/candles/${symbol}`, {
          params: { interval, limit: 50 }
        });

        console.log('📊 API Response:', {
          symbol: response.data.symbol,
          interval: response.data.interval,
          candleCount: response.data.candles?.length,
          firstCandle: response.data.candles?.[0]
        });

        if (!response.data.candles?.length) {
          throw new Error('No candles returned');
        }

        const candles = response.data.candles.map((c: any) => ({
          time: Math.floor(c.timestamp / 1000),
          open: parseFloat(c.open),
          high: parseFloat(c.high),
          low: parseFloat(c.low),
          close: parseFloat(c.close)
        }));

        console.log('🔄 Transformed candles:', {
          count: candles.length,
          firstCandle: candles[0],
          lastCandle: candles[candles.length - 1]
        });

        if (chartRef.current) {
          console.log('🗑️  Removing existing chart');
          chartRef.current.remove();
          chartRef.current = null;
        }

        // Wait for container to be ready
        await new Promise(resolve => setTimeout(resolve, 50));

        if (!containerRef.current) {
          throw new Error('Container div not found');
        }

        const width = containerRef.current.clientWidth || 700;
        console.log(`📐 Creating chart with dimensions: ${width}x450`);
        
        const chart = createChart(containerRef.current, {
          layout: {
            textColor: '#d1d5db',
            background: { type: ColorType.Solid, color: '#1e293b' }
          },
          width,
          height: 450,
          timeScale: { timeVisible: true, secondsVisible: false }
        });

        const series = chart.addCandlestickSeries({
          upColor: '#22c55e',
          downColor: '#ef4444'
        });

        series.setData(candles);
        chart.timeScale().fitContent();
        
        console.log('✅ Chart created successfully');
        
        chartRef.current = chart;
        seriesRef.current = series;
        setError(null);
        setLoading(false);
      } catch (err: any) {
        console.error('❌ Chart error details:', {
          name: err?.name,
          message: err?.message,
          status: err?.response?.status,
          data: err?.response?.data,
          stack: err?.stack
        });
        
        let message = `Error loading chart: ${err?.message || 'Unknown error'}`;
        
        if (err?.response?.status === 404) {
          message = `No data available for ${symbol} - Try searching for crypto assets (BTC, ETH, SOL, etc.)`;
        } else if (err?.message?.includes('No candles')) {
          message = `No historical data for ${symbol} - Only crypto data is currently available`;
        } else if (err?.message?.includes('Network')) {
          message = 'Network error - Backend may be unavailable';
        } else if (err?.message?.includes('Container')) {
          message = 'Chart container not ready - Layout issue';
        }
        
        setError(message);
        setLoading(false);
      }
    };
    init();
  }, [symbol, interval]);

  // Cleanup chart on unmount
  useEffect(() => {
    return () => {
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
        seriesRef.current = null;
      }
    };
  }, []);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (chartRef.current && containerRef.current) {
        chartRef.current.applyOptions({
          width: Math.max(containerRef.current.clientWidth, 500),
          height: 450
        });
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const intervals = ['1m', '5m', '15m', '1h', '4h', '1d'];

  return (
    <div className="w-full">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold">{symbol}</h2>
        <div className="space-x-2">
          {intervals.map((int) => (
            <button
              key={int}
              onClick={() => onIntervalChange?.(int)}
              className={`px-3 py-1 rounded text-sm font-medium ${
                interval === int
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              {int}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="bg-red-900 border border-red-600 rounded p-4 text-red-100 mb-4">
          ⚠️ {error}
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center h-96 bg-slate-900 rounded text-slate-400">
          ⏳ Loading {symbol}...
        </div>
      )}

      {!loading && !error && (
        <div
          ref={containerRef}
          className="w-full bg-slate-900 rounded"
          style={{ height: '450px' }}
        />
      )}

      {!loading && error && (
        <div
          className="w-full bg-slate-900 rounded"
          style={{ height: '0px' }}
        />
      )}
    </div>
  );
}

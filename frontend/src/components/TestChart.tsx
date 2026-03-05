import React, { useEffect, useRef } from 'react';
import { createChart, ColorType } from 'lightweight-charts';

export default function TestChart() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      console.log('🧪 TestChart: Creating chart with hardcoded data');

      if (!containerRef.current) {
        throw new Error('Container not found');
      }

      const chart = createChart(containerRef.current, {
        layout: {
          textColor: '#d1d5db',
          background: { type: ColorType.Solid, color: '#1e293b' }
        },
        width: 600,
        height: 400,
        timeScale: { timeVisible: true }
      });

      const series = chart.addCandlestickSeries({
        upColor: '#22c55e',
        downColor: '#ef4444'
      });

      // Hardcoded test data
      const testData = [
        { time: 1700000000, open: 100, high: 110, low: 95, close: 105 },
        { time: 1700086400, open: 105, high: 115, low: 100, close: 112 },
        { time: 1700172800, open: 112, high: 120, low: 110, close: 118 },
        { time: 1700259200, open: 118, high: 125, low: 115, close: 122 },
        { time: 1700345600, open: 122, high: 128, low: 120, close: 126 },
      ];

      console.log('📝 Setting test data:', testData);
      series.setData(testData);
      chart.timeScale().fitContent();

      console.log('✅ TestChart created successfully');
    } catch (err) {
      console.error('❌ TestChart error:', err);
    }
  }, []);

  return (
    <div className="p-4 bg-slate-800 rounded">
      <h2 className="text-white font-bold mb-4">Chart Library Test</h2>
      <div
        ref={containerRef}
        className="bg-slate-900 rounded"
        style={{ height: '400px', width: '100%' }}
      />
      <p className="text-slate-400 text-sm mt-4">
        Check the browser console (F12) for diagnostic information
      </p>
    </div>
  );
}

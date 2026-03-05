import React, { useEffect, useState } from 'react';
import { api } from '../services/api';

export default function DataDiagnostic() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('📥 Fetching BTC data...');
        const response = await api.get('/market/candles/BTC', {
          params: { interval: '1d', limit: 10 }
        });
        console.log('✅ Data received:', response.data);
        setData(response.data);
        setError(null);
      } catch (err: any) {
        console.error('❌ Fetch error:', err);
        setError(JSON.stringify(err, null, 2));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-8 bg-slate-900 text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-6">API Diagnostic</h1>

      {loading && <p className="text-blue-400">Loading...</p>}

      {error && (
        <div className="bg-red-900 border border-red-600 rounded p-4 mb-6">
          <p className="font-bold text-red-100">Error:</p>
          <pre className="text-red-200 text-sm overflow-auto">{error}</pre>
        </div>
      )}

      {data && (
        <div className="bg-slate-800 border border-slate-700 rounded p-4">
          <h2 className="text-xl font-bold mb-4">Raw API Response</h2>
          <pre className="bg-slate-900 p-4 rounded text-sm overflow-auto text-green-400">
            {JSON.stringify(data, null, 2)}
          </pre>
          
          <h3 className="text-lg font-bold mt-6 mb-4">Transformed Candles</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-600">
                <tr>
                  <th className="px-4 py-2">Time (s)</th>
                  <th className="px-4 py-2">Open</th>
                  <th className="px-4 py-2">High</th>
                  <th className="px-4 py-2">Low</th>
                  <th className="px-4 py-2">Close</th>
                </tr>
              </thead>
              <tbody>
                {data.candles?.slice(0, 5).map((candle: any, i: number) => (
                  <tr key={i} className="border-b border-slate-700">
                    <td className="px-4 py-2">{Math.floor(candle.timestamp / 1000)}</td>
                    <td className="px-4 py-2">{parseFloat(candle.open)}</td>
                    <td className="px-4 py-2">{parseFloat(candle.high)}</td>
                    <td className="px-4 py-2">{parseFloat(candle.low)}</td>
                    <td className="px-4 py-2">{parseFloat(candle.close)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

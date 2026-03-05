import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

interface SearchResult {
  symbol: string;
  name: string;
  type: 'crypto' | 'stock' | 'forex' | 'commodity';
}

interface TickerSearchProps {
  onSelect: (ticker: SearchResult) => void;
}

export default function TickerSearch({ onSelect }: TickerSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const debounceTimer = setTimeout(async () => {
      if (query.length < 1) {
        setResults([]);
        setShowResults(false);
        return;
      }

      setLoading(true);
      try {
        const response = await api.get('/market/search', { params: { q: query } });
        setResults(response.data);
        setShowResults(true);
      } catch (error) {
        console.error('Search failed:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300); // Debounce 300ms

    return () => clearTimeout(debounceTimer);
  }, [query]);

  const handleSelect = (ticker: SearchResult) => {
    onSelect(ticker);
    setQuery('');
    setResults([]);
    setShowResults(false);
  };

  return (
    <div className="relative w-full">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value.toUpperCase())}
          placeholder="Search Bitcoin, AAPL, EURUSD..."
          className="w-full bg-slate-900 border border-slate-600 rounded px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
        />
        {loading && (
          <div className="absolute right-3 top-2.5">
            <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
          </div>
        )}
      </div>

      {showResults && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800 border border-slate-600 rounded shadow-lg z-50 max-h-96 overflow-y-auto">
          {results.map((ticker, i) => (
            <button
              key={i}
              onClick={() => handleSelect(ticker)}
              className="w-full text-left px-4 py-3 hover:bg-slate-700 flex justify-between items-center"
            >
              <div>
                <div className="font-semibold text-white">{ticker.symbol}</div>
                <div className="text-sm text-slate-400">{ticker.name}</div>
              </div>
              <span className={`text-xs px-2 py-1 rounded ${
                ticker.type === 'crypto' ? 'bg-blue-900 text-blue-200' :
                ticker.type === 'stock' ? 'bg-green-900 text-green-200' :
                'bg-purple-900 text-purple-200'
              }`}>
                {ticker.type}
              </span>
            </button>
          ))}
        </div>
      )}

      {showResults && results.length === 0 && !loading && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800 border border-slate-600 rounded px-4 py-3 text-slate-400 text-sm">
          No results found for "{query}"
        </div>
      )}
    </div>
  );
}

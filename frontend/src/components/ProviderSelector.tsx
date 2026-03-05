import React, { useEffect, useState } from 'react';
import { api } from '../services/api';

interface Provider {
  name: string;
  types: string[];
  configured: boolean;
}

interface ProviderSelectorProps {
  onProviderChange?: (provider: string) => void;
}

export default function ProviderSelector({ onProviderChange }: ProviderSelectorProps) {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [selectedProvider, setSelectedProvider] = useState('coingecko');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const response = await api.get('/market/providers');
        setProviders(response.data);
        
        // Select first configured provider
        const configured = response.data.find((p: Provider) => p.configured);
        if (configured) {
          setSelectedProvider(configured.name.toLowerCase());
        }
      } catch (error) {
        console.error('Failed to fetch providers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProviders();
  }, []);

  const handleChange = (providerName: string) => {
    setSelectedProvider(providerName);
    onProviderChange?.(providerName);
  };

  if (loading) {
    return <div className="text-slate-400 text-sm">Loading providers...</div>;
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-slate-400">Data Source:</span>
      <select
        value={selectedProvider}
        onChange={(e) => handleChange(e.target.value)}
        className="bg-slate-800 border border-slate-600 rounded px-3 py-1 text-white text-sm hover:bg-slate-700 focus:outline-none focus:border-blue-500"
      >
        {providers.map((provider) => (
          <option
            key={provider.name}
            value={provider.name.toLowerCase()}
            disabled={!provider.configured}
          >
            {provider.name}
            {!provider.configured ? ' (not configured)' : ''}
            {' - ' + provider.types.join(', ')}
          </option>
        ))}
      </select>
    </div>
  );
}

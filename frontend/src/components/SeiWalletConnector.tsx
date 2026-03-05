/**
 * Sei Wallet Connector Component
 * Supports MetaMask, WalletConnect, and other EVM wallets
 */

import React from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { injected } from 'wagmi/connectors';

interface SeiWalletConnectorProps {
  onConnectSuccess?: (address: string) => void;
  onDisconnect?: () => void;
}

export default function SeiWalletConnector({
  onConnectSuccess,
  onDisconnect
}: SeiWalletConnectorProps) {
  const { address, isConnected, chainId } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  const handleConnect = () => {
    const injectedConnector = connectors.find(
      (c) => c.id === 'injected'
    );
    if (injectedConnector) {
      connect({ connector: injectedConnector });
    } else {
      // Fallback: try to connect with injected provider
      connect({ connector: injected() });
    }
  };

  const handleDisconnect = () => {
    disconnect();
    onDisconnect?.();
  };

  const isSeiChain = chainId === 1329 || chainId === 1328;

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-4 px-4 py-2 bg-slate-700 rounded">
        <div>
          <div className="text-sm text-slate-300">Connected Wallet</div>
          <div className="font-mono text-sm text-green-400">
            {address.slice(0, 6)}...{address.slice(-4)}
          </div>
          {!isSeiChain && (
            <div className="text-xs text-yellow-400 mt-1">
              ⚠️ Wrong network. Connected to chain {chainId}. Switch to Sei.
            </div>
          )}
        </div>
        <button
          onClick={handleDisconnect}
          className="px-3 py-1 text-sm bg-red-600 hover:bg-red-700 rounded text-white transition"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleConnect}
      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white font-semibold transition"
    >
      🔗 Connect Sei Wallet
    </button>
  );
}

/**
 * Hook for checking if connected to Sei
 */
export function useSeiConnection() {
  const { address, isConnected, chainId } = useAccount();
  const isSeiMainnet = chainId === 1329;
  const isSeiTestnet = chainId === 1328;
  const isSei = isSeiMainnet || isSeiTestnet;

  return {
    address,
    isConnected,
    chainId,
    isSeiMainnet,
    isSeiTestnet,
    isSei,
    wrongNetwork: isConnected && !isSei
  };
}

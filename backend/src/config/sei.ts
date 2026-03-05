/**
 * Sei Blockchain Configuration
 * Supports mainnet (1329) and testnet/atlantic-2 (1328)
 */

export const SeiChains = {
  mainnet: {
    chainId: 1329,
    name: 'Sei',
    rpc: 'https://evm-rpc.sei-apis.com',
    ws: 'wss://evm-ws.sei-apis.com',
    explorer: 'https://seitrace.com',
    currency: {
      name: 'Sei',
      symbol: 'SEI',
      decimals: 18
    }
  },
  testnet: {
    chainId: 1328,
    name: 'Sei Testnet (atlantic-2)',
    rpc: 'https://evm-rpc-testnet.sei-apis.com',
    ws: 'wss://evm-ws-testnet.sei-apis.com',
    explorer: 'https://seitrace.com/?chain=atlantic-2',
    faucet: 'https://atlantic-2.app.sei.io/faucet',
    currency: {
      name: 'Sei',
      symbol: 'SEI',
      decimals: 18
    }
  },
  devnet: {
    chainId: 713715,
    name: 'Sei Devnet (arctic-1)',
    rpc: 'https://evm-rpc-arctic-1.sei-apis.com',
    ws: 'wss://evm-ws-arctic-1.sei-apis.com?subscriptions=true',
    explorer: 'https://seitrace.com',
    currency: {
      name: 'Sei',
      symbol: 'SEI',
      decimals: 18
    }
  }
};

export const getSeiChain = (network: 'mainnet' | 'testnet' | 'devnet' = 'testnet') => {
  return SeiChains[network];
};

export const SEI_NATIVE_TOKEN = {
  symbol: 'SEI',
  name: 'Sei',
  decimals: 18,
  type: 'crypto' as const
};

/**
 * Sei-specific optimization patterns for high-frequency trading:
 * - Use user-scoped state mapping instead of shared counters
 * - Emit events for aggregation rather than storing totals
 * - Minimize shared state writes for parallel execution
 */
export const SeiOptimizations = {
  parallelExecutionEnabled: true,
  finality: '~400ms',
  maxTPS: 12500,
  minBlockTime: 400, // milliseconds
  reducesPendingUX: true,
  supportsOptimisticUpdates: true
};

/**
 * Sei Blockchain Frontend Configuration
 * Uses wagmi + viem (recommended stack from https://www.sei.io/SKILL.md)
 */

import { defineChain, http } from 'viem';
import { createConfig } from 'wagmi';

export const sei = defineChain({
  id: 1329,
  name: 'Sei',
  nativeCurrency: {
    name: 'Sei',
    symbol: 'SEI',
    decimals: 18
  },
  rpcUrls: {
    default: { http: ['https://evm-rpc.sei-apis.com'] }
  },
  blockExplorers: {
    default: {
      name: 'SeiTrace',
      url: 'https://seitrace.com'
    }
  }
});

export const seiTestnet = defineChain({
  id: 1328,
  name: 'Sei Testnet',
  nativeCurrency: {
    name: 'Sei',
    symbol: 'SEI',
    decimals: 18
  },
  rpcUrls: {
    default: {
      http: ['https://evm-rpc-testnet.sei-apis.com']
    }
  },
  blockExplorers: {
    default: {
      name: 'SeiTrace',
      url: 'https://seitrace.com/?chain=atlantic-2'
    }
  },
  testnet: true,
  faucets: ['https://atlantic-2.app.sei.io/faucet']
});

/**
 * Create wagmi config for Terminal on Sei
 * Supports both mainnet and testnet
 */
export const createSeiWagmiConfig = () => {
  const isTestnet = process.env.VITE_SEI_NETWORK === 'testnet';
  const chains = isTestnet ? [seiTestnet, sei] : [sei, seiTestnet];

  return createConfig({
    chains,
    transports: {
      [sei.id]: http('https://evm-rpc.sei-apis.com'),
      [seiTestnet.id]: http('https://evm-rpc-testnet.sei-apis.com')
    }
  });
};

/**
 * Sei RPC and WebSocket endpoints for direct provider use
 */
export const SeiRPC = {
  mainnet: {
    http: 'https://evm-rpc.sei-apis.com',
    ws: 'wss://evm-ws.sei-apis.com'
  },
  testnet: {
    http: 'https://evm-rpc-testnet.sei-apis.com',
    ws: 'wss://evm-ws-testnet.sei-apis.com'
  }
};

/**
 * Common Sei contract addresses (to be populated)
 */
export const SeiContracts = {
  // Add Sei-deployed tokens and DEX contracts here
  // Example: USDC, USDT, DEX routers, etc.
};

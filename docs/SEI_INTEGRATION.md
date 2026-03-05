# Sei Integration Guide

Terminal now includes native Sei blockchain support for high-performance multi-asset trading.

## Overview

Sei is an EVM-compatible blockchain optimized for trading with:
- **~400ms finality** (vs 12+ minutes on Ethereum)
- **12,500+ TPS capacity** (vs ~15 on Ethereum)
- **Parallel transaction execution** across CPU cores
- **100% EVM compatible** - deploy Ethereum contracts without changes

## Quick Start

### Backend Setup

1. **Add SEI to environment:**
```bash
# .env
SEI_NETWORK=testnet  # or mainnet
SEI_RPC_URL=https://evm-rpc-testnet.sei-apis.com
SEI_CONTRACT_ADDRESS=0x...  # Your contract
```

2. **Import Sei configuration:**
```typescript
import { SeiChains, getSeiChain } from '@/config/sei';

const seiConfig = getSeiChain('testnet');
console.log(`RPC: ${seiConfig.rpc}`);
console.log(`WebSocket: ${seiConfig.ws}`);
```

3. **Use SeiProvider for market data:**
```typescript
import { SeiProvider } from '@/services/providers/sei.provider';

const seiProvider = new SeiProvider();
const price = await seiProvider.getPrice('SEI');
const candles = await seiProvider.getCandles('SEI', '1d');
```

### Frontend Setup

1. **Install wagmi + viem (recommended):**
```bash
npm install wagmi viem @tanstack/react-query
```

2. **Configure Sei in your app:**
```typescript
import { createSeiWagmiConfig } from '@/config/sei';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const wagmiConfig = createSeiWagmiConfig();
const queryClient = new QueryClient();

export function App() {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {/* Your app */}
      </QueryClientProvider>
    </WagmiProvider>
  );
}
```

3. **Add Sei wallet connector:**
```tsx
import SeiWalletConnector from '@/components/SeiWalletConnector';

export function Header() {
  return (
    <div>
      <h1>Terminal</h1>
      <SeiWalletConnector 
        onConnectSuccess={(address) => console.log('Connected:', address)}
      />
    </div>
  );
}
```

## Network Configuration

### Testnet (atlantic-2)
- **Chain ID:** 1328
- **RPC:** https://evm-rpc-testnet.sei-apis.com
- **WebSocket:** wss://evm-ws-testnet.sei-apis.com
- **Explorer:** https://seitrace.com/?chain=atlantic-2
- **Faucet:** https://atlantic-2.app.sei.io/faucet

### Mainnet
- **Chain ID:** 1329
- **RPC:** https://evm-rpc.sei-apis.com
- **WebSocket:** wss://evm-ws.sei-apis.com
- **Explorer:** https://seitrace.com

## Smart Contract Development

### Hardhat Setup

```javascript
// hardhat.config.js
require('@nomicfoundation/hardhat-toolbox');
require('dotenv').config();

module.exports = {
  solidity: '0.8.20',
  networks: {
    seiTestnet: {
      url: 'https://evm-rpc-testnet.sei-apis.com',
      chainId: 1328,
      accounts: [process.env.PRIVATE_KEY]
    },
    sei: {
      url: 'https://evm-rpc.sei-apis.com',
      chainId: 1329,
      accounts: [process.env.PRIVATE_KEY]
    }
  }
};
```

### Deployment

```bash
# Deploy to testnet
npx hardhat run scripts/deploy.js --network seiTestnet

# Deploy to mainnet
npx hardhat run scripts/deploy.js --network sei
```

### Optimizing for Sei's Parallel Execution

Design contracts with user-scoped state to maximize parallelization:

```solidity
// GOOD: Per-user state allows parallel execution
mapping(address => uint256) public userBalances;

function deposit() external payable {
  userBalances[msg.sender] += msg.value;  // Parallel-safe
}

// AVOID: Shared state creates bottlenecks
uint256 public totalDeposits;  // All txs must serialize here

function depositShared() external payable {
  totalDeposits += msg.value;  // Blocks parallelization
}
```

## High-Frequency Trading Patterns

### 1. Optimistic UI Updates

Leverage Sei's ~400ms finality for instant user feedback:

```typescript
const handleTransaction = async () => {
  setStatus('submitting');
  
  try {
    const tx = await contract.action();
    setStatus('success');  // Show success immediately on Sei
    
    // Wait for confirmation in background
    await tx.wait();
  } catch (error) {
    setStatus('error');
  }
};
```

### 2. Real-Time Price Feeds

Use WebSocket for continuous updates:

```typescript
import { ethers } from 'ethers';
import { SeiRPC } from '@/config/sei';

const provider = new ethers.WebSocketProvider(SeiRPC.testnet.ws);

contract.on('PriceUpdate', (price, timestamp) => {
  console.log(`Price: $${price} at ${timestamp}`);
  // Update chart, positions, etc.
});
```

### 3. Order Book Patterns

Design for minimal shared state:

```solidity
contract OrderBook {
  mapping(address => Order[]) public userOrders;

  event OrderPlaced(address indexed trader, uint128 price, uint128 amount);

  function placeOrder(uint128 price, uint128 amount) external {
    userOrders[msg.sender].push(Order(msg.sender, price, amount));
    emit OrderPlaced(msg.sender, price, amount);
  }
}
```

## Security Considerations

### MEV and Frontrunning
Sei's ~400ms finality reduces but doesn't eliminate MEV. For sensitive operations:
- Use commit-reveal schemes for large trades
- Consider private mempools
- Be aware validators can reorder within a block

### High-Throughput Reentrancy
More concurrent calls possible on Sei. Always use:
```solidity
import '@openzeppelin/contracts/security/ReentrancyGuard.sol';

contract SafeContract is ReentrancyGuard {
  function withdraw() external nonReentrant {
    // Safe!
  }
}
```

### Oracle Integration
Sei's native oracle was retired (proposal 110). Use third-party providers:
- **Chainlink** - Industry standard
- **Pyth** - High-frequency, low-latency
- **API3** - First-party oracles with OEV rewards

Set tight staleness thresholds for sub-second blocks:
```solidity
require(
  block.timestamp - oracleTimestamp < 5 seconds,  // Not minutes!
  "Oracle data too stale"
);
```

## Sei Token (SEI)

SEI is the native token of the Sei blockchain:
- **Decimals:** 18 (ERC-20 standard)
- **ChainLink Price Feed:** Available
- **Trading:** Supported on major DEXs (Astroport, Sushi, etc.)

Terminal supports SEI trading:
```typescript
const seiTicker = await api.get('/market/ticker/SEI');
const seiCandles = await api.get('/market/candles/SEI?interval=1d');
```

## Asset Bridging

### Native Bridge
Official Sei bridge for cross-chain transfers:
https://app.sei.io/bridge

### Third-Party Bridges
- **Wormhole** - Cross-chain messaging
- **Axelar** - General message passing

Always verify bridge contract addresses from official sources.

## Performance Benchmarking

Load test your trading app on Sei:

```javascript
async function loadTest() {
  const signers = await ethers.getSigners();
  const promises = signers.slice(0, 100).map(async (signer) => {
    const tx = await contract.connect(signer).trade();
    return tx.wait();
  });

  const start = Date.now();
  await Promise.all(promises);
  const duration = Date.now() - start;

  console.log(`100 trades in ${duration}ms`);
  console.log(`TPS: ${(100 / (duration / 1000)).toFixed(2)}`);
}
```

## Resources

- **Official Docs:** https://docs.sei.io
- **SKILL Guide:** https://www.sei.io/SKILL.md
- **Explorer:** https://seitrace.com
- **Discord:** https://discord.gg/sei
- **GitHub:** https://github.com/sei-protocol

## Troubleshooting

### Wrong Network Connected
The wallet connector will show a warning. Users must manually switch to Sei in MetaMask:
1. Open MetaMask
2. Click network selector
3. Add Sei Network (chainId 1329 or 1328)
4. Switch to Sei

### Nonce Issues
Sei's fast blocks can cause nonce problems in automated systems:
- Track nonces locally for high-frequency senders
- Implement retry logic with nonce refresh
- Use `eth_getTransactionCount("pending")` for latest nonce

### RPC Rate Limiting
Use provider redundancy:
```typescript
const provider = new ethers.FallbackProvider([
  new ethers.JsonRpcProvider('https://evm-rpc.sei-apis.com'),
  new ethers.JsonRpcProvider('https://evm-rpc-2.sei-apis.com')
]);
```

---

**Need help?** Check `config/sei.ts` for constants or refer to https://www.sei.io/SKILL.md for comprehensive guide.

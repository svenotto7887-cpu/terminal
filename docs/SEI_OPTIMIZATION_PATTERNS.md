# Sei Performance Optimization Patterns

Based on https://www.sei.io/SKILL.md - Sei Development Skill

## Overview

Sei's parallel execution engine enables unprecedented transaction throughput. To maximize performance:

1. **Design for parallelization** - minimize shared state
2. **Use user-scoped storage** - separate mappings per user
3. **Emit events** - aggregate off-chain instead of on-chain
4. **Batch operations** - group related updates
5. **Optimize gas** - still matters on Sei, pack variables efficiently

---

## 1. Parallel-Friendly Contract Design

### Problem: Shared State Bottleneck

When multiple transactions write to the same storage variable, Sei's parallel execution can't process them concurrently:

```solidity
// ❌ BAD: All transactions must serialize on this single variable
contract SerializedCounter {
    uint256 public totalDeposits;  // BOTTLENECK
    
    function deposit(uint256 amount) external {
        totalDeposits += amount;  // Must wait for previous txs
    }
}
```

### Solution: User-Scoped State

Each user's transaction can execute independently:

```solidity
// ✅ GOOD: Per-user state enables parallel execution
contract ParallelCounter {
    mapping(address => uint256) public userDeposits;  // Independent
    
    function deposit(uint256 amount) external {
        userDeposits[msg.sender] += amount;  // Parallel-safe
    }
}
```

**Benefit:** 100 users depositing in parallel = 100x throughput

---

## 2. Event-Driven Aggregation

When you need totals, calculate them off-chain using events:

```solidity
// ❌ AVOID: Expensive shared state update for totals
uint256 public grandTotal = 0;

function storeTotal() private {
    grandTotal += amount;  // Serializes transactions!
}

// ✅ GOOD: Emit events, aggregate off-chain
event Deposited(address indexed user, uint256 amount, uint256 timestamp);

function deposit(uint256 amount) external {
    users[msg.sender].balance += amount;  // Parallel-safe
    emit Deposited(msg.sender, amount, block.timestamp);
    // The Graph or other indexer listens to these events
    // and maintains grandTotal off-chain
}
```

**Benefits:**
- Transactions execute in parallel
- Aggregate data still available (just off-chain)
- Lower gas costs
- Real-time updates via event listeners

---

## 3. Batch Updates Pattern

For rare cases where on-chain totals are unavoidable, batch the shared state update:

```solidity
contract PortfolioManager {
    // Per-user state (parallel-safe)
    mapping(address => uint256) public portfolioValue;
    
    // Batch aggregation (rarely called)
    uint256 public totalAUM;
    uint256 public lastRebalance;
    uint256 constant REBALANCE_INTERVAL = 1 hours;
    
    function updatePortfolio(uint256 newValue) external {
        // Fast, parallel path
        portfolioValue[msg.sender] = newValue;
        emit PortfolioUpdated(msg.sender, newValue);
    }
    
    // Expensive shared-state operation - called infrequently
    function rebalance() external onlyOwner {
        require(
            block.timestamp >= lastRebalance + REBALANCE_INTERVAL,
            "Too soon"
        );
        
        // Batch update: Calculate total from many individual updates
        // In practice, use an oracle or off-chain calculation
        uint256 newTotal = calculateTAUM();  // Off-chain computed
        totalAUM = newTotal;
        lastRebalance = block.timestamp;
        
        emit Rebalanced(newTotal);
    }
}
```

**Key:** Separate fast (parallel) path from slow (batched) path.

---

## 4. High-Frequency Trading Patterns

### MEV-Resistant Order Placement

```solidity
contract OrderBook {
    struct Order {
        address trader;
        uint128 price;
        uint128 quantity;
        uint64 nonce;
    }
    
    // Per-trader order management (parallel-safe)
    mapping(address => Order[]) public userOrders;
    
    // Event for off-chain matching
    event OrderPlaced(
        address indexed trader,
        uint128 price,
        uint128 quantity,
        uint64 timestamp
    );
    
    function placeOrder(
        uint128 price,
        uint128 quantity,
        bytes calldata signature
    ) external {
        // Verify order authenticity
        bytes32 orderHash = keccak256(
            abi.encodePacked(msg.sender, price, quantity, 1)
        );
        require(verifySignature(orderHash, signature), "Invalid sig");
        
        // Store order (parallel-safe)
        userOrders[msg.sender].push(
            Order(msg.sender, price, quantity, uint64(block.timestamp))
        );
        
        // Events for off-chain matching engine
        emit OrderPlaced(msg.sender, price, quantity, uint64(block.timestamp));
    }
    
    // Matching happens off-chain (faster, more efficient)
    // Settlement on-chain uses batch fills
    function fillOrders(bytes calldata batchFills) external {
        // Batch many orders atomically (less frequent)
    }
}
```

**Pattern:** Place orders on-chain (parallel), match off-chain, settle in batches.

---

## 5. Multiplayer Gaming Patterns

```solidity
contract GameState {
    struct Player {
        uint64 x;
        uint64 y;
        uint64 health;
        uint64 lastActionTime;
        uint64 nonce;
    }
    
    // Per-player state (100% parallel)
    mapping(address => Player) public players;
    
    event PlayerMoved(address indexed player, uint64 x, uint64 y, uint64 nonce);
    event PlayerAttacked(
        address indexed attacker,
        address indexed target,
        uint64 damage
    );
    
    function playerMove(uint64 newX, uint64 newY) external {
        Player storage player = players[msg.sender];
        
        // Cooldown check
        require(
            block.timestamp >= player.lastActionTime + 1 seconds,
            "Cooldown"
        );
        
        // Update (parallel-safe - only affects this player)
        player.x = newX;
        player.y = newY;
        player.lastActionTime = uint64(block.timestamp);
        player.nonce++;
        
        emit PlayerMoved(msg.sender, newX, newY, player.nonce);
    }
    
    function attackPlayer(address target, uint64 damage) external {
        Player storage attacker = players[msg.sender];
        Player storage targetPlayer = players[target];
        
        require(attacker.health > 0, "You are dead");
        require(targetPlayer.health > 0, "Target is dead");
        
        // Update both players (may serialize if targeting same player,
        // but different players = parallel)
        targetPlayer.health = targetPlayer.health > damage
            ? targetPlayer.health - damage
            : 0;
        attacker.lastActionTime = uint64(block.timestamp);
        
        emit PlayerAttacked(msg.sender, target, damage);
    }
}
```

**Key:** Sei's parallel execution means 100 players moving simultaneously = 100x throughput vs sequential chains.

---

## 6. Gas Optimization Patterns

While Sei has lower gas costs, optimization still matters:

```solidity
// ✅ GOOD: Storage variable packing
contract Optimized {
    // Slot 1: uint64 (8) + uint64 (8) + bool (1) + padding = 32 bytes
    uint64 timestamp;        // 8 bytes
    uint64 amount;           // 8 bytes (total: 16 bytes)
    bool isActive;           // 1 byte (total: 17 bytes, rounds to 32)
    
    // Slot 2: address (20) + uint16 (2) = 32 bytes
    address owner;           // 20 bytes
    uint16 referralCode;     // 2 bytes (total: 22 bytes, rounds to 32)
    
    // Slot 3: Dynamic
    uint256[] data;
}

// ❌ AVOID: Wasted storage
contract Inefficient {
    uint256 timestamp;       // 32 bytes (only needs 8)
    uint256 amount;          // 32 bytes (only needs 8)
    address owner;           // 32 bytes (only needs 20)
}
```

**Result:** Optimized uses 3 slots, Inefficient uses 3 slots, but Optimized packs better for future additions.

---

## 7. Reentrancy & Concurrent Call Safety

Sei's throughput means more concurrent calls. Always protect:

```solidity
// ❌ VULNERABLE: Concurrent calls can exploit state inconsistency
contract Vulnerable {
    mapping(address => uint256) balances;
    
    function withdraw(uint256 amount) external {
        require(balances[msg.sender] >= amount);
        
        (bool success, ) = msg.sender.call{value: amount}("");  // External call
        
        // If call triggers another withdraw while executing,
        // balance hasn't been updated yet!
        if (success) {
            balances[msg.sender] -= amount;
        }
    }
}

// ✅ SECURE: Check-Effects-Interactions + ReentrancyGuard
contract Secure {
    using ReentrancyGuard for *;
    mapping(address => uint256) balances;
    
    function withdraw(uint256 amount) external nonReentrant {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        
        balances[msg.sender] -= amount;  // Update state first
        
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success);
    }
}
```

---

## 8. Real-Time Frontend Patterns

### Optimistic Updates

Leverage Sei's ~400ms finality for instant feedback:

```typescript
// Frontend handles optimistic updates
const handleTransaction = async () => {
  const previousState = currentState;
  
  // Show success immediately (Sei guarantees finality)
  setStatus('success');
  updateLocalState(newValue);
  
  try {
    const tx = await contract.action();
    
    // Wait for confirmation (usually instant)
    await tx.wait();
  } catch (error) {
    // Rollback if failed
    setState(previousState);
    setStatus('error');
  }
};
```

### Real-Time Event Listeners

```typescript
// WebSocket connection for instant updates
const provider = new ethers.WebSocketProvider(
  'wss://evm-ws-testnet.sei-apis.com'
);

contract.on('OrderFilled', (orderId, price, quantity) => {
  // Update order book in real-time
  updateOrderBook(orderId, price, quantity);
});
```

---

## Performance Metrics

Expected improvements when following these patterns:

| Metric | Ethereum | Sei | Improvement |
|--------|----------|-----|-------------|
| Finality | 12+ min | ~400ms | **~2000x faster** |
| TPS | ~15 | 12500+ | **~830x more** |
| Block Time | ~12s | ~400ms | **30x faster** |
| Cost per tx | $5-50 | $0.01-0.10 | **100-1000x cheaper** |

---

## Checklist: Optimize Your Contract

- [ ] Use per-user/per-account storage mappings
- [ ] Minimize shared state writes
- [ ] Plan to aggregate data off-chain
- [ ] Batch frequent shared-state updates
- [ ] Use `ReentrancyGuard` on all external calls
- [ ] Implement cooldowns for rate-limiting
- [ ] Test with 50-100 concurrent transactions
- [ ] Monitor gas usage with `hardhat-gas-reporter`
- [ ] Set up real-time event listeners on frontend
- [ ] Consider WebSocket connections for live data

---

## References

- **Sei Docs:** https://docs.sei.io
- **SKILL Guide:** https://www.sei.io/SKILL.md
- **OpenZeppelin:** https://docs.openzeppelin.com
- **Hardhat:** https://hardhat.org

# Post-Deployment Checklist

Your Terminal is now live in the cloud! Follow this checklist to ensure everything works correctly and is ready for external testing.

---

## Immediate Checks (5 minutes)

### ✅ Health Check

```bash
# Test backend is responding
curl https://your-backend-url.com/health

# Should return:
# {"status":"OK","timestamp":"2026-03-05T12:34:56.789Z"}
```

### ✅ Frontend Loading

1. Open https://your-frontend-url.com in browser
2. You should see the Terminal dashboard
3. Check console (F12 → Console tab) for any red errors
4. If you see network errors, check CORS configuration

### ✅ API Connectivity

```bash
# Test API endpoint
curl https://your-backend-url.com/api/market/candles/BTC

# Should return JSON with 45 candles (NOT 404 or timeout)
```

---

## Configuration Validation (10 minutes)

### Environment Variables

Check that all required variables are set in your cloud platform:

**Backend Required:**
- ✅ PORT=4000
- ✅ NODE_ENV=production
- ✅ DATABASE_URL (PostgreSQL)
- ✅ REDIS_URL (Redis)
- ✅ JWT_SECRET (random 32+ chars)
- ✅ FRONTEND_ORIGIN (your frontend URL)

**Frontend Build Args:**
- ✅ VITE_API_BASE_URL (your backend URL)

### Database Connection

```bash
# Verify database is accessible
# Log into cloud platform → Postgres → check connection

# Check migrations ran (look for tables in public schema)
```

### Redis Cache

```bash
# Verify Redis is accessible
# Try making 2 identical requests to the API
# Second should show cache hit in logs
```

---

## Testing Market Data (15 minutes)

### Test Chart Loading

1. Open dashboard in browser
2. Search for "BTC" in ticker search
3. Chart should load with real data
4. Check console (F12) for:
   - ❌ Should NOT see "Network Error"
   - ❌ Should NOT see "CORS" errors
   - ✅ Should see requests to `/api/market/candles`

### Test Different Timeframes

Click on chart timeframe buttons:
- 1m, 5m, 15m, 1h, 4h, 1d, 1w
- Chart should update immediately
- Should see cache hits in backend logs

### Test Multiple Tickers

Search and view charts for:
- BTC (Bitcoin)
- ETH (Ethereum)
- SOL (Solana)
- SEI (Sei token)

Each should load without errors.

### Test Caching

```bash
# Call candle endpoint 3 times in 10 seconds
curl https://your-backend-url.com/api/market/candles/BTC
curl https://your-backend-url.com/api/market/candles/BTC
curl https://your-backend-url.com/api/market/candles/BTC

# Check backend logs
# First call: "CoinGecko API request"
# Second call: "✅ Cache hit"
# Third call: "✅ Cache hit"
```

---

## Blockchain Integration Checks (Optional)

If you deployed Sei wallet features:

### Test Wallet Connection

1. Install MetaMask browser extension
2. Add Sei network to MetaMask:
   - Network Name: Sei Mainnet
   - RPC URL: https://evm-rpc.sei-apis.com
   - Chain ID: 1329
   - Symbol: SEI
3. Return to dashboard
4. Click "Connect Wallet" button
5. Approve in MetaMask
6. Connected wallet address should appear in header

### Test Network Stats

```bash
curl https://your-backend-url.com/api/market/network/sei

# Should return:
# {
#   "chain": "Sei",
#   "finality": "7s or less",
#   "tps": 7000,
#   "consensus": "Tendermint",
#   "blockHeight": 123456
# }
```

---

## Performance & Monitoring (20 minutes)

### Check Cloud Dashboard

**Render.com:**
- Logs → View deployment logs (should show "Server running on port 4000")
- Metrics → Check CPU, memory, requests/sec
- Uptime → Should be 100% if deployed correctly

**Railway:**
- Deploy → View build logs (should complete successfully)
- Monitoring → Check CPU, memory usage
- Logs → Real-time application logs

**Heroku:**
- More → View logs (should show Express server starting)
- Metrics → Monitor dyno performance
- Resources → Check if scaling needed

### Monitor Real Requests

Set up a **ping** to keep services alive:

```bash
# For Render/Railway free tiers that spin down
# Add this cron job to call health check every hour

# Using cron-job.org (free):
1. Visit https://cron-job.org/en/
2. Sign up free
3. Create Job → URL: https://your-backend-url.com/health
4. Interval: Every 1 hour
```

This prevents cold starts from making your service slow.

### Logs & Troubleshooting

**Common issues to check logs for:**

1. **"Connection refused" to database**
   - DATABASE_URL is wrong
   - Database not running
   - Firewall blocking connection

2. **"Cannot find module" errors**
   - Dependencies not installed
   - Build failed (check Docker build logs)
   - package.json missing script

3. **"CORS error" from browser**
   - FRONTEND_ORIGIN doesn't match
   - Trailing slash in URL
   - Non-HTTPS when should be HTTPS

4. **Chart showing "No data"**
   - API failing (check /api/market/candles endpoints)
   - CoinGecko rate limiting (add longer cache)
   - Ticker not found in market data

---

## Security Checklist (10 minutes)

### Environment Secrets

- ✅ JWT_SECRET is 32+ random characters
- ✅ Database password is strong (20+ chars, mixed)
- ✅ Redis password is set (if required)
- ✅ API keys not exposed in frontend code
- ✅ FRONTEND_ORIGIN is HTTPS (not HTTP)
- ✅ Secrets not committed to GitHub

### Network Security

- ✅ CORS only allows your frontend domain
- ✅ Database only accessible from backend
- ✅ Redis only accessible from backend
- ✅ No public database ports exposed
- ✅ SSL/TLS enabled (HTTPS)

### Git Security

- ✅ .env.production not committed
- ✅ node_modules in .gitignore
- ✅ .env.local in .gitignore
- ✅ Platform-specific secrets in cloud dashboard only

---

## Readiness for External Testing

### Before Sharing URL

- ✅ Dashboard loads
- ✅ Chart displays real data
- ✅ No console errors
- ✅ Multiple tickers searchable
- ✅ Timeframes change chart
- ✅ (Optional) Wallet connection works
- ✅ API responds to direct calls
- ✅ Database connection stable
- ✅ Logs not showing errors

### Create Test Account List

Share with testers:

```markdown
## Terminal Test Links

**Frontend (User Dashboard):**
https://your-frontend-url.com

**Diagnostics (For debugging):**
https://your-frontend-url.com/diagnostic

**API Status:**
https://your-backend-url.com/health

## Test Scenarios

1. Search for "BTC" in ticker
2. View 1h and 1d charts
3. Try 5 different coins
4. (Testnet) Connect MetaMask wallet
5. View network stats
6. Report any errors in console

## Feedback

Report issues:
- Screenshot of error
- Browser console output (F12)
- Steps to reproduce
```

---

## Scaling & Optimization

If you get external traffic:

### Monitor Resource Usage

- Backend CPU > 80%? → Scale up or optimize code
- Memory > 90%? → Increase container size
- Database response slow? → Add indexing
- Redis full? → Increase Redis size or reduce TTL

### Optimize Performance

1. **Increase cache TTL:**
   ```javascript
   // In coingecko.provider.ts
   if (Date.now() - cached.timestamp < 600000) // 10 minutes
   ```

2. **Add pagination to API:**
   ```javascript
   // Return only 20 candles instead of 45
   candles.slice(-20)
   ```

3. **Compress responses:**
   ```javascript
   // Already enabled in Express compression middleware
   ```

4. **Enable CDN for frontend:**
   - Render: Static site → Add custom domain
   - Railway: Add Cloudflare as CDN
   - Heroku: Add Heroku Drains + CloudFlare

---

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| 404 on /api/* | Check backend FRONTEND_ORIGIN, restart service |
| CORS error | Verify FRONTEND_ORIGIN matches frontend URL exactly |
| "No candles" | Check CoinGecko API status, verify ticker exists |
| Slow chart load | Increase cache TTL, check database query performance |
| Memory leak | Check for circular dependencies, restart service |
| Old data showing | Clear browser cache (Ctrl+Shift+Del), clear Redis |
| Wallet not connecting | Check SEI_NETWORK env var, verify MetaMask settings |

---

## Ongoing Maintenance

### Daily

- ✅ Check dashboard for errors
- ✅ Spot-check if chart loads
- ✅ Read error logs for patterns

### Weekly

- ✅ Monitor API performance
- ✅ Check database size growth
- ✅ Review tester feedback
- ✅ Update code if bugs found

### Monthly

- ✅ Run full test suite locally
- ✅ Update dependencies: `npm outdated`
- ✅ Check cloud cost usage
- ✅ Review security settings

---

## Next Steps

1. ✅ Run through all checks above
2. ✅ Fix any issues found
3. ✅ Test with your team
4. ✅ Share URLs with external testers
5. ✅ Collect feedback
6. ✅ Iterate on issues

**Your Terminal is now production-ready!** 🚀

Need help? Check:
- `docs/CLOUD_DEPLOYMENT.md` - Platform-specific troubleshooting
- `docs/API.md` - API endpoint documentation
- GitHub Issues - Report bugs with logs attached


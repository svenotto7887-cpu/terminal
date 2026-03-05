# Quick Cloud Deployment Guide

Deploy Terminal to the cloud in **5 minutes**!

## Fastest Option: Render.com ⚡

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Ready for cloud deployment"
git push origin main
```

### Step 2: Create Render Account
- Go to https://render.com
- Click "Sign up with GitHub"
- Authorize terminal repository

### Step 3: Deploy Backend
1. Click "New" → "Web Service"
2. Select your Terminal repository
3. Fill in:
   - **Name:** terminal-backend
   - **Environment:** Docker
   - **Build Command:** (leave empty)
4. Click "Create Web Service"
5. Wait 3-5 minutes for deployment

### Step 4: Deploy Frontend
1. Click "New" → "Static Site"
2. Select your Terminal repository
3. Fill in:
   - **Name:** terminal-frontend
   - **Build Command:** `npm run build --workspace=frontend`
   - **Publish Directory:** `frontend/dist`
4. Click "Create Static Site"
5. Wait 2-3 minutes for deployment

### Step 5: Configure Environment Variables

**Backend Service:**
1. Click "terminal-backend" → "Environment"
2. Add variables:
```
NODE_ENV=production
DATABASE_URL=postgresql://...  (Render provides this)
REDIS_URL=redis://...          (Render provides this)
JWT_SECRET=generate-a-long-random-string-here
FRONTEND_ORIGIN=https://your-frontend-domain-here.onrender.com
SEI_NETWORK=testnet
SEI_RPC_URL=https://evm-rpc-testnet.sei-apis.com
FRONTEND_ORIGIN=https://your-frontend-here.onrender.com
```

**Frontend Site:**
1. Click "terminal-frontend" → "Environment"
2. Add variables:
```
VITE_API_BASE_URL=https://terminal-backend.onrender.com
VITE_WS_URL=https://terminal-backend.onrender.com
```

### Step 6: Test Your Deployment

```bash
# Test backend
curl https://terminal-backend.onrender.com/health

# Test API
curl https://terminal-backend.onrender.com/api/market/candles/BTC

# Test frontend (open in browser)
https://terminal-frontend.onrender.com
```

---

## Alternative: Railway.app 🚂

### Step 1-2: Same as above (push to GitHub, create account)

### Step 3: Deploy Project
1. Go to https://railway.app
2. Click "New Project" → "Deploy from GitHub"
3. Select Terminal repository
4. Railway auto-detects services

### Step 4: Configure Environment
1. Click "Variables"
2. Add all environment variables from `.env.example`

### Step 5: Done! 🎉
Railway auto-deploys on every GitHub push

**Cost:** Free tier available (~$5/month after)

---

## Heroku Alternative 🟧

### Setup (takes ~10 minutes with Heroku CLI)
```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create your-app-name

# Add database
heroku addons:create heroku-postgresql:mini

# Add Redis
heroku addons:create heroku-redis:mini

# Deploy
git push heroku main

# Set environment
heroku config:set JWT_SECRET=your-secret-key
heroku config:set FRONTEND_ORIGIN=https://your-app-name.herokuapp.com
```

**Cost:** Starting at $50/month

---

## Getting Your URLs

After deployment, you'll have URLs like:

- **Backend:** `https://terminal-backend-xxxxx.onrender.com` (Render) or `https://terminal-backend.railway.app` (Railway)
- **Frontend:** `https://terminal-frontend-xxxxx.onrender.com` (Render)

### Share These URLs! 🎉

Send frontend URL to external testers:
```
Website: https://terminal-frontend-xxxxx.onrender.com
Login with MetaMask/WalletConnect
Test on Sei Testnet
```

---

## Troubleshooting

### Backend won't start
```bash
# Check logs
# Render: Dashboard → Logs
# Railway: Click service → Logs

# Common issues:
# - DATABASE_URL not set
# - JWT_SECRET missing
# - FRONTEND_ORIGIN not matching
```

### Frontend shows "Cannot reach API"
- Check `VITE_API_BASE_URL` matches backend URL
- Add `/api` to the end if needed
- Ensure backend service is healthy

### Database connection failing
```bash
# Test locally first
export DATABASE_URL=postgresql://...
npm run migrate --workspace=backend
```

---

## Next Steps

1. ✅ Deploy to cloud platform
2. ✅ Share URLs with testers
3. ✅ Monitor logs for errors
4. ✅ Collect feedback from testers
5. ✅ Apply improvements

---

## CI/CD: Auto-Deploy on GitHub Push

The `.github/workflows/deploy.yml` workflow will:
- Run tests on every PR
- Build Docker images
- Auto-deploy to staging (develop branch)
- Auto-deploy to production (main branch)

### Set up GitHub Secrets:
1. Go to GitHub → Settings → Secrets and variables
2. Add:
   - `DEPLOY_TOKEN` - Your Render/Railway API token
   - `STAGING_WEBHOOK` - Webhook for staging deployment
   - `PRODUCTION_WEBHOOK` - Webhook for production deployment

Then every push to `main` auto-deploys! 🚀

---

## Questions?

- **Render help:** https://render.com/docs
- **Railway help:** https://docs.railway.app
- **Heroku help:** https://devcenter.heroku.com
- **GitHub Actions:** https://docs.github.com/en/actions

**You're now live on the cloud!** ☁️

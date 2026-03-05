# Cloud Deployment Guide

Terminal can be deployed to multiple cloud platforms. Choose your preferred provider below.

## Platform Comparison

| Platform | Ease | Cost | Cold Starts | Database | Perfect For |
|----------|------|------|------------|----------|-------------|
| **Render** | ⭐⭐⭐⭐⭐ | $$ | Fast | Built-in | Small-medium apps |
| **Railway** | ⭐⭐⭐⭐ | $ | Fast | Built-in | Startups, testing |
| **Heroku** | ⭐⭐⭐⭐ | $$$ | Slow | Built-in | Production apps |
| **AWS** | ⭐⭐⭐ | Variable | Fast | Configurable | Large deployments |
| **DigitalOcean** | ⭐⭐⭐⭐ | $$ | Fast | Separate | DevOps teams |
| **Fly.io** | ⭐⭐⭐⭐ | $ | Very Fast | Separate | Global distribution |

---

## 1. Render.com (Recommended - Easiest)

Render is the easiest cloud platform for deploying Terminal with automatic deployment from GitHub.

### Prerequisites
- GitHub account with Terminal repository
- Render account (free tier available)

### Setup Steps

1. **Push code to GitHub:**
   ```bash
   git remote add origin <your-repo-url>
   git push origin main
   ```

2. **Create Render account:**
   - Visit https://render.com
   - Sign up with GitHub

3. **Deploy Backend:**
   - Click "New" → "Web Service"
   - Connect your GitHub repo
   - Configuration:
     ```
     Name: terminal-backend
     Environment: Docker
     Build Command: (leave empty, uses Dockerfile)
     Start Command: (leave empty, uses Dockerfile)
     ```
   - Add environment variables (see below)
   - Storage: Add `/app/postgres_data` for persistent database
   - Click "Create Web Service"

4. **Deploy Frontend:**
   - Click "New" → "Static Site"
   - Connect your GitHub repo
   - Configuration:
     ```
     Build Command: npm run build --workspace=frontend
     Publish Directory: frontend/dist
     ```
   - Click "Create Static Site"

5. **Link Services:**
   - Backend: Update `FRONTEND_ORIGIN` to your frontend URL
   - Frontend: Update `VITE_API_BASE_URL` to your backend URL

**Environment Variables for Backend:**
```
NODE_ENV=production
DATABASE_URL=postgresql://[user]:[password]@[host]:[port]/terminal_db
REDIS_URL=redis://[host]:[port]
JWT_SECRET=[generate-a-long-random-string]
FRONTEND_ORIGIN=https://your-frontend.onrender.com
SEI_NETWORK=testnet
SEI_RPC_URL=https://evm-rpc-testnet.sei-apis.com
FINNHUB_API_KEY=[optional]
POLYGON_API_KEY=[optional]
```

**Cost:** ~$7/month (free tier: 0.5 vCPU)

---

## 2. Railway.app (Easiest + Cheapest)

Railway is developer-friendly with automatic deployment from GitHub and free PostgreSQL tier.

### Setup Steps

1. **Visit Railway.app:**
   - Go to https://railway.app
   - Sign up with GitHub

2. **Create New Project:**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Authorize and select your Terminal repo

3. **Add Services:**
   - Add PostgreSQL (automatic)
   - Add Redis (from template)
   - Configure backend service:
     ```
     Dockerfile: backend.Dockerfile
     Port: 4000
     ```

4. **Set Environment Variables:**
   - Go to Variables tab
   - Add all variables from `.env.example`
   - Railway automatically provides `DATABASE_URL` and `REDIS_URL`

5. **Deploy:**
   - Push to GitHub
   - Railway auto-deploys

**Cost:** Free tier available, then $5-10/month

---

## 3. Heroku (Traditional, but Paid)

Heroku is more expensive but reliable for production.

### Setup Steps

1. **Install Heroku CLI:**
   ```bash
   npm install -g heroku
   heroku login
   ```

2. **Create Heroku App:**
   ```bash
   heroku create your-app-name
   ```

3. **Add PostgreSQL:**
   ```bash
   heroku addons:create heroku-postgresql:mini
   ```

4. **Add Redis:**
   ```bash
   heroku addons:create heroku-redis:mini
   ```

5. **Deploy:**
   ```bash
   git push heroku main
   ```

6. **Set Environment Variables:**
   ```bash
   heroku config:set JWT_SECRET="your-secret-key"
   heroku config:set SEI_NETWORK=testnet
   # ... set all other variables
   ```

**Cost:** $50+/month (dyno pricing)

---

## 4. AWS ECS + RDS + ElastiCache

For production-grade deployments with auto-scaling.

### Prerequisites
- AWS account
- AWS CLI configured

### Setup Steps

1. **Create RDS PostgreSQL:**
   ```bash
   # Use AWS Console or CLI
   aws rds create-db-instance \
     --db-instance-identifier terminal-db \
     --db-instance-class db.t3.micro \
     --engine postgres \
     --master-username postgres \
     --allocated-storage 20
   ```

2. **Create ElastiCache Redis:**
   ```bash
   aws elasticache create-cache-cluster \
     --cache-cluster-id terminal-cache \
     --cache-node-type cache.t3.micro \
     --engine redis
   ```

3. **Push Docker Images to ECR:**
   ```bash
   # Create ECR repositories
   aws ecr create-repository --repository-name terminal-backend
   aws ecr create-repository --repository-name terminal-frontend
   
   # Build and push
   docker build -f backend.Dockerfile -t terminal-backend .
   docker tag terminal-backend:latest [account-id].dkr.ecr.[region].amazonaws.com/terminal-backend:latest
   docker push [account-id].dkr.ecr.[region].amazonaws.com/terminal-backend:latest
   ```

4. **Create ECS Cluster and Services:**
   - Use AWS Console → ECS
   - Create cluster
   - Deploy backend and frontend as services
   - Configure load balancer (ALB)

5. **Set Environment Variables in ECS task definition:**
   ```json
   {
     "containerDefinitions": [
       {
         "name": "terminal-backend",
         "environment": [
           {"name": "DATABASE_URL", "value": "postgresql://..."},
           {"name": "REDIS_URL", "value": "redis://..."},
           ...
         ]
       }
     ]
   }
   ```

**Cost:** $50-200+/month depending on traffic

---

## 5. DigitalOcean (Advanced)

Docker-native deployment with App Platform.

### Setup Steps

1. **Create DigitalOcean Account:**
   - Visit https://digitalocean.com
   - Create account with GitHub

2. **Create App:**
   - Click "Create" → "Apps"
   - Connect GitHub repository
   - Auto-detect Dockerfile services

3. **Configure Services:**
   ```
   backend:
     - Build: Dockerfile (backend.Dockerfile)
     - Port: 4000
   
   frontend:
     - Build: Dockerfile (frontend.Dockerfile)
     - Port: 3000
   
   database:
     - PostgreSQL 15
   
   cache:
     - Redis 7
   ```

4. **Deploy:**
   - Click "Create App"
   - DigitalOcean builds and deploys automatically

**Cost:** $12-50/month (DigitalOcean credits available for developers)

---

## 6. Fly.io (Advanced - Global Deployment)

Deploy to multiple regions globally with Fly.io.

### Setup Steps

1. **Install Fly CLI:**
   ```bash
   curl -L https://fly.io/install.sh | sh
   ```

2. **Login and Initialize:**
   ```bash
   fly auth login
   fly launch
   ```

3. **Configure fly.toml:**
   ```toml
   app = "terminal"
   
   [build]
     dockerfile = "backend.Dockerfile"
   
   [env]
     DATABASE_URL = "postgresql://..."
     REDIS_URL = "redis://..."
   
   [[services]]
     protocol = "tcp"
     internal_port = 4000
     ports = [{ handlers = ["http"], port = "80" }]
   ```

4. **Deploy:**
   ```bash
   fly deploy
   ```

**Cost:** $5-20/month for hobby tier

---

## Environment Variables for Cloud

Copy `.env.example` and update for your cloud environment:

```bash
# Backend .env
NODE_ENV=production
PORT=4000
DATABASE_URL=postgresql://user:pass@host:5432/terminal_db
REDIS_URL=redis://host:6379
FRONTEND_ORIGIN=https://your-frontend-domain.com
JWT_SECRET=long-random-secret-key
SEI_NETWORK=testnet
SEI_RPC_URL=https://evm-rpc-testnet.sei-apis.com
FINNHUB_API_KEY=your_api_key_optional
POLYGON_API_KEY=your_api_key_optional
```

```bash
# Frontend .env
VITE_API_BASE_URL=https://your-api-domain.com
VITE_WS_URL=https://your-api-domain.com
VITE_SEI_NETWORK=testnet
VITE_SEI_RPC_URL=https://evm-rpc-testnet.sei-apis.com
```

---

## CI/CD with GitHub Actions

Automatic deployment on push to `main` or `develop` branches:

```yaml
# .github/workflows/deploy.yml
- Runs tests on every PR
- Builds Docker images
- Pushes to container registry
- Deploys to staging (on develop)
- Deploys to production (on main)
```

Configure these secrets in GitHub:
- `DEPLOY_TOKEN` - API token for deployment
- `STAGING_WEBHOOK` - Render/Railway webhook for staging
- `PRODUCTION_WEBHOOK` - Render/Railway webhook for production

---

## Testing Your Deployment

Once deployed, test using:

```bash
# Backend health check
curl https://your-backend.com/health

# API test
curl https://your-backend.com/api/market/candles/BTC

# Frontend
open https://your-frontend.com
```

---

## Monitoring & Logs

### Render
- Logs: Dashboard → Logs
- Metrics: Dashboard → Metrics

### Railway
- Logs: Click service → Logs
- Deployments: Click service → Deployments

### Heroku
```bash
heroku logs -t
heroku metrics
```

### AWS
- CloudWatch Logs
- CloudWatch Metrics

---

## Troubleshooting

### Database Connection Issues
```bash
# Test connection locally
psql postgresql://user:pass@host:port/db

# Check DATABASE_URL format
postgresql://user:password@host:port/database
```

### Environment Variables Not Loading
- Verify all variables are set in cloud provider
- Restart services after updating variables
- Check for typos in variable names

### Static Files Not Serving
- Ensure frontend build completes
- Check `frontend/dist` directory exists
- Verify static file paths in backend

### Cold Starts
- Use Render or Railway (much faster)
- Avoid Heroku's free tier (hibernates after 30 mins)

---

## Next Steps

1. **Choose a platform** from the comparison table
2. **Follow the setup guide** for your chosen platform
3. **Push to GitHub** and let CI/CD handle deployment
4. **Share the URL** with external testers
5. **Monitor logs** and collect feedback

**Questions?** Check cloud provider documentation or reach out to team!

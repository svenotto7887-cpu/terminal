# GitHub Setup Guide

Get Terminal on GitHub so you can use cloud deployment platforms.

## Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Fill in:
   - **Repository name:** `terminal` (or your preferred name)
   - **Description:** `Professional trading platform with Sei blockchain support`
   - **Visibility:** Public (recommended for testing) or Private
3. Don't initialize with README (we have one)
4. Click "Create repository"

## Step 2: Push Existing Code to GitHub

```bash
# Navigate to Terminal directory
cd path/to/Terminal

# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Terminal trading platform with Sei integration"

# Add remote
git remote add origin https://github.com/YOUR_USERNAME/terminal.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Step 3: Enable GitHub Actions

1. Go to your repository on GitHub
2. Click "Actions" tab
3. Click "I understand my workflows, go ahead and enable them"
4. This enables the CI/CD pipeline in `.github/workflows/deploy.yml`

## Step 4: Create GitHub Secrets for Deployment

These are used by CI/CD for cloud deployment.

1. Go to Repository → Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Add these secrets:

### For Render Deployment:
```
Name: RENDER_DEPLOY_TOKEN
Value: your-render-api-key  (from https://dashboard.render.com/api-keys)

Name: RENDER_STAGING_WEBHOOK
Value: https://api.render.com/deploy/srv-xxxxx  (from Render service settings)

Name: RENDER_PRODUCTION_WEBHOOK
Value: https://api.render.com/deploy/srv-yyyyy
```

### For Railway Deployment:
```
Name: RAILWAY_TOKEN
Value: your-railway-api-token  (from https://railway.app/account/tokens)

Name: RAILWAY_PROJECT_ID
Value: your-project-id
```

### For Heroku Deployment:
```
Name: HEROKU_API_KEY
Value: your-heroku-api-key  (from https://dashboard.heroku.com/account/applications/authorizations/new)

Name: HEROKU_APP_NAME
Value: your-app-name
```

## Step 5: Set Up Branch Protection (Optional but Recommended)

Protect main branch from direct pushes:

1. Go to Repository → Settings → Branches
2. Click "Add rule"
3. Branch name pattern: `main`
4. Enable:
   - "Require a pull request before merging"
   - "Require approval of reviewers"
   - "Require branches to be up to date before merging"
5. Click "Create"

This ensures tests pass before merging to main.

## Step 6: Add Collaborators (for team testing)

1. Go to Repository → Settings → Collaborators
2. Click "Add people"
3. Search and invite team members
4. They can now:
   - Review pull requests
   - Push changes
   - Deploy to cloud

## Step 7: Enable Discussions (Optional for Feedback)

1. Go to Repository → Settings
2. Check "Discussions"
3. Click "Set up discussions"
4. Now you have a space for testers to report issues!

---

## Workflow: Making Changes & Deploying

```bash
# 1. Create a feature branch
git checkout -b feature/my-feature

# 2. Make changes
# ... edit files ...

# 3. Commit changes
git add .
git commit -m "Add new feature description"

# 4. Push to GitHub
git push origin feature/my-feature

# 5. Create Pull Request on GitHub
# - GitHub will run tests automatically
# - Reviewers can approve
# - Merge to main when ready

# 6. Auto-Deploy!
# When you merge to main, GitHub Actions will:
# ✅ Run all tests
# ✅ Build Docker images
# ✅ Push to container registry
# ✅ Deploy to production
```

---

## Continuous Integration (CI)

The `.github/workflows/deploy.yml` workflow runs automatically:

### On Every Push:
1. ✅ Lints TypeScript/JavaScript
2. ✅ Runs backend tests
3. ✅ Runs frontend tests
4. ✅ Type checking

### On Main Branch Only:
1. ✅ Builds Docker images
2. ✅ Pushes to GitHub Container Registry (ghcr.io)
3. ✅ Deploys to production

### On Develop Branch:
1. Same as main, but deploys to staging

---

## Useful Git Commands

```bash
# Check status
git status

# View branches
git branch -a

# Switch branches
git switch feature-name

# Create and switch to new branch
git switch -c new-feature

# Sync with remote
git pull origin main

# View commit history
git log --oneline -10

# Undo last commit (before push)
git reset --soft HEAD~1

# Discard changes
git checkout -- filename

# Stash changes temporarily
git stash
git stash pop
```

---

## Troubleshooting

### "Failed to push"
```bash
# Your local branch is behind
git pull origin main
git push origin feature-name
```

### "Branch has diverged"
```bash
# Rebase instead of merge
git rebase origin/main
git push --force-with-lease origin feature-name
```

### "Tests failed in CI"
1. Click "Details" on the failed check
2. View logs to see what failed
3. Fix locally and push again
4. CI will re-run automatically

---

## Monitoring Deployments

### GitHub Actions Tab
Shows all workflow runs:
- ✅ Passed (green)
- ❌ Failed (red)
- ⏳ In progress (yellow)

Click a run to see detailed logs.

### Cloud Provider Dashboard
- **Render:** https://dashboard.render.com
- **Railway:** https://railway.app/dashboard
- **Heroku:** https://dashboard.heroku.com/apps

Each shows:
- Deployment status
- Logs
- Error messages
- Metrics

---

## Next Steps

1. ✅ Create GitHub repository
2. ✅ Push Terminal code
3. ✅ Enable GitHub Actions
4. ✅ Add secrets for your cloud platform
5. ✅ Create first PR and watch tests run
6. ✅ Merge to main for auto-deployment
7. ✅ Share cloud URL with testers!

---

**You're all set!** Every push to GitHub is now on the cloud. 🚀

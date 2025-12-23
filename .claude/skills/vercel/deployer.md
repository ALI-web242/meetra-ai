# Deployer

## Description
Triggers and manages Vercel deployments for production and preview environments.

## Trigger
- Deployment needed
- `/deploy` command
- Push to main branch

## Instructions

### Vercel CLI Setup

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link project
vercel link
```

### Deployment Commands

```bash
# Preview deployment (development)
vercel

# Production deployment
vercel --prod

# Deploy specific directory
vercel ./frontend --prod

# Deploy with specific name
vercel --name my-project

# Deploy without prompts
vercel --yes
```

### Deployment Types

| Type | Trigger | URL | Use Case |
|------|---------|-----|----------|
| Preview | Push to branch | `*.vercel.app` | Testing |
| Production | Push to main | Custom domain | Live site |
| Manual | `vercel --prod` | Custom domain | Hotfixes |

### Deployment Workflow

```markdown
## Automatic Deployments

1. **Push to Feature Branch**
   - Creates preview deployment
   - URL: `{project}-{branch}-{hash}.vercel.app`

2. **Merge to Main**
   - Triggers production deployment
   - URL: Custom domain

## Manual Deployments

```bash
# Preview
vercel

# Production
vercel --prod
```
```

### Vercel Configuration

```json
// vercel.json
{
  "version": 2,
  "name": "my-project",
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/$1"
    }
  ],
  "env": {
    "NEXT_PUBLIC_API_URL": "@api_url"
  },
  "build": {
    "env": {
      "NEXT_PUBLIC_API_URL": "@api_url"
    }
  }
}
```

### Deployment Status

```bash
# List deployments
vercel ls

# Get deployment info
vercel inspect <deployment-url>

# View deployment logs
vercel logs <deployment-url>

# Get current project info
vercel project ls
```

### Deployment Hooks (CI/CD)

```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

### Pre-Deployment Checklist

```markdown
## Before Deploying

- [ ] All tests pass
- [ ] Build succeeds locally
- [ ] Environment variables set
- [ ] No console errors
- [ ] API endpoints accessible
- [ ] Database migrations run

## After Deployment

- [ ] Verify deployment URL works
- [ ] Test critical user flows
- [ ] Check error monitoring
- [ ] Verify environment variables
```

### Rollback

```bash
# List recent deployments
vercel ls

# Promote previous deployment to production
vercel promote <deployment-url>

# Or alias a previous deployment
vercel alias <old-deployment-url> production.example.com
```

### Build Configuration

```json
// package.json
{
  "scripts": {
    "vercel-build": "npm run build"
  }
}
```

## Tools Used
- `Bash`: Run Vercel CLI commands

## Best Practices
- Always test preview first
- Use environment variables
- Monitor deployment logs
- Set up alerts for failures
- Keep rollback plan ready

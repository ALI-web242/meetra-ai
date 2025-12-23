# Preview Creator

## Description
Creates and manages preview deployments for testing features before production.

## Trigger
- Preview deployment needed
- `/vercel preview` command
- PR created

## Instructions

### Automatic Preview Deployments

```markdown
## GitHub Integration

When connected to GitHub, Vercel automatically:
1. Creates preview deployment on every push
2. Updates deployment on new commits
3. Posts deployment URL to PR comments
4. Runs checks on deployment

## Preview URL Format
https://{project}-{branch}-{hash}.vercel.app
https://{project}-git-{branch}-{team}.vercel.app
```

### Manual Preview Deployment

```bash
# Create preview deployment
vercel

# Output:
# Deployed to https://my-project-abc123.vercel.app

# With specific alias
vercel --alias feature-preview

# Deploy from specific directory
vercel ./frontend
```

### Preview in PR Comments

```markdown
## Vercel Bot Comment

| Name | Status | Preview | Updated |
|------|--------|---------|---------|
| my-project | ✅ Ready | [Visit Preview](url) | 2m ago |

### Inspecting Preview
Click "Visit Preview" to test deployment
Click "Inspect" for build logs
```

### Preview Configuration

```json
// vercel.json
{
  "github": {
    "enabled": true,
    "autoAlias": true,
    "silent": false
  },
  "preview": {
    "maxDuration": 10
  }
}
```

### Preview-Specific Settings

```bash
# Set preview-only environment variable
vercel env add PREVIEW_MODE preview

# Different API for preview
vercel env add NEXT_PUBLIC_API_URL preview
# Value: https://staging-api.example.com
```

### Testing Preview Deployment

```markdown
## Preview Testing Checklist

### Functionality
- [ ] All pages load correctly
- [ ] Forms submit successfully
- [ ] API calls work
- [ ] Authentication flows work

### Visual
- [ ] UI matches designs
- [ ] Responsive on mobile
- [ ] No layout breaks

### Performance
- [ ] Page loads < 3s
- [ ] Images optimized
- [ ] No console errors

### Integration
- [ ] Third-party services work
- [ ] Environment variables loaded
```

### Preview Deployment Lifecycle

```markdown
## Lifecycle

1. **Created**: On push to branch
2. **Building**: Vercel runs build
3. **Ready**: Deployment available
4. **Updated**: On new commits to branch
5. **Deleted**: When branch deleted (optional)

## Retention
- Preview deployments: Kept indefinitely by default
- Can configure auto-deletion
```

### Sharing Preview URLs

```bash
# Get current deployment URL
vercel ls
# Copy the preview URL

# Create custom alias for easier sharing
vercel alias https://my-project-abc123.vercel.app feature-demo.vercel.app
```

### Preview Deployment Commands

```bash
# List all deployments
vercel ls

# Get deployment info
vercel inspect https://my-project-abc123.vercel.app

# View logs
vercel logs https://my-project-abc123.vercel.app

# Remove preview deployment
vercel remove https://my-project-abc123.vercel.app
```

### Preview vs Production Differences

```typescript
// Detect preview environment
const isPreview = process.env.VERCEL_ENV === 'preview';

// Show preview banner
{isPreview && (
  <div className="bg-yellow-500 text-center py-1">
    Preview Environment
  </div>
)}
```

### GitHub Actions for Preview

```yaml
# .github/workflows/preview.yml
name: Preview Deployment

on:
  pull_request:
    types: [opened, synchronize]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Deploy Preview
        uses: amondnet/vercel-action@v25
        id: vercel
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}

      - name: Comment Preview URL
        uses: actions/github-script@v6
        with:
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: '🚀 Preview: ${{ steps.vercel.outputs.preview-url }}'
            })
```

## Tools Used
- `Bash`: Run Vercel CLI commands

## Best Practices
- Test preview before merging
- Share preview URL in PR
- Use preview-specific env vars
- Clean up old previews
- Test on multiple devices

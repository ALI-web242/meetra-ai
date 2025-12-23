# Env Manager

## Description
Manages environment variables in Vercel for different deployment environments.

## Trigger
- Environment setup needed
- `/vercel env` command
- Secrets configuration

## Instructions

### Environment Types

| Environment | When Used | Description |
|-------------|-----------|-------------|
| Production | `main` branch | Live site |
| Preview | Feature branches | Testing |
| Development | Local dev | `vercel dev` |

### Managing Env Variables

```bash
# Add environment variable
vercel env add VARIABLE_NAME

# Add to specific environment
vercel env add VARIABLE_NAME production
vercel env add VARIABLE_NAME preview
vercel env add VARIABLE_NAME development

# List environment variables
vercel env ls

# Remove environment variable
vercel env rm VARIABLE_NAME

# Pull env variables to local
vercel env pull .env.local
```

### Sensitive vs Plain Variables

```bash
# Sensitive (encrypted)
vercel env add DATABASE_URL
# Enter value when prompted (hidden)

# Plain text
vercel env add NEXT_PUBLIC_APP_NAME
# Value visible in Vercel dashboard
```

### Common Environment Variables

```markdown
## Required Variables

### Database
- DATABASE_URL: PostgreSQL connection string

### Authentication
- JWT_SECRET: Token signing secret
- JWT_EXPIRY: Token expiration time

### API
- API_URL: Backend API URL
- NEXT_PUBLIC_API_URL: Client-side API URL

### Third-Party
- SENDGRID_API_KEY: Email service
- STRIPE_SECRET_KEY: Payment processing
- SENTRY_DSN: Error tracking
```

### Environment Variable Naming

```markdown
## Naming Conventions

### Public (accessible in browser)
NEXT_PUBLIC_*
- NEXT_PUBLIC_API_URL
- NEXT_PUBLIC_APP_NAME
- NEXT_PUBLIC_GOOGLE_ANALYTICS

### Private (server-side only)
- DATABASE_URL
- JWT_SECRET
- API_KEYS
```

### Env File Structure

```bash
# .env.local (development)
DATABASE_URL=postgresql://localhost:5432/dev
JWT_SECRET=dev-secret
NEXT_PUBLIC_API_URL=http://localhost:3001

# .env.production (reference only, actual values in Vercel)
DATABASE_URL=
JWT_SECRET=
NEXT_PUBLIC_API_URL=
```

### Vercel Dashboard Setup

```markdown
## Setting Variables in Dashboard

1. Go to Project Settings
2. Click "Environment Variables"
3. Add variable:
   - Name: VARIABLE_NAME
   - Value: secret_value
   - Environments: ☑ Production ☑ Preview ☑ Development
4. Save

## Per-Branch Variables

For different values per branch:
1. Add variable for Production
2. Add same variable for Preview with different value
```

### Environment-Specific Config

```typescript
// next.config.js
module.exports = {
  env: {
    // Build-time variables
    CUSTOM_VAR: process.env.CUSTOM_VAR,
  },
  // Runtime configuration
  publicRuntimeConfig: {
    apiUrl: process.env.NEXT_PUBLIC_API_URL,
  },
  serverRuntimeConfig: {
    dbUrl: process.env.DATABASE_URL,
  },
};
```

### Using Environment Variables

```typescript
// Client-side (must be NEXT_PUBLIC_*)
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

// Server-side (any variable)
const dbUrl = process.env.DATABASE_URL;

// In API routes
export async function GET() {
  const secret = process.env.JWT_SECRET;
  // Use secret
}
```

### Sync Local with Vercel

```bash
# Pull all env variables
vercel env pull .env.local

# This creates .env.local with all variables
# DON'T commit this file!
```

### .gitignore

```gitignore
# Environment files
.env
.env.local
.env.development
.env.production
.env*.local
```

## Tools Used
- `Bash`: Run Vercel CLI commands

## Best Practices
- Never commit secrets
- Use NEXT_PUBLIC_ prefix for client vars
- Different values per environment
- Rotate secrets periodically
- Document required variables

# Logs Reader

## Description
Reads and monitors deployment and runtime logs for debugging and monitoring.

## Trigger
- Debugging deployment issues
- `/vercel logs` command
- Error investigation

## Instructions

### Accessing Logs

```bash
# View deployment logs
vercel logs <deployment-url>

# Real-time logs (streaming)
vercel logs <deployment-url> --follow

# Last N lines
vercel logs <deployment-url> --limit 100

# Filter by type
vercel logs <deployment-url> --source build
vercel logs <deployment-url> --source runtime

# Since timestamp
vercel logs <deployment-url> --since 1h
vercel logs <deployment-url> --since 2023-01-01
```

### Log Types

| Type | Description | When Used |
|------|-------------|-----------|
| Build | Build process output | Deployment issues |
| Runtime | Server-side execution | API errors |
| Edge | Edge function logs | Edge middleware |
| Static | Static asset serving | 404 errors |

### Build Logs

```markdown
## Build Log Output

```
[build] Installing dependencies...
[build] npm install
[build] added 500 packages in 30s
[build] Building Next.js...
[build] Creating optimized production build...
[build] Compiled successfully
[build] Build completed in 45s
```

## Common Build Errors
- Missing dependencies
- TypeScript errors
- Environment variable issues
- Memory limit exceeded
```

### Runtime Logs

```markdown
## Runtime Log Format

```
2024-01-15T10:30:00.000Z [info] GET /api/users 200 45ms
2024-01-15T10:30:01.000Z [error] POST /api/auth Error: Invalid token
2024-01-15T10:30:02.000Z [warn] Database connection slow
```

## Log Levels
- info: Normal operations
- warn: Potential issues
- error: Failures
```

### Vercel Dashboard Logs

```markdown
## Dashboard Navigation

1. Go to Project Dashboard
2. Click "Deployments"
3. Select specific deployment
4. View tabs:
   - Build Logs
   - Runtime Logs
   - Functions
   - Edge

## Filtering in Dashboard
- Filter by time range
- Search by keyword
- Filter by log level
- Filter by function name
```

### Function Logs

```typescript
// In API route - logs appear in runtime logs
export async function GET() {
  console.log('API called'); // Appears in logs
  console.error('Something wrong'); // Error level

  return Response.json({ data: 'test' });
}
```

### Error Monitoring Integration

```typescript
// Using Sentry with Vercel
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.VERCEL_ENV,
});

// Errors automatically sent to Sentry
```

### Log Analysis Commands

```bash
# Search logs for errors
vercel logs <url> | grep -i error

# Count error occurrences
vercel logs <url> | grep -c error

# Get unique errors
vercel logs <url> | grep error | sort | uniq

# Export logs to file
vercel logs <url> > deployment.log
```

### Debugging Common Issues

```markdown
## 500 Server Error
1. Check runtime logs for stack trace
2. Verify environment variables
3. Check database connection
4. Review recent code changes

## Build Failure
1. Check build logs for error
2. Verify dependencies
3. Check TypeScript errors
4. Review memory usage

## Slow Performance
1. Check function duration
2. Review cold starts
3. Analyze database queries
4. Check external API calls

## 404 Errors
1. Check routing configuration
2. Verify file exists
3. Check rewrites/redirects
4. Review Next.js config
```

### Log Retention

```markdown
## Vercel Log Retention

| Plan | Build Logs | Runtime Logs |
|------|------------|--------------|
| Hobby | 1 day | 1 hour |
| Pro | 7 days | 24 hours |
| Enterprise | 90 days | 7 days |

## Long-term Storage
For longer retention, stream logs to:
- DataDog
- LogDNA
- Papertrail
- Custom solution
```

### Monitoring Script

```typescript
// scripts/check-errors.ts
import { exec } from 'child_process';

const checkErrors = () => {
  exec(
    'vercel logs https://my-project.vercel.app --since 1h',
    (error, stdout) => {
      const errors = stdout.split('\n').filter(line =>
        line.includes('[error]')
      );

      if (errors.length > 0) {
        console.log(`Found ${errors.length} errors in last hour`);
        errors.forEach(e => console.log(e));
        // Send alert
      }
    }
  );
};

checkErrors();
```

## Tools Used
- `Bash`: Run Vercel CLI commands

## Best Practices
- Monitor logs regularly
- Set up error alerts
- Export logs for analysis
- Use structured logging
- Integrate error tracking

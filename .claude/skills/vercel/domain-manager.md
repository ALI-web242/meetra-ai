# Domain Manager

## Description
Configures and manages custom domains for Vercel deployments.

## Trigger
- Custom domain setup needed
- `/vercel domain` command
- DNS configuration

## Instructions

### Adding Custom Domain

```bash
# Add domain to project
vercel domains add example.com

# Add subdomain
vercel domains add app.example.com

# List domains
vercel domains ls

# Inspect domain
vercel domains inspect example.com

# Remove domain
vercel domains rm example.com
```

### Domain Verification

```markdown
## Verification Methods

### 1. Add DNS Records (Recommended)
Add these records at your DNS provider:

| Type | Name | Value |
|------|------|-------|
| A | @ | 76.76.21.21 |
| CNAME | www | cname.vercel-dns.com |

### 2. Nameserver Transfer
Point nameservers to Vercel:
- ns1.vercel-dns.com
- ns2.vercel-dns.com
```

### DNS Configuration

```markdown
## Common DNS Setups

### Apex Domain (example.com)
| Type | Name | Value |
|------|------|-------|
| A | @ | 76.76.21.21 |

### WWW Subdomain
| Type | Name | Value |
|------|------|-------|
| CNAME | www | cname.vercel-dns.com |

### Subdomain (app.example.com)
| Type | Name | Value |
|------|------|-------|
| CNAME | app | cname.vercel-dns.com |

### Wildcard (*.example.com)
| Type | Name | Value |
|------|------|-------|
| CNAME | * | cname.vercel-dns.com |
```

### SSL/TLS Certificates

```markdown
## Automatic SSL

Vercel automatically:
1. Issues SSL certificate on domain addition
2. Renews certificates before expiry
3. Enforces HTTPS

## Force HTTPS
All HTTP traffic automatically redirected to HTTPS
```

### Vercel.json Domain Config

```json
// vercel.json
{
  "regions": ["iad1"],
  "redirects": [
    {
      "source": "/old-page",
      "destination": "/new-page",
      "permanent": true
    }
  ],
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://api.example.com/:path*"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        }
      ]
    }
  ]
}
```

### Domain Aliasing

```bash
# Set production domain
vercel alias https://my-project-abc123.vercel.app example.com

# Alias specific deployment
vercel alias <deployment-url> custom.example.com
```

### Multi-Domain Setup

```bash
# Add multiple domains
vercel domains add example.com
vercel domains add www.example.com
vercel domains add app.example.com

# All point to same deployment
```

### Domain Troubleshooting

```markdown
## Common Issues

### Domain Not Verified
1. Check DNS records are correct
2. Wait for DNS propagation (up to 48 hours)
3. Use `dig example.com` to verify

### SSL Certificate Error
1. Ensure domain is verified
2. Wait for certificate issuance (~10 min)
3. Check domain is not CAA restricted

### Wrong Deployment
1. Check domain alias
2. Verify project assignment
```

### DNS Propagation Check

```bash
# Check DNS records
dig example.com A
dig www.example.com CNAME

# Check propagation globally
# Use: https://dnschecker.org
```

### Redirects

```json
// vercel.json
{
  "redirects": [
    // www to non-www
    {
      "source": "/:path((?!api).*)",
      "has": [{ "type": "host", "value": "www.example.com" }],
      "destination": "https://example.com/:path",
      "permanent": true
    },
    // Old path to new
    {
      "source": "/blog/:slug",
      "destination": "/articles/:slug",
      "permanent": true
    }
  ]
}
```

## Tools Used
- `Bash`: Run Vercel CLI commands

## Best Practices
- Use CNAME for subdomains
- Set up www redirect
- Verify SSL is active
- Monitor domain expiry
- Keep DNS records documented

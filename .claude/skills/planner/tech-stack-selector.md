# Tech Stack Selector

## Description
Recommends appropriate technologies based on project requirements, constraints, and best practices.

## Trigger
- Starting a new spec
- Architecture design phase
- `/plan tech` command

## Instructions

### Project Standard Stack

| Layer | Technology | Reason |
|-------|------------|--------|
| **Frontend** | Next.js 14 | App Router, SSR |
| **Styling** | Tailwind CSS | Utility-first |
| **State** | Zustand | Simple, performant |
| **Forms** | React Hook Form + Zod | Type-safe |
| **Backend** | NestJS | TypeScript, modular |
| **ORM** | TypeORM | PostgreSQL integration |
| **Database** | PostgreSQL | Relational, reliable |
| **Auth** | JWT + Passport | Industry standard |
| **Testing** | Jest + Playwright | Unit + E2E |
| **Deployment** | Vercel | Easy, integrated |

### Selection Matrix

#### Frontend
| Option | When to Use |
|--------|-------------|
| Next.js | Default, SSR needed |
| React SPA | Client-only |

#### State Management
| Option | When to Use |
|--------|-------------|
| Zustand | Default |
| React Query | Server state |

#### Database
| Option | When to Use |
|--------|-------------|
| PostgreSQL | Default |
| MongoDB | Document-based |
| Redis | Caching |

### Output Format
```markdown
## Tech Stack

| Category | Technology | Version |
|----------|------------|---------|
| Frontend | Next.js | 14.x |
| Backend | NestJS | 10.x |
| Database | PostgreSQL | 15.x |
```

## Tools Used
- `Read`: Read package.json
- `Write`: Document decisions
- `Bash`: Check packages

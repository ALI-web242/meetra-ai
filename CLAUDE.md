# Specify Framework - Claude Code Configuration

> This file configures Claude Code to use the Specify Framework's reusable skills.

## Project Overview

This is a full-stack application using:
- **Frontend**: Next.js 14 (App Router), Tailwind CSS, Zustand
- **Backend**: NestJS, TypeORM, PostgreSQL
- **Testing**: Jest, Playwright
- **Deployment**: Vercel, GitHub

## Skills Directory

All reusable skills are located in `.claude/skills/`. These skills contain instructions and patterns that should be followed when performing specific tasks.

**Skills Index**: `.claude/skills/index.md`

## Automatic Skill Selection

When working on tasks, automatically read and follow the relevant skills:

### Frontend Development
| Task | Skills to Read |
|------|----------------|
| Create page/component | `.claude/skills/frontend/nextjs-coder.md` |
| Create form | `.claude/skills/frontend/form-builder.md` |
| Create custom hook | `.claude/skills/frontend/react-hooks.md` |
| State management | `.claude/skills/frontend/state-management.md` |
| API integration | `.claude/skills/frontend/api-integration.md` |
| Styling | `.claude/skills/ui-ux/tailwind-styler.md` |
| Components | `.claude/skills/ui-ux/component-designer.md` |
| Responsive design | `.claude/skills/ui-ux/responsive-design.md` |
| Accessibility | `.claude/skills/ui-ux/accessibility-checker.md` |

### Backend Development
| Task | Skills to Read |
|------|----------------|
| Create module/controller | `.claude/skills/backend/nestjs-coder.md` |
| Database operations | `.claude/skills/backend/database-ops.md` |
| Authentication | `.claude/skills/backend/auth-implementer.md` |
| API endpoints | `.claude/skills/backend/api-builder.md` |
| Middleware/Guards | `.claude/skills/backend/middleware-creator.md` |

### API & Contracts
| Task | Skills to Read |
|------|----------------|
| OpenAPI spec | `.claude/skills/contracts/openapi-writer.md` |
| Database schema | `.claude/skills/contracts/schema-designer.md` |
| TypeScript types | `.claude/skills/contracts/type-generator.md` |
| Validation (Zod) | `.claude/skills/contracts/validation-rules.md` |

### Testing
| Task | Skills to Read |
|------|----------------|
| Unit tests | `.claude/skills/tester/unit-tester.md` |
| E2E tests | `.claude/skills/tester/e2e-tester.md` |
| API tests | `.claude/skills/tester/api-tester.md` |
| Contract validation | `.claude/skills/tester/contract-validator.md` |
| Coverage | `.claude/skills/tester/coverage-reporter.md` |

### Git & GitHub
| Task | Skills to Read |
|------|----------------|
| Create branch | `.claude/skills/github/branch-manager.md` |
| Commit changes | `.claude/skills/github/commit-creator.md` |
| Create PR | `.claude/skills/github/pr-creator.md` |
| Merge PR | `.claude/skills/github/merge-handler.md` |
| Resolve conflicts | `.claude/skills/github/conflict-resolver.md` |

### Deployment (Vercel)
| Task | Skills to Read |
|------|----------------|
| Deploy | `.claude/skills/vercel/deployer.md` |
| Environment vars | `.claude/skills/vercel/env-manager.md` |
| Preview deployment | `.claude/skills/vercel/preview-creator.md` |
| Custom domain | `.claude/skills/vercel/domain-manager.md` |
| View logs | `.claude/skills/vercel/logs-reader.md` |

### Planning & Specs
| Task | Skills to Read |
|------|----------------|
| Gather requirements | `.claude/skills/spec/requirement-gatherer.md` |
| Write spec | `.claude/skills/spec/spec-writer.md` |
| Architecture design | `.claude/skills/planner/architecture-designer.md` |
| Create milestones | `.claude/skills/planner/milestone-creator.md` |
| Task breakdown | `.claude/skills/tasks/task-breakdown.md` |

### Workflow & Orchestration
| Task | Skills to Read |
|------|----------------|
| Workflow management | `.claude/skills/orchestrator/workflow-manager.md` |
| State tracking | `.claude/skills/orchestrator/state-tracker.md` |
| Error handling | `.claude/skills/orchestrator/error-handler.md` |
| Context management | `.claude/skills/orchestrator/context-manager.md` |

## Project Structure

```
spec-project/
├── frontend/                 # Next.js frontend
│   ├── src/
│   │   ├── app/             # App Router pages
│   │   ├── components/      # React components
│   │   ├── hooks/           # Custom hooks
│   │   ├── services/        # API services
│   │   ├── stores/          # Zustand stores
│   │   └── types/           # TypeScript types
│   └── tests/               # Frontend tests
├── backend/                  # NestJS backend
│   ├── src/
│   │   ├── auth/            # Auth module
│   │   ├── user/            # User module
│   │   ├── database/        # Database config
│   │   └── common/          # Shared utilities
│   └── tests/               # Backend tests
├── e2e/                      # E2E tests (Playwright)
├── specs/                    # Spec documents
│   └── {spec-id}/
│       ├── spec.md
│       ├── plan.md
│       ├── tasks.md
│       └── contracts/
└── .claude/
    └── skills/              # Reusable skills (49 total)
```

## Conventions

### File Naming
- Components: `PascalCase.tsx` (e.g., `LoginForm.tsx`)
- Hooks: `useCamelCase.ts` (e.g., `useAuth.ts`)
- Services: `camelCase.ts` (e.g., `authService.ts`)
- Tests: `*.test.ts` or `*.spec.ts`

### Git Commits
Follow Conventional Commits:
```
feat: add login form
fix: correct validation
docs: update README
test: add unit tests
```

### Branch Naming
```
feature/{spec-id}-{description}
fix/{spec-id}-{description}
```

## Important Notes

1. **Always read relevant skills** before starting a task
2. **Follow patterns** defined in skills
3. **Use project conventions** consistently
4. **Test your code** before committing
5. **Write meaningful commits** following conventions

## Quick Commands

```bash
# Frontend
cd frontend && npm run dev

# Backend
cd backend && npm run start:dev

# Tests
npm run test
npm run test:e2e

# Deployment
vercel          # Preview
vercel --prod   # Production
```

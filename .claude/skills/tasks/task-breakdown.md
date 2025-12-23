# Task Breakdown

## Description
Breaks down milestones into granular, actionable tasks that can be completed in single coding sessions.

## Trigger
- Plan phase complete
- `/tasks breakdown` command
- Starting tasks phase

## Instructions

### Task Granularity

#### Good Task Size
- Completable in 1-2 hours
- Single responsibility
- Clear acceptance criteria
- Independently testable

#### Too Big
- "Implement authentication" → Break into smaller tasks
- "Build user dashboard" → Break into components

#### Too Small
- "Add import statement" → Combine with related work
- "Fix typo" → Part of larger task

### Task ID Format
```
{Category}-{Number}

Categories:
- BE: Backend
- FE: Frontend
- DB: Database
- UI: UI/UX
- TS: Testing
- DV: DevOps
```

### Task Template

```markdown
### {ID}: {Title}

**Description**: {What needs to be done}

**Acceptance Criteria**:
- [ ] {Criteria 1}
- [ ] {Criteria 2}

**Files**:
- `path/to/file.ts`

**Dependencies**: {Task IDs or None}

**Assigned To**: {Agent: frontend/backend/ui-ux/tester}
```

### Breaking Down by Feature

#### Authentication Feature
```markdown
### DB-001: Create User Entity
- Create User entity with TypeORM
- Define columns and relations
- Files: backend/src/user/entities/user.entity.ts

### DB-002: Create User Migration
- Generate migration
- Run migration
- Files: backend/src/database/migrations/

### BE-001: Create Auth Module
- Generate NestJS auth module
- Configure module imports
- Files: backend/src/auth/auth.module.ts

### BE-002: Implement Register Endpoint
- Create register DTO
- Implement register service
- Create controller endpoint
- Files: backend/src/auth/

### BE-003: Implement Login Endpoint
- Create login DTO
- Implement login service
- Generate JWT tokens
- Files: backend/src/auth/

### FE-001: Create LoginForm Component
- Build form UI
- Add validation
- Handle submission
- Files: frontend/src/components/auth/LoginForm.tsx

### FE-002: Create RegisterForm Component
- Build form UI
- Add validation
- Handle submission
- Files: frontend/src/components/auth/RegisterForm.tsx

### FE-003: Create Auth Pages
- Login page
- Register page
- Routing setup
- Files: frontend/src/app/login/, frontend/src/app/register/

### FE-004: Implement Auth State
- Create auth store
- Handle token storage
- Persist login state
- Files: frontend/src/stores/authStore.ts

### TS-001: Write Auth Unit Tests
- Test register service
- Test login service
- Test token generation
- Files: backend/src/auth/*.spec.ts

### TS-002: Write Auth E2E Tests
- Test registration flow
- Test login flow
- Files: e2e/auth.spec.ts
```

### Output Format

```markdown
# Tasks

## Summary
- Total Tasks: {N}
- Backend: {N}
- Frontend: {N}
- Database: {N}
- Testing: {N}

## Task List

| ID | Title | Status | Assigned | Dependencies |
|----|-------|--------|----------|--------------|
| DB-001 | Create User Entity | pending | backend | None |
| BE-001 | Create Auth Module | pending | backend | DB-001 |

## Detailed Tasks

### DB-001: Create User Entity
...
```

## Tools Used
- `Read`: Read plan and milestones
- `Write`: Create tasks.md

## Best Practices
- One task = one PR-able unit
- Clear dependencies
- Assign to correct agent
- Include file paths

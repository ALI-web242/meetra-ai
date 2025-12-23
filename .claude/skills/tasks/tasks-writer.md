# Tasks Writer

## Description
Creates formatted tasks.md files that combine task breakdown, dependencies, and priorities into a comprehensive task document.

## Trigger
- Task planning complete
- `/tasks write` command
- Completing tasks phase

## Instructions

### Task File Location
```
specs/{spec-id}/tasks.md
```

### Tasks Template

```markdown
# Tasks: {Spec Title}

> {One-line summary of tasks}

## Metadata
- **Spec ID**: {spec-id}
- **Created**: {date}
- **Total Tasks**: {N}
- **Status**: Not Started | In Progress | Complete

---

## Summary

| Category | Count | Status |
|----------|-------|--------|
| Database | {N} | {completed}/{total} |
| Backend | {N} | {completed}/{total} |
| Frontend | {N} | {completed}/{total} |
| UI/UX | {N} | {completed}/{total} |
| Testing | {N} | {completed}/{total} |
| **Total** | **{N}** | **{completed}/{total}** |

---

## Quick Reference

### Priority Legend
- 🔴 P0: Critical - Do first
- 🟠 P1: High - Core feature
- 🟡 P2: Medium - Important
- 🟢 P3: Low - Nice to have

### Status Legend
- ⬜ Pending
- 🔄 In Progress
- ✅ Complete
- ⏸️ Blocked

---

## Execution Order

| # | ID | Task | Priority | Status | Assigned |
|---|-----|------|----------|--------|----------|
| 1 | DB-001 | Create User Entity | 🔴 P0 | ⬜ | backend |
| 2 | BE-001 | Create Auth Module | 🔴 P0 | ⬜ | backend |
| 3 | BE-002 | Register Endpoint | 🟠 P1 | ⬜ | backend |

---

## Detailed Tasks

### Database Tasks

#### DB-001: Create User Entity 🔴
**Status**: ⬜ Pending

**Description**: Create the User entity with TypeORM decorators and proper column definitions.

**Acceptance Criteria**:
- [ ] User entity created with all required fields
- [ ] UUID primary key configured
- [ ] Timestamps (createdAt, updatedAt) added
- [ ] Unique constraint on email

**Files**:
- `backend/src/user/entities/user.entity.ts`

**Dependencies**: None

**Assigned To**: backend

---

### Backend Tasks

#### BE-001: Create Auth Module 🔴
**Status**: ⬜ Pending

**Description**: Generate and configure the NestJS authentication module.

**Acceptance Criteria**:
- [ ] Auth module generated
- [ ] JWT module configured
- [ ] Passport module configured
- [ ] Module exports configured

**Files**:
- `backend/src/auth/auth.module.ts`
- `backend/src/auth/auth.service.ts`
- `backend/src/auth/auth.controller.ts`

**Dependencies**: DB-001

**Assigned To**: backend

---

### Frontend Tasks

#### FE-001: Create LoginForm Component 🟠
**Status**: ⬜ Pending

**Description**: Build the login form component with validation.

**Acceptance Criteria**:
- [ ] Form UI matches design
- [ ] Email/password fields with validation
- [ ] Submit button with loading state
- [ ] Error message display

**Files**:
- `frontend/src/components/auth/LoginForm.tsx`

**Dependencies**: None

**Assigned To**: frontend

---

## Dependency Graph

```
DB-001
   │
   └──► BE-001
          │
          ├──► BE-002 ──► FE-004
          │
          └──► BE-003 ──► FE-004
                              │
FE-001 ──┐                    │
         ├──► FE-003 ─────────┴──► TS-002
FE-002 ──┘
```

---

## Progress Tracking

### Completed
- (none yet)

### In Progress
- (none yet)

### Blocked
- (none yet)

---

## Notes

- {Any important notes}
```

### Updating Task Status

When task status changes:
```markdown
#### BE-001: Create Auth Module 🔴
**Status**: ✅ Complete

**Completed**: {date}
**Notes**: {any implementation notes}
```

## Tools Used
- `Read`: Read tasks, plan
- `Write`: Create tasks.md
- `Edit`: Update task status

## Best Practices
- Update status immediately
- Add notes for future reference
- Track blockers
- Keep dependencies updated

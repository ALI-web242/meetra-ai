# Dependency Mapper

## Description
Identifies dependencies between tasks, determines execution order, and finds tasks that can run in parallel.

## Trigger
- After task breakdown
- `/tasks dependencies` command
- Task planning

## Instructions

### Dependency Types

| Type | Description | Example |
|------|-------------|---------|
| Hard | Must complete before | DB before API |
| Soft | Should complete before | Types before implementation |
| None | Can run in parallel | Different features |

### Common Dependencies

```
Database Entity → Backend Service → Backend Controller
                                         ↓
                              Frontend API Service
                                         ↓
                              Frontend Component
                                         ↓
                              Frontend Page
                                         ↓
                                    Tests
```

### Dependency Analysis

1. **Identify Hard Dependencies**
   - Code imports
   - API calls
   - Database relations

2. **Identify Soft Dependencies**
   - Type definitions
   - Design tokens
   - Documentation

3. **Find Parallel Opportunities**
   - Independent features
   - Different layers same feature
   - Tests for stable code

### Dependency Matrix

```markdown
## Dependency Matrix

| Task | Depends On | Blocks |
|------|------------|--------|
| DB-001 | - | BE-001, BE-002 |
| BE-001 | DB-001 | BE-002, BE-003 |
| BE-002 | BE-001 | FE-004 |
| FE-001 | - | FE-003 |
| FE-002 | - | FE-003 |
| FE-003 | FE-001, FE-002 | TS-002 |
```

### Parallel Groups

```markdown
## Parallel Execution Groups

### Group 1 (Can run together)
- DB-001: Create User Entity
- FE-001: Create LoginForm Component
- FE-002: Create RegisterForm Component

### Group 2 (After Group 1)
- BE-001: Create Auth Module
- FE-003: Create Auth Pages (partial)

### Group 3 (After Group 2)
- BE-002: Register Endpoint
- BE-003: Login Endpoint

### Group 4 (After Group 3)
- FE-004: Auth State
- TS-001: Backend Tests

### Group 5 (Final)
- TS-002: E2E Tests
```

### Critical Path

```markdown
## Critical Path

The longest chain of dependent tasks:

DB-001 → BE-001 → BE-002 → FE-004 → TS-002

Total tasks in critical path: 5
```

### Visualization

```
        ┌─────────┐
        │ DB-001  │
        └────┬────┘
             │
        ┌────▼────┐
        │ BE-001  │
        └────┬────┘
             │
     ┌───────┴───────┐
     │               │
┌────▼────┐    ┌────▼────┐
│ BE-002  │    │ BE-003  │
└────┬────┘    └────┬────┘
     │               │
     └───────┬───────┘
             │
        ┌────▼────┐
        │ FE-004  │
        └────┬────┘
             │
        ┌────▼────┐
        │ TS-002  │
        └─────────┘
```

## Tools Used
- `Read`: Read tasks list
- `Write`: Update tasks with dependencies

## Output Format
```markdown
## Task Dependencies

### Hard Dependencies
{Task} requires {Task} because {reason}

### Parallel Opportunities
These tasks can run simultaneously:
- Group A: [tasks]
- Group B: [tasks]

### Recommended Order
1. {tasks}
2. {tasks}
3. {tasks}
```

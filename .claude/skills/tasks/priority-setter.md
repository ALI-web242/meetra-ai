# Priority Setter

## Description
Assigns priorities to tasks based on dependencies, business value, and technical requirements.

## Trigger
- After dependency mapping
- `/tasks prioritize` command
- Task planning

## Instructions

### Priority Levels

| Priority | Label | Description |
|----------|-------|-------------|
| P0 | Critical | Blocks everything, do first |
| P1 | High | Core functionality |
| P2 | Medium | Important but not blocking |
| P3 | Low | Nice to have |

### Priority Criteria

#### P0 - Critical
- Foundation/infrastructure
- Blocks multiple tasks
- Required for MVP
- Security critical

#### P1 - High
- Core feature functionality
- User-facing features
- Direct business value

#### P2 - Medium
- Enhancement to core
- Error handling
- Edge cases

#### P3 - Low
- Polish/refinement
- Documentation
- Nice-to-have features

### Priority Assignment Algorithm

```
1. Mark all blocking tasks as P0
2. Mark core feature tasks as P1
3. Mark enhancement tasks as P2
4. Mark everything else as P3
5. Adjust based on business input
```

### Example Prioritization

```markdown
## Auth Feature Priorities

### P0 - Critical
- DB-001: User Entity (blocks all backend)
- BE-001: Auth Module (foundation)

### P1 - High
- BE-002: Register Endpoint
- BE-003: Login Endpoint
- FE-001: LoginForm
- FE-002: RegisterForm
- FE-003: Auth Pages

### P2 - Medium
- FE-004: Auth State (Zustand)
- BE-004: Refresh Token
- TS-001: Unit Tests

### P3 - Low
- TS-002: E2E Tests
- UI-001: Loading States
- UI-002: Error Animations
```

### Priority Matrix

```markdown
| Task | Business Value | Technical Need | Dependencies | Priority |
|------|---------------|----------------|--------------|----------|
| DB-001 | Low | High | None | P0 |
| BE-002 | High | High | DB-001 | P1 |
| FE-001 | High | Medium | None | P1 |
| TS-001 | Medium | Medium | BE-002 | P2 |
```

### Sorting Tasks

Final task order:
1. P0 tasks in dependency order
2. P1 tasks in dependency order
3. P2 tasks
4. P3 tasks

### Output Format

```markdown
## Prioritized Tasks

### Execution Order

| Order | ID | Title | Priority | Status |
|-------|-----|-------|----------|--------|
| 1 | DB-001 | User Entity | P0 | pending |
| 2 | BE-001 | Auth Module | P0 | pending |
| 3 | BE-002 | Register | P1 | pending |
| 4 | BE-003 | Login | P1 | pending |
| 5 | FE-001 | LoginForm | P1 | pending |

### By Priority

**P0 (2 tasks)**
- DB-001, BE-001

**P1 (5 tasks)**
- BE-002, BE-003, FE-001, FE-002, FE-003

**P2 (3 tasks)**
- FE-004, BE-004, TS-001

**P3 (2 tasks)**
- TS-002, UI-001
```

## Tools Used
- `Read`: Read tasks and dependencies
- `Write`: Update priorities
- `Edit`: Modify task priorities

## Best Practices
- Review with stakeholders
- Adjust for deadlines
- Consider resource availability
- Re-prioritize as needed

# Milestone Creator

## Description
Breaks down the implementation into logical, achievable milestones with clear deliverables and success criteria.

## Trigger
- Architecture design complete
- `/plan milestones` command
- Planning phase

## Instructions

### Milestone Design Principles

1. **Incremental Value**
   - Each milestone delivers working functionality
   - Can be demoed/tested independently

2. **Logical Grouping**
   - Related features together
   - Dependencies respected

3. **Manageable Size**
   - Not too big (overwhelming)
   - Not too small (overhead)

### Standard Milestone Structure

```markdown
## Milestone {N}: {Title}

**Goal**: {One sentence describing what this milestone achieves}

**Deliverables**:
- [ ] {Deliverable 1}
- [ ] {Deliverable 2}
- [ ] {Deliverable 3}

**Dependencies**:
- {Milestone X} (if any)

**Success Criteria**:
- {Criteria 1}
- {Criteria 2}

**Files to Create/Modify**:
- `path/to/file1.ts`
- `path/to/file2.ts`
```

### Common Milestone Patterns

#### For Authentication Feature
```markdown
## Milestone 1: Database Setup
- User entity
- Database migrations
- Connection configuration

## Milestone 2: Backend Auth API
- Register endpoint
- Login endpoint
- Token generation

## Milestone 3: Frontend Auth UI
- Login page
- Register page
- Form validation

## Milestone 4: Auth Integration
- Connect frontend to backend
- Token storage
- Protected routes

## Milestone 5: Testing & Polish
- Unit tests
- E2E tests
- Error handling
```

#### For CRUD Feature
```markdown
## Milestone 1: Database & Entity
- Entity definition
- Migrations
- Repository

## Milestone 2: Backend API
- CRUD endpoints
- Validation
- Error handling

## Milestone 3: Frontend UI
- List view
- Create/Edit forms
- Delete confirmation

## Milestone 4: Integration & Testing
- API integration
- Tests
- Polish
```

### Milestone Sequencing

```
┌─────────────┐
│  Database   │ (Foundation - always first)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Backend   │ (APIs before UI)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Frontend   │ (UI after APIs ready)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Integration │ (Connect everything)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Testing   │ (Verify it works)
└─────────────┘
```

### Milestone Sizing Guidelines

| Size | Tasks | Description |
|------|-------|-------------|
| Small | 3-5 | Single component/endpoint |
| Medium | 6-10 | Feature module |
| Large | 11-15 | Major feature |

Prefer Medium-sized milestones.

### Output Format

```markdown
# Implementation Milestones

## Overview
Total Milestones: {N}
Estimated Complexity: {Low/Medium/High}

## Dependency Graph
```
M1 ──► M2 ──► M3
              │
              ▼
         M4 ──► M5
```

## Milestones

### Milestone 1: {Title}
...

### Milestone 2: {Title}
...
```

## Tools Used
- `Read`: Read spec and architecture
- `Write`: Write milestones to plan.md
- `Edit`: Update milestone status

## Best Practices
- Start with infrastructure/setup
- Backend before frontend
- Core features before nice-to-have
- Always end with testing milestone
- Keep milestones independent when possible

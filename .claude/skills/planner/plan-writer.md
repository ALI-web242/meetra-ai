# Plan Writer

## Description
Creates formatted plan.md files that combine architecture decisions, milestones, and implementation strategy into a comprehensive planning document.

## Trigger
- Architecture and milestones ready
- `/plan write` command
- Completing planning phase

## Instructions

### Plan File Location
```
specs/{spec-id}/plan.md
```

### Plan Template Structure

```markdown
# Implementation Plan: {Spec Title}

> {One-line summary of the implementation approach}

## Metadata
- **Spec ID**: {spec-id}
- **Created**: {date}
- **Status**: Draft | Approved | In Progress | Complete

---

## 1. Overview

### 1.1 Summary
{Brief description of what will be implemented}

### 1.2 Approach
{High-level implementation strategy}

### 1.3 Tech Stack
| Layer | Technology | Version |
|-------|------------|---------|
| Frontend | Next.js | 14.x |
| Backend | NestJS | 10.x |
| Database | PostgreSQL | 15.x |
| Styling | Tailwind CSS | 3.x |

---

## 2. Architecture

### 2.1 System Diagram
```
{ASCII diagram of system architecture}
```

### 2.2 Component Structure

#### Frontend
```
frontend/src/
├── app/
│   ├── {feature}/
│   │   ├── page.tsx
│   │   └── layout.tsx
├── components/
│   └── {feature}/
├── hooks/
├── services/
└── stores/
```

#### Backend
```
backend/src/
├── {module}/
│   ├── {module}.module.ts
│   ├── {module}.controller.ts
│   ├── {module}.service.ts
│   ├── dto/
│   └── entities/
```

### 2.3 Database Schema
```
{Entity relationship diagram or table descriptions}
```

### 2.4 API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/... | ... |

---

## 3. Milestones

### Milestone 1: {Title}
**Goal**: {goal}

**Deliverables**:
- [ ] {deliverable}

**Success Criteria**:
- {criteria}

---

### Milestone 2: {Title}
...

---

## 4. Technical Decisions

### Decision 1: {Title}
- **Context**: {why needed}
- **Decision**: {what was decided}
- **Rationale**: {why this choice}

---

## 5. Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| {risk} | High/Med/Low | {mitigation} |

---

## 6. Dependencies

### External Dependencies
- {dependency 1}

### Internal Dependencies
- {spec dependency}

---

## 7. Testing Strategy

### Unit Tests
- {what to test}

### Integration Tests
- {what to test}

### E2E Tests
- {what to test}

---

## 8. Deployment Considerations

- {consideration 1}
- {consideration 2}
```

### Writing Guidelines

1. **Be Actionable**
   - Clear next steps
   - Specific file locations
   - Concrete deliverables

2. **Be Complete**
   - All sections filled
   - No TBDs in critical sections
   - Dependencies identified

3. **Be Realistic**
   - Achievable milestones
   - Known risks documented
   - Constraints acknowledged

### Validation Checklist
- [ ] Tech stack defined
- [ ] Architecture diagram included
- [ ] All milestones have deliverables
- [ ] All milestones have success criteria
- [ ] Dependencies mapped
- [ ] Risks identified

## Tools Used
- `Read`: Read spec.md and templates
- `Write`: Create plan.md
- `Edit`: Update existing plan

## Output Location
```
specs/{spec-id}/plan.md
```

## Best Practices
- Reference spec.md requirements by ID
- Include architecture diagrams
- Keep milestones measurable
- Document all technical decisions
- Plan for testing from the start

# Spec Writer

## Description
Creates formatted spec.md files following the project template, ensuring all required sections are complete and properly structured.

## Trigger
- Requirements gathering complete
- `/spec write` command
- `/spec create` command

## Instructions

### Spec File Location
```
specs/{spec-id}/spec.md
```

### Spec Template Structure

```markdown
# {Spec Title}

> {One-line description of what this spec covers}

## Metadata
- **Spec ID**: {spec-id}
- **Created**: {date}
- **Status**: Draft | Review | Approved | Implemented
- **Author**: {author}

---

## 1. Overview

### 1.1 Problem Statement
{What problem are we solving?}

### 1.2 Goals
{What are we trying to achieve?}

### 1.3 Non-Goals
{What are we explicitly NOT trying to achieve?}

---

## 2. Requirements

### 2.1 Functional Requirements

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| FR-001 | {requirement} | High | Draft |

### 2.2 Non-Functional Requirements

| ID | Requirement | Target | Status |
|----|-------------|--------|--------|
| NFR-001 | {requirement} | {target} | Draft |

---

## 3. User Stories

### US-001: {Title}
**As a** {role}
**I want to** {action}
**So that** {benefit}

**Acceptance Criteria**:
- [ ] {criteria 1}
- [ ] {criteria 2}

---

## 4. Technical Considerations

### 4.1 Constraints
- {constraint 1}
- {constraint 2}

### 4.2 Dependencies
- {dependency 1}
- {dependency 2}

### 4.3 Assumptions
- {assumption 1}
- {assumption 2}

---

## 5. Success Criteria

How do we know this spec is successfully implemented?

- [ ] {criteria 1}
- [ ] {criteria 2}
- [ ] {criteria 3}

---

## 6. Out of Scope

The following items are explicitly out of scope for this spec:

- {item 1}
- {item 2}

---

## 7. Open Questions

| # | Question | Answer | Status |
|---|----------|--------|--------|
| 1 | {question} | {answer or TBD} | Open |

---

## 8. References

- {reference 1}
- {reference 2}
```

### Writing Guidelines

1. **Be Specific**
   - Avoid vague terms like "fast", "easy", "simple"
   - Use measurable criteria

2. **Be Complete**
   - Fill all sections, use "N/A" if not applicable
   - Don't leave sections empty

3. **Be Consistent**
   - Use same terminology throughout
   - Reference requirements by ID

4. **Be Concise**
   - One requirement per row
   - Clear, actionable language

### Validation Checklist
Before completing spec:
- [ ] All required sections present
- [ ] All requirements have IDs
- [ ] All requirements have priorities
- [ ] Success criteria defined
- [ ] Out of scope clearly stated
- [ ] No open questions blocking progress

## Tools Used
- `Read`: Read template file
- `Write`: Create spec.md
- `Edit`: Update existing spec

## Best Practices
- Always use the template from `.specify/templates/spec-template.md`
- Generate unique spec IDs incrementally
- Link related specs in References section
- Keep specs focused on one feature/area

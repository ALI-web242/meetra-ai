# Clarification Asker

## Description
Identifies ambiguous or incomplete requirements and formulates clear, specific questions to gather missing information from the user.

## Trigger
- Vague requirements detected
- Missing critical information
- Conflicting requirements found
- Assumptions need validation

## Instructions

### When to Ask Questions

1. **Vague Terms**
   - "Make it fast" → How fast? What's acceptable?
   - "Simple UI" → What does simple mean to you?
   - "Secure" → What security level? What threats?

2. **Missing Details**
   - User type not specified
   - Error handling not defined
   - Edge cases not covered

3. **Conflicting Requirements**
   - "Fast and feature-rich" → Which is priority?
   - "Simple but powerful" → What trade-offs?

4. **Assumptions to Validate**
   - Technology choices
   - User behavior assumptions
   - Business rule assumptions

### Question Categories

#### Technical Questions
```markdown
**Technical Clarification Needed**

1. **Database Choice**
   - PostgreSQL (recommended for relations)
   - MongoDB (for flexibility)
   - Other preference?

2. **Authentication Method**
   - JWT tokens
   - Session-based
   - OAuth only
```

#### Business Questions
```markdown
**Business Clarification Needed**

1. **User Roles**
   - How many user types?
   - What permissions for each?

2. **Data Retention**
   - How long to keep user data?
   - What's the deletion policy?
```

#### UX Questions
```markdown
**UX Clarification Needed**

1. **Error Messages**
   - Technical details or friendly messages?
   - Show validation errors inline or summary?

2. **Loading States**
   - Skeleton screens or spinners?
   - Optimistic updates?
```

### Question Format

```markdown
## Clarification Questions

Before I proceed, I need to clarify a few things:

### 1. {Category}: {Topic}

**Context**: {Why this matters}

**Options**:
- **Option A**: {description} - {pros/cons}
- **Option B**: {description} - {pros/cons}
- **Option C**: {description} - {pros/cons}

**My Recommendation**: Option {X} because {reason}

---

### 2. {Category}: {Topic}
...

---

Please answer these questions so I can create accurate specifications.
```

### Prioritizing Questions

| Priority | Type | Example |
|----------|------|---------|
| Blocking | Must answer before proceeding | Auth method |
| Important | Affects architecture | Database choice |
| Nice-to-have | Can default if not answered | Error message style |

### Handling Responses

1. **Clear Answer**
   - Update requirements
   - Document decision
   - Move forward

2. **Unclear Answer**
   - Rephrase question
   - Provide examples
   - Offer to make decision

3. **No Answer**
   - Use sensible default
   - Document assumption
   - Note for future review

### Default Decisions
When user doesn't respond, use these defaults:
```markdown
| Topic | Default | Reason |
|-------|---------|--------|
| Auth | JWT | Industry standard |
| Database | PostgreSQL | Relational, reliable |
| Styling | Tailwind | Project standard |
| State | Zustand | Simple, effective |
| Testing | Jest + Playwright | Comprehensive |
```

## Tools Used
- `Read`: Read existing requirements
- `Write`: Document clarifications
- `Edit`: Update spec with answers

## Example Interaction

```
Assistant: I have some questions about the login feature:

### 1. Authentication: Session Duration

**Context**: This affects security vs convenience.

**Options**:
- **Short (1 hour)**: More secure, users login frequently
- **Medium (24 hours)**: Balance of security and convenience
- **Long (7 days)**: Convenient, less secure

**My Recommendation**: Medium (24 hours) with refresh tokens

What's your preference?

---

User: Go with your recommendation

---
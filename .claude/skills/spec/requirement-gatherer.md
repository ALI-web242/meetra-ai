# Requirement Gatherer

## Description
Extracts and structures requirements from user input, categorizing them into functional, non-functional, assumptions, and out-of-scope items.

## Trigger
- User describes what they want to build
- User provides feature description
- `/spec gather` command
- Starting a new spec

## Instructions

### Gathering Process

1. **Listen to User Input**
   - Let user describe their requirements
   - Don't interrupt with questions immediately
   - Note down key points

2. **Analyze Input**
   - Identify explicit requirements (what user said)
   - Identify implicit requirements (what user assumed)
   - Identify gaps (what user didn't mention but is needed)

3. **Categorize Requirements**

#### Functional Requirements (FR)
What the system should DO:
```markdown
- FR-001: User can register with email and password
- FR-002: User can login with credentials
- FR-003: User can reset password via email
```

#### Non-Functional Requirements (NFR)
How the system should PERFORM:
```markdown
- NFR-001: Page load time < 3 seconds
- NFR-002: Support 1000 concurrent users
- NFR-003: 99.9% uptime
```

#### Assumptions
Things assumed but not explicitly stated:
```markdown
- Users have valid email addresses
- Modern browser support only (Chrome, Firefox, Safari, Edge)
- English language only for MVP
```

#### Out of Scope
Explicitly excluded:
```markdown
- Mobile app (web only for now)
- Multi-language support
- Admin dashboard
```

### Requirement Format
```markdown
### FR-{number}: {Title}

**Description**: {Detailed description}

**User Story**: As a {role}, I want to {action}, so that {benefit}

**Acceptance Criteria**:
- [ ] Criteria 1
- [ ] Criteria 2
- [ ] Criteria 3

**Priority**: High | Medium | Low

**Dependencies**: {List any dependencies}
```

### Clarifying Questions
Ask questions for:
- Vague terms: "What do you mean by 'simple authentication'?"
- Missing details: "Should users be able to login with social accounts?"
- Conflicting requirements: "You mentioned X and Y, which takes priority?"
- Edge cases: "What happens if user enters invalid email?"

### Question Format
```markdown
I have a few questions to clarify the requirements:

1. **Authentication Method**
   - Email/password only?
   - Social login (Google, GitHub)?
   - Magic link?

2. **User Roles**
   - Single user type?
   - Admin and regular users?
   - Custom roles?

Please answer these so I can create accurate requirements.
```

## Output Format
```markdown
# Requirements Summary

## Functional Requirements
| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| FR-001 | User registration | High | Draft |
| FR-002 | User login | High | Draft |

## Non-Functional Requirements
| ID | Requirement | Target |
|----|-------------|--------|
| NFR-001 | Response time | < 200ms |

## Assumptions
- Assumption 1
- Assumption 2

## Out of Scope
- Item 1
- Item 2

## Open Questions
- [ ] Question 1
- [ ] Question 2
```

## Tools Used
- `Read`: Read existing specs for context
- `Write`: Write requirements to spec.md
- `Glob`: Find related specs

## Example Usage
```
User: I need a login system for my app
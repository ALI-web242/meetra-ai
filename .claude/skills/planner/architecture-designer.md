# Architecture Designer

## Description
Designs the system architecture based on requirements, defining components, their interactions, and the overall structure of the solution.

## Trigger
- Spec phase complete
- `/plan architecture` command
- Starting planning phase

## Instructions

### Architecture Design Process

1. **Analyze Requirements**
   - Read spec.md thoroughly
   - Identify key components needed
   - Note constraints and dependencies

2. **Define Components**
   - Frontend components
   - Backend services
   - Database schemas
   - External integrations

3. **Design Interactions**
   - API contracts
   - Data flow
   - Event handling
   - Error propagation

### Architecture Document Structure

```markdown
# Architecture Design

## System Overview

```
┌─────────────────────────────────────────────────────────┐
│                      FRONTEND                           │
│                    (Next.js 14)                         │
├─────────────────────────────────────────────────────────┤
│  Pages    │  Components  │  Hooks    │  Services       │
└─────────────────────────────────────────────────────────┘
                          │
                          │ REST API
                          ▼
┌─────────────────────────────────────────────────────────┐
│                      BACKEND                            │
│                     (NestJS)                            │
├─────────────────────────────────────────────────────────┤
│  Controllers │  Services  │  Guards   │  Entities      │
└─────────────────────────────────────────────────────────┘
                          │
                          │ TypeORM
                          ▼
┌─────────────────────────────────────────────────────────┐
│                     DATABASE                            │
│                   (PostgreSQL)                          │
└─────────────────────────────────────────────────────────┘
```

## Component Breakdown

### Frontend Components
| Component | Responsibility | Location |
|-----------|---------------|----------|
| LoginForm | User authentication UI | `frontend/src/components/auth/` |
| AuthProvider | Auth state management | `frontend/src/providers/` |

### Backend Modules
| Module | Responsibility | Location |
|--------|---------------|----------|
| AuthModule | Authentication logic | `backend/src/auth/` |
| UserModule | User management | `backend/src/user/` |

### Database Entities
| Entity | Table | Relations |
|--------|-------|-----------|
| User | users | has many Sessions |
| Session | sessions | belongs to User |

## Data Flow

### Authentication Flow
```
1. User submits credentials
2. Frontend calls POST /api/auth/login
3. Backend validates credentials
4. Backend creates JWT token
5. Frontend stores token
6. Frontend redirects to dashboard
```

## API Endpoints Summary
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | /api/auth/register | User registration |
| POST | /api/auth/login | User login |
| POST | /api/auth/logout | User logout |

## Security Considerations
- Password hashing with bcrypt
- JWT with short expiry + refresh tokens
- CORS configuration
- Rate limiting on auth endpoints
```

### Architectural Patterns

#### For Authentication Features
```
- JWT-based authentication
- Refresh token rotation
- HTTP-only cookies for tokens
- Role-based access control (RBAC)
```

#### For CRUD Features
```
- Repository pattern
- DTO validation
- Pagination support
- Soft deletes
```

#### For Real-time Features
```
- WebSocket connections
- Event-driven updates
- Connection management
```

### Technology Decisions Format
```markdown
## Decision: {Title}

**Context**: {Why this decision is needed}

**Options Considered**:
1. {Option 1} - {pros/cons}
2. {Option 2} - {pros/cons}

**Decision**: {Chosen option}

**Rationale**: {Why this option was chosen}

**Consequences**: {What this means for the project}
```

## Tools Used
- `Read`: Read spec.md
- `Write`: Write architecture docs
- `Glob`: Find existing architecture patterns

## Output Location
```
specs/{spec-id}/plan.md  (Architecture section)
```

## Best Practices
- Keep diagrams simple and clear
- Document all major decisions
- Consider scalability from start
- Plan for error scenarios
- Design for testability

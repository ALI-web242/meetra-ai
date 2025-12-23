# Context Manager

## Description
Manages shared context between different phases and skills, ensuring data consistency and providing relevant information to each phase.

## Trigger
- Phase transition
- Skill invocation
- User requests context info
- Context update needed

## Instructions

### Context Structure
```typescript
interface SharedContext {
  // Project Info
  project: {
    name: string;
    rootPath: string;
    techStack: TechStack;
  };

  // Current Spec Info
  spec: {
    id: string;
    name: string;
    path: string;
    requirements: Requirement[];
  };

  // Phase Artifacts
  artifacts: {
    specFile: string;
    planFile: string;
    tasksFile: string;
    contracts: string[];
    implementations: string[];
    tests: string[];
  };

  // Runtime Info
  runtime: {
    currentPhase: Phase;
    currentTask: Task | null;
    errors: Error[];
  };
}
```

### Context Operations

#### Read Context
1. Load context from `specs/{spec-id}/.context.json`
2. Merge with project-level context from `.specify/context.json`
3. Return combined context

#### Write Context
1. Validate new context values
2. Merge with existing context (don't overwrite unless explicit)
3. Update timestamp
4. Write to context file

#### Build Context for Phase
Each phase needs specific context:

| Phase | Required Context |
|-------|------------------|
| spec | project info, existing specs |
| planner | spec requirements, tech stack |
| contracts | plan, requirements |
| tasks | plan, contracts |
| frontend | tasks, contracts, design system |
| backend | tasks, contracts, db schemas |
| testing | implementations, contracts |
| deployment | all artifacts |

### Context File Location
```
.specify/
└── context.json          # Project-level context

specs/{spec-id}/
└── .context.json         # Spec-level context
```

### Project Context Template
```json
{
  "project": {
    "name": "my-project",
    "rootPath": "/home/user/my-project",
    "techStack": {
      "frontend": "nextjs",
      "backend": "nestjs",
      "database": "postgresql",
      "styling": "tailwind"
    }
  },
  "conventions": {
    "naming": "kebab-case",
    "components": "PascalCase",
    "files": "kebab-case"
  },
  "paths": {
    "frontend": "frontend/",
    "backend": "backend/",
    "specs": "specs/",
    "e2e": "e2e/"
  }
}
```

### Spec Context Template
```json
{
  "specId": "001-auth-user-access",
  "specName": "User Authentication & Access",
  "createdAt": "2024-01-01T00:00:00Z",
  "artifacts": {
    "specFile": "specs/001-auth-user-access/spec.md",
    "planFile": "specs/001-auth-user-access/plan.md",
    "tasksFile": "specs/001-auth-user-access/tasks.md",
    "contracts": [
      "specs/001-auth-user-access/contracts/auth.yaml"
    ]
  },
  "dependencies": [],
  "relatedSpecs": []
}
```

### Context Retrieval for Skills
When a skill is invoked, provide relevant context:

```markdown
## Current Context

**Spec**: 001-auth-user-access
**Phase**: implementation
**Current Task**: FE-001 - Create LoginForm component

**Relevant Files**:
- Contract: specs/001-auth-user-access/contracts/auth.yaml
- Plan: specs/001-auth-user-access/plan.md

**Tech Stack**:
- Frontend: Next.js 14 with App Router
- Styling: Tailwind CSS
- State: Zustand
```

## Tools Used
- `Read`: Read context files
- `Write`: Write context files
- `Edit`: Update specific context values
- `Glob`: Find related files for context

## Example Usage
```
[Internal] Building context for frontend skill...
- Loading project context
- Loading spec context
- Finding relevant contracts
- Building task context
- Context ready
```

## Best Practices
- Keep context files small and focused
- Don't duplicate data that exists in other files
- Reference files instead of embedding content
- Update context after each phase completion
- Clean up stale context references

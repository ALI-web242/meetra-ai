# State Tracker

## Description
Tracks and maintains the current state of workflow execution, including phase progress, completed tasks, and any errors encountered.

## Trigger
- Any phase transition
- Task completion
- Error occurrence
- User requests status: `/spec status`

## Instructions

### State Operations

#### Get Current State
1. Read `specs/{spec-id}/.state.json`
2. Return formatted status to user
3. Include:
   - Current phase
   - Completed phases
   - Pending phases
   - Any errors

#### Update State
1. Read current state
2. Validate new state values
3. Update `updatedAt` timestamp
4. Write back to state file
5. Log change in history

#### Reset State
1. Confirm with user before reset
2. Archive current state to `.state.backup.json`
3. Create fresh state file
4. Set phase to `spec`

### State Schema
```typescript
interface WorkflowState {
  specId: string;
  specName: string;
  currentPhase: Phase;
  completedPhases: Phase[];
  skippedPhases: Phase[];
  startedAt: string;
  updatedAt: string;
  errors: StateError[];
  history: StateChange[];
  artifacts: Artifact[];
}

interface StateError {
  phase: Phase;
  message: string;
  timestamp: string;
  resolved: boolean;
}

interface StateChange {
  from: Phase;
  to: Phase;
  timestamp: string;
  reason: string;
}

interface Artifact {
  type: 'file' | 'url' | 'reference';
  path: string;
  phase: Phase;
  createdAt: string;
}
```

### Status Display Format
```
## Spec Status: {spec-id}

**Current Phase**: {phase}
**Started**: {date}
**Last Updated**: {date}

### Progress
- [x] Spec
- [x] Planning
- [ ] Contracts  <-- Current
- [ ] Tasks
- [ ] Implementation
- [ ] Testing
- [ ] Deployment

### Artifacts Created
- specs/001-auth/spec.md
- specs/001-auth/plan.md

### Errors
None
```

## Tools Used
- `Read`: Read state file
- `Write`: Write state file
- `Edit`: Update specific state values

## Example Usage
```
User: /spec status
Assistant: [Reads state, displays formatted status]

User: /spec status 001-auth-user-access
Assistant: [Reads specific spec state, displays status]
```

## Best Practices
- Always update `updatedAt` on any change
- Keep history limited to last 50 entries
- Archive old states instead of deleting
- Validate state before writing

# Workflow Manager

## Description
Controls the execution sequence of the Specify framework phases and manages workflow transitions between different stages.

## Trigger
- User starts a new spec: `/spec start`
- User continues workflow: `/spec continue`
- User requests phase skip: `/spec skip [phase]`
- User aborts workflow: `/spec abort`

## Instructions

### Phase Sequence
```
spec → planner → contracts → tasks → implementation → testing → deployment
```

### When Starting a New Workflow
1. Check if `specs/` directory exists, create if not
2. Generate new spec ID using format: `{number}-{kebab-case-name}`
3. Create spec folder structure:
   ```
   specs/{spec-id}/
   ├── spec.md
   ├── plan.md
   ├── tasks.md
   ├── contracts/
   └── quickstart.md
   ```
4. Initialize workflow state file at `specs/{spec-id}/.state.json`
5. Set current phase to `spec`

### When Continuing Workflow
1. Read `.state.json` to get current phase
2. Verify previous phase is complete (check for required files)
3. Transition to next phase
4. Update `.state.json`

### When Skipping a Phase
1. Validate skip is allowed (some phases are mandatory)
2. Log skip reason in `.state.json`
3. Move to next phase

### Phase Completion Criteria
| Phase | Complete When |
|-------|---------------|
| spec | `spec.md` exists and has all sections |
| planner | `plan.md` exists with milestones |
| contracts | At least one `.yaml` in `contracts/` |
| tasks | `tasks.md` exists with task list |
| implementation | All tasks marked complete |
| testing | All tests pass |
| deployment | Deployment URL available |

## State File Format
```json
{
  "specId": "001-auth-user-access",
  "currentPhase": "planner",
  "completedPhases": ["spec"],
  "startedAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z",
  "skippedPhases": [],
  "errors": []
}
```

## Tools Used
- `Read`: Read state files and check phase completion
- `Write`: Create/update state files
- `Glob`: Find spec folders and files
- `Bash`: Create directory structures

## Example Usage
```
User: /spec start auth-user-access
Assistant: [Creates spec folder, initializes state, starts spec phase]

User: /spec continue
Assistant: [Reads state, moves to next phase]
```

## Error Handling
- If phase files are missing, prompt user to complete current phase
- If state file is corrupted, offer to reset workflow
- Log all errors in state file for debugging

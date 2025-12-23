# Error Handler

## Description
Handles errors from any phase of the workflow, determines appropriate recovery strategy, and manages error logging and resolution.

## Trigger
- Any tool execution fails
- Phase validation fails
- User reports an issue
- Test failures occur

## Instructions

### Error Classification

| Error Type | Severity | Action |
|------------|----------|--------|
| `ValidationError` | Low | Ask user for clarification |
| `FileNotFound` | Medium | Create missing file or ask user |
| `DependencyError` | Medium | Wait/resolve dependency first |
| `TestFailure` | Medium | Show failures, suggest fixes |
| `BuildError` | High | Stop, show error, suggest fix |
| `FatalError` | Critical | Abort workflow, notify user |

### Error Handling Flow
```
Error Detected
     │
     ▼
┌─────────────┐
│  Classify   │
│   Error     │
└─────────────┘
     │
     ▼
┌─────────────┐     ┌─────────────┐
│  Can Auto   │─Yes─▶│  Auto Fix   │
│   Fix?      │     │             │
└─────────────┘     └─────────────┘
     │ No                  │
     ▼                     │
┌─────────────┐            │
│  Log Error  │            │
│  Ask User   │◀───────────┘
└─────────────┘
```

### Auto-Fixable Errors
1. **Missing directory**: Create it
2. **Missing template**: Copy from `.specify/templates/`
3. **Invalid JSON**: Try to parse and fix common issues
4. **Missing dependency in code**: Suggest npm install

### Errors Requiring User Input
1. **Ambiguous requirements**: Ask for clarification
2. **Conflicting instructions**: Ask for priority
3. **Missing credentials**: Ask user to provide
4. **Design decisions**: Present options

### Error Logging Format
```json
{
  "id": "err-001",
  "type": "ValidationError",
  "severity": "low",
  "phase": "spec",
  "message": "Missing required section: Success Criteria",
  "context": {
    "file": "specs/001-auth/spec.md",
    "line": null
  },
  "timestamp": "2024-01-01T00:00:00Z",
  "resolved": false,
  "resolution": null
}
```

### Recovery Strategies

#### Retry Strategy
```
Attempt 1: Immediate retry
Attempt 2: Wait 1 second, retry
Attempt 3: Wait 5 seconds, retry
Attempt 4: Fail, ask user
```

#### Rollback Strategy
- For file operations: Keep `.backup` files
- For state changes: Use state history
- For code changes: Use git to revert

### User Communication
When reporting errors:
1. Explain what went wrong (simple language)
2. Explain why it happened (if known)
3. Provide options to fix
4. Recommend best option

## Tools Used
- `Read`: Read error logs, state files
- `Write`: Write error logs
- `Edit`: Update state with error info
- `Bash`: Run recovery commands

## Example Usage
```
Error: spec.md missing "Success Criteria" section

Assistant Response:
"I noticed the spec.md is missing the 'Success Criteria' section.
This section is required to proceed.

Options:
1. I can add a template section for you to fill
2. Tell me the success criteria and I'll add them
3. Skip this validation (not recommended)

What would you like to do?"
```

## Best Practices
- Always log errors before attempting fix
- Never silently swallow errors
- Provide actionable error messages
- Keep error history for debugging

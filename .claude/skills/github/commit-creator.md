# Commit Creator

## Description
Creates semantic commits following Conventional Commits specification for clear history.

## Trigger
- Code changes ready to commit
- `/git commit` command
- Saving work

## Instructions

### Conventional Commits Format

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Commit Types

| Type | Description | Example |
|------|-------------|---------|
| `feat` | New feature | feat: add login form |
| `fix` | Bug fix | fix: correct password validation |
| `docs` | Documentation | docs: update README |
| `style` | Formatting (no code change) | style: format with prettier |
| `refactor` | Code restructure | refactor: extract auth logic |
| `test` | Adding tests | test: add login unit tests |
| `chore` | Maintenance | chore: update dependencies |
| `perf` | Performance | perf: optimize database query |
| `ci` | CI/CD changes | ci: add GitHub Actions |
| `build` | Build system | build: configure webpack |
| `revert` | Revert commit | revert: undo login changes |

### Scope (Optional)

```
feat(auth): add login form
fix(api): correct user endpoint
test(frontend): add component tests
```

### Commit Message Examples

#### Simple Feature
```
feat: add user registration form
```

#### Feature with Scope
```
feat(auth): implement JWT authentication
```

#### Feature with Body
```
feat(auth): add password reset functionality

Users can now reset their password via email.
- Send reset email with token
- Validate token expiry
- Update password securely
```

#### Breaking Change
```
feat(api)!: change authentication response format

BREAKING CHANGE: The login response now returns
`accessToken` instead of `token`.
```

#### Bug Fix with Issue Reference
```
fix(auth): correct session timeout handling

Fixes #123
```

### Commit Workflow

```bash
# Check what's changed
git status
git diff

# Stage changes
git add .                    # All changes
git add src/auth/            # Specific directory
git add src/auth/login.ts    # Specific file

# Commit with message
git commit -m "feat(auth): add login form validation"

# Commit with body (opens editor)
git commit

# Amend last commit (before push)
git commit --amend
```

### Multi-line Commit (HEREDOC)

```bash
git commit -m "$(cat <<'EOF'
feat(auth): implement user authentication

- Add login form with validation
- Implement JWT token handling
- Add auth state management
- Create protected route wrapper

Closes #45
EOF
)"
```

### Best Practices Checklist

```markdown
## Before Committing

- [ ] Code compiles/builds
- [ ] Tests pass
- [ ] Linting passes
- [ ] Changes are related (one logical change)
- [ ] No debugging code left
- [ ] No sensitive data included

## Commit Message

- [ ] Type is correct
- [ ] Description is clear
- [ ] Present tense ("add" not "added")
- [ ] First letter lowercase
- [ ] No period at end
- [ ] Under 72 characters (first line)
```

### Commit Patterns by Task

```markdown
## Starting a Feature
feat(module): add initial structure

## Implementing Logic
feat(module): implement core functionality

## Adding Tests
test(module): add unit tests

## Fixing Bug Found
fix(module): correct validation logic

## Code Cleanup
refactor(module): extract helper functions

## Final Polish
style(module): format code
docs(module): add JSDoc comments
```

### Undoing Commits

```bash
# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1

# Create revert commit
git revert HEAD
```

## Tools Used
- `Bash`: Run git commands

## Best Practices
- Commit early, commit often
- One logical change per commit
- Write meaningful messages
- Reference issues when relevant
- Never commit secrets

# Branch Manager

## Description
Creates and manages Git branches following naming conventions and branch strategies.

## Trigger
- New feature/task starting
- `/git branch` command
- Branch operations needed

## Instructions

### Branch Naming Convention

```
{type}/{spec-id}-{short-description}

Types:
- feature/  → New features
- fix/      → Bug fixes
- refactor/ → Code refactoring
- docs/     → Documentation
- test/     → Test additions
- chore/    → Maintenance tasks
```

### Examples
```
feature/001-auth-login-form
fix/001-auth-password-validation
refactor/001-auth-cleanup
test/001-auth-e2e-tests
```

### Branch Operations

#### Create New Branch
```bash
# From main/master
git checkout main
git pull origin main
git checkout -b feature/001-auth-login-form

# From specific branch
git checkout -b feature/001-auth-api origin/main
```

#### Switch Branch
```bash
git checkout feature/001-auth-login-form

# With uncommitted changes
git stash
git checkout feature/001-auth-login-form
git stash pop
```

#### List Branches
```bash
# Local branches
git branch

# Remote branches
git branch -r

# All branches
git branch -a

# With last commit info
git branch -v
```

#### Delete Branch
```bash
# Local branch (safe)
git branch -d feature/001-auth-login-form

# Local branch (force)
git branch -D feature/001-auth-login-form

# Remote branch
git push origin --delete feature/001-auth-login-form
```

#### Rename Branch
```bash
# Current branch
git branch -m new-name

# Other branch
git branch -m old-name new-name
```

### Branch Strategy

```
main (production)
  │
  └── develop (staging)
        │
        ├── feature/001-auth-login
        ├── feature/001-auth-register
        └── feature/002-dashboard
```

### Workflow

1. **Start Feature**
   ```bash
   git checkout main
   git pull origin main
   git checkout -b feature/{spec-id}-{description}
   ```

2. **Work on Feature**
   ```bash
   # Make changes
   git add .
   git commit -m "feat: description"
   ```

3. **Keep Updated**
   ```bash
   git fetch origin
   git rebase origin/main
   ```

4. **Push Branch**
   ```bash
   git push -u origin feature/{spec-id}-{description}
   ```

5. **After Merge**
   ```bash
   git checkout main
   git pull origin main
   git branch -d feature/{spec-id}-{description}
   ```

### Common Scenarios

#### Feature Branch from Task
```markdown
Task: FE-001 Create LoginForm
Branch: feature/001-auth-login-form
```

#### Hotfix Branch
```bash
git checkout main
git checkout -b fix/critical-auth-bug
# Fix, test, PR, merge
```

#### Update Feature with Main
```bash
git checkout feature/001-auth-login
git fetch origin
git rebase origin/main
# Resolve conflicts if any
git push --force-with-lease
```

### Branch Protection (GitHub)

```markdown
## Recommended Settings for `main`

- [x] Require pull request before merging
- [x] Require approvals (1+)
- [x] Dismiss stale PR approvals
- [x] Require status checks to pass
- [x] Require branches to be up to date
- [x] Include administrators
```

## Tools Used
- `Bash`: Run git commands

## Best Practices
- One branch per task/feature
- Keep branches short-lived
- Delete merged branches
- Use descriptive names
- Stay updated with main

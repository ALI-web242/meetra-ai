# Merge Handler

## Description
Handles merging pull requests and branches with appropriate merge strategies.

## Trigger
- PR approved and ready
- `/git merge` command
- Branch merge needed

## Instructions

### Merge Strategies

| Strategy | When to Use | Result |
|----------|-------------|--------|
| **Merge** | Preserve history | Merge commit created |
| **Squash** | Clean history | Single commit |
| **Rebase** | Linear history | Commits replayed |

### Merge Strategy Selection

```markdown
## Use Merge Commit When:
- Multiple significant commits worth preserving
- Want to see feature branch history
- Debugging may need individual commits

## Use Squash When:
- Many small/WIP commits
- Want clean, linear history
- Feature is single logical change

## Use Rebase When:
- Want perfectly linear history
- Small PRs with few commits
- Need to maintain commit authorship
```

### Merging with gh CLI

```bash
# Squash merge (recommended)
gh pr merge 123 --squash

# Regular merge
gh pr merge 123 --merge

# Rebase merge
gh pr merge 123 --rebase

# Delete branch after merge
gh pr merge 123 --squash --delete-branch

# Auto-merge when checks pass
gh pr merge 123 --auto --squash
```

### Manual Merge

```bash
# Fetch latest
git fetch origin

# Checkout target branch
git checkout main
git pull origin main

# Merge feature branch
git merge feature/001-auth-login

# Or merge with squash
git merge --squash feature/001-auth-login
git commit -m "feat(auth): implement login (#45)"

# Push
git push origin main
```

### Handling Merge Conflicts

```bash
# During merge
git merge feature/001-auth-login

# If conflicts occur
# 1. Open conflicted files
# 2. Resolve conflicts
# 3. Stage resolved files
git add .

# 4. Complete merge
git commit -m "Merge feature/001-auth-login into main"

# Or abort merge
git merge --abort
```

### Pre-Merge Checklist

```markdown
## Before Merging

### Code Quality
- [ ] All CI checks pass
- [ ] Code review approved
- [ ] No merge conflicts
- [ ] Tests pass

### Branch Status
- [ ] Branch is up to date with base
- [ ] No uncommitted changes
- [ ] PR description is complete

### Post-Merge
- [ ] Delete feature branch
- [ ] Update related issues
- [ ] Notify team if needed
- [ ] Verify deployment (if auto-deploy)
```

### Merge Message Format

```markdown
## Squash Merge Message

feat(auth): implement user authentication (#45)

## Summary
Adds complete authentication flow with login, register, and logout.

## Changes
- Add auth module with JWT support
- Create login/register forms
- Implement protected routes
- Add auth state management

## Testing
- Unit tests: 15 new tests
- E2E tests: 5 new flows

Reviewed-by: @reviewer
```

### Branch Cleanup After Merge

```bash
# Delete local branch
git branch -d feature/001-auth-login

# Delete remote branch
git push origin --delete feature/001-auth-login

# Prune deleted remote branches
git fetch --prune

# List merged branches
git branch --merged main

# Delete all merged branches (except main)
git branch --merged main | grep -v "main" | xargs git branch -d
```

### Protecting Against Bad Merges

```bash
# Always pull before merge
git checkout main
git pull origin main

# Verify branch is up to date
git log main..feature/001-auth-login

# Test merge locally first
git merge --no-commit --no-ff feature/001-auth-login
# Review changes
git merge --abort  # If not satisfied
git commit         # If satisfied
```

### Revert a Merge

```bash
# Find merge commit
git log --oneline

# Revert merge commit
git revert -m 1 <merge-commit-hash>

# Push revert
git push origin main
```

## Tools Used
- `Bash`: Run git and gh commands

## Best Practices
- Always use PR for merges
- Prefer squash for cleaner history
- Delete branches after merge
- Verify CI passes before merge
- Keep main branch stable

# PR Creator

## Description
Creates pull requests with proper descriptions, labels, and review requests.

## Trigger
- Feature ready for review
- `/git pr` command
- PR creation needed

## Instructions

### PR Creation with gh CLI

```bash
# Basic PR
gh pr create --title "feat: add login form" --body "Description here"

# PR with full details
gh pr create \
  --title "feat(auth): implement user authentication" \
  --body "$(cat <<'EOF'
## Summary
Implements user authentication with email/password login.

## Changes
- Add LoginForm component
- Implement auth API service
- Add auth state management
- Create protected routes

## Testing
- [x] Unit tests pass
- [x] E2E tests pass
- [x] Manual testing completed

## Screenshots
[Add if UI changes]

## Related Issues
Closes #45
EOF
)" \
  --label "feature" \
  --reviewer "username"
```

### PR Template

```markdown
## Summary
<!-- Brief description of changes -->

## Type of Change
- [ ] Bug fix (non-breaking change fixing an issue)
- [ ] New feature (non-breaking change adding functionality)
- [ ] Breaking change (fix or feature causing existing functionality to change)
- [ ] Documentation update

## Changes Made
<!-- List the specific changes -->
- Change 1
- Change 2
- Change 3

## Testing
<!-- How was this tested? -->
- [ ] Unit tests added/updated
- [ ] E2E tests added/updated
- [ ] Manual testing completed

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings introduced
- [ ] Tests pass locally

## Screenshots (if applicable)
<!-- Add screenshots for UI changes -->

## Related Issues
<!-- Link related issues -->
Closes #

## Additional Notes
<!-- Any additional information -->
```

### PR Commands

```bash
# Create PR
gh pr create

# Create PR to specific base branch
gh pr create --base develop

# Create draft PR
gh pr create --draft

# List PRs
gh pr list

# View PR
gh pr view 123

# Check PR status
gh pr status

# Checkout PR locally
gh pr checkout 123

# Review PR
gh pr review 123 --approve
gh pr review 123 --request-changes --body "Please fix..."
gh pr review 123 --comment --body "Looks good!"

# Merge PR
gh pr merge 123 --squash
gh pr merge 123 --merge
gh pr merge 123 --rebase
```

### PR Size Guidelines

```markdown
## PR Size Recommendations

| Size | Lines Changed | Review Time |
|------|---------------|-------------|
| XS | < 50 | 10 min |
| S | 50-200 | 30 min |
| M | 200-500 | 1 hour |
| L | 500-1000 | 2+ hours |
| XL | > 1000 | Consider splitting |

### Tips for Smaller PRs
- Split by component/feature
- Separate refactoring from features
- Create foundation PRs first
```

### Labels

```bash
# Add labels
gh pr edit 123 --add-label "feature,frontend"

# Common labels
- feature
- bug
- enhancement
- documentation
- breaking-change
- needs-review
- work-in-progress
```

### PR Workflow

```markdown
## PR Lifecycle

1. **Create Branch**
   ```bash
   git checkout -b feature/001-auth-login
   ```

2. **Make Changes & Commit**
   ```bash
   git add .
   git commit -m "feat(auth): add login form"
   ```

3. **Push Branch**
   ```bash
   git push -u origin feature/001-auth-login
   ```

4. **Create PR**
   ```bash
   gh pr create --title "feat(auth): add login form"
   ```

5. **Address Reviews**
   ```bash
   # Make changes based on feedback
   git add .
   git commit -m "fix: address PR feedback"
   git push
   ```

6. **Merge**
   ```bash
   gh pr merge --squash
   ```

7. **Cleanup**
   ```bash
   git checkout main
   git pull
   git branch -d feature/001-auth-login
   ```
```

### Squash Merge Message

```markdown
feat(auth): implement user authentication (#45)

* Add LoginForm component
* Implement auth API service
* Add auth state management
* Create protected routes

Co-authored-by: Developer <dev@example.com>
```

## Tools Used
- `Bash`: Run gh CLI commands

## Best Practices
- Keep PRs focused and small
- Write clear descriptions
- Link related issues
- Request appropriate reviewers
- Respond to feedback promptly

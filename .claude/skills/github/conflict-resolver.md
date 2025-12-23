# Conflict Resolver

## Description
Resolves merge conflicts between branches, ensuring code integrity and proper resolution.

## Trigger
- Merge conflict detected
- `/git resolve` command
- Branch sync conflicts

## Instructions

### Understanding Conflicts

```
<<<<<<< HEAD (current branch)
your code here
=======
incoming code here
>>>>>>> feature/branch-name
```

### Conflict Types

| Type | Cause | Resolution |
|------|-------|------------|
| Content | Same lines modified | Manual merge |
| Rename | File renamed differently | Choose correct name |
| Delete | File deleted in one branch | Keep or delete |
| Binary | Binary file changed | Choose version |

### Resolution Workflow

```bash
# 1. Attempt merge
git merge feature/001-auth-login

# Output: CONFLICT (content): Merge conflict in src/auth/login.ts

# 2. Check conflict status
git status

# 3. Open conflicted files and resolve

# 4. After resolving all conflicts
git add .

# 5. Complete merge
git commit -m "Merge feature/001-auth-login, resolve conflicts"
```

### Manual Resolution

```typescript
// Before (with conflict markers)
<<<<<<< HEAD
const API_URL = 'http://localhost:3000';
=======
const API_URL = process.env.NEXT_PUBLIC_API_URL;
>>>>>>> feature/001-auth-login

// After (resolved)
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
```

### Resolution Strategies

#### Keep Ours (Current Branch)
```bash
# For specific file
git checkout --ours src/auth/login.ts
git add src/auth/login.ts

# For all conflicts
git checkout --ours .
git add .
```

#### Keep Theirs (Incoming Branch)
```bash
# For specific file
git checkout --theirs src/auth/login.ts
git add src/auth/login.ts

# For all conflicts
git checkout --theirs .
git add .
```

#### Manual Merge (Combine Both)
```typescript
// Ours: added validation
// Theirs: added loading state
// Combined: both features
const LoginForm = () => {
  const [loading, setLoading] = useState(false); // theirs
  const [errors, setErrors] = useState({});      // ours

  // Combined logic
};
```

### Common Conflict Scenarios

#### Package.json Conflicts
```json
// Conflict in dependencies
<<<<<<< HEAD
"axios": "^1.4.0",
=======
"axios": "^1.5.0",
>>>>>>> feature/branch

// Resolution: Keep newer version
"axios": "^1.5.0",

// Then regenerate lock file
npm install
```

#### Import Conflicts
```typescript
// Conflict
<<<<<<< HEAD
import { Button } from '@/components/Button';
=======
import { Button } from '@/components/ui/Button';
>>>>>>> feature/branch

// Resolution: Check which path is correct
import { Button } from '@/components/ui/Button';
```

#### Lock File Conflicts
```bash
# Don't manually resolve lock files
# Instead:
git checkout --theirs package-lock.json
npm install
git add package-lock.json
```

### Rebase Conflicts

```bash
# During rebase
git rebase main

# If conflict occurs
# 1. Resolve conflicts in files
# 2. Stage resolved files
git add .

# 3. Continue rebase
git rebase --continue

# Or abort rebase
git rebase --abort

# Or skip problematic commit
git rebase --skip
```

### Conflict Prevention

```markdown
## Best Practices to Avoid Conflicts

1. **Pull frequently**
   ```bash
   git pull origin main --rebase
   ```

2. **Keep PRs small**
   - Less code = fewer conflicts

3. **Communicate**
   - Know who's working on what

4. **Use feature flags**
   - Merge incomplete features safely

5. **Sync before pushing**
   ```bash
   git fetch origin
   git rebase origin/main
   ```
```

### Verify Resolution

```bash
# After resolving, verify:

# 1. Check no conflict markers remain
grep -r "<<<<<<" src/
grep -r "======" src/
grep -r ">>>>>>" src/

# 2. Run tests
npm test

# 3. Build
npm run build

# 4. Check diff
git diff --cached
```

### Conflict Resolution Tools

```bash
# Use merge tool
git mergetool

# Configure VS Code as merge tool
git config --global merge.tool vscode
git config --global mergetool.vscode.cmd 'code --wait $MERGED'
```

## Tools Used
- `Bash`: Run git commands
- `Read`: Read conflicted files
- `Edit`: Resolve conflicts

## Best Practices
- Understand both changes before resolving
- Test after resolution
- Don't lose intended changes
- Ask for help if unsure
- Document complex resolutions

# Coverage Reporter

## Description
Generates test coverage reports and ensures code meets coverage thresholds.

## Trigger
- Coverage report needed
- `/test coverage` command
- CI/CD pipeline

## Instructions

### Jest Coverage Configuration

```javascript
// jest.config.js
module.exports = {
  // ... other config
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.spec.ts',
    '!src/**/*.test.ts',
    '!src/**/index.ts',
    '!src/main.ts',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html', 'json-summary'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
```

### Running Coverage

```bash
# Run tests with coverage
npm run test:cov

# Backend specific
cd backend && npm run test:cov

# Frontend specific
cd frontend && npm run test:cov

# E2E coverage (if configured)
npm run test:e2e:cov
```

### Coverage Report Structure

```
coverage/
├── lcov-report/
│   ├── index.html      # HTML report
│   └── ...
├── lcov.info           # LCOV format
├── coverage-summary.json
└── clover.xml
```

### Interpreting Coverage

```markdown
## Coverage Metrics

| Metric | Description | Target |
|--------|-------------|--------|
| **Statements** | % of statements executed | 80% |
| **Branches** | % of if/else branches taken | 80% |
| **Functions** | % of functions called | 80% |
| **Lines** | % of lines executed | 80% |
```

### Coverage Script

```typescript
// scripts/check-coverage.ts
import * as fs from 'fs';

interface CoverageSummary {
  total: {
    lines: { pct: number };
    statements: { pct: number };
    functions: { pct: number };
    branches: { pct: number };
  };
}

const THRESHOLDS = {
  lines: 80,
  statements: 80,
  functions: 80,
  branches: 80,
};

function checkCoverage() {
  const summary: CoverageSummary = JSON.parse(
    fs.readFileSync('coverage/coverage-summary.json', 'utf8')
  );

  const results = {
    lines: summary.total.lines.pct >= THRESHOLDS.lines,
    statements: summary.total.statements.pct >= THRESHOLDS.statements,
    functions: summary.total.functions.pct >= THRESHOLDS.functions,
    branches: summary.total.branches.pct >= THRESHOLDS.branches,
  };

  console.log('\n=== Coverage Report ===\n');
  console.log(`Lines:      ${summary.total.lines.pct.toFixed(2)}% (min: ${THRESHOLDS.lines}%) ${results.lines ? '✅' : '❌'}`);
  console.log(`Statements: ${summary.total.statements.pct.toFixed(2)}% (min: ${THRESHOLDS.statements}%) ${results.statements ? '✅' : '❌'}`);
  console.log(`Functions:  ${summary.total.functions.pct.toFixed(2)}% (min: ${THRESHOLDS.functions}%) ${results.functions ? '✅' : '❌'}`);
  console.log(`Branches:   ${summary.total.branches.pct.toFixed(2)}% (min: ${THRESHOLDS.branches}%) ${results.branches ? '✅' : '❌'}`);

  const allPassed = Object.values(results).every(r => r);

  if (!allPassed) {
    console.log('\n❌ Coverage thresholds not met!\n');
    process.exit(1);
  }

  console.log('\n✅ All coverage thresholds met!\n');
}

checkCoverage();
```

### Finding Uncovered Code

```typescript
// scripts/find-uncovered.ts
import * as fs from 'fs';

interface FileCoverage {
  [file: string]: {
    lines: { [line: string]: number };
    functions: { [fn: string]: number };
    branches: { [branch: string]: number };
  };
}

function findUncovered() {
  const coverage: FileCoverage = JSON.parse(
    fs.readFileSync('coverage/coverage-final.json', 'utf8')
  );

  const uncovered: { file: string; lines: number[] }[] = [];

  Object.entries(coverage).forEach(([file, data]) => {
    const uncoveredLines = Object.entries(data.lines)
      .filter(([, count]) => count === 0)
      .map(([line]) => parseInt(line));

    if (uncoveredLines.length > 0) {
      uncovered.push({ file, lines: uncoveredLines });
    }
  });

  console.log('\n=== Uncovered Lines ===\n');
  uncovered.forEach(({ file, lines }) => {
    console.log(`${file}:`);
    console.log(`  Lines: ${lines.join(', ')}`);
  });
}

findUncovered();
```

### CI Integration

```yaml
# .github/workflows/test.yml
name: Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Run tests with coverage
        run: npm run test:cov

      - name: Check coverage thresholds
        run: npm run coverage:check

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info
```

### Coverage Badge

```markdown
<!-- In README.md -->
![Coverage](https://img.shields.io/codecov/c/github/username/repo)
```

### Package.json Scripts

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:cov": "jest --coverage",
    "test:debug": "node --inspect-brk -r tsconfig-paths/register -r ts-node/register node_modules/.bin/jest --runInBand",
    "coverage:check": "ts-node scripts/check-coverage.ts",
    "coverage:report": "open coverage/lcov-report/index.html"
  }
}
```

## Tools Used
- `Read`: Read coverage reports
- `Write`: Generate summaries
- `Bash`: Run coverage commands

## Best Practices
- Set realistic thresholds
- Exclude non-testable files
- Track coverage trends
- Focus on meaningful coverage
- Don't chase 100%

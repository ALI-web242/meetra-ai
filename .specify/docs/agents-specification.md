# Specify Framework - Agents Specification

> Complete specification document for all agents in the Specify Framework.

---

## Table of Contents

1. [Overview](#overview)
2. [Agent Architecture](#agent-architecture)
3. [Agents List](#agents-list)
   - [Orchestrator Agent](#1-orchestrator-agent)
   - [Spec Agent](#2-spec-agent)
   - [Planner Agent](#3-planner-agent)
   - [Contracts Agent](#4-contracts-agent)
   - [Tasks Agent](#5-tasks-agent)
   - [Frontend Agent](#6-frontend-agent)
   - [Backend Agent](#7-backend-agent)
   - [UI/UX Agent](#8-uiux-agent)
   - [Tester Agent](#9-tester-agent)
   - [GitHub Agent](#10-github-agent)
   - [Vercel Agent](#11-vercel-agent)
4. [Agent Communication](#agent-communication)
5. [Error Handling](#error-handling)

---

## Overview

The Specify Framework uses a multi-agent architecture where each agent is responsible for a specific domain of the software development lifecycle. Agents communicate through a central Orchestrator and share context via a unified state management system.

### Key Principles

- **Single Responsibility**: Each agent handles one specific domain
- **Loose Coupling**: Agents communicate via well-defined interfaces
- **Stateless Execution**: Agents don't maintain state between invocations
- **Skill-Based**: Each agent has a set of skills it can invoke

---

## Agent Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      ORCHESTRATOR AGENT                         │
│                   (Central Coordinator)                         │
└─────────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        ▼                     ▼                     ▼
┌───────────────┐     ┌───────────────┐     ┌───────────────┐
│  SPEC AGENT   │────▶│ PLANNER AGENT │────▶│CONTRACTS AGENT│
└───────────────┘     └───────────────┘     └───────────────┘
                              │
                              ▼
                      ┌───────────────┐
                      │  TASKS AGENT  │
                      └───────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        ▼                     ▼                     ▼
┌───────────────┐     ┌───────────────┐     ┌───────────────┐
│FRONTEND AGENT │     │ BACKEND AGENT │     │  UI/UX AGENT  │
└───────────────┘     └───────────────┘     └───────────────┘
        │                     │                     │
        └─────────────────────┼─────────────────────┘
                              ▼
                      ┌───────────────┐
                      │ TESTER AGENT  │
                      └───────────────┘
                              │
        ┌─────────────────────┴─────────────────────┐
        ▼                                           ▼
┌───────────────┐                           ┌───────────────┐
│ GITHUB AGENT  │──────────────────────────▶│ VERCEL AGENT  │
└───────────────┘                           └───────────────┘
```

---

## Agents List

---

### 1. Orchestrator Agent

**Purpose**: Central coordinator that manages the workflow, routes tasks to appropriate agents, and maintains global state.

#### Metadata

| Property | Value |
|----------|-------|
| Agent ID | `orchestrator` |
| Priority | `critical` |
| Timeout | `unlimited` |
| Retry | `3` |

#### Responsibilities

- Coordinate all agent activities
- Manage workflow state and transitions
- Route tasks to appropriate agents
- Handle errors and retries
- Maintain global context
- Track progress and report status

#### Input

```typescript
interface OrchestratorInput {
  command: 'start' | 'continue' | 'retry' | 'abort';
  specId: string;
  context?: SharedContext;
  targetPhase?: Phase;
}
```

#### Output

```typescript
interface OrchestratorOutput {
  status: 'in_progress' | 'completed' | 'failed' | 'paused';
  currentPhase: Phase;
  completedPhases: Phase[];
  errors?: Error[];
  artifacts: Artifact[];
}
```

#### Skills Used

| Skill | Purpose |
|-------|---------|
| `workflow-manager` | Control agent execution sequence |
| `state-tracker` | Track current workflow state |
| `error-handler` | Handle and recover from errors |
| `context-manager` | Manage shared context between agents |

#### Triggers

- User initiates a new spec
- Phase completion by any agent
- Error occurs in any agent
- User requests status

#### Example Invocation

```json
{
  "agent": "orchestrator",
  "input": {
    "command": "start",
    "specId": "001-auth-user-access"
  }
}
```

---

### 2. Spec Agent

**Purpose**: Gathers requirements from the user and creates the `spec.md` file that defines what needs to be built.

#### Metadata

| Property | Value |
|----------|-------|
| Agent ID | `spec` |
| Priority | `high` |
| Timeout | `30 minutes` |
| Retry | `2` |

#### Responsibilities

- Interact with user to gather requirements
- Ask clarifying questions
- Document functional requirements
- Document non-functional requirements
- Create `spec.md` file
- Define success criteria

#### Input

```typescript
interface SpecInput {
  userRequest: string;
  projectContext?: ProjectContext;
  existingSpecs?: string[];
}
```

#### Output

```typescript
interface SpecOutput {
  specFile: string;  // Path to spec.md
  requirements: Requirement[];
  clarifications: Clarification[];
  successCriteria: string[];
}
```

#### Skills Used

| Skill | Purpose |
|-------|---------|
| `requirement-gatherer` | Extract requirements from user input |
| `spec-writer` | Write formatted spec.md file |
| `clarification-asker` | Ask questions for ambiguous requirements |

#### Files Created/Modified

| File | Action |
|------|--------|
| `specs/{spec-id}/spec.md` | Create |

#### Example Invocation

```json
{
  "agent": "spec",
  "input": {
    "userRequest": "I need a user authentication system with email/password login and social login options"
  }
}
```

---

### 3. Planner Agent

**Purpose**: Reads the spec and creates a detailed implementation plan with architecture decisions and milestones.

#### Metadata

| Property | Value |
|----------|-------|
| Agent ID | `planner` |
| Priority | `high` |
| Timeout | `20 minutes` |
| Retry | `2` |

#### Responsibilities

- Analyze spec.md requirements
- Design system architecture
- Choose appropriate technologies
- Define implementation milestones
- Identify risks and dependencies
- Create `plan.md` file

#### Input

```typescript
interface PlannerInput {
  specFile: string;
  projectContext: ProjectContext;
  constraints?: Constraint[];
  preferences?: TechPreference[];
}
```

#### Output

```typescript
interface PlannerOutput {
  planFile: string;  // Path to plan.md
  architecture: ArchitectureDecision[];
  milestones: Milestone[];
  techStack: TechStack;
  risks: Risk[];
}
```

#### Skills Used

| Skill | Purpose |
|-------|---------|
| `architecture-designer` | Design system architecture |
| `milestone-creator` | Break work into milestones |
| `plan-writer` | Write formatted plan.md file |
| `tech-stack-selector` | Choose appropriate technologies |

#### Files Created/Modified

| File | Action |
|------|--------|
| `specs/{spec-id}/plan.md` | Create |

#### Example Invocation

```json
{
  "agent": "planner",
  "input": {
    "specFile": "specs/001-auth-user-access/spec.md",
    "projectContext": {
      "framework": "nextjs",
      "backend": "nestjs"
    }
  }
}
```

---

### 4. Contracts Agent

**Purpose**: Defines API contracts (OpenAPI), database schemas, and type definitions before implementation begins.

#### Metadata

| Property | Value |
|----------|-------|
| Agent ID | `contracts` |
| Priority | `high` |
| Timeout | `15 minutes` |
| Retry | `2` |

#### Responsibilities

- Define REST API endpoints (OpenAPI/YAML)
- Design database schemas
- Generate TypeScript interfaces
- Define validation schemas (Zod)
- Document request/response formats

#### Input

```typescript
interface ContractsInput {
  planFile: string;
  specFile: string;
  existingContracts?: Contract[];
}
```

#### Output

```typescript
interface ContractsOutput {
  apiContracts: string[];   // OpenAPI YAML files
  dbSchemas: string[];      // SQL/TypeORM schemas
  typeDefinitions: string[]; // TypeScript interfaces
  validationSchemas: string[]; // Zod schemas
}
```

#### Skills Used

| Skill | Purpose |
|-------|---------|
| `openapi-writer` | Write OpenAPI/YAML specifications |
| `schema-designer` | Design database schemas |
| `type-generator` | Generate TypeScript types |
| `validation-rules` | Create Zod validation schemas |

#### Files Created/Modified

| File | Action |
|------|--------|
| `specs/{spec-id}/contracts/*.yaml` | Create |
| `specs/{spec-id}/contracts/*.ts` | Create |

#### Example Invocation

```json
{
  "agent": "contracts",
  "input": {
    "planFile": "specs/001-auth-user-access/plan.md",
    "specFile": "specs/001-auth-user-access/spec.md"
  }
}
```

---

### 5. Tasks Agent

**Purpose**: Breaks down the plan into actionable, trackable tasks with dependencies and priorities.

#### Metadata

| Property | Value |
|----------|-------|
| Agent ID | `tasks` |
| Priority | `high` |
| Timeout | `10 minutes` |
| Retry | `2` |

#### Responsibilities

- Parse plan.md milestones
- Create granular tasks
- Define task dependencies
- Set task priorities
- Assign tasks to agents
- Create `tasks.md` file

#### Input

```typescript
interface TasksInput {
  planFile: string;
  contracts: Contract[];
  existingTasks?: Task[];
}
```

#### Output

```typescript
interface TasksOutput {
  tasksFile: string;  // Path to tasks.md
  tasks: Task[];
  dependencies: Dependency[];
  assignedAgents: AgentAssignment[];
}
```

#### Skills Used

| Skill | Purpose |
|-------|---------|
| `task-breakdown` | Break milestones into tasks |
| `dependency-mapper` | Identify task dependencies |
| `priority-setter` | Assign priorities to tasks |
| `tasks-writer` | Write formatted tasks.md file |

#### Files Created/Modified

| File | Action |
|------|--------|
| `specs/{spec-id}/tasks.md` | Create |

#### Example Invocation

```json
{
  "agent": "tasks",
  "input": {
    "planFile": "specs/001-auth-user-access/plan.md"
  }
}
```

---

### 6. Frontend Agent

**Purpose**: Implements frontend code including React components, pages, hooks, and client-side logic.

#### Metadata

| Property | Value |
|----------|-------|
| Agent ID | `frontend` |
| Priority | `medium` |
| Timeout | `60 minutes` |
| Retry | `3` |

#### Responsibilities

- Create React/Next.js components
- Implement pages and routing
- Write custom hooks
- Integrate with backend APIs
- Implement forms and validation
- Manage client-side state

#### Input

```typescript
interface FrontendInput {
  tasks: Task[];
  contracts: Contract[];
  designSystem?: DesignSystem;
  existingComponents?: Component[];
}
```

#### Output

```typescript
interface FrontendOutput {
  components: string[];   // Created component files
  pages: string[];        // Created page files
  hooks: string[];        // Created hook files
  services: string[];     // API service files
  tests: string[];        // Test files
}
```

#### Skills Used

| Skill | Purpose |
|-------|---------|
| `nextjs-coder` | Write Next.js pages and components |
| `react-hooks` | Create custom React hooks |
| `state-management` | Implement Zustand/Context state |
| `api-integration` | Connect to backend APIs |
| `form-builder` | Create forms with validation |

#### Files Created/Modified

| Location | File Types |
|----------|------------|
| `frontend/src/components/` | `.tsx` |
| `frontend/src/app/` | `page.tsx`, `layout.tsx` |
| `frontend/src/hooks/` | `.ts` |
| `frontend/src/services/` | `.ts` |

#### Example Invocation

```json
{
  "agent": "frontend",
  "input": {
    "tasks": [
      {"id": "FE-001", "title": "Create LoginForm component"}
    ],
    "contracts": ["specs/001-auth-user-access/contracts/auth.yaml"]
  }
}
```

---

### 7. Backend Agent

**Purpose**: Implements backend code including NestJS modules, controllers, services, and database operations.

#### Metadata

| Property | Value |
|----------|-------|
| Agent ID | `backend` |
| Priority | `medium` |
| Timeout | `60 minutes` |
| Retry | `3` |

#### Responsibilities

- Create NestJS modules and controllers
- Implement service layer logic
- Write database queries (TypeORM)
- Implement authentication/authorization
- Create middleware and guards
- Handle API request/response

#### Input

```typescript
interface BackendInput {
  tasks: Task[];
  contracts: Contract[];
  dbSchemas: Schema[];
  existingModules?: Module[];
}
```

#### Output

```typescript
interface BackendOutput {
  modules: string[];      // NestJS modules
  controllers: string[];  // Controller files
  services: string[];     // Service files
  entities: string[];     // TypeORM entities
  guards: string[];       // Auth guards
  tests: string[];        // Test files
}
```

#### Skills Used

| Skill | Purpose |
|-------|---------|
| `nestjs-coder` | Write NestJS modules/controllers |
| `database-ops` | Implement TypeORM queries |
| `auth-implementer` | Create JWT/session auth |
| `api-builder` | Build REST endpoints |
| `middleware-creator` | Create guards/interceptors |

#### Files Created/Modified

| Location | File Types |
|----------|------------|
| `backend/src/{module}/` | `*.module.ts` |
| `backend/src/{module}/` | `*.controller.ts` |
| `backend/src/{module}/` | `*.service.ts` |
| `backend/src/{module}/entities/` | `*.entity.ts` |

#### Example Invocation

```json
{
  "agent": "backend",
  "input": {
    "tasks": [
      {"id": "BE-001", "title": "Create AuthController"}
    ],
    "contracts": ["specs/001-auth-user-access/contracts/auth.yaml"]
  }
}
```

---

### 8. UI/UX Agent

**Purpose**: Handles design system, component styling, responsive design, and accessibility compliance.

#### Metadata

| Property | Value |
|----------|-------|
| Agent ID | `ui-ux` |
| Priority | `medium` |
| Timeout | `30 minutes` |
| Retry | `2` |

#### Responsibilities

- Create and maintain design system
- Apply Tailwind CSS styling
- Ensure responsive design
- Check accessibility (a11y)
- Create reusable UI components
- Define color schemes and typography

#### Input

```typescript
interface UIUXInput {
  components: Component[];
  brandGuidelines?: BrandGuidelines;
  existingDesignSystem?: DesignSystem;
}
```

#### Output

```typescript
interface UIUXOutput {
  designTokens: string;     // Design tokens file
  styledComponents: string[]; // Styled component files
  accessibilityReport: AccessibilityReport;
  responsiveBreakpoints: Breakpoint[];
}
```

#### Skills Used

| Skill | Purpose |
|-------|---------|
| `component-designer` | Create reusable UI components |
| `tailwind-styler` | Apply Tailwind CSS styling |
| `responsive-design` | Implement mobile-first design |
| `accessibility-checker` | Ensure WCAG compliance |
| `design-system` | Define colors/typography/spacing |

#### Files Created/Modified

| Location | File Types |
|----------|------------|
| `frontend/src/components/ui/` | `.tsx` |
| `frontend/src/styles/` | `.css` |
| `frontend/tailwind.config.ts` | Config |

#### Example Invocation

```json
{
  "agent": "ui-ux",
  "input": {
    "components": ["Button", "Input", "Card"],
    "brandGuidelines": {
      "primaryColor": "#3B82F6",
      "fontFamily": "Inter"
    }
  }
}
```

---

### 9. Tester Agent

**Purpose**: Writes and executes tests including unit tests, integration tests, and E2E tests.

#### Metadata

| Property | Value |
|----------|-------|
| Agent ID | `tester` |
| Priority | `high` |
| Timeout | `45 minutes` |
| Retry | `3` |

#### Responsibilities

- Write unit tests (Jest)
- Write E2E tests (Playwright)
- Test API endpoints
- Validate against contracts
- Generate coverage reports
- Report test failures

#### Input

```typescript
interface TesterInput {
  codePaths: string[];
  contracts: Contract[];
  testTypes: ('unit' | 'integration' | 'e2e')[];
  coverageThreshold?: number;
}
```

#### Output

```typescript
interface TesterOutput {
  testFiles: string[];
  testResults: TestResult[];
  coverageReport: CoverageReport;
  contractValidation: ValidationResult;
}
```

#### Skills Used

| Skill | Purpose |
|-------|---------|
| `unit-tester` | Write Jest unit tests |
| `e2e-tester` | Write Playwright E2E tests |
| `api-tester` | Test REST endpoints |
| `contract-validator` | Validate against OpenAPI |
| `coverage-reporter` | Generate coverage reports |

#### Files Created/Modified

| Location | File Types |
|----------|------------|
| `frontend/tests/` | `*.test.tsx` |
| `backend/tests/` | `*.spec.ts` |
| `e2e/` | `*.spec.ts` |

#### Example Invocation

```json
{
  "agent": "tester",
  "input": {
    "codePaths": ["backend/src/auth/"],
    "contracts": ["specs/001-auth-user-access/contracts/auth.yaml"],
    "testTypes": ["unit", "integration"],
    "coverageThreshold": 80
  }
}
```

---

### 10. GitHub Agent

**Purpose**: Handles all Git operations including branching, commits, pull requests, and merge operations.

#### Metadata

| Property | Value |
|----------|-------|
| Agent ID | `github` |
| Priority | `medium` |
| Timeout | `10 minutes` |
| Retry | `3` |

#### Responsibilities

- Create and switch branches
- Create semantic commits
- Open pull requests
- Handle merge operations
- Resolve merge conflicts
- Manage GitHub issues

#### Input

```typescript
interface GitHubInput {
  operation: 'branch' | 'commit' | 'pr' | 'merge';
  branchName?: string;
  commitMessage?: string;
  prTitle?: string;
  prBody?: string;
  files?: string[];
}
```

#### Output

```typescript
interface GitHubOutput {
  success: boolean;
  branchName?: string;
  commitHash?: string;
  prUrl?: string;
  prNumber?: number;
}
```

#### Skills Used

| Skill | Purpose |
|-------|---------|
| `branch-manager` | Create and manage branches |
| `commit-creator` | Create semantic commits |
| `pr-creator` | Open pull requests |
| `merge-handler` | Merge pull requests |
| `conflict-resolver` | Resolve merge conflicts |

#### Example Invocation

```json
{
  "agent": "github",
  "input": {
    "operation": "pr",
    "prTitle": "feat: Add user authentication",
    "prBody": "Implements login, register, and logout functionality"
  }
}
```

---

### 11. Vercel Agent

**Purpose**: Handles deployments to Vercel including preview deployments, production deployments, and environment configuration.

#### Metadata

| Property | Value |
|----------|-------|
| Agent ID | `vercel` |
| Priority | `medium` |
| Timeout | `15 minutes` |
| Retry | `3` |

#### Responsibilities

- Trigger deployments
- Manage environment variables
- Create preview deployments
- Configure custom domains
- Monitor deployment logs
- Handle rollbacks

#### Input

```typescript
interface VercelInput {
  operation: 'deploy' | 'preview' | 'env' | 'logs' | 'rollback';
  environment?: 'production' | 'preview' | 'development';
  envVars?: Record<string, string>;
  deploymentId?: string;
}
```

#### Output

```typescript
interface VercelOutput {
  success: boolean;
  deploymentUrl?: string;
  previewUrl?: string;
  deploymentId?: string;
  logs?: string[];
}
```

#### Skills Used

| Skill | Purpose |
|-------|---------|
| `deployer` | Trigger deployments |
| `env-manager` | Manage environment variables |
| `preview-creator` | Generate preview URLs |
| `domain-manager` | Configure custom domains |
| `logs-reader` | Read deployment logs |

#### Example Invocation

```json
{
  "agent": "vercel",
  "input": {
    "operation": "preview",
    "environment": "preview"
  }
}
```

---

## Agent Communication

### Message Format

Agents communicate using a standardized message format:

```typescript
interface AgentMessage {
  from: AgentId;
  to: AgentId;
  type: 'request' | 'response' | 'event';
  payload: any;
  correlationId: string;
  timestamp: Date;
}
```

### Shared Context

All agents have access to a shared context:

```typescript
interface SharedContext {
  specId: string;
  currentPhase: Phase;
  artifacts: Artifact[];
  errors: Error[];
  config: ProjectConfig;
}
```

---

## Error Handling

### Error Types

| Error Type | Handling |
|------------|----------|
| `ValidationError` | Return to user for clarification |
| `TimeoutError` | Retry with extended timeout |
| `DependencyError` | Wait for dependency resolution |
| `FatalError` | Abort and notify orchestrator |

### Retry Strategy

```typescript
interface RetryConfig {
  maxRetries: number;
  backoffMs: number;
  backoffMultiplier: number;
}
```

---

## Summary

| Agent | Skills Count | Priority |
|-------|--------------|----------|
| Orchestrator | 4 | Critical |
| Spec | 3 | High |
| Planner | 4 | High |
| Contracts | 4 | High |
| Tasks | 4 | High |
| Frontend | 5 | Medium |
| Backend | 5 | Medium |
| UI/UX | 5 | Medium |
| Tester | 5 | High |
| GitHub | 5 | Medium |
| Vercel | 5 | Medium |
| **Total** | **49** | - |

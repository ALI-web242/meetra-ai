# Specify Framework - Skills Specification

> Complete specification document for all skills used by agents in the Specify Framework.

---

## Table of Contents

1. [Overview](#overview)
2. [Skill Architecture](#skill-architecture)
3. [Skills by Agent](#skills-by-agent)
   - [Orchestrator Skills](#orchestrator-skills)
   - [Spec Agent Skills](#spec-agent-skills)
   - [Planner Agent Skills](#planner-agent-skills)
   - [Contracts Agent Skills](#contracts-agent-skills)
   - [Tasks Agent Skills](#tasks-agent-skills)
   - [Frontend Agent Skills](#frontend-agent-skills)
   - [Backend Agent Skills](#backend-agent-skills)
   - [UI/UX Agent Skills](#uiux-agent-skills)
   - [Tester Agent Skills](#tester-agent-skills)
   - [GitHub Agent Skills](#github-agent-skills)
   - [Vercel Agent Skills](#vercel-agent-skills)
4. [Skill Invocation](#skill-invocation)
5. [Best Practices](#best-practices)

---

## Overview

Skills are the atomic units of functionality that agents use to accomplish their tasks. Each skill is designed to do one thing well and can be composed with other skills to complete complex workflows.

### Key Principles

- **Single Purpose**: Each skill performs one specific task
- **Composable**: Skills can be combined to create complex workflows
- **Stateless**: Skills don't maintain state between invocations
- **Tool-Aware**: Skills know which tools they can use

---

## Skill Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                          AGENT                               │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐        │
│  │ Skill 1 │  │ Skill 2 │  │ Skill 3 │  │ Skill N │        │
│  └────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘        │
│       │            │            │            │              │
│       └────────────┴────────────┴────────────┘              │
│                          │                                   │
│                    ┌─────┴─────┐                            │
│                    │   TOOLS   │                            │
│                    └───────────┘                            │
│         (Read, Write, Edit, Bash, Grep, Glob, etc.)        │
└─────────────────────────────────────────────────────────────┘
```

### Skill Definition Schema

```typescript
interface SkillDefinition {
  id: string;
  name: string;
  description: string;
  agent: AgentId;
  input: InputSchema;
  output: OutputSchema;
  tools: Tool[];
  examples: Example[];
  prompts: PromptTemplate[];
}
```

---

## Skills by Agent

---

## Orchestrator Skills

### 1. workflow-manager

**Purpose**: Controls the execution sequence of agents and manages workflow transitions.

#### Metadata

| Property | Value |
|----------|-------|
| Skill ID | `workflow-manager` |
| Agent | `orchestrator` |
| Category | `coordination` |

#### Input Schema

```typescript
interface WorkflowManagerInput {
  action: 'start' | 'pause' | 'resume' | 'skip' | 'abort';
  currentPhase: Phase;
  targetPhase?: Phase;
  reason?: string;
}
```

#### Output Schema

```typescript
interface WorkflowManagerOutput {
  success: boolean;
  newPhase: Phase;
  skippedPhases?: Phase[];
  message: string;
}
```

#### Tools Used

| Tool | Purpose |
|------|---------|
| `Read` | Read current workflow state |
| `Write` | Update workflow state file |

#### Example Prompt

```
You are managing the workflow for spec "{specId}".
Current phase: {currentPhase}
Action requested: {action}

Determine the next phase and update the workflow state accordingly.
Ensure all prerequisites for the next phase are met.
```

#### Example Invocation

```json
{
  "skill": "workflow-manager",
  "input": {
    "action": "start",
    "currentPhase": "planning",
    "targetPhase": "contracts"
  }
}
```

---

### 2. state-tracker

**Purpose**: Tracks and maintains the current state of the workflow execution.

#### Metadata

| Property | Value |
|----------|-------|
| Skill ID | `state-tracker` |
| Agent | `orchestrator` |
| Category | `coordination` |

#### Input Schema

```typescript
interface StateTrackerInput {
  operation: 'get' | 'set' | 'update';
  key?: string;
  value?: any;
}
```

#### Output Schema

```typescript
interface StateTrackerOutput {
  state: WorkflowState;
  changes?: StateChange[];
  timestamp: Date;
}
```

#### Tools Used

| Tool | Purpose |
|------|---------|
| `Read` | Read state file |
| `Write` | Write state file |
| `Edit` | Update specific state values |

#### Example Prompt

```
Track the current state of workflow "{specId}".
Operation: {operation}

If getting state, return the full current state.
If setting/updating, validate the new values and persist them.
```

---

### 3. error-handler

**Purpose**: Handles errors from agents, determines retry strategy, and manages error recovery.

#### Metadata

| Property | Value |
|----------|-------|
| Skill ID | `error-handler` |
| Agent | `orchestrator` |
| Category | `error-management` |

#### Input Schema

```typescript
interface ErrorHandlerInput {
  error: Error;
  sourceAgent: AgentId;
  context: ErrorContext;
  retryCount: number;
}
```

#### Output Schema

```typescript
interface ErrorHandlerOutput {
  action: 'retry' | 'skip' | 'abort' | 'escalate';
  message: string;
  retryDelay?: number;
  fallbackAgent?: AgentId;
}
```

#### Tools Used

| Tool | Purpose |
|------|---------|
| `Read` | Read error logs |
| `Write` | Log error details |

#### Example Prompt

```
An error occurred in agent "{sourceAgent}":
Error: {error.message}
Type: {error.type}
Retry count: {retryCount}

Determine the appropriate action:
- Retry if the error is transient
- Skip if the phase is optional
- Abort if the error is fatal
- Escalate if user intervention is needed
```

---

### 4. context-manager

**Purpose**: Manages shared context between agents, ensuring data consistency.

#### Metadata

| Property | Value |
|----------|-------|
| Skill ID | `context-manager` |
| Agent | `orchestrator` |
| Category | `data-management` |

#### Input Schema

```typescript
interface ContextManagerInput {
  operation: 'read' | 'write' | 'merge' | 'clear';
  path?: string;
  data?: any;
}
```

#### Output Schema

```typescript
interface ContextManagerOutput {
  context: SharedContext;
  updated: boolean;
  conflicts?: Conflict[];
}
```

#### Tools Used

| Tool | Purpose |
|------|---------|
| `Read` | Read context file |
| `Write` | Write context file |
| `Edit` | Update context values |

---

## Spec Agent Skills

### 1. requirement-gatherer

**Purpose**: Extracts and structures requirements from user input.

#### Metadata

| Property | Value |
|----------|-------|
| Skill ID | `requirement-gatherer` |
| Agent | `spec` |
| Category | `analysis` |

#### Input Schema

```typescript
interface RequirementGathererInput {
  userInput: string;
  projectContext?: ProjectContext;
  existingRequirements?: Requirement[];
}
```

#### Output Schema

```typescript
interface RequirementGathererOutput {
  functionalRequirements: Requirement[];
  nonFunctionalRequirements: Requirement[];
  assumptions: string[];
  outOfScope: string[];
}
```

#### Tools Used

| Tool | Purpose |
|------|---------|
| `Read` | Read existing spec files |
| `Write` | Write requirements |

#### Example Prompt

```
Analyze the user's request and extract structured requirements:

User Request: "{userInput}"

Categorize requirements as:
1. Functional Requirements (what the system should do)
2. Non-Functional Requirements (how the system should perform)
3. Assumptions (implicit requirements)
4. Out of Scope (explicitly excluded features)

Be thorough and ask clarifying questions if needed.
```

---

### 2. spec-writer

**Purpose**: Creates formatted spec.md files following the template.

#### Metadata

| Property | Value |
|----------|-------|
| Skill ID | `spec-writer` |
| Agent | `spec` |
| Category | `documentation` |

#### Input Schema

```typescript
interface SpecWriterInput {
  requirements: Requirement[];
  template: string;
  metadata: SpecMetadata;
}
```

#### Output Schema

```typescript
interface SpecWriterOutput {
  filePath: string;
  content: string;
  sections: Section[];
}
```

#### Tools Used

| Tool | Purpose |
|------|---------|
| `Read` | Read spec template |
| `Write` | Write spec.md file |

#### Example Prompt

```
Create a spec.md file using the template at ".specify/templates/spec-template.md".

Requirements to include:
{requirements}

Ensure the spec is:
- Clear and unambiguous
- Complete with all sections filled
- Properly formatted in markdown
```

---

### 3. clarification-asker

**Purpose**: Identifies ambiguous requirements and formulates clarifying questions.

#### Metadata

| Property | Value |
|----------|-------|
| Skill ID | `clarification-asker` |
| Agent | `spec` |
| Category | `communication` |

#### Input Schema

```typescript
interface ClarificationAskerInput {
  requirements: Requirement[];
  ambiguities: Ambiguity[];
}
```

#### Output Schema

```typescript
interface ClarificationAskerOutput {
  questions: Question[];
  priority: 'blocking' | 'important' | 'nice-to-have';
}
```

#### Example Prompt

```
Review these requirements for ambiguities:
{requirements}

Identify any:
- Vague terms that need definition
- Missing details that affect implementation
- Conflicting requirements
- Assumptions that need validation

Formulate clear, specific questions for each ambiguity.
```

---

## Planner Agent Skills

### 1. architecture-designer

**Purpose**: Designs the system architecture based on requirements.

#### Metadata

| Property | Value |
|----------|-------|
| Skill ID | `architecture-designer` |
| Agent | `planner` |
| Category | `design` |

#### Input Schema

```typescript
interface ArchitectureDesignerInput {
  requirements: Requirement[];
  constraints: Constraint[];
  existingArchitecture?: Architecture;
}
```

#### Output Schema

```typescript
interface ArchitectureDesignerOutput {
  components: Component[];
  interactions: Interaction[];
  patterns: Pattern[];
  diagrams: Diagram[];
}
```

#### Tools Used

| Tool | Purpose |
|------|---------|
| `Read` | Read existing architecture docs |
| `Write` | Write architecture decisions |
| `Glob` | Find existing code patterns |

#### Example Prompt

```
Design the system architecture for:
{requirements}

Consider:
- Separation of concerns
- Scalability requirements
- Security requirements
- Integration points

Output architecture decisions and component structure.
```

---

### 2. milestone-creator

**Purpose**: Breaks down the implementation into logical milestones.

#### Metadata

| Property | Value |
|----------|-------|
| Skill ID | `milestone-creator` |
| Agent | `planner` |
| Category | `planning` |

#### Input Schema

```typescript
interface MilestoneCreatorInput {
  architecture: Architecture;
  requirements: Requirement[];
  priorities: Priority[];
}
```

#### Output Schema

```typescript
interface MilestoneCreatorOutput {
  milestones: Milestone[];
  dependencies: Dependency[];
  criticalPath: Milestone[];
}
```

#### Example Prompt

```
Create implementation milestones for the architecture:
{architecture}

Each milestone should:
- Have a clear deliverable
- Be independently testable
- Have defined dependencies
- Follow logical order
```

---

### 3. plan-writer

**Purpose**: Creates formatted plan.md files.

#### Metadata

| Property | Value |
|----------|-------|
| Skill ID | `plan-writer` |
| Agent | `planner` |
| Category | `documentation` |

#### Input Schema

```typescript
interface PlanWriterInput {
  architecture: Architecture;
  milestones: Milestone[];
  template: string;
}
```

#### Output Schema

```typescript
interface PlanWriterOutput {
  filePath: string;
  content: string;
}
```

#### Tools Used

| Tool | Purpose |
|------|---------|
| `Read` | Read plan template |
| `Write` | Write plan.md file |

---

### 4. tech-stack-selector

**Purpose**: Recommends appropriate technologies based on requirements.

#### Metadata

| Property | Value |
|----------|-------|
| Skill ID | `tech-stack-selector` |
| Agent | `planner` |
| Category | `decision` |

#### Input Schema

```typescript
interface TechStackSelectorInput {
  requirements: Requirement[];
  constraints: Constraint[];
  preferences?: Preference[];
}
```

#### Output Schema

```typescript
interface TechStackSelectorOutput {
  frontend: TechChoice;
  backend: TechChoice;
  database: TechChoice;
  deployment: TechChoice;
  reasoning: string[];
}
```

#### Example Prompt

```
Select the appropriate tech stack for:
{requirements}

Constraints:
{constraints}

Consider:
- Team expertise
- Scalability needs
- Time to market
- Long-term maintainability

Provide reasoning for each choice.
```

---

## Contracts Agent Skills

### 1. openapi-writer

**Purpose**: Creates OpenAPI/YAML specifications for APIs.

#### Metadata

| Property | Value |
|----------|-------|
| Skill ID | `openapi-writer` |
| Agent | `contracts` |
| Category | `api-design` |

#### Input Schema

```typescript
interface OpenAPIWriterInput {
  endpoints: Endpoint[];
  schemas: Schema[];
  securitySchemes: SecurityScheme[];
}
```

#### Output Schema

```typescript
interface OpenAPIWriterOutput {
  filePath: string;
  content: string;
  version: string;
}
```

#### Tools Used

| Tool | Purpose |
|------|---------|
| `Write` | Write YAML files |
| `Read` | Read existing contracts |

#### Example Prompt

```
Create an OpenAPI 3.0 specification for:

Endpoints:
{endpoints}

Include:
- Request/response schemas
- Authentication requirements
- Error responses
- Examples for each endpoint

Follow RESTful best practices.
```

---

### 2. schema-designer

**Purpose**: Designs database schemas and entity relationships.

#### Metadata

| Property | Value |
|----------|-------|
| Skill ID | `schema-designer` |
| Agent | `contracts` |
| Category | `database` |

#### Input Schema

```typescript
interface SchemaDesignerInput {
  entities: Entity[];
  relationships: Relationship[];
  constraints: Constraint[];
}
```

#### Output Schema

```typescript
interface SchemaDesignerOutput {
  schemas: DatabaseSchema[];
  migrations: Migration[];
  indexes: Index[];
}
```

#### Tools Used

| Tool | Purpose |
|------|---------|
| `Write` | Write schema files |
| `Read` | Read existing schemas |

#### Example Prompt

```
Design database schemas for:
{entities}

Relationships:
{relationships}

Consider:
- Normalization
- Query performance
- Data integrity
- Scalability
```

---

### 3. type-generator

**Purpose**: Generates TypeScript interfaces from schemas.

#### Metadata

| Property | Value |
|----------|-------|
| Skill ID | `type-generator` |
| Agent | `contracts` |
| Category | `typing` |

#### Input Schema

```typescript
interface TypeGeneratorInput {
  schemas: Schema[];
  naming: NamingConvention;
}
```

#### Output Schema

```typescript
interface TypeGeneratorOutput {
  files: TypeFile[];
  exports: Export[];
}
```

#### Tools Used

| Tool | Purpose |
|------|---------|
| `Write` | Write TypeScript files |

#### Example Prompt

```
Generate TypeScript interfaces for:
{schemas}

Naming convention: {naming}

Include:
- JSDoc comments
- Optional/required fields
- Union types where appropriate
- Export statements
```

---

### 4. validation-rules

**Purpose**: Creates Zod validation schemas.

#### Metadata

| Property | Value |
|----------|-------|
| Skill ID | `validation-rules` |
| Agent | `contracts` |
| Category | `validation` |

#### Input Schema

```typescript
interface ValidationRulesInput {
  schemas: Schema[];
  rules: ValidationRule[];
}
```

#### Output Schema

```typescript
interface ValidationRulesOutput {
  zodSchemas: ZodSchema[];
  filePath: string;
}
```

#### Example Prompt

```
Create Zod validation schemas for:
{schemas}

Validation rules:
{rules}

Include:
- All field validations
- Custom error messages
- Transform functions where needed
```

---

## Tasks Agent Skills

### 1. task-breakdown

**Purpose**: Breaks down milestones into granular tasks.

#### Metadata

| Property | Value |
|----------|-------|
| Skill ID | `task-breakdown` |
| Agent | `tasks` |
| Category | `planning` |

#### Input Schema

```typescript
interface TaskBreakdownInput {
  milestones: Milestone[];
  granularity: 'fine' | 'medium' | 'coarse';
}
```

#### Output Schema

```typescript
interface TaskBreakdownOutput {
  tasks: Task[];
  estimatedCount: number;
}
```

#### Example Prompt

```
Break down these milestones into actionable tasks:
{milestones}

Granularity: {granularity}

Each task should:
- Be completable in a single coding session
- Have clear acceptance criteria
- Be independently verifiable
```

---

### 2. dependency-mapper

**Purpose**: Identifies dependencies between tasks.

#### Metadata

| Property | Value |
|----------|-------|
| Skill ID | `dependency-mapper` |
| Agent | `tasks` |
| Category | `analysis` |

#### Input Schema

```typescript
interface DependencyMapperInput {
  tasks: Task[];
}
```

#### Output Schema

```typescript
interface DependencyMapperOutput {
  dependencies: Dependency[];
  parallelizable: Task[][];
  criticalPath: Task[];
}
```

#### Example Prompt

```
Identify dependencies between these tasks:
{tasks}

Determine:
- Which tasks block others
- Which tasks can run in parallel
- The critical path through the tasks
```

---

### 3. priority-setter

**Purpose**: Assigns priorities to tasks based on dependencies and business value.

#### Metadata

| Property | Value |
|----------|-------|
| Skill ID | `priority-setter` |
| Agent | `tasks` |
| Category | `planning` |

#### Input Schema

```typescript
interface PrioritySetterInput {
  tasks: Task[];
  criteria: PriorityCriteria;
}
```

#### Output Schema

```typescript
interface PrioritySetterOutput {
  prioritizedTasks: Task[];
  reasoning: string[];
}
```

---

### 4. tasks-writer

**Purpose**: Creates formatted tasks.md files.

#### Metadata

| Property | Value |
|----------|-------|
| Skill ID | `tasks-writer` |
| Agent | `tasks` |
| Category | `documentation` |

#### Input Schema

```typescript
interface TasksWriterInput {
  tasks: Task[];
  template: string;
}
```

#### Output Schema

```typescript
interface TasksWriterOutput {
  filePath: string;
  content: string;
}
```

#### Tools Used

| Tool | Purpose |
|------|---------|
| `Read` | Read tasks template |
| `Write` | Write tasks.md file |

---

## Frontend Agent Skills

### 1. nextjs-coder

**Purpose**: Writes Next.js pages, components, and routing logic.

#### Metadata

| Property | Value |
|----------|-------|
| Skill ID | `nextjs-coder` |
| Agent | `frontend` |
| Category | `implementation` |

#### Input Schema

```typescript
interface NextJSCoderInput {
  task: Task;
  contracts: Contract[];
  existingComponents?: string[];
}
```

#### Output Schema

```typescript
interface NextJSCoderOutput {
  files: CreatedFile[];
  imports: Import[];
}
```

#### Tools Used

| Tool | Purpose |
|------|---------|
| `Read` | Read existing files |
| `Write` | Create new files |
| `Edit` | Modify existing files |
| `Glob` | Find related files |

#### Example Prompt

```
Implement the following task in Next.js:
{task}

API Contract:
{contracts}

Follow these conventions:
- Use App Router
- Use TypeScript
- Use Tailwind CSS for styling
- Follow existing code patterns
```

---

### 2. react-hooks

**Purpose**: Creates custom React hooks for shared logic.

#### Metadata

| Property | Value |
|----------|-------|
| Skill ID | `react-hooks` |
| Agent | `frontend` |
| Category | `implementation` |

#### Input Schema

```typescript
interface ReactHooksInput {
  hookName: string;
  purpose: string;
  dependencies: string[];
}
```

#### Output Schema

```typescript
interface ReactHooksOutput {
  filePath: string;
  content: string;
  tests: string;
}
```

#### Example Prompt

```
Create a custom React hook:
Name: {hookName}
Purpose: {purpose}

Include:
- TypeScript types
- Error handling
- Loading states
- Cleanup on unmount
```

---

### 3. state-management

**Purpose**: Implements client-side state management.

#### Metadata

| Property | Value |
|----------|-------|
| Skill ID | `state-management` |
| Agent | `frontend` |
| Category | `implementation` |

#### Input Schema

```typescript
interface StateManagementInput {
  storeName: string;
  stateShape: StateShape;
  actions: Action[];
}
```

#### Output Schema

```typescript
interface StateManagementOutput {
  storeFile: string;
  hookFile: string;
}
```

#### Example Prompt

```
Create a Zustand store:
Name: {storeName}
State shape: {stateShape}
Actions: {actions}

Include:
- TypeScript types
- Persist middleware if needed
- DevTools integration
```

---

### 4. api-integration

**Purpose**: Connects frontend to backend APIs.

#### Metadata

| Property | Value |
|----------|-------|
| Skill ID | `api-integration` |
| Agent | `frontend` |
| Category | `integration` |

#### Input Schema

```typescript
interface APIIntegrationInput {
  endpoints: Endpoint[];
  baseUrl: string;
  authMethod: AuthMethod;
}
```

#### Output Schema

```typescript
interface APIIntegrationOutput {
  serviceFile: string;
  types: string;
}
```

#### Example Prompt

```
Create API service functions for:
{endpoints}

Base URL: {baseUrl}
Auth: {authMethod}

Include:
- Error handling
- Request/response types
- Auth header injection
- Request cancellation
```

---

### 5. form-builder

**Purpose**: Creates forms with validation.

#### Metadata

| Property | Value |
|----------|-------|
| Skill ID | `form-builder` |
| Agent | `frontend` |
| Category | `implementation` |

#### Input Schema

```typescript
interface FormBuilderInput {
  formName: string;
  fields: Field[];
  validationSchema: ZodSchema;
  onSubmit: string;
}
```

#### Output Schema

```typescript
interface FormBuilderOutput {
  componentFile: string;
  validationFile: string;
}
```

#### Example Prompt

```
Create a form component:
Name: {formName}
Fields: {fields}
Validation: {validationSchema}

Use:
- React Hook Form
- Zod for validation
- Controlled inputs
- Accessible labels
```

---

## Backend Agent Skills

### 1. nestjs-coder

**Purpose**: Writes NestJS modules, controllers, and services.

#### Metadata

| Property | Value |
|----------|-------|
| Skill ID | `nestjs-coder` |
| Agent | `backend` |
| Category | `implementation` |

#### Input Schema

```typescript
interface NestJSCoderInput {
  task: Task;
  contracts: Contract[];
  existingModules?: string[];
}
```

#### Output Schema

```typescript
interface NestJSCoderOutput {
  moduleFile: string;
  controllerFile: string;
  serviceFile: string;
  dtoFiles: string[];
}
```

#### Tools Used

| Tool | Purpose |
|------|---------|
| `Read` | Read existing files |
| `Write` | Create new files |
| `Edit` | Modify existing files |
| `Glob` | Find related files |
| `Bash` | Run NestJS CLI commands |

#### Example Prompt

```
Implement the following task in NestJS:
{task}

API Contract:
{contracts}

Follow these conventions:
- Use TypeScript decorators
- Implement DTOs for validation
- Use dependency injection
- Follow existing module patterns
```

---

### 2. database-ops

**Purpose**: Implements database queries and operations.

#### Metadata

| Property | Value |
|----------|-------|
| Skill ID | `database-ops` |
| Agent | `backend` |
| Category | `implementation` |

#### Input Schema

```typescript
interface DatabaseOpsInput {
  entity: Entity;
  operations: Operation[];
  relations: Relation[];
}
```

#### Output Schema

```typescript
interface DatabaseOpsOutput {
  entityFile: string;
  repositoryFile: string;
  migrationFile: string;
}
```

#### Example Prompt

```
Implement database operations for:
Entity: {entity}
Operations: {operations}
Relations: {relations}

Use TypeORM with:
- Repository pattern
- Query builder for complex queries
- Transactions where needed
- Proper error handling
```

---

### 3. auth-implementer

**Purpose**: Implements authentication and authorization.

#### Metadata

| Property | Value |
|----------|-------|
| Skill ID | `auth-implementer` |
| Agent | `backend` |
| Category | `security` |

#### Input Schema

```typescript
interface AuthImplementerInput {
  authMethod: 'jwt' | 'session' | 'oauth';
  providers?: OAuthProvider[];
  roles: Role[];
}
```

#### Output Schema

```typescript
interface AuthImplementerOutput {
  authModule: string;
  guards: string[];
  strategies: string[];
  decorators: string[];
}
```

#### Example Prompt

```
Implement authentication:
Method: {authMethod}
Providers: {providers}
Roles: {roles}

Include:
- JWT/Session strategy
- Password hashing
- Role-based guards
- Refresh token mechanism
```

---

### 4. api-builder

**Purpose**: Creates REST API endpoints.

#### Metadata

| Property | Value |
|----------|-------|
| Skill ID | `api-builder` |
| Agent | `backend` |
| Category | `implementation` |

#### Input Schema

```typescript
interface APIBuilderInput {
  endpoints: Endpoint[];
  validation: ValidationSchema;
}
```

#### Output Schema

```typescript
interface APIBuilderOutput {
  controllerFile: string;
  dtoFiles: string[];
}
```

---

### 5. middleware-creator

**Purpose**: Creates middleware, guards, and interceptors.

#### Metadata

| Property | Value |
|----------|-------|
| Skill ID | `middleware-creator` |
| Agent | `backend` |
| Category | `implementation` |

#### Input Schema

```typescript
interface MiddlewareCreatorInput {
  type: 'guard' | 'interceptor' | 'middleware' | 'pipe';
  purpose: string;
  logic: string;
}
```

#### Output Schema

```typescript
interface MiddlewareCreatorOutput {
  filePath: string;
  content: string;
}
```

---

## UI/UX Agent Skills

### 1. component-designer

**Purpose**: Creates reusable UI components.

#### Metadata

| Property | Value |
|----------|-------|
| Skill ID | `component-designer` |
| Agent | `ui-ux` |
| Category | `design` |

#### Input Schema

```typescript
interface ComponentDesignerInput {
  componentName: string;
  variants: Variant[];
  props: Prop[];
}
```

#### Output Schema

```typescript
interface ComponentDesignerOutput {
  componentFile: string;
  storybookFile?: string;
}
```

#### Example Prompt

```
Create a reusable UI component:
Name: {componentName}
Variants: {variants}
Props: {props}

Include:
- All variants
- Proper TypeScript props
- Accessibility attributes
- Responsive styling
```

---

### 2. tailwind-styler

**Purpose**: Applies Tailwind CSS styling to components.

#### Metadata

| Property | Value |
|----------|-------|
| Skill ID | `tailwind-styler` |
| Agent | `ui-ux` |
| Category | `styling` |

#### Input Schema

```typescript
interface TailwindStylerInput {
  component: string;
  designSpecs: DesignSpec;
  theme: Theme;
}
```

#### Output Schema

```typescript
interface TailwindStylerOutput {
  styledComponent: string;
  customClasses?: string[];
}
```

---

### 3. responsive-design

**Purpose**: Ensures components work across all screen sizes.

#### Metadata

| Property | Value |
|----------|-------|
| Skill ID | `responsive-design` |
| Agent | `ui-ux` |
| Category | `styling` |

#### Input Schema

```typescript
interface ResponsiveDesignInput {
  component: string;
  breakpoints: Breakpoint[];
}
```

#### Output Schema

```typescript
interface ResponsiveDesignOutput {
  responsiveComponent: string;
  breakpointStyles: BreakpointStyle[];
}
```

---

### 4. accessibility-checker

**Purpose**: Ensures WCAG compliance.

#### Metadata

| Property | Value |
|----------|-------|
| Skill ID | `accessibility-checker` |
| Agent | `ui-ux` |
| Category | `quality` |

#### Input Schema

```typescript
interface AccessibilityCheckerInput {
  component: string;
  wcagLevel: 'A' | 'AA' | 'AAA';
}
```

#### Output Schema

```typescript
interface AccessibilityCheckerOutput {
  issues: A11yIssue[];
  suggestions: Suggestion[];
  score: number;
}
```

---

### 5. design-system

**Purpose**: Maintains design tokens and system consistency.

#### Metadata

| Property | Value |
|----------|-------|
| Skill ID | `design-system` |
| Agent | `ui-ux` |
| Category | `design` |

#### Input Schema

```typescript
interface DesignSystemInput {
  operation: 'create' | 'update' | 'validate';
  tokens?: DesignToken[];
}
```

#### Output Schema

```typescript
interface DesignSystemOutput {
  tokensFile: string;
  tailwindConfig: string;
  documentation: string;
}
```

---

## Tester Agent Skills

### 1. unit-tester

**Purpose**: Writes Jest unit tests.

#### Metadata

| Property | Value |
|----------|-------|
| Skill ID | `unit-tester` |
| Agent | `tester` |
| Category | `testing` |

#### Input Schema

```typescript
interface UnitTesterInput {
  targetFile: string;
  coverage: 'minimal' | 'standard' | 'comprehensive';
}
```

#### Output Schema

```typescript
interface UnitTesterOutput {
  testFile: string;
  testCount: number;
  coverage: number;
}
```

#### Tools Used

| Tool | Purpose |
|------|---------|
| `Read` | Read source files |
| `Write` | Create test files |
| `Bash` | Run tests |

#### Example Prompt

```
Write unit tests for:
{targetFile}

Coverage level: {coverage}

Include tests for:
- Happy path scenarios
- Edge cases
- Error handling
- Boundary conditions
```

---

### 2. e2e-tester

**Purpose**: Writes Playwright E2E tests.

#### Metadata

| Property | Value |
|----------|-------|
| Skill ID | `e2e-tester` |
| Agent | `tester` |
| Category | `testing` |

#### Input Schema

```typescript
interface E2ETesterInput {
  userFlows: UserFlow[];
  baseUrl: string;
}
```

#### Output Schema

```typescript
interface E2ETesterOutput {
  testFiles: string[];
  pageObjects: string[];
}
```

#### Example Prompt

```
Write Playwright E2E tests for:
{userFlows}

Base URL: {baseUrl}

Include:
- Page object pattern
- Data-testid selectors
- Visual regression (optional)
- Multiple browser support
```

---

### 3. api-tester

**Purpose**: Tests REST API endpoints.

#### Metadata

| Property | Value |
|----------|-------|
| Skill ID | `api-tester` |
| Agent | `tester` |
| Category | `testing` |

#### Input Schema

```typescript
interface APITesterInput {
  endpoints: Endpoint[];
  baseUrl: string;
  auth?: AuthConfig;
}
```

#### Output Schema

```typescript
interface APITesterOutput {
  testFile: string;
  testCount: number;
}
```

---

### 4. contract-validator

**Purpose**: Validates implementation against OpenAPI contracts.

#### Metadata

| Property | Value |
|----------|-------|
| Skill ID | `contract-validator` |
| Agent | `tester` |
| Category | `validation` |

#### Input Schema

```typescript
interface ContractValidatorInput {
  contractFile: string;
  implementationUrl: string;
}
```

#### Output Schema

```typescript
interface ContractValidatorOutput {
  valid: boolean;
  violations: Violation[];
  coverage: ContractCoverage;
}
```

---

### 5. coverage-reporter

**Purpose**: Generates test coverage reports.

#### Metadata

| Property | Value |
|----------|-------|
| Skill ID | `coverage-reporter` |
| Agent | `tester` |
| Category | `reporting` |

#### Input Schema

```typescript
interface CoverageReporterInput {
  testResults: TestResult[];
  threshold: number;
}
```

#### Output Schema

```typescript
interface CoverageReporterOutput {
  report: CoverageReport;
  passed: boolean;
  uncoveredLines: UncoveredLine[];
}
```

---

## GitHub Agent Skills

### 1. branch-manager

**Purpose**: Creates and manages Git branches.

#### Metadata

| Property | Value |
|----------|-------|
| Skill ID | `branch-manager` |
| Agent | `github` |
| Category | `version-control` |

#### Input Schema

```typescript
interface BranchManagerInput {
  operation: 'create' | 'switch' | 'delete' | 'list';
  branchName?: string;
  baseBranch?: string;
}
```

#### Output Schema

```typescript
interface BranchManagerOutput {
  success: boolean;
  currentBranch: string;
  branches?: string[];
}
```

#### Tools Used

| Tool | Purpose |
|------|---------|
| `Bash` | Run git commands |

#### Example Prompt

```
Manage Git branch:
Operation: {operation}
Branch: {branchName}
Base: {baseBranch}

Follow naming convention: {convention}
```

---

### 2. commit-creator

**Purpose**: Creates semantic commits.

#### Metadata

| Property | Value |
|----------|-------|
| Skill ID | `commit-creator` |
| Agent | `github` |
| Category | `version-control` |

#### Input Schema

```typescript
interface CommitCreatorInput {
  files: string[];
  type: 'feat' | 'fix' | 'refactor' | 'docs' | 'test' | 'chore';
  scope?: string;
  description: string;
  body?: string;
}
```

#### Output Schema

```typescript
interface CommitCreatorOutput {
  commitHash: string;
  message: string;
}
```

#### Example Prompt

```
Create a commit:
Type: {type}
Scope: {scope}
Description: {description}

Follow Conventional Commits format.
```

---

### 3. pr-creator

**Purpose**: Opens pull requests.

#### Metadata

| Property | Value |
|----------|-------|
| Skill ID | `pr-creator` |
| Agent | `github` |
| Category | `collaboration` |

#### Input Schema

```typescript
interface PRCreatorInput {
  title: string;
  body: string;
  baseBranch: string;
  labels?: string[];
  reviewers?: string[];
}
```

#### Output Schema

```typescript
interface PRCreatorOutput {
  prUrl: string;
  prNumber: number;
}
```

#### Tools Used

| Tool | Purpose |
|------|---------|
| `Bash` | Run gh CLI commands |

---

### 4. merge-handler

**Purpose**: Handles PR merges.

#### Metadata

| Property | Value |
|----------|-------|
| Skill ID | `merge-handler` |
| Agent | `github` |
| Category | `version-control` |

#### Input Schema

```typescript
interface MergeHandlerInput {
  prNumber: number;
  mergeMethod: 'merge' | 'squash' | 'rebase';
}
```

#### Output Schema

```typescript
interface MergeHandlerOutput {
  success: boolean;
  mergeCommit: string;
}
```

---

### 5. conflict-resolver

**Purpose**: Resolves merge conflicts.

#### Metadata

| Property | Value |
|----------|-------|
| Skill ID | `conflict-resolver` |
| Agent | `github` |
| Category | `version-control` |

#### Input Schema

```typescript
interface ConflictResolverInput {
  conflictedFiles: string[];
  preferredVersion: 'ours' | 'theirs' | 'manual';
}
```

#### Output Schema

```typescript
interface ConflictResolverOutput {
  resolvedFiles: string[];
  manualReviewNeeded: string[];
}
```

---

## Vercel Agent Skills

### 1. deployer

**Purpose**: Triggers Vercel deployments.

#### Metadata

| Property | Value |
|----------|-------|
| Skill ID | `deployer` |
| Agent | `vercel` |
| Category | `deployment` |

#### Input Schema

```typescript
interface DeployerInput {
  environment: 'production' | 'preview';
  branch?: string;
}
```

#### Output Schema

```typescript
interface DeployerOutput {
  deploymentUrl: string;
  deploymentId: string;
  status: DeploymentStatus;
}
```

#### Tools Used

| Tool | Purpose |
|------|---------|
| `Bash` | Run vercel CLI commands |

---

### 2. env-manager

**Purpose**: Manages environment variables.

#### Metadata

| Property | Value |
|----------|-------|
| Skill ID | `env-manager` |
| Agent | `vercel` |
| Category | `configuration` |

#### Input Schema

```typescript
interface EnvManagerInput {
  operation: 'list' | 'add' | 'remove' | 'update';
  environment: 'production' | 'preview' | 'development';
  variables?: EnvVariable[];
}
```

#### Output Schema

```typescript
interface EnvManagerOutput {
  success: boolean;
  variables: EnvVariable[];
}
```

---

### 3. preview-creator

**Purpose**: Creates preview deployments.

#### Metadata

| Property | Value |
|----------|-------|
| Skill ID | `preview-creator` |
| Agent | `vercel` |
| Category | `deployment` |

#### Input Schema

```typescript
interface PreviewCreatorInput {
  branch: string;
  comment?: string;
}
```

#### Output Schema

```typescript
interface PreviewCreatorOutput {
  previewUrl: string;
  expiresAt?: Date;
}
```

---

### 4. domain-manager

**Purpose**: Configures custom domains.

#### Metadata

| Property | Value |
|----------|-------|
| Skill ID | `domain-manager` |
| Agent | `vercel` |
| Category | `configuration` |

#### Input Schema

```typescript
interface DomainManagerInput {
  operation: 'add' | 'remove' | 'verify';
  domain: string;
}
```

#### Output Schema

```typescript
interface DomainManagerOutput {
  success: boolean;
  dnsRecords?: DNSRecord[];
  verified: boolean;
}
```

---

### 5. logs-reader

**Purpose**: Reads deployment and runtime logs.

#### Metadata

| Property | Value |
|----------|-------|
| Skill ID | `logs-reader` |
| Agent | `vercel` |
| Category | `monitoring` |

#### Input Schema

```typescript
interface LogsReaderInput {
  deploymentId?: string;
  logType: 'build' | 'runtime' | 'edge';
  tail?: number;
}
```

#### Output Schema

```typescript
interface LogsReaderOutput {
  logs: LogEntry[];
  errors: ErrorLog[];
}
```

---

## Skill Invocation

### Invocation Format

```typescript
interface SkillInvocation {
  skillId: string;
  input: any;
  context: SharedContext;
  timeout?: number;
}
```

### Example

```json
{
  "skillId": "nextjs-coder",
  "input": {
    "task": {
      "id": "FE-001",
      "title": "Create LoginForm component"
    },
    "contracts": ["specs/001-auth-user-access/contracts/auth.yaml"]
  },
  "context": {
    "specId": "001-auth-user-access",
    "currentPhase": "implementation"
  }
}
```

---

## Best Practices

### 1. Skill Composition

- Combine multiple skills for complex tasks
- Use output of one skill as input to another
- Maintain loose coupling between skills

### 2. Error Handling

- Always validate input before processing
- Return meaningful error messages
- Allow graceful degradation

### 3. Tool Usage

- Use the most appropriate tool for each operation
- Minimize tool calls by batching operations
- Cache results when possible

### 4. Context Management

- Pass only necessary context to skills
- Update shared context after significant operations
- Clean up temporary data

---

## Summary

| Agent | Skills | Total |
|-------|--------|-------|
| Orchestrator | workflow-manager, state-tracker, error-handler, context-manager | 4 |
| Spec | requirement-gatherer, spec-writer, clarification-asker | 3 |
| Planner | architecture-designer, milestone-creator, plan-writer, tech-stack-selector | 4 |
| Contracts | openapi-writer, schema-designer, type-generator, validation-rules | 4 |
| Tasks | task-breakdown, dependency-mapper, priority-setter, tasks-writer | 4 |
| Frontend | nextjs-coder, react-hooks, state-management, api-integration, form-builder | 5 |
| Backend | nestjs-coder, database-ops, auth-implementer, api-builder, middleware-creator | 5 |
| UI/UX | component-designer, tailwind-styler, responsive-design, accessibility-checker, design-system | 5 |
| Tester | unit-tester, e2e-tester, api-tester, contract-validator, coverage-reporter | 5 |
| GitHub | branch-manager, commit-creator, pr-creator, merge-handler, conflict-resolver | 5 |
| Vercel | deployer, env-manager, preview-creator, domain-manager, logs-reader | 5 |
| **Total** | | **49** |

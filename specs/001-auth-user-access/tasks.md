# Tasks: Authentication and User Access

**Input**: Design documents from `/home/ali/spec-project/specs/001-auth-user-access/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Tests are included based on the research document's recommendations.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `backend/src/`, `frontend/src/`
- Paths shown below assume this web app structure.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create project structure for backend and frontend directories.
- [x] T002 Initialize backend NestJS/Express project in `backend/`.
- [x] T003 Initialize frontend Next.js project in `frontend/`.
- [x] T004 [P] Configure shared ESLint, Prettier, and TypeScript settings for both projects.
- [ ] T005 [P] Setup Git repository and initial commit.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T006 Setup PostgreSQL database and ORM (e.g., TypeORM/Prisma) in `backend/`.
- [ ] T007 Implement basic user authentication module (JWT generation, token validation) in `backend/src/auth/`.
- [ ] T008 [P] Configure password hashing library in `backend/src/utils/`.
- [ ] T009 [P] Implement base error handling and logging middleware in `backend/src/middleware/`.
- [ ] T010 [P] Setup Jest for backend unit/integration tests (`backend/tests/`).
- [ ] T011 [P] Setup Jest and Testing Library for frontend unit/integration tests (`frontend/tests/`).
- [ ] T012 [P] Setup Cypress/Playwright for E2E tests (`e2e/`).

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - User Registration (Priority: P1) 🎯 MVP

**Goal**: Enable new users to register with email and password to access Meetra AI.

**Independent Test**: A new user can successfully register and receive confirmation through the UI.

### Tests for User Story 1

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T013 [P] [US1] Write unit tests for User entity/model in `backend/tests/models/user.entity.spec.ts`.
- [ ] T014 [P] [US1] Write unit tests for user registration service in `backend/tests/services/user.service.spec.ts`.
- [ ] T015 [P] [US1] Write integration test for `POST /auth/register` endpoint in `backend/tests/controllers/auth.controller.spec.ts`.
- [ ] T016 [P] [US1] Write integration tests for registration UI component in `frontend/tests/components/auth/RegisterForm.spec.tsx`.
- [ ] T017 [P] [US1] Write E2E test for user registration flow.

### Implementation for User Story 1

- [ ] T018 [P] [US1] Create User entity/model in `backend/src/models/user.entity.ts`.
- [ ] T019 [US1] Create user registration service in `backend/src/services/user.service.ts`.
- [ ] T020 [US1] Implement `POST /auth/register` API endpoint in `backend/src/controllers/auth.controller.ts`.
- [ ] T021 [US1] Design and implement registration UI component in `frontend/src/components/auth/RegisterForm.tsx`.
- [ ] T022 [US1] Integrate registration form with backend API in `frontend/src/pages/register.tsx`.

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - User Login (Priority: P1)

**Goal**: Enable registered users to log in using email/password or Google OAuth.

**Independent Test**: A registered user can successfully log in using either email/password or Google OAuth through the UI.

### Tests for User Story 2

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T023 [P] [US2] Write unit tests for user login service in `backend/tests/services/auth.service.spec.ts`.
- [ ] T024 [P] [US2] Write integration tests for `POST /auth/login/email` endpoint in `backend/tests/controllers/auth.controller.spec.ts`.
- [ ] T025 [P] [US2] Write integration tests for Google OAuth endpoints in `backend/tests/controllers/auth.controller.spec.ts`.
- [ ] T026 [P] [US2] Write integration tests for login UI component in `frontend/tests/components/auth/LoginForm.spec.tsx`.
- [ ] T027 [P] [US2] Write E2E test for user login flow (email/password and Google OAuth).

### Implementation for User Story 2

- [ ] T028 [US2] Implement user login service (email/password) in `backend/src/services/auth.service.ts`.
- [ ] T029 [US2] Implement `POST /auth/login/email` API endpoint in `backend/src/controllers/auth.controller.ts`.
- [ ] T030 [US2] Integrate Google OAuth logic in `backend/src/auth/google.strategy.ts`.
- [ ] T031 [US2] Implement `GET /auth/login/google` and `GET /auth/login/google/callback` API endpoints in `backend/src/controllers/auth.controller.ts`.
- [ ] T032 [US2] Design and implement login UI component in `frontend/src/components/auth/LoginForm.tsx`.
- [ ] T033 [US2] Integrate login form (email/password and Google OAuth) with backend API in `frontend/src/pages/login.tsx`.

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Guest Access (Priority: P2)

**Goal**: Allow guests to join a meeting via an invite link without requiring an account.

**Independent Test**: A user can successfully join a meeting as a guest using an invite link through the UI.

### Tests for User Story 3

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T034 [P] [US3] Write unit tests for GuestSession entity/model in `backend/tests/models/guest.entity.spec.ts`.
- [ ] T035 [P] [US3] Write unit tests for guest session service in `backend/tests/services/guest.service.spec.ts`.
- [ ] T036 [P] [US3] Write integration test for `POST /guest/join` endpoint in `backend/tests/controllers/guest.controller.spec.ts`.
- [ ] T037 [P] [US3] Write integration tests for guest join UI component in `frontend/tests/components/meeting/JoinAsGuest.spec.tsx`.
- [ ] T038 [P] [US3] Write E2E test for guest join flow.

### Implementation for User Story 3

- [ ] T039 [P] [US3] Create GuestSession entity/model in `backend/src/models/guest.entity.ts`.
- [ ] T040 [US3] Implement guest session service in `backend/src/services/guest.service.ts`.
- [ ] T041 [US3] Implement `POST /guest/join` API endpoint in `backend/src/controllers/guest.controller.ts`.
- [ ] T042 [US3] Design and implement UI for joining as guest in `frontend/src/components/meeting/JoinAsGuest.tsx`.
- [ ] T043 [US3] Integrate guest join UI with backend API in `frontend/src/pages/join/[meetingId].tsx`.

**Checkpoint**: All user stories should now be independently functional

---

## Final Phase: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T044 [P] Update API documentation (`contracts/auth.yaml`) with detailed examples and descriptions.
- [ ] T045 [P] Implement secure token storage strategy on frontend (e.g., HttpOnly cookies, refresh token mechanism).
- [ ] T046 Refine error handling and user feedback across all auth flows.
- [ ] T047 Optimize database queries and API responses for performance.
- [ ] T048 Review and improve security aspects (e.g., rate limiting, input sanitization).
- [ ] T049 Update quickstart guide with deployment instructions.
- [ ] T050 Conduct accessibility audit for all auth-related UI components.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Final Phase (Polish)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) - May integrate with US1 but should be independently testable
- **User Story 3 (P2)**: Can start after Foundational (Phase 2) - May integrate with US1/US2 but should be independently testable

### Within Each User Story

- Tests (if included) MUST be written and FAIL before implementation
- Models before services
- Services before endpoints
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, User Story 1 and User Story 2 can start in parallel (if team capacity allows). User Story 3 can start after Foundational but has lower priority.
- All tests for a user story marked [P] can run in parallel
- Models within a story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together:
Task: "Write unit tests for User entity/model in backend/tests/models/user.entity.spec.ts"
Task: "Write unit tests for user registration service in backend/tests/services/user.service.spec.ts"
Task: "Write integration test for POST /auth/register endpoint in backend/tests/controllers/auth.controller.spec.ts"
Task: "Write integration tests for registration UI component in frontend/tests/components/auth/RegisterForm.spec.tsx"
Task: "Write E2E test for user registration flow."

# Launch parallel implementation tasks for User Story 1:
Task: "Create User entity/model in backend/src/models/user.entity.ts"
Task: "Design and implement registration UI component in frontend/src/components/auth/RegisterForm.tsx"
```

---

## Parallel Example: User Story 2

```bash
# Launch all tests for User Story 2 together:
Task: "Write unit tests for user login service in backend/tests/services/auth.service.spec.ts"
Task: "Write integration tests for POST /auth/login/email endpoint in backend/tests/controllers/auth.controller.spec.ts"
Task: "Write integration tests for Google OAuth endpoints in backend/tests/controllers/auth.controller.spec.ts"
Task: "Write integration tests for login UI component in frontend/tests/components/auth/LoginForm.spec.tsx"
Task: "Write E2E test for user login flow (email/password and Google OAuth)."

# Launch parallel implementation tasks for User Story 2:
Task: "Design and implement login UI component in frontend/src/components/auth/LoginForm.tsx"
```

---

## Parallel Example: User Story 3

```bash
# Launch all tests for User Story 3 together:
Task: "Write unit tests for GuestSession entity/model in backend/tests/models/guest.entity.spec.ts"
Task: "Write unit tests for guest session service in backend/tests/services/guest.service.spec.ts"
Task: "Write integration test for POST /guest/join endpoint in backend/tests/controllers/guest.controller.spec.ts"
Task: "Write integration tests for guest join UI component in frontend/tests/components/meeting/JoinAsGuest.spec.tsx"
Task: "Write E2E test for guest join flow."

# Launch parallel implementation tasks for User Story 3:
Task: "Create GuestSession entity/model in backend/src/models/guest.entity.ts"
Task: "Design and implement UI for joining as guest in frontend/src/components/meeting/JoinAsGuest.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1.  Complete Phase 1: Setup
2.  Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3.  Complete Phase 3: User Story 1
4.  **STOP and VALIDATE**: Test User Story 1 independently
5.  Deploy/demo if ready

### Incremental Delivery

1.  Complete Setup + Foundational → Foundation ready
2.  Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3.  Add User Story 2 → Test independently → Deploy/Demo
4.  Add User Story 3 → Test independently → Deploy/Demo
5.  Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1.  Team completes Setup + Foundational together
2.  Once Foundational is done:
    -   Developer A: User Story 1
    -   Developer B: User Story 2
    -   Developer C: User Story 3
3.  Stories complete and integrate independently

---

## Notes

-   [P] tasks = different files, no dependencies
-   [Story] label maps task to specific user story for traceability
-   Each user story should be independently completable and testable
-   Verify tests fail before implementing
-   Commit after each task or logical group
-   Stop at any checkpoint to validate story independently
-   Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence

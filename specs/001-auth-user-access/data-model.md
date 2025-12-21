# Data Model: Authentication and User Access

**Date**: 2025-12-21
**Feature**: [specs/001-auth-user-access/spec.md](specs/001-auth-user-access/spec.md)

## Entities

### User

Represents a registered user in the system.

-   `id`: UUID (Primary Key)
-   `email`: string (Unique, Indexed, required)
-   `passwordHash`: string (required, stores hashed password)
-   `googleOAuthId`: string (Unique, Indexed, Nullable, stores Google's user ID)
-   `createdAt`: timestamp (required)
-   `updatedAt`: timestamp (required)

**Validation Rules**:
-   `email`: Must be a valid email format.
-   `passwordHash`: Must be generated from a password meeting validation rules (e.g., min length, complexity as per FR-002).

**Relationships**:
-   One-to-many with `Meeting` (as host), One-to-many with `GuestSession` (if guest converts to user)

### GuestSession

Represents a temporary, unauthenticated participant in a meeting.

-   `id`: UUID (Primary Key, Guest Session ID)
-   `meetingId`: UUID (Foreign Key to Meeting entity, required)
-   `userId`: UUID (Foreign Key to User entity, Nullable, if guest eventually registers)
-   `expiresAt`: timestamp (required, session expiration time)
-   `createdAt`: timestamp (required)

**Relationships**:
-   Many-to-one with `Meeting`

## Notes

-   Password validation rules (FR-002) should be configurable and robust.
-   Email verification (future-ready) implies a status field or separate entity for verification tokens might be added later.
-   JWT tokens are for authentication/authorization and not a persistent data model entity.
